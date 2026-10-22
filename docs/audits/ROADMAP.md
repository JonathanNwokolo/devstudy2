# DevStudy — Roadmap de Evolução

**Premissa:** 1 mantenedor, custo zero, tempo parcial. Estimativas em semanas de trabalho parcial (~10 h/semana). Cada fase termina em algo **utilizável e publicável** e tem critérios de aceitação verificáveis. Fases posteriores só começam se os critérios da anterior forem atendidos.

**Regra de ouro:** nenhuma feature nova de UI/navegação até a Fase 1 concluída.

---

## Fase 0 — Honestidade e correções rápidas (1 semana)

**Objetivo:** parar de prometer o que não existe e eliminar defeitos baratos.

- [ ] Remover/renomear "65+ Desafios" e "Zero ao Avançado" até serem reais.
- [ ] Corrigir `id="main"` duplicado; adicionar `<h1>`/`<main>`/`<footer>` faltantes (css.html etc.).
- [ ] Remover `role="menubar"`/`menuitem` da navegação.
- [ ] `sandbox` no iframe do editor; trocar `innerHTML` de busca/favoritos por `textContent`.
- [ ] Apagar código morto (`typeWriter`, `showTagDemo`, Ctrl+K "em desenvolvimento").
- [ ] Atualizar README (URL real, MIT, estrutura verdadeira); arquivar `IMPROVEMENTS.md`.
- [ ] Embaralhar opções do quiz (posição da correta aleatória).

**Aceitação:** script de links = 0 erros; 0 IDs duplicados; busca sem execução de HTML injetado (teste manual documentado); README roda do zero.

---

## Fase 1 — Fundação: build, CI, estrutura (2–3 semanas)

**Objetivo:** tornar o projeto sustentável e contribuível.

- [ ] Eleventy (ou equivalente) com layout/nav/head/footer únicos; saída HTML equivalente.
- [ ] `npm run dev|build|test`; deploy Vercel documentado.
- [ ] Prism/fontes self-host, `defer`, remover `setTimeout(…,500)`; destaque em build se viável.
- [ ] JS em módulos ES; um dono por feature; eliminar duplicatas `script.js`/`advanced-navigation.js`.
- [x] ~~Busca com índice global gerado em build.~~ Removida: o projeto não terá busca (decisão do mantenedor).
- [ ] CI: html-validate, links, axe (rotas principais), Prettier.
- [ ] CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, templates, labels.
- [ ] `robots.txt`, `sitemap.xml`, `404.html`, `og:image`, canonical.

**Aceitação:** adicionar uma página exige tocar **1** arquivo de conteúdo; CI verde em `main` e bloqueia PR quebrado; axe sem violações críticas nas 6 páginas principais; Lighthouse (rodado pelo mantenedor, mobile) ≥ 90 em Performance e Acessibilidade na home *(meta; medir antes e depois)*.

---

## Fase 2 — Prática: exercícios e progresso (4–6 semanas)

**Objetivo:** transformar leitura em prática com feedback — o diferencial central.

- [ ] Módulo `storage` versionado + export/import de progresso.
- [ ] Motor de exercícios: formato JSON (enunciado, `starterCode`, testes, dicas); runner em Web Worker com timeout; editor leve (textarea com realce ou CodeMirror 6 sob demanda).
- [ ] Exercícios HTML/CSS com verificação por DOM (iframe sandbox).
- [ ] 30 exercícios de qualidade (10 JS básico, 10 DOM/HTML/CSS, 10 array/funções), revisados por pelo menos 1 pessoa além do autor.
- [ ] Mensagens de feedback em pt-BR; "dica 1/2/3" progressiva.
- [ ] Roadmap vira trilha com estado ("Continuar de onde parou").
- [ ] Quiz migrado para JSON com ids estáveis; ≥ 100 questões em ≥ 10 temas; resultado persistido.

**Aceitação:** usuário completa um exercício e recarrega a página mantendo o estado; loop infinito no código do usuário não trava a aba (teste automatizado); 30 exercícios com testes passando contra solução de referência em CI; tempo médio da home ao 1º exercício concluído < 2 min em teste com 5 pessoas.

---

## Fase 3 — Retenção (3–4 semanas)

- [ ] Revisão espaçada local (SM-2 simplificado) sobre questões e exercícios errados.
- [ ] Sessão "10 minutos": 1 revisão + 1 exercício; streak simples.
- [ ] "Decodificador de erros" (tabela de padrões; cola erro → explicação pt-BR); 40 erros iniciais.
- [ ] Glossário com tooltips no texto.

**Aceitação:** SRS agenda corretamente revisões (testes unitários dos intervalos); ≥ 40 erros mapeados com teste; **meta de produto:** ≥ 20% dos usuários de teste voltam em 7 dias (medido em grupo piloto de ≥ 20 pessoas, opt-in; se < 10%, revisar antes de avançar).

---

## Fase 4 — Projetos e comunidade (contínuo)

- [ ] 3–5 projetos guiados (ex.: página pessoal, lista de tarefas, consumo de API) com checklist e verificações automáticas parciais.
- [ ] Trilha "Sua primeira contribuição" (PR real de 1 linha no DevStudy).
- [ ] PWA/offline por trilha.
- [ ] Revisão por pares: 2–3 revisores de conteúdo recorrentes.

**Aceitação:** ≥ 5 PRs externos mesclados em 3 meses; projeto com critérios publicados e verificação mínima; PWA instalável e funcional offline para 1 trilha completa.

---

## Fora do roadmap (rejeitado, com motivo)

| Item | Motivo |
|---|---|
| Migrar para React/Next | Sem problema que resolva; custo e risco altos (ver `ARCHITECTURE_DECISION.md`). |
| Contas, ranking, backend próprio | LGPD, segurança, custo operacional sem demanda comprovada. |
| IA via API paga / LLM local no navegador | Custo/peso desproporcionais; risco de erro didático. Reavaliar com dados. |
| Fórum/chat próprio | Usar GitHub Discussions. |
| Novas páginas de conteúdo "amplas" (mais linguagens/frameworks) | Dilui; priorizar profundidade + prática do núcleo web. |
| Gamificação elaborada (níveis, moedas, conquistas) | Só streak/marcos honestos; ver histórico do projeto (conquistas removidas por não existirem). |

## Riscos transversais

1. **Disponibilidade do mantenedor** → manter escopo de cada fase pequeno; publicar a cada marco.
2. **Qualidade do conteúdo** → revisão obrigatória; exercícios com solução de referência em CI.
3. **Execução de código** → timeout + sandbox; testes de abuso (loop infinito, alocação grande).
4. **Escopo** → critérios de aceitação acima são portões, não sugestões.

## Primeiras 3 fases (resposta curta)

1. **Fase 0** — correções e honestidade (1 sem).
2. **Fase 1** — build/CI/estrutura (2–3 sem).
3. **Fase 2** — exercícios executáveis + progresso persistente (4–6 sem).
