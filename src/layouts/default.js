import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import Navbar from "@/components/navbar";

export default function DefaultLayout({ children }) {
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "unauthenticated") {
			signIn();
		}
	}, [status]);

	return (
		<>
			<Head>
				<title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
			</Head>

			{session && (
				<>
					<Navbar />
					<main>{children}</main>
				</>
			)}
		</>
	);
}
