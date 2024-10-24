const path = require("path");

module.exports = {
	reactStrictMode: false,
	optimizeFonts: false,
	trailingSlash: true,
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
};
