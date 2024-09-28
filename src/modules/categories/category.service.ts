import mongoose from "mongoose";
import Category from "./category.model";
import CustomError from "../../@types/CustomError";

class CategoryService {
	category = Category;
	async getById(id: string) {
		const category = this.category.aggregate([
			{
				$match: { _id: new mongoose.Types.ObjectId(id) },
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
				$lookup: {
					from: "products",
					localField: "_id",
					foreignField: "category",
					as: "products",
				},
			},
			{
				$project: {
					_id: 1,
					name: 1,
					image: {
						$cond: {
							if: { $gt: [{ $size: "$image" }, 0] },
							then: { $arrayElemAt: ["$image", 0] },
							else: null,
						},
					},
					products: 1,
				},
			},
		]);
		if (!category) {
			throw new CustomError({ status: 404, message: "Category not found" });
		}
		return category;
	}

	async getAll() {
		return this.category.aggregate([
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
					image: {
						$cond: {
							if: { $gt: [{ $size: "$image" }, 0] },
							then: { $arrayElemAt: ["$image", 0] },
							else: null,
						},
					},
				},
			},
		]);
	}
}
const categoryService = new CategoryService();
export default categoryService;
