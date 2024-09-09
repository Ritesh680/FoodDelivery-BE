import mongoose from "mongoose";
import seedCategory from "./CategorySeeder";
import config from "../config/config";
import seedProducts from "./ProductSeeder";

async function seed() {
	await mongoose.connect(config().database_URI || "");

	await seedCategory();
	await seedProducts();
}

seed();
