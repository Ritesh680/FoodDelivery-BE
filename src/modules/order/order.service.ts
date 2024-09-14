import Order, { IOrder } from "./order.model";

class OrderService {
	order = Order;
	async createOrder(order: IOrder) {
		const newOrder = new this.order(order);
		return newOrder.save();
	}

	getAllOrders() {
		return this.order.find().populate("user").populate("products.product");
	}
}
const orderService = new OrderService();
export default orderService;
