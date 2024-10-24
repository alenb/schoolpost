import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { readPublications } from "@/redux/reducers/publications";
import { createIssue, readIssues } from "@/redux/reducers/issues";
import { selectPublication } from "@/redux/selectors/publications";
import {
	IssueDialogDelete,
	IssueDialogRename,
	IssueList,
} from "@/components/issues";
import { Box, Button, Typography, Container } from "@mui/material";
import Head from "next/head";

export default function Publication() {
	const router = useRouter();
	const { _id } = router.query;
	const { data: session } = useSession();
	const dispatch = useDispatch();

	const publication = useSelector(
		(state) => selectPublication(state.publications, _id),
		[dispatch, _id]
	);

	const handleCreateIssue = () => {
		dispatch(createIssue(publication._id));
	};

	useEffect(() => {
		if (!publication) {
			dispatch(readPublications());
		}
	}, [dispatch, publication]);

	useEffect(() => {
		if (publication?.issues.length > 0) {
			dispatch(readIssues({ issueIds: publication.issues }));
		}
	}, [dispatch, publication]);

	return (
		publication && (
			<>
				<Head>
					<title>
						{process.env.NEXT_PUBLIC_APP_NAME} - {publication.title}
					</title>
				</Head>

				<Container maxWidth="xl">
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ py: 3 }}
					>
						<Box display="flex" alignItems="center" gap="15px">
							<Typography variant="h1">{publication.title}</Typography>
						</Box>

						<Button variant="outlined" onClick={() => handleCreateIssue()}>
							Create Issue
						</Button>
					</Box>

					<Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="30px">
						<IssueList />
					</Box>
				</Container>

				<IssueDialogDelete />
				<IssueDialogRename />
			</>
		)
	);
}
