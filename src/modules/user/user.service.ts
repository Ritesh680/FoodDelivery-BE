import { Request } from "express";
import User from "./user.model";

class UserService {
	user = User;
	async getAll(req: Request) {
		const { search } = req.query;
		return this.user.aggregate([
			{
				$match: {
					$or: [
						{ name: { $regex: search, $options: "i" } },
						{ email: { $regex: search, $options: "i" } },
					],
				},
			},
		]);
	}
}
const userService = new UserService();
export default userService;
