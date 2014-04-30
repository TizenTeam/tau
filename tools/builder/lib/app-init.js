/*global print, Java, java, JavaImporter, System, environment, require, quit */
(function (commandLineArguments) {
	"use strict";
	var config = require("./builder/config.js"),
		builder = require("./builder/app-builder.js"),
		common = require("./builder/common.js"),
		args = common.parseArguments(commandLineArguments),
		os = common.getOS(),
		builderPath = args['builder-app-dir'],
		separator = environment["file.separator"],
		userHome = environment["user.home"],
		source = (args["source"] || environment["user.dir"]).replace(/^~/i, userHome).replace(new RegExp(separator + "$", "gi"), ""),
		destination = (args["destination"] || source +  separator + "build").replace(/^~/i, userHome).replace(new RegExp(separator + "$", "gi"), "");

	config.set("binary-suffix", os === 'win' ? '.exe' : '');
	config.set("os", os);
	config.set("arch", common.getArchitecture());
	config.set("separator", separator);
	config.set("builder-path", builderPath);
	config.set("current-dir", environment["user.dir"]);
	config.set("source", source);
	config.set("destination", destination);

	if (!builder.start()) {
		quit(1);
	} else {
		quit(0);
	}
}(arguments));
