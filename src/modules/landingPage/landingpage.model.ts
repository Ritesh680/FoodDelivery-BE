import mongoose from "mongoose";

const Schema = new mongoose.Schema({
	images: [{ type: String, required: true }],
	banner: [{ type: String, required: true }],
});

const LandingPage = mongoose.model("LandingPage", Schema);
export default LandingPage;
