/*global print, exports, require, java, JavaImporter, org */
/*jslint nomen: true, plusplus: true */
(function (exports) {
	"use strict";

	JavaImporter(
		java.io.File
	);

	function printHelp() {
		print("");
		print("TAU framework builder");
		print("---------------------");
		print("");
		print("Available options:");
		print("--profile=NAME       Profile of framework (NAME = wearable|mobile|custom)");
		print("--custom-file=PATH   Path for entry file (it only works with option --profile=custom)");
		print("");
		return false;
	}

	var config = require("./config.js"),
		logger = require("./logger.js"),
		phantom = require("./phantom.js"),
		common = require("./common.js"),
		cleaner = require("./cleaner.js"),
		linker = require("./linker.js"),
		compiler = require("./compiler.js"),
		lessCompiler = require("./less-compiler.js"),
		profileConfig = require("../../profile-config.js").config,
		File = java.io.File;

	exports.buildProfile = function (profile) {
		var sep = config.get("separator"),
			rootNamespace = config.get("root-namespace"),
			customProfileFile,
			currentDir = config.get("current-dir"),
			source,
			entry,
			profileDestination,
			output,
			outputMin,
			profileCfg = profileConfig[profile],
			themes = profileCfg && profileCfg.themes,
			defaultTheme = profileCfg && profileCfg.defaultTheme,
			useGlobalize = profileCfg && profileCfg.useGlobalize,
			theme,
			themeKeys,
			themePath,
			themeBase,
			themeOutDir,
			themeOutBase,
			themeIn,
			themeOut,
			themeOutMin,
			packageConfig = common.readJSON(currentDir + sep + "package.json"),
			packageName = packageConfig && packageConfig.name,
			version = (packageConfig && packageConfig.version) || "unknown",
			i,
			l;

		rootNamespace = rootNamespace || packageName || "tau";

		// custom profile
		if (profile === "custom") {
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

			// get config file for profile
			source = currentDir + sep + "src" + sep + "js";
			entry = new File(source + sep + profile + ".js");
		}

		profileDestination = config.get("destination");
		output = new File(profileDestination + sep + profile + sep + "js" + sep + rootNamespace + ".js");
		outputMin = rootNamespace + ".min.js";

		// check if config file for profile and the information about themes in profile-config.js exist
		if (!entry.exists() || !entry.canRead() || !themes) {
			logger.error("profile does not exist or entry file is not readable [" + entry.getPath() + "]");
			return false;
		}

		// prepare destination directory (current_dir/dist)
		common.mkdir(profileDestination + sep + profile + sep + "js");

		// run linker.sh/linker.bin (requirejs)
		try {
			linker.link(entry.getPath(), output.getPath(), rootNamespace);
		} catch (linkException) {
			logger.error(linkException.message);
			return false;
		}

		// run compiler.sh/compiler.bin (closure-compiler)
		try {
			compiler.compile(output.getPath(), profileDestination + sep + profile + sep + "js" + sep + outputMin);
		} catch (compileException) {
			logger.error(compileException.message);
			return false;
		}

		// create themes for profile
		themeOutDir = profileDestination +
			sep +
			profile +
			sep +
			"theme";
		themeKeys = Object.keys(themes); // names of themes
		for (i = 0, l = themeKeys.length; i < l; ++i) {
			theme = themeKeys[i];
			themePath = themes[theme].replace(/\//g, sep); // change separator in path on proper one
			// set dir which the file theme.less is in
			themeBase = currentDir +
				sep +
				"src" +
				sep +
				"css" +
				sep +
				"profile" +
				sep +
				themePath;

			// set paths for css style files
			themeIn = themeBase + sep + "theme.less";

			themeOutBase = themeOutDir +
				sep +
				theme;
			themeOut = themeOutBase +
				sep +
				"tau.css";
			themeOutMin = themeOutBase +
				sep +
				"tau.min.css";

			// compile less files
			try {
				common.mkdir(themeOutBase);
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

		// create default theme
		if (defaultTheme) {
			try {
				common.mkdir(themeOutDir + sep + "default");
				common.copyContents(themeOutDir + sep + defaultTheme, themeOutDir + sep + "default");
				logger.info("default theme created");
			} catch (e) {
				logger.error("problem with creating default theme", e);
				// return false; // dont stop building
			}
		}

		if (useGlobalize) {
			// copy globalize
			try {
				logger.info("copy globalize");
				common.copyContents(currentDir + sep + "libs" + sep + "globalize" + sep + "lib", profileDestination + sep + profile + sep + "js");
			} catch (copyException) {
				logger.error(copyException);
				// return false; // dont stop
			}
		}

		common.copyFile(currentDir + sep + "LICENSE.Flora", profileDestination + sep + "LICENSE.Flora");
		common.writeFile(version, profileDestination + sep + "VERSION");
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
