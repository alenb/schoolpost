import clientPromise from "@/lib/mongodb-publications";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { formatISO } from "date-fns";

export default async (req, res) => {
	const session = await getSession({ req });
	const { issueId, pageIds } = req.query;

	try {
		const client = await clientPromise;
		const db = client.db("publications");

		if (issueId) {
			const pages = await db
				.collection("pages")
				.find({
					issueId: new ObjectId(issueId),
				})
				.toArray();

			res.json(pages);
		} else if (pageIds) {
			const objectIds = pageIds.split(",").map((id) => new ObjectId(id));

			const pages = await db
				.collection("pages")
				.aggregate([
					{
						$match: {
							_id: { $in: objectIds },
						},
					},
					{
						$addFields: {
							__order: {
								$indexOfArray: [objectIds, "$_id"],
							},
						},
					},
					{
						$sort: {
							__order: 1,
						},
					},
				])
				.toArray();

			res.status(200).json(pages);
		} else {
			res
				.status(500)
				.send("Cannot fetch pages. Error: Incorrect fields provided");
		}
	} catch (error) {
		res.status(500).send(`Cannot fetch pages. Error: ${error.message}.`);
	}
};
