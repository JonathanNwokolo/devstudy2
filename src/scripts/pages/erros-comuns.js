/** erros-comuns.html — filtro por categoria. */
document.querySelectorAll('.category-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.category-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.category;
    document.querySelectorAll('.erros-section').forEach((section) => {
      section.style.display = category === 'all' || section.dataset.category === category ? 'block' : 'none';
    });
  });
});
