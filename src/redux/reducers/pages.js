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

export const pagesAdapter = createEntityAdapter({
	selectId: (page) => page._id,
	sortComparer: (a, b) => b.dateModified - a.dateModified,
});

const pagesSlice = createSlice({
	name: "issues/pages",
	initialState: {
		...pagesAdapter.getInitialState(),
		select: null,
		openDialogRename: false,
		openDialogDelete: false,
	},
	reducers: {
		[constants.PAGE.CREATE.reducer]: pagesAdapter.upsertOne,
		[constants.PAGE.UPDATE.reducer]: pagesAdapter.upsertOne,
		[constants.PAGE.UPDATE.ALL.reducer]: pagesAdapter.upsertMany,
		[constants.PAGE.DELETE.reducer]: pagesAdapter.removeOne,
		[constants.PAGE.DELETE.ALL.reducer]: pagesAdapter.removeMany,
		[constants.PAGE.SELECTED.reducer]: (state, action) => {
			state.select = action.payload;
		},
		[constants.PAGE.DIALOG.RENAME.reducer]: (state, action) => {
			state.openDialogRename = action.payload;
		},
		[constants.PAGE.DIALOG.DELETE.reducer]: (state, action) => {
			state.openDialogDelete = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(readPage.fulfilled, pagesAdapter.upsertOne)
			.addCase(readPage.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(readPages.fulfilled, pagesAdapter.upsertMany)
			.addCase(readPages.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(createPage.fulfilled, pagesAdapter.upsertOne)
			.addCase(createPage.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(updatePage.fulfilled, pagesAdapter.upsertOne)
			.addCase(updatePage.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			})
			.addCase(deletePage.fulfilled, pagesAdapter.removeOne)
			.addCase(deletePage.rejected, (state, action) => {
				showSnackbar(action.payload.error, "error");
			});
	},
});

export const createPage = createAsyncThunk(
	constants.PAGE.CREATE.ASYNC.type,
	async (issueId, thunkAPI) => {
		try {
			const { issues } = thunkAPI.getState();
			const params = new URLSearchParams();
			params.set("issueId", issueId);

			const response = await fetch(
				`/api/issues/pages/create?${params.toString()}`
			);

			if (!response.ok) {
				return thunkAPI.rejectWithValue({
					error: (await response.text()) || "Unknown Error",
				});
			}

			const data = await response.json();

			thunkAPI.dispatch({
				type: constants.ISSUE.UPDATE.type,
				payload: {
					...issues.entities[issueId],
					pages: [...issues.entities[issueId].pages, data._id],
				},
			});

			showSnackbar("Page has been created", "success", (snackbarId) => (
				<>
					<Button
						variant="text"
						size="small"
						onClick={() =>
							router.push(`/issues/${data.issueId}/edit/${data._id}`)
						}
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

export const readPage = createAsyncThunk(
	constants.PAGE.READ.type,
	async (_id, thunkAPI) => {
		try {
			const filter = new URLSearchParams();
			filter.set("_id", _id);

			const response = await fetch(
				`/api/issues/pages/read?${filter.toString()}`
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

export const readPages = createAsyncThunk(
	constants.PAGE.READ.ALL.ASYNC.type,
	async (fields, thunkAPI) => {
		try {
			const filter = new URLSearchParams();

			Object.keys(fields).forEach((key) => {
				filter.set(key, fields[key]);
			});

			const response = await fetch(
				`/api/issues/pages/read/all?${filter.toString()}`
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

export const updatePage = createAsyncThunk(
	constants.PAGE.UPDATE.ASYNC.type,
	async (page, thunkAPI) => {
		try {
			const formData = new FormData();
			formData.append("page", JSON.stringify(page));

			const response = await fetch(`/api/issues/pages/update`, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				return thunkAPI.rejectWithValue({
					error: (await response.text()) || "Unknown Error",
				});
			}

			const data = await response.json();

			showSnackbar("Page has been updated", "success");

			return data;
		} catch (error) {
			return thunkAPI.rejectWithValue({
				error: error.message || "Unknown Error",
			});
		}
	}
);

export const deletePage = createAsyncThunk(
	constants.PAGE.DELETE.ASYNC.type,
	async (page, thunkAPI) => {
		try {
			const { issues } = thunkAPI.getState();
			const formData = new FormData();
			formData.append("page", JSON.stringify(page));

			const response = await fetch("/api/issues/pages/delete", {
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
				type: constants.ISSUE.UPDATE.ALL.type,
				payload: [
					{
						...issues.entities[page.issueId],
						pages: issues.entities[page.issueId].pages.filter(
							(item) => item !== page._id
						),
					},
				],
			});

			showSnackbar("Page has been deleted", "success");

			return data._id;
		} catch (error) {
			return thunkAPI.rejectWithValue({
				error: error.message || "Unknown Error",
			});
		}
	}
);

export default pagesSlice.reducer;
