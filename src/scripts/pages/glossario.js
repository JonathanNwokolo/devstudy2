/** glossario.html — filtro por categoria. */
const filters = document.querySelectorAll('.glossary-filter');
const items = document.querySelectorAll('.glossary-item');
const empty = document.getElementById('glossaryEmpty');
let activeCat = 'all';

function apply() {
  let visible = 0;

  items.forEach((item) => {
    const matchesCat = activeCat === 'all' || item.dataset.cat === activeCat;
    const show = matchesCat;
    item.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  empty.style.display = visible === 0 ? 'block' : 'none';
}

if (empty) {
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      apply();
    });
  });
}
