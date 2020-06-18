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
	try {
		const res = await axios.get('https://api.ipify.org?format=json');
		const ip = res.data.ip;
		return ip;
	} catch (err) {
		throw err;
	}
};

const getLocationByIp = async ip => {
	const url = '/location/ip';
	try {
		const res = await axios.get(url);
		console.log(res);
		return `${res.data.city}, ${res.data.regionName}`;
	} catch (err) {
		showToast(
			'Cannot fetch location by IP. Using Canberra as default location.'
		);
		return 'Canberra';
	}
};

// Get Weather
const getWeather = async address => {
	const url = `/weather?address=${encodeURIComponent(address)}`;

	try {
		const res = await axios.get(url);
		return res.data;
	} catch (err) {
		updateDOMError();
		showPopup(
			'Error',
			`Unable to fetch weather information. Please check whether you have provided a valid location and try again.`
		);
	}
};

const getWeatherFromIp = async () => {
	try {
		const ip = await getIp();
		const location = await getLocationByIp(ip);

		await setWeather(location);
	} catch (err) {
		updateDOMError();
		showPopup(
			'Error',
			`Unable to fetch weather information. Please check whether you have provided a valid location and try again.`
		);
	}
};

const getWeatherFromCoords = async ({ coords } = {}) => {
	try {
		const res = await axios.get(
			`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}`
		);

		if (!res.data.city) throw new Error();

		const location = `${res.data.city} ${res.data.principalSubdivision || ''}`;

		await setWeather(location);
	} catch (err) {
		updateDOMError();
		showPopup(
			'Error',
			`Unable to fetch weather information. Please check whether you have provided a valid location and try again.`
		);
	}
};

const setWeather = async location => {
	try {
		const data = await getWeather(location);
		updateDOM(data);
	} catch (err) {
		updateDOMError();
	}
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
	else if (status.includes('loading')) icon = 'loading';
	else if (status.includes('unknown')) icon = 'error';
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

	try {
		if (temperature === undefined) throw new Error();

		let className =
			temperature < 18
				? 'cold'
				: temperature >= 18 && temperature <= 27
				? 'warm'
				: 'hot';

		summary = `It is currently <span class="${className}">${temperature}&deg;C (${temperatureF}&deg;F)</span> and it feels like <span class="${className}">${feelslike}&deg;C (${feelslikeF}&deg;F)</span>. The humidity is <strong>${humidity}</strong>.`;
	} catch (err) {
		summary = `No data. Please enter a different location or try again later.`;
	}

	return summary;
};

const setSummary = summary => {
	summaryElement.innerHTML = summary;
};

const updateDOM = ({ location, weather } = {}) => {
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

const updateDOMError = () => {
	updateDOM({
		location: 'UNKNOWN, please enter a valid location',
		weather: { status: 'Unknown', temperature: undefined },
	});
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
