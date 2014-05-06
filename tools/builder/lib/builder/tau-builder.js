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
		print("TAU framework builder");
		print("---------------------");
		print("")
		print("Available options:");
		print("--profile=NAME       Profile of framework (NAME = wearable|mobile|custom)");
		print("--custom-file=PATH   Path for entry file (it only works with option --profile=custom)");
		print("");
		return false;
	}

	var config = require("./config.js"),
		logger = require("./logger.js"),
		phantom = require("./phantom.js"),
		appConfig = require("./appconfig.js"),
		common = require("./common.js"),
		cleaner = require("./cleaner.js"),
		linker = require("./linker.js"),
		compiler = require("./compiler.js"),
		lessCompiler = require("./less-compiler.js"),
		profileConfig = require("../../profile-config.js").config,
		FileFilterUtils = org.apache.commons.io.filefilter.FileFilterUtils,
		File = java.io.File;

	exports.buildProfile = function (profile) {
		var sep = config.get("separator"),
			rootNamespace = config.get("root-namespace"),
			customProfileFile,
			currentDir = config.get("current-dir"),
			filename,
			source,
			entry,
			profileDestination,
			output,
			outputMin,
			profileCfg = profileConfig[profile],
			themes = profileCfg && profileCfg.themes,
			themeBase,
			themeOutBase,
			themeIn,
			themeOut,
			themeOutMin,
			lessInput,
			i;

		if (profile == "custom") {
			customProfileFile = config.get("custom-file");

			logger.info("Building profile: " + profile + " defined in file [" + customProfileFile + "]");

			if (customProfileFile) {
				entry = new File(customProfileFile);
			} else {
				logger.error("missing argument --custom-file with path for entry file");
				printHelp();
				return false;
			}
		} else {
			logger.info("Building profile: " + profile);

			source = currentDir + sep + "src" + sep + "js";
			entry = new File(source + sep + profile + ".js");
		}

		filename = entry.getName();
		profileDestination = config.get("destination") + sep + profile;
		output = new File(profileDestination + sep + rootNamespace + ".js");
		outputMin = rootNamespace + ".min.js";

		if (!entry.exists() || !entry.canRead() || !themes) {
			logger.error("profile does not exist or entry file is not readable [" + entry.getPath() + "]");
			return false;
		}

		common.mkdir(profileDestination);

		try {
			linker.link(entry.getPath(), output.getPath(), rootNamespace);
		} catch (e) {
			logger.error(e.message);
			return false;
		}

		try {
			compiler.compile(output.getPath(), profileDestination + sep + outputMin);
		} catch (e) {
			logger.error(e.message);
			return false;
		}

		i = themes.length;
		while(--i >= 0) {
			themeBase = currentDir +
				sep +
				"src" +
				sep +
				"css" +
				sep +
				"themes" +
				sep +
				"tizen" +
				sep +
				themes[i];
			themeIn = themeBase + ".less";
			themeOutBase = profileDestination +
				sep +
				"themes" +
				sep +
				themes[i];
			themeOut = themeOutBase +
				sep +
				"theme.css";
			themeOutMin = themeOutBase +
				sep +
				"theme.min.css";
			common.mkdir(profileDestination + sep + "themes" + sep + themes[i]);
			try {
				logger.info("compiling less files");
				lessCompiler.compile(themeIn, themeOut);
				lessCompiler.compile(themeIn, themeOutMin, true);
				logger.info("copy assets");
				common.mkdir(themeOutBase + sep + "images");
				common.copyContents(themeBase + sep + "images", themeOutBase + sep + "images");
			} catch (e) {
				logger.error(e.message);
				// return false; // dont stop building
			}
		}

		// copy globalize
		try {
			logger.info("copy globalize");
			common.copyContents(currentDir + sep + "libs" + sep + "globalize" + sep + "lib", profileDestination);
		} catch (e) {
			logger.error(e);
			// return false; // dont stop
		}

		return true;
	};

	exports.start = function () {
		var profiles = config.get("profiles"),
			sep = config.get("separator"),
			time = +new Date();

		config.set("destination", config.get("current-dir") + sep + "dist");

		profiles.forEach(exports.buildProfile);

		logger.info("build finished in " + (((+new Date()) - time) / 1000).toFixed(2) + "s");
	};
}(exports));
