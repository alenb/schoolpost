import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
	readPublications,
	createPublication,
} from "@/redux/reducers/publications";
import {
	PublicationList,
	PublicationDialogRename,
	PublicationDialogDelete,
} from "@/components/publications";
import { Box, Button, Container, Typography } from "@mui/material";
import Head from "next/head";

export default function Publications() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(readPublications());
	}, [dispatch]);

	const handleCreatePublication = () => {
		dispatch(createPublication());
	};

	return (
		<>
			<Head>
				<title>{process.env.NEXT_PUBLIC_APP_NAME} - Publications</title>
			</Head>

			<Container maxWidth="xl">
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					sx={{ py: 3 }}
				>
					<Typography variant="h1">Publications</Typography>

					<Button variant="outlined" onClick={handleCreatePublication}>
						Create Publication
					</Button>
				</Box>

				<Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="30px">
					<PublicationList />
				</Box>
			</Container>

			<PublicationDialogRename />
			<PublicationDialogDelete />
		</>
	);
}
