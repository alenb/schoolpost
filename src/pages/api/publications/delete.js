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
				res.status(500).send(`Cannot delete publication. Error: ${err}`);
			}

			const publicationData = JSON.parse(fields.publication[0]);
			const _id = new ObjectId(publicationData._id);
			const client = await clientPromise;
			const db = client.db("publications");

			if (_id) {
				const publications = db.collection("publications");
				const issues = db.collection("issues");
				const pages = db.collection("pages");

				const publication = await publications.findOne({ _id: _id });
				const issueObjectIds = publication.issues.map((id) => new ObjectId(id));

				const pagesDeleteResult = await pages.deleteMany({
					issueId: { $in: issueObjectIds },
				});

				if (pagesDeleteResult.acknowledged) {
					const issuesDeleteResult = await issues.deleteMany({
						_id: { $in: issueObjectIds },
					});

					if (issuesDeleteResult.acknowledged) {
						const publicationDeleteResult = await publications.deleteOne({
							_id: _id,
						});

						if (publicationDeleteResult.acknowledged) {
							res.json(publication);
						} else {
							res.status(500).send("Cannot delete publication.");
						}
					} else {
						res.status(500).send("Cannot delete publication issues.");
					}
				} else {
					res.status(500).send("Cannot delete publication issue pages.");
				}
			} else {
				res
					.status(500)
					.send("Cannot delete publication. Incorrect fields provided.");
			}
		});
	} catch (error) {
		res.status(500).send(`Cannot delete publication. Error: ${error.message}`);
	}
};

// export default deletePublication;
