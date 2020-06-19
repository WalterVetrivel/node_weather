const express = require('express');
const { query } = require('express-validator');

const { getWeather } = require('../controllers/weatherController');
const { getLocation } = require('../controllers/locationController');

const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', { home: true });
});

router.get('/about', (req, res) => {
	res.render('about', {
		about: true,
		credits: [
			{
				name: 'OpenWeatherMap',
				url: 'https://openweathermap.org/api/one-call-api',
			},
			{ name: 'Mapbox', url: 'https://www.mapbox.com/' },
			{ name: 'IPStack', url: 'https://ipstack.com/' },
			{ name: 'IPInfo', url: 'https://ipinfo.io/' },
		],
	});
});

router.get('/help', (req, res) => {
	res.render('help', { help: true });
});

router.get('/location/ip', getLocation);

router.get(
	'/weather',
	query('address').exists().trim().notEmpty().escape().blacklist('&;\\/*!$'),
	getWeather
);

router.get('*', (req, res) => {
	res.render('404', {
		title: 'Error 404 - Page Not Found',
		message: 'It seems like the page you are looking for does not exist.',
	});
});

module.exports = router;
