const navbarToggle = document.querySelector('.navbar__toggle');
const mobileNav = document.querySelector('.navbar__mobile');
const navbarDismiss = document.querySelector('.navbar__dismiss');
const backdrop = document.querySelector('.backdrop');

const showMobileNav = () => {
	mobileNav.classList.remove('navbar__mobile--hide');
	backdrop.classList.remove('hidden');
};

const hideMobileNav = () => {
	mobileNav.classList.add('navbar__mobile--hide');
	backdrop.classList.add('hidden');
};

navbarToggle.addEventListener('click', showMobileNav);
backdrop.addEventListener('click', hideMobileNav);
navbarDismiss.addEventListener('click', hideMobileNav);
