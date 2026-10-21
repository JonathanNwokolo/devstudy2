# DevStudy — Auditoria Técnica

**Data:** 2026-10-13 · **Commit auditado:** `3761bfb` (branch `main`) · **Escopo:** repositório local, sem alterações de código.

## 0. Método e limitações (leia primeiro)

| Item | Como foi verificado |
|---|---|
| Estrutura, tamanhos, contagens | Scripts Node sobre os arquivos do repositório (reprodutíveis). |
| Links internos / âncoras / IDs duplicados | Script Node: resolve `href`/`src` relativos e `#âncoras` após remover blocos `<pre>`/`<code>` (exemplos de código geravam falsos positivos). |
| Comportamento em runtime | Servidor estático local (`python -m http.server`) + navegador embutido; checagens via `javascript_exec` em viewport desktop e 375×812. |
| Performance | Medida **apenas em localhost**: não representa rede real. CDN (Prism, Google Fonts) não foi medida com latência real. |
| **Não executado** | Lighthouse/axe (não disponíveis no ambiente), leitor de tela, teste em dispositivos reais, Safari/Firefox, auditoria de contraste automatizada, `npm audit` (não há `package.json`). |

Legenda: **[FATO]** reproduzido/medido · **[INFERÊNCIA]** deduzido da leitura do código, não testado em runtime · **[OPINIÃO]** julgamento.

Não há testes automatizados, CI nem build a executar: o projeto é site estático (23 HTML, 11 CSS, 8 JS; ~1,4 MB de fonte; 8 commits).

## 1. Estado real em uma frase

Site estático de **referência/leitura** (~18 mil palavras de prosa no total) com uma camada grande de UI "profissional" (mega-menu, busca, favoritos, atalhos) construída sobre ele — **a camada de UI é maior e mais elaborada do que o conteúdo e a pedagogia que ela serve**.

## 2. Inventário de fatos

- **Conteúdo:** 23 páginas HTML. Prosa (sem navegação/código): ~18.000 palavras; maiores: index (1.830), erros-comuns (1.455), git (1.443), javascript (1.413). Páginas "novas" são finas: typescript 349, terminal 366, apis 382, acessibilidade 429, backend 523. **[FATO]**
- **Quiz:** 33 questões em 7 temas (HTML 5, CSS 5, JS 5, Git 4, HTTP 3, TS 4, IA 7). Sem questões de React, Vue, SQL, Node, Terminal, a11y. Dados em `js/quiz.js`. **[FATO]**
- **Posição da resposta correta** (índice 0/1/2/3): HTML 0/2/3/0, IA 1/6/0/0 — nunca a opção D; IA tem 6 de 7 na opção B. Em CSS, 4 de 5 respostas corretas são a opção mais longa. Previsível para quem "chuta". **[FATO]**
- **Simuladores (6):** event loop, git, http, middleware, react, SQL joins. São **animações roteirizadas** com dados fixos (`USERS`, `ORDERS`, `JOINS_DATA`…); nenhum aceita código do usuário (grep por `textarea`/`input` nos simuladores: zero). **[FATO]**
- **Persistência (localStorage):** só 3 chaves — `theme`, `devstudy_bookmarks`, `devstudy-progress` (checkbox "visto" em erros-comuns). **Quiz não salva nada; roadmap não rastreia progresso.** **[FATO]**
- **Busca global:** índice construído a partir do DOM **da página atual**. Medido: `index` 30 entradas, `javascript` 29, `git` 10, `react` 2, `quiz`/`roadmap`/`glossario`/`typescript` **0**. Buscar "git" em `index.html` retorna 0 resultados (entradas com "git": 0). **[FATO]**
- **Estatísticas da home:** "50+ Tags HTML · 80+ Propriedades CSS · 65+ Desafios". Não existe mecanismo de "desafios"; a contagem 65+ não corresponde a nada verificável no repositório (quiz tem 33 perguntas). **[FATO]** que não há 65 desafios identificáveis; a origem do número é desconhecida.
- **Infra ausente:** sem `package.json`, `.github/`, `robots.txt`, `sitemap.xml`, `404.html`, manifest/PWA, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, templates. **[FATO]**

