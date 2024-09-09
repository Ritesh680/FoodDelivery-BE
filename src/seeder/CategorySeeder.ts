import Category from "../modules/categories/category.model";

const CategoryData = [
	{ name: "Chicken", image: "cec496496ac-Chicken.jpeg" },
	{ name: "Mutton", image: "a1f0b7d4aa-Mutton.png" },
	{ name: "Buff", image: "9ab5acf4-Buff.png" },
	{ name: "Pork", image: "pork-image.jpg" }, // New Category
	{ name: "Fish", image: "fish-image.jpg" }, // New Category
	{ name: "Seafood", image: "seafood-image.jpg" }, // New Category
	{ name: "Vegetables", image: "vegetables-image.jpg" }, // New Category
	{ name: "Fruits", image: "fruits-image.jpg" }, // New Category
];

async function seedCategory() {
	try {
		await Category.deleteMany({});
		Category.insertMany(CategoryData).then(() => {
			console.info("Category Data Seeded");
			process.exit(0);
		});
	} catch (error) {
		console.warn(error);
		process.exit(1);
	}
}

export default seedCategory;
