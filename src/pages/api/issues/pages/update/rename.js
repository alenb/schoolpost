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
				return res
					.status(500)
					.json({ message: `Cannot rename issue page. Error: ${err.message}` });
			}

			const _id = new ObjectId(fields._id[0]);
			const title = fields.title[0];

			const client = await clientPromise;
			const db = client.db("publications");

			if (_id && title) {
				const pages = db.collection("pages");
				const pageUpdateResult = await pages.updateOne(
					{ _id: _id },
					{ $set: { title: title, dateModified: formatISO(new Date()) } }
				);

				if (pageUpdateResult.modifiedCount === 1) {
					const page = await pages.findOne({
						_id: _id,
					});

					return res.json(page);
				} else {
					return res.status(500).json({ message: "Cannot rename issue page." });
				}
			} else {
				return res.status(500).json({
					message: "Cannot rename issue page. Error: Incorrect fields provided.",
				});
			}
		});
	} catch (err) {
		return res.status(500).json({ message: `Cannot rename issue page. Error: ${err.message}` });
	}
};
