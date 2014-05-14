module.exports = function(grunt) {
	"use strict";

	var pkg = grunt.file.readJSON("package.json"),
		themes = grunt.file.readJSON("themes.json"),
		path = require("path"),

		// Path to build framework
		dist = "dist" + path.sep,

		// Path to directory with tests
		testsPath = "tests" + path.sep,

		// Path to framework JS sources
		srcJs = path.join( "src", "js" ),

		name = pkg.name,
		version = pkg.version,

		jsPath = path.join(dist, "js"),
		widgetPath = path.join(jsPath, "widget"),
		themesPath = path.join(dist, "theme"),

		rootNamespace = "ns",
		exportNamespace = name,
		config = exportNamespace + "Config",
		fileName = name,

		wrapStart = "(function(window, document, undefined) {\n" +
			"'use strict';\n" +
			"var ns = {},\n" +
			"	nsConfig = window." + config + " = window." + config + " || {};\n" +
			"nsConfig.rootNamespace = '" + rootNamespace + "';\n" +
			"nsConfig.fileName = '" + fileName + "';\n",
		wrapEnd = "}(window, window.document));\n",

		wrapStartWidget = "(function(window, document, undefined) {\n" +
			"'use strict';\n" +
			"var ns = " + exportNamespace + "._export || {},\n" +
			"	nsConfig = window." + config + " = window." + config + " || {};\n" +
			"nsConfig.rootNamespace = '" + rootNamespace + "';\n" +
			"nsConfig.fileName = '" + fileName + "';\n",
		wrapEndWidget = wrapEnd,

		widgets = {
			"indexScrollbar": "profile/wearable/widget/wearable/indexscrollbar/IndexScrollbar",
			"sectionchanger": "profile/wearable/widget/wearable/SectionChanger",
			"virtuallist": "profile/wearable/widget/wearable/VirtualListview",
			"virtualgrid": "profile/wearable/widget/wearable/VirtualGrid",
			"swipelist": "profile/wearable/widget/wearable/SwipeList"
		},

		files = {
			js: {
				licenseFiles: [],
				setLicenseFiles: function() {
					files.js.licenseFiles.length = 0;
					grunt.file.recurse(jsPath, function(abspath/*, rootdir, subdir, filename */) {
						files.js.licenseFiles.push({
							src: [path.join( "license", "Flora" ) + ".txt", abspath],
							dest: abspath
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
				getCssFiles: function( device ) {
					var rtn = [],
						list = themes.device[device],
						i=0, len=list.length, theme;
					for(; i < len; i++) {
						theme = list[i];
						rtn.push({
							src: path.join(themes.path, theme.src),
							dest: path.join( themesPath, device, theme.name, name ) + ".css"
						});
					}
					return rtn;
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

			image: {
				getImageFiles: function( device ) {
					var rtn = [],
						list = themes.device[device],
						i=0, len=list.length, theme;
					for(; i < len; i++) {
						theme = list[i];
						rtn.push({
							expand: true,
							cwd: path.join( themes.path, theme.images ),
							src: "**",
							dest: path.join( themesPath, device, theme.name, theme.images.split("/").pop() )
						});
					}
					return rtn;
				}
			}

		},

		qunitPrepare = function (done, output) {
			var result = require('rjs-build-analysis').parse(output),
				slice = [].slice,
				testModules = [],
				jsAddTests = ['api'];
			if (result && result.bundles.length > 0) {
				slice.call(result.bundles[0].children).forEach(function (modulePath) {
					testModules.push(path.join('tests', path.relative('src/', modulePath).replace(/(\.js)+/gi, ''), '*.html'));
					jsAddTests.forEach(function (oneDirectory) {
						testModules.push(path.join('tests', path.relative('src/', modulePath).replace(/(\.js)+/gi, ''), '/' + oneDirectory + '/*.html'));
					});
				});
				grunt.config('qunit.main', testModules);
			}
			done();
		},

		initConfig = {
			version: version,

			writeVersion: grunt.file.write(path.join( dist, "VERSION" ), pkg.version + "\n"),

			jshint: {
				js: {
					options: {
						jshintrc: path.join(srcJs, ".jshintrc")
					},
					files: {
						src: [ path.join(srcJs, "**/*.js") ]
					}
				},
				grunt: {
					options: {
						jshintrc: srcJs + ".jshintrc"
					},
					files: {
						src: [ "Gruntfile.js" ]
					}
				}
			},

			requirejs: {
				full: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "wearable",
						out: path.join( jsPath, name ) + ".js",
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: true
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						},
						done: qunitPrepare
					}
				},

				core: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "wearable.core",
						out: path.join( jsPath, name ) + ".core.js",
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: true
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				},

				mobile: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "mobile",
						out: path.join( jsPath, name ) + ".js",
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: true
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						},
						done: qunitPrepare
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
				wearable : {
					files : files.css.getCssFiles("wearable")
				},

				mobile: {
					files : files.css.getCssFiles("mobile")
				}
			},

			cssmin: {
				options: {
					keepSpecialComments: 0
				},

				minify: {
					expand: true,
					cwd: themesPath,
					src: ["**/*.css", "!**/*.min.css"],
					dest: themesPath,
					ext: ".min.css"
				}
			},

			copy: {
				wimages: {
					files: files.image.getImageFiles( "wearable" )
				},

				mimages: {
					files: files.image.getImageFiles( "mobile" )
				},

				license: {
					src: "LICENSE.Flora",
					dest: path.join( dist, "LICENSE" ) + ".Flora"
				},

				globalize: {
					expand: true,
					cwd: "libs/globalize/lib/",
					src: "cultures/**/*",
					dest: path.join(dist, "js" )
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

			clean: {
				js: [ jsPath ],
				css: [ themesPath ]
			},

			qunit: {
				options: {
					'--web-security': 'no'
				}
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
					baseUrl: srcJs,
					optimize: "none",
					findNestedDependencies: true,
					skipModuleInsertion: true,
					include: [ value ],
					exclude: [ "wearable.core" ],
					out: path.join( widgetPath, name + "." + key ) + ".js",
					pragmasOnSave: {
						tauBuildExclude: true,
						tauDebug: true
					},
					wrap: {
						start: wrapStartWidget,
						end: wrapEndWidget
					}
				}
			};
		}

	})();

	grunt.initConfig(initConfig);

	grunt.registerTask("findFiles", "Initialize Target Files.", function( name ) {
		var obj = files;
		name = name.split( "." );
		name.forEach(function(key) {
			obj = obj[key];
		});
		obj();
	});

	// Generate separate widget files
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

	// Load framework custom tasks
	grunt.loadTasks('tools/grunt/tasks');

	grunt.registerTask( "lint", [ "jshint" ] );

	grunt.registerTask( "jsmin", [ "findFiles:js.setMinifiedFiles", "uglify" ] );

	grunt.registerTask("css", [ "clean:css", "less", "cssmin" ]);
	grunt.registerTask("js", [ "clean:js", "requirejs:full", "requirejs:core", "widget", "jsmin" ]);
	grunt.registerTask("jsmobile", [ "clean:js", "requirejs:mobile" ]);

	grunt.registerTask("license", [ "findFiles:js.setLicenseFiles", "findFiles:css.setLicenseFiles", "concat" ]);

	grunt.registerTask("release", [ "clean", /* "lint", @TODO fix all errors and revert*/ "css", "js", "license", "copy:wimages", "copy:license" ]);
	grunt.registerTask("releasemobile", [ "clean", /* "lint", @TODO fix all errors and revert*/ "css", "jsmobile", "license", "copy:mimages", "copy:license", "copy:globalize" ]);

	grunt.registerTask("default", [ "release" ]);
};
