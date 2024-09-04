import mongoose from "mongoose";

interface ICategoryDocument extends mongoose.Document {
	name: string;
	image: string;
}
const CategorySchema = new mongoose.Schema<ICategoryDocument>({
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
});

export default mongoose.model("Category", CategorySchema);
