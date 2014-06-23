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

	exports.link = function (inFile, outFile, rootNS) {
		var separator = config.get("separator"),
			builderPath = config.get("builder-path"),
			libDir = builderPath + separator + "lib",
			linkerExecutable = builderPath +
				separator +
				"bin" +
				separator +
				"linker" + (config.get("os") === 'win' ? '.bat' : '.sh'),
			pb = new ProcessBuilder(
				linkerExecutable,
				'--inputFile=' + inFile,
				'--outputFile=' + outFile,
				'--root-ns=' + (rootNS || "tau")
			).inheritIO(),
			p;
		pb.redirectErrorStream(true);
		p = pb.start();
		logger.info("linking, entry: " + inFile + ", output: " + outFile);
		if (p.waitFor() !== 0) {
			throw new Error("linking failed");
		}
	};
}(exports));
