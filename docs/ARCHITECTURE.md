# Arquitetura

O DevStudy é um site **estático** gerado pelo [Eleventy](https://www.11ty.dev/) a partir de `src/` para `_site/`. A decisão e as alternativas estão em [`audits/ARCHITECTURE_DECISION.md`](audits/ARCHITECTURE_DECISION.md); este documento descreve o estado atual.

## Build

`eleventy.config.js`:

- Cada `src/pages/*.html` vira uma página. O front matter define `title`, `description`, `permalink`, `styles` (CSS extra), `scripts` (módulos de `src/scripts/pages/`) e a variante do rodapé. O layout padrão está em `src/pages/pages.json`.
- `src/styles` → `_site/css`, `src/scripts` → `_site/js`, `src/assets` → `_site/assets`.
- Após o build, `scripts/build-search-index.js` gera o índice da busca global a partir das páginas publicadas.
- As páginas são HTML puro: o conteúdo não passa por Nunjucks/Markdown (exemplos com `{{ }}` são preservados). Só o layout e os componentes usam Nunjucks.

## Layout e componentes

`src/layouts/base.njk` monta `<head>`, skip-link, `header.njk`, o conteúdo da página e `footer.njk`. Navegação e rodapé existem em **um único lugar**; o teste `architecture.test.js` garante que as páginas não os dupliquem.

## JavaScript

ES Modules. `src/scripts/main.js` é o único ponto de entrada e inicializa cada recurso de `features/` exatamente uma vez (cada um verifica se seus elementos existem na página). `core/` tem utilitários (DOM, estado, `localStorage`, toast). `pages/` tem scripts de uma página específica, listados no front matter dela.

Estado do visitante fica apenas no `localStorage` (tema, favoritos, progresso de "erros comuns").

## Testes

- `tests/static/` — Node test runner sobre `_site/` e o código-fonte: metadados, ids, links/âncoras, arquitetura, índice de busca, regressões de segurança.
- `tests/e2e/` — Playwright (+ axe-core) contra `scripts/serve.js` na porta 5599.

## Deploy

Vercel, com `npm run build` e diretório de saída `_site`.
