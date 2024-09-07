import { Request } from "express";
import User from "./user.model";
import mongoose from "mongoose";

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
	async getUserById(id: string) {
		return this.user.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$lookup: {
					from: "images",
					localField: "picture",
					foreignField: "fileId",
					as: "picture",
				},
			},
			{
				$unwind: "$picture",
			},
			{
				$project: {
					_id: 1,
					name: 1,
					email: 1,
					phone: 1,
					picture: "$picture.url",
					role: 1,
				},
			},
		]);
	}
}
const userService = new UserService();
export default userService;
