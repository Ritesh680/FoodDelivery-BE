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
		const allCategories = subCategories.map((subCategory) => ({
			...subCategory,
			category: categoryId,
		}));
		return await this.subCategoryRepository.insertMany(allCategories);
	}

	async updateSubCategory(
		subCategories: {
			_id?: string;
			name: string;
			image: string;
		}[],
		categoryId: string
	) {
		try {
			const alreadyAvailableSubcategories = subCategories.filter(
				(categoru) => categoru._id
			);
			const restAvailableSubcategories = subCategories.filter(
				(categoru) => !categoru._id
			);
			const response = await Promise.all(
				alreadyAvailableSubcategories.map(async (subCategory) => {
					await this.subCategoryRepository.findOneAndUpdate(
						{ _id: new mongoose.Types.ObjectId(subCategory._id) },
						{ name: subCategory.name, image: subCategory.image }
					);
				})
			);
			if (restAvailableSubcategories.length) {
				await this.createSubCategory(restAvailableSubcategories, categoryId);
			}
			return response;
		} catch (err) {
			console.warn(err);
			throw new Error("An error occurred:");
		}
	}
}

const subCategoryService = new SubCategoryService();
export default subCategoryService;
