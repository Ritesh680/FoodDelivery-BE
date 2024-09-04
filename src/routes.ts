import express from "express";

import userRouter from "./modules/user";
import authRouter from "./auth";
import uploadRouter from "./modules/upload";
import productRouter from "./modules/products";
import categoryRouter from "./modules/categories";
import cartRouter from "./modules/cart";
const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello World");
});

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/file", uploadRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/cart", cartRouter);

export default router;
