import * as dotenv from "dotenv";

export default () => {
	const envFile =
		process.env.NODE_ENV == "production" ? `.env.production` : ".env";
	dotenv.config({ path: process.cwd() + "/" + envFile });

	const envVars = {
		database_URI: process.env.MONGO_URL,
		port: process.env.PORT,
		jwtToken: process.env.JWT_TOKEN || "",
		awsBucketName: process.env.AWS_BUCKET_NAME,
		awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		awsRegion: process.env.AWS_REGION,
		baseUrl: process.env.BASE_URL,

		isDev: process.env.DEVELOPMENT == "0",

		secret: process.env.SECRET ?? "secret",
		secrets: {
			session: process.env.SESSION_SECRET ?? "session-secret",
		},
		tokenSecrets: {
			session: process.env.TOKEN_SECRET ?? "token-secret",
		},
		refreshTokenSecrets: {
			session: process.env.REFRESH_TOKEN_SECRET ?? "refresh-token-secret",
		},

		googleClientId: process.env.GOOGLE_CLIENT_ID,
		googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
		googleCallbackURL: process.env.GOOGLE_CALLBACK_URL,

		facebookClientId: process.env.FACEBOOK_CLIENT_ID ?? "",
		facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
		facebookCallbackURL: process.env.FACEBOOK_CALLBACK_URL ?? "",

		clientUrl: process.env.CLIENT_URL,
		tokenLife: 60 * 60 * 24,
		refreshTokenLife: 60 * 60 * 24 * 7,

		cloudinary: {
			cloudName: process.env.CLOUDINARY_CLOUD_NAME,
			apiKey: process.env.CLOUDINARY_API_KEY,
			apiSecret: process.env.CLOUDINARY_API_SECRET,
		},

		opencageApiKey: process.env.OPENCAGE_API_KEY,

		mailtrap: {
			host: process.env.MAILTRAP_HOST,
			port: process.env.MAILTRAP_PORT,
			username: process.env.MAILTRAP_USERNAME,
			password: process.env.MAILTRAP_PASSWORD,
		},
	};

	return envVars;
};
