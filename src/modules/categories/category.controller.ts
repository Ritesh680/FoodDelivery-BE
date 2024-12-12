import { NextFunction, Request, Response } from "express";
import Category from "./category.model";
import fs from "fs";
import path from "path";
import categoryService from "./category.service";
import db from "../../db/connection";
import subCategoryService from "../subcategories/subcategory.service";

class CategoryController {
	categoryModal = Category;

	createCategory = async (req: Request, res: Response) => {
		const { name, image, subCategories } = req.body;

		const newCategory = new this.categoryModal({
			name,
			image,
		});

		try {
			const session = await db.startSession();
			session.startTransaction();
			const category = await newCategory.save();
			const subCategory = await subCategoryService.createSubCategory(
				subCategories,
				category._id as string
			);
			await session.commitTransaction();
			session.endSession();
			res.status(200).json({
				success: true,
				message: "category created successfully",
				data: { category, subCategory },
			});
		} catch (error) {
			res.status(500).json({ success: false, errMessage: error });
		}
	};

	getCategories = async (req: Request, res: Response) => {
		return categoryService
			.getAll()
			.then((categories) => {
				res.status(200).json({ success: true, data: categories });
			})
			.catch((err) => {
				res.status(500).json({ success: false, message: err });
			});
	};

	getSubCategoriesByCategoryId = async (req: Request, res: Response) => {
		const { id } = req.params;
		subCategoryService
			.getSubCategoryByCategoryId(id)
			.then((subCategories) => {
				res.status(200).json({ success: true, data: subCategories });
			})
			.catch((err) => {
				res.status(500).json({ success: false, message: err });
			});
	};

	getCategoryById = async (req: Request, res: Response) => {
		const { id } = req.params;
		categoryService
			.getById(id)
			.then((category) => {
				res.status(200).json({ success: true, data: category[0] });
			})
			.catch((err) => {
				res.status(500).json({ success: false, message: err });
			});
	};

	deleteSubcategory = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ success: false, message: "id is required" });
			return;
		}
		const subCategory = await subCategoryService.deleteSubCategory(id);
		if (!subCategory) {
			res
				.status(404)
				.json({ success: false, message: "SubCategory not found" });
		}
		res
			.status(200)
			.json({ success: true, message: "SubCategory deleted successfully" });
	};

	deleteCategory = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ success: false, message: "id is required" });
			return;
		}

		const category = await this.categoryModal.findById(id).exec();
		if (category?.image) {
			const filePath = path.join(process.cwd(), "uploads", category.image);
			fs.unlink(filePath, (err) => {
				if (err) {
					console.warn(err);
				}
			});
		}
		await this.categoryModal.findByIdAndDelete(id).exec();

		res
			.status(200)
			.json({ success: true, message: "Category deleted successfully" });
	};

	updateCategory = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ success: false, message: "id is required" });
			return;
		}
		const { name, image } = req.body;

		const updatedProduct = await this.categoryModal
			.findByIdAndUpdate(
				id,
				{
					name,
					image,
				},
				{ new: true }
			)
			.exec();

		await subCategoryService.updateSubCategory(req.body.subCategories, id);

		if (!updatedProduct) {
			res.status(404).json({ success: false, message: "Category not found" });
		}
		res.status(200).json({ success: true, data: updatedProduct });
	};

	uploadImage = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ success: false, message: "id is required" });
			return;
		}
		const product = await this.categoryModal.findById(id).exec();
		if (!product) {
			res.status(404).json({ success: false, message: "product not found" });
			return;
		}
		const image = req.body.image;
		product.image = image;
		const updatedProduct = await product.save();
		res.status(200).json({ success: true, data: updatedProduct });
	};

	deleteImage = async (req: Request, res: Response, next: NextFunction) => {
		const { productId } = req.params;
		if (!productId) {
			res
				.status(400)
				.json({ success: false, message: "ProductId is required" });
			return;
		}
		const product = await this.categoryModal.findById(productId).exec();
		if (!product) {
			res.status(404).json({ success: false, message: "product not found" });
			return;
		}

		try {
			product.image = "";
			await product.save();

			next();
		} catch (error) {
			res.status(500).json({ success: false, message: error });
		}
	};
}

export default CategoryController;
