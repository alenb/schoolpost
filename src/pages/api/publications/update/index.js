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
				res
					.status(500)
					.send(`Cannot update publication. Error: ${err.message}`);
			}

			const publication = JSON.parse(fields.publication[0]);
			publication._id = new ObjectId(publication._id);

			const updatePublicationFields = {
				$set: { dateModified: formatISO(new Date()) },
			};

			for (const key in publication) {
				if (key !== "_id") {
					updatePublicationFields.$set[key] = publication[key];
				}
			}

			const client = await clientPromise;
			const db = client.db("publications");

			if (publication._id) {
				const publications = db.collection("publications");
				const publicationUpdateResult = await publications.updateOne(
					{ _id: publication._id },
					updatePublicationFields
				);

        if (publicationUpdateResult.modifiedCount === 1) {
          const updatedPublication = await publications.findOne({ _id: publication._id });
					res.status(200).json(updatedPublication);
				} else {
					res.status(500).send("Cannot update publication.");
				}
			} else {
				res
					.status(500)
					.send("Cannot update publication. Error: Incorrect fields provided.");
			}
		});
	} catch (error) {
		res.status(500).send(`Cannot update publication. Error: ${error.message}`);
	}
};