var btn = document.getElementById('js-nav-trigger');
btn.addEventListener('click', showMenu);

var menu = document.getElementById('js-top-menu');


function showMenu(evt) {
  evt.preventDefault();
  menu.classList.toggle('is-visible');
}