## 3. Achados (Problema → Evidência → Severidade → Impacto → Solução → Esforço)

### A1 — Busca "global" é local à página
- **Evidência:** `js/advanced-navigation.js:245-261` (`buildSearchIndex` itera `section[id]`/`.topic-card` do documento atual); medição acima.
- **Severidade:** Alta · **Impacto:** feature central de descoberta falha silenciosamente; o usuário digita "react" em `git.html` e vê "nenhum resultado". Promessa do `IMPROVEMENTS.md` ("Indexação automática de todo conteúdo") não é verdadeira.
- **Solução:** gerar um `search-index.json` em build (título, URL, trecho) e buscar nele (FlexSearch/Fuse ou implementação simples).
- **Esforço:** 1–2 dias (com script de build).

### A2 — Navegação copiada em 23 arquivos (~10 KB × 23)
- **Evidência:** blocos `<nav class="navbar">` com 10.483–11.094 bytes em todas as páginas; 3 variantes diferentes (10.483 / 10.493 / 10.690) → já houve divergência.
- **Severidade:** Alta (manutenção) · **Impacto:** adicionar uma página exige editar 23 arquivos; divergência já existe; contribuidores novos errarão.
- **Solução:** includes em build (Eleventy/Astro/script próprio).
- **Esforço:** 1 dia.

### A3 — Código duplicado/conflitante entre `script.js` e `advanced-navigation.js`
- **Evidência:** declarações globais repetidas: `initializeSearch` (`script.js:514`, `advanced-navigation.js:197`), `initializeKeyboardShortcuts` (`script.js:805`, `advanced-navigation.js:714`), `debounce`, `initializeAutocomplete` duas vezes **no mesmo arquivo** (`script.js:831` e `:1614`). Ambos têm handlers `keydown` para Ctrl+K; o de `script.js:952` apenas faz `console.log('Busca ativada (em desenvolvimento)')`.
- **Severidade:** Média-Alta · **Impacto [INFERÊNCIA]:** como `script.js` carrega depois, suas declarações sobrescrevem as de `advanced-navigation.js` no escopo global; qual versão executa depende da ordem de carga, e uma é código morto. Comportamento imprevisível a cada edição.
- **Solução:** módulos ES (`type="module"`), um dono por feature, apagar o morto.
- **Esforço:** 2–3 dias.

### A4 — Código morto e stubs
- **Evidência:** `script.js` `typeWriter` (nunca chamado), `window.showTagDemo` (só `console.log`; comentário "apenas mostra um alert estilizado"), Ctrl+K "em desenvolvimento", Escape com corpo vazio (`script.js:957-960`). `README`/`IMPROVEMENTS.md` listam "↑/↓ navegar seções (futuro)".
- **Severidade:** Baixa-Média · **Impacto:** ruído; 1.638 linhas em `script.js` para o que caberia em ~600.
- **Esforço:** 0,5 dia.

### A5 — Sinks de HTML sem sanitização (XSS)
- **Evidência:** `advanced-navigation.js:308` (`"${query}"` em `innerHTML`), `:598-640` (título do favorito em `innerHTML`, `onclick="removeBookmark('${id}')"`). **[FATO]** reproduzido: `performSearch('<img onerror=…>')` e favorito adulterado executaram script.
- **Severidade:** Baixa (hoje). Entrada é o próprio usuário digitando ou `localStorage` do mesmo navegador → **self-XSS**, não explorável remotamente sem outro vetor. Torna-se Média se um dia houver parâmetros de URL, conteúdo de usuário ou dados sincronizados.
- **Solução:** `textContent`/`createElement`, `addEventListener` em vez de `onclick` inline.
- **Esforço:** 0,5 dia.

