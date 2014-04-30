/*global JavaImporter, java, require, exports */
/*jslint nomen: true */
(function (exports) {
	"use strict";
	JavaImporter(
		java.lang.ProcessBuilder
	);

	var ProcessBuilder = java.lang.ProcessBuilder,
		logger = require("./logger.js"),
		config = require("./config.js");

	exports.compile = function (inFile, outFile, min) {
		var separator = config.get("separator"),
			builderPath = config.get("builder-path"),
			libDir = builderPath + separator + "lib",
			compilerExecutable = builderPath +
				separator +
				"bin" +
				separator +
				"lessc" + (config.get("os") === 'win' ? '.bat' : '.sh'),
			pb = new ProcessBuilder(
				compilerExecutable,
				(min ? "-x" : ""),
				"--verbose",
				inFile,
				outFile
			).inheritIO(),
			p;
		pb.redirectErrorStream(true);
		p = pb.start();
		logger.info("compiling " + inFile + " to " + outFile);
		if (p.waitFor() !== 0) {
			throw new Error("compilation failed");
		}
	};
}(exports));
