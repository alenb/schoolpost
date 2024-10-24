import { createTheme } from "@mui/material/styles";
// import { red } from '@mui/material/colors';
import { Inter } from "next/font/google";
import styles from "./theme.module.scss";
import "material-icons/iconfont/material-icons.css";

const inter = Inter({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
});

const theme = createTheme({
	palette: {
		background: {
			default: styles.backgroundDefault,
		},
		primary: {
			main: styles.primaryMain,
		},
		secondary: {
			main: styles.secondaryMain,
		},
		//     error: {
		//         main: red.A400,
		//     },
	},
	typography: {
		fontFamily: inter.style.fontFamily,
		fontSize: Number(styles.fontSize),
		h1: {
			fontSize: styles.h1FontSize,
		},
		h2: {
			fontSize: styles.h2FontSize,
			fontWeight: 400,
		},
		h3: {
			fontSize: styles.h3FontSize,
		},
		h4: {
			fontSize: styles.h4FontSize,
		},
		h5: {
			fontSize: styles.h5FontSize,
		},
	},
	components: {
		MuiListItemButton: {
			styleOverrides: {
				root: {
					"&.Mui-selected": {
						backgroundColor: styles.muiSelected,
					},
				},
			},
		},
	},
});

export default theme;
