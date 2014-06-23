/*global print, Java, java, JavaImporter, System, environment, require, quit */
(function () {
	"use strict";
	var config = require("./builder/config.js"),
		builder = require("./builder/tau-builder.js"),
		common = require("./builder/common.js"),
		args = common.parseArguments(environment['sun.java.command']), // hack for spaces in param values bug
		os = common.getOS(),
		profiles = args.profile ? [args.profile.split(",")] : ['wearable', 'mobile'],
		rootNamespace = args['root-namespace'],
		customFile = (args["custom-file"] || "").replace(/^~/i, environment["user.home"]);

	profiles.map(function (p) {
		return (p + "").trim();
	});

	config.set("binary-suffix", os === 'win' ? '.exe' : '');
	config.set("java", environment['java.home']);
	config.set("path-separator", environment['path.separator']);
	config.set("os", os);
	config.set("arch", common.getArchitecture());
	config.set("separator", environment['file.separator']);
	config.set("builder-path", args['builder-app-dir']);
	config.set("current-dir", environment["user.dir"]);
	config.set("profiles", profiles);
	config.set("root-namespace", rootNamespace);

	config.set("custom-file", customFile);

	if (!builder.start()) {
		quit(1);
	} else {
		quit(0);
	}
}(arguments));
