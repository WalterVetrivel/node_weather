const navbarToggle = document.querySelector('.navbar-toggle');
const mobileNav = document.querySelector('.navbar-mobile');
const navbarDismiss = document.querySelector('.navbar-dismiss');
const backdrop = document.querySelector('.backdrop');

const showMobileNav = () => {
	mobileNav.classList.remove('hide-nav');
	backdrop.classList.remove('hidden');
};

const hideMobileNav = () => {
	mobileNav.classList.add('hide-nav');
	backdrop.classList.add('hidden');
};

navbarToggle.addEventListener('click', showMobileNav);
backdrop.addEventListener('click', hideMobileNav);
navbarDismiss.addEventListener('click', hideMobileNav);
