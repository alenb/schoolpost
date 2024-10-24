import Link from "next/link";
import {
	Box,
	Drawer,
	List,
	Divider,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

export default function PrimaryMenu({ state }) {
	const { primaryMenu, setPrimaryMenu } = state;

	const toggleDrawer = (open) => {
		setPrimaryMenu(open);
	};

	return (
		<Drawer
			anchor={"left"}
			open={primaryMenu}
			onClose={() => toggleDrawer(false)}
		>
			<Box
				sx={{ width: 300 }}
				role="presentation"
				onClick={() => toggleDrawer(false)}
				onKeyDown={() => toggleDrawer(false)}
			>
				<List>
					<ListItem disablePadding>
						<ListItemButton
							href={`/publications/`}
							LinkComponent={Link}
						>
							<ListItemIcon>
								<InboxIcon />
							</ListItemIcon>
							<ListItemText primary={"Publications"} />
						</ListItemButton>
					</ListItem>
				</List>
				<Divider />
				<List>
					{["All mail", "Trash", "Spam"].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>
									{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Box>
		</Drawer>
	);
}
