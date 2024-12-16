import mongoose from "mongoose";
import Category from "./category.model";
import CustomError from "../../@types/CustomError";
import productModel from "../products/product.model";

class CategoryService {
	category = Category;
	async getById(id: string, sub = "all", productPage = 1, productCount = 10) {
		const category = await this.category.aggregate([
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
					pipeline: [
						{
							$match: {
								category: new mongoose.Types.ObjectId(id),
								...(sub !== "all" && {
									subCategory: new mongoose.Types.ObjectId(sub),
								}),
							},
						},
						{
							$skip: productCount * (productPage - 1),
						},
						{
							$limit: productCount,
						},
						{
							$lookup: {
								from: "images",
								localField: "image",
								foreignField: "fileId",
								as: "image",
							},
						},
					],
				},
			},
			{
				$lookup: {
					from: "subcategories",
					localField: "_id",
					foreignField: "category",
					as: "subcategories",
					pipeline: [
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
					],
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
					subcategories: 1,
					products: 1,
				},
			},
		]);
		if (!category) {
			throw new CustomError({ status: 404, message: "Category not found" });
		}

		const totalProducts = await productModel.countDocuments({
			category: new mongoose.Types.ObjectId(id),
			...(sub !== "all" && { subCategory: new mongoose.Types.ObjectId(sub) }),
		});
		return { category, totalProducts };
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
				$lookup: {
					from: "subcategories",
					localField: "_id",
					foreignField: "category",
					as: "subcategories",
				},
			},
			{
				$project: {
					_id: 1,
					name: 1,
					subcategories: 1,
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
