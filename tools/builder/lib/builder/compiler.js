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

	exports.compile = function (inFile, outFile) {
		var separator = config.get("separator"),
			builderPath = config.get("builder-path"),
			libDir = builderPath + separator + "lib",
			compilerExecutable = builderPath +
				separator +
				"bin" +
				separator +
				"compiler" + (config.get("os") === 'win' ? '.bat' : '.sh'),
			pb = new ProcessBuilder(
				compilerExecutable,
				"--compilation_level",
				"SIMPLE_OPTIMIZATIONS",
				"--js",
				inFile,
				"--js_output_file",
				outFile,
				"--language_in",
				"ECMASCRIPT5_STRICT",
				"--warning_level",
				"VERBOSE"
			).inheritIO(),
			p;
		pb.redirectErrorStream(true);
		p = pb.start();
		logger.info("compiling " + inFile);
		if (p.waitFor() !== 0) {
			throw new Error("compilation failed");
		}
	};
}(exports));
