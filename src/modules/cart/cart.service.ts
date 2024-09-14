import mongoose from "mongoose";
import Cart from "./cart.model";

class CartService {
	cart = Cart;
	getCartItems(userId: string) {
		// return this.cart.find({ user: new mongoose.Types.ObjectId(userId) });
		return this.cart.aggregate([
			{ $match: { user: new mongoose.Types.ObjectId(userId) } },
			{
				$unwind: "$products",
			},
			{
				$lookup: {
					from: "products", // replace 'products' with your actual products collection name
					localField: "products.product",
					foreignField: "_id",
					as: "products.product",
				},
			},
			{
				$unwind: "$products.product",
			},
			{
				$lookup: {
					from: "images",
					localField: "products.product.image",
					foreignField: "fileId",
					as: "products.product.image",
				},
			},
			{
				$group: {
					_id: "$_id",
					user: { $first: "$user" },
					products: { $push: "$products" },
				},
			},
		]);
	}

	getSingleCartUpdatedResponse(cartId: string, productId: string) {
		return this.cart.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(cartId) } },
			{
				$unwind: "$products",
			},
			{
				$match: { "products.product": new mongoose.Types.ObjectId(productId) },
			},
			{
				$lookup: {
					from: "products", // replace 'products' with your actual products collection name
					localField: "products.product",
					foreignField: "_id",
					as: "product",
					pipeline: [
						{
							$project: {
								_id: 1,
								name: 1,
								price: 1,
								discountedPrice: 1,
								quantity: "$products.quantity",
							},
						},
					],
				},
			},

			{
				$project: {
					_id: 1,
					user: 1,
					products: {
						$cond: {
							if: { $gt: [{ $size: "$product" }, 0] },
							then: { $arrayElemAt: ["$product", 0] },
							else: null,
						},
					},
				},
			},
		]);
	}

	async deleteFromCart(userId: string, productId: string) {
		return this.cart.updateOne(
			{ user: new mongoose.Types.ObjectId(userId) },
			{
				$pull: {
					products: { product: new mongoose.Types.ObjectId(productId) },
				},
			}
		);
	}
}
const cartService = new CartService();
export default cartService;
