/*global JavaImporter, java, require, exports */
/*jslint nomen: true */
(function (exports) {
	"use strict";
	JavaImporter(
		java.lang.ProcessBuilder,
		java.io.File
	);

	var ProcessBuilder = java.lang.ProcessBuilder,
		File = java.io.File,
		logger = require("./logger.js"),
		config = require("./config.js");

	exports.run = function (params) {
		var separator = config.get("separator"),
			src = new File(params.input),
			dst = new File(params.output),
			phantomPath = config.get("builder-path") +
				separator +
				"bin" +
				separator +
				"phantomjs" +
				separator +
				config.get("os") + (config.get("arch") === "64" ? "64" : "") +
				separator +
				"phantomjs" + config.get("binary-suffix"),
			jsFile = config.get("builder-path") +
				separator +
				"lib" +
				separator +
				"builder" +
				separator +
				"phantomjs.worker.js",
			phantomFix = config.get("builder-path") +
				separator +
				"lib" +
				separator +
				"builder" +
				separator +
				"phantom.fix.js",
			pb = new ProcessBuilder(
				phantomPath,
				"--load-images=true",
				"--local-to-remote-url-access=true",
				jsFile,
				'"' + phantomFix + '"',
				'"' + src.getAbsolutePath() + '"',
				'"' + dst.getAbsolutePath() + '"'
			).inheritIO(),
			p;
		logger.info("initializing PhantomJS, path: " + phantomPath);
		pb.directory(new File(config.get("destination")));
		pb.redirectErrorStream(true);
		p = pb.start();
		logger.info("running PhantomJS");

		if (p.waitFor() !== 0) {
			throw new Error("PhantomJS returned an error");
		}
	};
}(exports));
