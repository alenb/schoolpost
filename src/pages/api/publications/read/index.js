import clientPromise from "@/lib/mongodb-publications";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";

export default async (req, res) => {
	const session = await getSession({ req });
	const { _id } = req.query;

	try {
		const client = await clientPromise;
		const db = client.db("publications");

		if (_id) {
			const publication = await db.collection("publications").findOne({
				_id: new ObjectId(_id),
			});

			res.json(publication);
		} else {
			res
				.status(500)
				.send("Cannot fetch publication. Error: Incorrect fields provided");
		}
	} catch (error) {
		res.status(500).send(`Cannot fetch publication. Error: ${error.message}.`);
	}
};