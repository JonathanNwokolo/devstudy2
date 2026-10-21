# DevStudy — Revisão de UX

**Método:** navegação real no navegador embutido (desktop e 375×812), medições via script, leitura do HTML/CSS/JS. Capturas visuais foram vistas durante a auditoria mas **não foram salvas no repositório** (a tarefa limitava a criação a documentos); os resultados estão descritos abaixo. **Não** houve teste com usuários reais, leitor de tela nem dispositivos físicos.

## 1. Primeira impressão (home)

**Fato:** hero "Domine HTML, CSS & JavaScript" com três CTAs (HTML, CSS, JavaScript), selo "Aprenda do Zero ao Avançado", editor de código decorativo no desktop e estatísticas "50+ Tags / 80+ Propriedades / 65+ Desafios". Em 375 px o hero é legível, CTAs full-width, sem overflow horizontal.

**Problemas**
- **Promessa vs. realidade:** "Zero ao Avançado" e "65+ Desafios" não são sustentados (sem desafios executáveis; ~18 mil palavras no site; quiz de 33 questões). Expectativa quebrada na primeira interação.
- **Três CTAs equivalentes, sem recomendação.** Um iniciante não sabe por onde começar; a "Trilha" (a resposta certa) está escondida no menu "Recursos".
- **Home faz três trabalhos** (landing, hub, e conteúdo de HTML — 118 KB). Usuário que clica em "HTML" no menu volta para uma âncora da mesma página.
- **Banner "Agora com Inteligência Artificial"** logo abaixo do hero ocupa o espaço mais valioso com conteúdo (IA) que não é o foco para iniciante em web.

## 2. Navegação e arquitetura da informação

- 52 itens com `role=menuitem` só na home; mega-menus com 3 colunas × ~7 menus. **Opinião:** excesso para 23 páginas; o iniciante precisa de 1 caminho, não de 100 links.
- **Busca (Ctrl+K) falha silenciosamente** em quiz, roadmap, glossário e typescript (índice com 0 entradas), e "git" não é encontrado a partir da home. Busca que não acha é pior que não ter busca.
- **Duas categorizações concorrentes:** Fundamentos / Ferramentas / Frameworks / Recursos no README vs. mega-menu por tecnologia vs. `topicos.html`/`cheatsheets.html` — sobreposição de conteúdo.
- **Sem noção de "onde estou / o que falta":** nenhuma página mostra progresso do aprendiz (exceto checkboxes em erros-comuns). Barra de leitura mede scroll, não aprendizado.
- `css.html` sem `<h1>`, `<footer>`; sem `<main>` em 8 páginas → quebra de landmarks.

## 3. Qualidade da experiência do iniciante

| Jornada | Estado | Nota |
|---|---|---|
| Descobrir por onde começar | Roadmap existe, mas é texto, sem estado/checkbox, 389 palavras | Fraco |
| Ler um conceito | Boa organização visual, cartões, exemplos de código com botão "copiar" | Bom (forma); fundo raso em várias páginas (typescript 349 palavras) |
| Experimentar | Live editor HTML/CSS na home; flex playground; simuladores roteirizados | Parcial: **nenhum permite escrever JS e receber feedback** |
| Verificar aprendizado | Quiz 33 questões, feedback imediato e explicação | Funciona; sem persistência, sem repetição espaçada, sem tema para React/SQL/Node |
| Voltar amanhã | Nada guarda onde parou, nem sugere próximo passo | Ausente |

**Quiz — observações concretas**
- Fluxo correto (seleciona tema → pergunta → feedback → resultado), botões grandes no celular.
- A resposta nunca é a opção D; em CSS, 4/5 corretas são a mais longa → *test-wiseness* permite acertar sem saber. Embaralhar opções e revisar distratores.
- Sem histórico, sem "revisar erradas", sem pontuação persistente.
- Hero da página ocupa ~um terço da tela mobile antes da primeira pergunta (quiz.html em 375×812).

## 4. Mobile

- **Bom [FATO]:** sem scroll horizontal em 23/23 páginas a 375 px; menu hambúrguer, busca e tema acessíveis; botão flutuante (TOC).
- **A verificar:** alvos de toque: a medição automática achou 44–190 elementos < 32 px por página (inclui itens de menus ocultos e checkboxes de `erros-comuns` — 190). Não classificado por visibilidade real; **[NÃO VALIDADO]**.
- **Risco:** `mobile-enhanced.css` com 152 `!important` indica remendo; regressões prováveis a cada mudança.
- **Falta:** PWA/offline, modo leitura sem animações para redes lentas.

## 5. Visual e identidade

- Paleta roxo/azul/amarelo consistente (logo `</>`, gradientes), tipografia Inter + Fira Code, tema escuro. **Preservar.**
- **Excesso de decoração:** animações de entrada em cards, ripple, stagger — o próprio `IMPROVEMENTS.md` lista dezenas. Em dispositivos modestos isso tem custo e a primeira captura mobile mostrou conteúdo transiente em branco durante a entrada (não persistente; apenas atraso visual).
- Emojis como ícones de conteúdo (🏗️🎨⚡) funcionam para identidade, mas variam por SO; ok.
- Identidade é "template de curso" genérico; falta traço próprio brasileiro/voz (exemplos com contexto local, tom).

## 6. Acessibilidade prática

Ver `DEVSTUDY_AUDIT.md` A9. Resumo: marcação ARIA de menu incorreta, landmarks inconsistentes, skip-link em 4/23 páginas, `<h1>` duplicado/ausente. Contraste e foco **não** auditados.

## 7. Retenção

Hoje: **zero mecanismos de retorno** (sem estado, sem metas, sem lembrete, sem "continuar de onde parou"). Favoritos e checkbox de erros são o único estado.

O que faria alguém voltar *todo dia* (ver `ROADMAP.md`): uma sessão diária curta (revisão espaçada + 1 exercício), "Continuar" na home, streak honesto.

## 8. Preservar / Redesenhar / Eliminar

| Preservar | Redesenhar | Eliminar / reduzir |
|---|---|---|
| Identidade visual e tema escuro | Home → landing enxuta com **um** CTA ("Comece aqui") e continuação | `role=menubar` no menu; mega-menu de 3 colunas (substituir por menu simples de ~6 itens) |
| Cartões de conteúdo e botão copiar | Roadmap → trilha com estado, pré-requisitos e progresso | Contadores inflados ("65+ Desafios") até serem reais |
| Glossário e Erros Comuns (base do diferencial) | Quiz → banco único com SRS, embaralhado, com histórico | Animações de entrada em massa, ripple |
| Simuladores event loop e git (explicativos) | Busca → índice global estático | Código de atalhos "futuro"/stubs, `typeWriter`, `showTagDemo` |
| Live editor e flex playground | Páginas finas (TS, terminal, APIs, a11y) → aprofundar ou fundir | Sidebar + favoritos + breadcrumbs + barra de leitura **simultâneos** (4 camadas de navegação) — manter TOC e busca |

## 9. Oportunidades visuais de baixo custo

1. Tela "Continuar" na home com próxima lição e barra da trilha.
2. Indicador de dificuldade/duração por lição (⏱ 10 min · Iniciante).
3. Estados vazios e de erro dos exercícios com tom amigável (voz própria).
4. `og:image` por página (compartilhável no WhatsApp).
5. Modo "foco" (esconde sidebar/mega-menu) para leitura e exercício.
