import clientPromise from "@/lib/mongodb-publications";
import { getSession } from "next-auth/react";
import { format, formatISO } from "date-fns";

export const config = {
	api: {
		externalResolver: true,
	},
};

export default async (req, res) => {
	const session = await getSession({ req });
	const currentDate = new Date();
	const formattedDate = format(currentDate, "dd-MM-yyyy");

	const client = await clientPromise;
	const db = client.db("publications");

	let publication = {
		title: `New Draft (${formattedDate})`,
		issues: [],
		dateCreated: formatISO(new Date()),
		dateModified: formatISO(new Date()),
	};

	const publications = await db.collection("publications");
	const publicationInsertResult = await publications.insertOne(publication);

	if (publicationInsertResult.insertedId) {
		publication = {
			...publication,
			_id: publicationInsertResult.insertedId,
		};

		res.status(200).json(publication);
	} else {
		res.status(500).send("Cannot create publication.");
	}
};