import mongoose from "mongoose";
import Cart from "./cart.model";

// {
//             "_id": "66d740fcfc264090171cb2a2",
//             "user": "66d556a20a0dc1faff319b46",
//             "products": [
//                 {
//                     "product": "66d603c9852ec6a594165b2e",
//                     "quantity": 3,
//                     "_id": "66d740fcfc264090171cb2a3"
//                 },
//                 {
//                     "product": "66d603c9852ec6a594165b2e",
//                     "quantity": 1,
//                     "_id": "66d74114b58d06fd5914098a"
//                 },
//                 {
//                     "product": "66d603c9852ec6a594165b2e",
//                     "quantity": 1,
//                     "_id": "66d74126f64f7d75eb2e9e91"
//                 },
//                 {
//                     "product": "66d603c9852ec6a594165b2e",
//                     "quantity": 1,
//                     "_id": "66d7416850e50a88f091681c"
//                 },
//                 {
//                     "product": "66d603c9852ec6a594165b2e",
//                     "quantity": 1,
//                     "_id": "66d741963aac9779937e7c8d"
//                 },
//                 {
//                     "product": "66d603c9852ec6a594165b2e",
//                     "quantity": 1,
//                     "_id": "66d741cbe3b79f670bbd2ac5"
//                 },
//                 {
//                     "product": "66d603c9852ec6a594165b2e",
//                     "quantity": 1,
//                     "_id": "66d741f185b856de5a167544"
//                 }
//             ],
class CartService {
	cart = Cart;
	getCartItems(userId: string) {
		// return this.cart.find({ user: new mongoose.Types.ObjectId(userId) });
		return this.cart.aggregate([
			{ $match: { user: new mongoose.Types.ObjectId(userId) } },
			{
				$unwind: "$products",
			},
			{
				$lookup: {
					from: "products", // replace 'products' with your actual products collection name
					localField: "products.product",
					foreignField: "_id",
					as: "products.product",
				},
			},
			{
				$unwind: "$products.product",
			},
			{
				$lookup: {
					from: "images",
					localField: "products.product.image",
					foreignField: "fileId",
					as: "products.product.image",
				},
			},
			{
				$group: {
					_id: "$_id",
					user: { $first: "$user" },
					products: { $push: "$products" },
				},
			},
		]);
	}
}
const cartService = new CartService();
export default cartService;
