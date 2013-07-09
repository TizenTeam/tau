({
	baseUrl: "../js/src",
	paths: {
		"libs": ".",
		"globalize": ".",
		"jqm": "."
	},

	optimize: "none",

	//Finds require() dependencies inside a require() or define call.
	findNestedDependencies: true,

	//If skipModuleInsertion is false, then files that do not use define()
	//to define modules will get a define() placeholder inserted for them.
	//Also, require.pause/resume calls will be inserted.
	//Set it to true to avoid this. This is useful if you are building code that
	//does not use require() in the built project or in the JS files, but you
	//still want to use the optimization tool from RequireJS to concatenate modules
	//together.
	skipModuleInsertion: true,

	include: "../../_build/require",

	out: "../js/tizen-web-ui-fw.custom.js",

	pragmasOnSave: {
		jqmBuildExclude: true
	},

	onBuildWrite: function (moduleName, path, contents) {
		return contents.replace(/__version__/g, '"1.2.0"' );
	}
})