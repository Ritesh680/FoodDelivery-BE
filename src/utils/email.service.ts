import CustomError from "../@types/CustomError";
import Config from "../config/config";
import { transport } from "../config/mailtrap.config";
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	SEND_ORDER_DETAILS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates";

const config = Config();

export async function sendVerificationEmail(email: string, token: number) {
	const receipient = email;
	try {
		const res = await transport.sendMail({
			from: config.mailtrap.senderEmail,
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
			from: config.mailtrap.senderEmail,
			to: receipient,
			subject: "Reset Password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(`{resetURL}`, resetURL),
		});
		return res;
	} catch (error) {
		throw new CustomError({ status: 500, message: error as string });
	}
}

export async function sendNewOrderDetails(
	customer: { name: string; email: string; phone?: string },
	order: {
		productName: string;
		quantity: string;
		amount: string;
	},
	address: string
) {
	const receipient = config.mailtrap.ownerEmail;
	try {
		const res = await transport.sendMail({
			from: config.mailtrap.senderEmail,
			to: receipient,
			subject: "New Order",
			html: SEND_ORDER_DETAILS_TEMPLATE.replace(`{customerName}`, customer.name)
				.replace(`{customerEmail}`, customer.email)
				.replace(`{customerPhone}`, customer.phone || "Not Provided")
				.replace(`{productName}`, order.productName)
				.replace(`{quantity}`, order.quantity)
				.replace(`{amount}`, order.amount)
				.replace(`{address}`, address),
		});
		return res;
	} catch (error) {
		throw new CustomError({ status: 500, message: error as string });
	}
}
