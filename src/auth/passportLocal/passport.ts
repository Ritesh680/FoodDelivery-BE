import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";
import { IUserDocument } from "../../modules/user/user.model";

const localAuthenticate = (
	User: mongoose.Model<IUserDocument>,
	email: string,
	password: string,
	done: (
		error: unknown,
		user?: false | Express.User,
		options?: { message: string }
	) => void
) => {
	User.findOne({ email: email.toLowerCase() })
		.exec()
		.then((user) => {
			if (!user) {
				return done(null, false, {
					message: "This email is not registered.",
				});
			}

			user.authenticate(password, (authError, authenticated) => {
				if (authError) {
					return done(authError);
				}
				if (!authenticated) {
					return done(null, false, {
						message: "This password is not correct.",
					});
				} else {
					return done(null, user);
				}
			});
		})
		.catch((err) => done(err));
};

export const setupPassport = (User: mongoose.Model<IUserDocument>) => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password", // this is the virtual field on the model
			},
			(email, password, done) => {
				return localAuthenticate(User, email, password, done);
			}
		)
	);
};
