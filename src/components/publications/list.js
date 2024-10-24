import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import Link from "next/link";
import * as constants from "@/redux/constants";
import { publicationsAdapter } from "@/redux/reducers/publications";
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
	const { data: session } = useSession();
	const dispatch = useDispatch();

	const [anchorEls, setAnchorEls] = useState({});

	const state = useSelector((state) => state.publications);
	const publications = publicationsAdapter.getSelectors().selectAll(state);

	const handleMenu = (event, publicationId) => {
		setAnchorEls((prevAnchorEls) => ({
			...prevAnchorEls,
			[publicationId]: event.currentTarget,
		}));
	};

	const handleMenuClose = (publicationId) => {
		setAnchorEls((prevAnchorEls) => ({
			...prevAnchorEls,
			[publicationId]: null,
		}));
	};

	const handleOpenDialogRename = (publication) => {
		handleMenuClose(publication._id);

		dispatch({
			type: constants.PUBLICATION.SELECTED.type,
			payload: publication,
		});
		dispatch({
			type: constants.PUBLICATION.DIALOG.RENAME.type,
			payload: true,
		});
	};

	const handleOpenDialogDelete = (publication) => {
		handleMenuClose(publication._id);

		dispatch({
			type: constants.PUBLICATION.SELECTED.type,
			payload: publication,
		});
		dispatch({
			type: constants.PUBLICATION.DIALOG.DELETE.type,
			payload: true,
		});
	};

	return publications.map((publication) => (
		<Card key={publication._id}>
			<CardHeader
				action={
					<>
						<IconButton
							onClick={(event) => handleMenu(event, publication._id)}
							aria-label="settings"
						>
							<MoreVertIcon />
						</IconButton>
						<Menu
							anchorEl={anchorEls[publication._id]}
							open={Boolean(anchorEls[publication._id])}
							onClose={() => handleMenuClose(publication._id)}
						>
							<MenuItem
								onClick={(event) => handleOpenDialogRename(publication)}
							>
								Rename
							</MenuItem>
							<MenuItem
								onClick={(event) => handleOpenDialogDelete(publication)}
								sx={{ color: theme.palette.error.dark }}
							>
								Delete
							</MenuItem>
						</Menu>
					</>
				}
				title={publication.title}
			/>
			<Link href={`/publications/${publication._id}`}>
				{publication.image ? (
					<CardMedia
						sx={{ height: 140 }}
						image={`/images/${session.user.id}/${publication.image}`}
						title={publication.title}
					/>
				) : (
					<CardMedia
						sx={{ height: 140 }}
						image="/images/publications.png"
						title={publication.title}
					/>
				)}
			</Link>
		</Card>
	));
}
