import { useDispatch, useSelector } from "react-redux";
import { updatePublication } from "@/redux/reducers/publications";
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
	const publications = useSelector((state) => state.publications);
	const selectedPublication = publications.select;

	const handleClose = () => {
		dispatch({
			type: constants.PUBLICATION.SELECTED.type,
			payload: null,
		});
		dispatch({
			type: constants.PUBLICATION.DIALOG.RENAME.type,
			payload: false,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const { title } = event.target;
		const updatedPublication = { ...selectedPublication, title: title.value };

		dispatch(updatePublication(updatedPublication));

		handleClose();
	};

	return (
		selectedPublication && (
			<Dialog
				open={publications.openDialogRename}
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
							placeholder={selectedPublication.title}
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
