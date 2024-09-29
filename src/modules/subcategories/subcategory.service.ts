import SubCategory from "./subcategory.model";

class SubCategoryService {
	subCategoryRepository = SubCategory;

	async getAllSubCategories() {
		return await this.subCategoryRepository.find();
	}

	async getSubCategoryByCategoryId(id: string) {
		return await this.subCategoryRepository.find({ category: id });
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
}

const subCategoryService = new SubCategoryService();
export default subCategoryService;
