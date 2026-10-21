/**
 * Playground de Flexbox (index.html, css.html). Os <select> chamam updateFlexDemo() por
 * handler inline (onchange), por isso a função é exposta em window.
 */

export function initFlexPlayground() {
    window.updateFlexDemo = function () {
        const container = document.getElementById('flexDemoContainer');
        const justifyContent = document.getElementById('justifyContent');
        const alignItems = document.getElementById('alignItems');
        const flexDirection = document.getElementById('flexDirection');
        const flexGap = document.getElementById('flexGap');
        const gapValue = document.getElementById('gapValue');
        const codeOutput = document.getElementById('flexCodeOutput');
        
        if (!container) return;
        
        // Aplica os estilos
        container.style.justifyContent = justifyContent.value;
        container.style.alignItems = alignItems.value;
        container.style.flexDirection = flexDirection.value;
        container.style.gap = flexGap.value + 'px';
        
        // Atualiza o display do gap
        gapValue.textContent = flexGap.value + 'px';
        
        // Atualiza o código exibido
        codeOutput.innerHTML = `<pre><code>.container {
    display: flex;
    justify-content: ${justifyContent.value};
    align-items: ${alignItems.value};
    flex-direction: ${flexDirection.value};
    gap: ${flexGap.value}px;
}</code></pre>`;
    };
}
