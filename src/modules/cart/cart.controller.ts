import { NextFunction, Request, Response } from "express";
import Cart from "./cart.model";
import mongoose from "mongoose";
import cartService from "./cart.service";
import productService from "../products/product.service";

class CartController {
	cart = Cart;
	addToCart = async (req: Request, res: Response, next: NextFunction) => {
		const { quantity, productId } = req.body;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userId = (req.user as any)._id;

		if (!productId) {
			return res.status(400).json({
				success: false,
				message: "Product Id is required",
			});
		}
		if (!quantity) {
			return res.status(400).json({
				success: false,
				message: "Quantity is required",
			});
		}
		const product = await productService.getById(productId).catch(next);

		if (!product) {
			return;
		}

		try {
			const cart = await this.cart
				.findOne({ user: new mongoose.Types.ObjectId(userId) })
				.exec();
			if (cart) {
				const productIndex = cart.products.findIndex(
					(p) => String(p.product) === String(productId)
				);
				if (productIndex !== -1) {
					cart.products[productIndex].quantity = quantity;
				} else {
					cart.products.push({ product: productId, quantity });
				}
				await cart.save();
				return res.status(200).json({ success: true, data: cart });
			} else {
				const newCart = new this.cart({
					user: userId,
					products: [{ product: productId, quantity }],
				});
				await newCart.save();
				return res.status(200).json({ success: true, data: newCart });
			}
		} catch (error) {
			return res.status(500).json({ success: false, errMessage: error });
		}
	};

	deleteFromCart = async (req: Request, res: Response) => {
		const { productId } = req.params;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userId = (req.user as any)._id;

		if (!productId) {
			return res.status(400).json({
				success: false,
				message: "Product Id is required",
			});
		}
		try {
			const cart = await this.cart.findOne({ user: userId }).exec();
			if (cart) {
				cart.products = cart.products.filter(
					(p) => String(p.product) !== String(productId)
				);
				await cart.save();
				return res.status(200).json({ success: true, data: cart });
			}
		} catch (error) {
			return res.status(500).json({ success: false, errMessage: error });
		}
	};

	getCart = async (req: Request, res: Response) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userId = (req.user as any)._id;
		try {
			const cart = await cartService.getCartItems(userId);
			if (cart) {
				return res
					.status(200)
					.json({ success: true, data: cart.length ? cart[0] : cart });
			}
			return res
				.status(404)
				.json({ success: false, message: "Cart not found" });
		} catch (error) {
			return res.status(500).json({ success: false, errMessage: error });
		}
	};
}
const cartController = new CartController();
export default cartController;
