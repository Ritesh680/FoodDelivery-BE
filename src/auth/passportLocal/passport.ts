import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";
import { IUserDocument } from "../../modules/user/user.model";

const setupPassport = (User: mongoose.Model<IUserDocument>) => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password", // this is the virtual field on the model
			},
			function verify(email, password, cb) {
				User.findOne({ email })
					.exec()
					.then((user) => {
						if (!user) {
							return cb(null, false, {
								message: "This email is not registered.",
							});
						}
						user.authenticate(password, (authError, authenticated) => {
							if (authError) {
								return cb(authError);
							}
							if (!authenticated) {
								return cb(null, false, {
									message: "Incorrect Password",
								});
							} else {
								return cb(null, user, { message: "Logged in successfully" });
							}
						});
					})
					.catch((err) => {
						cb(err, false);
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

export default setupPassport;
