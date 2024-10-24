import clientPromise from "@/lib/mongodb-publications";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { formatISO } from "date-fns";
// import createDOMPurify from "dompurify";
// import { JSDOM } from "jsdom";

export const config = {
	api: {
		externalResolver: true,
	},
};

const createPage = async (req, res) => {
	const session = await getSession({ req });
	// const DOMPurify = createDOMPurify(new JSDOM("").window);

	const issueId = new ObjectId(req.query.issueId);
	const client = await clientPromise;
	const db = client.db("publications");

	if (issueId) {
		let page = {
			title: `New Page`,
			issueId: issueId,
			frames: {},
			styles: "",
			dateCreated: formatISO(new Date()),
			dateModified: formatISO(new Date()),
		};

		const pages = await db.collection("pages");
		const pageInsertResult = await pages.insertOne(page);

		if (pageInsertResult.insertedId) {
			page = {
				...page,
				_id: pageInsertResult.insertedId,
			};

			const issues = db.collection("issues");
			const issueUpdateResult = await issues.updateOne(
				{ _id: issueId },
				{ $push: { pages: new ObjectId(pageInsertResult.insertedId) } }
			);

			if (issueUpdateResult.modifiedCount === 1) {
				res.status(200).json(page);
			} else {
				res.status(500).send("Cannot update issue.");
			}
		} else {
			res.status(500).send("Cannot create issue page.");
		}
	} else {
		res
			.status(500)
			.send("Cannot create issue page. Error: Incorrect fields provided.");
	}
};

export default createPage;