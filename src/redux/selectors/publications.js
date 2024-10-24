import { createSelector } from "@reduxjs/toolkit";
import { publicationsAdapter } from "../reducers/publications";

const selectAllPublications = (state) =>
	publicationsAdapter.getSelectors().selectAll(state);

const selectPublication = createSelector(
	[selectAllPublications, (state, publicationId) => publicationId],
	(publications, publicationId) =>
		publications.find((publication) => publication._id === publicationId)
);

export { selectPublication };
