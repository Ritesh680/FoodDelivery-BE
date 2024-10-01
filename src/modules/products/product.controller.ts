import { NextFunction, Request, Response } from "express";
import Product from "./product.model";
import productService from "./product.service";

class ProductController {
	productModal = Product;

	createProduct = async (req: Request, res: Response) => {
		const {
			name,
			price,
			description,
			category,
			quantity,
			discountedPrice,
			image,
			subCategory,
		} = req.body;

		const newProduct = new this.productModal({
			name,
			price,
			description,
			category,
			quantity,
			discountedPrice,
			image,
			subCategory,
		});

		newProduct
			.save()
			.then((product) =>
				res.status(200).json({
					success: true,
					message: "product created successfully",
					data: product,
				})
			)
			.catch((err) =>
				res.status(500).json({ success: false, errMessage: err })
			);
	};

	getProducts = async (req: Request, res: Response) => {
		return productService
			.getAll(req)
			.then((products) => {
				res.status(200).json({ success: true, data: products });
			})
			.catch((err) => {
				res.status(500).json({ success: false, message: err });
			});
	};

	getOffers = async (req: Request, res: Response) => {
		return productService
			.getOffers(req)
			.then((products) => {
				res.status(200).json({ success: true, data: products });
			})
			.catch((err) => {
				res.status(500).json({ success: false, message: err });
			});
	};

	getProductById = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ success: false, message: "id is required" });
			return;
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userId = (req.user as any)?._id;
		const product = await productService.getById(id, userId);
		res.status(200).json({ success: true, data: product[0] });
	};

	updateProduct = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ success: false, message: "id is required" });
			return;
		}
		const {
			name,
			price,
			description,
			category,
			quantity,
			discountedPrice,
			image,
		} = req.body;

		const updatedProduct = await this.productModal
			.findByIdAndUpdate(
				id,
				{
					name,
					price,
					description,
					category,
					quantity,
					discountedPrice,
					image,
				},
				{ new: true }
			)
			.exec();
		res.status(200).json({ success: true, data: updatedProduct });
	};

	deleteProduct = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ success: false, message: "id is required" });
			return;
		}
		await this.productModal.findByIdAndDelete(id).exec();
		res
			.status(200)
			.json({ success: true, message: "product deleted successfully" });
	};

	uploadImage = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ success: false, message: "id is required" });
			return;
		}
		const product = await this.productModal.findById(id).exec();
		if (!product) {
			res.status(404).json({ success: false, message: "product not found" });
			return;
		}
		const image = req.body.image;
		product.image.push(image);
		const updatedProduct = await product.save();
		res.status(200).json({ success: true, data: updatedProduct });
	};

	deleteImage = async (req: Request, res: Response, next: NextFunction) => {
		const { productId, fileId } = req.params;
		if (!productId) {
			res
				.status(400)
				.json({ success: false, message: "ProductId is required" });
			return;
		}
		const product = await this.productModal.findById(productId).exec();
		if (!product) {
			res.status(404).json({ success: false, message: "product not found" });
			return;
		}

		try {
			const index = product.image.indexOf(fileId);
			if (index > -1) {
				product.image.splice(index, 1);
			}
			await product.save();

			next();
		} catch (error) {
			res.status(500).json({ success: false, message: error });
		}
	};
}

export default ProductController;
