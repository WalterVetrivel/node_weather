const request = require('request-promise-native');
const dotenv = require('dotenv');

dotenv.config();

const constructWeatherObject = weather => {
	return {
		dateTime: new Date(weather.dt * 1000),
		temperature: !isNaN(weather.temp)
			? Math.round(weather.temp)
			: { min: weather.temp.min, max: weather.temp.max },
		feelslike: !isNaN(weather.feels_like)
			? Math.round(weather.feels_like)
			: null,
		humidity: Math.round(weather.humidity),
		status: `${weather.weather[0].main} (${weather.weather[0].description})`,
		temperatureF: !isNaN(weather.temp)
			? celsiusToFahrenheit(weather.temp)
			: {
					min: celsiusToFahrenheit(weather.temp.min),
					max: celsiusToFahrenheit(weather.temp.max),
			  },
		feelslikeF: !isNaN(weather.feels_like)
			? celsiusToFahrenheit(weather.feels_like)
			: null,
	};
};

const getWeatherData = async ({ lat, lng } = {}) => {
	const baseUrl = process.env.OPENWEATHERMAP_URL;
	const url = `/onecall?lat=${lat}&lon=${lng}&exclude=minutely&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`;

	try {
		const res = await request({ baseUrl, url, json: true });
		return res;
	} catch (err) {
		throw err;
	}
};

const celsiusToFahrenheit = tempC => {
	return Math.round(tempC * (9 / 5) + 32);
};

module.exports = { getWeatherData, constructWeatherObject };
