import mongoose from "mongoose";
import cartService from "../cart/cart.service";
import Order, { IOrder } from "./order.model";
import productService from "../products/product.service";

class OrderService {
	order = Order;
	async createOrder(order: IOrder) {
		const newOrder = new this.order(order);
		newOrder.save().then(async () => {
			order.products.forEach(async (product) => {
				await productService.decreaseStock(product.product, product.quantity);
				return await cartService.deleteFromCart(
					String(order.user),
					product.product
				);
			});
		});
		return newOrder;
	}

	async getAllOrders() {
		const orders = await this.order
			.find()
			.populate("user")
			.populate("products.product");
		return orders
			.map((order) => {
				const validProducts = order.products.filter(
					(product) => product.product
				);
				if (validProducts.length) {
					return order;
				}
			})
			.filter((order) => order);
	}

	async getMyOrders(userId: string) {
		const orders = await this.order.aggregate([
			{
				$match: {
					user: new mongoose.Types.ObjectId(userId),
				},
			},
			{
				$lookup: {
					from: "products",
					localField: "products.product",
					foreignField: "_id",
					as: "productData",
					pipeline: [
						{
							$lookup: {
								from: "images",
								localField: "image",
								foreignField: "fileId",
								as: "image",
							},
						},
					],
				},
			},
			{
				$unwind: "$user",
			},
			{
				$unwind: {
					path: "$productData",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$addFields: {
					"productData.orderQuantity": {
						$cond: {
							if: { $gt: [{ $size: "$products.quantity" }, 0] },
							then: { $arrayElemAt: ["$products.quantity", 0] },
							else: null,
						},
					},
					// "productData.orderQuantity": "$products.quantity",
				},
			},
			{
				$group: {
					_id: {
						status: "$status",
					},
					products: { $push: "$productData" },
				},
			},
		]);

		const filteredOrderProducts = orders
			.map((order) => {
				const validProducts = order.products.filter(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(product: any) => product._id
				);

				if (validProducts.length) {
					return order;
				}
			})
			.filter((order) => order);

		const cancelledProducts = filteredOrderProducts.find(
			(order) => order._id.status === "Cancelled"
		)?.products;
		const pendingProducts = filteredOrderProducts.find(
			(order) => order._id.status === "pending"
		)?.products;
		const deliveredProducts = filteredOrderProducts.find(
			(order) => order._id.status === "completed"
		)?.products;

		return { cancelledProducts, pendingProducts, deliveredProducts };
	}

	async updateOrder(id: string, data: Partial<IOrder>) {
		return this.order.findByIdAndUpdate(id, data, { new: true });
	}
}
const orderService = new OrderService();
export default orderService;
