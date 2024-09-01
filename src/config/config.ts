import * as dotenv from "dotenv";

export default () => {
	dotenv.config();

	const envVars = {
		database_URI: process.env.MONGO_URL,
		port: process.env.PORT,
		jwtToken: process.env.JWT_TOKEN || "",
		awsBucketName: process.env.AWS_BUCKET_NAME,
		awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		awsRegion: process.env.AWS_REGION,

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

		clientUrl: process.env.CLIENT_URL,
		tokenLife: 60 * 60 * 24,
		refreshTokenLife: 60 * 60 * 24 * 7,
	};
	return envVars;
};
