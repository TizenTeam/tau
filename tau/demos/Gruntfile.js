var path = require("path");

module.exports = function (grunt) {
	var mediaType = grunt.option("media") || "circle",

		// Path to build framework
		wearableAppRoot = path.join("SDK/wearable/UIComponentsWorking/"),

		MEDIA_QUERY = {
			"ALL": "all",
			"CIRCLE": "all and (-tizen-geometric-shape: circle)"
		},
		themeConverterXMLPath = path.join("..", "tools", "grunt", "xml");

	grunt.initConfig({
		dom_munger: {
			circle: {
				options: {
					update: {selector: "link[href*='.circle.']", attribute: "media", value: MEDIA_QUERY.ALL}
				},
				src: path.join(wearableAppRoot, "**/*.html")
			},
			default: {
				options: {
					update: {selector: "link[href*='.circle.']", attribute: "media", value: MEDIA_QUERY.CIRCLE}
				},
				src: path.join(wearableAppRoot, "**/*.html")
			}
		},
		run: {
			build: {
				options: {
					cwd: "../"
				},
				cmd: "grunt",
				args: buildTAUArgs()
			},
			"build-mobile": {
				options: {
					cwd: "../"
				},
				cmd: "grunt",
				args: buildTAUArgs("mobile")
			},
			"build-wearable": {
				options: {
					cwd: "../"
				},
				cmd: "grunt",
				args: buildTAUArgs("wearable")
			}
		},
		"string-replace": {
			js: {
				files: [{
					expand: true,
					cwd: "SDK/wearable/UIComponents/",
					src: "**/*.html",
					dest: "SDK/wearable/UIComponentsWorking/"
				}],
				options: {
					replacements: [
						{
							pattern: /\<script src=\"(.*)lib\/tau\/wearable\/js\/tau.js\"><\/script>/gi,
							replacement: function (fullStr, path) {
								return "<script src=\"" + path + "../../../../libs/less.js\" type=\"text\/javascript\"></script>" +
								"<script type=\"text/javascript\" src=\"" + path +
									"../../../../libs/require.js\" data-main=\"" + path +
									"../../../../src/js/wearable.js\"></script>";
							}
						}
					]
				}
			},
			less: {
				files: [{
					expand: true,
					cwd: "SDK/wearable/UIComponentsWorking/",
					src: "**/*.html",
					dest: "SDK/wearable/UIComponentsWorking/"
				}],
				options: {
					replacements: [
						{
							pattern: /\<link rel=\"stylesheet\" href=\"(.*)lib\/tau\/wearable\/theme\/default\/tau.css\">/gi,
							replacement: function (fullStr, path) {
								return "<link rel=\"stylesheet\/less\" type=\"text\/css\" href=\"" + path +
									"../../../../src/css/profile/wearable/changeable/theme-changeable/theme.less\" />";
							}
						},
						{
							pattern: /\<link rel=\"stylesheet\" media=\".*\" href=\"(.*)lib\/tau\/wearable\/theme\/default\/tau.circle.css\"\>/gi,
							replacement: function (fullStr, path) {
								return "<link rel=\"stylesheet\/less\" type=\"text\/css\" href=\"" + path +
									"../../../../src/css/profile/wearable/changeable/theme-changeable/theme.circle.less\" /><script src=\"" + path +
									"../../../../libs/less.js\" type=\"text\/javascript\"><\/script>";
							}
						}
					]
				}
			}
		},
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: "SDK/wearable/UIComponents/",
					src: "**/*",
					dest: "SDK/wearable/UIComponentsWorking/"
				}]
			}
		},
		themeConverter: {
			wearable: {
				createColorMapFile: false,
				options: {
					index: "0",
					style: "Dark",
					inputColorTableXML: path.join(themeConverterXMLPath, "wearable", "blue", "InputColorTable.xml"),
					changeableColorTableXML: path.join(themeConverterXMLPath, "wearable", "blue", "ChangeableColorTable1.xml")
				},
				files: [
					{
						src: "../src/css/profile/wearable/changeable/theme-changeable/theme.color.less",
						dest: "../src/css/profile/wearable/changeable/theme-changeable/theme.color.converted.less"
					},
					{
						src: "../src/css/profile/wearable/changeable/theme-circle/theme.changeable.less",
						dest: "../src/css/profile/wearable/changeable/theme-circle/theme.changeable.converted.less"
					}
				]
			}
		}
	});
	//

	function buildTAUArgs(profile) {
		var result = [profile ? "build-" + profile : "build"];

		if (grunt.option("tau-debug")) {
			result.push("--tau-debug");
		}
		return result
	}

	// npm tasks
	grunt.loadNpmTasks("grunt-dom-munger");
	grunt.loadNpmTasks("grunt-string-replace");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-run");

	// Task list
	grunt.registerTask("dev", ["dom_munger:" + mediaType]);
	grunt.registerTask("release", ["dom_munger:default"]);

	grunt.registerTask("prepare-working", ["copy:main", "string-replace:js", "string-replace:less", "dom_munger:circle",
		"themeConverter:wearable"]);

	grunt.loadTasks("tools/app/tasks");

	grunt.registerTask("default", ["release"]);
};
