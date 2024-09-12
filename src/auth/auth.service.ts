/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";
import User from "../modules/user/user.model";
import * as jwt from "jsonwebtoken";

//@ts-expect-error the type of composable middleware is unavailable in the registry
import compose from "composable-middleware";

import passport from "passport";
// import randtoken from "rand-token";
import * as _ from "lodash";
import Config from "../config/config";
import userService from "../modules/user/user.service";

const config = Config();

const validateJwt = expressjwt({
	secret: config.tokenSecrets.session,
	algorithms: ["HS256"],
	credentialsRequired: true,
});

const jwtBlackList: string[] = [];

interface IUserRequest extends Request {
	user: any;
	token: string;
	tokenExpireDate: string;
	USER: any;
	incUsersId: any;
	filter: any;
	decoded: any;
	FILTERED_USER_DEATIL: any;
}

export default class AuthService {
	userModel = User;
	refreshTokensList = {};

	googleAuthenticate = passport.authenticate("google", {
		scope: ["profile", "email", "phone"],
	});

	facebookAuthenticate = passport.authenticate("facebook", {
		scope: ["profile", "email", "phone"],
	});
	facebookCallbackLogin = passport.authenticate("facebook", {
		failureRedirect: "/auth/login/failure",
		successRedirect: config.clientUrl,
	});

	googleCallbackLogin = passport.authenticate("google", {
		failureRedirect: "/auth/login/failure",
		successRedirect: config.clientUrl,
	});

	googleLoginFailure = (req: Request, res: Response) => {
		res.status(401).json({
			success: false,
			message: "user has failed to authenticate",
		});
	};

	googleLoginSuccess = (req: Request, res: Response, next: NextFunction) => {
		if (req.user) {
			(req as any).USER = req.user;
			(req as any).token = AuthService.signToken(req.user);
			(req as any).tokenExpireDate = "24 Hr";
			next();
		} else {
			res.status(401).json({
				success: false,
				message: "user has failed to authenticate",
			});
		}
	};

	logout = (req: Request, res: Response, next: NextFunction) => {
		req.logOut(function (err) {
			if (err) {
				return next(err);
			}

			jwtBlackList.push(req.headers.authorization?.split(" ")[1] ?? "");
			res.status(200).json({
				success: true,
				message: "User has been logged out",
			});
		});
	};

	localLogin = passport.authenticate("local", {
		failureRedirect: "/auth/login/failure",
		successReturnToOrRedirect: "/auth/login/success",
	});

	static signToken(user: any) {
		return jwt.sign(
			{
				_id: user._id,
				email: user.email,
				role: user.role,
			},
			config.tokenSecrets.session,
			{ expiresIn: config.tokenLife }
		);
	}

	static refreshSignToken(user: any) {
		return jwt.sign(
			{
				_id: user._id,
				email: user.email,
				role: user.role,
			},
			config.tokenSecrets.session,
			{ expiresIn: config.refreshTokenLife }
		);
	}

	isAutheticated() {
		return compose()
			.use((req: Request, res: Response, next: NextFunction) => {
				if (req.user) {
					(req as any).USER = req.user;
					(req as any).token = AuthService.signToken(req.user);
					(req as any).tokenExpireDate = "24 Hr";
					return next();
				}

				if ((req as any).auth) {
					req.user = (req as any).auth;
				}

				if (
					req.query &&
					Object.prototype.hasOwnProperty.call(req.query, "token")
				) {
					req.headers.authorization = `Bearer ${req.query.token}`;
				}

				if (
					req.params &&
					Object.prototype.hasOwnProperty.call(req.params, "token")
				) {
					req.headers.authorization = `Bearer ${req.params.token}`;
				}

				if (!req.headers.authorization) {
					return res
						.status(401)
						.send({ "Error Message": "No Authorization Token Found" });
				}
				if (jwtBlackList.includes(req.headers.authorization.split(" ")[1])) {
					res.status(403).json({ message: "User Authentication failed" });
					return;
				}
				validateJwt(req, res, next).then(async () => {
					if ((req as any).auth) req.user = (req as any).auth;
				});
			})
			.use((err: any, req: IUserRequest, res: Response, next: NextFunction) => {
				if (err && err.status === 401) {
					return res
						.status(401)
						.send({ "Error Message": "Unauthorized Access" });
				}
				User.findById(req.user._id)
					.select("firstName lastName email role")
					.exec()
					.then((user) => {
						if (!user) {
							return res.status(401).send({
								errorMessage: "Authentication Failed. Operation Abandoned.",
							});
						}
						req.incUsersId = req.user.incUsersId;
						req.user = user;

						return next();
					})
					.catch((err2) => next(err2));
			});
	}

	verifyRefreshToken = (
		req: IUserRequest,
		res: Response,
		next: NextFunction
	) => {
		const token =
			req.body.refreshToken ||
			req.query.refreshToken ||
			req.headers["x-access-token"];
		// decode token
		if (token) {
			// res.send(token);
			// verifies secret and checks exp
			jwt.verify(
				token,
				config.tokenSecrets.session,
				function (err: any, decoded: any) {
					if (err) {
						console.warn("No Token Unauthorized access. ", err);
						return res
							.status(401)
							.json({ error: true, message: "Unauthorized access." });
					}
					req.decoded = decoded;
					return next();
				}
			);
		} else {
			return res.status(403).send({
				error: true,
				message: "No token provided.",
			});
		}
	};

	sendRefreshToken = (
		req: IUserRequest,
		res: Response,
		_next: NextFunction
	) => {
		if (req.decoded) {
			const user = req.decoded;
			//  Generate New Token
			const token = AuthService.signToken(user);
			return res.json({ accessToken: token, user: user });
		} else {
			res.send(
				"Unauthorized access ==> ** ** ** Server refreshToken ** ** ** Didnt Match"
			);
			// res.send(401)
		}
	};

	manageUser = async (req: Request, res: Response, next: NextFunction) => {
		// console.log('--TODO-- : Delete Un-necessary key from here like password and other Stuff');
		const auth = (req as any).auth;

		if (auth || req.user) {
			await userService
				.getUserById(auth?._id ?? (req.user as any)?._id)
				.then((user) => {
					if (user) {
						(req as any).USER = user[0];
					}
				});
		}
		(req as any).FILTERED_USER_DEATIL = {
			role: (req as any).USER?.role ?? "user",
			_id: (req as any).USER._id,
			createdAt: (req as any).USER.createdAt,
			name: (req as any).USER.name,
			email: (req as any).USER.email,
			phone: (req as any).USER.phone,
			picture: (req as any).USER.picture,
		};

		return next();
	};

	returnUserData = (req: Request, res: Response, _next: NextFunction) => {
		// console.log('req---FILTERED_USER_DEATIL');
		const response = {
			success: true,
			status: "Logged in",
			token: (req as any).token,
			user: (req as any).FILTERED_USER_DEATIL,
			"token-expire": (req as any).tokenExpireDate,
		};
		res.status(200).json(response);
	};
}
