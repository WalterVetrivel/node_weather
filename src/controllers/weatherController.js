const { validationResult } = require('express-validator');

const { getLocation } = require('../utils/location');
const { getWeatherData, constructWeatherObject } = require('../utils/weather');

const getWeather = async (req, res) => {
	try {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(422).json({ errors: result.array() });
		}

		const address = req.query.address;
		const location = await getLocation(address);
		const weather = await getWeatherData(location.coordinates);

		const weatherData = {
			location: location.place_name,
			weather: constructWeatherObject(weather.current),
			hourly: weather.hourly
				.slice(1, 6)
				.map(weather => constructWeatherObject(weather)),
			daily: weather.daily
				.slice(1, 6)
				.map(weather => constructWeatherObject(weather)),
		};

		return res.status(200).json(weatherData);
	} catch (err) {
		return res.status(500).json({ statusCode: 500, error: err });
	}
};

module.exports = { getWeather };
