import { configureStore } from "@reduxjs/toolkit";
import publicationsReducer from "@/redux/reducers/publications";
import issuesReducer from "@/redux/reducers/issues";
import pagesReducer from "@/redux/reducers/pages";

export const store = configureStore({
	reducer: {
		publications: publicationsReducer,
		issues: issuesReducer,
		pages: pagesReducer,
	},
});