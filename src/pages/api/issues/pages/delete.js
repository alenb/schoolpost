import clientPromise from "@/lib/mongodb-publications";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { IncomingForm } from "formidable";

export const config = {
	api: {
		bodyParser: false,
		externalResolver: true,
	},
};

export default async (req, res) => {
	const session = await getSession({ req });

	try {
		const form = new IncomingForm({
			multiples: false,
			minFileSize: 0,
			allowEmptyFiles: true,
			keepExtensions: true,
		});

		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.status(500).send(`Cannot delete issue page. Error: ${err.message}`);
			}

			const page = JSON.parse(fields.page[0]);
			page._id = new ObjectId(page._id);
			page.issueId = new ObjectId(page.issueId);

			const client = await clientPromise;
			const db = client.db("publications");

			if (page._id && page.issueId) {
				const pages = db.collection("pages");
				const pageDeleteResult = await pages.deleteOne({
					_id: page._id,
				});

				if (pageDeleteResult.deletedCount === 1) {
					const issues = db.collection("issues");
					const issueUpdateResult = await issues.updateOne(
						{ _id: page.issueId },
						{ $pull: { pages: page._id } }
					);

					if (issueUpdateResult.modifiedCount === 1) {
						res.status(200).send(page._id);
					} else {
						res.status(500).send("Cannot delete page from issue.");
					}
				} else {
					res.status(500).send("Cannot delete issue page.");
				}
			} else {
				res
					.status(500)
					.send("Cannot delete issue page. Error: Incorrect fields provided");
			}
		});
	} catch (error) {
		res.status(500).send(`Cannot delete issue page. Error: ${error.message}`);
	}
};
