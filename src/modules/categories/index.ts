import express from "express";
import { bodyValidator } from "../../middleware/zod.validator";
import AuthService from "../../auth/auth.service";
import uploadController from "../upload/upload.controller";
import { createCategoryDTO } from "./category.validation";
import CategoryController from "./category.controller";

const categoryRouter = express.Router();

const authController = new AuthService();
const categoryController = new CategoryController();

categoryRouter.post(
	"/",
	authController.isAutheticated(),
	bodyValidator(createCategoryDTO),
	categoryController.createCategory
);

categoryRouter.get("/", categoryController.getCategories);

categoryRouter.get("/:id", categoryController.getCategoryById);
categoryRouter.get(
	"/:id/subcategories",
	categoryController.getSubCategoriesByCategoryId
);

categoryRouter.put(
	"/:id",
	authController.isAutheticated(),
	categoryController.updateCategory
);

categoryRouter.delete("/:id", categoryController.deleteCategory);

categoryRouter.delete(
	"/:productId/file/:filename",
	categoryController.deleteImage,
	uploadController.deleteFile
);

categoryRouter.delete("/subcategory/:id", categoryController.deleteSubcategory);

export default categoryRouter;
