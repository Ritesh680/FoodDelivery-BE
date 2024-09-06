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
			{ $unwind: "$image" },
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
			{ $unwind: "$image" },
		]);
	}
}
const categoryService = new CategoryService();
export default categoryService;
