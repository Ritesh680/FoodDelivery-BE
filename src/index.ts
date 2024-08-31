import express, { Express } from "express";
import db from "./db/connection";
import router from "./routes";

// your routes here
import cors, { CorsOptions } from "cors";
import Config from "./config/config";
const config = Config();
import passport from "passport";

import session from "express-session";

const app: Express = express();
const port = config.port || 3000;

const corsOptions: CorsOptions = {
	origin: "*",
	methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};
app.use(express.json());
app.use(cors(corsOptions));

app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: config.secret,
	})
);
app.use(passport.initialize());
app.use(passport.session());

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
	console.log(" ");
	console.log("------> +++++ COnnected MongoDB server +++++ <------");
	console.log(" ");

	app.use("/", router);

	app.listen(port, () => {
		console.log(`[server]: Server is running at http://localhost:${port}`);
	});
});
