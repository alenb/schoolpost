import clientPromise from "@/lib/mongodb-publications";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";

export default async (req, res) => {
	const session = await getSession({ req });

	try {
		const client = await clientPromise;
		const db = client.db("publications");

		const publications = await db.collection("publications").find({}).toArray();

		res.json(publications);
	} catch (error) {
		res
			.status(500)
			.send(`Cannot fetch publications. Error: ${error.message}.`);
	}
};