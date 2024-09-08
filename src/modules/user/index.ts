import express from "express";
import UserCtrl from "./user.controller";
import { bodyValidator } from "../../middleware/zod.validator";
import { createUserDTO } from "./user.validaton";
import AuthService from "../../auth/auth.service";
import { fileUpload } from "../upload";

const controller = new UserCtrl();
const userRouter = express.Router();
const authService = new AuthService();

userRouter.get("/", controller.getAll);
userRouter.post(
	"/",
	bodyValidator(createUserDTO),
	controller.checkUserWithEmail,
	controller.newUser
);

userRouter.post(
	"/image",
	authService.isAutheticated(),
	fileUpload.single("profileImage"),
	controller.updateProfileImage
);

userRouter.put("/:id", controller.updateUser);

export default userRouter;
