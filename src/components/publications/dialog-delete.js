import { useDispatch, useSelector } from "react-redux";
import { deletePublication } from "@/redux/reducers/publications";
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
	const publications = useSelector((state) => state.publications);
	const selectedPublication = publications.select;

	const handleClose = () => {
		dispatch({
			type: constants.PUBLICATION.SELECTED.type,
			payload: null,
		});
		dispatch({
			type: constants.PUBLICATION.DIALOG.DELETE.type,
			payload: false,
		});
	};

	const handleSubmit = async () => {
		await dispatch(deletePublication(selectedPublication));
		handleClose();
	};

	return (
		selectedPublication && (
			<Dialog
				open={publications.openDialogDelete}
				onClose={handleClose}
				sx={{
					"& .MuiDialog-paper": {
						width: "600px",
					},
				}}
			>
				<DialogTitle>Delete</DialogTitle>
				<DialogContent>
					Are you sure you want to delete the publication?
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
