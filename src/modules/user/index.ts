import express from "express";
import UserCtrl from "./user.controller";
import { bodyValidator } from "../../middleware/zod.validator";
import { createUserDTO } from "./user.validaton";
import { fileUpload } from "../upload";

const controller = new UserCtrl();
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
	res.send("Hello User");
});
userRouter.post(
	"/",
	bodyValidator(createUserDTO),
	controller.checkUserWithEmail,
	controller.newUser
);

userRouter.post(
	"/image",
	fileUpload.single("profileImage"),
	controller.updateProfileImage
);

export default userRouter;
