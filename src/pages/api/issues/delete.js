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

			const data = JSON.parse(fields.issue[0]);
			const _id = new ObjectId(data._id);
			const publicationId = new ObjectId(data.publicationId);

			const client = await clientPromise;
			const db = client.db("publications");

			if (_id && publicationId) {
				const pages = db.collection("pages");
				const pageIds = data.pages.map((id) => new ObjectId(id));
				const pageDeleteResult = await pages.deleteMany({
					_id: { $in: pageIds },
				});

				if (pageDeleteResult.acknowledged) {
					const issues = db.collection("issues");
					const issueDeleteResult = await issues.deleteOne({
						_id: _id,
					});

					if (issueDeleteResult.acknowledged) {
						const publications = db.collection("publications");
						const publicationUpdateResult = await publications.updateOne(
							{ _id: publicationId },
							{ $pull: { issues: _id } }
						);

						if (publicationUpdateResult.modifiedCount === 1) {
							res.status(200).json(data);
						} else {
							res.status(500).send("Cannot delete issue from publication.");
						}
					} else {
						res.status(500).send("Cannot delete issue.");
					}
				} else {
					res
						.status(500)
						.send("Cannot delete issue. Error: Incorrect fields provided");
				}
			} else {
				res.status(500).send("Cannot delete issue pages.");
			}
		});
	} catch (error) {
		res.status(500).send(`Cannot delete issue. Error: ${error.message}`);
	}
};