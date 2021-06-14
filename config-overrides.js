const { override, overrideDevServer } = require("customize-cra");

const multipleEntry = require("react-app-rewire-multiple-entry")([
    {
		entry: "src/views/options/index.js",
		template: "public/index.html",
		outPath: "/index.html",
	},
	{
		entry: "src/views/popup/index.js",
		template: "public/popup.html",
		outPath: "/popup.html",
	},
]);

const devServerConfig = () => config => ({
    ...config,
    writeToDisk: true,
});

module.exports = {
	webpack: override(multipleEntry.addMultiEntry),
	devServer: overrideDevServer(devServerConfig()),
};
