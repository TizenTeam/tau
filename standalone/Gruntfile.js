/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

module.exports = function(grunt) {
	"use strict";
	
	var path = require("path"),
		dist = "dist" + path.sep,
		name = "gear.ui",
		jsPath = path.join(dist, "js"),
		themesPath = path.join(dist, "themes"),
		themes = {
			"default" : "src/css/themes/black",
			"black" : "src/css/themes/black",
		},
		files = {
			css: {
				lessSuffix: ".less",
				unminifiedSuffix: ".css",
				minifiedSuffix: ".min.css",

				getCssFiles: function( ) {
					var list = [],
						css = files.css,
						key, value;
					for(key in themes) {
						value = themes[key];
						list.push({
							src: path.join(value, name) + css.lessSuffix,
							dest: path.join( themesPath, key, name ) + css.unminifiedSuffix
						});
					}
					return list;
				},

				getMinifiedCSSFiles : function( ) {
					var list = [],
						css = files.css,
						key;
					
					for(key in themes) {
						list.push({
							src: path.join( themesPath, key, name ) + css.unminifiedSuffix,
							dest: path.join( themesPath, key, name ) + css.minifiedSuffix
						});
					}
					return list;
				}
			},

			images: {
				folder: "images",

				getImagesFolder: function() {
					var list = [],
						key, value;
					for(key in themes) {
						value = themes[key];
						list.push({
							expand: true,
							cwd: path.join( value, files.images.folder ),
							src: "**",
							dest: path.join( themesPath, key, files.images.folder )
						});
					}
					return list;
				}
			}

		};

	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		
		version: "<%= pkg.version %>",
		
		jshint: {
			js: {
				options: {
					jshintrc: "src/js/.jshintrc"
				},
				files: {
					src: [
						"src/js/**/*.js"
					]
				}
			},
			grunt: {
				options: {
					jshintrc: "src/js/.jshintrc"
				},
				files: {
					src: [ "Gruntfile.js" ]
				}
			}
		},
		
		requirejs: {
			js: {
				options: {
					baseUrl: "src/js",

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

					mainConfigFile: "src/js/requirejs.config.js",

					include: [ name ],

					out: path.join( jsPath, name ) + ".js",

					pragmasOnSave: {
						microBuildExclude: true
					},

					//File paths are relative to the build file, or if running a commmand
					//line build, the current directory.
					wrap: {
						startFile: "build/wrap.start",
						endFile: "build/wrap.end"
					}
				}
			},
			jsej: {
				options: {
					baseUrl: "src/ej",

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

					name: "micro",

					out: path.join( jsPath, name ) + ".js",

					pragmasOnSave: {
						ejBuildExclude: true,
						ejDebug: true
					},
				}
			},
			jsejvl: {
				options: {
					baseUrl: "src/ej",

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

					name: "virtuallist",

					out: path.join( jsPath, "virtuallist" ) + ".js",

					pragmasOnSave: {
						ejBuildExclude: true,
						ejDebug: true
					},
				}
			}

		},

		uglify: {
			all: {
				options: {
					beautify: {
						ascii_only: true
					}
				},
				files: [
					{
						src: path.join( jsPath, name ) + ".js",
						dest: path.join( jsPath, name ) + ".min.js",
					}
				]
			}
		},

		concat: {
			normal: {
				src: [path.join( "license", "MIT" ) + ".txt", path.join( jsPath, name ) + ".js"],
				dest: path.join( jsPath, name ) + ".js",
			},

			min: {
				src: [path.join( "license", "MIT" ) + ".txt", path.join( jsPath, name ) + ".min.js"],
				dest: path.join( jsPath, name ) + ".min.js"
			}
		},

		less : {
			style : {
				files : files.css.getCssFiles()
			}
		},

		cssmin: {
			options: {
				keepSpecialComments: 0
			},
			minify: {
				files: files.css.getMinifiedCSSFiles()
			}
		},

		copy: {
			images: {
				files: files.images.getImagesFolder()
			}
		},

		watch : {
			css : {
				files : [ "src/css/**/*", "src/js/**/*" ],
				tasks : [ "less", "requirejs:js" ],
				options: {
					// Start a live reload server on the default port 35729
					livereload: true,
					interrupt: true,
				}
			}
		}

	});

	grunt.loadNpmTasks( "grunt-contrib-clean" );
	grunt.loadNpmTasks( "grunt-contrib-copy" );
	grunt.loadNpmTasks( "grunt-contrib-concat" );
	grunt.loadNpmTasks( "grunt-contrib-requirejs" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-contrib-uglify" );
	grunt.loadNpmTasks( "grunt-contrib-less" );
	grunt.loadNpmTasks( "grunt-contrib-cssmin" );
	grunt.loadNpmTasks( "grunt-contrib-watch" );

	grunt.registerTask( "lint", [ "jshint" ] );
	grunt.registerTask("css", [ "less", "cssmin", "copy" ]);
	grunt.registerTask("js", [ "requirejs:js", "uglify", "concat" ]);
	grunt.registerTask("jsej", [ "requirejs:jsej", "uglify" ]);
	
	grunt.registerTask("release", [ "lint", "css", "js", "requirejs:jsejvl"]);
	grunt.registerTask("releaseej", [ "lint", "css", "jsej" ]);

	grunt.registerTask("default", [ "release" ]);
};
