import { Strategy } from "passport-google-oauth20";
import passport from "passport";

import Config from "../../config/config";
import mongoose from "mongoose";
import { IUserDocument } from "../../modules/user/user.model";
const config = Config();

const setupGoogle = (User: mongoose.Model<IUserDocument>) => {
	passport.use(
		new Strategy(
			{
				clientID: config.googleClientId ?? "",
				clientSecret: config.googleClientSecret ?? "",
				callbackURL: config.googleCallbackURL,
				scope: ["profile", "email"],
			},
			function verify(accessToken, refreshToken, profile, done) {
				User.findOne({ email: profile._json.email })
					.exec()
					.then((user) => {
						if (!user) {
							const newUser = new User({
								name: profile._json.name,
								email: profile._json.email,
								provider: "google",
								phone: null,
								picture: profile._json.picture,
							});
							newUser.save().then((newUser) => {
								done(null, newUser);
							});
						} else {
							done(null, user);
						}
					})
					.catch((err) => {
						done(err, false);
					});
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
export default setupGoogle;
