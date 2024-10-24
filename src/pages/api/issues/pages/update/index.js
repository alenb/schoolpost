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
				res.status(500).send(`Cannot update issue page. Error: ${err.message}`);
			}

			const page = JSON.parse(fields.page[0]);
			page._id = new ObjectId(page._id);
			page.issueId = new ObjectId(page.issueId);

			const updatePageFields = {
				$set: { dateModified: formatISO(new Date()) },
			};

			for (const key in page) {
				if (key !== "_id" && key !== "issueId") {
					updatePageFields.$set[key] = page[key];
				}
			}

			const client = await clientPromise;
			const db = client.db("publications");

			if (page._id) {
				const pages = db.collection("pages");
				const pageUpdateResult = await pages.updateOne(
					{ _id: page._id },
					updatePageFields
				);

        if (pageUpdateResult.modifiedCount === 1) {
          const updatedPage = await pages.findOne({ _id: page._id });
					res.status(200).json(updatedPage);
				} else {
					res.status(500).send("Cannot update issue page.");
				}
			} else {
				res
					.status(500)
					.send("Cannot update issue page. Error: Incorrect fields provided.");
			}
		});
	} catch (error) {
		res.status(500).send(`Cannot update issue page. Error: ${error.message}`);
	}
};
