import mongoose from "mongoose";

export interface CartDocument extends mongoose.Document {
	user: mongoose.Schema.Types.ObjectId;
	products: {
		product: mongoose.Schema.Types.ObjectId;
		quantity: number;
	}[];
}
const CartSchema = new mongoose.Schema<CartDocument>({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			quantity: {
				type: Number,
				default: 1,
			},
		},
	],
});

const Cart = mongoose.model<CartDocument>("Cart", CartSchema);
export default Cart;
