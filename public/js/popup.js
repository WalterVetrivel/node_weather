const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal__title');
const modalBody = document.querySelector('.modal__body');
const modalBtn = document.querySelector('.modal__btn');
const toast = document.querySelector('.toast');
const toastMessage = document.querySelector('.toast__message');
const toastDismiss = document.querySelector('.toast__dismiss');

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

const showToast = (msg, isError = true) => {
	toastMessage.innerText = msg;
	toast.classList.add('toast--error');
	toast.classList.remove('toast--hide');

	setTimeout(removeToast, 5000);
};

const removeToast = () => {
	toast.classList.add('toast--hide');
};

modalBtn.addEventListener('click', closePopup);
backdrop.addEventListener('click', closePopup);
toastDismiss.addEventListener('click', removeToast);
