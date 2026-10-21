# DevStudy — Decisão Arquitetural

## Decisão

**Evoluir gradualmente: manter o produto sem framework de UI, adicionar uma camada de build mínima (Vite ou Eleventy) + módulos ES + conteúdo em Markdown/JSON. Não migrar para React/Next.js.**

Em uma linha: *"Estático, pré-renderizado, Vanilla/ES Modules + build leve; ilhas JavaScript apenas onde há interatividade (exercícios, quiz)."*

## 1. Contexto e evidências

| Fato | Fonte |
|---|---|
| 100% estático; 23 HTML, 8 JS (4.337 linhas), zero dependências npm, deploy Vercel | repo |
| O JS **não** está num problema de escala de estado; está num problema de **organização**: funções globais duplicadas entre dois arquivos, stubs, handlers duplicados | `DEVSTUDY_AUDIT.md` A3, A4 |
| O custo de manutenção dominante é **HTML copiado** (nav ×23, 3 variantes) e CSS com `!important` | A2, A12 |
| O estado da aplicação é pequeno: tema, favoritos, progresso, resultados de quiz | localStorage: 3 chaves |
| Conteúdo é a maior parte do valor e é HTML não estruturado | tamanhos |
| Equipe: 1 mantenedor, orçamento zero | histórico git |

**Conclusão técnica:** os problemas observados são de *build-time* (includes, dados, validação), não de *runtime reativo*. Um framework de UI não resolve nenhum deles; só adiciona o seu.

## 2. Alternativas

| Critério | A. Vanilla puro (como está) | **B. Vanilla + build leve (recomendado)** | C. React + Vite (SPA) | D. Next.js/Astro-React |
|---|---|---|---|---|
| Manutenção | Ruim a médio prazo (cópias) | **Boa** (templates, dados) | Boa para UI, **ruim para conteúdo estático** | Boa, mas muita superfície |
| Performance (3G/Android baixo) | Boa (hoje ~220 KB em localhost; sem hidratação) | **Melhor** (self-host, menos JS) | Pior (bundle + hidratação ≥ 150 KB só para React+DOM) | Média; SSG ajuda, mas runtime ainda grande |
| Escala funcional (exercícios, SRS, trilhas) | Difícil sem módulos | **Suficiente**: módulos ES + Web Workers | Excelente para UI complexa | Excelente |
| Experiência de contribuição | Pior: editar HTML gigante | **Boa**: Markdown + dados; zero conhecimento de framework | Exige React | Exige React/Next |
| Testes | Nenhum | **Vitest + Playwright** simples | Mesmo, mais pesado | Mesmo |
| Custo de migração | 0 | **~1–2 semanas, incremental** | 4–8+ semanas, reescrita | 6–10+ semanas |
| Risco de regressão | Alto sem testes | **Baixo** (migra página a página, com CI) | **Alto** (reescrita) | Alto |
| Barreira para iniciante contribuir | Média | **Baixa** | Alta | Alta |
| Infra | Vercel | Vercel/GitHub Pages (R$0) | Vercel | Vercel (cuidado com limites) |

### Por que não React/Next
- **Não há problema que React resolva aqui.** Estado pequeno, páginas majoritariamente estáticas.
- Aumenta a barreira para o público-alvo de contribuidores (estudantes iniciantes que aprendem *HTML/CSS/JS* — o próprio conteúdo do site).
- Custo de reescrita e regressão alto para **zero ganho de usuário** no curto prazo.
- Next exige runtime Node/Edge ou SSG; para site de conteúdo, é custo sem retorno.

### Por que não ficar como está
- Duplicação de nav em 23 arquivos já divergiu em 3 versões (fato).
- Não há como validar PR de forma automática; contribuidores novos não têm onde "ver que funciona".

### Reavaliar framework **quando** (gatilhos objetivos)
- ≥ 3 telas com estado compartilhado complexo (editor + resultados + progresso + SRS simultâneos), **e**
- manutenção dessa UI em vanilla custar mais do que um framework (medido em retrabalho), **ou**
- a base de contribuidores já preferir outra stack.
Se acontecer, candidatos pela relação peso/benefício: **Preact** ou **Svelte** como ilhas (Astro), não Next.

## 3. Arquitetura-alvo

```
src/
  content/
    trilhas/                # YAML/JSON: ordem, pré-requisitos
    licoes/*.md             # frontmatter: id, trilha, duração, nível
    exercicios/*.json       # enunciado, starterCode, tests, hints
    quiz/*.json             # perguntas com id estável
  layouts/ components/      # nav, footer, head (um só lugar)
  js/
    core/    storage.js (versão+migração), theme.js, search.js
    features/ quiz/, exercises/, srs/, simulators/
    workers/ runner.js      # executa código do usuário
  css/ tokens.css base.css components/*.css  # @layer
public/ (fontes, prism self-host, og-images)
scripts/ build-search-index.mjs, validate-content.mjs
tests/ unit/ (Vitest), e2e/ (Playwright + axe)
```

Decisões-chave:
1. **Gerador estático leve:** Eleventy (Markdown + Nunjucks, sem framework) ou Vite + plugin de includes. **Recomendado: Eleventy** — menor curva para contribuidor, HTML puro na saída.
2. **Destaque de sintaxe em build** (Shiki/Prism no Node) → remove 6–9 scripts de CDN por página.
3. **Busca:** índice JSON gerado em build; busca client-side (Fuse/FlexSearch ou 80 linhas próprias).
4. **Execução de código do usuário:** `iframe sandbox="allow-scripts"` com `srcdoc` para HTML/CSS/DOM; **Web Worker** com timeout para testes de JS puro (watchdog para loops infinitos: terminar o Worker após N ms). Nunca `eval` no contexto principal.
5. **Persistência:** módulo `storage` com `schemaVersion`, namespacing (`devstudy:v1:*`), export/import JSON, tratamento de `QuotaExceeded`/modo privado. **Não** usar backend.
6. **PWA:** service worker com cache por trilha (offline-first). Opcional, após exercícios.
7. **Acessibilidade e links no CI** (axe + linkinator) como barreira de PR.

## 4. Estratégia de migração (sem "big bang")

1. **Congelar features de UI** (sem novas páginas até passo 3).
2. Introduzir build **sem alterar HTML de saída**: copiar páginas atuais para `src/` e extrair nav/head/footer para includes. Verificar com diff de HTML (deve ser idêntico, exceto o consolidado).
3. Colocar CI (validação, links, axe) verde.
4. Consolidar JS: remover duplicatas e stubs; trocar `onclick` inline por listeners; `type="module"`.
5. Extrair **dados** (quiz → JSON; trilha → YAML) — antes de construir features novas sobre eles.
6. Só então adicionar features (exercícios, SRS).
Cada passo é um PR independente e reversível.

## 5. Riscos da decisão

- **Mais um build step** para um projeto que era "abra no navegador". Mitigação: `npm run dev` único; saída continua HTML estático.
- **Eleventy/Vite são dependências** (supply chain/desatualização). Mitigação: dependabot; poucas deps; lockfile.
- **Web Worker não é sandbox de segurança completo** (mesma origem). Como não há dados sensíveis/contas, risco aceitável; documentar. Se houver backend/contas no futuro, executar em origem separada.
- **Suposição não validada:** que os contribuidores-alvo toleram Node. Alternativa se falsa: manter conteúdo em Markdown + script `build` com único comando e pré-visualização por Pull Request (Vercel preview).
