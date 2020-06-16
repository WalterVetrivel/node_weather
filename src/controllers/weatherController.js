const { getLocation } = require('../utils/location');
const { getCurrentWeather } = require('../utils/weather');

const getWeather = async (req, res) => {
	try {
		const address = req.queryString('address');
		const location = await getLocation(address);
		const weather = await getCurrentWeather(location.coordinates);

		return res.status(200).json({
			location: location.place_name,
			weather: {
				temperature: weather.temperature,
				feelslike: weather.feelslike,
				humidity: weather.humidity,
				status: weather.weather_descriptions[0],
			},
		});
	} catch (err) {
		return res.status(500).json({ statusCode: 500, error: err });
	}
};

module.exports = { getWeather };
