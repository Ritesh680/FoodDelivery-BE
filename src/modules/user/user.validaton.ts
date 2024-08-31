import { z } from "zod";
import { REGEX_EMAIL, REGEX_PHONE_NUMBER } from "../../constants/regex";

export const createUserDTO = z.object({
	name: z.string({
		required_error: "Username is required",
	}),
	email: z
		.string({
			required_error: "Email is required",
		})
		.regex(REGEX_EMAIL, "Invalid email type"),
	password: z.string(),
	phone: z
		.string({ required_error: "Phone number is required" })
		.regex(REGEX_PHONE_NUMBER, "Invalid phone number"),
	role: z.string().optional(),
});

export const loginUserDTO = z.object({
	email: z.string({
		required_error: "Email is required",
	}),
	password: z.string({
		required_error: "Password is required",
	}),
});
