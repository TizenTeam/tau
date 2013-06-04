module.exports = function( grunt ) {
	"use strict";

	grunt.loadNpmTasks( "grunt-contrib-requirejs" );

	// Project configuration.
	grunt.config.init({
		pkg: grunt.file.readJSON( "package.json" ),
		requirejs: {
			js: {
				options: {
					baseUrl: "./src/js",
					paths: {
						"libs": "../../libs/js",
						"jqm": "../../libs/js/jquery-mobile-1.2.0/js"
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

					include: ( grunt.option( "modules" ) || "jquery.mobile.tizen" ).split( "," ),

					out: "tizen-web-ui-fw.js",

					pragmasOnSave: {
						jqmBuildExclude: true
					},

					onBuildWrite: function (moduleName, path, contents) {
						return contents.replace(/__version__/g, grunt.config.process( "\"<%= pkg.version %>\"" ) );
					}
				}
			}
		}
	});


	grunt.registerTask( "js", [ "requirejs" ] );
};
