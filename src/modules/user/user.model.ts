/* eslint-disable prefer-rest-params */
import mongoose, { Callback } from "mongoose";
import * as crypto from "crypto";

const authTypes = ["facebook", "google"];

export interface IUserDocument extends mongoose.Document {
	name: string;
	email: string;
	phone: string;
	password: string;
	role: string;
	isVerified: boolean;
	provider: string;
	picture: string;
	salt: string;
	authenticate: (
		password: string,
		callback: (arg0: string | null, arg1?: boolean) => void
	) => boolean;
	makeSalt: (callback: (arg0: Error | null, arg1?: string) => void) => void;
	generateAndSetVerificationToken: () => IUserDocument;
	encryptPassword: (
		password: crypto.BinaryLike,
		checkSalt: unknown,
		callback: (arg0: Error | null, arg1?: string) => void
	) => void;
	verificationToken?: number;
	verificationTokenExpires?: number;
	resetPasswordToken?: string;
	resetPasswordExpires?: number;
	generateAndSetResetToken?: () => IUserDocument;
}

const UserSchema = new mongoose.Schema<IUserDocument>({
	name: {
		type: String,
		required: true,
	},
	provider: {
		type: String,
		default: "local",
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	phone: {
		type: String,
		required: function () {
			const tthis = this || {};
			if (authTypes.indexOf(tthis.provider) === -1) {
				return true;
			} else {
				return false;
			}
		},
	},
	password: {
		type: String,
		required: function () {
			const tthis = this || {};
			if (authTypes.indexOf(tthis.provider) === -1) {
				return true;
			} else {
				return false;
			}
		},
	},
	role: {
		type: String,
		default: "user",
		enum: ["user", "admin"],
	},
	picture: {
		type: String,
	},
	salt: String,
	verificationToken: Number,
	resetPasswordToken: String,
	resetPasswordExpires: Number,
	verificationTokenExpires: Number,
});

UserSchema.path("password").validate(function (password) {
	if (authTypes.indexOf(this.provider) !== -1) {
		return true;
	}
	return password.length;
}, "Password cannot be blank");

// Validate email is not taken
UserSchema.path("email").validate(function (value) {
	if (authTypes.indexOf(this.provider) !== -1) {
		return true;
	}

	return this.collection
		.findOne({ email: value })
		.then((user) => {
			if (user) {
				if (this.id === user.id) {
					return true;
				}
				return false;
			}
			return true;
		})
		.catch(function (err) {
			throw err;
		});
}, "The specified email address is already in use.");
// Validate phone is not taken
UserSchema.path("phone").validate(function (value) {
	if (authTypes.indexOf(this.provider) !== -1) {
		return true;
	}

	return this.collection
		.findOne({ phone: value })
		.then((user) => {
			if (user) {
				if (this.id === user.id) {
					return true;
				}
				return false;
			}
			return true;
		})
		.catch(function (err) {
			throw err;
		});
}, "The specified Phone Number is already in use.");
// Validate email is not taken e

/**
 * Pre-save hook and Encrypt Password
 */
const validatePresenceOf = function (value: string) {
	return value && value.length;
};

// generate otp and set it to user database
UserSchema.pre("save", function (next) {
	const tthis = this || {};
	if (tthis.isNew) {
		tthis.verificationToken = Math.floor(1000 + Math.random() * 9000);
		tthis.verificationTokenExpires = Date.now() + 10 * 60 * 1000;
	}
	next();
});

UserSchema.pre("save", function (next) {
	// Handle new/update passwords
	if (!this.isModified("password")) {
		return next();
	}
	const tthis = this || {};

	if (!validatePresenceOf(tthis.password)) {
		if (authTypes.indexOf(tthis.provider) === -1) {
			return next(new Error("Invalid password"));
		} else {
			return next();
		}
	}

	// Make salt with a callback
	tthis.makeSalt((saltErr, salt) => {
		if (saltErr) {
			return next(saltErr);
		}

		tthis.salt = salt ?? "";

		tthis.encryptPassword(
			tthis.password,
			null,
			(encryptErr, hashedPassword) => {
				if (encryptErr) {
					return next(encryptErr);
				}
				tthis.password = hashedPassword ?? "";

				return next();
			}
		);
	});
});

UserSchema.methods = {
	generateAndSetVerificationToken() {
		const tthis = this || {};
		tthis.verificationToken = Math.floor(1000 + Math.random() * 9000);
		tthis.verificationTokenExpires = Date.now() + 10 * 60 * 1000;

		return tthis;
	},
	generateAndSetResetToken() {
		const tthis = this || {};
		tthis.resetPasswordToken = crypto.randomBytes(20).toString("hex");
		tthis.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

		return tthis;
	},

	authenticate(password: string, callback: Callback) {
		const tthis = this || {};

		if (!callback) {
			return tthis.password === tthis.encryptPassword(password);
		}

		tthis.encryptPassword(password, null, (err: Error, pwdGen: string) => {
			if (err) {
				return callback(err, false);
			}

			if (tthis.password === pwdGen) {
				return callback(null, true);
			} else {
				return callback(null, false);
			}
		});
	},

	makeSalt(byteSize: number, callback: Callback) {
		const defaultByteSize = 16;
		if (typeof arguments[0] === "function") {
			callback = arguments[0];
			byteSize = defaultByteSize;
		} else if (typeof arguments[1] === "function") {
			callback = arguments[1];
		} else {
			throw new Error("Missing Callback");
		}

		if (!byteSize) {
			byteSize = defaultByteSize;
		}

		return crypto.randomBytes(byteSize, (err, salt) => {
			if (err) {
				return callback(err, false);
			} else {
				return callback(null, salt.toString("base64"));
			}
		});
	},

	encryptPassword(
		password: crypto.BinaryLike,
		checkSalt: unknown,
		callback: CallableFunction
	) {
		const tthis = this || {};
		if (!password || !tthis.salt) {
			if (!callback) {
				return null;
			} else {
				return callback("Missing password or salt");
			}
		}

		const defaultIterations = 10000;
		const defaultKeyLength = 64;
		const salt = Buffer.from(checkSalt || tthis.salt, "base64");

		if (!callback) {
			return crypto
				.pbkdf2Sync(
					password,
					salt,
					defaultIterations,
					defaultKeyLength,
					"sha512"
				)
				.toString("base64");
		}

		return crypto.pbkdf2(
			password,
			salt,
			defaultIterations,
			defaultKeyLength,
			"sha512",
			(err, key) => {
				if (err) {
					return callback(err);
				} else {
					return callback(null, key.toString("base64"));
				}
			}
		);
	},
};

export default mongoose.model("User", UserSchema);
