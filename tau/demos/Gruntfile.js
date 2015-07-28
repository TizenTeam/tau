module.exports = function(grunt) {
	"use strict";

	var path = require("path"),
		fs = require("fs"),
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
			},
			run: {
				build: {
					options: {
						cwd: "../"
					},
					cmd: "grunt",
					args: buildTAUArgs()
				}
			}
		});

	function buildTAUArgs() {
		var result = ["build"];
		if (grunt.option("tau-debug")) {
			result.push("--tau-debug");
		}
		return result
	}

	// npm tasks
	grunt.loadNpmTasks("grunt-dom-munger");
	grunt.loadNpmTasks("grunt-run");

	// Task list
	grunt.registerTask("dev", ["dom_munger:"+mediaType]);
	grunt.registerTask("release", [ "dom_munger:default" ]);
	
	grunt.loadTasks("tools/app/tasks");

	function prepareProfile(app, profile, destination, suffix, done) {
		fs.exists(app + "/" + profile, function (exists) {
			if (exists) {
				app += "/" + profile;
			}

			suffix = suffix || "";
			grunt.config("multitau." + profile + suffix + ".options", {
				src: "../dist",
				dest: app + "/" + destination,
				profile: profile,
				app: app
			});
			done();
		});
	}

	grunt.registerTask("prepare-app", function() {
		var profile = grunt.option("profile"),
			app = grunt.option("app"),
			destination = grunt.option("destination") || (grunt.option("profiledestination") && "lib/tau/" + profile ) || "lib/tau",
			done = this.async(),
			tasks = [],
			async = require("async");

		if (!app) {
			grunt.log.error("missing option app");
		}

		if (profile) {
			tasks.push(prepareProfile.bind(null, app, profile, destination));
		} else {
			tasks.push(prepareProfile.bind(null, app, "wearable", destination));
			tasks.push(prepareProfile.bind(null, app, "mobile", destination));
			tasks.push(prepareProfile.bind(null, app, "tv", destination));
		}

		async.series(tasks, function () {
			grunt.task.run("multitau");
			done();
		});

	});

	grunt.registerTask("prepare-ce-test-app", function() {
		var profile = "mobile",
			destination = "lib/tau/" + profile,
			done = this.async(),
			tasks = [],
			async = require("async");

		tasks.push(prepareProfile.bind(null, "SDK/mobile/UIComponents/", profile, destination, ""));
		tasks.push(prepareProfile.bind(null, "SDK/mobile/UIComponentsCE/", profile, destination, "CE"));

		async.series(tasks, function () {
			grunt.task.run("multitau");
			done();
		});

	});
	grunt.registerTask("default", [ "release" ]);
};
