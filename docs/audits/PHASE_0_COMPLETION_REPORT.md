# DevStudy — PHASE 0: Relatório de Conclusão

**Data:** 2026-10-13 · **Base:** commit `3761bfb` (branch `main`) · **Estado:** alterações **não commitadas**, sem push/deploy.

Legenda de evidência: **PASS** = executado e aprovado · **NOT VERIFIED** = não executado ou sem evidência suficiente · **FALHA** = executado e reprovado.

## 1. Veredito: **PARTIAL**

A implementação do escopo da PHASE 0 foi concluída e os testes automatizados passam (172 estáticos + 32 de navegador). Não declaro PASS integral porque:

1. **CI nunca rodou no GitHub** — só validei o equivalente local (`CI=1 npm test`, Chromium baixado pelo Playwright). Resultado remoto: NOT VERIFIED.
2. **Acessibilidade não está auditada por completo**: axe-core ainda reporta violações `serious` (contraste ×5 páginas, regiões roláveis sem foco em `git.html`); leitor de tela, ordem de foco real e contraste completo: NOT VERIFIED.
3. **Descobertas novas que a auditoria não tinha** mostram que o estado real é pior que o documentado: a UI da busca global é inoperante (§6, P1) — **não corrigido** por pertencer à PHASE 1, mas documentado.
4. Itens do roadmap "Fase 0" que **não** estavam no escopo desta tarefa e ficaram pendentes (código morto, embaralhar quiz) — §6.

Nada foi marcado como PASS por intuição; cada PASS abaixo tem comando e saída.

## 2. Problemas corrigidos e evidências

Cada item foi **reproduzido no código original** antes de corrigir (testes escritos primeiro e vistos falhar).

