/*global module, require, process*/
/*eslint camelcase: 0 */
/**
 * Tasks manager for TAU
 *
 * @author  Maciej Urbanski <m.urbanski@samsung.com>
 * @author  Hyunkook, Cho <hk0713.cho@samsung.com>
 * @author  Hyeoncheol Choi <hc7.choi@samsung.com>
 * @author  Piotr Karny <p.karny@samsung.com>
 * @author  Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author  Tomasz Lukawski <t.lukawski@samsung.com>
 * @author  Junyoung Park <jy-.park@samsung.com>
 * @author  Maciej Moczulski <m.moczulski@samsung.com>
 * @author  Sergiusz Struminski <s.struminski@samsung.com>
 * @author  Heeju Joo <heeju.joo@samsung.com>
 * @author  Michał Szepielak <m.szepielak@samsung.com>
 * @author  Youmin Ha <youmin.ha@samsung.com>
 * @author  Hosup Choi <hosup83.choi@samsung.com>
 * @author  jihoon.o <jihoon.o@samsung.com>
 */
var path = require("path"),
	async = require("async");

module.exports = function (grunt) {
	"use strict";

	var pkg = grunt.file.readJSON("package.json"),
		themes = grunt.file.readJSON("themes.json"),
		name = pkg.name,
		version = pkg.version,
		themeVersion = ["default", "changeable"],

		// Path to build framework
		dist = "dist",
		src = "src",

		// Rules for jsdoc check
		jsdocRules = {
			"jsdoc/check-param-names": 1,
			"jsdoc/check-tag-names": 1,
			"jsdoc/check-types": 1,
			"jsdoc/newline-after-description": 0,
			"jsdoc/require-description-complete-sentence": 0,
			"jsdoc/require-hyphen-before-param-description": 0,
			"jsdoc/require-param": 1,
			// @TODO temporary remove, too many errors, good named parem not required description
			"jsdoc/require-param-description": 0,
			"jsdoc/require-param-type": 1,
			"jsdoc/require-returns-description": 1,
			"jsdoc/require-returns-type": 1
		},

		// Path to framework JS sources
		srcJs = path.join(src, "js"),
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
			}
		},
		themeConverterXMLPath = path.join("tools", "grunt", "xml"),

		rootNamespace = name,
		config = rootNamespace + "Config",
		fileName = name,

		wrapStart = "(function(window, document, undefined) {\n" +
			"'use strict';\n" +
			"var ns = window." + rootNamespace + " = window." + rootNamespace + " || {},\n" +
			"nsConfig = window." + config + " = window." + config + " || {};\n" +
			"nsConfig.rootNamespace = '" + rootNamespace + "';\n" +
			"nsConfig.fileName = '" + fileName + "';\n" +
			"ns.version = '" + version + "';\n",

		wrapEnd = "}(window, window.document));\n",

		files = {
			js: {
				minifiedFiles: [],
				setMinifiedFiles: function () {
					files.js.minifiedFiles.length = 0;
					grunt.file.recurse(buildRoot, function (abspath/*, rootdir, subdir, filename */) {
						if (/.js$/.test(abspath) && !/.min.js$/.test(abspath)) {
							files.js.minifiedFiles.push({
								src: abspath,
								dest: abspath.replace(".js", ".min.js")
							});
						}
					});
				},

				getLicenseFiles: function () {
					var exts = [".min.js", ".js"],
						licenseFiles = [],
						device,
						src,
						pushLicenseFile = function (ext) {
							src = path.join(buildDir[device].js, name) + ext;
							licenseFiles.push({
								src: [path.join("license", "Flora") + ".txt", src],
								dest: src
							});
						};

					for (device in buildDir) {
						if (buildDir.hasOwnProperty(device)) {
							exts.forEach(pushLicenseFile);
						}
					}

					return licenseFiles;
				}
			},

			css: {
				getDefault: function (device) {
					var list = themes.device[device],
						i = 0,
						len = list.length,
						theme;

					for (; i < len; i++) {
						theme = list[i];
						if (theme["default"] === "true") {
							return {
								src: path.join(buildRoot, device, "theme", theme.name),
								dest: path.join(buildRoot, device, "theme", "default")
							};
						}
					}
				},

				getLicenseFiles: function (version) {
					var exts = [".css", ".min.css"],
						wearableThemeColors = ["blue", "brown"],
						licenseFiles = [],
						i = 1,
						device,
						list,
						len,
						theme,
						src,
						pushChangableFiles = function (ext) {
							src = path.join(buildDir[device].theme, version, name) + ext;
							licenseFiles.push({
								src: [path.join("license", "Flora") + ".txt", src],
								dest: src
							});
						},
						pushNonChangableFiles = function (ext) {
							src = path.join(buildDir[device].theme, theme.name, name) + ext;
							licenseFiles.push({
								src: [path.join("license", "Flora") + ".txt", src],
								dest: src
							});
						},
						pushWearableFiles = function (ext) {
							len = wearableThemeColors.length;
							for (i = 0; i < len; i++) {
								src = path.join(buildDir[version].theme, wearableThemeColors[i], name) + ext;
								licenseFiles.push({
									src: [path.join("license", "Flora") + ".txt", src],
									dest: src
								});
							}
						};

					for (device in buildDir) {
						if (buildDir.hasOwnProperty(device)) {
							list = themes.device[device];
							len = list.length;

							if (version === "changeable") {
								theme = list[0];
								exts.forEach(pushChangableFiles);
							} else {
								for (; i < len; i++) {
									theme = list[i];
									exts.forEach(pushNonChangableFiles);
								}
							}
						}
					}
					if (version === "wearable") {
						theme = themes.device[version];
						exts.forEach(pushWearableFiles);
					}

					return licenseFiles;
				}
			},

			image: {
				getImageFiles: function (device, version) {
					var rtn = [],
						list = themes.device[device],
						versionPath = version ? version + "-path" : "default-path",
						wearableThemeColors = ["blue", "brown"],
						i = 0,
						len = list.length,
						theme;

					if (version === "changeable") {
						theme = list[0];
						rtn.push({
							expand: true,
							cwd: path.join(srcCss, theme[versionPath], theme.images),
							src: "**",
							dest: path.join(buildRoot, device, "theme", version, theme.images)
						});
					} else {
						for (; i < len; i++) {
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
								cwd: path.join(srcCss, version, "changeable", "theme-changeable", theme.images),
								src: "**",
								dest: path.join(buildRoot, device, "theme", wearableThemeColors[i], theme.images)
							});
						}
					}

					return rtn;
				}
			}
		},

		initConfig = {
			version: version,

			eslint: {
				js: {
					options: {
						jshintrc: ".eslintrc",
						rules: {
							camelcase: "off"
						}
					},
					files: {
						src: [path.join(srcJs, "**/*.js"), "Gruntfile.js", "tools/grunt/tasks/**/*.js", "demos/SDK/**/*.js", "!demos/SDK/**/lib/**/*.js", "demos/SDK/**/*.html", "demos/SDK/**/*.htm"]
					}
				},
				"js-ci": {
					options: {
						jshintrc: ".eslintrc",
						format: "junit",
						outputFile: "report/eslint/junit-output.xml"
					},
					files: {
						src: [path.join(srcJs, "**/*.js"), "Gruntfile.js", "tools/grunt/tasks/**/*.js", "demos/SDK/**/*.js", "!demos/SDK/**/lib/**/*.js", "demos/SDK/**/*.html", "demos/SDK/**/*.htm"]
					}
				},
				single: {
					options: {
						jshintrc: ".eslintrc",
						format: "junit",
						reporterOutput: "report/eslint/junit-" + grunt.option("jshintno") + ".xml"
					},
					src: grunt.option("jshintfile")
				},
				jsdoc: {
					options: {
						plugins: ["jsdoc"],
						rules: jsdocRules
					},
					files: {
						src: [path.join(srcJs, "**/*.js")]
					}
				},
				"jsdoc-ci": {
					options: {
						plugins: ["jsdoc"],
						rules: jsdocRules,
						format: "junit",
						outputFile: "report/eslint/junit-output-doc.xml"
					},
					files: {
						src: [path.join(srcJs, "**/*.js")]
					}
				}
			},

			lesslint: {
				less: {
					options: {},
					files: {
						src: ["src/css/**/*.less"]
					}
				},
				"less-ci": {
					options: {
						csslint: {
							"adjoining-classes": true
						},
						formatters: [
							{
								id: "junit-xml",
								dest: "report/lesslint.xml"
							}
						]
					},
					files: {
						src: ["src/css/**/*.less"]
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
						out: path.join(buildDir.wearable.js, name) + ".js",
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
						out: path.join(buildDir.mobile.js, name) + ".js",
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

				mobile_support: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: false,
						removeCombined: true,
						skipModuleInsertion: true,
						name: "mobile.support-2.3",
						exclude: [
							"mobile"
						],
						out: path.join(buildDir.mobile.js, name + ".support-2.3") + ".js",
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

				unit_test: {
					options: {
						baseUrl: srcJs,
						optimize: "none",
						findNestedDependencies: true,
						skipModuleInsertion: true,
						out: path.join(buildRoot, "unit", "tau.js"),
						include: [
							"core/event"
						],
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

			less: {
				wearable: {
					files: [
						{
							src: path.join(srcCss, "wearable", "changeable", "theme-changeable", "theme.less"),
							dest: path.join(buildRoot, "wearable", "theme", "changeable", "tau.template")
						},
						{
							src: path.join(srcCss, "wearable", "changeable", "theme-changeable", "theme.circle.less"),
							dest: path.join(buildRoot, "wearable", "theme", "changeable", "tau.circle.template")
						}
					]
				},
				mobile: {
					files: [
						{
							src: path.join(srcCss, "mobile", "changeable", "theme-changeable", "theme.less"),
							dest: path.join(buildRoot, "mobile", "theme", "changeable", "tau.template")
						}
					]
				},
				mobile_support: {
					files: [
						{
							src: path.join(srcCss, "mobile", "changeable", "theme-changeable", "theme.less"),
							dest: path.join(buildRoot, "mobile", "theme", "changeable", "tau.template")
						},
						{
							src: path.join("src", "css", "support", "mobile", "changeable", "theme-changeable", "theme.support-2.3.less"),
							dest: path.join(buildRoot, "mobile", "theme", "changeable", "tau.support-2.3.template")
						}
					]
				}
			},

			themeConverter: {
				mobile: {
					createColorMapFile: grunt.option("generate-colormap") || false,
					options: {
						index: "0",
						style: "Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "mobile", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "mobile", "ChangeableColorTable1.xml")
					},
					files: [
						{
							src: path.join(buildDir.mobile.theme, "changeable", "tau.template"),
							dest: path.join(buildDir.mobile.theme, "changeable", "tau.css")
						}
					]
				},
				mobile_support: {
					createColorMapFile: grunt.option("generate-colormap") || false,
					options: {
						index: "0",
						style: "Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "mobile", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "mobile", "ChangeableColorTable1.xml")
					},
					files: [
						{
							src: path.join(buildDir.mobile.theme, "changeable", "tau.template"),
							dest: path.join(buildDir.mobile.theme, "changeable", "tau.css")
						},
						{
							src: path.join(buildDir.mobile.theme, "changeable", "tau.support-2.3.template"),
							dest: path.join(buildDir.mobile.theme, "changeable", "tau.support-2.3.css")
						}
					]
				},
				wearable: {
					createColorMapFile: grunt.option("generate-colormap") || false,
					options: {
						index: "0",
						style: "Dark",
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
						}
					]
				},
				wearable_circle: {
					options: {
						index: "0",
						style: "Dark",
						inputColorTableXML: path.join(themeConverterXMLPath, "wearable", "circle", "InputColorTable.xml"),
						changeableColorTableXML: path.join(themeConverterXMLPath, "wearable", "circle", "ChangeableColorTable1.xml")
					},
					src: path.join(buildDir.wearable.theme, "changeable", "tau.circle.template"),
					dest: path.join(buildDir.wearable.theme, "changeable", "tau.circle.css")
				},
				wearable_old: {
					options: {
						index: "0",
						style: "Dark",
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
							var folder = src.substring(0, src.lastIndexOf("/")),
								filename = src.substring(src.lastIndexOf("/"), src.length);

							filename = filename.substring(0, filename.lastIndexOf("."));
							return dest + "/" + folder + filename + ".min.css";
						}
					}]
				},

				changeable: {
					expand: true,
					cwd: buildRoot,
					src: ["**/*.template"],
					dest: buildRoot,
					rename: function (dest, src) {
						var folder = src.substring(0, src.lastIndexOf("/")),
							filename = src.substring(src.lastIndexOf("/"), src.length);

						filename = filename.substring(0, filename.lastIndexOf("."));
						return dest + "/" + folder + filename + ".min.template";
					}
				}
			},

			copy: {
				wearableChangeableImages: {
					files: files.image.getImageFiles("wearable", "changeable")
				},

				wearableColorThemeImages: {
					files: files.image.getImageFiles("wearable", "wearable")
				},

				mobileChangeableImages: {
					files: files.image.getImageFiles("mobile", "changeable")
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
					dest: path.join(dist, "LICENSE") + ".Flora"
				},

				animation: {
					files: [
						{
							expand: true,
							cwd: "libs/animation/",
							src: "**",
							dest: path.join(dist, "animation/")
						}
					]
				},

				"sdk-docs": {
					files: [
						{
							expand: true,
							cwd: "tools/grunt/tasks/templates/files",
							src: "**/*",
							dest: "docs/sdk/mobile/html"
						},
						{
							expand: true,
							cwd: "tools/grunt/tasks/templates/files",
							src: "**/*",
							dest: "docs/sdk/wearable/html"
						}
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

				wearableDefaultTheme: files.css.getDefault("wearable", "default"),

				mobileDefaultTheme: files.css.getDefault("mobile", "default")
			},

			"developer-guide-extract": {
				core: {
					files: [{
						src: ["src/js/core/**/*.js"],
						dest: "docs/guide/source/inline/core/",
						// Part of the path removed in destination
						destBase: "src/js/core/"
					}]
				},
				wearable: {
					files: [{
						src: ["src/js/profile/wearable/**/*.js"],
						dest: "docs/guide/source/inline/wearable/",
						// Part of the path removed in destination
						destBase: "src/js/profile/wearable/"
					}]
				},
				mobile: {
					files: [{
						src: "src/js/profile/mobile/**/*.js",
						dest: "docs/guide/source/inline/mobile/",
						// Part of the path removed in destination
						destBase: "src/js/profile/mobile/"
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
					resourcesPath: "src/css",
					imageFiles: [
						"src/css/**/*.png",
						"src/css/**/*.jpg",
						"src/css/**/*.jpeg"
					],
					// Finding css files instead of less will ensure that every custom created filename will be
					// present in the output
					codeFiles: [
						"dist/**/*.css"
					]
				}
			},

			"string-replace": {
				jsduck: {
					files: {
						"tmp/jsduck/": "dist/**/tau.js"
					},
					options: {
						replacements: [
							{
								pattern: /.*\@namespace.*/gi,
								replacement: ""
							},
							{
								pattern: /.*\@instance.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@expose.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@internal.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@example.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@page.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@title.*/ig,
								replacement: ""
							},
							{
								pattern: /.*\@seeMore.*/ig,
								replacement: ""
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
				js: [buildDir.mobile.js, buildDir.wearable.js, "dist/animation/*"],
				theme: [buildDir.mobile.theme, buildDir.wearable.theme],
				docs: {
					expand: true,
					src: ["docs/sdk", "docs/js"]
				},
				tmp: {
					expand: true,
					src: ["tmp"]
				},
				guide: {
					expand: true,
					src: ["docs/guide/built", "docs/guide/source/inline"]
				},
				test: {
					expand: true,
					src: ["report", "temp"]
				}
			},

			qunit: {
				options: {
					"--web-security": "no"
				},
				"unit-docs": [
					"tests/docs/unit/all.html"
				]
			},

			qunit_junit: {
				options: {
					fileNamer: function (url) {
						return url.replace(/\.html(.*)$/, "");
					}
				}
			},

			"qunit-tap": {},

			"docs-html": {
				mobile: {
					profile: "mobile",
					template: "sdk",
					version: version,
					files: {
						src: ["dist/mobile/js/tau.js"]
					}
				},
				wearable: {
					profile: "wearable",
					template: "sdk",
					version: version,
					files: {
						src: ["dist/wearable/js/tau.js"]
					}
				},
				"mobile-dld": {
					profile: "mobile",
					template: "dld",
					version: version,
					files: {
						src: ["dist/mobile/js/tau.js"]
					}
				},
				"wearable-dld": {
					profile: "wearable",
					template: "dld",
					version: version,
					files: {
						src: ["dist/wearable/js/tau.js"]
					}
				},
				unit: {
					profile: "core",
					template: "sdk",
					version: version,
					failOnError: true,
					files: {
						src: ["dist/unit/tau.js"]
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
					files: ["src/js/**/*.js"],
					tasks: ["requirejs"]
				},

				css: {
					files: ["src/css/**/*.less", "src/css/**/*.png"],
					tasks: ["css"]
				}

			},

			debug: {
				options: {
					open: true
				}
			},

			performance: {}
		};

	grunt.initConfig(initConfig);

	grunt.registerTask("version", "create version files.", function () {
		grunt.file.write(path.join(dist, "VERSION"), pkg.version + "\n");
	});

	grunt.registerTask("findFiles", "initialize target files.", function (name) {
		var obj = files;

		name = name.split(".");
		name.forEach(function (key) {
			obj = obj[key];
		});
		obj();
	});

	grunt.registerTask("jsduck", ["clean:tmp", "clean:docs", "string-replace:jsduck", "jsduckDocumentation"]);

	function runJSDuck(profile, callback) {
		var cmd = "jsduck",
			src = [path.join("tmp", "jsduck", "dist", profile, "js")],
			dest = path.join("docs", "jsduck", profile),
			args,
			environmentClasses = ["DocumentFragment", "CustomEvent",
				"HTMLUListElement", "HTMLOListElement", "HTMLCollection",
				"HTMLBaseElement", "HTMLImageElement", "WebGLRenderingContext",
				"HTMLSelectElement", "HTMLInputElement", "CSSRule",
				"WebGLProgram", "jQuery", "DOMTokenList", "HTMLLinkElement",
				"HTMLScriptElement", "HTMLCanvasElement", "MouseEvent", "TouchEvent",
				"HTMLHeadElement", "HTMLInputElement", "HTMLButtonElement",
				"jQuery.Event",
				"mat2", "mat3", "mat4", "vec2", "vec3", "vec4", "quat4"],
			jsduck;

		if (!grunt.file.exists("docs")) {
			grunt.file.mkdir("docs");
		}
		if (!grunt.file.exists(path.join("docs", "jsduck"))) {
			grunt.file.mkdir(path.join("docs", "jsduck"));
		}
		if (!grunt.file.exists(path.join("docs", "jsduck", profile))) {
			grunt.file.mkdir(path.join("docs", "jsduck", profile));
		}

		args = src.concat([
			"--title=" + name.toUpperCase() + " - " + version,
			"--eg-iframe=./tools/jsduck/" + profile + "-preview.html",
			"--external=" + environmentClasses.join(","),
			"--output", dest
		]);

		grunt.verbose.writeflags(args, "Arguments");

		jsduck = grunt.util.spawn({
			cmd: cmd,
			args: args
		}, function (error, result, code) {
			grunt.file.delete(path.join("tmp", "jsduck", "dist", profile, "js"), {force: true});
			if (code === 127) {   // "command not found"
				return grunt.warn(
					"You need to have Ruby and JSDuck installed and in your PATH for " +
					"this task to work. " +
					"See https://github.com/dpashkevich/grunt-jsduck for details."
				);
			}
			callback(error);
		});

		jsduck.stdout.pipe(process.stdout);
		jsduck.stderr.pipe(process.stderr);
	}

	grunt.registerTask("jsduckDocumentation", "Compile JSDuck documentation", function () {
		var done = this.async();

		async.series([
			runJSDuck.bind(null, "mobile"),
			runJSDuck.bind(null, "wearable")
		], done);
	});

	// add requirejs tasks to build themes.
	(function () {

		var requirejs = initConfig.requirejs,
			profileName,
			source,
			themeName;

		function defineRequireForTheme(theme) {
			var ver;

			for (ver in themeVersion) {
				if (themeVersion.hasOwnProperty(ver)) {
					if (themeVersion[ver] === "changeable") {
						theme = themes["device"][profileName][0];
						themeName = "changeable";
					} else {
						themeName = theme.name;
					}

					source = path.join("..", "css", "profile", profileName, themeVersion[ver], "theme-" + theme.name, "theme");
					if (grunt.file.exists(path.join(srcJs, source + ".js"))) {
						requirejs["themejs_" + profileName + "_" + themeVersion[ver] + "_" + theme.name] = {
							options: {
								baseUrl: srcJs,
								optimize: "none",
								skipModuleInsertion: true,
								exclude: [profileName],
								name: path.join("..", "css", "profile", profileName, themeVersion[ver], "theme-" + theme.name, "theme"),
								out: path.join(buildDir[profileName].theme, themeName, "theme") + ".js",
								pragmas: {
									tauPerformance: true
								},
								pragmasOnSave: {
									tauBuildExclude: true,
									tauDebug: true
								},
								wrap: {
									start: "(function (ns) {",
									end: "}(tau));"
								}
							}
						};
					}
				}
			}
		}

		for (profileName in themes["device"]) {
			if (themes["device"].hasOwnProperty(profileName)) {
				themes["device"][profileName].forEach(defineRequireForTheme);
			}
		}
	})();

	function themesjs(profile) {
		var task;

		profile = profile || "";

		for (task in initConfig.requirejs) {
			if (initConfig.requirejs.hasOwnProperty(task) && task.indexOf("themejs_" + profile) !== -1) {
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
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-lesslint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-string-replace");
	grunt.loadNpmTasks("grunt-contrib-symlink");
	grunt.loadNpmTasks("grunt-debug-task");

	// Load framework custom tasks
	grunt.loadTasks("tools/grunt/tasks");

	// Task list
	grunt.registerTask("themesjs", "Generate themes files using requirejs", themesjs);  // Generate separate themes files
	grunt.registerTask("lint", "Validate code", ["eslint:js"/*, "eslint:jsdoc" jsdoc issues are reported only into CI process, enable this task after fix all jsdoc issues*/]);
	grunt.registerTask("jsmin", "Minify JS files", ["findFiles:js.setMinifiedFiles", "uglify"]);
	grunt.registerTask("image-changeable", ["copy:wearableChangeableImages", "copy:wearableColorThemeImages", "copy:mobileChangeableImages"]);
	grunt.registerTask("css", "Prepare full CSS for whole project", ["clean:theme", "less", "themeConverter", "cssmin", "image-changeable", "symlink"]);
	grunt.registerTask("css-mobile", "Prepare CSS for mobile profile", ["clean:theme", "less:mobile", "themeConverter:mobile", "cssmin", "copy:mobileChangeableImages", "symlink:mobileDefaultTheme"]);
	grunt.registerTask("css-mobile_support", "Prepare CSS for mobile 2.3 version", ["clean:theme", "less:mobile_support", "themeConverter:mobile_support", "cssmin", "copy:mobileChangeableImages", "symlink:mobileDefaultTheme"]);
	grunt.registerTask("css-wearable", "Prepare CSS for wearable", ["clean:theme", "less:wearable", "themeConverter:wearable", "cssmin", "copy:wearableChangeableImages", "copy:wearableColorThemeImages", "symlink:wearableDefaultTheme"]);
	grunt.registerTask("js", "Prepare JS", ["clean:js", "requirejs:mobile", "requirejs:wearable", "requirejs:mobile_support", "jsmin", "themesjs", "copy:mobileJquery", "copy:animation"]);
	grunt.registerTask("js-mobile", "Prepare JS for mobile", ["clean:js", "requirejs:mobile", "jsmin", "themesjs:mobile", "copy:mobileJquery"]);
	grunt.registerTask("js-mobile_support", "Prepare JS for mobile 2.3", ["clean:js", "requirejs:mobile", "requirejs:mobile_support", "jsmin", "themesjs:mobile", "copy:mobileJquery"]);
	grunt.registerTask("js-wearable", "Prepare JS wearable", ["clean:js", "requirejs:wearable", "jsmin", "themesjs:wearable"]);
	grunt.registerTask("license", "Add licence information to files", ["concat:licenseJs", "concat:licenseDefaultCss", "concat:licenseChangeableCss", "concat:licenseWearableCss", "copy:license"]);
	grunt.registerTask("sdk-docs", "Prepare SDK documentation", ["docs-html:mobile", "docs-html:wearable", "copy:sdk-docs"]);

	grunt.registerTask("build", "Build whole project", ["lint", "css", "globalize", "js", "license", "version"]);
	grunt.registerTask("build-mobile", "Build mobile project", ["css-mobile", "js-mobile", "license", "version"]);
	grunt.registerTask("build-mobile_support", "Build mobile project for 2.3", ["css-mobile_support", "js-mobile_support", "license", "version"]);
	grunt.registerTask("build-wearable", "Build wearable project", ["css-wearable", "js-wearable", "license", "version"]);
	grunt.registerTask("release", "Build, est and prepare docs", ["build", "test:mobile", "test:mobile_support", "test:jqm", "test:jqm14ok", "test:wearable", "sdk-docs"]);
	grunt.registerTask("default", "-> release", ["release"]);
	grunt.registerTask("ci-wearable", "Wearable tests for CI", ["clean:test", "test:wearable"]);
	grunt.registerTask("ci-mobile", "Mobile tests for CI", ["clean:test", "test:mobile", "test:mobile_support"]);
	grunt.registerTask("ci", "Code style validation for CI", ["eslint:js-ci", "lesslint:less-ci", "eslint:jsdoc-ci"]);
};
