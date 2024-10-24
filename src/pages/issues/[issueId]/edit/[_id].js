import dynamic from "next/dynamic";
import router from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readIssue } from "@/redux/reducers/issues";
import { readPages } from "@/redux/reducers/pages";
import { selectIssue } from "@/redux/selectors/issues";
import { selectPage } from "@/redux/selectors/pages";
import {
	PageList,
	PageDialogRename,
	PageDialogDelete,
} from "@/components/issues/pages";
import { Box, Grid, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
	Queue as BlocksIcon,
	LibraryBooks as PagesIcon,
	DesignServices as StylesManagerIcon,
	Tune as TraitsManagerIcon,
	Layers as LayersManagerIcon,
} from "@mui/icons-material";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function IssuesEditPages() {
	const { issueId, _id } = router.query;
	const { data: session } = useSession();
	const [editorOptions, setEditorOptions] = useState("blocks");
	const [editorTabs, setEditorTabs] = useState("styles");
	const dispatch = useDispatch();

	const issue = useSelector(
		(state) => selectIssue(state.issues, issueId),
		[dispatch, issueId]
	);
	const page = useSelector(
		(state) => selectPage(state.pages, _id),
		[dispatch, _id]
	);

	const handleEditorOptions = (event, newValue) => {
		setEditorOptions(newValue);
	};

	const handleEditorTabs = (event, newValue) => {
		setEditorTabs(newValue);
	};

	useEffect(() => {
		dispatch(readIssue(issueId));
	}, [dispatch, issueId]);

	useEffect(() => {
		if (issue) {
			dispatch(readPages({ pageIds: issue.pages }));
		}
	}, [dispatch, issue]);

	return (
		<>
			<Head>
				<title>
					{process.env.NEXT_PUBLIC_APP_NAME} - {issue?.title} - {page?.title}
				</title>
			</Head>

			<Grid container spacing={0} bgcolor="#fff">
				<Grid item xs={2}>
					<TabContext value={editorOptions}>
						<TabList
							onChange={handleEditorOptions}
							aria-label="Add blocks and pages"
						>
							<Tab icon={<BlocksIcon />} value="blocks" title="Blocks" />
							<Tab icon={<PagesIcon />} value="pages" title="Pages" />
						</TabList>
						<TabPanel
							value="blocks"
							id="editor-blocks"
							sx={{ padding: 0 }}
						></TabPanel>
						<TabPanel value="pages" sx={{ padding: 0 }}>
							<PageList />
						</TabPanel>
					</TabContext>

					<PageDialogRename />
					<PageDialogDelete />
				</Grid>
        <Grid item xs={8}>
          <Box>
            <Box id="editor-devices"></Box>
          </Box>
					<Editor id="gjs" />
				</Grid>
				<Grid item xs={2}>
					<TabContext value={editorTabs}>
						<TabList
							onChange={handleEditorTabs}
							sx={{ justifyContent: "space-between" }}
							aria-label="Edit block styles, traits and layers"
						>
							<Tab icon={<StylesManagerIcon />} value="styles" title="Styles" />
							<Tab icon={<TraitsManagerIcon />} value="traits" title="Traits" />
							<Tab icon={<LayersManagerIcon />} value="layers" title="Layers" />
						</TabList>
						<TabPanel
							value="styles"
							id="editor-styles"
							sx={{ padding: 0 }}
						></TabPanel>
						<TabPanel
							value="traits"
							id="editor-traits"
							sx={{ padding: 0 }}
						></TabPanel>
						<TabPanel
							value="layers"
							id="editor-layers"
							sx={{ padding: 0 }}
						></TabPanel>
					</TabContext>

					<PageDialogRename />
					<PageDialogDelete />
				</Grid>
			</Grid>
		</>
	);
}
