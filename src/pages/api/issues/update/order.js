import clientPromise from "@/lib/mongodb-publications";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { formatISO } from "date-fns";
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
			const _id = new ObjectId(fields._id[0]);
			const pages = JSON.parse(fields.pages[0]);
			const pagesObjectIds = pages.map((page) => new ObjectId(page));

			const client = await clientPromise;
			const db = client.db("publications");
			const issues = db.collection("issues");

			if (!_id || !pagesObjectIds || !Array.isArray(pagesObjectIds)) {
				return res.status(400).json({ message: "Invalid input data." });
			}

			const issueUpdateResult = await issues.updateOne(
				{ _id: _id },
				{
					$set: {
						pages: pagesObjectIds,
						dateModified: formatISO(new Date()),
					},
				}
			);

			if (issueUpdateResult.modifiedCount === 1) {
				const issue = await issues.findOne({ _id: _id });

				return res.json(issue);
			} else {
				return res.status(500).json({ message: "Cannot reorder issue pages." });
			}
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: `Cannot reorder issue pages. Error: ${error.message}` });
	}
};
