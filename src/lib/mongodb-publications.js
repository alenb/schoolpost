import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let clientPromise;

if (process.env.NODE_ENV === "development") {
	if (!global._mongoClientPromise) {
		const client = new MongoClient(uri, options);
		global._mongoClientPromise = client.connect();
	}
	clientPromise = global._mongoClientPromise;
} else {
	const client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

clientPromise
	.then(() => {
		console.log("MongoDB client connected successfully");
	})
	.catch((err) => {
		console.error("MongoDB client connection error:", err);
	});

export default clientPromise;
