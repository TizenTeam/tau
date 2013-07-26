({
	baseUrl: "../web-ui-fw-modules",
	paths: {
		"libs": "libs/",
		"jqm": "jqm/"
	},

	packages: [
		{
			name: "jquery",
			location : 'jqm/',
			main: 'jquery.js'
		}
	],

	optimize: "uglify",
	uglify: {
		ascii_only: true
	},

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

	pragmasOnSave: {
		jqmBuildExclude: true
	},

	onBuildWrite: function (moduleName, path, contents) {
		return contents.replace(/__version__/g, '"0.2.50"' );
	}
})
