import { Request, Response } from "express";
import orderService from "./order.service";
class OrderController {
	async createOrder(req: Request, res: Response) {
		const { phone, products, paymentMethod } = req.body;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	async getMyOrders(req: Request, res: Response) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userId = (req.user as any)._id;
		try {
			const orders = await orderService.getMyOrders(userId);
			res.status(200).json({ success: true, data: orders });
		} catch (error) {
			res.status(400).json({ success: false, message: error });
		}
	}

	async updateOrderPaymentStatus(req: Request, res: Response) {
		const { id } = req.params;
		const { status } = req.body;

		if (!status) {
			return res
				.status(400)
				.json({ success: false, message: "Status is required" });
		}

		if (!id) {
			return res
				.status(400)
				.json({ success: false, message: "Order ID is required" });
		}

		try {
			const updatedOrder = await orderService.updateOrder(id, {
				paymentStatus: status,
			});
			res.status(200).json({ success: true, data: updatedOrder });
		} catch (error) {
			res.status(400).json({ success: false, message: error });
		}
	}
	async updateOrderStatus(req: Request, res: Response) {
		const { id } = req.params;
		const { status } = req.body;

		if (!status) {
			return res
				.status(400)
				.json({ success: false, message: "Status is required" });
		}

		if (!id) {
			return res
				.status(400)
				.json({ success: false, message: "Order ID is required" });
		}

		try {
			const updatedOrder = await orderService.updateOrder(id, {
				status,
			});
			res.status(200).json({ success: true, data: updatedOrder });
		} catch (error) {
			res.status(400).json({ success: false, message: error });
		}
	}
}

const orderController = new OrderController();
export default orderController;
