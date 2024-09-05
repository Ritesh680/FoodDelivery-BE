import userModel from "../modules/user/user.model";

const UserData = [
	{
		name: "Admin admin",
		email: "admin@admin.com",
		phone: "1234567890",
		password: "@secret@",
		role: "admin",
	},
];
async function seedUser() {
	try {
		userModel.deleteMany({});
		UserData.map(async (user) => {
			const newUser = new userModel(user);
			newUser
				.save()
				.then((res) => {
					console.info(`${res.name} with email ${res.email} added`);
					process.exit(0);
				})
				.catch((_error) => {
					process.exit(1);
				});
		});
	} catch (error) {
		console.warn(error);
		process.exit(1);
	}
}

export default seedUser;
