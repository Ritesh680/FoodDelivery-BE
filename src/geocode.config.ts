import NodeGeocoder from "node-geocoder";
import config from "./config/config";

const geocoder = NodeGeocoder({
	provider: "opencage",
	apiKey: config().opencageApiKey,
});

export default geocoder;
