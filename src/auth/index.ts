import express from "express";
import User from "../modules/user/user.model";

import { setupPassport } from "./passportLocal/passport";
setupPassport(User);

import AuthService from "./auth.service";
const authService = new AuthService();

const router = express.Router();

router.post(
	"/local/login",
	authService.localLogin,
	authService.manageUser,
	authService.returnUserData
);

export default router;
