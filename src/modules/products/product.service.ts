import mongoose from "mongoose";
import Product from "./product.model";
import CustomError from "../../@types/CustomError";

class ProductService {
	product = Product;
	async getById(id: string) {
		const product = this.product.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(id) } },
			{
				$lookup: {
					from: "images",
					localField: "image",
					foreignField: "fileId",
					as: "image",
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
