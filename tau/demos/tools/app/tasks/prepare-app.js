/*global module:false, require:false*/
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs"),
		path = require("path");

	function prepareProfile(app, profile, destination, destDir, done) {
		fs.exists(app + path.sep + profile, function (exists) {
			if (exists) {
				app += path.sep + profile;
			}
			grunt.config("multitau." + profile + ".options", {
				src: path.join("..","dist"),
				dest: path.join(app, destination),
				profile: profile,
				app: app,
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
			debug = grunt.option("tau-debug"),
			done = this.async(),
			tasks = [],
			async = require("async");

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
			tasks.push(prepareProfile.bind(null, app, "tv", destination, destDir));
		}

		async.series(tasks, function () {
			grunt.task.run("multitau");
			done();
		});

	});
};