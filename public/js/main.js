const getIconPath = icon => {
	return `img/icons/${icon}.svg`;
};

const weatherApp = new Vue({
	el: '#weather-app',
	delimiters: ['${', '}'],
	data: {
		weather: {
			location: 'Please provide a location',
			status: 'The current weather will appear here',
			icon: getIconPath('location'),
			temperature: 0,
			temperatureF: 0,
			feelslike: 0,
			feelslikeF: 0,
			humidity: 0,
			hourly: [],
			daily: [],
		},
		searchAddress: '',
		searchError: false,
		temperatureClassName: 'weather__temp--cold',
		loading: false,
		error: false,
	},
	async created() {
		try {
			this.setLoading();
			const location = await this.getLocationByIp();
			const weather = await this.getWeather(location);
			this.setWeather(weather);
		} catch (err) {
			showPopup(
				'Error',
				`Unable to fetch weather information. Please check whether you have provided a valid location and try again.`
			);
			this.setError();
		}
	},
	methods: {
		async getLocationByIp() {
			const url = '/location/ip';
			try {
				const res = await axios.get(url);
				return `${res.data.city} ${res.data.regionName}`;
			} catch (err) {
				showToast(
					'Cannot fetch location by IP. Using Canberra as default location.'
				);
				return 'Canberra';
			}
		},
		async getCurrentLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					this.getCurrentLocationWeather,
					this.geoLocationError
				);
			} else {
				showPopup(
					'Error',
					`Cannot access device location at the moment. Make sure you click allow on the popup so that Weather Assistant can access your location.`
				);
			}
		},
		async getCurrentLocationWeather({ coords }) {
			try {
				this.setLoading();
				const res = await axios.get(
					`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}`
				);

				if (!res.data.city) {
					throw new Error();
				}
				const location = `${res.data.city} ${
					res.data.principalSubdivision || ''
				}`;

				const weather = await this.getWeather(location);
				this.setWeather(weather);
			} catch (err) {
				showPopup(
					'Error',
					`Unable to fetch weather information. Please check whether you have provided a valid location and try again.`
				);
				this.setError();
			}
		},
		async searchWeatherHandler() {
			try {
				if (!this.validateSearch()) {
					this.searchAddress = '';
					this.searchError = true;
				} else {
					this.setLoading();
					const weather = await this.getWeather(this.searchAddress);
					this.setWeather(weather);
				}
			} catch (err) {
				showPopup(
					'Error',
					`Unable to fetch weather information. Please check whether you have provided a valid location and try again.`
				);
				this.setError();
			}
		},
		async getWeather(address) {
			const url = `/weather?address=${encodeURIComponent(address)}`;

			try {
				const res = await axios.get(url);
				return res.data;
			} catch (err) {
				throw err;
			}
		},
		async setWeather({ location, weather, daily, hourly }) {
			this.error = false;
			this.loading = false;
			this.weather.location = location;
			this.weather.status = weather.status;
			this.weather.temperature = weather.temperature;
			this.weather.temperatureF = weather.temperatureF;
			this.weather.feelslike = weather.feelslike;
			this.weather.feelslikeF = weather.feelslikeF;
			this.weather.humidity = weather.humidity;
			this.weather.icon = getIconPath(this.getIcon(weather.status));
			this.temperatureClassName = `weather__temp--${this.getTemperatureClass(
				weather.temperature
			)}`;
			this.weather.daily = daily.map(this.transformForecast);
			this.weather.hourly = hourly.map(this.transformForecast);
		},
		getTemperatureClass(temperature) {
			return temperature < 18
				? 'cold'
				: temperature >= 18 && temperature <= 27
				? 'warm'
				: 'hot';
		},
		getIcon(status) {
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

			return icon;
		},
		getPrintableDateTime(dateTime) {
			const dateString = new Date(dateTime)
				.toString()
				.split(' ')
				.slice(0, 3)
				.join(' ');
			const hours = new Date(dateTime).getHours();
			const timeString = `${hours % 12 !== 0 ? hours % 12 : '00'} ${
				hours <= 12 ? 'AM' : 'PM'
			}`;

			return `${dateString} ${timeString}`;
		},
		transformForecast(fc) {
			// fc - forecast
			return {
				...fc,
				dateTime: this.getPrintableDateTime(fc.dateTime),
				icon: getIconPath(this.getIcon(fc.status)),
			};
		},
		setLoading() {
			this.loading = true;
			this.error = false;
			this.weather.location = this.searchAddress || 'Loading...';
			this.weather.status = 'Fetching...';
			this.weather.icon = getIconPath('loading');
		},
		setError() {
			this.error = true;
			this.weather.location = 'Unknown';
			this.weather.status = 'Unknown';
			this.weather.temperature = 0;
			this.weather.temperatureF = 0;
			this.weather.feelslike = 0;
			this.weather.feelslikeF = 0;
			this.weather.humidity = 0;
			this.weather.icon = getIconPath('error');
			this.temperatureClassName = 'hot';
		},
		geoLocationError() {
			showPopup(
				'Error',
				`Unable to fetch weather information. Please check whether you have provided a valid location and try again.`
			);
			this.setError();
		},
		validateSearch() {
			return this.searchAddress.trim() !== '';
		},
		validateSearchHandler(e) {
			if (this.validateSearch()) {
				e.target.classList.remove('input--error');
				this.searchError = false;
			} else {
				e.target.classList.add('input--error');
				this.searchError = true;
			}
		},
	},
});
