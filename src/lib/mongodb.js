import { MongoClient } from "mongodb";

if (!process.env.MONGODB_GLOBAL_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_GLOBAL_URI"');
}

const uri = process.env.MONGODB_GLOBAL_URI;
const options = {};

let clientPromise;

if (process.env.NODE_ENV === "development") {
	if (!global._mongoGlobalClientPromise) {
		const client = new MongoClient(uri, options);
		global._mongoGlobalClientPromise = client.connect();
	}
	clientPromise = global._mongoGlobalClientPromise;
} else {
	const client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

clientPromise
	.then(() => {
		console.log("MongoDB global client connected successfully");
	})
	.catch((err) => {
		console.error("MongoDB global client connection error:", err);
	});

export default clientPromise;