### A6 — Preview do editor ao vivo sem `sandbox`
- **Evidência:** `index.html:2600` `<iframe id="previewFrame">` sem atributo `sandbox`; `script.js` usa `document.write` com HTML/CSS do usuário, mesma origem.
- **Severidade:** Baixa (self-XSS) · **Impacto:** código digitado roda com acesso ao `localStorage` do site; vira risco real se houver compartilhamento de snippets por URL.
- **Solução:** `sandbox="allow-scripts"` + `srcdoc`.
- **Esforço:** 1 hora.

### A7 — Scripts de CDN sem SRI, sem CSP
- **Evidência:** 0 ocorrências de `integrity=` em `index.html`; Prism 1.29.0 e Google Fonts via CDN; sem meta CSP.
- **Severidade:** Baixa-Média · **Impacto:** comprometimento do CDN executa código no site; terceiros (Google Fonts) recebem IP de visitantes (LGPD — **[OPINIÃO]**, risco baixo mas real).
- **Solução:** self-host de Prism e fontes (também melhora performance e funciona offline).
- **Esforço:** 0,5 dia.

### A8 — Carregamento: todas as páginas pagam pelo máximo
- **Evidência:** cada página carrega 6–9 scripts Prism de CDN (a maioria carrega bash, typescript e sql mesmo em páginas sem esses blocos — por exemplo `terminal.html` e `glossario.html` carregam `prism-sql`), 3–4 CSS globais + CSS de página, e **dois** JS grandes (74 KB + 24 KB) sem `defer`. `index.html` = 118 KB de HTML, 1.951 nós DOM. Em localhost: DCL 513 ms, load 667 ms, 15 requisições, 220 KB transferidos; CLS 0.
- **Severidade:** Média · **Impacto:** em 3G/Android baixo, impacto real; **não medido** com rede throttled neste ambiente. `setTimeout(…, 500)` no init (`script.js:869`) atrasa deliberadamente copy-buttons/busca/progresso em 500 ms.
- **Solução:** `defer`, Prism só das linguagens usadas (ou Shiki em build — HTML já destacado), remover `setTimeout`.
- **Esforço:** 1 dia.

### A9 — Acessibilidade: ARIA incorreta e inconsistências (declarada WCAG AA, não validada)
- **Evidência [FATO]:** `role="menubar"`/`role="menuitem"` aplicados a links de navegação de site (padrão ARIA de aplicação, exige gestão de setas que não existe) — 52 ocorrências só em `index.html`; `id="main"` duplicado em `erros-comuns.html`; `css.html` sem `<h1>` e sem `<footer>`; `index.html` tem 2 `<h1>` (um é demo "Título Principal"); 8 páginas sem `<main>` (cheatsheets, erros-comuns, git, http, javascript, react, topicos, vuejs); skip-link só em 4 páginas (acessibilidade, css, index, topicos). Âncora `#main`/`#main-content` referenciada em 2 páginas só em exemplos de código (não é bug).
- **[NÃO VALIDADO]:** contraste, foco visível, leitor de tela. `IMPROVEMENTS.md` afirma WCAG 2.1 AA — **sem evidência no repositório**.
- **Severidade:** Média · **Impacto:** o site ensina acessibilidade e viola parte do que ensina.
- **Solução:** nav como `<nav><ul><li><a>` simples; `<main>` e skip-link no template; axe-core no CI.
- **Esforço:** 1–2 dias.

### A10 — SEO técnico fraco
- **Evidência [FATO]:** sem `robots.txt`/`sitemap.xml`; `og:*` em só 3 páginas, sem `og:image`; `canonical` em 1 página; todas as URLs usam `.html` e mega-menu na home aponta para `#html-*` âncoras (HTML não tem página própria — vive dentro de `index.html`); título da home "Aprenda HTML, CSS & JavaScript".
- **Severidade:** Média (para adoção) · **Impacto:** indexação e compartilhamento sociais (WhatsApp/LinkedIn) sem imagem/título adequados.
- **Esforço:** 0,5 dia.

