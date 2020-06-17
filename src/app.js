// Imports
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const sanitize = require('sanitize');

const router = require('./router/routes');

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

// Middleware
app.use(sanitize.middleware);

// Routes
app.use(router);

// Express Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`App running on port ${PORT}`);
});
