// Selecting DOM Elements
const statusElement = document.querySelector('.weather-status > strong');
const locationElement = document.querySelector('.weather-location');
const iconElement = document.querySelector('.weather-icon');
const summaryElement = document.querySelector('.weather-summary');

const addressInput = document.querySelector('.address-input');
const errorElement = document.querySelector('small.error');
const weatherForm = document.querySelector('.weather-form');

// Get Location
const getIp = async () => {
	const res = await axios.get('https://api.ipify.org?format=json');
	const ip = res.data.ip;
	return ip;
};

const getLocationByIp = async ip => {
	const url = `http://ip-api.com/json/${ip}`;
	const res = await axios.get(url);
	return `${res.data.city}, ${res.data.regionName}`;
};

// Get Weather
const getWeather = async address => {
	const url = `/weather?address=${encodeURIComponent(address)}`;

	try {
		const res = await axios.get(url);
		return res.data;
	} catch (err) {
		console.log('Something went wrong.');
	}
};

const getWeatherFromIp = async () => {
	const ip = await getIp();
	const location = await getLocationByIp(ip);

	await setWeather(location);
};

const getWeatherFromCoords = async ({ coords }) => {
	const res = await axios.get(
		`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}`
	);

	const location = `${res.data.city}, ${res.data.principalSubdivision}`;

	await setWeather(location);
};

const setWeather = async location => {
	const data = await getWeather(location);
	updateDOM(data);
};

// Update Weather DOM
const setLocation = location => {
	locationElement.innerText = location;
};

const setStatus = status => {
	statusElement.innerText = status;
};

const getIcon = status => {
	status = status.toLowerCase();
	let icon;

	if (status.includes('sun')) icon = 'sun';
	else if (status.includes('partly')) icon = 'cloudy';
	else if (status.includes('cloud') || status.includes('overcast'))
		icon = 'clouds';
	else if (status.includes('rain')) icon = 'rain';
	else if (status.includes('snow')) icon = 'snowflake';
	else if (status.includes('thunder')) icon = 'bolt';
	else if (status.includes('hail')) icon = 'hail';
	else if (status.includes('wind')) icon = 'wind';
	else icon = 'sun';

	return `img/icons/${icon}.svg`;
};

const setIcon = icon => {
	iconElement.setAttribute('src', icon);
};

const getSummary = ({
	temperature,
	feelslike,
	temperatureF,
	feelslikeF,
	humidity,
} = {}) => {
	let summary = '';

	let className =
		temperature < 18
			? 'cold'
			: temperature >= 18 && temperature <= 27
			? 'warm'
			: 'hot';

	try {
		summary = `It is currently <span class="${className}">${temperature}&deg;C (${temperatureF}&deg;F)</span> and it feels like <span class="${className}">${feelslike}&deg;C (${feelslikeF}&deg;F)</span>. The humidity is <strong>${humidity}</strong>.`;
	} catch (err) {
		summary = `No data.`;
	}

	return summary;
};

const setSummary = summary => {
	summaryElement.innerHTML = summary;
};

const updateDOM = ({ location, weather }) => {
	setLocation(location);
	setStatus(weather.status);
	setIcon(getIcon(weather.status));
	setSummary(getSummary(weather));
};

// Input validation
const validateInput = e => {
	const address = e.target.value.trim();
	if (!address || address === '') setError();
	else removeError();
};

const setError = () => {
	addressInput.classList.add('error');
	errorElement.classList.remove('hidden');
};

const removeError = () => {
	addressInput.classList.remove('error');
	errorElement.classList.add('hidden');
};

// Event handlers
const getWeatherHandler = async e => {
	e.preventDefault();
	const address = addressInput.value.trim();

	if (address && address.trim() !== '') {
		try {
			const data = await getWeather(address);
			updateDOM(data);
		} catch (err) {}
	} else {
		setError();
	}
};

const initWeatherHandler = async () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			getWeatherFromCoords,
			getWeatherFromIp
		);
	} else {
		getWeatherFromIp();
	}
};

// Setting up event listeners
addressInput.addEventListener('keyup', validateInput);
weatherForm.addEventListener('submit', getWeatherHandler);
window.addEventListener('load', initWeatherHandler);
