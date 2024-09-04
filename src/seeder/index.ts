import mongoose from "mongoose";
import seedCategory from "./CategorySeeder";
import config from "../config/config";

async function seed() {
	await mongoose.connect(config().database_URI || "");
	seedCategory();
}

seed();
