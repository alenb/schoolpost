import { createSelector } from "@reduxjs/toolkit";
import { issuesAdapter } from "../reducers/issues";

const selectAllIssues = (state) =>
	issuesAdapter.getSelectors().selectAll(state);

const selectIssue = createSelector(
	[selectAllIssues, (state, issueId) => issueId],
	(issues, issueId) => issues.find((issue) => issue._id === issueId)
);

const selectIssuesByIds = createSelector(
	[selectAllIssues, (state, issueIds) => issueIds],
	(issues, issueIds) => issues.filter((issue) => issueIds.includes(issue._id))
);

export { selectIssue, selectIssuesByIds };
