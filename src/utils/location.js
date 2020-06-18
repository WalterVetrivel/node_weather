const request = require('request-promise-native');
const dotenv = require('dotenv');

dotenv.config();

const constructLocationObject = data => {
	const coordinatesArray = data.features[0].center;
	return {
		place_name: data.features[0].place_name,
		coordinates: { lat: coordinatesArray[1], lng: coordinatesArray[0] },
	};
};

const getLocationFromIp = async ip => {
	const baseUrl = process.env.IPINFO_URL;
	const url = `/${ip}?token=${process.env.IPINFO_API_KEY}`;

	try {
		const res = await request({ baseUrl, url, json: true });
		if (!res.city) throw new Error('Location not found');
		return { city: res.city, regionName: res.region };
	} catch (err) {
		throw err;
	}
};

const getLocation = async address => {
	const baseUrl = process.env.MAPBOX_URL;
	const url = `/${encodeURIComponent(address)}.json?access_token=${
		process.env.MAPBOX_API_KEY
	}&limit=1`;

	try {
		const res = await request({ baseUrl, url, json: true });

		if (res.features.length === 0) {
			throw new Error('Unable to find location.');
		}

		const location = constructLocationObject(res);
		return location;
	} catch (err) {
		throw err;
	}
};

module.exports = { getLocation, getLocationFromIp };
