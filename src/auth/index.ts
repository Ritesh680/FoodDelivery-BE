import express from "express";
import User from "../modules/user/user.model";

import setupPassport from "./passportLocal/passport";
import setupGoogle from "./passportGoogle/passport";
import setupFacebook from "./passportFacebook/passport";

setupPassport(User);
setupGoogle(User);
setupFacebook(User);

import AuthService from "./auth.service";
const authService = new AuthService();

const router = express.Router();

router.get("/google", authService.googleAuthenticate);
router.get("/facebook", authService.facebookAuthenticate);

router.get("/google/callback", authService.googleCallbackLogin);
router.get("/facebook/callback", authService.facebookCallbackLogin);

router.get("/login/failure", authService.googleLoginFailure);
router.post("/logout", authService.logout);

router.post("/verify", authService.verifyOTP);
router.post("/forgot-password", authService.forgotPassword);
router.post("/reset-password/:token", authService.resetPassword);

router.get("/login/success", authService.isAutheticated(), authService.manageUser, authService.returnUserData);

router.post("/local/login", authService.localLogin, authService.manageUser, authService.returnUserData);

export default router;
