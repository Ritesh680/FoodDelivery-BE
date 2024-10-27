import express from "express";

import userRouter from "./modules/user";
import authRouter from "./auth";
import uploadRouter from "./modules/upload";
import productRouter from "./modules/products";
import categoryRouter from "./modules/categories";
import cartRouter from "./modules/cart";
import locationRoutes from "./modules/location";
import orderRouter from "./modules/order";
const router = express.Router();

import Config from "./config/config";
import landingPage from "./modules/landingPage";
import addressRouter from "./modules/address";
const config = Config();

router.get("/", (req, res) => {
	res.send(
		`Hello World! Pipeline is Ok. The env is loaded from ${process.env.NODE_ENV} and the client Url is ${config.clientUrl}`
	);
});

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/file", uploadRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/cart", cartRouter);
router.use("/location", locationRoutes);
router.use("/order", orderRouter);
router.use("/landingPage", landingPage);
router.use("/address", addressRouter);

export default router;
