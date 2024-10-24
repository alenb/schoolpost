import { useMemo, useState } from "react";
import router from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { createPage, pagesAdapter } from "@/redux/reducers/pages";
import { issuesAdapter, updateIssue } from "@/redux/reducers/issues";
import * as constants from "@/redux/constants";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
	Avatar,
	Divider,
	IconButton,
	List as MuiList,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	ListSubheader,
	Menu,
	MenuItem,
	CircularProgress,
} from "@mui/material";
import {
	PostAdd as AddIcon,
	VerticalSplit as PageIcon,
	MoreVert as PageSettingsIcon,
} from "@mui/icons-material";
import theme from "@/styles/theme";

export default function List() {
	const { issueId, _id } = router.query;
	const [anchorEls, setAnchorEls] = useState({});
	const dispatch = useDispatch();

	const issue = useSelector((state) =>
		issuesAdapter.getSelectors().selectById(state.issues, issueId)
	);

	const pages = useSelector((state) => state.pages);
	const filteredPages = useMemo(
		() =>
			pagesAdapter
				.getSelectors()
				.selectAll(pages)
				.filter((page) => issue.pages.includes(page._id))
				.sort((a, b) => {
					const iA = issue.pages.indexOf(a._id);
					const iB = issue.pages.indexOf(b._id);

					return iA - iB;
				}),
		[issue?.pages, pages]
	);

	const handleMenu = (event, pageId) => {
		setAnchorEls((prevAnchorEls) => ({
			...prevAnchorEls,
			[pageId]: event.currentTarget,
		}));
	};

	const handleMenuClose = (pageId) => {
		setAnchorEls((prevAnchorEls) => ({
			...prevAnchorEls,
			[pageId]: null,
		}));
	};

	const handleCreatePage = async () => {
		await dispatch(createPage(issue._id));
	};

	const handleOpenDialogRename = (page) => {
		handleMenuClose(page._id);

		dispatch({
			type: constants.PAGE.SELECTED.type,
			payload: page,
		});
		dispatch({
			type: constants.PAGE.DIALOG.RENAME.type,
			payload: true,
		});
	};

	const handleOpenDialogDelete = (page) => {
		handleMenuClose(page._id);

		dispatch({
			type: constants.PAGE.SELECTED.type,
			payload: page,
		});
		dispatch({
			type: constants.PAGE.DIALOG.DELETE.type,
			payload: true,
		});
	};

	const handleDragEnd = async (result) => {
		if (
			!result.destination ||
			result.source.index === result.destination.index
		) {
			return;
		}

		const issuePages = [...issue.pages];
		const [removed] = issuePages.splice(result.source.index, 1);
		issuePages.splice(result.destination.index, 0, removed);

		dispatch(
			updateIssue({
				...issue,
				pages: issuePages,
			})
		);
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="page-list">
				{(provided, snapshot) => (
					<MuiList
						{...provided.droppableProps}
						ref={provided.innerRef}
						sx={{ width: "100%", height: "100%", bgcolor: "background.paper" }}
						subheader={<ListSubheader>Pages</ListSubheader>}
					>
						<ListItemButton
							onClick={() => handleCreatePage()}
							LinkComponent={Link}
						>
							<ListItemAvatar>
								<Avatar sx={{ bgcolor: "primary.main" }}>
									<AddIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Add Page" />
						</ListItemButton>
						<Divider />

						{filteredPages.length === 0 ? (
							<ListItem>
								<CircularProgress />
							</ListItem>
						) : (
							filteredPages.map((page, index) => (
								<Draggable key={page._id} draggableId={page._id} index={index}>
									{(provided) => (
										<ListItem
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											ref={provided.innerRef}
											key={page._id}
											secondaryAction={
												<>
													<IconButton
														onClick={(event) => handleMenu(event, page._id)}
														aria-label="settings"
													>
														<PageSettingsIcon />
													</IconButton>
													<Menu
														anchorEl={anchorEls[page._id]}
														open={Boolean(anchorEls[page._id])}
														onClose={() => handleMenuClose(page._id)}
													>
														<MenuItem
															onClick={() => handleOpenDialogRename(page)}
														>
															Rename
														</MenuItem>

														{filteredPages.length > 1 && (
															<MenuItem
																onClick={() => handleOpenDialogDelete(page)}
																sx={{ color: theme.palette.error.dark }}
															>
																Delete
															</MenuItem>
														)}
													</Menu>
												</>
											}
											disablePadding
										>
											<ListItemButton
												href={`/issues/${issue._id}/edit/${page._id}`}
												LinkComponent={Link}
												selected={page._id === _id}
											>
												<ListItemAvatar>
													<Avatar alt={page.title}>
														<PageIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText primary={page.title} />
											</ListItemButton>
										</ListItem>
									)}
								</Draggable>
							))
						)}

						{provided.placeholder}
					</MuiList>
				)}
			</Droppable>
		</DragDropContext>
	);
}
