module.exports = function(grunt) {
	"use strict";

	var path = require("path"),
		mediaType = grunt.option("media") || "circle",

		// Path to build framework
		basePath = "SDK",
		wearableAppRoot = path.join(basePath, "wearable"),

		MEDIA_QUERY = {
			"ALL": "all",
			"CIRCLE": "all and (-tizen-geometric-shape: circle)"
		};

		grunt.initConfig({
			dom_munger: {
				circle: {
					options: {
						update: {selector:"link[href*='.circle.']",attribute:"media", value:MEDIA_QUERY.ALL}
					},
					src: path.join(wearableAppRoot, "*/index.html")
				},
				default: {
					options: {
						update: {selector:"link[href*='.circle.']",attribute:"media", value:MEDIA_QUERY.CIRCLE}
					},
					src: path.join(wearableAppRoot, "*/index.html")
				}
			}
		});

	// npm tasks
	grunt.loadNpmTasks("grunt-dom-munger");

	// Task list
	grunt.registerTask("dev", ["dom_munger:"+mediaType]);
	grunt.registerTask("release", [ "dom_munger:default" ]);
	grunt.registerTask("default", [ "release" ]);
};