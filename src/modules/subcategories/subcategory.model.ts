import mongoose from "mongoose";

const Schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},

	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},

	image: {
		type: String,
	},
});

const SubCategory = mongoose.model("SubCategory", Schema);
export default SubCategory;