| # | Problema | Evidência antes | Correção | Evidência depois |
|---|---|---|---|---|
| S1 | **Self-XSS em favoritos** (`localStorage` → `innerHTML` + `onclick` inline com `id`). | Teste e2e executou `window.__pwned=true` com favorito adulterado (falhou no baseline). | `renderBookmarks`/`renderSidebarBookmarks` montados com DOM/`textContent`; listener em vez de `onclick`. | `security.spec.js › favoritos › título malicioso…` PASS. |
| S2 | **Self-XSS na busca global** (consulta em `innerHTML`). | Confirmado por leitura (`advanced-navigation.js:308`) e pela auditoria; UI inoperante (ver P1), então exercitado via `performSearch()`. | `textContent` em resultado, categoria e estado vazio. | `busca global › …` (2 testes) PASS. |
| S3 | **Self-XSS não listado na auditoria**: `Toast.show` usava `innerHTML` com a consulta de busca (`cheatsheets.html`, `erros-comuns.html`), e a consulta era usada como `RegExp` sem escape. | Teste e2e: `__pwned === true` nas duas páginas (baseline). Termo `(` também lançava exceção. | `Toast` por DOM/`textContent`; destaque do título por `<mark>` via DOM, sem regex. | `busca de cheatsheets/erros` ×2 PASS; `termo com caracteres de regex não quebra` PASS. |
| S4 | **Iframe do editor ao vivo sem `sandbox`** (mesma origem; `document.write`). | Código do usuário leu `localStorage` do site (teste falhou no baseline). | `sandbox="allow-scripts allow-modals"` (sem `allow-same-origin`), `srcdoc` no lugar de `document.write`, `title` adicionado. | `código do usuário não acessa o localStorage` PASS; `alert()` em snippet continua funcionando PASS; renderização HTML/CSS PASS. |
| S5 | Outros `innerHTML` com texto de página (breadcrumbs ×2). | Leitura: título de seção com `<` seria interpretado como HTML. | DOM/`textContent`. | Teste estático de padrões inseguros PASS. |
| B1 | **Botão de tema não funcionava** (descoberto ao testar persistência): `script.js` chamava `initializeTheme()` em dois `DOMContentLoaded`; os dois listeners se anulavam. | Baseline: `light → light` após clique. | Removida a reinicialização duplicada (9 chamadas). | `tema: alternar persiste…` PASS; teste estático impede reintrodução. |
| H1 | **Promessas não sustentadas**: "Zero ao Avançado" (badge, metas, roadmap, README), "65+ Desafios", "15+ Desafios", "30+ Exemplos" (havia 29), "50+ Comandos" Git (≈22), "50+ Erros" (45 cards), "60+ Códigos" HTTP (≈37), "∞ Horas Salvas", "∞ Repositórios", "100M+ Devs usam Git" (sem fonte), "Guia completo… exercícios". | Medições por script (ver §7 e §3). | Substituídas por números **medidos** (`33 Perguntas no quiz`, `19 Tópicos`, `29 Exemplos de código`, `5 Perguntas no quiz`, `20+`, `40+`, `30+`) ou removidas. | `estatísticas dos heróis batem com o conteúdo medido` PASS; `promessas não sustentadas foram removidas` PASS. |
| H2 | README: URL de clone placeholder, "gamificado" inexistente, estrutura incompleta, MIT omitida. | Leitura. | README reescrito (estado real, limitações, instruções, licença MIT). | Revisão manual; teste anti-promessa cobre `README.md`. |
| H3 | `IMPROVEMENTS.md` com afirmações ("WCAG 2.1 AA", etc.) sem evidência. | Auditoria A14. | Movido para `docs/archive/` com aviso de documento histórico/não verificado. | — |
| A1 | **ARIA incorreta**: `role=menubar/menuitem/menu/none` + `aria-haspopup` na navegação (51 por página). | Teste estático falhou em 23/23. | Removidos nos `<nav class="navbar">` das 23 páginas (nenhum CSS/JS dependia). | PASS 23/23. |
| A2 | `<main>` ausente em 8 páginas; id `main-content` ausente em 13; **skip-link ausente (ou sem alvo válido) em 21 das 23 páginas** e, onde existia, **sem CSS** (visível no fluxo) e não era o 1º elemento focável (index/css). | Testes estáticos; medição (`y:2`, `position:relative`). | `<main id="main-content">` em todas; skip-link como 1º filho do `<body>`; CSS "oculto até foco" (com especificidade para vencer `animations.css`). | 23/23 PASS; e2e `skip-link é o primeiro item focável` e `fica fora da tela até receber foco` PASS. |
| A3 | `css.html` sem `<h1>` e sem `<footer>`. | Teste estático. | `h2.section-hero-title` → `h1` (estilo computado idêntico, verificado) e rodapé padrão. | PASS; screenshot conferido. |
| A4 | Controles sem rótulo (axe **critical**: `label` ×8, `select-name` ×3 em index/css). | axe baseline. | `label for=` / `aria-label` (sem mudança visual). | axe: 0 violações críticas em 8 páginas. |
| A5 | "WCAG 2.1 AA" declarado sem evidência. | `IMPROVEMENTS.md`. | Removido do material ativo; README afirma explicitamente que não há auditoria completa. | Teste anti-claim PASS. |

**Classificação de severidade (conservadora):** S1–S4 são **self-XSS** (só o próprio usuário/`localStorage` do próprio navegador alimenta o sink); nenhuma foi classificada como crítica nem explorada remotamente. A UI da busca (S2) nem chega a executar o sink hoje (P1).

**Falso positivo da auditoria:** `id="main"` duplicado em `erros-comuns.html` está dentro de um exemplo `<pre><code>`, não no DOM real. Nada a corrigir.

## 3. Arquivos alterados e justificativas

Mudanças em **tracked** (`git diff --stat`: 28 arquivos, ~1,8 mil inserções / ~2 mil deleções — a maior parte é a remoção mecânica de ARIA da navegação):

