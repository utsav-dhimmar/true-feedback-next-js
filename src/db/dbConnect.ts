import { connect, connection } from "mongoose";

export default async function connectToDB() {
	const mongoDbUri = process.env.MONGODB_URI;

	if (!mongoDbUri) {
		console.error("MONGODB_URI is missing in env 💀");
		process.exit(1);
	}

	if (connection.readyState == 1) {
		console.log("[Database] already connected 🔁");
		return;
	}

	try {
		const connectResponse = await connect(mongoDbUri, {
			dbName: "true-feedback",
		});
		console.log("[Database] connection successfully 👍");
	} catch (error) {
		console.log("[Database] connection failed ❌", error);
		process.exit(1);
	}
}
