module.exports = {
	apps: [
		{
			name: "Food Delivery Production",
			script: "./dist/index.js",
			env: {
				NODE_ENV: "prod",
			},
		},
		{
			name: "Food Delivery Staging",
			script: "./dist/index.js",
		},
	],
};
