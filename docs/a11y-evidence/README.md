# F2.1 — acabamento de acessibilidade

Data: 21/10/2026. Escopo: site local gerado por Eleventy, Chromium, axe-core e inspeção visual.

## Causas e correções

- O roxo legado `#667eea` era usado como texto sobre branco/pastel e como fundo de texto branco pequeno. A camada Playground usa `--play-demo-accent: #5145b5` nos rótulos e links claros e tons apropriados para exemplos com fundo colorido.
- Rótulos de demonstrações didáticas (box model, grid, flex, pseudoestados, cores e simuladores) herdavam texto claro sobre cores vibrantes ou texto fraco sobre pastel. Foram ajustados no contexto de cada demonstração, mantendo as superfícies e cores de fundo.
- Textos de código, comentários e placeholders tinham regras antigas para fundo claro ou escuro, e componentes do tema escuro ainda exibiam cards pastel. As regras foram delimitadas pelo fundo real de cada componente. Em particular, os títulos de `.loop-type` continuam escuros sobre card claro mesmo no tema escuro.
- A comparação `deprecated` aplicava `opacity: .7` ao card inteiro, reduzindo o contraste de todos os descendentes. O card permanece visualmente distinguível por borda, sem opacidade no conteúdo.
- O cabeçalho no tema escuro perdia o fundo escuro quando ganhava `.scrolled`; o breadcrumb da home conservava a cor do tema claro. Ambos foram corrigidos para o estado após rolagem.
- O exemplo inicial do editor tinha botão com roxo de contraste insuficiente. O HTML/CSS inicial e o reset agora usam a cor profunda, sem alterar a execução do editor.
- Blocos de código e tabelas com rolagem horizontal recebem foco quando necessário, permitindo acesso por teclado sem ocultar conteúdo.

## Contagens axe

| Página | Referência anterior, tema claro | Verificação atual, tema claro | Verificação atual, tema escuro |
| --- | ---: | ---: | ---: |
| Home | 50 nós `serious` de contraste | 0 `critical`/`serious` | 0 `critical`/`serious` |
| JavaScript | 18 nós `serious` de contraste | 0 `critical`/`serious` | 0 `critical`/`serious` |
| CSS, Git, Roadmap, Glossário, Cheatsheets | Sem contagem equivalente nesta fase | 0 `critical`/`serious` | 0 `critical`/`serious` |

As contagens de 50/18 vieram da auditoria anterior em `docs/visual-audit/README.md`, com build e gate anteriores. A matriz atual cobre 1440, 768 e 390 px para Home/JavaScript e 1440 px para todas as outras 17 páginas. Também audita hover em um card da home ou botão de JavaScript, foco no controle de tema e link selecionado `aria-current` na sidebar de JavaScript. Os JSON por estado estão em `runs/`. Não houve isenção ou alteração de severidade. A execução axe mede estados estáveis após 800 ms; o contraste visual durante quadros intermediários de animação não foi medido quadro a quadro.

### Ampliação para as demais páginas

O primeiro gate ampliado encontrou os seguintes nós `serious` antes das correções desta rodada. As contagens somam violações de contraste e, quando indicado, áreas roláveis sem foco. São medições do build local após a revisão visual dos heróis, não uma medição do site publicado.

| Página | Antes claro | Antes escuro | Depois claro/escuro |
| --- | ---: | ---: | ---: |
| HTTP | 28 contraste + 2 foco | 19 contraste + 2 foco | 0 / 0 |
| React | 36 contraste | 40 contraste | 0 / 0 |
| Vue.js | 61 contraste | 68 contraste | 0 / 0 |
| Backend | 4 contraste + 1 foco | 1 foco | 0 / 0 |
| SQL | 4 contraste | 5 contraste | 0 / 0 |
| Erros comuns | 88 contraste | 208 contraste | 0 / 0 |
| Tópicos | 16 contraste | 83 contraste | 0 / 0 |
| APIs, Acessibilidade, PostgreSQL, TypeScript e Terminal | 0 | 0 | 0 / 0 |

As causas eram cores de comentários sobre código escuro, cores saturadas em texto pequeno sobre pastel, opacidade aplicada a linhas inteiras e herança de texto escuro em cards do tema escuro. Os contrastes foram corrigidos em cada superfície. Em HTTP e Backend, regiões com rolagem horizontal receberam `tabindex="0"` e rótulos; nenhuma regra axe foi desativada. Não foi identificado falso positivo entre esses nós: os alvos e pares de cores nos relatórios reproduziam a falha em cada fundo computado.

## Gate e verificação

`tests/e2e/a11y.spec.js` agora falha em qualquer regra axe com impacto `critical` ou `serious`, inclusive `color-contrast`, com tags WCAG 2.0/2.1/2.2 A/AA. Nenhuma regra foi desativada. O gate salva alvo e resumo de falha por estado em `runs/`.

- Testes estáticos: 164/164.
- Axe: 50/50 cenários, com 54 relatórios de estado em `runs/`.
- E2E funcional: 88/88; junto aos 50 cenários axe, a suíte atual totaliza 138/138.
- Inspeção visual: 19 páginas em 1440, 768 e 390 px, sem overflow horizontal ou título sob o cabeçalho. Capturas anteriores fornecidas pelo usuário e novas capturas em `../visual-audit/landing-finish/`.
- `git diff --check`: sem erro de whitespace.

O host não fornece o executável `npm`. Por isso, os scripts foram executados com o runtime Node/Playwright e o build com `pnpm run build`, equivalentes aos comandos do projeto; não há alegação de execução literal de `npm test` ou `npm run test:a11y` neste host.

## Limites

Axe não comprova toda a WCAG 2.2 AA. Leitor de tela, ordem de foco em todas as 19 páginas, dispositivos físicos, Safari e Firefox permanecem sem validação nesta fase. Não foi identificado falso positivo que exigisse supressão; falhas inicialmente intermitentes eram causadas por animação/rolagem ou por servir um build antigo e foram reproduzidas e corrigidas no estado apropriado.
