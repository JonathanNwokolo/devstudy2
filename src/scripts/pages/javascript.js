/** javascript.html — demonstração de event listeners (botão e campo de texto). */
const demoBtn = document.getElementById('demoBtn');
const demoInput = document.getElementById('demoInput');
const demoOutput = document.getElementById('demoOutput');

/** Monta "<emoji> <prefixo> <strong>valor</strong> <sufixo>" sem interpretar o texto como HTML. */
function show(prefix, strong, suffix, color) {
  const bold = document.createElement('strong');
  bold.textContent = strong;
  demoOutput.replaceChildren(prefix, bold, suffix);
  demoOutput.style.color = color;
}

if (demoBtn && demoOutput) {
  let clickCount = 0;
  demoBtn.addEventListener('click', () => {
    clickCount++;
    show('🎉 Você clicou ', String(clickCount), ` vez${clickCount > 1 ? 'es' : ''}!`, '#667eea');
  });
}

if (demoInput && demoOutput) {
  demoInput.addEventListener('input', (e) => {
    const texto = e.target.value;
    if (texto) {
      show('📝 Você digitou: ', `"${texto}"`, ` (${texto.length} caracteres)`, '#48bb78');
    }
  });
}
