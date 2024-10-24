import { useEffect } from "react";
import router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { readIssue, issuesAdapter } from "@/redux/reducers/issues";

export default function IssuesEdit() {
	const { issueId } = router.query;
	const dispatch = useDispatch();
	const issues = useSelector((state) => state.issues);
	const issue = issuesAdapter.getSelectors().selectById(issues, issueId);

	useEffect(() => {
		if (!issue) {
			dispatch(readIssue(issueId));
		} else {
			router.push(`/issues/${issue._id}/edit/${issue.pages[0]}`);
		}
	}, [dispatch, issueId, issue]);
}
