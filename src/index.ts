import express, { Express, NextFunction, Request, Response } from "express";
import db from "./db/connection";
import router from "./routes";

// your routes here
import cors, { CorsOptions } from "cors";
import Config from "./config/config";
const config = Config();
import passport from "passport";

import session from "express-session";
import MongoStore from "connect-mongo";
import CustomError from "./types/CustomError";

const app: Express = express();
const port = config.port || 3000;

const corsOptions: CorsOptions = {
	origin: [config.clientUrl ?? "", "http://localhost:5173"],
	methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
	credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));

app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: config.secret,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7,
			signed: true,
			sameSite: "none",
			secure: true,
		},
		store: MongoStore.create({ mongoUrl: config.database_URI }),
	})
);

app.use(passport.initialize());
app.use(passport.session());

db.on("error", console.warn.bind(console, "connection error:"));
db.once("open", async () => {
	console.info(" ");
	console.info("------> +++++ COnnected MongoDB server +++++ <------");
	console.info(" ");

	app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
		if (err instanceof CustomError) {
			res.status(err.status).json({ message: err.message.toString() });
		} else {
			res.status(500).json({ message: "An unexpected error occurred" });
		}
	});
	app.use("/", router);

	app.listen(port, () => {
		console.info(`[server]: Server is running at http://localhost:${port}`);
	});
});
