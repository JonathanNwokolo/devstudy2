/**
 * Editor de código ao vivo (#htmlEditor/#cssEditor + iframe #previewFrame).
 * O iframe usa sandbox sem allow-same-origin: o código do usuário não alcança o site.
 * resetEditor() é chamado por handler inline (onclick) e fica exposto em window.
 */

export function initLiveEditor() {
    const htmlEditor = document.getElementById('htmlEditor');
    const cssEditor = document.getElementById('cssEditor');
    const previewFrame = document.getElementById('previewFrame');
    const editorTabs = document.querySelectorAll('.editor-tab');
    
    if (!htmlEditor || !cssEditor || !previewFrame) return;
    
    // Trocar entre abas
    editorTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            editorTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabType = tab.getAttribute('data-tab');
            if (tabType === 'html') {
                htmlEditor.style.display = 'block';
                cssEditor.style.display = 'none';
            } else {
                htmlEditor.style.display = 'none';
                cssEditor.style.display = 'block';
            }
        });
    });
    
    // Atualizar preview
    function updatePreview() {
        const html = htmlEditor.value;
        const css = cssEditor.value;
        
        const previewContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Inter', -apple-system, sans-serif;
                        padding: 20px;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    ${css}
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;
        
        // O iframe usa sandbox="allow-scripts allow-modals" (sem allow-same-origin): o código do usuário
        // roda em origem opaca e não alcança localStorage/DOM do site. Por isso srcdoc,
        // já que a página pai não pode mais escrever em contentDocument.
        previewFrame.srcdoc = previewContent;
    }
    
    // Debounce para performance
    let debounceTimer;
    function debounceUpdate() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updatePreview, 300);
    }
    
    htmlEditor.addEventListener('input', debounceUpdate);
    cssEditor.addEventListener('input', debounceUpdate);
    
    // Inicializa o preview
    updatePreview();
    
    // Função global para resetar o editor
    window.resetEditor = function() {
        htmlEditor.value = `<div class="card">
    <h2>Meu Cartão</h2>
    <p>Este é um exemplo interativo!</p>
    <button>Clique aqui</button>
</div>`;
        
        cssEditor.value = `.card {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

h2 {
    margin-bottom: 1rem;
}

button {
    background: white;
    color: #5145b5;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s;
}

button:hover {
    transform: scale(1.1);
}`;
        
        updatePreview();
    };
}
