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
			const issue = await db.collection("issues").findOne({
				_id: new ObjectId(_id),
			});

			if (!issue) {
				return res.status(404).send("Issue not found");
			}

			res.json(issue);
		} else {
			res
				.status(500)
				.send("Cannot fetch issue. Error: Incorrect fields provided");
		}
	} catch (error) {
		res.status(500).send(`Cannot fetch issue. Error: ${error.message}.`);
	}
};
