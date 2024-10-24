import { enqueueSnackbar, closeSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export const showSnackbar = (message, variant = "success", action = null) => {
	const snackbarId = enqueueSnackbar(message, {
		variant,
		action: (snackbarId) => (
			<>
				{action ? (
					action(snackbarId)
				) : (
					<>
						<IconButton
							size="small"
							aria-label="close"
							color="inherit"
							onClick={() => {
								closeSnackbar(snackbarId);
							}}
						>
							<Close fontSize="small" />
						</IconButton>
					</>
				)}
			</>
		),
	});

	return snackbarId;
};
