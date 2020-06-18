const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const modalBtn = document.querySelector('.modal-btn');

const showPopup = (title, msg) => {
	modalTitle.innerText = title;
	modalBody.innerText = msg;

	backdrop.classList.remove('hidden');
	modal.classList.remove('hidden');
};

const closePopup = () => {
	modal.classList.add('hidden');
	backdrop.classList.add('hidden');
};

modalBtn.addEventListener('click', closePopup);
backdrop.addEventListener('click', closePopup);
