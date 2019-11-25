//-----------NAV-----------
const mobileNav = document.querySelector('.nav_side--right')
const navBtn = document.querySelector('.nav_toggle')
const navLines = Array.from(document.getElementsByClassName('toggle_line'));
const navItems = Array.from(document.getElementsByClassName('nav_item--header'))

navBtn.addEventListener('click', () => {
    navLines.forEach(line => line.classList.toggle('active'));
    navBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
    navItems.forEach(item => item.classList.toggle('active'))
})