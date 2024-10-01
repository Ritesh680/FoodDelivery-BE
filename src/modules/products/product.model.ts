import mongoose from "mongoose";

interface IProductDocument extends mongoose.Document {
	name: string;
	description: string;
	price: number;
	discountedPrice: number;
	quantity: number;
	category: mongoose.Schema.Types.ObjectId;
	subCategory: mongoose.Schema.Types.ObjectId;
	image: string[];
	isBestSeller: boolean;
}
const ObjectId = mongoose.Schema.Types.ObjectId;

const ProductSchema = new mongoose.Schema<IProductDocument>({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	discountedPrice: {
		type: Number,
	},
	quantity: {
		type: Number,
		required: true,
	},
	category: {
		type: ObjectId,
		ref: "Category",
		required: true,
	},
	subCategory: {
		type: ObjectId,
		ref: "SubCategory",
	},
	image: {
		type: [String],
	},
	isBestSeller: {
		type: Boolean,
		default: false,
	},
});

export default mongoose.model("Product", ProductSchema);
