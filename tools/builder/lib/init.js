/*global print, Java, java, JavaImporter, System, environment, require, quit */
(function (commandLineArguments) {
	"use strict";
	JavaImporter(
		java.lang.System,
		java.io.File
	);

	function getArguments(args) {
		var parsed = {},
			arg,
			prop,
			cleanprop,
			spl;

		for (prop in args) {
			if (args.hasOwnProperty(prop)) {
				arg = args[prop];
				if (arg.indexOf("--") > -1) {
					cleanprop = arg.replace(/--/i, "");
					if (cleanprop.indexOf("=") > -1) {
						spl = cleanprop.split("=");
						parsed[spl[0].trim()] = spl[1].trim();
					} else {
						parsed[cleanprop] = true;
					}
				}
			}
		}

		return parsed;
	}

	var System = java.lang.System,
		osName = environment["os.name"].toLowerCase(),
		os = osName.indexOf("window") > -1 ? "win" :
				osName.indexOf("linux") > -1 ? "lin" :
						osName.indexOf("darwin") > -1 ? "osx" : "unknown",
		archName = System.getenv("PROCESSOR_ARCHITECTURE"),
		wow64ArchName = System.getenv("PROCESSOR_ARCHITEW6432"),
		arch = (archName !== null && archName.lastIndexOf("64") > -1) ||
			(wow64ArchName !== null && wow64ArchName.lastIndexOf("64") > -1) ||
					environment["os.arch"].indexOf("64") > -1 ?
							"64" : "32",
		args = getArguments(commandLineArguments),
		binarySuffix = os === "win" ? ".exe" : "",
		builderPath = args['builder-app-dir'],
		separator = environment["file.separator"],
		userHome = environment["user.home"],
		source = (args["source"] || environment["user.dir"]).replace(/^~/i, userHome).replace(new RegExp(separator + "$", "gi"), ""),
		destination = (args["destination"] || source +  separator + "build").replace(/^~/i, userHome).replace(new RegExp(separator + "$", "gi"), ""),
		config = require("./builder/config.js"),
		builder = require("./builder/builder.js");

	config.set("binary-suffix", binarySuffix);
	config.set("arch", arch);
	config.set("os", os);
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
