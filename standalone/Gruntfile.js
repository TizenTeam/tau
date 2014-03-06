module.exports = function(grunt) {
	"use strict";

	var pkg = grunt.file.readJSON("package.json"),
		path = require("path"),
		dist = "dist" + path.sep,

		name = pkg.name,
		version = pkg.version,

		jsPath = path.join(dist, "js"),
		widgetPath = path.join(jsPath, "widget"),
		themesPath = path.join(dist, "themes"),

		widgets = {
			"indexScrollbar": "widget/indexScrollbar",
			"sectionchanger": "widget/sectionchanger"
		},

		themes = {
			"default" : "src/css/themes/black",
			"black" : "src/css/themes/black"
		},

		files = {
			js: {
				getWidgetFiles: function() {
					var list = [],
						key, value;
					for ( key in widgets ) {
						value = widgets[key];
						list.push(value);
					}
					return list;
				},
				licenseFiles: [],
				setLicenseFiles: function() {
					files.js.licenseFiles.length = 0;
					grunt.file.recurse(jsPath, function(abspath/*, rootdir, subdir, filename */) {
						files.js.licenseFiles.push({
							src: [path.join( "license", "Flora" ) + ".txt", abspath],
							dest: abspath,
						});
					});
				},
				minifiedFiles: [],
				setMinifiedFiles: function() {
					files.js.minifiedFiles.length = 0;
					grunt.file.recurse(jsPath, function(abspath/*, rootdir, subdir, filename */) {
						if ( !/.min.js/.test( abspath ) ) {
							files.js.minifiedFiles.push({
								src: abspath,
								dest: abspath.replace(".js", ".min.js")
							});
						}
					});
				}
			},

			css: {
				getCssFiles: function( ) {
					var list = [],
						key, value;
					for(key in themes) {
						value = themes[key];
						list.push({
							src: path.join(value, name) + ".less",
							dest: path.join( themesPath, key, name ) + ".css"
						});
					}
					return list;
				},

				getMinifiedCSSFiles : function( ) {
					var list = [],
						key;
					for(key in themes) {
						list.push({
							src: path.join( themesPath, key, name ) + ".css",
							dest: path.join( themesPath, key, name ) + ".min.css"
						});
					}
					return list;
				},

				licenseFiles: [],
				setLicenseFiles: function() {
					files.css.licenseFiles.length = 0;
					grunt.file.recurse(themesPath, function(abspath, rootdir, subdir, filename) {
						if ( /.css$/.test(filename) ) {
							files.css.licenseFiles.push({
								src: [path.join( "license", "Flora" ) + ".txt", abspath],
								dest: abspath
							});
						}
					});
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

		},

		initConfig = {
			version: version,

			writeVersion: grunt.file.write(path.join( dist, "VERSION" ), pkg.version + "\n"),

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
				core: {
					options: {
						baseUrl: "src/js",
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						mainConfigFile: "src/js/requirejs.config.js",
						include: [ name ],
						out: path.join( jsPath, name ) + ".core.js",
						pragmasOnSave: {
							microBuildExclude: true
						},
						wrap: {
							startFile: "build/wrap.start",
							endFile: "build/wrap.end"
						}
					}
				},

				full: {
					options: {
						baseUrl: "src/js",
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						mainConfigFile: "src/js/requirejs.config.js",
						include: [ name ].concat( files.js.getWidgetFiles() ),
						out: path.join( jsPath, name ) + ".js",
						pragmasOnSave: {
							microBuildExclude: true
						},
						wrap: {
							startFile: "build/wrap.start",
							endFile: "build/wrap.end"
						}
					}
				},

				ej: {
					options: {
						baseUrl: "src/ej",
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "micro",
						out: path.join( jsPath, name ) + ".js",
						pragmasOnSave: {
							ejBuildExclude: true,
							ejDebug: true
						}
					}
				},

				virtuallist: {
					options: {
						baseUrl: "src/ej",
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "virtuallist",
						out: path.join( widgetPath, "virtuallist" ) + ".js",
						pragmasOnSave: {
							ejBuildExclude: true,
							ejDebug: true
						}
					}
				}
			},

			uglify: {
				all: {
					options: {
						beautify: {
							ascii_only: true
						},
						compress: {
							drop_console: true
						}
					},

					files: files.js.minifiedFiles
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
				},
				license: {
					src: "LICENSE.Flora", dest: path.join( dist, "LICENSE" ) + ".Flora"
				}
			},

			concat: {
				licenseJs: {
					files: files.js.licenseFiles
				},
				licenseCss: {
					files: files.css.licenseFiles
				}
			},

			watch : {
				all : {
					files : [ "src/css/**/*", "src/js/**/*" ],
					tasks : [ "less", "requirejs:js" ],
					options: {
						// Start a live reload server on the default port 35729
						livereload: true,
						interrupt: true,
					}
				}
			},

			clean: {
				js: [ jsPath ],
				css: [ themesPath ]
			}

		};

	// add requirejs tasks to build widget library.
	(function() {
		var requirejs = initConfig.requirejs,
			key, value;

		for ( key in widgets ) {
			value = widgets[key];

			requirejs["widget_" + key] = {
				options: {
					baseUrl: "src/js",
					optimize: "none",
					findNestedDependencies: true,
					skipModuleInsertion: true,
					mainConfigFile: "src/js/requirejs.config.js",
					pragmasOnSave: {
						microBuildExclude: true
					},
					include: [ value ],
					exclude: [ name ],
					out: path.join( widgetPath, key ) + ".js",
					wrap: {
						start: [
							";(function(window, undefined) {",
							"	var ns = "+ name +";",
							""].join( grunt.util.linefeed ),
						end: "})(this);"
					}
				}
			};
		}

	})();

	grunt.initConfig(initConfig);

	grunt.registerTask("findFiles", "Initialize Target Files.", function( name ) {
		var name, obj = files;
		name = name.split( "." );
		name.forEach(function(key) {
			obj = obj[key];
		});
		obj();
	});

	grunt.registerTask("widget", "Generate widget files using requirejs", function() {
		var key;

		for ( key in widgets ) {
			grunt.task.run("requirejs:widget_" + key);
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
	grunt.registerTask( "jsmin", [ "findFiles:js.setMinifiedFiles", "uglify" ] );

	grunt.registerTask("css", [ "clean:css", "less", "cssmin" ]);
	grunt.registerTask("js", [ "clean:js", "requirejs:full", "requirejs:core", "widget", "requirejs:virtuallist", "jsmin" ]);
	grunt.registerTask("jsej", [ "clean:js", "requirejs:jsej", "uglify" ]);

	grunt.registerTask("license", [ "findFiles:js.setLicenseFiles", "findFiles:css.setLicenseFiles", "concat" ]);

	grunt.registerTask("release", [ "clean", "lint", "css", "js", "license", "copy" ]);
	grunt.registerTask("releaseej", [ "lint", "css", "jsej" ]);

	grunt.registerTask("default", [ "release" ]);
};
