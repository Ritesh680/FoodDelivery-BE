import { Request, Response, NextFunction } from "express";
import User, { IUserDocument } from "./user.model";
import fileService from "../upload/upload.service";
import CustomError from "../../@types/CustomError";
import userService from "./user.service";
import imageService from "../images/image.service";
import mongoose from "mongoose";
import { sendVerificationEmail } from "../../utils/email.service";

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

				if (!user) {
					next();
					return;
				}

				if (user.isVerified) {
					return res.status(400).json({
						success: false,
						errMessage: `Already Registered user : ${req.body.email}`,
					});
				} else {
					const result = user.generateAndSetVerificationToken();

					await this.userModel.findByIdAndUpdate({ _id: user._id }, result);
					const verification = await sendVerificationEmail(
						user.email,
						user.verificationToken as number
					);
					return res.status(200).json({
						success: true,
						message: `Email already exists but not verified. Please verify your email.`,
						data: { user, verification },
					});
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

	newUser = async (req: Request, res: Response, _next: NextFunction) => {
		const { name, email, phone, password } = req.body;

		let _role;
		if (req.body.role) {
			_role = req.body.role;
		} else {
			_role = "user";
		}

		try {
			const newUser = new this.userModel({
				name,
				email,
				phone,
				password,
				role: _role,
			});

			const user = await newUser.save();
			const verification = await sendVerificationEmail(
				email,
				user.verificationToken as number
			);

			res.status(201).json({ success: true, data: { user, verification } });
		} catch (error) {
			return res.status(500).json({ success: false, errMessage: error });
		}
	};

	updateProfileImage = async (req: Request, res: Response) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userId = (req.user as any)?._id;
		const file = req.file;
		if (!userId) {
			return res.status(400).json({
				success: false,
				message: "UserId not found",
			});
		}

		if (!file) {
			return res.status(400).json({
				success: false,
				message: "No file uploaded",
			});
		}

		try {
			const result = await imageService.addFile(file);
			fileService.deleteFile(file.filename);

			const picture = result.fileId;
			const user = await this.userModel
				.findById(new mongoose.Types.ObjectId(userId))
				.exec();

			if (user) {
				const oldPictureId = user.picture;
				user.picture = picture;
				try {
					await user.save();
					await imageService.deleteFile(oldPictureId);
					res.status(200).json({
						success: true,
						message: "Profile Image Updated",
						data: user,
					});
				} catch (err) {
					res.status(400).json(err);
				}
			} else {
				res.status(404).json({
					success: false,
					message: "User not found",
				});
			}
		} catch (err) {
			res.status(500).json({ err });
		}
	};

	removeUserImage = async (user: IUserDocument) => {
		if (!user.picture) {
			return;
		}

		return await fileService.deleteFile(user.picture).catch((err) => {
			throw new CustomError(err);
		});
	};

	getAll = async (req: Request, res: Response) => {
		return userService
			.getAll(req)
			.then((result) => res.status(200).json({ success: true, data: result }))
			.catch((err) => res.status(500).json({ err }));
	};

	updateUser = async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ success: false, message: "id is required" });
			return;
		}
		const { name, email, phone, password, role, picture } = req.body;

		const updatedUser = await this.userModel
			.findByIdAndUpdate(
				id,
				{
					name,
					email,
					phone,
					password,
					role,
					picture,
				},
				{ new: true }
			)
			.exec();
		res.status(200).json({ success: true, data: updatedUser });
	};
}
