/** glossario.html — filtro por categoria + busca de termos. */
const search = document.getElementById('glossarySearch');
const filters = document.querySelectorAll('.glossary-filter');
const items = document.querySelectorAll('.glossary-item');
const empty = document.getElementById('glossaryEmpty');
let activeCat = 'all';

function apply() {
  const term = search.value.trim().toLowerCase();
  let visible = 0;

  items.forEach((item) => {
    const matchesCat = activeCat === 'all' || item.dataset.cat === activeCat;
    const matchesText = item.textContent.toLowerCase().includes(term);
    const show = matchesCat && matchesText;
    item.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  empty.style.display = visible === 0 ? 'block' : 'none';
}

if (search && empty) {
  search.addEventListener('input', apply);
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      apply();
    });
  });
}
