import mongoose, { Schema } from "mongoose";

const ImageSchema = new Schema({
	name: { type: String, required: true },
	url: { type: String, required: true },
	size: { type: Number, required: true },
	type: { type: String, required: true },
	fileId: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});
const Image = mongoose.model("Image", ImageSchema);
export default Image;