### A11 — Dependência de `file://` e sem `404`/rotas
- README manda abrir `index.html` direto; clone URL é placeholder `seu-usuario/devstudy` (README). Deploy real é Vercel (`dev-study-rho.vercel.app`) mas **sem `vercel.json`** nem documentação de deploy no repo. **[FATO]**
- **Esforço:** 1 hora.

### A12 — CSS: 11+ arquivos, empilhados com `!important`
- **Evidência [FATO]:** `!important`: mobile-enhanced.css **152**, styles.css 23, animations.css 20; 47 `@media`. `mobile-enhanced.css` existe para sobrescrever estilos base → guerra de especificidade. CSS inline: `eventloop-simulator.js` com `style="…"` embutido; 24–43 handlers inline (`onclick`) em `index.html`/`git.html`/`javascript.html`.
- **Severidade:** Média (manutenção). **Solução:** tokens CSS + camadas (`@layer`), consolidar `mobile-enhanced` no base.
- **Esforço:** 3–4 dias (incremental).

### A13 — Conteúdo duplicado/estrutura confusa
- Home contém HTML, é landing e é hub ao mesmo tempo (118 KB); "Início" e "HTML" apontam para a mesma página. Páginas como `topicos.html` e `cheatsheets.html` se sobrepõem a páginas dedicadas. **[OPINIÃO]** com base em tamanho e menu.
- **Esforço:** parte do redesenho de IA (ver `UX_REVIEW.md`).

### A14 — Documentação desatualizada/exagerada
- `IMPROVEMENTS.md` descreve recursos como "Skeleton loaders", "Breakpoints 320–1440", "WCAG 2.1 AA", "indexação de todo conteúdo" sem verificação; o próprio arquivo admite que um sistema de conquistas "nunca chegou a ser implementado". A documentação não é fonte confiável do estado real.
- **Solução:** substituir por `docs/` curtos e verificáveis.

### A15 — Zero testes, zero CI
- Nenhuma verificação automática impede links quebrados, IDs duplicados ou regressões de nav (que já divergiu em 3 variantes).
- **Solução mínima:** GitHub Action com validação HTML (`html-validate`), checagem de links, axe via Playwright; 1–2 dias. Testes unitários do quiz após extrair dados para JSON.

## 4. Validado e positivo (com evidência)

| O quê | Evidência |
|---|---|
| Links internos e âncoras (fora de exemplos de código) | Script: 0 quebrados em 23 páginas, exceto `id="main"` duplicado. |
| Sem overflow horizontal em 375 px | `scrollWidth` = 367 em todas as 23 páginas (viewport emulado, iframes). *Limitado a layout; não valida usabilidade.* |
| `lang="pt-BR"`, `<title>` e `meta description` em todas | Script. |
| Tema claro/escuro com persistência | `theme` em localStorage; funcionou no teste. |
| Sem dependências de build/npm | Zero superfície de supply chain além de CDN. |
| Hero mobile funcional | Screenshot 375 px: título, CTAs e estatísticas legíveis (a captura inicial em branco foi transiente de animação, não bug). |
| Sem erros de console no carregamento | Console: apenas logs informativos. |

## 5. O que **não** foi possível concluir

- Core Web Vitals reais (LCP retornou `null` em localhost headless; CLS 0 sem significado de campo).
- Contraste, ordem de foco e leitores de tela.
- Compatibilidade Safari/iOS e Firefox.
- Correção técnica do conteúdo (revisão de ~18 mil palavras e dos 33 quizzes por especialista). Amostra: sem erros factuais óbvios nas questões lidas, mas **não é revisão completa**.
