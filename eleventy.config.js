// Build estático do DevStudy (Eleventy). Entrada: src/ · Saída: _site/
// Mantém as URLs públicas (/index.html, /git.html, …) e as pastas /css, /js e /content.
const fs = require('node:fs');
const path = require('node:path');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    'src/styles': 'css',
    'src/scripts': 'js',
    'src/assets': 'assets',
  });

  // Depois de cada build: limpeza de arquivos que só servem ao desenvolvimento.
  eleventyConfig.on('eleventy.after', async ({ dir }) => {
    // src/scripts/package.json ({"type":"module"}) existe para o Node/testes tratarem os .js como ESM.
    fs.rmSync(path.join(dir.output, 'js', 'package.json'), { force: true });
  });

  return {
    dir: { input: 'src', output: '_site', includes: 'components', layouts: 'layouts', data: '_data' },
    // As páginas são HTML puro (+ front matter): sem pré-processamento, o conteúdo
    // (ex.: exemplos Vue com {{ }}) é copiado como está.
    htmlTemplateEngine: false,
    markdownTemplateEngine: false,
    templateFormats: ['html'],
  };
};
