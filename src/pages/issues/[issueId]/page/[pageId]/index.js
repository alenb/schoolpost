import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readPublication } from "@/redux/reducers/publications";
import { readIssue } from "@/redux/reducers/issues";
import { readPages } from "@/redux/reducers/pages";
import { selectPublication } from "@/redux/selectors/publications";
import { selectIssue } from "@/redux/selectors/issues";
import { selectPage } from "@/redux/selectors/pages";
import BlankLayout from "@/layouts/blank";
import {
	Typography,
	Paper,
	Container,
	Grid,
	Stack,
	Skeleton,
	Box,
	Divider,
} from "@mui/material";
import { IssueAppBar } from "@/components/issues";
import styles from "@/pages/issues/[issueId]/index.module.scss";

export const PageHtml = ({ page }) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(page.html, "text/html");
	const bodyContent = doc.body.innerHTML;
	const bodyStyles = doc.body.getAttribute("style");
	const bodyId = doc.body.getAttribute("id");

	return (
		bodyContent !== "undefined" && (
			<Paper id={`page-${page._id}`} key={page._id} elevation={0}>
				<Typography variant="h2" padding={4}>
					{page.title}
				</Typography>
				<Divider />
				<style>{page.styles}</style>
				<div
					id={bodyId}
					style={bodyStyles}
					dangerouslySetInnerHTML={{ __html: bodyContent }}
				/>
			</Paper>
		)
	);
};

const IssuePage = () => {
	const router = useRouter();
	const { issueId, pageId } = router.query;
	const [notFound, setNotFound] = useState(false);
	const { data: session } = useSession();
	const dispatch = useDispatch();

	const issue = useSelector(
		(state) => selectIssue(state.issues, issueId),
		[dispatch, issueId]
	);
	const page = useSelector(
		(state) => selectPage(state.pages, issue?.pages[pageId - 1]),
		[dispatch, pageId, issue?.pages]
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

	useEffect(() => {
    if (issue && !issue?.pages[pageId - 1]) {
      setNotFound(true);
		}
	}, [dispatch, issue, pageId]);

	return (
		<Container maxWidth="lg" className={styles.newsletter}>
			{!issue || !page || !publication ? (
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
							{publication.title} - {issue.title} - {page.title}
						</title>
					</Head>

					<IssueAppBar />

					<PageHtml page={page} />
				</>
			)}
		</Container>
	);
};

IssuePage.layout = BlankLayout;

export default IssuePage;
