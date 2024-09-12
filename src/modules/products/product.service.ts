import mongoose from "mongoose";
import Product from "./product.model";
import CustomError from "../../@types/CustomError";
import { Request } from "express";

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
					cart: {
						$cond: {
							if: { $gt: [{ $size: "$cart" }, 0] },
							then: { $arrayElemAt: ["$cart.cart", 0] },
							else: null,
						},
					},
				},
			},
		]);
		if (!product) {
			throw new CustomError({ status: 404, message: "Product not found" });
		}
		return product;
	}

	getAll(req: Request) {
		const { search } = req.query;
		return this.product.aggregate([
			{
				$match: {
					name: {
						$regex: new RegExp(search as string, "i"),
					},
				},
			},
			{
				$lookup: {
					from: "categories",
					localField: "category",
					foreignField: "_id",
					as: "category",
				},
			},
			{
				$lookup: {
					from: "images",
					localField: "image",
					foreignField: "fileId",
					as: "image",
				},
			},
			{
				$project: {
					_id: 1,
					name: 1,
					price: 1,
					description: 1,
					category: {
						$cond: {
							if: { $gt: [{ $size: "$category" }, 0] },
							then: { $arrayElemAt: ["$category", 0] },
							else: null,
						},
					},
					quantity: 1,
					image: 1,
					discountedPrice: 1,
				},
			},
		]);
	}
}
const productService = new ProductService();
export default productService;
