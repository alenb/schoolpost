import router from "next/router";
import {
	createSlice,
	createEntityAdapter,
	createAsyncThunk,
} from "@reduxjs/toolkit";
import * as constants from "@/redux/constants";
import { closeSnackbar } from "notistack";
import { Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { showSnackbar } from "@/components/snackbar";

export const publicationsAdapter = createEntityAdapter({
	selectId: (publication) => publication._id,
	sortComparer: (a, b) => b.dateCreated - a.dateCreated,
});

const publicationsSlice = createSlice({
	name: "publications",
	initialState: {
		...publicationsAdapter.getInitialState(),
		select: null,
		openDialogCreate: false,
		openDialogRename: false,
		openDialogDelete: false,
	},
	reducers: {
		[constants.PUBLICATION.CREATE.reducer]: publicationsAdapter.upsertOne,
		[constants.PUBLICATION.UPDATE.reducer]: publicationsAdapter.upsertOne,
		[constants.PUBLICATION.UPDATE.ALL.reducer]: publicationsAdapter.upsertMany,
		[constants.PUBLICATION.DELETE.reducer]: publicationsAdapter.removeOne,
		[constants.PUBLICATION.SELECTED.reducer]: (state, action) => {
			state.select = action.payload;
		},
		[constants.PUBLICATION.DIALOG.CREATE.reducer]: (state, action) => {
			state.openDialogCreate = action.payload;
		},
		[constants.PUBLICATION.DIALOG.RENAME.reducer]: (state, action) => {
			state.openDialogRename = action.payload;
		},
		[constants.PUBLICATION.DIALOG.DELETE.reducer]: (state, action) => {
			state.openDialogDelete = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createPublication.fulfilled, publicationsAdapter.upsertOne)
			.addCase(createPublication.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(readPublication.fulfilled, publicationsAdapter.upsertOne)
			.addCase(readPublication.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(readPublications.fulfilled, publicationsAdapter.upsertMany)
			.addCase(readPublications.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(updatePublication.fulfilled, publicationsAdapter.upsertOne)
			.addCase(updatePublication.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(deletePublication.fulfilled, publicationsAdapter.removeOne)
			.addCase(deletePublication.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			});
	},
});

export const createPublication = createAsyncThunk(
	constants.PUBLICATION.CREATE.type,
	async (_, thunkAPI) => {
		try {
			const response = await fetch(`/api/publications/create`);

			if (!response.ok) {
				return thunkAPI.rejectWithValue({
					error: (await response.text()) || "Unknown Error",
				});
			}

			const data = await response.json();

			showSnackbar("Publication has been created", "success", (snackbarId) => (
				<>
					<Button
						variant="text"
						size="small"
						onClick={() => router.push(`/publications/${data._id}/`)}
						sx={{ color: "white" }}
					>
						View
					</Button>
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
			));

			return data;
		} catch (error) {
			return thunkAPI.rejectWithValue({
				error: error.message || "Unknown Error",
			});
		}
	}
);

export const readPublication = createAsyncThunk(
	constants.PUBLICATION.READ.ASYNC.type,
	async (_id, thunkAPI) => {
		try {
			const filter = new URLSearchParams();
			filter.set("_id", _id);

			const response = await fetch(
				`/api/publications/read?${filter.toString()}`
			);

			if (!response.ok) {
				return thunkAPI.rejectWithValue({
					error: (await response.text()) || "Unknown Error",
				});
			}

			const data = await response.json();

			return data;
		} catch (error) {
			return thunkAPI.rejectWithValue({
				error: error.message || "Unknown Error",
			});
		}
	}
);

export const readPublications = createAsyncThunk(
	constants.PUBLICATION.READ.ALL.ASYNC.type,
	async () => {
		try {
			const response = await fetch(`/api/publications/read/all`);

			if (!response.ok) {
				return thunkAPI.rejectWithValue({
					error: (await response.text()) || "Unknown Error",
				});
			}

			const data = await response.json();

			return data;
		} catch (error) {
			return thunkAPI.rejectWithValue({
				error: error.message || "Unknown Error",
			});
		}
	}
);

export const updatePublication = createAsyncThunk(
	constants.PUBLICATION.UPDATE.ASYNC.type,
	async (publication, thunkAPI) => {
		try {
			const formData = new FormData();
			formData.append("publication", JSON.stringify(publication));

			const response = await fetch(`/api/publications/update`, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				return thunkAPI.rejectWithValue({
					error: (await response.text()) || "Unknown Error",
				});
			}

			const data = await response.json();

			showSnackbar("Publication has been updated", "success");

			return data;
		} catch (error) {
			return thunkAPI.rejectWithValue({
				error: error.message || "Unknown Error",
			});
		}
	}
);

export const deletePublication = createAsyncThunk(
	constants.PUBLICATION.DELETE.ASYNC.type,
	async (publication, thunkAPI) => {
		try {
			const { issues } = thunkAPI.getState();
			const formData = new FormData();
			formData.append("publication", JSON.stringify(publication));

			const response = await fetch("/api/publications/delete", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				return thunkAPI.rejectWithValue({
					error: (await response.text()) || "Unknown Error",
				});
			}

			const data = await response.json();

			const issuePageIds = publication.issues.flatMap((issueId) => {
				return issues.entities[issueId]?.pages || [];
			});

			thunkAPI.dispatch({
				type: constants.PAGE.DELETE.ALL.type,
				payload: issuePageIds,
			});

			thunkAPI.dispatch({
				type: constants.ISSUE.DELETE.ALL.type,
				payload: publication.issues,
			});

			showSnackbar("Publication has been deleted", "success");

			return data._id;
		} catch (error) {
			return thunkAPI.rejectWithValue({
				error: error.message || "Unknown Error",
			});
		}
	}
);

export const togglePublicationDialogCreate = (show) => {
	return (dispatch) => {
		dispatch({
			type: constants.PUBLICATION.DIALOG.CREATE.type,
			payload: show,
		});
	};
};

export const togglePublicationDialogDelete = (show, publication) => {
	return (dispatch) => {
		dispatch({
			type: constants.PUBLICATION.SELECTED.type,
			payload: publication,
		});

		dispatch({
			type: constants.PUBLICATION.DIALOG.DELETE.type,
			payload: show,
		});
	};
};

export default publicationsSlice.reducer;
