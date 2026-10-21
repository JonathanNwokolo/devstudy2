# 📚 DevStudy — Plataforma de Estudos para Desenvolvedores

Site estático, em português do Brasil, para estudar desenvolvimento web: explicações, exemplos de código e uma trilha de estudos. Projeto de código aberto, feito para estudantes e aberto a contribuições.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green?style=for-the-badge)
[![CI](https://github.com/JonathanNwokolo/-DevStudy-/actions/workflows/ci.yml/badge.svg)](https://github.com/JonathanNwokolo/-DevStudy-/actions/workflows/ci.yml)

**Site publicado:** <https://dev-study-rho.vercel.app/index.html>

<img width="1550" height="899" alt="Tela inicial do DevStudy" src="https://github.com/user-attachments/assets/b4c78c67-f1a7-4245-8770-d843cc94fb90" />

## 🎯 O que é (e o que ainda não é)

O DevStudy é uma **referência de estudo e leitura** com alguns recursos interativos. Para não prometer o que não existe:

| Existe hoje | Ainda não existe |
|---|---|
| 19 páginas de conteúdo (HTML, CSS, JavaScript, TypeScript, React, Vue, Git, HTTP, Node.js, PostgreSQL/SQL, acessibilidade…) | Exercícios com correção automática |
| Busca global (`Ctrl+K`) com índice gerado no build | Execução de código JavaScript do usuário |
| Editor HTML/CSS ao vivo, playground de Flexbox e 6 simuladores explicativos | Trilha com progresso persistente |
| Glossário, cheat sheets, erros comuns, favoritos e tema claro/escuro | Versão offline |

O plano de evolução está em [`docs/audits/ROADMAP.md`](docs/audits/ROADMAP.md).

## 🚀 Como rodar localmente

Requisitos: **Node.js 20+** e Git.

```bash
git clone https://github.com/JonathanNwokolo/-DevStudy-.git
cd -DevStudy-
npm install
npm run dev
```

Abra <http://localhost:5500/index.html>. O Eleventy recompila e recarrega a página a cada alteração.

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com recarga automática (porta 5500) |
| `npm run build` | Gera o site final em `_site/` |
| `npm run serve` | Serve o `_site/` já gerado, sem recarga (usado pelos testes) |
| `npm test` | Build + testes estáticos + testes de navegador |
| `npm run metrics` | Métricas locais de referência (peso, DOM) |

## 🧪 Testes

```bash
npx playwright install chromium  # uma vez
npm test                         # estáticos + e2e
npm run test:static              # rápido, sem navegador
npm run test:e2e                 # fluxos no navegador (Playwright + axe-core)
```

O CI (GitHub Actions) roda os mesmos testes em todo Pull Request. Detalhes em [`CONTRIBUTING.md`](CONTRIBUTING.md).

## 📁 Estrutura

```
src/
├── pages/        # Conteúdo: 1 arquivo .html por página (front matter + <main>)
├── layouts/      # base.njk — <head>, skip-link e esqueleto comum
├── components/   # header (navegação), footer, quick-access, prism — escritos uma única vez
├── styles/       # styles.css (base/tema) + CSS por página e por simulador
├── scripts/      # ES Modules: main.js (ponto de entrada), core/, features/, pages/
└── assets/       # Imagens e arquivos estáticos
scripts/          # build-search-index.js, serve.js, metrics.js
tests/            # static/ (Node test runner) e e2e/ (Playwright)
docs/             # Arquitetura, guia de conteúdo, auditorias e roadmap
eleventy.config.js
```

A saída do build (`_site/`) mantém as URLs públicas (`/git.html`, `/css/…`, `/js/…`). Veja [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## ⚠️ Limitações conhecidas

- Prism e fontes vêm de CDNs (sem SRI); não há versão offline.
- Acessibilidade **não foi auditada por completo** (axe-core automatizado, sem teste com leitor de tela). Não afirmamos conformidade com WCAG.
- Testes de navegador só em Chromium; sem testes em Safari/Firefox nem em dispositivos reais.

## 🤝 Contribuindo

Contribuições são bem-vindas — de uma correção de typo a uma nova página. Leia o [`CONTRIBUTING.md`](CONTRIBUTING.md) e o [`guia de conteúdo`](docs/CONTENT_GUIDE.md). Procure issues com o rótulo `good first issue`. Todos devem seguir o [Código de Conduta](CODE_OF_CONDUCT.md). Para vulnerabilidades, veja [`SECURITY.md`](SECURITY.md).

## 📝 Licença

[MIT](LICENSE) © 2026 Jonathan Nwokolo.

---

<p align="center">Feito com ❤️ para estudantes, por estudantes.</p>
