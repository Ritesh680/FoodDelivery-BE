import mongoose from "mongoose";
import Product from "./product.model";
import CustomError from "../../@types/CustomError";

class ProductService {
	product = Product;
	async getById(productId: string, userId?: string) {
		const product = this.product.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(productId) } },
			{
				$lookup: {
					from: "images",
					localField: "image",
					foreignField: "fileId",
					as: "image",
				},
			},
			{
				$lookup: {
					from: "carts",
					localField: "_id",
					foreignField: "products.product",
					as: "cart",
					pipeline: userId
						? [
								{
									$match: {
										user: new mongoose.Types.ObjectId(userId),
									},
								},
								{ $project: { cart: "$products", _id: 0 } },
						  ]
						: [],
				},
			},
			{ $unwind: "$cart" },
			{
				$project: {
					_id: 1,
					name: 1,
					price: 1,
					description: 1,
					category: 1,
					quantity: 1,
					image: 1,
					discountedPrice: 1,
					cart: "$cart.cart",
				},
			},
		]);
		if (!product) {
			throw new CustomError({ status: 404, message: "Product not found" });
		}
		return product;
	}

	getAll() {
		return this.product.aggregate([
			{
				$lookup: {
					from: "images",
					localField: "image",
					foreignField: "fileId",
					as: "image",
				},
			},
		]);
	}
}
const productService = new ProductService();
export default productService;
