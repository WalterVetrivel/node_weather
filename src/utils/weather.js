const request = require('request-promise-native');
const dotenv = require('dotenv');

dotenv.config();

const getCurrentWeather = async ({ lat, lng }) => {
	const baseUrl = process.env.WEATHERSTACK_URL;
	const url = `/current?access_key=${process.env.WEATHERSTACK_API_KEY}&query=${lat},${lng}&units=m`;

	try {
		const res = await request({ baseUrl, url, json: true });

		weatherData = res.current;
		return weatherData;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

module.exports = { getCurrentWeather };
