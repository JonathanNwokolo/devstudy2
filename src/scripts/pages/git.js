/** git.html — abas de instalação por sistema operacional. */
document.querySelectorAll('.install-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.install-tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.install-content').forEach((c) => c.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.getAttribute('data-os'))?.classList.add('active');
  });
});

// Let keyboard users scroll long command examples when they actually overflow.
function updateScrollableCodeFocus() {
  document.querySelectorAll('.code-block code, .example code').forEach((code) => {
    if (code.scrollWidth > code.clientWidth + 1) code.tabIndex = 0;
    else code.removeAttribute('tabindex');
  });
}
window.addEventListener('resize', updateScrollableCodeFocus);
document.fonts.ready.then(updateScrollableCodeFocus);
updateScrollableCodeFocus();
