import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { styled, alpha } from "@mui/material/styles";
import {
	AppBar,
	Box,
	Toolbar,
	Menu,
	IconButton,
	Typography,
	InputBase,
	MenuItem,
	Badge,
	Avatar,
	Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PrimaryMenu from "./primarymenu";

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(1),
		width: "auto",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			width: "12ch",
			"&:focus": {
				width: "20ch",
			},
		},
	},
}));

export default function Navbar() {
	const { data: session } = useSession();
	const [anchorEl, setAnchorEl] = useState(null);
	const [primaryMenu, setPrimaryMenu] = useState(false);

	const open = Boolean(anchorEl);

	const handlePrimaryMenu = (open) => {
		setPrimaryMenu(open);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<PrimaryMenu state={{ primaryMenu, setPrimaryMenu }} />

			<Box sx={{ flexGrow: 1 }}>
				<AppBar sx={{boxShadow: "none"}} position="static">
					<Toolbar>
						<Tooltip title="Open menu">
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								aria-label="open drawer"
								onClick={() => handlePrimaryMenu(true)}
								sx={{ mr: 2 }}
							>
								<MenuIcon />
							</IconButton>
						</Tooltip>
						<Typography
							variant="h6"
							noWrap
							component="div"
							sx={{ display: { xs: "none", sm: "block" }, mr: 2 }}
						>
							SCHOOL POST
						</Typography>
						<Search>
							<SearchIconWrapper>
								<SearchIcon />
							</SearchIconWrapper>
							<StyledInputBase
								placeholder="Search…"
								inputProps={{ "aria-label": "search" }}
							/>
						</Search>
						<Box sx={{ flexGrow: 1 }} />
						<Box sx={{ display: { xs: "none", md: "flex" } }}>
							<IconButton
								size="large"
								aria-label="show 17 new notifications"
								color="inherit"
							>
								<Badge badgeContent={17} color="error" sx={{ mr: 2 }}>
									<NotificationsIcon />
								</Badge>
							</IconButton>
							<>
								<Tooltip title="Open settings">
									<IconButton onClick={handleClick} sx={{ p: 0 }}>
										<Avatar
											alt={session && session.user.name}
											src={session && session.user.image}
										/>
									</IconButton>
								</Tooltip>
								<Menu
									id="basic-menu"
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
									MenuListProps={{
										"aria-labelledby": "basic-button",
									}}
								>
									<MenuItem onClick={handleClose}>My account</MenuItem>
									<MenuItem onClick={handleClose}>Billing</MenuItem>
									<MenuItem onClick={() => signOut()}>Logout</MenuItem>
								</Menu>
							</>
						</Box>
					</Toolbar>
				</AppBar>
			</Box>
		</>
	);
}
