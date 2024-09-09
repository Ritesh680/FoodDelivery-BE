import productModel from "../modules/products/product.model";
const Products = [
	{
		name: "Chicken Breast",
		description: "Fresh chicken breast, boneless and skinless.",
		price: 9.99,
		discountedPrice: 8.99,
		quantity: 50,
		category: "60d0fe4f5311236168a109ca", // Example ObjectId for Chicken category
		image: ["chicken-breast.jpg"],
	},
	{
		name: "Chicken Thighs",
		description: "Juicy chicken thighs, perfect for grilling.",
		price: 8.99,
		discountedPrice: 7.49,
		quantity: 30,
		category: "60d0fe4f5311236168a109ca", // Example ObjectId for Chicken category
		image: ["chicken-thighs.jpg"],
	},
	{
		name: "Mutton Chops",
		description: "Tender mutton chops, ideal for slow cooking.",
		price: 15.99,
		discountedPrice: 14.99,
		quantity: 20,
		category: "60d0fe4f5311236168a109cb", // Example ObjectId for Mutton category
		image: ["mutton-chops.jpg"],
	},
	{
		name: "Mutton Curry",
		description: "Spiced mutton curry, ready to cook.",
		price: 12.99,
		quantity: 25,
		category: "60d0fe4f5311236168a109cb", // Example ObjectId for Mutton category
		image: ["mutton-curry.jpg"],
	},
	{
		name: "Buff Steak",
		description: "High-quality buff steak, great for grilling.",
		price: 13.99,
		discountedPrice: 12.49,
		quantity: 15,
		category: "60d0fe4f5311236168a109cc", // Example ObjectId for Buff category
		image: ["buff-steak.jpg"],
	},
	{
		name: "Buff Mince",
		description: "Ground buff meat, perfect for burgers or sauces.",
		price: 10.99,
		quantity: 40,
		category: "60d0fe4f5311236168a109cc", // Example ObjectId for Buff category
		image: ["buff-mince.jpg"],
	},
	{
		name: "Pork Ribs",
		description: "Delicious pork ribs, marinated and ready to cook.",
		price: 14.99,
		discountedPrice: 13.49,
		quantity: 10,
		category: "60d0fe4f5311236168a109cd", // Example ObjectId for Pork category
		image: ["pork-ribs.jpg"],
	},
	{
		name: "Pork Sausages",
		description: "Savory pork sausages, great for grilling.",
		price: 11.99,
		quantity: 60,
		category: "60d0fe4f5311236168a109cd", // Example ObjectId for Pork category
		image: ["pork-sausages.jpg"],
	},
	{
		name: "Salmon Fillet",
		description: "Fresh salmon fillet, rich in flavor and nutrients.",
		price: 16.99,
		discountedPrice: 15.49,
		quantity: 25,
		category: "60d0fe4f5311236168a109ce", // Example ObjectId for Fish category
		image: ["salmon-fillet.jpg"],
	},
	{
		name: "Tuna Steak",
		description: "High-quality tuna steak, perfect for searing.",
		price: 18.99,
		quantity: 20,
		category: "60d0fe4f5311236168a109ce", // Example ObjectId for Fish category
		image: ["tuna-steak.jpg"],
	},
	{
		name: "Shrimp Cocktail",
		description: "Chilled shrimp cocktail, served with a tangy sauce.",
		price: 19.99,
		quantity: 15,
		category: "60d0fe4f5311236168a109cf", // Example ObjectId for Seafood category
		image: ["shrimp-cocktail.jpg"],
	},
	{
		name: "Lobster Tail",
		description: "Succulent lobster tail, ideal for special occasions.",
		price: 29.99,
		quantity: 10,
		category: "60d0fe4f5311236168a109cf", // Example ObjectId for Seafood category
		image: ["lobster-tail.jpg"],
	},
	{
		name: "Broccoli",
		description: "Fresh broccoli, perfect for steaming or stir-frying.",
		price: 2.99,
		quantity: 100,
		category: "60d0fe4f5311236168a109d0", // Example ObjectId for Vegetables category
		image: ["broccoli.jpg"],
	},
	{
		name: "Carrots",
		description: "Crunchy carrots, great for snacks or cooking.",
		price: 1.99,
		quantity: 150,
		category: "60d0fe4f5311236168a109d0", // Example ObjectId for Vegetables category
		image: ["carrots.jpg"],
	},
	{
		name: "Apples",
		description: "Juicy apples, perfect for snacking or baking.",
		price: 3.49,
		quantity: 200,
		category: "60d0fe4f5311236168a109d1", // Example ObjectId for Fruits category
		image: ["apples.jpg"],
	},
	{
		name: "Bananas",
		description: "Ripe bananas, a great source of potassium.",
		price: 2.49,
		quantity: 180,
		category: "60d0fe4f5311236168a109d1", // Example ObjectId for Fruits category
		image: ["bananas.jpg"],
	},
	{
		name: "Grapes",
		description: "Sweet grapes, ideal for snacks or salads.",
		price: 4.99,
		quantity: 120,
		category: "60d0fe4f5311236168a109d1", // Example ObjectId for Fruits category
		image: ["grapes.jpg"],
	},
	{
		name: "Bell Peppers",
		description: "Colorful bell peppers, great for cooking or salads.",
		price: 2.49,
		quantity: 80,
		category: "60d0fe4f5311236168a109d0", // Example ObjectId for Vegetables category
		image: ["bell-peppers.jpg"],
	},
	{
		name: "Pineapple",
		description: "Sweet pineapple, perfect for desserts or smoothies.",
		price: 5.99,
		quantity: 50,
		category: "60d0fe4f5311236168a109d1", // Example ObjectId for Fruits category
		image: ["pineapple.jpg"],
	},
	{
		name: "Cod Fillet",
		description: "Mild cod fillet, great for grilling or baking.",
		price: 14.49,
		quantity: 30,
		category: "60d0fe4f5311236168a109ce", // Example ObjectId for Fish category
		image: ["cod-fillet.jpg"],
	},
	{
		name: "Crab Legs",
		description: "Delicious crab legs, perfect for a seafood feast.",
		price: 25.99,
		quantity: 15,
		category: "60d0fe4f5311236168a109cf", // Example ObjectId for Seafood category
		image: ["crab-legs.jpg"],
	},
];

async function seedProducts() {
	try {
		await productModel.deleteMany({});
		productModel.insertMany(Products).then(() => {
			console.info("Product Data Seeded");
			process.exit(0);
		});
	} catch (error) {
		console.warn(error);
		process.exit(1);
	}
}

export default seedProducts;
