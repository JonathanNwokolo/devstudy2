# DevStudy — Prontidão para Open Source

**Veredito: não está pronto para receber contribuidores externos.** Há licença e um README razoável, mas nada que permita a um estranho contribuir com segurança, e a estrutura atual (nav duplicada em 23 arquivos, sem testes) pune quem tenta.

## 1. Checklist verificado

| Item | Estado | Evidência |
|---|---|---|
| Licença | **OK** — MIT, "Copyright (c) 2026 Jonathan Nwokolo" | `LICENSE`. README diz só "código aberto… fins educacionais" (não cita MIT). |
| README | Parcial | Descreve conteúdo e estrutura; **URL de clone é placeholder** (`seu-usuario/devstudy`); URL de deploy sem rótulo; estrutura de pastas incompleta (omite simuladores, `ia-*.html`, `sql.html`); imagem embutida de `user-attachments`. |
| Instruções de instalação | Fraco | "Abra index.html" ou Live Server. Sem requisitos, sem como rodar localmente via servidor (links entre páginas funcionam, mas `file://` ≠ produção). |
| CONTRIBUTING.md | **Ausente** | Há 5 linhas genéricas no README (fork/branch/PR). Nada sobre onde editar conteúdo, estilo, revisão. |
| CODE_OF_CONDUCT.md | **Ausente** | — |
| SECURITY.md | **Ausente** | — |
| Templates de issue/PR | **Ausente** | Sem `.github/`. |
| CI / GitHub Actions | **Ausente** | Nada valida PRs. |
| Testes | **Ausente** | Nenhum, nem unitário nem de links. |
| Organização de conteúdo | **Dificulta contribuição** | Conteúdo é HTML bruto de 50–118 KB; para corrigir um typo é preciso encontrar a linha em arquivos enormes; mudança de nav = 23 arquivos. |
| Issues "good first issue" / labels | Desconhecido | Não verificável localmente (não acessei o GitHub). |
| Roadmap público / governança | **Ausente** | `IMPROVEMENTS.md` é histórico de features, não roadmap, e contém afirmações não verificadas. |
| Documentação interna | Fraca | `IMPROVEMENTS.md` descreve funcionalidades como WCAG AA e indexação global que não se confirmaram (ver auditoria). |

## 2. Barreiras reais para um contribuidor

1. **Não dá para rodar um comando e ver resultado/validar** — sem `npm run dev`, sem lint, sem checagem.
2. **Conteúdo e apresentação misturados** em HTML gigante; revisar PR de conteúdo exige ler diff de markup.
3. **Sem convenções** de código, tom editorial, exemplo de página/exercício canônico.
4. **Risco de regressão silenciosa:** não há nada que detecte link quebrado, `id` duplicado ou a nav divergir.
5. **Mantenedor único**, sem processo de revisão definido ("quem aprova? em quanto tempo?").

## 3. Estrutura proporcional (mínimo útil, sem burocracia)

Prioridade: **permitir PRs de conteúdo pequenos e seguros**.

```
.github/
  workflows/ci.yml            # validação HTML + links + a11y (axe) em PRs
  ISSUE_TEMPLATE/
    bug.yml  conteudo.yml  exercicio.yml   # 3 templates curtos
  PULL_REQUEST_TEMPLATE.md    # checklist de 6 itens
CONTRIBUTING.md              # 1 página: rodar local, onde editar, como criar exercício
CODE_OF_CONDUCT.md           # Contributor Covenant 2.1 (adotar, não escrever)
SECURITY.md                  # 10 linhas: e-mail/Security Advisories
docs/
  ROADMAP.md                 # público, curto (substitui IMPROVEMENTS.md)
  CONTENT_GUIDE.md           # tom, formato de lição/exercício, revisão
content/                     # (após migração gradual) lições em Markdown + frontmatter
```

**Não criar agora:** comitê, RFCs formais, CLA, múltiplos canais de chat, wiki separada.

## 4. Conteúdos de cada arquivo (resumo)

- **CONTRIBUTING.md:** (1) pré-requisitos (Node 20+), (2) `npm install && npm run dev`, (3) "Quero corrigir um erro de conteúdo" (caminho do arquivo + 3 passos), (4) "Quero criar um exercício" (formato + exemplo), (5) padrões de commit, (6) tempo esperado de resposta honesto (ex.: "revisamos em até 7 dias").
- **PR template:** descreve mudança · tipo (conteúdo/código) · screenshot se visual · `npm test` passou · testou em mobile.
- **CI:** `html-validate`, `lychee`/`linkinator` (links), `@axe-core/playwright` nas rotas principais, Prettier check. Falha = PR bloqueado. Custo: R$0 (Actions gratuito para repos públicos).
- **Labels:** `good first issue`, `conteúdo`, `exercício`, `a11y`, `help wanted`, `precisa-revisão-técnica`.

## 5. "Primeiras contribuições" prontas (sementes)

Criar 10–15 issues pequenas e bem definidas antes de divulgar:
- Corrigir `id="main"` duplicado em `erros-comuns.html`.
- Embaralhar/rebalancear respostas do quiz de CSS (posição da correta).
- Adicionar 5 questões de Terminal/React/SQL ao quiz.
- Revisar e expandir `typescript.html` (349 palavras).
- Adicionar 10 termos ao glossário.
- Traduzir mensagens de erro comuns do JS para `erros-comuns` (cada uma = 1 issue).

## 6. Governança mínima

- **Mantenedor:** Jonathan Nwokolo (único hoje). Documentar isso.
- **Decisões:** issue com label `proposta`; mantenedor decide em 14 dias; mudanças grandes exigem 1 aprovação de revisor de conteúdo.
- **Revisão técnica de conteúdo:** exigir 1 revisor para lições novas (reduz erro factual).
- **Meta realista:** 3 contribuidores externos recorrentes em 6 meses; não prometer mais.

## 7. Riscos e recomendação de timing

Abrir divulgação ampla **antes** de A1–A3 da auditoria (busca, nav duplicada, JS duplicado) e do CI desperdiça o pico de atenção e produz PRs que quebram o site. Ordem recomendada: CI + CONTRIBUTING + build com includes → issues-semente → divulgação.
