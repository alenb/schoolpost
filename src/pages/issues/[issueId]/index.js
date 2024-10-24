import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import BlankLayout from "@/layouts/blank";
import { readPublication } from "@/redux/reducers/publications";
import { readIssue } from "@/redux/reducers/issues";
import { readPages } from "@/redux/reducers/pages";
import { selectIssue } from "@/redux/selectors/issues";
import { selectPagesByIds } from "@/redux/selectors/pages";
import { selectPublication } from "@/redux/selectors/publications";
import { IssueAppBar, IssueGrid } from "@/components/issues";
import {
	Typography,
	Container,
	Grid,
	Stack,
	Skeleton,
	Box,
} from "@mui/material";
import { format } from "date-fns";
import styles from "./index.module.scss";

const Issue = () => {
	const router = useRouter();
	const { issueId } = router.query;
	const [notFound, setNotFound] = useState(false);
	const { data: session } = useSession();
	const dispatch = useDispatch();

	const issue = useSelector(
		(state) => selectIssue(state.issues, issueId),
		[dispatch, issueId]
	);
	const pages = useSelector(
		(state) => selectPagesByIds(state.pages, issue?.pages),
		[dispatch, issue?.pages]
	);
	const publication = useSelector(
		(state) => selectPublication(state.publications, issue?.publicationId),
		[dispatch, issue?.publicationId]
	);

	const getIssue = async () => {
		await dispatch(readIssue(issueId))
			.unwrap()
			.catch((error) => {
				setNotFound(true);
			});
	};

	useEffect(() => {
		if (issueId) {
			getIssue();
		}
	}, [dispatch, issueId]);

	useEffect(() => {
		if (issue) {
			dispatch(readPages({ pageIds: issue.pages }));
			dispatch(readPublication(issue.publicationId));
		}
	}, [dispatch, issue]);

	return (
		<Container maxWidth="lg" className={styles.newsletter}>
			{!issue || !pages || !publication ? (
				notFound ? (
					<Grid container spacing={4} minHeight="100vh" alignItems="center">
						<Grid item sm={6}>
							<Image
								src="/images/404.png"
								width={430}
								height={306}
								alt="Issue not found"
							/>
						</Grid>
						<Grid item sm={6}>
							<Typography variant="h1">Issue Not Found</Typography>
						</Grid>
					</Grid>
				) : (
					<Stack spacing={2}>
						<Skeleton variant="rectangular" height={60} />
						<Box display="flex" gap={2}>
							<Skeleton variant="rectangular" width="33.33%" height={60} />
							<Skeleton variant="rectangular" width="33.33%" height={60} />
							<Skeleton variant="rectangular" width="33.33%" height={60} />
						</Box>
						<Skeleton variant="rectangular" height={120} />
						<Skeleton variant="rectangular" height={240} />
						<Skeleton variant="rectangular" height={180} />
					</Stack>
				)
			) : (
				<>
					<Head>
						<title>
							{publication.title} - {issue.title} -{" "}
							{format(new Date(issue.dateCreated), "do MMM yyyy")}
						</title>
					</Head>

					<IssueAppBar />

					<IssueGrid />
				</>
			)}
		</Container>
	);
};

Issue.layout = BlankLayout;

export default Issue;
