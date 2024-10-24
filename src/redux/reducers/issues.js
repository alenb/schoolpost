import router from "next/router";
import * as constants from "@/redux/constants";
import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from "@reduxjs/toolkit";
import { closeSnackbar } from "notistack";
import { Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { showSnackbar } from "@/components/snackbar";

export const issuesAdapter = createEntityAdapter({
	selectId: (issue) => issue._id,
	sortComparer: (a, b) => b.dateModified - a.dateModified,
});

const issuesSlice = createSlice({
	name: "issues",
	initialState: {
		...issuesAdapter.getInitialState(),
		select: null,
		openDialogCreate: false,
		openDialogRename: false,
		openDialogDelete: false,
	},
	reducers: {
		[constants.ISSUE.CREATE.reducer]: issuesAdapter.upsertOne,
		[constants.ISSUE.UPDATE.reducer]: issuesAdapter.upsertOne,
		[constants.ISSUE.UPDATE.ALL.reducer]: issuesAdapter.upsertMany,
		[constants.ISSUE.DELETE.reducer]: issuesAdapter.removeOne,
		[constants.ISSUE.DELETE.ALL.reducer]: issuesAdapter.removeMany,
		[constants.ISSUE.SELECTED.reducer]: (state, action) => {
			state.select = action.payload;
		},
		[constants.ISSUE.DIALOG.CREATE.reducer]: (state, action) => {
			state.openDialogCreate = action.payload;
		},
		[constants.ISSUE.DIALOG.RENAME.reducer]: (state, action) => {
			state.openDialogRename = action.payload;
		},
		[constants.ISSUE.DIALOG.DELETE.reducer]: (state, action) => {
			state.openDialogDelete = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(readIssue.fulfilled, issuesAdapter.upsertOne)
			.addCase(readIssue.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(readIssues.fulfilled, issuesAdapter.upsertMany)
			.addCase(readIssues.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(createIssue.fulfilled, issuesAdapter.upsertOne)
			.addCase(createIssue.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(updateIssue.fulfilled, issuesAdapter.upsertOne)
			.addCase(updateIssue.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(deleteIssue.fulfilled, issuesAdapter.removeOne)
			.addCase(deleteIssue.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			});
	},
});

export const createIssue = createAsyncThunk(
	constants.ISSUE.CREATE.type,
	async (publicationId, thunkAPI) => {
		try {
			const { publications } = thunkAPI.getState();
			const params = new URLSearchParams();
			params.set("publicationId", publicationId);

			const response = await fetch(`/api/issues/create?${params}`);

			if (!response.ok) {
				return thunkAPI.rejectWithValue({
					error: (await response.text()) || "Unknown Error",
				});
			}

			const data = await response.json();

			showSnackbar("Issue has been created", "success", (snackbarId) => (
				<>
					<Button
						variant="text"
						size="small"
						onClick={() => router.push(`/issues/${data._id}/edit/`)}
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

			thunkAPI.dispatch({
				type: constants.PUBLICATION.UPDATE.type,
				payload: {
					...publications.entities[publicationId],
					issues: [...publications.entities[publicationId].issues, data._id],
				},
			});

			return data;
		} catch (error) {
			return thunkAPI.rejectWithValue({
				error: error.message || "Unknown Error",
			});
		}
	}
);

export const readIssue = createAsyncThunk(
	constants.ISSUE.READ.ASYNC.type,
	async (_id, thunkAPI) => {
		try {
			const filter = new URLSearchParams();
			filter.set("_id", _id);

			const response = await fetch(`/api/issues/read?${filter.toString()}`);

			if (!response.ok) {
				const responseText = await response.text();
				console.log(responseText);
				return thunkAPI.rejectWithValue({
					error: responseText || "Unknown Error",
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

export const readIssues = createAsyncThunk(
	constants.ISSUE.READ.ALL.ASYNC.type,
	async (fields, thunkAPI) => {
		try {
			const filter = new URLSearchParams();

			Object.keys(fields).forEach((key) => {
				filter.set(key, fields[key]);
			});

			const response = await fetch(`/api/issues/read/all?${filter.toString()}`);

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

export const updateIssue = createAsyncThunk(
	constants.ISSUE.UPDATE.ASYNC.type,
	async (issue, thunkAPI) => {
		try {
			const formData = new FormData();
			formData.append("issue", JSON.stringify(issue));

			const response = await fetch(`/api/issues/update`, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				return thunkAPI.rejectWithValue({
					error: (await response.text()) || "Unknown Error",
				});
			}

			const data = await response.json();

			showSnackbar("Issue has been updated", "success");

			return data;
		} catch (error) {
			return thunkAPI.rejectWithValue({
				error: error.message || "Unknown Error",
			});
		}
	}
);

export const deleteIssue = createAsyncThunk(
	constants.ISSUE.DELETE.ASYNC.type,
	async (issue, thunkAPI) => {
		try {
			const { publications } = thunkAPI.getState();
			const formData = new FormData();
			formData.append("issue", JSON.stringify(issue));

			const response = await fetch("/api/issues/delete", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				return thunkAPI.rejectWithValue({
					error: (await response.text()) || "Unknown Error",
				});
			}

			const data = await response.json();

			thunkAPI.dispatch({
				type: constants.PUBLICATION.UPDATE.type,
				payload: {
					...publications.entities[issue.publicationId],
					issues: publications.entities[issue.publicationId].issues.filter(
						(item) => item !== issue._id
					),
				},
			});

			showSnackbar("Issue has been deleted", "success");

			return data._id;
		} catch (error) {
			return thunkAPI.rejectWithValue({
				error: error.message || "Unknown Error",
			});
		}
	}
);

export const toggleIssueDialogRename = (show, issue) => {
	return (dispatch) => {
		dispatch({
			type: constants.ISSUE.SELECTED.type,
			payload: issue,
		});

		dispatch({
			type: constants.ISSUE.DIALOG.RENAME.type,
			payload: show,
		});
	};
};

export const toggleIssueDialogDelete = (show, issue) => {
	return (dispatch) => {
		dispatch({
			type: constants.ISSUE.SELECTED.type,
			payload: issue,
		});

		dispatch({
			type: constants.ISSUE.DIALOG.DELETE.type,
			payload: show,
		});
	};
};

export default issuesSlice.reducer;
