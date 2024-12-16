import mongoose from "mongoose";
import Product from "./product.model";
import CustomError from "../../@types/CustomError";
import { Request } from "express";

interface IProduct {
	_id: string;
	name: string;
	price: number;
	description: string;
	category: string;
	subCategory: string;
	quantity: number;
	image: string;
	isBestSeller: boolean;
	discountedPrice: number;
	cart: {
		_id: string;
		quantity: number;
	};
}

class ProductService {
	product = Product;
	async getById(productId: string, userId?: string): Promise<IProduct[]> {
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
					shortDescription: 1,
					category: 1,
					subCategory: 1,
					quantity: 1,
					image: 1,
					isBestSeller: 1,
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

	async getAll(req: Request) {
		const { search, pageSize = 10, page = 1 } = req.query;
		const products = await this.product.aggregate([
			{
				$match: {
					name: {
						$regex: new RegExp(search as string, "i"),
					},
				},
			},
			{ $skip: parseInt(pageSize as string) * (parseInt(page as string) - 1) },
			{ $limit: parseInt(pageSize as string) * parseInt(page as string) },
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
					shortDescription: 1,
					description: 1,
					isBestSeller: 1,
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
		const total = await this.product.countDocuments();
		return { products, total };
	}

	async getOffers(req: Request) {
		const allProducts = await this.getAll(req);
		const filtered = allProducts.products.filter(
			(product) => product.discountedPrice
		);
		return filtered.sort((a, b) => {
			const priceDiscountA = (a.price - a.discountedPrice) / a.price;
			const priceDiscountB = (b.price - b.discountedPrice) / b.price;
			return priceDiscountB - priceDiscountA;
		});
	}

	async getBestSellers(page: number, pageSize: number) {
		const products = await this.product.aggregate([
			{
				$match: {
					isBestSeller: true,
				},
			},
			{ $skip: pageSize * (page - 1) },
			{ $limit: pageSize * page },
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
					shortDescription: 1,
					isBestSeller: 1,
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
		const count = await this.product.countDocuments({ isBestSeller: true });

		return { products, count };
	}

	async decreaseStock(productId: string, quantity: number) {
		const product = await this.product.findById(productId).exec();
		if (!product) {
			throw new CustomError({ status: 404, message: "Product not found" });
		}
		product.quantity -= quantity;
		await product.save();
		return product;
	}
}
const productService = new ProductService();
export default productService;
