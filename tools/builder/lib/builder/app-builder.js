/*global print, exports, require, java, JavaImporter, org */
/*jslint nomen: true */
(function (exports) {
	"use strict";

	JavaImporter(
		java.io.File,
		org.apache.commons.io.filefilter.FileFilterUtils
	);

	function printHelp() {
		print("");
		print("TAU application builder");
		print("");
		print("Options:");
		print("--source=\"PATH\" - the source path of the application; must contain a valid config.xml file");
		print("--destination=\"PATH\" - the destination path of the application (Optional: if not specified the source + \"build\" will be used)");
		print("");
		return false;
	}

	var config = require("./config.js"),
		logger = require("./logger.js"),
		phantom = require("./phantom.js"),
		appConfig = require("./appconfig.js"),
		common = require("./common.js"),
		cleaner = require("./cleaner.js"),
		FileFilterUtils = org.apache.commons.io.filefilter.FileFilterUtils,
		File = java.io.File;

	exports.start = function () {
		var sep = config.get("separator"),
			source = config.get("source"),
			destination = config.get("destination"),
			appConfigFile = source + sep + "config.xml",
			htmlBuildPath,
			sourceHTMLRelPath = null,
			time = +new Date(),
			scriptsReplaced = false,
			processStatus = true;

		if (!source || source.length === 0) {
			return printHelp();
		}

		// load the config file
		try {
			appConfig.load(appConfigFile);
			sourceHTMLRelPath = appConfig.get("content", "src");
		} catch (e) {
			logger.error("error while parsing config", e);
			return printHelp();
		}

		if (!sourceHTMLRelPath || sourceHTMLRelPath.length === 0) {
			sourceHTMLRelPath = "index.html";
			logger.warning("application contnet link not found in config, using index.html as source file for build");
		}

		// ensure the dire exists
		try {
			common.mkdir(destination);
		} catch (e) {
			logger.error("could not create destination directory", e);
			return false;
		}

		htmlBuildPath = destination + sep + sourceHTMLRelPath;

		logger.info("copying files: " + source + sep + "* => " + destination + sep + "*");
		try {
			common.copyContents(
				source,
				destination,
				// exclude dot files/dirs, wgt files and build folder
				FileFilterUtils.and(
					FileFilterUtils.notFileFilter(
						FileFilterUtils.prefixFileFilter(".")
					),
					FileFilterUtils.notFileFilter(
						FileFilterUtils.and(
							FileFilterUtils.fileFileFilter(),
							FileFilterUtils.suffixFileFilter(".wgt")
						)
					),
					FileFilterUtils.notFileFilter(
						FileFilterUtils.and(
							FileFilterUtils.directoryFileFilter(),
							FileFilterUtils.nameFileFilter((new File(destination)).getName())
						)
					)
				)
			);
		} catch (e) {
			logger.error("copy operation failed", e);
			return false;
		}

		try {
			// Removes all scripts from processed path beside framework library
			logger.info("Replacing scripts inside build path");
			scriptsReplaced = cleaner.replaceScripts(htmlBuildPath);
		} catch (e) {
			logger.warning("Replacing scripts failed", e);
		}

		try {
			phantom.run({
				input: htmlBuildPath,
				output: htmlBuildPath // overwrite
			});
		} catch (e) {
			logger.error("Building failed", e);
			processStatus = false;
		}

		if (scriptsReplaced) {
			try {
				logger.info("Restoring scripts inside build path");
				cleaner.restoreScripts(htmlBuildPath);
			} catch (e) {
				logger.warning("Restoring scripts inside build path failed", e);
			}
		}

		logger.info("build" + (!processStatus ? ' with errors' : '') + " finished in " + (((+new Date()) - time) / 1000).toFixed(2) + "s");
		return processStatus;
	};
}(exports));
