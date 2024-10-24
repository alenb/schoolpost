import router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { deletePage } from "@/redux/reducers/pages";
import { issuesAdapter } from "@/redux/reducers/issues";
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

	const pages = useSelector((state) => state.pages);
	const selectedPage = pages.select;

	const issue = useSelector((state) =>
    issuesAdapter.getSelectors().selectById(state.issues, selectedPage?.issueId),
    [dispatch, selectedPage?.issueId]
	);

	const handleClose = () => {
		dispatch({
			type: constants.PAGE.SELECTED.type,
			payload: null,
		});
		dispatch({
			type: constants.PAGE.DIALOG.DELETE.type,
			payload: false,
		});
	};

	const handleSubmit = async () => {
		dispatch(deletePage(selectedPage));
    handleClose();
		router.push(`/issues/${issue._id}/edit/${issue.pages[0]}`);
	};

	return (
		selectedPage && (
			<Dialog
				open={pages.openDialogDelete}
				onClose={handleClose}
				sx={{
					"& .MuiDialog-paper": {
						width: "600px",
					},
				}}
			>
				<DialogTitle>Delete</DialogTitle>
				<DialogContent>Are you sure you want to delete the page?</DialogContent>
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
