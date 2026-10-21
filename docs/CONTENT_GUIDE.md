# Guia de conteúdo

Como escrever e revisar conteúdo no DevStudy.

## Tom

- Português do Brasil, direto e acolhedor. Perguntas básicas são bem-vindas: explique o "porquê", não só o "como".
- Frases curtas. Defina o termo técnico na primeira vez que aparecer.
- Sem promessas de resultado ("domine X em 1 hora") e sem números que não possamos comprovar.

## Estrutura de uma seção

1. Título (`<h2>`) com `id` estável — ele vira âncora e entrada da busca.
2. Um parágrafo explicando a ideia (o primeiro `<p>` aparece como descrição na busca).
3. Um exemplo de código mínimo e executável, com saída esperada em comentário.
4. Armadilhas comuns ou "quando usar / quando evitar", se houver.

## Código de exemplo

- Deve funcionar copiando e colando. Teste antes de enviar.
- Use `const`/`let`, nomes descritivos e comentários só onde esclarecem.
- Confira comportamento e sintaxe na documentação oficial (MDN, docs do framework) e cite a fonte no PR.
- Não use dados reais de pessoas nem chaves/tokens, nem de brincadeira.

## Acessibilidade e HTML

Um `<h1>` por página, hierarquia de títulos sem saltos, `alt` em imagens informativas, `aria-label` em botões só com ícone, contraste suficiente nos temas claro e escuro.

## Revisão

- Conteúdo técnico novo ou alterado deve ser conferido por quem revisa contra a documentação oficial.
- Mudanças de texto não devem misturar reformatação de markup: PRs pequenos, um assunto por vez.
- `npm test` precisa passar.
