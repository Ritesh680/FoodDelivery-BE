import express from "express";
import geocoder from "../../geocode.config";

const locationRoutes = express.Router();

locationRoutes.get("/", (req, res) => {
	const { location, latitude, longitude } = req.query;

	if (latitude && longitude) {
		geocoder.reverse({ lat: +latitude, lon: +longitude }, (err, data) => {
			res.json(data);
		});
		return;
	}

	geocoder.geocode((location as string) ?? "", (err, data) => {
		res.json(data);
	});
});

export default locationRoutes;
