export function initStudyNavigation() {
  const toc = document.getElementById('studyToc');
  if (!toc) return;

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.study-rail-left a[href]').forEach((link) => {
    if (link.getAttribute('href') === current) link.setAttribute('aria-current', 'page');
  });

  const headings = [...document.querySelectorAll('main h2[id], main section[id] > .container > .section-header h2, main section[id] > h2')].slice(0, 16);
  headings.forEach((heading, index) => {
    if (!heading.id) heading.id = `study-section-${index + 1}`;
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    toc.append(link);
  });
  if (!toc.children.length) {
    const link = document.createElement('a');
    link.href = '#main-content';
    link.textContent = 'Voltar ao início';
    toc.append(link);
  }
}
