import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { issuesAdapter } from "@/redux/reducers/issues";
import { selectPublication } from "@/redux/selectors/publications";
import { selectPagesByIds } from "@/redux/selectors/pages";
import {
	Typography,
	Paper,
	Grid as MuiGrid,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	ListItemIcon,
	Box,
	Divider,
} from "@mui/material";
import { LibraryBooks as PageIcon } from "@mui/icons-material";
import { format } from "date-fns";
import styles from "@/pages/issues/[issueId]/index.module.scss";
import slugify from "slugify";

export default function Grid() {
	const router = useRouter();
	const { issueId } = router.query;
	const dispatch = useDispatch();

	const issue = useSelector((state) =>
		issuesAdapter.getSelectors().selectById(state.issues, issueId)
	);
	const pages = useSelector(
		(state) => selectPagesByIds(state.pages, issue?.pages),
		[dispatch, issue?.pages]
	);
	const publication = useSelector(
		(state) => selectPublication(state.publications, issue?.publicationId),
		[dispatch, issue?.publicationId]
	);

	return (
		<Box display="flex" flexDirection="column" gap="30px">
			<Paper id="#cover" elevation={0} className={styles.newsletterCover}>
				<MuiGrid container spacing={4}>
					<MuiGrid item sm={4} xs={12}>
						<Typography variant="body1">{publication.title}</Typography>
						<Typography variant="h1">{issue.title}</Typography>
						<Typography variant="body1">
							{format(new Date(issue.dateCreated), "do MMM yyyy")}
						</Typography>
					</MuiGrid>

					<MuiGrid item sm={8} xs={12}>
						<Typography variant="h4">In this issue</Typography>
						<List sx={{ columnCount: 2 }}>
							{pages.map((page) => {
								const title = slugify(page.title, { lower: true });

								return (
									<ListItem key={page._id} disablePadding>
										<ListItemButton href={`#${title}`}>
											<ListItemIcon>
												<PageIcon />
											</ListItemIcon>
											<ListItemText>{page.title}</ListItemText>
										</ListItemButton>
									</ListItem>
								);
							})}
						</List>
					</MuiGrid>
				</MuiGrid>
			</Paper>

			{pages.map((page) => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(page.html, "text/html");
				const bodyContent = doc.body.innerHTML;
				const bodyStyles = doc.body.getAttribute("style");
				const bodyId = doc.body.getAttribute("id");
				const title = slugify(page.title, { lower: true });

				return (
					bodyContent !== "undefined" && (
						<Paper id={title} key={page._id} elevation={0}>
							<Typography variant="h2" padding={4}>
								<PageIcon
									sx={{ fontSize: 35, marginRight: 2, verticalAlign: "middle" }}
								/>
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
			})}
		</Box>
	);
}
