import { useDispatch, useSelector } from "react-redux";
import { updatePage } from "@/redux/reducers/pages";
import * as constants from "@/redux/constants";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
import { useEffect } from "react";

export default function DialogRename() {
	const dispatch = useDispatch();
	const pages = useSelector((state) => state.pages);
	const selectedPage = pages.select;

	//   useEffect(() => {
	// console.log(selectedPage)
	//   }, [selectedPage]);

	const handleClose = () => {
		dispatch({
			type: constants.PAGE.SELECTED.type,
			payload: null,
		});
		dispatch({
			type: constants.PAGE.DIALOG.RENAME.type,
			payload: false,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const { title } = event.target;
		const updatedPage = { ...selectedPage, title: title.value };

		dispatch(updatePage(updatedPage));

		handleClose();
	};

	return (
		selectedPage && (
			<Dialog
				open={pages.openDialogRename}
				onClose={handleClose}
				sx={{
					"& .MuiDialog-paper": {
						width: "600px",
					},
				}}
			>
				<form onSubmit={handleSubmit} encType="multipart/form-data">
					<DialogTitle>Rename</DialogTitle>
					<DialogContent>
						<TextField
							label="Title"
							variant="outlined"
							name="title"
							placeholder={selectedPage.title}
							helperText="Please enter a new name for your selectedPage."
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button type="submit" variant="contained" autoFocus>
							Save
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		)
	);
}
