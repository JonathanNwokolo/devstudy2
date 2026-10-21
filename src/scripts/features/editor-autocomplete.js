/**
 * Autocomplete (IntelliSense) para os editores HTML/CSS da página (#htmlEditor, #cssEditor,
 * #challengeHtml, #challengeCss). Dados e classe movidos de script.js sem alteração de lógica.
 */

const autocompleteData = {
    html: [
        // Tags estruturais
        { tag: 'html', description: 'Elemento raiz do documento', snippet: '<html>\n\t$0\n</html>' },
        { tag: 'head', description: 'Metadados do documento', snippet: '<head>\n\t$0\n</head>' },
        { tag: 'body', description: 'Corpo do documento', snippet: '<body>\n\t$0\n</body>' },
        { tag: 'header', description: 'Cabeçalho da página/seção', snippet: '<header>\n\t$0\n</header>' },
        { tag: 'nav', description: 'Navegação', snippet: '<nav>\n\t$0\n</nav>' },
        { tag: 'main', description: 'Conteúdo principal', snippet: '<main>\n\t$0\n</main>' },
        { tag: 'section', description: 'Seção do documento', snippet: '<section>\n\t$0\n</section>' },
        { tag: 'article', description: 'Artigo independente', snippet: '<article>\n\t$0\n</article>' },
        { tag: 'aside', description: 'Conteúdo lateral', snippet: '<aside>\n\t$0\n</aside>' },
        { tag: 'footer', description: 'Rodapé da página/seção', snippet: '<footer>\n\t$0\n</footer>' },
        
        // Texto
        { tag: 'h1', description: 'Título principal', snippet: '<h1>$0</h1>' },
        { tag: 'h2', description: 'Subtítulo', snippet: '<h2>$0</h2>' },
        { tag: 'h3', description: 'Título nível 3', snippet: '<h3>$0</h3>' },
        { tag: 'h4', description: 'Título nível 4', snippet: '<h4>$0</h4>' },
        { tag: 'h5', description: 'Título nível 5', snippet: '<h5>$0</h5>' },
        { tag: 'h6', description: 'Título nível 6', snippet: '<h6>$0</h6>' },
        { tag: 'p', description: 'Parágrafo', snippet: '<p>$0</p>' },
        { tag: 'span', description: 'Container inline', snippet: '<span>$0</span>' },
        { tag: 'strong', description: 'Texto importante (negrito)', snippet: '<strong>$0</strong>' },
        { tag: 'em', description: 'Ênfase (itálico)', snippet: '<em>$0</em>' },
        { tag: 'b', description: 'Negrito', snippet: '<b>$0</b>' },
        { tag: 'i', description: 'Itálico', snippet: '<i>$0</i>' },
        { tag: 'u', description: 'Sublinhado', snippet: '<u>$0</u>' },
        { tag: 'mark', description: 'Texto destacado', snippet: '<mark>$0</mark>' },
        { tag: 'small', description: 'Texto pequeno', snippet: '<small>$0</small>' },
        { tag: 'del', description: 'Texto deletado', snippet: '<del>$0</del>' },
        { tag: 'ins', description: 'Texto inserido', snippet: '<ins>$0</ins>' },
        { tag: 'sub', description: 'Subscrito', snippet: '<sub>$0</sub>' },
        { tag: 'sup', description: 'Sobrescrito', snippet: '<sup>$0</sup>' },
        { tag: 'blockquote', description: 'Citação em bloco', snippet: '<blockquote>\n\t$0\n</blockquote>' },
        { tag: 'code', description: 'Código inline', snippet: '<code>$0</code>' },
        { tag: 'pre', description: 'Texto pré-formatado', snippet: '<pre>$0</pre>' },
        { tag: 'br', description: 'Quebra de linha', snippet: '<br>' },
        { tag: 'hr', description: 'Linha horizontal', snippet: '<hr>' },
        
        // Container
        { tag: 'div', description: 'Container de bloco', snippet: '<div>\n\t$0\n</div>' },
        { tag: 'div.class', description: 'Div com classe', snippet: '<div class="$1">\n\t$0\n</div>' },
        { tag: 'div#id', description: 'Div com ID', snippet: '<div id="$1">\n\t$0\n</div>' },
        
        // Links e mídia
        { tag: 'a', description: 'Link/âncora', snippet: '<a href="$1">$0</a>' },
        { tag: 'img', description: 'Imagem', snippet: '<img src="$1" alt="$0">' },
        { tag: 'video', description: 'Vídeo', snippet: '<video src="$1" controls>\n\t$0\n</video>' },
        { tag: 'audio', description: 'Áudio', snippet: '<audio src="$1" controls>\n\t$0\n</audio>' },
        { tag: 'iframe', description: 'Frame embutido', snippet: '<iframe src="$1"></iframe>' },
        { tag: 'picture', description: 'Imagem responsiva', snippet: '<picture>\n\t<source srcset="$1">\n\t<img src="$2" alt="$0">\n</picture>' },
        
        // Listas
        { tag: 'ul', description: 'Lista não ordenada', snippet: '<ul>\n\t<li>$0</li>\n</ul>' },
        { tag: 'ol', description: 'Lista ordenada', snippet: '<ol>\n\t<li>$0</li>\n</ol>' },
        { tag: 'li', description: 'Item de lista', snippet: '<li>$0</li>' },
        { tag: 'dl', description: 'Lista de definição', snippet: '<dl>\n\t<dt>$1</dt>\n\t<dd>$0</dd>\n</dl>' },
        { tag: 'dt', description: 'Termo de definição', snippet: '<dt>$0</dt>' },
        { tag: 'dd', description: 'Descrição de definição', snippet: '<dd>$0</dd>' },
        
        // Tabelas
        { tag: 'table', description: 'Tabela', snippet: '<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th>$1</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>$0</td>\n\t\t</tr>\n\t</tbody>\n</table>' },
        { tag: 'thead', description: 'Cabeçalho da tabela', snippet: '<thead>\n\t$0\n</thead>' },
        { tag: 'tbody', description: 'Corpo da tabela', snippet: '<tbody>\n\t$0\n</tbody>' },
        { tag: 'tfoot', description: 'Rodapé da tabela', snippet: '<tfoot>\n\t$0\n</tfoot>' },
        { tag: 'tr', description: 'Linha da tabela', snippet: '<tr>\n\t$0\n</tr>' },
        { tag: 'th', description: 'Célula de cabeçalho', snippet: '<th>$0</th>' },
        { tag: 'td', description: 'Célula de dados', snippet: '<td>$0</td>' },
        
        // Formulários
        { tag: 'form', description: 'Formulário', snippet: '<form action="$1" method="$2">\n\t$0\n</form>' },
        { tag: 'input', description: 'Campo de entrada', snippet: '<input type="$1" name="$2">' },
        { tag: 'input:text', description: 'Input de texto', snippet: '<input type="text" name="$1" placeholder="$0">' },
        { tag: 'input:email', description: 'Input de email', snippet: '<input type="email" name="$1" placeholder="$0">' },
        { tag: 'input:password', description: 'Input de senha', snippet: '<input type="password" name="$1" placeholder="$0">' },
        { tag: 'input:number', description: 'Input numérico', snippet: '<input type="number" name="$1">' },
        { tag: 'input:checkbox', description: 'Checkbox', snippet: '<input type="checkbox" name="$1" id="$2">' },
        { tag: 'input:radio', description: 'Radio button', snippet: '<input type="radio" name="$1" id="$2">' },
        { tag: 'input:file', description: 'Upload de arquivo', snippet: '<input type="file" name="$1">' },
        { tag: 'input:submit', description: 'Botão enviar', snippet: '<input type="submit" value="$0">' },
        { tag: 'textarea', description: 'Área de texto', snippet: '<textarea name="$1" rows="$2" cols="$3">$0</textarea>' },
        { tag: 'select', description: 'Lista suspensa', snippet: '<select name="$1">\n\t<option value="$2">$0</option>\n</select>' },
        { tag: 'option', description: 'Opção de select', snippet: '<option value="$1">$0</option>' },
        { tag: 'label', description: 'Rótulo de campo', snippet: '<label for="$1">$0</label>' },
        { tag: 'button', description: 'Botão', snippet: '<button type="$1">$0</button>' },
        { tag: 'fieldset', description: 'Grupo de campos', snippet: '<fieldset>\n\t<legend>$1</legend>\n\t$0\n</fieldset>' },
        { tag: 'legend', description: 'Título do fieldset', snippet: '<legend>$0</legend>' },
        
        // Meta
        { tag: 'meta', description: 'Metadados', snippet: '<meta name="$1" content="$0">' },
        { tag: 'meta:viewport', description: 'Viewport responsivo', snippet: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' },
        { tag: 'meta:charset', description: 'Charset UTF-8', snippet: '<meta charset="UTF-8">' },
        { tag: 'link', description: 'Link externo', snippet: '<link rel="$1" href="$0">' },
        { tag: 'link:css', description: 'Link para CSS', snippet: '<link rel="stylesheet" href="$0">' },
        { tag: 'script', description: 'Script JavaScript', snippet: '<script src="$0"></script>' },
        { tag: 'script:inline', description: 'Script inline', snippet: '<script>\n\t$0\n</script>' },
        { tag: 'style', description: 'Estilos inline', snippet: '<style>\n\t$0\n</style>' },
        { tag: 'title', description: 'Título da página', snippet: '<title>$0</title>' },
        
        // HTML5 Semântico
        { tag: 'figure', description: 'Figura com legenda', snippet: '<figure>\n\t<img src="$1" alt="$2">\n\t<figcaption>$0</figcaption>\n</figure>' },
        { tag: 'figcaption', description: 'Legenda da figura', snippet: '<figcaption>$0</figcaption>' },
        { tag: 'details', description: 'Detalhes expansíveis', snippet: '<details>\n\t<summary>$1</summary>\n\t$0\n</details>' },
        { tag: 'summary', description: 'Resumo de details', snippet: '<summary>$0</summary>' },
        { tag: 'time', description: 'Data/hora', snippet: '<time datetime="$1">$0</time>' },
        { tag: 'progress', description: 'Barra de progresso', snippet: '<progress value="$1" max="$2">$0</progress>' },
        { tag: 'meter', description: 'Medidor', snippet: '<meter value="$1" min="$2" max="$3">$0</meter>' },
        { tag: 'canvas', description: 'Área de desenho', snippet: '<canvas id="$1" width="$2" height="$3"></canvas>' },
        
        // Snippets compostos
        { tag: '!', description: 'Estrutura HTML5', snippet: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>$1</title>\n</head>\n<body>\n\t$0\n</body>\n</html>' },
        { tag: 'lorem', description: 'Texto lorem ipsum', snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }
    ],
    
    css: [
        // Layout
        { property: 'display', description: 'Tipo de exibição', values: ['flex', 'grid', 'block', 'inline', 'inline-block', 'none', 'inline-flex', 'inline-grid'] },
        { property: 'position', description: 'Tipo de posicionamento', values: ['relative', 'absolute', 'fixed', 'sticky', 'static'] },
        { property: 'top', description: 'Posição do topo', values: ['0', '50%', 'auto'] },
        { property: 'right', description: 'Posição da direita', values: ['0', '50%', 'auto'] },
        { property: 'bottom', description: 'Posição inferior', values: ['0', '50%', 'auto'] },
        { property: 'left', description: 'Posição da esquerda', values: ['0', '50%', 'auto'] },
        { property: 'z-index', description: 'Ordem de empilhamento', values: ['1', '10', '100', '999', '-1'] },
        { property: 'float', description: 'Flutuação', values: ['left', 'right', 'none'] },
        { property: 'clear', description: 'Limpar flutuação', values: ['left', 'right', 'both', 'none'] },
        { property: 'overflow', description: 'Comportamento de overflow', values: ['hidden', 'scroll', 'auto', 'visible'] },
        { property: 'overflow-x', description: 'Overflow horizontal', values: ['hidden', 'scroll', 'auto', 'visible'] },
        { property: 'overflow-y', description: 'Overflow vertical', values: ['hidden', 'scroll', 'auto', 'visible'] },
        { property: 'visibility', description: 'Visibilidade', values: ['visible', 'hidden', 'collapse'] },
        
        // Flexbox
        { property: 'flex', description: 'Propriedade flex abreviada', values: ['1', '0 0 auto', '1 1 auto'] },
        { property: 'flex-direction', description: 'Direção do flex', values: ['row', 'column', 'row-reverse', 'column-reverse'] },
        { property: 'flex-wrap', description: 'Quebra de linha flex', values: ['wrap', 'nowrap', 'wrap-reverse'] },
        { property: 'flex-flow', description: 'Direction + wrap', values: ['row wrap', 'column nowrap'] },
        { property: 'justify-content', description: 'Alinhamento horizontal', values: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'] },
        { property: 'align-items', description: 'Alinhamento vertical', values: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'] },
        { property: 'align-content', description: 'Alinhamento multi-linha', values: ['flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around'] },
        { property: 'align-self', description: 'Auto-alinhamento', values: ['auto', 'flex-start', 'flex-end', 'center', 'stretch'] },
        { property: 'flex-grow', description: 'Fator de crescimento', values: ['0', '1', '2'] },
        { property: 'flex-shrink', description: 'Fator de encolhimento', values: ['0', '1'] },
        { property: 'flex-basis', description: 'Tamanho base', values: ['auto', '0', '100%', '200px'] },
        { property: 'gap', description: 'Espaçamento entre itens', values: ['0.5rem', '1rem', '2rem', '10px', '20px'] },
        { property: 'row-gap', description: 'Espaço entre linhas', values: ['0.5rem', '1rem', '2rem'] },
        { property: 'column-gap', description: 'Espaço entre colunas', values: ['0.5rem', '1rem', '2rem'] },
        
        // Grid
        { property: 'grid', description: 'Propriedade grid abreviada', values: [] },
        { property: 'grid-template-columns', description: 'Colunas do grid', values: ['1fr', 'repeat(3, 1fr)', 'repeat(auto-fit, minmax(250px, 1fr))', '200px 1fr 200px'] },
        { property: 'grid-template-rows', description: 'Linhas do grid', values: ['auto', '1fr', 'repeat(3, 1fr)', 'auto 1fr auto'] },
        { property: 'grid-template-areas', description: 'Áreas nomeadas', values: [] },
        { property: 'grid-column', description: 'Posição em colunas', values: ['1 / 2', '1 / -1', 'span 2'] },
        { property: 'grid-row', description: 'Posição em linhas', values: ['1 / 2', '1 / -1', 'span 2'] },
        { property: 'grid-area', description: 'Área do grid', values: [] },
        { property: 'place-items', description: 'Alinhamento de itens', values: ['center', 'start', 'end', 'stretch'] },
        { property: 'place-content', description: 'Alinhamento de conteúdo', values: ['center', 'start', 'end', 'space-between'] },
        
        // Box Model
        { property: 'width', description: 'Largura', values: ['100%', '50%', 'auto', '100px', '100vw', 'fit-content', 'max-content', 'min-content'] },
        { property: 'height', description: 'Altura', values: ['100%', '50%', 'auto', '100px', '100vh', 'fit-content'] },
        { property: 'min-width', description: 'Largura mínima', values: ['0', '100px', '100%'] },
        { property: 'max-width', description: 'Largura máxima', values: ['100%', '1200px', '800px', 'none'] },
        { property: 'min-height', description: 'Altura mínima', values: ['0', '100px', '100vh'] },
        { property: 'max-height', description: 'Altura máxima', values: ['100%', '100vh', 'none'] },
        { property: 'margin', description: 'Margem externa', values: ['0', 'auto', '1rem', '0 auto', '1rem 2rem', '1rem 2rem 1rem 2rem'] },
        { property: 'margin-top', description: 'Margem superior', values: ['0', 'auto', '1rem'] },
        { property: 'margin-right', description: 'Margem direita', values: ['0', 'auto', '1rem'] },
        { property: 'margin-bottom', description: 'Margem inferior', values: ['0', 'auto', '1rem'] },
        { property: 'margin-left', description: 'Margem esquerda', values: ['0', 'auto', '1rem'] },
        { property: 'padding', description: 'Preenchimento interno', values: ['0', '1rem', '1rem 2rem', '1rem 2rem 1rem 2rem'] },
        { property: 'padding-top', description: 'Preenchimento superior', values: ['0', '1rem'] },
        { property: 'padding-right', description: 'Preenchimento direito', values: ['0', '1rem'] },
        { property: 'padding-bottom', description: 'Preenchimento inferior', values: ['0', '1rem'] },
        { property: 'padding-left', description: 'Preenchimento esquerdo', values: ['0', '1rem'] },
        { property: 'box-sizing', description: 'Modelo de caixa', values: ['border-box', 'content-box'] },
        
        // Cores e Fundo
        { property: 'color', description: 'Cor do texto', values: ['#333', '#fff', 'white', 'black', 'inherit', 'currentColor'] },
        { property: 'background', description: 'Fundo (abreviado)', values: ['#fff', 'transparent', 'linear-gradient(135deg, #667eea, #764ba2)', 'url()'] },
        { property: 'background-color', description: 'Cor de fundo', values: ['#fff', '#f5f5f5', 'transparent', 'rgba(0,0,0,0.5)'] },
        { property: 'background-image', description: 'Imagem de fundo', values: ['url()', 'linear-gradient()', 'radial-gradient()', 'none'] },
        { property: 'background-size', description: 'Tamanho do fundo', values: ['cover', 'contain', 'auto', '100% 100%'] },
        { property: 'background-position', description: 'Posição do fundo', values: ['center', 'top', 'bottom', 'left', 'right', '50% 50%'] },
        { property: 'background-repeat', description: 'Repetição do fundo', values: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'] },
        { property: 'background-attachment', description: 'Fixação do fundo', values: ['scroll', 'fixed', 'local'] },
        { property: 'opacity', description: 'Opacidade', values: ['1', '0.9', '0.8', '0.5', '0'] },
        
        // Bordas
        { property: 'border', description: 'Borda (abreviado)', values: ['1px solid #ccc', '2px solid #333', 'none', '1px dashed #999'] },
        { property: 'border-width', description: 'Largura da borda', values: ['1px', '2px', '3px'] },
        { property: 'border-style', description: 'Estilo da borda', values: ['solid', 'dashed', 'dotted', 'double', 'none'] },
        { property: 'border-color', description: 'Cor da borda', values: ['#ccc', '#333', 'transparent'] },
        { property: 'border-radius', description: 'Arredondamento', values: ['4px', '8px', '16px', '50%', '9999px'] },
        { property: 'border-top', description: 'Borda superior', values: ['1px solid #ccc', 'none'] },
        { property: 'border-right', description: 'Borda direita', values: ['1px solid #ccc', 'none'] },
        { property: 'border-bottom', description: 'Borda inferior', values: ['1px solid #ccc', 'none'] },
        { property: 'border-left', description: 'Borda esquerda', values: ['1px solid #ccc', 'none'] },
        { property: 'outline', description: 'Contorno', values: ['none', '2px solid #667eea', '1px dashed #333'] },
        { property: 'outline-offset', description: 'Deslocamento do contorno', values: ['0', '2px', '4px'] },
        
        // Sombras
        { property: 'box-shadow', description: 'Sombra da caixa', values: ['0 2px 10px rgba(0,0,0,0.1)', '0 4px 20px rgba(0,0,0,0.15)', '0 10px 30px rgba(0,0,0,0.2)', 'none', 'inset 0 2px 5px rgba(0,0,0,0.1)'] },
        { property: 'text-shadow', description: 'Sombra do texto', values: ['1px 1px 2px rgba(0,0,0,0.3)', '2px 2px 4px rgba(0,0,0,0.2)', 'none'] },
        
        // Tipografia
        { property: 'font-family', description: 'Família da fonte', values: ["'Inter', sans-serif", "'Arial', sans-serif", "'Georgia', serif", "'Fira Code', monospace", 'inherit'] },
        { property: 'font-size', description: 'Tamanho da fonte', values: ['1rem', '1.2rem', '1.5rem', '2rem', '14px', '16px', '18px', '24px'] },
        { property: 'font-weight', description: 'Peso da fonte', values: ['normal', 'bold', '300', '400', '500', '600', '700', '800'] },
        { property: 'font-style', description: 'Estilo da fonte', values: ['normal', 'italic', 'oblique'] },
        { property: 'line-height', description: 'Altura da linha', values: ['1', '1.5', '1.6', '2', 'normal'] },
        { property: 'letter-spacing', description: 'Espaçamento entre letras', values: ['normal', '0.5px', '1px', '2px', '-0.5px'] },
        { property: 'word-spacing', description: 'Espaçamento entre palavras', values: ['normal', '2px', '5px'] },
        { property: 'text-align', description: 'Alinhamento do texto', values: ['left', 'center', 'right', 'justify'] },
        { property: 'text-decoration', description: 'Decoração do texto', values: ['none', 'underline', 'line-through', 'overline'] },
        { property: 'text-transform', description: 'Transformação do texto', values: ['none', 'uppercase', 'lowercase', 'capitalize'] },
        { property: 'text-indent', description: 'Indentação do texto', values: ['0', '1rem', '2rem'] },
        { property: 'white-space', description: 'Espaços em branco', values: ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line'] },
        { property: 'word-break', description: 'Quebra de palavras', values: ['normal', 'break-all', 'keep-all', 'break-word'] },
        { property: 'text-overflow', description: 'Overflow de texto', values: ['clip', 'ellipsis'] },
        { property: 'vertical-align', description: 'Alinhamento vertical', values: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom'] },
        
        // Transformações
        { property: 'transform', description: 'Transformações 2D/3D', values: ['translateX(10px)', 'translateY(10px)', 'translate(-50%, -50%)', 'scale(1.1)', 'rotate(45deg)', 'skew(10deg)', 'none'] },
        { property: 'transform-origin', description: 'Origem da transformação', values: ['center', 'top left', 'top right', 'bottom left', 'bottom right', '50% 50%'] },
        { property: 'transform-style', description: 'Estilo 3D', values: ['flat', 'preserve-3d'] },
        { property: 'perspective', description: 'Perspectiva 3D', values: ['none', '500px', '1000px', '1500px'] },
        { property: 'backface-visibility', description: 'Visibilidade da face traseira', values: ['visible', 'hidden'] },
        
        // Transições e Animações
        { property: 'transition', description: 'Transição (abreviado)', values: ['all 0.3s ease', 'all 0.3s', 'transform 0.3s ease', 'opacity 0.3s ease', 'none'] },
        { property: 'transition-property', description: 'Propriedade da transição', values: ['all', 'transform', 'opacity', 'background-color', 'color', 'none'] },
        { property: 'transition-duration', description: 'Duração da transição', values: ['0.3s', '0.5s', '1s', '200ms'] },
        { property: 'transition-timing-function', description: 'Curva de tempo', values: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'cubic-bezier(0.4, 0, 0.2, 1)'] },
        { property: 'transition-delay', description: 'Atraso da transição', values: ['0s', '0.1s', '0.2s', '0.5s'] },
        { property: 'animation', description: 'Animação (abreviado)', values: ['spin 1s linear infinite', 'fade 0.5s ease forwards', 'bounce 1s ease infinite'] },
        { property: 'animation-name', description: 'Nome da animação', values: [] },
        { property: 'animation-duration', description: 'Duração da animação', values: ['0.5s', '1s', '2s'] },
        { property: 'animation-timing-function', description: 'Curva de tempo', values: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'] },
        { property: 'animation-delay', description: 'Atraso da animação', values: ['0s', '0.2s', '0.5s', '1s'] },
        { property: 'animation-iteration-count', description: 'Número de iterações', values: ['1', '2', '3', 'infinite'] },
        { property: 'animation-direction', description: 'Direção da animação', values: ['normal', 'reverse', 'alternate', 'alternate-reverse'] },
        { property: 'animation-fill-mode', description: 'Modo de preenchimento', values: ['none', 'forwards', 'backwards', 'both'] },
        { property: 'animation-play-state', description: 'Estado da animação', values: ['running', 'paused'] },
        
        // Cursor e Interação
        { property: 'cursor', description: 'Cursor do mouse', values: ['pointer', 'default', 'grab', 'grabbing', 'not-allowed', 'wait', 'text', 'move', 'crosshair'] },
        { property: 'pointer-events', description: 'Eventos de ponteiro', values: ['auto', 'none'] },
        { property: 'user-select', description: 'Seleção de texto', values: ['auto', 'none', 'text', 'all'] },
        { property: 'resize', description: 'Redimensionamento', values: ['none', 'both', 'horizontal', 'vertical'] },
        
        // Filtros
        { property: 'filter', description: 'Filtros visuais', values: ['blur(5px)', 'brightness(1.2)', 'contrast(1.5)', 'grayscale(100%)', 'saturate(2)', 'sepia(100%)', 'none'] },
        { property: 'backdrop-filter', description: 'Filtro de fundo', values: ['blur(10px)', 'blur(20px)', 'none'] },
        { property: 'mix-blend-mode', description: 'Modo de mesclagem', values: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten'] },
        
        // Object
        { property: 'object-fit', description: 'Ajuste de objeto', values: ['cover', 'contain', 'fill', 'none', 'scale-down'] },
        { property: 'object-position', description: 'Posição do objeto', values: ['center', 'top', 'bottom', 'left', 'right', '50% 50%'] },
        
        // Clip
        { property: 'clip-path', description: 'Máscara de recorte', values: ['circle(50%)', 'inset(0)', 'polygon(50% 0%, 100% 100%, 0% 100%)', 'none'] },
        
        // Scroll
        { property: 'scroll-behavior', description: 'Comportamento de rolagem', values: ['auto', 'smooth'] },
        { property: 'scroll-snap-type', description: 'Tipo de snap', values: ['none', 'x mandatory', 'y mandatory', 'both mandatory'] },
        { property: 'overscroll-behavior', description: 'Comportamento de overscroll', values: ['auto', 'contain', 'none'] },
        
        // Aspect Ratio
        { property: 'aspect-ratio', description: 'Proporção', values: ['16/9', '4/3', '1/1', '3/2', 'auto'] },
        
        // Container Queries (moderno)
        { property: 'container-type', description: 'Tipo de container', values: ['inline-size', 'size', 'normal'] },
        { property: 'container-name', description: 'Nome do container', values: [] }
    ]
};

class Autocomplete {
    constructor(textarea, type = 'html') {
        this.textarea = textarea;
        this.type = type;
        this.popup = null;
        this.selectedIndex = 0;
        this.suggestions = [];
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        // Criar popup de sugestões
        this.createPopup();
        
        // Eventos
        this.textarea.addEventListener('input', (e) => this.handleInput(e));
        this.textarea.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.textarea.addEventListener('blur', () => setTimeout(() => this.hide(), 150));
        this.textarea.addEventListener('click', () => this.hide());
    }
    
    createPopup() {
        this.popup = document.createElement('div');
        this.popup.className = 'autocomplete-popup';
        this.popup.style.cssText = `
            position: absolute;
            background: var(--bg-primary, #fff);
            border: 1px solid var(--border-color, #e0e0e0);
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            max-height: 300px;
            overflow-y: auto;
            z-index: 10000;
            display: none;
            min-width: 280px;
            max-width: 400px;
        `;
        document.body.appendChild(this.popup);
    }
    
    handleInput(e) {
        const cursorPos = this.textarea.selectionStart;
        const text = this.textarea.value;
        const beforeCursor = text.substring(0, cursorPos);
        
        // Detectar contexto
        let query = '';
        let contextType = this.type;
        
        if (this.type === 'html') {
            // Procurar por < seguido de texto
            const tagMatch = beforeCursor.match(/<([a-z0-9:!]*)$/i);
            if (tagMatch) {
                query = tagMatch[1];
                contextType = 'htmlTag';
            }
        } else if (this.type === 'css') {
            // Procurar por propriedade CSS
            const propMatch = beforeCursor.match(/(?:^|[{;}\n])\s*([a-z-]*)$/i);
            if (propMatch) {
                query = propMatch[1];
                contextType = 'cssProperty';
            }
            
            // Procurar por valor CSS após :
            const valueMatch = beforeCursor.match(/:\s*([a-z0-9#()-]*)$/i);
            if (valueMatch) {
                query = valueMatch[1];
                contextType = 'cssValue';
                
                // Encontrar a propriedade relacionada
                const propForValue = beforeCursor.match(/([a-z-]+)\s*:\s*[^;]*$/i);
                if (propForValue) {
                    this.currentProperty = propForValue[1];
                }
            }
        }
        
        if (query.length === 0 && contextType !== 'cssValue') {
            this.hide();
            return;
        }
        
        this.search(query, contextType);
    }
    
    search(query, contextType) {
        this.suggestions = [];
        
        if (contextType === 'htmlTag') {
            // Buscar tags HTML
            this.suggestions = autocompleteData.html
                .filter(item => item.tag.toLowerCase().startsWith(query.toLowerCase()))
                .slice(0, 10)
                .map(item => ({
                    label: item.tag,
                    description: item.description,
                    snippet: item.snippet,
                    type: 'tag',
                    icon: '🏷️'
                }));
        } else if (contextType === 'cssProperty') {
            // Buscar propriedades CSS
            this.suggestions = autocompleteData.css
                .filter(item => item.property.toLowerCase().startsWith(query.toLowerCase()))
                .slice(0, 10)
                .map(item => ({
                    label: item.property,
                    description: item.description,
                    snippet: item.property + ': ',
                    type: 'property',
                    icon: '🎨',
                    values: item.values
                }));
        } else if (contextType === 'cssValue') {
            // Buscar valores CSS para a propriedade atual
            const propData = autocompleteData.css.find(
                item => item.property.toLowerCase() === this.currentProperty?.toLowerCase()
            );
            
            if (propData && propData.values) {
                this.suggestions = propData.values
                    .filter(val => val.toLowerCase().startsWith(query.toLowerCase()))
                    .slice(0, 10)
                    .map(val => ({
                        label: val,
                        description: `Valor para ${this.currentProperty}`,
                        snippet: val,
                        type: 'value',
                        icon: '✨'
                    }));
            }
        }
        
        if (this.suggestions.length > 0) {
            this.show();
        } else {
            this.hide();
        }
    }
    
    show() {
        this.selectedIndex = 0;
        this.renderSuggestions();
        this.positionPopup();
        this.popup.style.display = 'block';
        this.isVisible = true;
    }
    
    hide() {
        this.popup.style.display = 'none';
        this.isVisible = false;
    }
    
    renderSuggestions() {
        this.popup.innerHTML = this.suggestions.map((item, index) => `
            <div class="autocomplete-item ${index === this.selectedIndex ? 'selected' : ''}" 
                 data-index="${index}"
                 style="
                    padding: 10px 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-bottom: 1px solid var(--border-color, #eee);
                    transition: background 0.15s;
                    ${index === this.selectedIndex ? 'background: var(--primary, #667eea); color: white;' : ''}
                 "
                 onmouseover="this.style.background='var(--primary, #667eea)';this.style.color='white';"
                 onmouseout="this.style.background='${index === this.selectedIndex ? 'var(--primary, #667eea)' : ''}';this.style.color='${index === this.selectedIndex ? 'white' : ''}';"
                 onclick="this.autocompleteInstance?.select(${index})">
                <span style="font-size: 1.1em;">${item.icon}</span>
                <div style="flex: 1; overflow: hidden;">
                    <div style="font-weight: 600; font-family: 'Fira Code', monospace; font-size: 0.95em;">
                        ${this.highlightMatch(item.label)}
                    </div>
                    <div style="font-size: 0.8em; opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${item.description}
                    </div>
                </div>
                <span style="font-size: 0.75em; opacity: 0.5; text-transform: uppercase;">
                    ${item.type}
                </span>
            </div>
        `).join('');
        
        // Adicionar event listeners aos itens
        this.popup.querySelectorAll('.autocomplete-item').forEach((el, index) => {
            el.addEventListener('click', () => this.select(index));
        });
    }
    
    highlightMatch(text) {
        return text; // Simplificado - poderia destacar a parte que faz match
    }
    
    positionPopup() {
        const rect = this.textarea.getBoundingClientRect();
        const cursorPos = this.getCursorCoordinates();
        
        let left = rect.left + cursorPos.left;
        let top = rect.top + cursorPos.top + 20;
        
        // Ajustar se sair da tela
        const popupRect = this.popup.getBoundingClientRect();
        if (left + 300 > window.innerWidth) {
            left = window.innerWidth - 320;
        }
        if (top + 300 > window.innerHeight) {
            top = rect.top + cursorPos.top - 310;
        }
        
        this.popup.style.left = left + 'px';
        this.popup.style.top = top + window.scrollY + 'px';
    }
    
    getCursorCoordinates() {
        // Criar elemento temporário para medir posição do cursor
        const mirror = document.createElement('div');
        const style = getComputedStyle(this.textarea);
        
        mirror.style.cssText = `
            position: absolute;
            top: -9999px;
            left: -9999px;
            width: ${this.textarea.offsetWidth}px;
            height: auto;
            font-family: ${style.fontFamily};
            font-size: ${style.fontSize};
            line-height: ${style.lineHeight};
            padding: ${style.padding};
            white-space: pre-wrap;
            word-wrap: break-word;
        `;
        
        const textBeforeCursor = this.textarea.value.substring(0, this.textarea.selectionStart);
        mirror.textContent = textBeforeCursor;
        
        const marker = document.createElement('span');
        marker.textContent = '|';
        mirror.appendChild(marker);
        
        document.body.appendChild(mirror);
        
        const markerRect = marker.getBoundingClientRect();
        const mirrorRect = mirror.getBoundingClientRect();
        
        const coordinates = {
            left: markerRect.left - mirrorRect.left,
            top: markerRect.top - mirrorRect.top - this.textarea.scrollTop
        };
        
        document.body.removeChild(mirror);
        
        return coordinates;
    }
    
    handleKeydown(e) {
        if (!this.isVisible) return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
                this.renderSuggestions();
                this.scrollToSelected();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.renderSuggestions();
                this.scrollToSelected();
                break;
                
            case 'Enter':
            case 'Tab':
                if (this.suggestions.length > 0) {
                    e.preventDefault();
                    this.select(this.selectedIndex);
                }
                break;
                
            case 'Escape':
                this.hide();
                break;
        }
    }
    
    scrollToSelected() {
        const selectedEl = this.popup.querySelector('.autocomplete-item.selected');
        if (selectedEl) {
            selectedEl.scrollIntoView({ block: 'nearest' });
        }
    }
    
    select(index) {
        const item = this.suggestions[index];
        if (!item) return;
        
        const cursorPos = this.textarea.selectionStart;
        const text = this.textarea.value;
        const beforeCursor = text.substring(0, cursorPos);
        const afterCursor = text.substring(cursorPos);
        
        let insertText = item.snippet;
        let newCursorPos = cursorPos;
        
        // Encontrar onde começou a digitação
        let startPos = cursorPos;
        
        if (this.type === 'html') {
            // Encontrar o < inicial da tag
            const tagStart = beforeCursor.lastIndexOf('<');
            if (tagStart !== -1) {
                startPos = tagStart;
            }
        } else if (this.type === 'css') {
            if (item.type === 'property') {
                // Encontrar início da propriedade
                const match = beforeCursor.match(/([a-z-]*)$/i);
                if (match) {
                    startPos = cursorPos - match[1].length;
                }
            } else if (item.type === 'value') {
                // Encontrar início do valor (após :)
                const match = beforeCursor.match(/:\s*([a-z0-9#()-]*)$/i);
                if (match) {
                    startPos = cursorPos - match[1].length;
                }
            }
        }
        
        // Processar snippet ($0 marca posição do cursor)
        const cursorMarker = insertText.indexOf('$0');
        if (cursorMarker !== -1) {
            insertText = insertText.replace('$0', '');
            newCursorPos = startPos + cursorMarker;
        } else {
            newCursorPos = startPos + insertText.length;
        }
        
        // Remover outros marcadores de posição ($1, $2, etc)
        insertText = insertText.replace(/\$\d/g, '');
        
        // Inserir texto
        this.textarea.value = text.substring(0, startPos) + insertText + afterCursor;
        this.textarea.selectionStart = this.textarea.selectionEnd = newCursorPos;
        
        // Disparar evento de input para atualizar preview
        this.textarea.dispatchEvent(new Event('input', { bubbles: true }));
        
        this.hide();
        this.textarea.focus();
    }
}

// Inicializa o autocomplete nos editores existentes na página (idempotente).
export function initEditorAutocomplete() {
    const editors = [
        ['htmlEditor', 'html'],
        ['cssEditor', 'css'],
        ['challengeHtml', 'html'],
        ['challengeCss', 'css'],
    ];

    editors.forEach(([id, type]) => {
        const el = document.getElementById(id);
        if (el && !el._autocomplete) {
            el._autocomplete = new Autocomplete(el, type);
        }
    });
}
