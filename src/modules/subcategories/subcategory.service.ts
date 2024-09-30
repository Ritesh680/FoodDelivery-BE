import mongoose from "mongoose";
import SubCategory from "./subcategory.model";

class SubCategoryService {
	subCategoryRepository = SubCategory;

	async getAllSubCategories() {
		return await this.subCategoryRepository.find();
	}

	async getSubCategoryByCategoryId(id: string) {
		return await this.subCategoryRepository.find({
			category: new mongoose.Types.ObjectId(id),
		});
	}

	async createSubCategory(
		subCategories: {
			name: string;
			image: string;
		}[],
		categoryId: string
	) {
		// return await this.subCategoryRepository.create(data);

		return await this.subCategoryRepository.insertMany(
			subCategories.map((subCategory) => ({
				...subCategory,
				category: categoryId,
			}))
		);
	}

	async updateSubCategory(
		subCategories: {
			name: string;
			image: string;
		}[],
		categoryId: string
	) {
		const subCategory = await this.subCategoryRepository.findOne({
			category: new mongoose.Types.ObjectId(categoryId),
		});
		if (!subCategory) {
			return this.createSubCategory(subCategories, categoryId);
		}
		return await this.subCategoryRepository.updateOne(
			{ category: new mongoose.Types.ObjectId(categoryId) },
			{ $set: subCategories }
		);
	}
}

const subCategoryService = new SubCategoryService();
export default subCategoryService;
