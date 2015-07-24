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

		tauDebug = grunt.option("tau-debug") || false,
		tauPerformance = grunt.option("tau-performance") || false,

		buildRoot = path.join(dist),
		buildDir = {
			mobile: {
				js: path.join(buildRoot, "mobile", "js"),
				theme: path.join(buildRoot, "mobile", "theme")
			},
			wearable: {
				js: path.join(buildRoot, "wearable", "js"),
				theme: path.join(buildRoot, "wearable", "theme")
			},
			tv: {
				js: path.join(buildRoot, "tv", "js"),
				theme: path.join(buildRoot, "tv", "theme")
			}
		},
		themeConverterXMLPath = path.join("tools", "grunt", "xml"),

		rootNamespace = name,
		config = rootNamespace + "Config",
		fileName = name,

		wrapStart = "(function(window, document, undefined) {\n" +
			"'use strict';\n" +
			"var ns = window."+ rootNamespace +" = {},\n" +
			"nsConfig = window." + config + " = window." + config + " || {};\n" +
			"nsConfig.rootNamespace = '" + rootNamespace + "';\n" +
			"nsConfig.fileName = '" + fileName + "';\n" +
			"ns.version = '" + version + "';\n",

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
				getDefault: function( device, version ) {
					var list = themes.device[device],
						i=0,
						len=list.length,
						theme;

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
						wearableThemeColors = ["blue", "brown"],
						licenseFiles = [],
						i = 1,
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
											src: [path.join( "license", "Flora" ) + ".txt", src],
											dest: src
										});
									});
								}
							}
						}
					}
					if (version === "wearable") {
						theme = themes.device[version];
						exts.forEach(function( ext ) {
							len = wearableThemeColors.length;
							for (i = 0; i < len; i++) {
								src = path.join( buildDir[version].theme, wearableThemeColors[i], name ) + ext;
								licenseFiles.push({
									src: [path.join( "license", "Flora" ) + ".txt", src],
									dest: src
								});
							}
						});
					}

					return licenseFiles;
				}
			},

			image: {
				getImageFiles: function( device, version ) {
					var rtn = [],
						list = themes.device[device],
						versionPath = version ? version + "-path" : "default-path",
						wearableThemeColors = ["blue", "brown"],
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
							if (theme.name !== "changeable") {
								rtn.push({
									expand: true,
									cwd: path.join(srcCss, theme[versionPath], theme.images),
									src: "**",
									dest: path.join(buildRoot, device, "theme", theme.name, theme.images)
								});
							}
						}
					}
					if (version === "wearable") {
						theme = themes.device[device][0];
						len = wearableThemeColors.length;
						for (i = 0; i < len; i++) {
							rtn.push({
								expand: true,
								cwd: path.join( srcCss, version, "changeable" , "theme-changeable", theme.images ),
								src: "**",
								dest: path.join( buildRoot, device, "theme", wearableThemeColors[i], theme.images )
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
				},
				single: {
					options: {
						jshintrc: "src/js/.jshintrc",
						reporter: "checkstyle",
						reporterOutput: "report/jshint/jshint-"+ grunt.option("jshintno") + ".xml"
					},
					src: grunt.option("jshintfile")
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
						pragmas: {
							tauPerformance: !tauPerformance
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
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
						pragmas: {
							tauPerformance: !tauPerformance
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				},

				tv: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						name: "tv",
						out: path.join( buildDir.tv.js, name ) + ".js",
						pragmas: {
							tauPerformance: !tauPerformance
						},
						pragmasOnSave: {
							tauBuildExclude: true,
							tauDebug: !tauDebug
						},
						wrap: {
							start: wrapStart,
							end: wrapEnd
						}
					}
				}

			},

			less : {
				wearable : {
					files : [
						{
							src: path.join(srcCss, "wearable","changeable","theme-changeable", "theme.less"),
							dest: path.join(buildRoot, "wearable", "theme", "changeable", "tau.template")
						},
						{
							src: path.join(srcCss, "wearable","changeable","theme-changeable", "theme.circle.less"),
							dest: path.join(buildRoot, "wearable", "theme", "changeable", "tau.circle.template")
						}
					]
				},
				mobile: {
					files : [
						{
							src: path.join(srcCss, "mobile","changeable","theme-changeable", "theme.less"),
							dest: path.join(buildRoot, "mobile", "theme", "changeable", "tau.template")
						}
					]
				},
				tv: {
					files : [
						{
							src: path.join(srcCss, "tv","default","theme-black", "theme.less"),
							dest: path.join(buildRoot, "tv", "theme", "black", "tau.css")
						}
					]
				}
			},

			themeConverter : {
				mobile: {
					createColorMapFile: grunt.option("generate-colormap") || false,
					options: {
						index:"0",
						style:"Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "mobile", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "mobile", "ChangeableColorTable1.xml")
					},
					src: path.join(buildDir.mobile.theme, "changeable", "tau.template"),
					dest: path.join(buildDir.mobile.theme, "changeable", "tau.css")
				},
				wearable: {
					createColorMapFile: grunt.option("generate-colormap") || false,
					options: {
						index:"0",
						style:"Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "wearable", "blue", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "wearable", "blue", "ChangeableColorTable1.xml")
					},
					files: [
						{
							src: path.join(buildDir.wearable.theme, "changeable", "tau.template"),
							dest: path.join(buildDir.wearable.theme, "changeable", "tau.css")
						},
						{
							src: path.join(buildDir.wearable.theme, "changeable", "tau.template"),
							dest: path.join(buildDir.wearable.theme, "blue", "tau.css")
						},
					]
				},
				wearable_circle: {
					options: {
						index:"0",
						style:"Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "wearable", "circle", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "wearable", "circle", "ChangeableColorTable1.xml")
					},
					src: path.join(buildDir.wearable.theme, "changeable", "tau.circle.template"),
					dest: path.join(buildDir.wearable.theme, "changeable", "tau.circle.css")
				},
				wearable_old: {
					options: {
						index:"0",
						style:"Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "wearable", "brown", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "wearable", "brown", "ChangeableColorTable1.xml")
					},
					src: path.join(buildDir.wearable.theme, "changeable", "tau.template"),
					dest: path.join(buildDir.wearable.theme, "brown", "tau.css")
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
					files: [{
						expand: true,
						cwd: buildRoot,
						src: ["**/*.css", "!**/*.min.css"],
						dest: buildRoot,
						rename: function (dest, src) {
							var folder = src.substring(0, src.lastIndexOf('/'));
							var filename = src.substring(src.lastIndexOf('/'), src.length);
							filename = filename.substring(0, filename.lastIndexOf('.'));
							return dest +"/"+ folder + filename + '.min.css';
						}
					}]
				},

				changeable: {
					expand: true,
					cwd: buildRoot,
					src: ["**/*.template"],
					dest: buildRoot,
					rename: function (dest, src) {
						var folder = src.substring(0, src.lastIndexOf('/'));
						var filename = src.substring(src.lastIndexOf('/'), src.length);
						filename = filename.substring(0, filename.lastIndexOf('.'));
						return dest +"/"+ folder + filename + '.min.template';
					}
				}
			},

			copy: {
				wearableDefaultImages: {
					files: files.image.getImageFiles( "wearable", "default" )
				},

				wearableChangeableImages: {
					files: files.image.getImageFiles( "wearable", "changeable" )
				},

				wearableColorThemeImages: {
					files: files.image.getImageFiles( "wearable", "wearable" )
				},

				mobileDefaultImages: {
					files: files.image.getImageFiles( "mobile", "default" )
				},

				mobileChangeableImages: {
					files: files.image.getImageFiles( "mobile", "changeable" )
				},

				tvDefaultImages: {
					files: files.image.getImageFiles( "tv", "default" )
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

				"globalize-mobile": {
					expand: true,
					cwd: "libs/globalize/lib/",
					src: "cultures/**/*",
					dest: buildDir.mobile.js
				},

				"globalize-tv": {
					expand: true,
					cwd: "libs/globalize/lib/",
					src: "cultures/**/*",
					dest: buildDir.tv.js
				},

				"sdk-docs": {
					files: [
						{expand: true, cwd: "tools/grunt/tasks/templates/files", src: "**/*", dest: "docs/sdk/mobile/html"},
						{expand: true, cwd: "tools/grunt/tasks/templates/files", src: "**/*", dest: "docs/sdk/wearable/html"},
						{expand: true, cwd: "tools/grunt/tasks/templates/files", src: "**/*", dest: "docs/sdk/tv/html"}
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

				tvDefaultTheme: files.css.getDefault( "tv", "default" )
			},

			"developer-guide-extract": {
				core: {
					files: [{
						src: ['src/js/core/**/*.js'],
						dest: 'docs/guide/source/inline/core/',
						// Part of the path removed in destination
						destBase: 'src/js/core/'
					}]
				},
				wearable: {
					files: [{
						src: ['src/js/profile/wearable/**/*.js'],
						dest: 'docs/guide/source/inline/wearable/',
						// Part of the path removed in destination
						destBase: 'src/js/profile/wearable/'
					}]
				},
				mobile: {
					files: [{
						src: 'src/js/profile/mobile/**/*.js',
						dest: 'docs/guide/source/inline/mobile/',
						// Part of the path removed in destination
						destBase: 'src/js/profile/mobile/'
					}]
				},
				tv: {
					files: [{
						src: ['src/js/profile/tv/**/*.js'],
						dest: 'docs/guide/source/inline/tv/',
						// Part of the path removed in destination
						destBase: 'src/js/profile/tv/'
					}]
				}
			},

			"developer-guide-build": {
				"options": {
					"version": version,
					"sourceDir": "docs/guide/source",
					"destinationDir": "docs/guide/built",
					"sourceMarkdown": ["**/*.md"],
					"sourceResources": [
						"**/*.html",
						"**/*.js",
						"**/*.png",
						"**/*.jpg",
						"**/*.zip",
						"**/*.css",
						"**/*.ttf",
						"**/*.wot",
						"**/*.svg",
						"**/*.woff"
					]
				}
			},

			"remove-unused": {
				"images": {
					resourcesPath: 'src/css',
					imageFiles: [
						'src/css/**/*.png',
						'src/css/**/*.jpg',
						'src/css/**/*.jpeg'
					],
					// Finding css files instead of less will ensure that every custom created filename will be
					// present in the output
					codeFiles: [
						'dist/**/*.css'
					]
				}
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
							},
							{
								pattern: /.*\@example.*/ig,
								replacement: ''
							},
							{
								pattern: /.*\@page.*/ig,
								replacement: ''
							},
							{
								pattern: /.*\@title.*/ig,
								replacement: ''
							},
							{
								pattern: /.*\@seeMore.*/ig,
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
				},
				licenseWearableCss: {
					files: files.css.getLicenseFiles("wearable")
				}
			},

			clean: {
				js: [ buildDir.mobile.js, buildDir.wearable.js, buildDir.tv.js ],
				theme: [ buildDir.mobile.theme, buildDir.wearable.theme, buildDir.tv.theme ],
				docs: {
					expand: true,
					src: ['docs/sdk', 'docs/js']
				},
				tmp: {
					expand: true,
					src: ['tmp']
				},
				guide: {
					expand: true,
					src: ['docs/guide/built', 'docs/guide/source/inline']
				}
			},

			qunit: {
				options: {
					'--web-security': 'no'
				}
			},

			"qunit-tap": {
			},

			"docs-html": {
				mobile: {
					profile: "mobile",
					template: "sdk",
					version: version,
					files: {
						src: ['dist/mobile/js/tau.js']
					}
				},
				wearable: {
					profile: "wearable",
					template: "sdk",
					version: version,
					files: {
						src: ['dist/wearable/js/tau.js']
					}
				},
				tv: {
					profile: "tv",
					template: "sdk",
					files: {
						src: ['dist/tv/js/tau.js']
					}
				},
				"mobile-dld": {
					profile: "mobile",
					template: "dld",
					version: version,
					files: {
						src: ['dist/mobile/js/tau.js']
					}
				},
				"wearable-dld": {
					profile: "wearable",
					template: "dld",
					version: version,
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

				css: {
					files : [ "src/css/profile/**/*.less", "src/css/profile/**/*.png" ],
					tasks : ["css"]
				}

			},

			debug: {
				options: {
					open: true
				}
			},

			performance: {

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
				"HTMLSelectElement", "HTMLInputElement", "CSSRule",
				'WebGLProgram', 'jQuery', 'DOMTokenList', "HTMLLinkElement",
				"HTMLScriptElement", "HTMLCanvasElement", "MouseEvent", "TouchEvent",
				"HTMLHeadElement", "HTMLInputElement", "HTMLButtonElement",
				"jQuery.Event",
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
			'--title=' + name.toUpperCase() + " - " + version,
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
									pragmas: {
										tauPerformance: true
									},
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
	grunt.registerTask("image", [ "copy:wearableDefaultImages", "copy:mobileDefaultImages", "copy:tvDefaultImages" ]);
	grunt.registerTask("image-changeable", [ "copy:wearableChangeableImages", "copy:wearableColorThemeImages", "copy:mobileChangeableImages" ]);
	grunt.registerTask("css", [ "clean:theme", "less", "themeConverter", "cssmin", "image", "image-changeable", "symlink" ]);
	grunt.registerTask("js", [ "clean:js", "requirejs", "jsmin", "themesjs", "copy:globalize-mobile", "copy:globalize-tv", "copy:mobileJquery" ]);
	grunt.registerTask("license", [ "concat:licenseJs", "concat:licenseDefaultCss", "concat:licenseChangeableCss", "concat:licenseWearableCss", "copy:license" ]);
	grunt.registerTask("sdk-docs", [ "docs-html:mobile", "docs-html:wearable", "docs-html:tv", "copy:sdk-docs" ]);
	grunt.registerTask("dld-docs", [ "docs-html:mobile-dld", "docs-html:wearable-dld"]);

	grunt.registerTask("build", ["clean", "lint", "css", "js", "license", "version"]);
	grunt.registerTask("release", [ "build", "test", "sdk-docs" ]);
	grunt.registerTask("default", [ "release" ]);
};
