import { Request, Response } from "express";
import orderService from "./order.service";
class OrderController {
	async createOrder(req: Request, res: Response) {
		const { phone, products, paymentMethod } = req.body;
		const userId = (req.user as any)._id;
		try {
			const newOrder = await orderService.createOrder({
				contact: phone,
				user: userId,
				paymentMethod,
				products,
			});
			res.status(201).json({ success: true, data: newOrder });
		} catch (error) {
			res.status(400).json({ success: false, message: error });
		}
	}

	async getAllOrders(req: Request, res: Response) {
		try {
			const orders = await orderService.getAllOrders();
			res.status(200).json({ success: true, data: orders });
		} catch (error) {
			res.status(400).json({ success: false, message: error });
		}
	}
}

const orderController = new OrderController();
export default orderController;
