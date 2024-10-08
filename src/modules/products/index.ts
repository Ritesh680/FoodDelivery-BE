import express from "express";
import { bodyValidator } from "../../middleware/zod.validator";
import { createProductDTO } from "./product.validation";
import ProductController from "./product.controller";
import uploadController from "../upload/upload.controller";
const productRouter = express.Router();

const productController = new ProductController();

productRouter.post(
	"/",

	bodyValidator(createProductDTO),
	productController.createProduct
);

productRouter.get("/", productController.getProducts);
productRouter.get("/offers", productController.getOffers);
productRouter.get("/best-seller", productController.getBestSeller);

productRouter.get("/:id", productController.getProductById);

productRouter.put("/:id", productController.updateProduct);

productRouter.delete("/:id", productController.deleteProduct);

productRouter.delete(
	"/:productId/file/:filename",
	productController.deleteImage,
	uploadController.deleteFile
);

export default productRouter;
