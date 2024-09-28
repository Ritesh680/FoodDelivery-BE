import mongoose from "mongoose";
import seedCategory from "./CategorySeeder";
import config from "../config/config";
import seedProducts from "./ProductSeeder";
import seedUser from "./UserSeeder";

async function seed() {
	await mongoose.connect(config().database_URI || "");

	await seedCategory();
	await seedProducts();
	await seedUser();
}

seed();
