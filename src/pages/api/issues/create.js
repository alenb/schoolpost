import clientPromise from "@/lib/mongodb-publications";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { format, formatISO } from "date-fns";
// import createDOMPurify from "dompurify";
// import { JSDOM } from "jsdom";

export const config = {
	api: {
		externalResolver: true,
	},
};

export default async (req, res) => {
	const session = await getSession({ req });
	const currentDate = new Date();
	const formattedDate = format(currentDate, "dd-MM-yyyy");
	// const DOMPurify = createDOMPurify(new JSDOM("").window);

	const publicationId = new ObjectId(req.query.publicationId);
	const client = await clientPromise;
	const db = client.db("publications");

	if (publicationId) {
		let issue = {
			title: `New Draft (${formattedDate})`,
			publicationId: publicationId,
			pages: [],
			dateCreated: formatISO(new Date()),
			dateModified: formatISO(new Date()),
		};

		const issues = await db.collection("issues");
		const issueInsertResult = await issues.insertOne(issue);

		if (issueInsertResult.insertedId) {
			issue = {
				...issue,
				_id: issueInsertResult.insertedId,
				pages: [
					{
						title: `New Page`,
						issueId: new ObjectId(issueInsertResult.insertedId),
						frames: {},
						styles: "",
						// content: {
						// 	component: DOMPurify.sanitize(
						// 		`<div class="my-el">Hello world!</div>`
						// 	),
						// 	styles: `* {box-sizing: border-box;} body {margin: 0;}`,
						// },
						dateCreated: formatISO(new Date()),
						dateModified: formatISO(new Date()),
					},
				],
			};

			const publications = db.collection("publications");
			const publicationUpdateResult = await publications.updateOne(
				{ _id: publicationId },
				{ $push: { issues: new ObjectId(issueInsertResult.insertedId) } }
			);

			if (publicationUpdateResult.modifiedCount === 1) {
				const pages = await db.collection("pages");
				const pageInsertResult = await pages.insertOne(issue.pages[0]);

				if (pageInsertResult.insertedId) {
					const issueUpdateResult = await issues.updateOne(
						{ _id: new ObjectId(issueInsertResult.insertedId) },
						{ $push: { pages: new ObjectId(pageInsertResult.insertedId) } }
					);

					if (issueUpdateResult.modifiedCount === 1) {
						res.status(200).json(issue);
					} else {
						res.status(500).send("Cannot add page to new issue.");
					}
				} else {
					res.status(500).send("Cannot create page for new issue.");
				}
			} else {
				res.status(500).send("Cannot append new issue to publication.");
			}
		} else {
			res.status(500).send("Cannot create issue.");
		}
	} else {
		res
			.status(500)
			.send("Cannot create issue. Error: Incorrect fields provided.");
	}
};
