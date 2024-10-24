/* snackbar */
export const SNACKBAR = {
	CREATE: {
		reducer: "create",
		type: "snackbar/create",
	},
	DELETE: {
		reducer: "delete",
		type: "snackbar/delete",
	},
};

/* publications */
export const PUBLICATION = {
	CREATE: {
		reducer: "create",
		type: "publications/create",
		ASYNC: {
			type: "publications/asyncCreate",
		},
	},
	READ: {
		reducer: "read",
		type: "publications/read",
		ASYNC: {
			type: "publications/asyncRead",
		},
		ALL: {
			type: "publications/readAll",
			ASYNC: {
				type: "publications/asyncReadAll",
			},
		},
	},
	UPDATE: {
		reducer: "update",
		type: "publications/update",
		ASYNC: {
			type: "publications/asyncUpdate",
		},
		ALL: {
			reducer: "updates",
			type: "publications/updates",
			ASYNC: {
				type: "publications/asyncUpdates",
			},
		},
	},
	DELETE: {
		reducer: "delete",
		type: "publications/delete",
		ASYNC: {
			type: "publications/asyncDelete",
		},
	},
	SELECTED: {
		reducer: "select",
		type: "publications/select",
	},
	DIALOG: {
		CREATE: {
			reducer: "dialogRename",
			type: "publications/dialogRename",
		},
		RENAME: {
			reducer: "dialogRename",
			type: "publications/dialogRename",
		},
		DELETE: {
			reducer: "dialogDelete",
			type: "publications/dialogDelete",
		},
	},
};

/* issues */
export const ISSUE = {
	CREATE: {
		reducer: "create",
		type: "issues/create",
		ASYNC: {
			type: "issues/asyncCreate",
		},
	},
	READ: {
		reducer: "read",
		type: "issues/read",
		ASYNC: {
			type: "issues/asyncRead",
		},
		ALL: {
			type: "issues/readAll",
			ASYNC: {
				type: "issues/asyncReadAll",
			},
		},
	},
	UPDATE: {
		reducer: "update",
		type: "issues/update",
		ASYNC: {
			type: "issues/asyncUpdate",
		},
		ALL: {
			reducer: "updates",
			type: "issues/updates",
			ASYNC: {
				type: "issues/asyncUpdates",
			},
		},
	},
	DELETE: {
		reducer: "delete",
		type: "issues/delete",
		ASYNC: {
			type: "issues/asyncDelete",
    },
    ALL: {
			reducer: "deletes",
			type: "issues/deletes",
		},
	},
	SELECTED: {
		reducer: "select",
		type: "issues/select",
	},
	DIALOG: {
		CREATE: {
			reducer: "dialogRename",
			type: "issues/dialogRename",
		},
		RENAME: {
			reducer: "dialogRename",
			type: "issues/dialogRename",
		},
		DELETE: {
			reducer: "dialogDelete",
			type: "issues/dialogDelete",
		},
	},
};

/* pages */
export const PAGE = {
	CREATE: {
		reducer: "create",
		type: "issues/pages/create",
		ASYNC: {
			type: "issues/pages/asyncCreate",
		},
	},
	READ: {
		reducer: "read",
		type: "issues/pages/read",
		ASYNC: {
			type: "issues/pages/asyncRead",
		},
		ALL: {
			type: "issues/pages/readAll",
			ASYNC: {
				type: "issues/pages/asyncReadAll",
			},
		},
	},
	UPDATE: {
		reducer: "update",
		type: "issues/pages/update",
		ASYNC: {
			type: "issues/pages/asyncUpdate",
		},
		ALL: {
			reducer: "updates",
			type: "issues/pages/updates",
			ASYNC: {
				type: "issues/pages/asyncUpdates",
			},
		},
	},
	DELETE: {
		reducer: "delete",
		type: "issues/pages/delete",
		ASYNC: {
			type: "issues/pages/asyncDelete",
    },
    ALL: {
			reducer: "deletes",
			type: "issues/pages/deletes",
		},
	},
	SELECTED: {
		reducer: "select",
		type: "issues/pages/select",
	},
	DIALOG: {
		RENAME: {
			reducer: "dialogRename",
			type: "issues/pages/dialogRename",
		},
		DELETE: {
			reducer: "dialogDelete",
			type: "issues/pages/dialogDelete",
		},
	},
};
