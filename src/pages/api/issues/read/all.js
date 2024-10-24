import clientPromise from "@/lib/mongodb-publications";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";

export default async (req, res) => {
	const session = await getSession({ req });
	const { issueIds } = req.query;

	try {
		const client = await clientPromise;
		const db = client.db("publications");

		if (issueIds) {
			const objectIds = issueIds.split(",").map((id) => new ObjectId(id));

			const issues = await db
				.collection("issues")
				.aggregate([
					{
						$match: {
							_id: { $in: objectIds },
						},
					},
				])
				.toArray();

			res.status(200).json(issues);
		} else {
			res
				.status(500)
				.send("Cannot fetch issues. Error: Incorrect fields provided");
		}
	} catch (error) {
		res.status(500).send(`Cannot fetch issues. Error: ${error.message}.`);
	}
};
