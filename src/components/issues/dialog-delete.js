import { useDispatch, useSelector } from "react-redux";
import { deleteIssue, toggleIssueDialogDelete } from "@/redux/reducers/issues";
import * as constants from "@/redux/constants";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";

export default function DialogDelete() {
	const dispatch = useDispatch();
	const issues = useSelector((state) => state.issues);
	const selectedIssue = issues.select;

  const handleClose = () => {
    dispatch(toggleIssueDialogDelete(false, null));
	};

  const handleSubmit = () => {
    dispatch(deleteIssue(issues?.select));
    handleClose();
	};

	return (
		issues?.select && (
			<Dialog
				open={issues.openDialogDelete}
				onClose={handleClose}
				sx={{
					"& .MuiDialog-paper": {
						width: "600px",
					},
				}}
			>
				<DialogTitle>Delete</DialogTitle>
				<DialogContent>
					Are you sure you want to delete the issue?
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						type="submit"
						variant="contained"
						color="error"
						onClick={handleSubmit}
						autoFocus
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		)
	);
}
