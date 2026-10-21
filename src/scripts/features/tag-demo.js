/**
 * Demo de tags HTML (index.html): os botões chamam showTagDemo(tag) por handler inline (onclick).
 * Hoje apenas registra a demonstração no console — comportamento preservado.
 */

export function initTagDemo() {
  window.showTagDemo = function (tagName) {
    // Cria um modal simples mostrando mais informações sobre a tag
    const demos = {
        'h1-h6': {
            title: 'Títulos H1-H6',
            html: '<h1>Título H1</h1>\n<h2>Título H2</h2>\n<h3>Título H3</h3>\n<h4>Título H4</h4>\n<h5>Título H5</h5>\n<h6>Título H6</h6>',
            desc: 'Use h1 para o título principal (apenas 1 por página), h2 para seções, h3 para subseções, etc.'
        },
        'p': {
            title: 'Parágrafo',
            html: '<p>Este é um parágrafo de texto.</p>\n<p>Este é outro parágrafo.</p>',
            desc: 'A tag <p> define um parágrafo. Navegadores adicionam margem automaticamente.'
        },
        'strong': {
            title: 'Texto Importante',
            html: '<p>Este texto é <strong>muito importante</strong>!</p>',
            desc: 'Use <strong> para indicar importância semântica, não apenas visual.'
        },
        'em': {
            title: 'Ênfase',
            html: '<p>Você <em>realmente</em> precisa fazer isso!</p>',
            desc: 'Use <em> para dar ênfase ao texto. Leitores de tela mudam a entonação.'
        },
        'mark': {
            title: 'Texto Marcado',
            html: '<p>O resultado <mark>destacado</mark> aqui.</p>',
            desc: 'Use <mark> para destacar texto relevante no contexto atual.'
        },
        'blockquote': {
            title: 'Citação em Bloco',
            html: '<blockquote>\n  <p>"A vida é o que acontece enquanto você está ocupado fazendo outros planos."</p>\n  <cite>— John Lennon</cite>\n</blockquote>',
            desc: 'Use para citações longas. A tag <cite> indica a fonte.'
        }
    };
    
    const demo = demos[tagName];
    if (!demo) return;
    
    // Por enquanto, apenas mostra um alert estilizado
    console.log(`Demo: ${demo.title}`, demo);
};

}
