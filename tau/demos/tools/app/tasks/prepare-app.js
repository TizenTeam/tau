/*global module:false, require:false*/

var fs = require("fs"),
	path = require("path"),
	async = require("async");

module.exports = function (grunt) {
	"use strict";


	function prepareProfile(app, profile, destination, destDir, done) {
		fs.exists(app + path.sep + profile, function (exists) {
			if (exists) {
				app += path.sep + profile + path.sep;
			}
			grunt.config("multitau." + profile + ".options", {
				src: path.join("..", "dist"),
				dest: path.join(app, destination),
				profile: profile,
				app: app,
				type: "landscape",
				"dest-dir": destDir
			});
			done();
		});
	}

	grunt.registerTask("prepare-app", function () {
		var profile = grunt.option("profile"),
			app = grunt.option("app") + path.sep,
			destDir = grunt.option("dest-dir"),
			destination = grunt.option("destination") || path.join("lib", "tau"),
			done = this.async(),
			tasks = [];

		if (!app) {
			grunt.log.error("missing option app");
		}

		grunt.log.error("grunt.option: " + profile);
		if (profile) {
			grunt.log.error("prepare Profile: " + profile);
			tasks.push(prepareProfile.bind(null, app, profile, destination, destDir));
		} else {
			grunt.log.error("prepare Profile: " + profile);
			tasks.push(prepareProfile.bind(null, app, "wearable", destination, destDir));
			tasks.push(prepareProfile.bind(null, app, "mobile", destination, destDir));
		}

		async.series(tasks, function () {
			grunt.task.run("multitau");
			done();
		});

	});
};