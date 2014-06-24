module.exports = function(grunt) {
	"use strict";

	var pkg = grunt.file.readJSON("package.json"),
		themes = grunt.file.readJSON("themes.json"),
		path = require("path"),

		name = pkg.name,
		version = pkg.version,
		themeVersion = ["default", "changeable"],

		// Path to build framework
		dist = "dist",
		src = "src",

		// Path to framework JS sources
		srcJs = path.join( src, "js" ),
		srcCss = themes.path,

		buildRoot = path.join(dist),
		buildDir = {
			mobile: {
				js: path.join(buildRoot, "mobile", "js"),
				theme: path.join(buildRoot, "mobile", "theme")
			},
			wearable: {
				js: path.join(buildRoot, "wearable", "js"),
				theme: path.join(buildRoot, "wearable", "theme")
			}
		},

		rootNamespace = name,
		config = rootNamespace + "Config",
		fileName = name,

		wrapStart = "(function(window, document, undefined) {\n" +
			"'use strict';\n" +
			"var ns = window."+ rootNamespace +" = {},\n" +
			"nsConfig = window." + config + " = window." + config + " || {};\n" +
			"nsConfig.rootNamespace = '" + rootNamespace + "';\n" +
			"nsConfig.fileName = '" + fileName + "';\n",

		wrapEnd = "}(window, window.document));\n",

		files = {
			js: {
				minifiedFiles: [],
				setMinifiedFiles: function() {
					files.js.minifiedFiles.length = 0;
					grunt.file.recurse(buildRoot, function(abspath/*, rootdir, subdir, filename */) {
						if ( /.js$/.test(abspath) && !/.min.js$/.test( abspath ) ) {
							files.js.minifiedFiles.push({
								src: abspath,
								dest: abspath.replace(".js", ".min.js")
							});
						}
					});
				},

				getLicenseFiles: function() {
					var exts = [".min.js", ".js"],
						licenseFiles = [],
						device,
						src;

					for(device in buildDir) {
						if( buildDir.hasOwnProperty(device) ) {
							exts.forEach(function( ext ) {
								src = path.join( buildDir[device].js, name ) + ext;
								licenseFiles.push({
									src: [path.join( "license", "Flora" ) + ".txt", src],
									dest: src
								});
							});
						}
					}

					return licenseFiles;
				}
			},

			css: {
				getCssFiles: function( device, version ) {
					var rtn = [],
						list = themes.device[device],
						versionPath = version ? version + "-path" : "default-path",
						i=0,
						len=list.length,
						theme,
						versionName;
					if (version === "changeable") {
						theme = list[0];
						rtn.push({
							src: path.join(srcCss, theme[versionPath], theme.src),
							dest: path.join(buildRoot, device, "theme", version, name) + ".css"
						},
						{
							src: path.join(srcCss, theme[versionPath], theme.src.replace(".less", ".changeable.less")),
							dest: path.join(buildRoot, device, "theme", version, "changeable.template")
						});
					} else {
						for(; i < len; i++) {
							theme = list[i];
							rtn.push({
								src: path.join(srcCss, theme[versionPath], theme.src),
								dest: path.join(buildRoot, device, "theme", theme.name, name) + ".css"
							});
						}
					}

					return rtn;
				},

				getDefault: function( device, version ) {
					var list = themes.device[device],
						i=0,
						len=list.length,
						theme;

					if (version === "changeable")
						return;

					for(; i < len; i++) {
						theme = list[i];
						if ( theme["default"] === "true" ) {
							return {
								src: path.join(buildRoot, device, "theme", theme.name),
								dest: path.join(buildRoot, device, "theme", "default" )
							};
						}
					}
				},

				getLicenseFiles: function( version ) {
					var exts = [".css", ".min.css"],
						licenseFiles = [],
						i = 0,
						device,
						list,
						len,
						theme,
						src;

					for(device in buildDir) {
						if( buildDir.hasOwnProperty(device) ) {
							list = themes.device[device];
							len = list.length;

							if (version === "changeable") {
								theme = list[0];
								exts.forEach(function( ext ) {
									src = path.join( buildDir[device].theme, version, name ) + ext;
									licenseFiles.push({
										src: [path.join( "license", "Flora" ) + ".txt", src],
										dest: src
									});
								});
							} else {
								for(; i < len; i++) {
									theme = list[i];
									exts.forEach(function( ext ) {
										src = path.join( buildDir[device].theme, theme.name, name ) + ext;
										licenseFiles.push({
											src: [path.join( "license", "flora" ) + ".txt", src],
											dest: src
										});
									});
								}
							}
						}
					}

					return licenseFiles;
				}
			},

			image: {
				getImageFiles: function( device, version ) {
					var rtn = [],
						list = themes.device[device],
						versionPath = version ? version + "-path" : "default-path",
						i=0, len=list.length, theme;

					if (version === "changeable") {
						theme = list[0];
						rtn.push({
							expand: true,
							cwd: path.join( srcCss, theme[versionPath], theme.images ),
							src: "**",
							dest: path.join( buildRoot, device, "theme", version, theme.images )
						});
					} else {
						for(; i < len; i++) {
							theme = list[i];
							rtn.push({
								expand: true,
								cwd: path.join( srcCss, theme[versionPath], theme.images ),
								src: "**",
								dest: path.join( buildRoot, device, "theme", theme.name, theme.images )
							});
						}
					}

					return rtn;
				}
			}
		},

		initConfig = {
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

			// Test module (tools/grunt/tasks/tests.js) add callback for [profileName].options.done
			// If here is something changed, please verify it in tests module also.
			requirejs: {
				wearable: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "wearable",
						out: path.join( buildDir.wearable.js, name ) + ".js",
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
						out: path.join( buildDir.mobile.js, name ) + ".js",
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: true
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				}
			},

			less : {
				wearableDefault : {
					files : files.css.getCssFiles("wearable", "default")
				},

				wearableChangeable : {
					files : files.css.getCssFiles("wearable", "changeable")
				},

				mobileDefault: {
					files : files.css.getCssFiles("mobile", "default")
				},
				mobileChangeable: {
					files : files.css.getCssFiles("mobile", "changeable")
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
					cwd: buildRoot,
					src: ["**/*.css", "!**/*.min.css"],
					dest: buildRoot,
					ext: ".min.css"
				}
			},

			copy: {
				wearableDefaultImages: {
					files: files.image.getImageFiles( "wearable", "default" )
				},

				wearableChangeableImages: {
					files: files.image.getImageFiles( "wearable", "changeable" )
				},

				mobileDefaultImages: {
					files: files.image.getImageFiles( "mobile", "default" )
				},

				mobileChangeableImages: {
					files: files.image.getImageFiles( "mobile", "changeable" )
				},

				mobileJquery: {
					files: [
						{
							src: "libs/jquery.js",
							dest: path.join(buildDir.mobile.js, "jquery.js")
						},
						{
							src: "libs/jquery.min.js",
							dest: path.join(buildDir.mobile.js, "jquery.min.js")
						}
					]
				},

				license: {
					src: "LICENSE.Flora",
					dest: path.join( dist, "LICENSE" ) + ".Flora"
				},

				globalize: {
					expand: true,
					cwd: "libs/globalize/lib/",
					src: "cultures/**/*",
					dest: buildDir.mobile.js
				},

				"sdk-docs": {
					files: [
						{expand: true, cwd: "tools/grunt/tasks/templates/files", src: "**/*", dest: "docs/sdk/mobile/html/widgets"},
						{expand: true, cwd: "tools/grunt/tasks/templates/files", src: "**/*", dest: "docs/sdk/wearable/html/widgets"}
					]
				}
			},

			licenseCss: {
				default: {
					files: files.css.getLicenseFiles("default")
				},
				changeable: {
					files: files.css.getLicenseFiles("changeable")
				}
			},

			"ej-namespace": {
				//the task added in tests.js used for tests
			},

			symlink: {
				options: {
					overwrite: false
				},

				wearableDefaultTheme: files.css.getDefault( "wearable", "default" ),

				mobileDefaultTheme: files.css.getDefault( "mobile", "default" ),
			},

			"string-replace": {
				jsduck: {
					files: {
						'tmp/jsduck/' : 'dist/**/tau.js'
					},
					options: {
						replacements: [
							{
								pattern: /.*\@namespace.*/gi,
								replacement: ''
							},
							{
								pattern: /.*\@instance.*/ig,
								replacement: ''
							},
							{
								pattern: /.*\@expose.*/ig,
								replacement: ''
							},
							{
								pattern: /.*\@internal.*/ig,
								replacement: ''
							}
						]
					}
				}
			},

			concat: {
				licenseJs: {
					files: files.js.getLicenseFiles()
				},
				licenseDefaultCss: {
					files: files.css.getLicenseFiles("default")
				},
				licenseChangeableCss: {
					files: files.css.getLicenseFiles("changeable")
				}
			},

			clean: {
				js: [ buildDir.mobile.js, buildDir.wearable.js ],
				theme: [ buildDir.mobile.theme, buildDir.wearable.theme ],
				docs: {
					expand: true,
					src: ['docs/sdk', 'docs/js']
				},
				tmp: {
					expand: true,
					src: ['tmp']
				},
			},

			qunit: {
				options: {
					'--web-security': 'no'
				}
			},

			"sdk-docs-html": {
				mobile: {
					profile: "mobile",
					files: {
						src: ['dist/mobile/js/tau.js']
					}
				},
				wearable: {
					profile: "wearable",
					files: {
						src: ['dist/wearable/js/tau.js']
					}
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

				wearableCss: {
					files : [ "src/css/profile/wearable/**/*.less" ],
					tasks : [ "less:wearable" ]
				},

				mobileCss: {
					files : [ "src/css/profile/mobile/**/*.less" ],
					tasks : [ "less:mobile" ]
				},

				image: {
					files : [ "src/css/profile/**/*.png" ],
					tasks : [ "image" ]
				}
			},

			debug: {
				options: {
					open: true
				}
			}
		};


	grunt.initConfig(initConfig);

	grunt.registerTask("version", "create version files.", function( ) {
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

	grunt.registerTask('jsduck', ['clean:tmp', 'clean:docs', 'string-replace:jsduck', 'jsduckDocumentation']);

	function runJSDuck(profile, callback) {
		var cmd = 'jsduck',
			src = [path.join('tmp', 'jsduck', "dist", profile, "js")],
			dest = path.join('docs', 'jsduck', profile),
			args,
			environmentClasses = ['DocumentFragment', 'CustomEvent',
				'HTMLUListElement', 'HTMLOListElement', 'HTMLCollection',
				'HTMLBaseElement', 'HTMLImageElement', 'WebGLRenderingContext',
				"HTMLSelectElement", "HTMLInputElement",
				'WebGLProgram', 'jQuery', 'DOMTokenList',
				"mat2", "mat3","mat4", "vec2", "vec3", "vec4", "quat4"],
			jsduck;

		if (!grunt.file.exists("docs")) {
			grunt.file.mkdir("docs");
		}
		if (!grunt.file.exists(path.join('docs', 'jsduck'))) {
			grunt.file.mkdir(path.join('docs', 'jsduck'));
		}
		if (!grunt.file.exists(path.join('docs', 'jsduck', profile))) {
			grunt.file.mkdir(path.join('docs', 'jsduck', profile));
		}

		args = src.concat([
			'--eg-iframe=./tools/jsduck/'+ profile +'-preview.html',
				'--external=' + environmentClasses.join(','),
			'--output', dest
		]);

		grunt.verbose.writeflags(args, "Arguments");

		jsduck = grunt.util.spawn({
			cmd: cmd,
			args: args
		}, function (error, result, code) {
			grunt.file.delete(path.join('tmp', 'jsduck', "dist", profile, "js"), {force: true});
			if (code === 127) {   // 'command not found'
				return grunt.warn(
						'You need to have Ruby and JSDuck installed and in your PATH for ' +
						'this task to work. ' +
						'See https://github.com/dpashkevich/grunt-jsduck for details.'
				);
			}
			callback(error);
		});

		jsduck.stdout.pipe(process.stdout);
		jsduck.stderr.pipe(process.stderr);
	}

	grunt.registerTask('jsduckDocumentation', 'Compile JSDuck documentation', function () {
		var async = require("async"),
			done = this.async();

		async.series([
			runJSDuck.bind(null, "mobile"),
			runJSDuck.bind(null, "wearable")
		], done);
	});

	function findDefaultTheme(profileName) {
		return themes['device'][profileName].filter(function (theme) {
			return theme['default'] === 'true';
		}).shift();
	}

	// add requirejs tasks to build themes.
	(function() {
		var requirejs = initConfig.requirejs,
			profileName,
			source,
			ver,
			themeName;

		for (profileName in themes['device']) {
			themes['device'][profileName].forEach(function (theme) {
				for (ver in themeVersion) {
					if (themeVersion.hasOwnProperty(ver)) {
						if (themeVersion[ver] === "changeable") {
							theme = themes["device"][profileName][0];
							themeName = "changeable";
						} else {
							themeName = theme.name
						}

						source = path.join("..", "css", "profile", profileName, themeVersion[ver], "theme-" + theme.name, 'theme');
						if (grunt.file.exists(path.join(srcJs, source + '.js'))) {
							requirejs["themejs_" + profileName + '_'+ themeVersion[ver] + "_" + theme.name] = {
								options: {
									baseUrl: srcJs,
									optimize: "none",
									skipModuleInsertion: true,
									exclude: [ profileName ],
									name: path.join("..", "css", "profile", profileName, themeVersion[ver], "theme-" + theme.name, 'theme'),
									out: path.join( buildDir[profileName].theme, themeName, 'theme' ) + '.js',
									pragmasOnSave: {
										tauBuildExclude: true,
										tauDebug: true
									},
									wrap: {
										start: '(function (ns) {',
										end: '}(tau));'
									}
								}
							};
						}
					}
				}
			});
		}
	})();

	// append default theme to profile
	(function() {
		var requirejs = initConfig.requirejs,
			defaultTheme,
			profileName,
			include,
			ver;

		// Add a dependency to the theme.js module
		for (profileName in themes['device']) {
			defaultTheme = findDefaultTheme(profileName);
			for (ver in themeVersion) {
				if (themeVersion.hasOwnProperty(ver)) {
					if (defaultTheme !== undefined &&
						requirejs["themejs_" + profileName + '_' + themeVersion[ver] + "_" + defaultTheme.name]) {
						include = requirejs[profileName].options.include || [];
						include.push(
							path.join("..", "css", "profile", profileName, themeVersion[ver], "theme-" + defaultTheme.name, 'theme')
						);
				requirejs[profileName].options.include = include;
					}
				}
			}
		}
	}());

	function themesjs() {
		var task;
		for (task in initConfig.requirejs) {
			if (initConfig.requirejs.hasOwnProperty(task) && task.indexOf('themejs_') !== -1) {
				grunt.task.run("requirejs:" + task);
			}
		}
	}

	grunt.initConfig(initConfig);

	// npm tasks
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-requirejs");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-string-replace");
	grunt.loadNpmTasks("grunt-contrib-symlink");
	grunt.loadNpmTasks("grunt-debug-task");

	// Load framework custom tasks
	grunt.loadTasks('tools/grunt/tasks');

	// Task list
	grunt.registerTask("themesjs", "Generate themes files using requirejs", themesjs);  // Generate separate themes files
	grunt.registerTask("lint", [ /* "jshint", @TODO fix all errors and revert*/ ] );
	grunt.registerTask("jsmin", [ "findFiles:js.setMinifiedFiles", "uglify" ]);
	grunt.registerTask("image", [ "copy:wearableDefaultImages", "copy:mobileDefaultImages" ]);
	grunt.registerTask("image-changeable", [ "copy:wearableChangeableImages", "copy:mobileChangeableImages" ]);
	grunt.registerTask("css", [ "clean:theme", "less", "cssmin", "image", "image-changeable", "symlink" ]);
	grunt.registerTask("js", [ "clean:js", "requirejs", "jsmin", "themesjs", "copy:globalize", "copy:mobileJquery" ]);
	grunt.registerTask("license", [ "concat:licenseJs", "concat:licenseDefaultCss", "concat:licenseChangeableCss", "copy:license" ]);
	grunt.registerTask("sdk-docs", [ "sdk-docs-html:mobile", "sdk-docs-html:wearable", "copy:sdk-docs" ]);

	grunt.registerTask("build", ["clean", "lint", "css", "js", "license", "version"]);
	grunt.registerTask("release", [ "build", "test", "sdk-docs" ]);
	grunt.registerTask("default", [ "release" ]);
};
