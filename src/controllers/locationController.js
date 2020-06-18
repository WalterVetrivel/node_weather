const { getLocationFromIp } = require('../utils/location');

const getLocation = async (req, res) => {
	const ip = req.connection.remoteAddress;
	try {
		const location = await getLocationFromIp(ip);
		return res.status(200).json(location);
	} catch (err) {
		return res.status(500).json({ statusCode: 500, error: err, ip });
	}
};

module.exports = { getLocation };
