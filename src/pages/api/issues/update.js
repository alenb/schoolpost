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
			if (err) {
				res.status(500).send(`Cannot update issue. Error: ${err.message}`);
			}

			const issue = JSON.parse(fields.issue[0]);
			issue._id = new ObjectId(issue._id);
			issue.publicationId = new ObjectId(issue.publicationId);
			issue.pages = issue.pages.map((pageId) => new ObjectId(pageId));

			const updateIssueFields = {
				$set: { dateModified: formatISO(new Date()) },
			};

			for (const key in issue) {
				if (key !== "_id" && key !== "publicationId") {
					updateIssueFields.$set[key] = issue[key];
				}
			}

			const client = await clientPromise;
			const db = client.db("publications");

			if (issue._id) {
				const issues = db.collection("issues");
				const issueUpdateResult = await issues.updateOne(
					{ _id: issue._id },
					updateIssueFields
				);

        if (issueUpdateResult.modifiedCount === 1) {
          const updatedIssue = await issues.findOne({ _id: issue._id });
					res.status(200).json(updatedIssue);
				} else {
					res.status(500).send("Cannot update issue.");
				}
			} else {
				res
					.status(500)
					.send("Cannot update issue. Error: Incorrect fields provided.");
			}
		});
	} catch (error) {
		res.status(500).send(`Cannot update issue. Error: ${error.message}`);
	}
};
