import { createSelector } from "@reduxjs/toolkit";
import { pagesAdapter } from "../reducers/pages";

const selectAllPages = (state) => pagesAdapter.getSelectors().selectAll(state);

const selectPage = createSelector(
	[selectAllPages, (state, pageId) => pageId],
	(pages, pageId) => pages.find((page) => page._id === pageId)
);

const selectPagesByIds = createSelector(
	[selectAllPages, (state, pageIds) => pageIds],
	(pages, pageIds) => pages.filter((page) => pageIds.includes(page._id))
);

export { selectPage, selectPagesByIds };
