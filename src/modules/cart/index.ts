import express from "express";
import AuthService from "../../auth/auth.service";
import cartController from "./cart.controller";
const cartRouter = express.Router();
const authController = new AuthService();

cartRouter.post(
	"/add",
	authController.isAutheticated(),
	cartController.addToCart
);
cartRouter.get("/", authController.isAutheticated(), cartController.getCart);
cartRouter.delete(
	"/:productId/remove",
	authController.isAutheticated(),
	cartController.deleteFromCart
);
export default cartRouter;
