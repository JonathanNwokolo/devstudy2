# DevStudy 2.0 — auditoria de fidelidade visual

Data: 21/10/2026. Veredito: **PARTIAL**.

## Método e capturas

- Referência: o arquivo `docs/design-reference/devstudy_playful_home.png` contém HTML (apesar da extensão), com home e página de conteúdo navegáveis. `devstudy_playful_preview.html` descreve o pacote. O protótipo foi renderizado em Chromium nos mesmos viewports da implementação.
- Implementação: homepage e `javascript.html` em **1440, 768 e 390 px**, altura de viewport 980 px; capturas da primeira dobra e da seção após rolagem de 970 px. Cada conjunto está em `screenshots/reference/`, `screenshots/before/` e `screenshots/after/`.
- As capturas “before” foram inicialmente feitas antes das correções. Como Playwright apagou `test-results/` ao rodar a suíte, elas foram regeneradas de uma cópia temporária do build com as edições desta auditoria revertidas por `scripts/rebuild-visual-baseline.cjs`. A reconstrução não altera o working tree.
- O protótipo apresenta largura de documento maior que o viewport na home, inclusive em 390 px. Isso é uma característica da referência, não um defeito introduzido na implementação.

## Matriz de divergências

| Severidade | Divergência observada antes | Ação e evidência | Estado |
|---|---|---|---|
| MAJOR | Home: título em duas linhas, escala da cena de código excessiva e terceira CTA/counters competindo com o foco. | Quebra editorial de três linhas, cena CSS 3D menor com código JS e chips, prova social e links preservados abaixo. `src/pages/index.html`, `src/styles/playground.css`; compare `screenshots/*/index-1440.png`. | Corrigida |
| MAJOR | Home: a seção logo após o ticker começava no tutorial HTML, sem a grade de quatro caminhos do conceito. | Grade pastel de HTML/CSS/JavaScript/Git com destinos já existentes; tutoriais originais preservados após ela. Compare `screenshots/*/index-1440-section.png` e `index-390-section.png`. | Corrigida |
| MAJOR | Mobile 390: marca sem nome e hero de JavaScript coberto/sem hierarquia do protótipo. | Nome da marca restaurado, breadcrumb antes do hero, título e ações compactados. `src/pages/javascript.html`, `src/styles/playground.css`; compare `screenshots/*/javascript-390.png`. | Corrigida |
| MAJOR | Conteúdo fora da viewport era iniciado com opacidade zero; isso produzia capturas longas vazias e prejudicava a análise de contraste. | Cards continuam legíveis antes de entrar na tela; movimento da home usa deslocamento sem ocultar conteúdo. `src/scripts/features/reveal.js`, `src/scripts/features/playground-motion.js`. | Corrigida |
| MAJOR | Contraste de comentários de código, texto inline e rótulos da sidebar inferior ao necessário. | Cores escurecidas/clareadas conforme fundo. Em análise axe da home/JavaScript, as ocorrências `serious` passaram de **328/316** após remover a opacidade para **50/18** no relatório final. | Parcial |
| MINOR | Header desktop mantém mais rotas e controles que o protótipo; o conteúdo didático real da home e de JavaScript é mais extenso. | Mantidos para preservar navegação, busca, favoritos, editor, simuladores e conteúdo existente. | Diferença aceita |

Nenhuma divergência visual **CRITICAL** foi confirmada nos seis viewports. A diferença residual de contraste impede PASS de acessibilidade e, por consequência, PASS geral.

## Verificação

- `npm test`: build, testes estáticos e **95/95 testes E2E** aprovados. Inclui navegação, busca, favoritos, tema, editor, simuladores e mobile a 375 px.
- `npm run test:a11y`: **7/7** aprovados segundo o gate atual de **zero violações critical**. O gate não reprova `serious`/`moderate`; `test-results/a11y-index.json` registra **50 nós** `serious` de contraste na home e `a11y-javascript.json` registra **18** em JavaScript. Não é auditoria WCAG completa.
- `node scripts/visual-qa.cjs after`: seis capturas sem overflow horizontal reportado pelo documento, erro de JS, hero oculto sem GSAP ou hero oculto em movimento reduzido.
- `git diff --check`: sem erros de whitespace; nenhum commit, push ou deploy executado.

## Limite do veredito

**PARTIAL**: a direção artística, a composição principal, os cards, a cena 3D e a adaptação de 390/768 px melhoraram de forma verificável. Ainda há contraste insuficiente em demonstrações didáticas antigas e diferenças de densidade de navegação/conteúdo que foram mantidas para preservar funções reais. PASS exigiria tratar o contraste residual e nova verificação visual e de acessibilidade desses estados.
