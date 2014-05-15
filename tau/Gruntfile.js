module.exports = function(grunt) {
	"use strict";

	var pkg = grunt.file.readJSON("package.json"),
		themes = grunt.file.readJSON("themes.json"),
		path = require("path"),

		name = pkg.name,
		version = pkg.version,

		// Path to build framework
		dist = "dist",
		src = "src",

		// Path to directory with tests
		testsPath = "tests" + path.sep,

		// Path to framework JS sources
		srcJs = path.join( src, "js" ),
		srcCss = themes.path,

		buildJs = path.join(dist, "js"),
		buildMobileJs = path.join(buildJs, "mobile"),
		buildWearableJs = path.join(buildJs, "wearable"),

		buildCss = path.join(dist, "theme"),

		rootNamespace = "ns",
		exportNamespace = name,
		config = exportNamespace + "Config",
		fileName = name,

		wrapStart = "(function(window, document, undefined) {\n" +
			"'use strict';\n" +
			"var ns = {},\n" +
			"nsConfig = window." + config + " = window." + config + " || {};\n" +
			"nsConfig.rootNamespace = '" + rootNamespace + "';\n" +
			"nsConfig.fileName = '" + fileName + "';\n",

		wrapEnd = "}(window, window.document));\n",

		files = {
			js: {
				licenseFiles: [],
				setLicenseFiles: function() {
					files.js.licenseFiles.length = 0;
					grunt.file.recurse(buildJs, function(abspath/*, rootdir, subdir, filename */) {
						files.js.licenseFiles.push({
							src: [path.join( "license", "Flora" ) + ".txt", abspath],
							dest: abspath
						});
					});
				},
				minifiedFiles: [],
				setMinifiedFiles: function() {
					files.js.minifiedFiles.length = 0;
					grunt.file.recurse(buildJs, function(abspath/*, rootdir, subdir, filename */) {
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
							src: path.join(srcCss, theme.src),
							dest: path.join( buildCss, device, theme.name, name ) + ".css"
						});
					}
					return rtn;
				},

				licenseFiles: [],
				setLicenseFiles: function() {
					files.css.licenseFiles.length = 0;
					grunt.file.recurse(buildCss, function(abspath, rootdir, subdir, filename) {
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
							cwd: path.join( srcCss, theme.images ),
							src: "**",
							dest: path.join( buildCss, device, theme.name, theme.images.split("/").pop() )
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
		};

	grunt.initConfig({
		version: version,

		jshint: {
			js: {
				options: {
					jshintrc: path.join(srcJs, ".jshintrc")
				},
				files: {
					src: [ path.join(srcJs, "**/*.js") ]
				}
			}
		},

		requirejs: {
			wearable: {
				options: {
					baseUrl: srcJs,
					optimize: "none",
					findNestedDependencies: true,
					skipModuleInsertion: true,
					name: "wearable",
					out: path.join( buildWearableJs, name ) + ".js",
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

			mobile: {
				options: {
					baseUrl: srcJs,
					optimize: "none",
					findNestedDependencies: true,
					skipModuleInsertion: true,
					name: "mobile",
					out: path.join( buildMobileJs, name ) + ".js",
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

		less : {
			wearable : {
				files : files.css.getCssFiles("wearable")
			},

			mobile: {
				files : files.css.getCssFiles("mobile")
			}
		},

		uglify: {
			options: {
				beautify: {
					ascii_only: true
				},
				compress: {
					drop_console: true
				}
			},

			all: {
				files: files.js.minifiedFiles
			}
		},

		cssmin: {
			options: {
				keepSpecialComments: 0
			},

			all: {
				expand: true,
				cwd: buildCss,
				src: ["**/*.css", "!**/*.min.css"],
				dest: buildCss,
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
				dest: buildMobileJs
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
			js: [ buildJs ],
			css: [ buildCss ]
		},

		qunit: {
			options: {
				'--web-security': 'no'
			}
		},

		watch: {
			options: {
				// Start a live reload server on the default port 35729
				livereload: true,
				interrupt: true
			},

			js: {
				files : [ "src/js/**/*.js" ],
				tasks : [ "requirejs" ]
			},

			wcss: {
				files : [ "src/css/profile/wearable/**/*.less" ],
				tasks : [ "less:wearable" ]
			},

			mcss: {
				files : [ "src/css/profile/mobile/**/*.less" ],
				tasks : [ "less:mobile" ]
			},

			image: {
				files : [ "src/css/**/*.png" ],
				tasks : [ "image" ]
			}
		}
	});

	grunt.registerTask("version", "create version files.", function( name ) {
		grunt.file.write(path.join( dist, "VERSION" ), pkg.version + "\n");
	});

	grunt.registerTask("findFiles", "initialize target files.", function( name ) {
		var obj = files;
		name = name.split( "." );
		name.forEach(function(key) {
			obj = obj[key];
		});
		obj();
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

	// Load framework custom tasks
	grunt.loadTasks('tools/grunt/tasks');

	grunt.registerTask( "lint", [ /* "jshint", @TODO fix all errors and revert*/ ] );
	grunt.registerTask( "jsmin", [ "findFiles:js.setMinifiedFiles", "uglify" ] );
	grunt.registerTask( "image", [ "copy:wimages", "copy:mimages" ] );

	grunt.registerTask("css", [ "clean:css", "less", "cssmin", "image" ]);
	grunt.registerTask("js", [ "clean:js", "requirejs", "jsmin", "copy:globalize" ]);
	grunt.registerTask("license", [ "findFiles:js.setLicenseFiles", "findFiles:css.setLicenseFiles", "concat", "copy:license" ]);

	grunt.registerTask("release", [ "clean", "lint", "css", "js", "license", "version" ]);

	grunt.registerTask("default", [ "release" ]);
};
