import CustomError from "../@types/CustomError";
import { transport } from "../config/mailtrap.config";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates";

export async function sendVerificationEmail(email: string, token: number) {
	const receipient = email;
	try {
		const res = await transport.sendMail({
			from: "hello@riteshpaudel679.com.np",
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
