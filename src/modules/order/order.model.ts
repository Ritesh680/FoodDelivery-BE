import { Document, model } from "mongoose";
import { Schema } from "mongoose";

export interface IOrder {
	user: Schema.Types.ObjectId;
	products: Array<{
		product: string;
		quantity: number;
	}>;
	status?: string;
	paymentMethod: string;
	paymentStatus?: string;
	contact: string;
	createdAt?: Date;
}
type OrderDocument = IOrder & Document;

const OrderSchema = new Schema<OrderDocument>({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	products: [
		{
			product: {
				type: Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
		},
	],
	status: {
		type: String,
		enum: ["pending", "completed", "cancelled"],
		default: "pending",
	},
	paymentMethod: {
		type: String,
		enum: ["cod", "online"],
		default: "cod",
	},
	paymentStatus: {
		type: String,
		enum: ["pending", "completed"],
		default: "pending",
	},
	contact: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Order = model("Order", OrderSchema);
export default Order;
