import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/navbar";
import Container from "@mui/material/Container";
import { Box } from "@mui/material";

export default function Layout({ children }) {
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "unauthenticated") {
			signIn();
		}
	}, [status]);

	return (
		<>
			{session && (
				<>
					<Navbar />
                    <main>{children}</main>
				</>
			)}
		</>
	);
}
