import mongoose from "mongoose";
import { IUserDocument } from "../../modules/user/user.model";
import passport from "passport";
import { Strategy } from "passport-facebook";
import Config from "../../config/config";

const config = Config();
const setupFacebook = (_User: mongoose.Model<IUserDocument>) => {
	passport.use(
		new Strategy(
			{
				clientID: config.facebookClientId,
				clientSecret: config.facebookClientSecret,
				callbackURL: config.facebookCallbackURL ?? "",
			},
			function (accessToken, refreshToken, profile, done) {
				done(null, profile._json);
			}
		)
	);

	passport.serializeUser(function (user, done) {
		process.nextTick(function () {
			done(null, user);
		});
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	passport.deserializeUser(function (user: any, done) {
		process.nextTick(function () {
			done(null, user);
		});
	});
};

export default setupFacebook;
