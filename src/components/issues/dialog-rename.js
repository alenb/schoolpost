import { useDispatch, useSelector } from "react-redux";
import { toggleIssueDialogRename, updateIssue } from "@/redux/reducers/issues";
import * as constants from "@/redux/constants";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";

export default function DialogRename() {
	const dispatch = useDispatch();
	const issues = useSelector((state) => state.issues);
	const selectedIssue = issues.select;

	const handleClose = () => {
		dispatch(toggleIssueDialogRename(false, null));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const { title } = event.target;
		const updatedIssue = { ...selectedIssue, title: title.value };

		dispatch(updateIssue(updatedIssue));

		handleClose();
	};

	return (
		selectedIssue && (
			<Dialog
				open={issues.openDialogRename}
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
							placeholder={selectedIssue.title}
							helperText="Please enter a new name for your publication."
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
