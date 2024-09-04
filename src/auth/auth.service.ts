/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";
import User from "../modules/user/user.model";
import * as jwt from "jsonwebtoken";

import compose from "composable-middleware";

import passport from "passport";
// import randtoken from "rand-token";
import * as _ from "lodash";
import Config from "../config/config";

const config = Config();

const validateJwt = expressjwt({
	secret: config.secret,
	algorithms: ["HS256"],
});

// const jwtUserInfo = expressjwt({
// 	secret: config.secrets.session,
// 	algorithms: ["HS256"],
// 	credentialsRequired: false,
// });

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

const injectFilter = (req: IUserRequest, res: Response, next: NextFunction) => {
	// this.index(req, res);
	// console.log('REQ USER', req.user);
	if (req.user.role === "ADMIN") {
		req.filter = { role: { $nin: "ADMIN" } };
	} else {
		req.filter = { role: req.user.role };
	}
	if (req.user.role !== "ADMIN") {
		req.filter = { _id: req.user._id };
	}
	if (req.user.role === "ADMIN") {
		req.filter = {};
	}
	next();
};

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

	googleLogout = (req: Request, res: Response, next: NextFunction) => {
		req.logOut(function (err) {
			if (err) {
				return next(err);
			}
		});
	};

	localLogin = (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate(
			"local",
			{ session: false },
			(err: Error, user: any, info: any) => {
				if (err) {
					return next(err);
				}
				if (!user) {
					return res.status(401).json(info);
				}
				this.userModel
					.findById(user._id)
					.exec()
					.then((usr) => {
						if (usr) {
							(req as any).token = AuthService.signToken(usr);
							(req as any).tokenExpireDate = "24 Hr";
							(req as any).USER = usr;
						}
						return next();
					});
			}
		)(req, res, next);
	};

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
					// console.log('Req PARAMS IN');
					req.headers.authorization = `Bearer ${req.params.token}`;
				}

				if (!req.headers.authorization) {
					return res
						.status(401)
						.send({ "Error Message": "No Authorization Token Found" });
				}
				validateJwt(req, res, next);
			})
			.use((err: any, req: IUserRequest, res: Response, next: NextFunction) => {
				if (req.isUnauthenticated() && err && err.status === 401) {
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
						// req.userTag = user.userTag;
						// console.log('user.incUsersId = req.user.incUsersId', user.incUsersId, req.user.incUsersId);
						req.user = user;

						// return next();

						// console.log('POWER', _.merge(user, { incUsersId: req.user.incUsersId }));
						// console.log('REQ USER', req.user);
						// req.user = _.merge(req.user, user);
						// console.log('IS AUTHENTICATED', user);
						return injectFilter(req, res, next);
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
			console.warn("No Token");
			// if there is no token
			// return an error
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
			// console.log('==========================');
			// console.log('++++++++++++++++++++++++++');
			// console.log(req.decoded);
			// console.log('++++++++++++++++++++++++++');
			// console.log('==========================');
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

	manageUser = (req: Request, res: Response, next: NextFunction) => {
		// console.log('--TODO-- : Delete Un-necessary key from here like password and other Stuff');

		(req as any).FILTERED_USER_DEATIL = {
			role: (req as any).USER.role ?? "user",
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
