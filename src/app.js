// Imports
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const sanitize = require('sanitize');

const { getWeather } = require('./controllers/weatherController');

// Static and view paths
const PUBLIC_DIR_PATH = path.join(__dirname, '../public');
const VIEWS_PATH = path.join(__dirname, '../templates/views');
const PARTIALS_PATH = path.join(__dirname, '../templates/partials');

// Express app
const app = express();

// Configuring hbs
app.set('view engine', 'hbs');
app.set('views', VIEWS_PATH);
hbs.registerPartials(PARTIALS_PATH);

// Setting static directory
app.use(express.static(PUBLIC_DIR_PATH));

app.use(sanitize.middleware);

// Routes
app.get('/', (req, res) => {
	res.render('index', {
		title: 'Check the current weather anywhere, anytime.',
		subtitle: 'Is it raining in Canberra? Is it sunny in Sydney? Find out.',
	});
});

app.get('/about', (req, res) => {
	res.render('about', { title: 'About' });
});

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help',
		message: 'This is a help message.',
	});
});

app.get('/weather', getWeather);

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: 'Error 404',
		message: 'Help article not found',
	});
});

app.get('*', (req, res) => {
	res.render('404', {
		title: 'Error 404',
		message: 'Page not found',
		name: 'Walter Selvakumar',
	});
});

// Express Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`App running on port ${PORT}`);
});
