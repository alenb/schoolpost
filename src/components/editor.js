import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import router from "next/router";
import { issuesAdapter } from "@/redux/reducers/issues";
import { updatePage, pagesAdapter } from "@/redux/reducers/pages";
import { selectPagesByIds } from "@/redux/selectors/pages";
import grapesjs from "grapesjs";
// import grapesjsPresetNewsletter from "grapesjs-preset-newsletter";
import grapesjsPresetWebPage from "grapesjs-preset-webpage";
// import grapesjsParserPostCSS from "grapesjs-parser-postcss";
import grapesjsPluginsCKEditor from "grapesjs-plugin-ckeditor";
import grapesjsPluginsBlocksBasic from "grapesjs-blocks-basic";
import { Box, CircularProgress } from "@mui/material";

/**
 * The `Editor` function is a React component that renders a GrapesJS editor for editing pages.
 * @returns a JSX element.
 */
export default function Editor({ id }) {
	const { issueId, _id } = router.query;
	const [isEditorLoaded, setIsEditorLoaded] = useState(false);
	const dispatch = useDispatch();

	const issue = useSelector((state) =>
		issuesAdapter.getSelectors().selectById(state.issues, issueId)
	);
	const page = useSelector((state) =>
		pagesAdapter.getSelectors().selectById(state.pages, _id)
	);
	const filteredPages = useSelector(
		(state) =>
			selectPagesByIds(state.pages, issue?.pages).sort((a, b) => {
				const iA = issue.pages.indexOf(a._id);
				const iB = issue.pages.indexOf(b._id);

				return iA - iB;
			}),
		[issue?.pages]
	);

	const editorPages = useMemo(
		() =>
			filteredPages.map((item) => ({
				id: item._id,
				issueId: item.issueId,
				name: item.title,
				frames: item?.frames || {},
				// component: item?.component || {},
				styles: item?.styles,
			})),
		[filteredPages]
	);

	useEffect(() => {
		if (page) {
			const editor = grapesjs.init({
				container: `#editor-${id}`,
				height: "calc(100vh - 64px)",
				// protectedCss: "", // * {box-sizing: border-box;} body {margin: 0;}
				plugins: [
					grapesjsPresetWebPage,
					// grapesjsPresetNewsletter,
					// grapesjsParserPostCSS,
					grapesjsPluginsBlocksBasic,
					grapesjsPluginsCKEditor,
				],
				pluginsOpts: {
					[grapesjsPresetWebPage]: {
						useCustomTheme: "",
					},
					// [grapesjsPresetNewsletter]: {},
					// [grapesjsParserPostCSS]: {},
					[grapesjsPluginsBlocksBasic]: { flexGrid: true, rowHeight: 0 },
					[grapesjsPluginsCKEditor]: {
						options: {
							versionCheck: false,
						},
					},
				},
				storageManager: false,
				selectorManager: { componentFirst: true },
				styleManager: {
					appendTo: "#editor-styles",
					sectors: [
						{
							name: "General",
							properties: [
								{
									extend: "float",
									type: "radio",
									default: "none",
									options: [
										{
											value: "none",
											className: "",
											label: "<i class='material-icons'>clear</i>",
										},
										{
											value: "left",
											className: "",
											label: "<i class='material-icons'>format_align_left</i>",
										},
										{
											value: "right",
											className: "",
											label: "<i class='material-icons'>format_align_right</i>",
										},
									],
								},
								"display",
								{ extend: "position", type: "select" },
								"top",
								"right",
								"left",
								"bottom",
							],
						},
						{
							name: "Dimension",
							open: false,
							properties: [
								"width",
								{
									id: "flex-width",
									type: "integer",
									name: "Width",
									units: ["px", "%"],
									property: "flex-basis",
									toRequire: 1,
								},
								"height",
								"max-width",
								"min-height",
								"margin",
								"padding",
							],
						},
						{
							name: "Typography",
							open: false,
							properties: [
								"font-family",
								"font-size",
								"font-weight",
								"letter-spacing",
								"color",
								"line-height",
								{
									extend: "text-align",
									options: [
										{
											id: "left",
											label: "Left",
											className: "",
											label: "<i class='material-icons'>format_align_left</i>",
										},
										{
											id: "right",
											label: "Right",
											className: "",
											label: "<i class='material-icons'>format_align_right</i>",
										},
										{
											id: "center",
											label: "Center",
											className: "",
											label:
												"<i class='material-icons'>format_align_center</i>",
										},
										{
											id: "justify",
											label: "Justify",
											className: "",
											label:
												"<i class='material-icons'>format_align_justify</i>",
										},
									],
								},
								{
									property: "text-decoration",
									type: "radio",
									default: "none",
									options: [
										{
											id: "none",
											label: "None",
											className: "",
											label: "<i class='material-icons'>clear</i>",
										},
										{
											id: "underline",
											label: "underline",
											className: "",
											label: "<i class='material-icons'>format_underlined</i>",
										},
										{
											id: "line-through",
											label: "Line-through",
											className: "",
											label:
												"<i class='material-icons'>format_strikethrough</i>",
										},
									],
								},
								"text-shadow",
							],
						},
						{
							name: "Decorations",
							open: false,
							properties: [
								"opacity",
								"border-radius",
								"border",
								"box-shadow",
								"background", // { id: 'background-bg', property: 'background', type: 'bg' }
							],
						},
						{
							name: "Extra",
							open: false,
							buildProps: ["transition", "perspective", "transform"],
						},
						{
							name: "Flex",
							open: false,
							properties: [
								{
									name: "Flex Container",
									property: "display",
									type: "select",
									defaults: "block",
									list: [
										{ value: "block", name: "Disable" },
										{ value: "flex", name: "Enable" },
									],
								},
								{
									name: "Flex Parent",
									property: "label-parent-flex",
									type: "integer",
								},
								{
									name: "Direction",
									property: "flex-direction",
									type: "radio",
									defaults: "row",
									list: [
										{
											value: "row",
											name: "Row",
											title: "Row",
											className: "",
											label: "<i class='material-icons'>table_rows</i>",
										},
										{
											value: "row-reverse",
											name: "Row reverse",
											title: "Row reverse",
											className: "",
											label: "<i class='material-icons'>arrow_back</i>",
										},
										{
											value: "column",
											name: "Column",
											title: "Column",
											className: "",
											label: "<i class='material-icons'>view_week</i>",
										},
										{
											value: "column-reverse",
											name: "Column reverse",
											title: "Column reverse",
											className: "",
											label: "<i class='material-icons'>arrow_upward</i>",
										},
									],
								},
								{
									name: "Justify",
									property: "justify-content",
									type: "radio",
									defaults: "flex-start",
									list: [
										{
											value: "flex-start",
											title: "Start",
											className: "",
											label:
												"<i class='material-icons'>align_horizontal_left</i>",
										},
										{
											value: "flex-end",
											title: "End",
											className: "",
											label:
												"<i class='material-icons'>align_horizontal_right</i>",
										},
										{
											value: "space-between",
											title: "Space between",
											className: "",
											label:
												"<i class='material-icons'>horizontal_distribute</i>",
										},
										{
											value: "space-around",
											title: "Space around",
											className: "",
											label:
												"<i class='material-icons'>vertical_align_center</i>",
										},
										{
											value: "center",
											title: "Center",
											className: "",
											label:
												"<i class='material-icons'>format_align_center</i>",
										},
									],
								},
								{
									name: "Align",
									property: "align-items",
									type: "radio",
									defaults: "flex-start",
									list: [
										{
											value: "flex-start",
											title: "Start",
											className: "",
											label: "<i class='material-icons'>align_vertical_top</i>",
										},
										{
											value: "flex-end",
											title: "End",
											className: "",
											label:
												"<i class='material-icons'>align_vertical_bottom</i>",
										},
										{
											value: "center",
											title: "Center",
											className: "",
											label:
												"<i class='material-icons'>align_horizontal_center</i>",
										},
										{
											value: "stretch",
											title: "Stretch",
											className: "",
											label:
												"<i class='material-icons'>vertical_distribute</i>",
										},
									],
								},
								{
									name: "Flex Children",
									property: "label-parent-flex",
									type: "integer",
								},
								{
									name: "Order",
									property: "order",
									type: "integer",
									defaults: 0,
									min: 0,
								},
								{
									name: "Flex",
									property: "flex",
									type: "composite",
									properties: [
										{
											name: "Grow",
											property: "flex-grow",
											type: "integer",
											defaults: 0,
											min: 0,
										},
										{
											name: "Shrink",
											property: "flex-shrink",
											type: "integer",
											defaults: 0,
											min: 0,
										},
										{
											name: "Basis",
											property: "flex-basis",
											type: "integer",
											units: ["px", "%", ""],
											unit: "",
											defaults: "auto",
										},
									],
								},
								{
									name: "Align",
									property: "align-self",
									type: "radio",
									defaults: "auto",
									list: [
										{
											value: "auto",
											name: "Auto",
										},
										{
											value: "flex-start",
											title: "Start",
											className: "",
											label: "<i class='material-icons'>format_align_left</i>",
										},
										{
											value: "flex-end",
											title: "End",
											className: "",
											label: "<i class='material-icons'>format_align_right</i>",
										},
										{
											value: "center",
											title: "Center",
											className: "",
											label:
												"<i class='material-icons'>format_align_center</i>",
										},
										{
											value: "stretch",
											title: "Stretch",
											className: "",
											label:
												"<i class='material-icons'>format_align_justify</i>",
										},
									],
								},
							],
						},
					],
				},
				blockManager: {
					appendTo: "#editor-blocks",
				},
				traitManager: {
					appendTo: "#editor-traits",
				},
				layerManager: {
					appendTo: "#editor-layers",
				},
				pageManager: {
					pages: editorPages,
				},
			});

			editor.on("load", async () => {
				const panels = editor.Panels;
				const pageManager = editor.Pages;

				// Show the editor
				setIsEditorLoaded(true);

				// Set current page
				pageManager.select(page._id);
				editor.setStyle(page.styles);

				// Devices panel
				panels.getPanel("devices-c").appendTo = "#editor-devices";
				const desktop = panels.getButton("devices-c", "set-device-desktop");
				desktop.set("label", "desktop_windows");
				desktop.set("className", "material-icons");
				const tablet = panels.getButton("devices-c", "set-device-tablet");
				tablet.set("label", "tablet_mac");
				tablet.set("className", "material-icons");
				const mobile = panels.getButton("devices-c", "set-device-mobile");
				mobile.set("label", "smartphone");
				mobile.set("className", "material-icons");

				// Options panel
				panels.getButton("options", "sw-visibility").set("active", true);
				panels.removeButton("options", "preview");
				panels.removeButton("options", "undo");
				panels.removeButton("options", "redo");
				panels.removeButton("options", "canvas-clear");
				const swVisibility = panels.getButton("options", "sw-visibility");
				swVisibility.set("label", "highlight_alt");
				swVisibility.set("className", "material-icons");
				const fullScreen = panels.getButton("options", "fullscreen");
				fullScreen.set("label", "fullscreen");
				fullScreen.set("className", "material-icons");
				const exportTemplate = panels.getButton("options", "export-template");
				exportTemplate.set("label", "code");
				exportTemplate.set("className", "material-icons");
				const importWebPage = panels.getButton(
					"options",
					"gjs-open-import-webpage"
				);
				importWebPage.set("label", "file_upload");
				importWebPage.set("className", "material-icons");

				// Views pael
				const styleManager = panels.getButton("views", "open-sm");
				styleManager.set("label", "design_services");
				styleManager.set("className", "material-icons");
				const settings = panels.getButton("views", "open-tm");
				settings.set("label", "tune");
				settings.set("className", "material-icons");
				const layers = panels.getButton("views", "open-layers");
				layers.set("label", "layers");
				layers.set("className", "material-icons");
				panels.removePanel("views");
				// const blocks = panels.getButton("views", "open-blocks");
				// blocks.set("label", "queue");
				// blocks.set("className", "material-icons");

				panels.addButton("options", [
					{
						id: "save",
						className: "material-icons",
						command: "savePage",
						attributes: { title: "Save Page" },
						label: "save",
					},
				]);

				panels.addButton("options", [
					{
						id: "preview",
						className: "material-icons",
						command: "previewPage",
						attributes: { title: "Preview Page" },
						label: "launch",
					},
				]);
			});

			/* Adds a `savePage` command to the editor which allows the user to save the current page to the database. */
			editor.Commands.add("savePage", () => {
				const pageManager = editor.Pages;
				const selectedPage = pageManager.getSelected();
				const component = selectedPage.getMainComponent();
				const selectedPageJSON = selectedPage.toJSON();
				const Html = editor.getHtml({
					component: component,
				});
				const Css = editor.getCss({
					component: component,
					avoidProtected: true,
				});

				dispatch(
					updatePage({
						_id: selectedPage.getId(),
						frames: selectedPageJSON.frames,
						html: Html,
						styles: Css,
					})
				);

				editor.stopCommand("fullscreen");
			});

			/* Adds a `previewPage` command to the editor which allows the user to preview the current page in a new tab. */
			editor.Commands.add("previewPage", () => {
				const pageManager = editor.Pages;
				const selectedPage = pageManager.getSelected();
				const selectedPageJSON = selectedPage.toJSON();
				const pageIndex =
					editorPages.findIndex((page) => page.id === selectedPage.getId()) + 1;

				window.open(
					`/issues/${selectedPageJSON.issueId}/page/${pageIndex}`,
					"_blank"
				);
			});

			/* Performs resets when the component re-renders. */
			return () => {
				editor.destroy();
				setIsEditorLoaded(false);
			};
		}
	}, [dispatch, _id, page, editorPages]);

	return (
		<>
			<Box
				sx={{
					display: isEditorLoaded ? "none" : "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
				}}
			>
				<CircularProgress />
			</Box>

			<div
				id={`editor-${id}`}
				className={`gjs ${!isEditorLoaded ? "hide" : ""}`}
			></div>
		</>
	);
}
