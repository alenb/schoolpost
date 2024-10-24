import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "../../store";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import DefaultLayout from "@/layouts/default";
import theme from "@/styles/theme";
import "@/styles/_app.scss";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const Layout = Component.layout || DefaultLayout;

	return (
		<SnackbarProvider
			maxSnack={3}
			autoHideDuration={null}
			anchorOrigin={{ horizontal: "center", vertical: "top" }}
		>
			<SessionProvider session={session}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Provider store={store}>
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</Provider>
				</ThemeProvider>
			</SessionProvider>
		</SnackbarProvider>
	);
}
