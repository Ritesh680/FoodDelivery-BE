import CustomError from "../@types/CustomError";
import { transport } from "../config/mailtrap.config";
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates";

export async function sendVerificationEmail(email: string, token: number) {
	const receipient = email;
	try {
		const res = await transport.sendMail({
			from: "support@chickendelivery.com.np",
			to: receipient,
			subject: "Email Verification",
			html: VERIFICATION_EMAIL_TEMPLATE.replace(
				"{verificationCode}",
				token.toString()
			),
		});
		return res;
	} catch (error) {
		throw new CustomError({ status: 500, message: error as string });
	}
}

export async function sendResetPasswordEmail(email: string, resetURL: string) {
	const receipient = email;
	try {
		const res = await transport.sendMail({
			from: "support@chickendelivery.com.np",
			to: receipient,
			subject: "Reset Password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(`{resetURL}`, resetURL),
		});
		return res;
	} catch (error) {
		throw new CustomError({ status: 500, message: error as string });
	}
}
