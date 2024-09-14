import express from "express";
import orderController from "./order.controller";
import { bodyValidator } from "../../middleware/zod.validator";
import { createOrderDTO } from "./order.validator";
import AuthService from "../../auth/auth.service";

const orderRouter = express.Router();

const authService = new AuthService();

orderRouter.post(
	"/create",
	authService.isAutheticated(),
	bodyValidator(createOrderDTO),
	orderController.createOrder
);

orderRouter.get(
	"/all",
	authService.isAutheticated(),
	orderController.getAllOrders
);

export default orderRouter;
