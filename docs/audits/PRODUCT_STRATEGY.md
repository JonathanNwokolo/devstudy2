# DevStudy — Estratégia de Produto

Base factual: ver `DEVSTUDY_AUDIT.md`. Benchmarks: pesquisa web de 2026-10-13; fontes secundárias indicadas como tal.

## 1. Diagnóstico de produto (honesto)

DevStudy hoje é **material de referência em português com alguns visualizadores**. Não é (ainda) uma plataforma de *aprendizado*: ninguém escreve código, ninguém é avaliado de forma que o sistema lembre, ninguém tem um "próximo passo" calculado. A proposta "Domine HTML, CSS & JavaScript" não é sustentada por ~18 mil palavras e 33 perguntas.

**Proposta de valor atual (implícita):** "tudo sobre web dev, em português, bonito, grátis". Isso é genérico — competidores em inglês fazem melhor e o MDN em pt-BR cobre referência.

## 2. Benchmark

| Plataforma | O que faz melhor | Fonte/observação |
|---|---|---|
| **freeCodeCamp** | Currículo extenso, projetos + exame, certificados; 6 certificações no currículo v10, 4 no ar no fim de 2025; versão pt-BR existe mas com manutenção irregular (fórum relata cursos ainda em inglês). | [freeCodeCamp Turns 10](https://www.freecodecamp.org/news/freecodecamp-turns-10-major-curriculum-updates), [fórum pt](https://forum.freecodecamp.org/c/portugues/534) |
| **The Odin Project** | Currículo aberto *project-based*, aprender fazendo no seu próprio ambiente (Git, terminal), comunidade; sem certificado. | Fontes secundárias |
| **roadmap.sh** | Mapas visuais por papel/skill, progresso por conta; **sem avaliação/quiz embutido** (fontes secundárias). | [roadmap.sh](https://roadmap.sh/) |
| **MDN** | Referência canônica, precisão, tradução pt-BR comunitária. Não é trilha. | — |
| **Exercism** | Exercícios com testes, mentoria, CLI; declara não ser para iniciantes absolutos. | Fontes secundárias |
| **Frontend Mentor** | Desafios reais a partir de design, relatórios automatizados de a11y/HTML/CSS. Parte paga. | [Guides](https://www.frontendmentor.io/articles/introducing-frontend-mentor-guides) |
| **Duolingo** (retenção) | Sessões curtas, streak, revisão espaçada, metas diárias pequenas. | Referência de mecanismo, não de conteúdo |

**Verdade desconfortável:** DevStudy não vence nenhuma delas em profundidade, volume ou comunidade. Competir "mais conteúdo" é perder.

## 3. Necessidades brasileiras mal atendidas (hipóteses a validar)

> Estas são **hipóteses**; nenhuma foi validada com usuários. Validar com 10–15 entrevistas / formulário antes de investir.

1. **Prática imediata em português com feedback automático**, sem criar conta e sem instalar nada. freeCodeCamp tem pt-BR mas depende de conta e de tradução mantida por voluntários.
2. **Ponte entre "assisti curso" e "sei fazer"**: iniciantes que concluem vídeos no YouTube e travam em exercícios. (Hipótese baseada em padrão amplamente relatado em comunidades; sem dado local nesta auditoria.)
3. **Dispositivo e rede**: muitos aprendem pelo celular, planos limitados. Site leve, offline-first, sem login é diferencial real e barato.
4. **Vocabulário técnico em português acessível** (glossário, mensagens de erro traduzidas e explicadas). DevStudy já tem `erros-comuns` e `glossario` — embrião útil.
5. **Contexto de mercado local** (primeiro emprego, portfólio no GitHub, entrevistas) — pouco coberto por ferramentas internacionais.

## 4. Posicionamento recomendado

> **"O lugar para *praticar* programação em português, direto no navegador, sem cadastro — com feedback em português para os erros que iniciantes de verdade cometem."**

Pilares (em ordem de prioridade):
1. **Praticar > ler.** Cada conceito termina em um exercício executável com teste.
2. **Erros em português.** Explicar `Uncaught TypeError…` e saídas de teste em linguagem de iniciante. É onde conteúdo curado em pt-BR tem vantagem real e já existe semente (`erros-comuns.html`).
3. **Leve e offline.** PWA, sem conta, progresso local (exportável).
4. **Aberto.** Conteúdo em Markdown/JSON, contribuível por PR.

**O que NÃO ser:** não ser enciclopédia (MDN), não ser trilha de carreira completa (roadmap.sh/freeCodeCamp), não ser rede social.

## 5. Público-alvo

- **Primário:** iniciante absoluto/pós-curso de vídeo, 16–30 anos, celular como dispositivo principal ou compartilhado, aprendendo web (HTML/CSS/JS). Quer "fazer algo funcionar".
- **Secundário:** estudante de faculdade/técnico buscando reforço (origem do projeto: "grupo de amigos da faculdade"); autores de conteúdo (contribuidores).
- **Fora de escopo agora:** profissionais sênior, mobile nativo, dados/ML aprofundado.

## 6. Diferenciação verdadeira (e o que é só aparência)

| Candidato | Veredito |
|---|---|
| Exercícios com testes rodando 100% no cliente, feedback em pt-BR | **Diferenciador real e viável** — nenhuma concorrente grande é leve + pt-BR + sem conta. |
| "Decodificador de erros" (cole o erro/ veja o erro do seu exercício explicado) | **Diferenciador forte**, barato (tabela de padrões), alinhado ao conteúdo existente. |
| Revisão espaçada sobre quizzes/exercícios, local | **Retenção real**, custo baixo — mas só depois de haver banco de questões ≥ 150. |
| Mega-menu, atalhos, favoritos, breadcrumbs | **Não é diferenciação** — é infraestrutura de navegação que qualquer site de docs tem. Reduzir. |
| Simuladores animados | Úteis como *explicação*, não como prática. Manter os melhores (event loop, git); parar de criar novos até haver exercícios. |
| IA | Ver abaixo — opcional, não central. |

## 7. Avaliação das propostas de evolução

Valor educacional / Diferenciação / Complexidade / Custo / Retenção / Prioridade.

| Proposta | Valor | Difer. | Compl. | Custo | Retenção | Prioridade | Decisão |
|---|---|---|---|---|---|---|---|
| Exercícios JS com testes automáticos (cliente, Web Worker) | Alto | Alta | Média | R$0 | Média | **P0** | Fazer. |
| Playground HTML/CSS com checagem estrutural (DOM) | Alto | Média | Baixa-Média | R$0 | Média | **P0** | Fazer (a base de live editor já existe). |
| Progresso persistente local + exportar/importar | Médio | Baixa | Baixa | R$0 | Alta | **P0** | Pré-requisito de tudo. |
| Trilhas progressivas (ordem + pré-requisitos) | Alto | Média | Baixa (dados) | R$0 | Média | **P1** | Roadmap atual vira trilha com estado. |
| Revisão espaçada (SM-2 simples, local) | Alto | Média | Baixa | R$0 | **Alta** | **P1** | Depois de ≥150 itens. |
| Decodificador de erros pt-BR | Alto | **Alta** | Baixa-Média | R$0 | Média | **P1** | Fazer. |
| Projetos práticos com dificuldade crescente (checklist + critérios) | Alto | Média | Média | R$0 | Média | **P2** | 3–5 projetos bons, com rubrica automática parcial. |
| Aprendizado por contribuição open source (issues "good first issue" de conteúdo) | Médio | Alta | Baixa | R$0 | Baixa (indireta) | **P2** | Funciona como motor de conteúdo e comunidade. |
| Integração GitHub (login, repos) | Médio | Baixa | Alta | R$ (OAuth backend) | Média | **Rejeitar por ora** | Exige backend/segredos; benefício não justificado. Alternativa: exercício "faça fork + PR" sem integração. |
| Personalização da jornada | Médio | Baixa | Média | R$0 | Média | **P3** | Só um questionário de 3 perguntas que escolhe trilha. Sem "motor". |
| Conquistas/gamificação ampla | Baixo-Médio | Baixa | Média | R$0 | Média (risco de vazio) | **P3** | Apenas streak + marcos honestos. O próprio projeto já removeu "conquistas" que não existiam — não repetir. |
| IA opcional local (WebLLM/Transformers.js) | Médio | Média | Alta | R$0 (mas pesado: 100s de MB) | Baixa | **Rejeitar por ora** | Download pesado, hardware desigual, alucinação em contexto educacional. Alternativa barata: regras/heurísticas para erros. Reavaliar com dados de demanda. |
| IA via API paga | — | — | — | R$ recorrente | — | **Rejeitar** | Contraria restrição de custo zero. |
| Comunidade/fórum/chat próprio | Médio | Baixa | Alta | Moderação | Alta | **Rejeitar** | Usar GitHub Discussions/Discord existente. |
| Backend com contas, ranking | Baixo agora | Baixa | Alta | R$ + LGPD | Média | **Rejeitar** | Complexidade e responsabilidade legal sem prova de demanda. |

## 8. Ideias originais (viáveis com recursos limitados)

1. **"Quebre o código"** — exercícios que partem de código *com erro real* (mensagem em pt-BR do console) e pedem o conserto; reaproveita `erros-comuns.html` como banco.
2. **"Ordem do Parsons em português"** — puzzles de reordenar linhas (barato: só JSON + drag/teclado) para primeira exposição a sintaxe; ótimo no celular.
3. **Modo "10 minutos"** — sessão diária fixa: 1 revisão + 1 exercício curto; é o equivalente honesto de streak.
4. **Glossário vinculado** — termos técnicos no texto linkam ao glossário com tooltip (reaproveita conteúdo existente).
5. **Pacote offline por trilha** — PWA que baixa uma trilha por vez (útil com dados móveis limitados).
6. **"PR de 1 linha"** — primeira contribuição guiada ao próprio DevStudy (corrigir um typo no conteúdo) como exercício de Git real; o repositório é o laboratório.

## 9. Métricas que importam (sem rastreamento invasivo)

- Exercícios concluídos por sessão (local; opcionalmente contador agregado anônimo, p.ex. Plausible/GoatCounter com aviso claro).
- Retorno D7 estimado por `localStorage` (apenas local, opt-in para enviar).
- Contribuições externas mescladas por mês.
- Tempo até primeiro exercício concluído a partir da home (alvo < 2 min).

## 10. Riscos

- **Escopo:** repetir o padrão atual (adicionar páginas/features de UI antes de validar uso).
- **Qualidade de conteúdo:** sem revisão por pares, erros técnicos corroem confiança; precisa de processo de revisão.
- **Sustentabilidade:** projeto de um mantenedor (8 commits, 1 autor); dependência total de tempo voluntário.
- **Segurança de execução:** rodar código do usuário no cliente exige sandbox correto (iframe/Worker) — ver `ARCHITECTURE_DECISION.md`.
