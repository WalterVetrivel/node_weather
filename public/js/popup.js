const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const modalBtn = document.querySelector('.modal-btn');
const toast = document.querySelector('.toast');
const toastMessage = document.querySelector('.toast-message');
const toastDismiss = document.querySelector('.toast-dismiss');

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
	toast.classList.add('toast-error');
	toast.classList.remove('toast-hide');
};

const removeToast = () => {
	toast.classList.add('toast-hide');
};

modalBtn.addEventListener('click', closePopup);
backdrop.addEventListener('click', closePopup);
toastDismiss.addEventListener('click', removeToast);