| Arquivo(s) | Justificativa |
|---|---|
| `js/advanced-navigation.js` | S1, S2, S5; `CSS.escape` no seletor de `removeBookmark`. |
| `js/script.js` | S3, S4, S5, B1. |
| `css/styles.css` | CSS do skip-link (+23 linhas). |
| `index.html` | H1, S4 (sandbox/title), A4, skip-link no topo, nav ARIA. |
| `css.html` | A1–A4, meta description. |
| `javascript.html`, `git.html`, `erros-comuns.html`, `http.html`, `roadmap.html` | H1 (estatísticas/texto); nav/landmarks. |
| Demais 17 `*.html` | A1, A2 (nav ARIA, `<main>`, skip-link). |
| `README.md` | H2. |
| `IMPROVEMENTS.md` → `docs/archive/IMPROVEMENTS.md` | H3 (aparece como `D` + `??` até haver commit). |

**Novos arquivos** (todos não rastreados):
`package.json`, `package-lock.json`, `.gitignore`, `playwright.config.js`, `scripts/serve.js`, `scripts/metrics.js`, `tests/static/{helpers,html.test,js.test}.js`, `tests/e2e/{security,flows,a11y}.spec.js`, `.github/workflows/ci.yml`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/{bug,conteudo,config}.yml`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, este relatório.

**Dependências (dev, justificadas):** `@playwright/test` e `@axe-core/playwright`. Justificativa: XSS, `localStorage`, iframe/sandbox e foco só são verificáveis em navegador real; jsdom não reproduz isolamento de origem. Nenhuma dependência de runtime; o site continua sem build. Os testes estáticos usam apenas `node:test`. `npm audit`: 0 vulnerabilidades (`npm ci`, saída "found 0 vulnerabilities").

## 4. Testes executados

Ambiente: Windows 11, Node v24.15.0, npm 11.12.1, Chrome 155 (local) e Chromium headless shell 156 (Playwright, caminho CI).

| Comando | Resultado |
|---|---|
| `npm run test:static` | **PASS** — 172 testes, 0 falhas (23 páginas × metadados, ids únicos, landmarks, skip-link, ARIA, links/âncoras, recursos locais + promessas, estatísticas, sandbox, dados do quiz, padrões inseguros, regressão do tema). |
| `npm run test:e2e` (Chrome local) | **PASS** — 32 testes. |
| `CI=1 npm test` (Chromium do Playwright, mesmo caminho do workflow) | **PASS** — 172 + 32, 0 falhas, ~20 s. Última execução após todas as alterações. |
| Baseline do código original | Testes novos falharam onde esperado: 54 de 166 estáticos (após corrigir um falso positivo do próprio helper de teste; as estatísticas/promessas já estavam corrigidas nessa medição), e no e2e S1, S3 (×2) e S4 (×3); tema `light→light`. |

Nota de estabilidade: em **uma** execução paralela, 2 testes estouraram 30 s (carregamento de Prism/Google Fonts do CDN); a repetição passou. O timeout foi elevado para 45 s e o CI usa `retries: 1`. Dependência de CDN é risco de flakiness (§6).

Cobertura funcional: navegação (links do menu, sem erros de JS em 12 páginas), tema + persistência, quiz (fluxo completo, pontuação, ausência de persistência documentada), favoritos (adicionar/persistir/remover), `erros-comuns` (progresso persistido), busca de cards, editor ao vivo, mobile 375 px (sem overflow em 5 páginas; menu hambúrguer), axe.

## 5. Evidências de validação no navegador

Chrome real (Playwright `channel: chrome`) e Chromium; screenshots inspecionados visualmente:

- **Desktop 1280×800 — `index.html`:** layout idêntico ao original; selo e estatísticas novos (50+ / 80+ / 33); skip-link oculto e **visível com foco** (`git.html`, contorno amarelo).
- **`css.html`:** `h1` com estilo idêntico (comparação de estilo computado h1×h2: igual); rodapé renderizado corretamente.
- **Mobile 375×812 — `index.html`:** sem overflow, hero e estatísticas legíveis.
- **Fluxos manuais via script:** editor ao vivo (HTML+CSS renderizam; `alert()` funciona; `localStorage` inacessível ao snippet).
- **Não realizado:** Firefox, Safari/iOS, dispositivo físico, leitor de tela, comparação visual pixel a pixel (não há teste de regressão visual) → **NOT VERIFIED**.

## 6. Problemas pendentes e riscos residuais

| ID | Item | Estado |
|---|---|---|
| **P1** | **A UI da busca global não funciona em nenhuma página** (descoberta nova): `script.js` redeclara `initializeSearch()` e `initializeKeyboardShortcuts()` e sobrescreve as de `advanced-navigation.js`. Clique na lupa não abre o painel; `Ctrl+K` não faz nada útil na home; atalhos `s/t/b/?` de `advanced-navigation.js` também estão mortos. Medido: painel `visibility:hidden` após clique. **Já era assim no baseline** (a auditoria mostrava o índice, não a UI). | **Não corrigido** (PHASE 1: módulos + índice global). Documentado no README. Corrigir só renomeando funções ressuscitaria código sem revisão e atalhos de tecla — fora do escopo. |
| P2 | Navegação copiada em 23 arquivos; qualquer mudança exige 23 edições. | PHASE 1 (build/includes). |
| P3 | CDN (Prism, Google Fonts) sem SRI e sem CSP; sem self-host. | PHASE 1. |
| P4 | axe `serious`: **color-contrast** (cheatsheets 57, git 53, glossario 32, javascript 17, index 4, css 1 nós) e **scrollable-region-focusable** (git ×23, blocos de código). Corrigir contraste altera paleta/identidade → decisão de design. | Pendente; baseline registrado. |
| P5 | `index.html` tem 2 `<h1>` (o segundo é a demonstração "Título Principal" da tag h1, linha 610). | Pendente (decisão de conteúdo). |
| P6 | Estatísticas não auditadas e **NOT VERIFIED**: `react.html` (35+ Conceitos, 12+ Componentes), `vuejs.html` (30+ Conceitos, 10+ Componentes), `index.html` (50+ Tags — 51 medidas; 80+ Propriedades CSS — 86 medidas, método aproximado), minis de `css.html` ("376+ Propriedades", "500+"), `http.html` ("5 Categorias"). Há ainda texto técnico não revisado por especialista. | Pendente. |
| P7 | Código morto/stubs (`typeWriter`, `showTagDemo`, `initializeAutocomplete` duplicada, Ctrl+K "em desenvolvimento") e `setTimeout(…,500)` no init. | Não tocado; PHASE 1 (fazia parte do roadmap "Fase 0" antigo, mas **não** do escopo desta tarefa). |
| P8 | Embaralhar opções do quiz (resposta nunca é D). | Não feito: "não reconstruir o quiz". |
| P9 | Quiz não persiste resultado; roadmap sem estado (fato documentado, coberto por teste que fixa o comportamento atual). | PHASE 2. |
| P10 | Dependência de CDN nos testes e2e → possível flakiness. | Mitigado (timeout/retry), não eliminado. |
| P11 | `CODE_OF_CONDUCT.md` resume o Contributor Covenant 2.1 com link ao texto oficial (não copiei o texto integral). Contato de denúncia = Security Advisories/GitHub `@JonathanNwokolo`; **nenhum e-mail foi publicado**. Mantenedor deve confirmar. | Decisão do mantenedor. |
| P12 | `SECURITY.md` pressupõe que **Private vulnerability reporting** está habilitado no repositório (Settings → Security). | Ação do mantenedor; NOT VERIFIED. |
| P13 | Terminações de linha mistas no repositório (HTML em LF, JS/CSS em CRLF); `git` avisa conversão. Preservei a convenção de cada arquivo. | Sem ação. |

## 7. Métricas de referência obtidas

**Local, localhost, sem throttling** (`npm run metrics`; não representa campo):

| Página | HTML | Requisições | Transferido | DOMContentLoaded | Load | Nós DOM |
|---|---|---|---|---|---|---|
| index | 120 076 B | 18 | 207 869 B | 531 ms | 599 ms | 1 951 |
| css | 65 398 B | 15 | 232 015 B | 494 ms | 598 ms | 1 234 |
| javascript | 84 670 B | 21 | 349 228 B | 463 ms | 535 ms | 1 486 |
| git | 52 023 B | 21 | 208 280 B | 404 ms | 502 ms | 760 |
| quiz | 14 530 B | 18 | 164 639 B | 320 ms | 381 ms | 201 |
| roadmap | 20 503 B | 18 | 172 168 B | 302 ms | 389 ms | 276 |

**Lighthouse 12.8.2, `index.html`, mobile, throttling simulado, 1 execução, servidor local, CDNs reais** (variação entre execuções não medida — tratar como ordem de grandeza):
Performance **74** · Acessibilidade **97** · Boas práticas **96** · SEO **100** · FCP/LCP 4,4 s · TBT 0 ms · CLS 0. Reprovações: `color-contrast`, `render-blocking-resources`, `unused-css-rules`, `uses-text-compression` (servidor local), `font-size`.
Lighthouse das demais páginas e execuções repetidas: **NOT VERIFIED**.

**axe-core (WCAG 2.0/2.1 A/AA, regras automatizadas), 8 páginas:** 0 `critical` (antes: 2 páginas com `label`/`select-name`); `serious`: ver P4; quiz e roadmap sem violações. *Isto não é conformidade WCAG.*

**Contagens usadas para as correções de H1** (script, reprodutível): quiz 33 questões/7 temas; `javascript.html` 19 `topic-card`, 29 `<pre>`; `git.html` ≈22 subcomandos distintos; `erros-comuns.html` 45 `.erro-card`; `http.html` 37 códigos numéricos distintos.

## 8. Alterações preexistentes preservadas

- Único estado sujo na inspeção inicial: **`docs/` não rastreado** (6 auditorias). **Não foi modificado** (mtimes anteriores à sessão; nenhum comando escreveu lá, exceto este relatório).
- Nenhuma modificação em arquivos rastreados existia antes da PHASE 0.
- Um `git stash` temporário foi usado para medir o baseline do tema; restaurado com `git stash pop` e `git stash list` está vazio.
- Conteúdo, layout e identidade visual preservados; mudanças visuais intencionais: estatísticas/rótulos, remoção de 5 estatísticas infladas em Git/Erros, skip-link agora oculto.

## 9. Confirmação do estado do Git

- Branch `main`, HEAD `3761bfb` — **nenhum commit** criado, **nenhum push**, nenhum deploy.
- 28 arquivos rastreados modificados (um deles, `IMPROVEMENTS.md`, movido), novos arquivos não rastreados listados em §3, `docs/` intacto.
- `git stash list`: vazio. `.gitignore` novo cobre `node_modules/`, `test-results/`, `playwright-report/`.

## 10. Critérios para iniciar a PHASE 1

Obrigatórios:
1. Revisar e commitar a PHASE 0 (por conjuntos: segurança, integridade, a11y/landmarks, infra/testes/docs) e **confirmar o CI verde no GitHub** (hoje NOT VERIFIED).
2. Habilitar *Private vulnerability reporting* e confirmar o contato do Código de Conduta (P11, P12).
3. Decidir o tratamento de contraste (P4) — afeta tokens de design que a PHASE 1 vai consolidar.
4. Congelar novas features de UI (regra de ouro do roadmap).

Primeira tarefa recomendada da PHASE 1, por ordem de dependência: **P1** (consolidar `script.js`/`advanced-navigation.js` em módulos, um dono por feature) → P2 (includes/Eleventy) → busca global com índice gerado em build → P3 (self-host + SRI/CSP) → P7. Os testes desta fase (`tests/e2e/security.spec.js`, `flows.spec.js`) devem continuar verdes como rede de segurança; o teste que fixa "busca global inoperante" via `performSearch()` deverá ser substituído por um teste da UI real quando P1 for resolvido.
