import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	toggleIssueDialogDelete,
	toggleIssueDialogRename,
} from "@/redux/reducers/issues";
import { selectPublication } from "@/redux/selectors/publications";
import { selectIssuesByIds } from "@/redux/selectors/issues";
import {
	Card,
	CardMedia,
	CardHeader,
	IconButton,
	Menu,
	MenuItem,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import theme from "@/styles/theme";

export default function List() {
	const router = useRouter();
	const { _id } = router.query;
	const { data: session } = useSession();
	const dispatch = useDispatch();

	const [anchorEls, setAnchorEls] = useState({});

	const publication = useSelector(
		(state) => selectPublication(state.publications, _id),
		[dispatch, _id]
	);
	const issues = useSelector(
		(state) => selectIssuesByIds(state.issues, publication?.issues),
		[dispatch, publication?.issues]
	);

	const handleMenu = (event, issueId) => {
		setAnchorEls((prevAnchorEls) => ({
			...prevAnchorEls,
			[issueId]: event.currentTarget,
		}));
	};

	const handleMenuClose = (issueId) => {
		setAnchorEls((prevAnchorEls) => ({
			...prevAnchorEls,
			[issueId]: null,
		}));
	};

	const handleOpenDialogRename = (issue) => {
		handleMenuClose(issue._id);
		dispatch(toggleIssueDialogRename(true, issue));
	};

	const handleOpenDialogDelete = (issue) => {
		handleMenuClose(issue._id);
		dispatch(toggleIssueDialogDelete(true, issue));
	};

	return issues.map((issue) => (
		<Card key={issue._id}>
			<CardHeader
				action={
					<>
						<IconButton
							onClick={(event) => handleMenu(event, issue._id)}
							aria-label="settings"
						>
							<MoreVertIcon />
						</IconButton>
						<Menu
							anchorEl={anchorEls[issue._id]}
							open={Boolean(anchorEls[issue._id])}
							onClose={() => handleMenuClose(issue._id)}
						>
							<MenuItem onClick={(event) => handleOpenDialogRename(issue)}>
								Rename
							</MenuItem>
							<MenuItem
								onClick={(event) => handleOpenDialogDelete(issue)}
								sx={{ color: theme.palette.error.dark }}
							>
								Delete
							</MenuItem>
						</Menu>
					</>
				}
				title={issue.title}
			/>
			<Link href={`/issues/${issue._id}/edit`}>
				{issue.image ? (
					<CardMedia
						sx={{ height: 140 }}
						image={`/images/${session.user.id}/${issue.image}`}
						title={issue.title}
					/>
				) : (
					<CardMedia
						sx={{ height: 140 }}
						image="/images/publications.png"
						title={issue.title}
					/>
				)}
			</Link>
		</Card>
	));
}
