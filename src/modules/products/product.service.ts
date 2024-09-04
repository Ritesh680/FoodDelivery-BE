import mongoose from "mongoose";
import Product from "./product.model";
import CustomError from "../../types/CustomError";

class ProductService {
	product = Product;
	async getById(id: number) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new CustomError({ message: "Invalid product id", status: 400 });
		}
		return this.product.findOne({ _id: new mongoose.Types.ObjectId(id) });
	}
}
const productService = new ProductService();
export default productService;
