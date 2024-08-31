import express from "express";

import userRouter from "./modules/user";
import authRouter from "./auth";
const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello World");
});

router.use("/user", userRouter);
router.use("/auth", authRouter);

export default router;
