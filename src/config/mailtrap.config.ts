import nodemailer, { TransportOptions } from "nodemailer";
import Config from "./config";

const config = Config();

export const transport = nodemailer.createTransport({
	host: config.mailtrap.host ?? "smtp.mailtrap.io",
	port: config.mailtrap.port,
	secure: false,
	auth: {
		user: config.mailtrap.username,
		pass: config.mailtrap.password,
	},
} as TransportOptions);
