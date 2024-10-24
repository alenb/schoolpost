import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIssue } from "@/redux/selectors/issues";
import { selectPage, selectPagesByIds } from "@/redux/selectors/pages";
import { selectPublication } from "@/redux/selectors/publications";
import {
	Box,
	Breadcrumbs,
	Divider,
	Drawer,
	IconButton,
	Link,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	AppBar as MuiAppBar,
	ToggleButton,
	ToggleButtonGroup,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import {
	ViewDay,
	WebStories,
	Menu,
	ChevronLeft,
	ChevronRight,
	LibraryBooks as PageIcon,
	Home,
} from "@mui/icons-material";
import { format } from "date-fns";
import styles from "@/pages/issues/[issueId]/index.module.scss";

export const AppBarDrawer = ({
	publication,
	issue,
	pages,
	showMenu,
	toggleMenu,
}) => (
	<Drawer anchor="left" open={showMenu} onClose={() => toggleMenu(false)}>
		<Box
			paddingLeft={2}
			paddingRight={2}
			paddingTop={2}
			sx={{ width: "400px" }}
		>
			<Typography variant="body1">{publication.title}</Typography>
			<Typography variant="h1">{issue.title}</Typography>
			<Typography variant="body1">
				{format(new Date(issue.dateCreated), "do MMM yyyy")}
			</Typography>
		</Box>
		<Divider sx={{ marginTop: 4, marginBottom: 4 }} />
		<Box paddingLeft={2} paddingRight={2}>
			<Typography variant="h3">In this issue</Typography>
		</Box>
		<List>
			<ListItem key={0} disablePadding>
				<ListItemButton href={`/issues/${issue._id}/#cover`}>
					<ListItemIcon>
						<Home />
					</ListItemIcon>
					<ListItemText>Cover</ListItemText>
				</ListItemButton>
			</ListItem>
			{pages.map((page, index) => (
				<ListItem key={page._id} disablePadding>
					<ListItemButton href={`/issues/${issue._id}/page/${index + 1}`}>
						<ListItemIcon>
							<PageIcon />
						</ListItemIcon>
						<ListItemText>{page.title}</ListItemText>
					</ListItemButton>
				</ListItem>
			))}
		</List>
	</Drawer>
);

export const AppBarToggleButtonGroup = ({ issue }) => {
	const router = useRouter();
	const { pageId } = router.query;

	return (
		<ToggleButtonGroup
			exclusive
			aria-label="newsletter views"
			sx={{ marginLeft: "auto" }}
		>
			{router.pathname.includes("page") && (
				<Tooltip title="View All Pages">
					<ToggleButton
						value="grid"
						aria-label="View All"
						href={`/issues/${issue._id}/`}
					>
						<ViewDay />
					</ToggleButton>
				</Tooltip>
			)}
			{!router.pathname.includes("page") && (
				<Tooltip title="Page Scroll">
					<ToggleButton
						value="scroll"
						aria-label="Page Scroll"
						href={`/issues/${issue._id}/page/1`}
					>
						<WebStories />
					</ToggleButton>
				</Tooltip>
			)}
			{pageId > 1 && (
				<Tooltip title="Previous Page">
					<ToggleButton
						value="scrollLeft"
						aria-label="Scroll Left"
						href={`/issues/${issue._id}/page/${Number(pageId) - 1}`}
					>
						<ChevronLeft />
					</ToggleButton>
				</Tooltip>
			)}
			{pageId < issue.pages.length && (
				<Tooltip title="Next Page">
					<ToggleButton
						value="scrollRight"
						aria-label="Scroll Right"
						href={`/issues/${issue._id}/page/${Number(pageId) + 1}`}
					>
						<ChevronRight />
					</ToggleButton>
				</Tooltip>
			)}
		</ToggleButtonGroup>
	);
};

export default function AppBar() {
	const router = useRouter();
	const { issueId, pageId } = router.query;
	const [showMenu, setShowMenu] = useState(false);
	const dispatch = useDispatch();

	const issue = useSelector(
		(state) => selectIssue(state.issues, issueId),
		[dispatch, issueId]
	);
	const pages = useSelector(
		(state) => selectPagesByIds(state.pages, issue?.pages),
		[dispatch, issue]
	);
	const page = useSelector(
		(state) => selectPage(state.pages, issue?.pages[pageId - 1]),
		[dispatch, issue, pageId]
	);
	const publication = useSelector(
		(state) => selectPublication(state.publications, issue?.publicationId),
		[dispatch, issue?.publicationId]
	);

	const toggleMenu = (open) => {
		setShowMenu(open);
	};

	return (
		<>
			<AppBarDrawer
				publication={publication}
				issue={issue}
				pages={pages}
				showMenu={showMenu}
				toggleMenu={toggleMenu}
			/>
			<MuiAppBar position="sticky" className={styles.noPrint}>
				<Toolbar>
					<Tooltip title="Menu">
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							onClick={() => toggleMenu(true)}
							sx={{ mr: 2 }}
						>
							<Menu />
						</IconButton>
					</Tooltip>
					<Breadcrumbs aria-label="breadcrumb">
						<Link
							underline="hover"
							color="inherit"
							href={`/publications/${issue.publicationId}`}
						>
							{publication.title}
						</Link>
						<Link
							underline="hover"
							color="inherit"
							href={`/issues/${issue._id}`}
						>
							{issue.title}
						</Link>
						<Typography color="text.primary">
							{page?.title || "Cover"}
						</Typography>
					</Breadcrumbs>
					<AppBarToggleButtonGroup
						publication={publication}
						issue={issue}
						page={page}
					/>
				</Toolbar>
			</MuiAppBar>
		</>
	);
}
