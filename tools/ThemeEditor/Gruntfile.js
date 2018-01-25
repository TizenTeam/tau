module.exports = function (grunt) {
	"use strict";

	var jsConcatFiles = {},
		initConfig = {
			pkg: grunt.file.readJSON("package.json"),

			clean: {
				dist: ["dist/*"],
				"dist-non-min": ["dist/js/*.js", "!dist/js/*.min.js"],
				res: ["src/res/*", "!src/res/*.less"]
			},
			copy: {
				main: {
					cwd: "src/",
					expand: true,
					src: ["./**/*", "!./js/**", "!./less/**", "!./banner.txt"],
					dest: "dist/"
				},
				jslibs: {
					src: "dist/js/libs.js",
					dest: "dist/js/libs.min.js"
				},
				res: {
					cwd: "../../tau/src/css/profile",
					expand: true,
					src: ["./**/*", "!./wearable/default/**", "!./wearable/changeable/theme-black/**", "!./mobile/default/**"],
					dest: "src/res/less"
				},
				colormaps: {
					cwd: "../../tau/dist/",
					expand: true,
					flatten: true,
					src: ["./**/colormap.json"],
					dest: "dist/"
				}
			},

			jslint: {
				js: {
					src: ["src/js/**/*.js"],
					directives: {
						browser: true,
						white: true,
						todo: true,
						plusplus: true,
						predef: ["window", "document"]
					}
				},
				dist: {
					src: ["dist/js/*.js"],
					exclude: ["dist/js/libs.js"],
					directives: {
						browser: true,
						white: true,
						todo: true,
						plusplus: true,
						predef: ["window", "document"]
					}
				}
			},

			concat: {
				js: {}, // This property is changed by string-replace:js task
				jslibs: {} // This property is changed by string-replace:js task
			},

			uglify: {
				"dist-js": {
					options: {
						stripBanners: true,
						banner: grunt.file.read("src/banner.txt")
					},
					files: {
						"dist/js/themeEditor.min.js": "dist/js/themeEditor.js"
					}
				}
			},

			less : {
				main: {
					options: {
						compress: true,
						cleancss: true
					},
					files: {
						"dist/css/themeEditor.css": "src/less/layout/themeEditor.less"
					}
				}
			},

			"string-replace": {
				js: {
					options: {
						replacements: [
							{
								pattern: /<!--\s+@concatJS\s(.*)\s+-->\s*[\n\r]+(\s+<script [a-z"=\/\. ]+><\/script>)*\s*[\n\r]+\s*<!-- @concatJS-end -->/img,
								replacement: function (foundString, fileName) {
									var jsSrc = /src\s*=\s*['"]?([a-z0-9\/\.\-]+)['"]?/img,
										matches = foundString.match(jsSrc),
										dest = 'dist/' + fileName,
										concatConfig,
										tmp,
										i,
										l;

									if (!jsConcatFiles[dest]) {
										jsConcatFiles[dest] = [];
									}

									for (i = 0, l = matches.length; i < l; ++i) {
										tmp = jsSrc.exec(foundString);
										if (tmp) {
											grunt.log.writeln(dest + ': ' + 'src/' + tmp[1]);
											jsConcatFiles[dest].push('src/' + tmp[1]);
										}
									}

									// Rewrite config
									concatConfig = grunt.config.get('concat');
									concatConfig.js.files = jsConcatFiles;
									grunt.config.set('concat', concatConfig);

									return '<script src="' + fileName.replace(/\.js$/i, '.min.js') + '"></script>';
								}
							},
							{
								pattern: /<!--\s+@concatJSLibs\s(.*)\s+-->\s*[\n\r]+(\s+<script [a-z0-9"=\/\.\- ]+><\/script>)*\s*[\n\r]+\s*<!-- @concatJSLibs-end -->/img,
								replacement: function (foundString, fileName) {
									var jsSrc = /src\s*=\s*['"]?([a-z0-9\/\.\-]+)['"]?/img,
										matches = foundString.match(jsSrc),
										dest = 'dist/' + fileName,
										concatConfig,
										tmp,
										i,
										l;

									if (!jsConcatFiles[dest]) {
										jsConcatFiles[dest] = [];
									}

									for (i = 0, l = matches.length; i < l; ++i) {
										tmp = jsSrc.exec(foundString);
										if (tmp) {
											grunt.log.writeln(dest + ': ' + 'src/' + tmp[1]);
											jsConcatFiles[dest].push('src/' + tmp[1]);
										}
									}

									// Rewrite config
									concatConfig = grunt.config.get('concat');
									concatConfig.jslibs.files = jsConcatFiles;
									grunt.config.set('concat', concatConfig);

									return '<script src="' + fileName.replace(/\.js$/i, '.min.js') + '"></script>';
								}
							}
						]
					},
					files: {
						"dist/index.html": "src/index.html"
					}
				},
				less: {
					options: {
						replacements: [
							{
								pattern: /<!-- @lessCSS -->\s*[\n\r]+(.*)*\s*[\n\r]+\s*<!-- @lessCSS-end -->/img,
								replacement: function (a) {
									return '<link rel="stylesheet" href="css/themeEditor.css" type="text/css" title="themeEditor">';
								}
							},
							{
								pattern: /<!-- @lessJS -->\s*[\n\r]+(.*)*\s*[\n\r]+\s*<!-- @lessJS-end -->/img,
								replacement: function (a) {
									return '';
								}
							},
						]
					},
					files: {
						"dist/index.html": "dist/index.html"
					}
				},
				"dist-title": {
					options: {
						replacements: [{
							pattern: /<title>([^<]*)<\/title>/ig,
							replacement: "<title>$1 - v. <%= pkg.version %></title>"
						}
						]
					},
					files: {
						"dist/index.html": "dist/index.html"
					}
				},
				fixpath: {
					options: {
						replacements: [
							{
								pattern: /..\/..\//ig,
								replacement: "../"
							}
						]
					},
					files: {
						"dist/css/themeEditor.css": "dist/css/themeEditor.css"
					}
				}
			},
			"create-config": {
				wearable: {
					cwd: "src/res/less/wearable/",
					themes: [
						{
							path: "changeable/theme-changeable/",
							name: "default",
							colormap: true
						},{
							path: "changeable/theme-blue/",
							name: "blue",
							colormap: true
						},{
							path: "changeable/theme-brown/",
							name: "brown",
							colormap: true
						}
					]
				},
				mobile: {
					cwd: "src/res/less/mobile/",
					themes: [
						{
							path: "changeable/theme-changeable/",
							name: "default",
							colormap: true
						}
					]
				},
				tv: {
					cwd: "src/res/less/tv/",
					themes: [
						{
							path: "default/theme-black/",
							name: "black"
						}
					]
				}
			},
			"less-res-fix": {
				wearable: {
					themes: [
						{
							name: "default",
							src: "changeable/theme-changeable/",
							dest: "changeable/theme-changeable/"
						},
						{
							name: "blue",
							src: "changeable/theme-changeable/",
							dest: "changeable/theme-blue/"
						},
						{
							name: "brown",
							src: "changeable/theme-changeable/",
							dest: "changeable/theme-brown/"
						}
					]
				},
				mobile: {
					themes: [
						{
							name: "default",
							src: "changeable/theme-changeable/",
							dest: "changeable/theme-changeable/"
						}
					]
				}
			}
		};
	grunt.initConfig(initConfig);


	// npm tasks
	grunt.loadNpmTasks("grunt-jslint");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-string-replace");

	// Load framework custom tasks
	grunt.loadTasks('grunt/tasks');

	// Task list
	grunt.registerTask("prepare-less", ["clean:res", "copy:res", "less-res-fix", "create-config"]);
	grunt.registerTask("js", ["prepare-less", "jslint:js", "string-replace:js", "concat", "jslint:dist", "uglify:dist-js", "copy:jslibs"]);
	grunt.registerTask("lessjs", ["less", "string-replace:less", "string-replace:fixpath"]);
	grunt.registerTask("build", ["clean:dist", "copy:main", "js", "clean:dist-non-min", "lessjs", "string-replace:dist-title"]);
	grunt.registerTask("default", ["build"]);
};
