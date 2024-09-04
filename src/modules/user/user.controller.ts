import { Request, Response, NextFunction } from "express";
import User from "./user.model";

export default class UsersCtrl {
	userModel = User;

	checkUserWithEmail = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (req.body.email) {
			try {
				const user = await this.userModel
					.findOne({ email: req.body.email })
					.exec();

				if (user) {
					return res.status(400).json({
						success: false,
						errMessage: `Already Registered user : ${req.body.email}`,
					});
				} else {
					next();
				}
			} catch (error) {
				return res.status(500).json({ success: false, errMessage: error });
			}
		} else {
			return res
				.status(200)
				.json({ success: false, errMessage: "Error !!! Email is Missing" });
		}
	};

	newUser = (req: Request, res: Response, _next: NextFunction) => {
		const { name, email, phone, password } = req.body;

		let _role;
		if (req.body.role) {
			_role = req.body.role;
		} else {
			_role = "user";
		}

		const newUser = new this.userModel({
			name,
			email,
			phone,
			password,
			role: _role,
		});

		newUser
			.save()
			.then((user) => {
				res.json(user);
			})
			.catch((err) => {
				res.status(400).json(err);
			});
	};

	updateProfileImage = async (req: Request, res: Response) => {
		const { profileImage } = req.body;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userId = (req.user as any)?._id;
		if (!userId) {
			return res.status(400).json({
				success: false,
				message: "UserId not found",
			});
		}
		try {
			const user = await this.userModel.findById(userId).exec();
			if (user) {
				user.picture = profileImage;
				await user.save();
				return res.json(user);
			} else {
				return res
					.status(404)
					.json({ success: false, message: "User not found" });
			}
		} catch (error) {
			return res.status(500).json({ success: false, message: error });
		}
	};
}
