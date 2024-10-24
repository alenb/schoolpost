import React from "react";
import router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import * as constants from "@/redux/constants";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Input,
	TextField,
} from "@mui/material";

export default function DialogCreate() {
	const dispatch = useDispatch();
	const publications = useSelector((state) => state.publications);

	const handleClose = () => {
		dispatch({
			type: constants.DIALOG_CREATE_PUBLICATION.type,
			payload: false,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);

		const response = await fetch(`/api/publications/create`, {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			const data = await response.json();

			dispatch({
				type: constants.CREATE_PUBLICATION.type,
				payload: data,
			});

			handleClose();

			router.push(`/publications/${data._id}`);
		} else {
			throw new Error(`Cannot create publication. Code: ${response.status}`);
		}
	};

	return (
		<Dialog
			open={publications.openDialogCreate}
			onClose={handleClose}
			sx={{
				"& .MuiDialog-paper": {
					width: "600px",
				},
			}}
		>
			<form onSubmit={handleSubmit} encType="multipart/form-data">
				<DialogTitle>New Publication</DialogTitle>
				<DialogContent
					sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
				>
					Publications contain newsletters destributed to your subscribers.
					<TextField
						label="Title"
						variant="outlined"
						name="title"
						helperText="Please enter a title for your new publication."
						fullWidth
					/>
					<Input type="file" name="image" />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Close</Button>
					<Button type="submit" variant="contained" autoFocus>
						Create
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
