# Contribuindo com o DevStudy

Obrigado por querer ajudar! O DevStudy é um site estático em português do Brasil (HTML, CSS e JavaScript Vanilla, gerado com [Eleventy](https://www.11ty.dev/)). Este guia é curto de propósito.

Ao participar, você concorda com o [Código de Conduta](CODE_OF_CONDUCT.md).

## Rodando localmente

Requisitos: **Node.js 20+** e Git.

```bash
git clone https://github.com/<seu-usuario>/-DevStudy-.git   # seu fork
cd -DevStudy-
npm install
npx playwright install chromium      # uma vez, para os testes de navegador
npm run dev                          # http://localhost:5500/index.html
```

## Onde fica cada coisa

| Quero mexer em… | Edite |
|---|---|
| Texto ou exemplo de uma página | `src/pages/<pagina>.html` |
| Menu de navegação | `src/components/header.njk` (vale para todas as páginas) |
| Rodapé | `src/components/footer.njk` |
| `<head>` comum (meta, fontes, CSS base) | `src/layouts/base.njk` |
| Estilo | `src/styles/` |
| Comportamento (JS) | `src/scripts/features/` (global) ou `src/scripts/pages/` (por página) |

Nunca edite `_site/` (é gerado) nem crie páginas ou `css/`/`js/` na raiz do repositório — os testes barram isso. Para a visão completa, veja [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md); para tom e formato do conteúdo, [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md).

## Antes de abrir o Pull Request

```bash
npm test
```

| Comando | O que faz |
|---|---|
| `npm run test:static` | Valida as páginas geradas: metadados, ids únicos, `<main>`/`<h1>`/`<footer>`, skip-link, links e âncoras, arquitetura, índice de busca e regressões de segurança. Rápido, sem navegador. |
| `npm run test:e2e` | Fluxos no navegador real (Playwright): navegação, tema, favoritos, busca, editor ao vivo, segurança e axe-core. |
| `npm run metrics` | Mede peso, requisições e nós de DOM em localhost (referência, não é Lighthouse). |

O CI roda os mesmos testes em todo PR.

## O que fazer em cada caso

**Corrigir texto ou exemplo de código** — edite o `.html` em `src/pages/`. Mudanças pequenas e focadas são as mais fáceis de revisar. Confira com a documentação oficial (MDN, docs do framework) e cite a fonte no PR.

**Criar uma página nova** — copie uma página existente em `src/pages/`, ajuste o front matter (`title`, `description`, `permalink`, `styles`, `scripts`) e adicione o link no `header.njk`. O teste de arquitetura e o índice de busca cobrem a página automaticamente.

**Fazer afirmações ou mudar números** — só afirme o que é verificável. Não adicione "N+ exercícios", "conformidade WCAG" etc. sem comprovação; os testes impedem alguns casos.

**Segurança no JavaScript** — nunca insira texto de usuário, `localStorage` ou parâmetros de URL com `innerHTML`; use `textContent`/`createElement`. Evite `onclick="..."` inline em código novo.

## Padrões

- HTML semântico; uma `<main id="main-content">` por página e um único `<h1>`.
- Imagens/ícones informativos com texto alternativo; controles de formulário com `<label for>` ou `aria-label`.
- Não use `role="menubar"`/`role="menuitem"` em links de navegação.
- Textos em português do Brasil, tom direto e acolhedor.
- JavaScript em ES Modules; cada recurso é inicializado uma única vez em `src/scripts/main.js`.
- Commits curtos, no imperativo (ex.: `Corrige exemplo de Promise.all em javascript.html`).

## Pull Requests

1. Faça um fork e crie uma branch (`git checkout -b fix/descricao-curta`).
2. Faça mudanças pequenas e focadas — um assunto por PR.
3. Rode `npm test` e, se a mudança for visual, teste também em ~375 px de largura.
4. Abra o PR preenchendo o template.

**Prazos (honestos):** há um único mantenedor, que costuma responder em até ~7 dias. PRs que quebram os testes não são mesclados até ficarem verdes.

## Limitações dos testes

- Não há teste de regressão visual (screenshots).
- axe-core cobre só parte da acessibilidade; não há teste com leitor de tela.
- Só Chromium é testado (não Firefox/Safari).

## Segurança

Não abra issue pública para vulnerabilidades. Veja [SECURITY.md](SECURITY.md).
