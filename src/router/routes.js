const express = require('express');
const { query } = require('express-validator');

const { getWeather } = require('../controllers/weatherController');

const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', {
		home: true,
		title: 'Check the current weather anywhere, anytime.',
		subtitle: 'Is it raining in Canberra? Is it sunny in Sydney? Find out.',
	});
});

router.get('/about', (req, res) => {
	res.render('about', {
		about: true,
		title: 'What is Weather Assistant?',
		description:
			"Weather Assistant is a simple weather app that lets you see a summary of the current weather at your location (determined by your browser's geolocation API, you can choose to allow or deny permission, your IP is used if you deny permission) or at any location around the world you choose to enter. Weather Assistant uses cutting-edge JavaScript on your browser, so it is recommended that you use the latest version of Microsoft Edge, Google Chrome, Mozilla Firefox or an equivalent browser and avoid using Microsoft Internet Explorer.",
		credits: [
			{ name: 'Weatherstack', url: 'https://weatherstack.com/' },
			{ name: 'Mapbox', url: 'https://www.mapbox.com/' },
			{ name: 'IPStack', url: 'https://ipstack.com/' },
			{ name: 'Ipify', url: 'https://www.ipify.org/' },
			{ name: 'IP-API', url: 'https://ip-api.com/' },
			{ name: 'Flaticon', url: 'https://www.flaticon.com/' },
		],
	});
});

router.get('/help', (req, res) => {
	res.render('help', {
		help: true,
		title: 'How to use Weather Assistant?',
	});
});

router.get(
	'/weather',
	query('address').exists().trim().notEmpty().escape().blacklist('&;\\/*!$'),
	getWeather
);

router.get('/help/*', (req, res) => {
	res.render('404', {
		title: 'Error 404',
		message: 'Help article not found',
	});
});

router.get('*', (req, res) => {
	res.render('404', {
		title: 'Error 404',
		message: 'Page not found',
		name: 'Walter Selvakumar',
	});
});

module.exports = router;
