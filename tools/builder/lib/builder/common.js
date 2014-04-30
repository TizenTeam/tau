/*global java, JavaImporter, exports, require, org, JavaAdapter, environment, System */
/*jslint plusplus: true */
(function (exports) {
	"use strict";
	JavaImporter(
		java.lang.System,
		java.io.File,
		org.apache.commons.io.FileUtils,
		org.apache.commons.io.filefilter.FileFilterUtils
	);
	var File = java.io.File,
		System = java.lang.System,
		FileUtils = org.apache.commons.io.FileUtils,
		FileFilterUtils = org.apache.commons.io.filefilter.FileFilterUtils,
		logger = require("./logger.js"),
		osName = environment["os.name"].toLowerCase(),
		os = osName.indexOf("window") > -1 ? "win" :
				osName.indexOf("linux") > -1 ? "lin" :
						osName.indexOf("darwin") > -1 ? "osx" : "unknown",
		archName = System.getenv("PROCESSOR_ARCHITECTURE"),
		wow64ArchName = System.getenv("PROCESSOR_ARCHITEW6432"),
		arch = (archName !== null && archName.lastIndexOf("64") > -1) ||
			(wow64ArchName !== null && wow64ArchName.lastIndexOf("64") > -1) ||
					environment["os.arch"].indexOf("64") > -1 ?
							"64" : "32";

	function mkdir(path) {
		var dir = new File(path);
		if (!dir.exists()) {
			logger.info("creating directory: " + dir.getCanonicalPath());
			return dir.mkdirs();
		}
		return false;
	}

	function copyContents(sourcePath, destinationPath, filterFiles) {
		var filter = filterFiles || FileFilterUtils.trueFileFilter(),
			source = new File(sourcePath),
			destination = new File(destinationPath),
			entity,
			contentIterator;

		if (!destination.exists()) {
			throw new Error(destinationPath + " does not exist");
		}

		if (!destination.exists()) {
			throw new Error(destinationPath + " does not exist");
		}

		if (!destination.canWrite()) {
			throw new Error(destinationPath + " is not writable");
		}

		if (!source.canRead()) {
			throw new Error(destinationPath + " is not readable");
		}

		contentIterator = FileUtils.iterateFilesAndDirs(source, filter, null);

		while (contentIterator.hasNext()) {
			entity = contentIterator.next();
			logger.info("copy " + entity.getPath());
			if (entity.isDirectory()) {
				FileUtils.copyDirectory(entity, destination, filter, true);
			} else if (filter.accept(entity)) {
				FileUtils.copyFileToDirectory(entity, destination, true);
			}
		}
	}

	function parseArguments(args) {
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

	exports.copyContents = copyContents;
	exports.mkdir = mkdir;
	exports.parseArguments = parseArguments;
	exports.getArchitecture = function () {
		return arch;
	};
	exports.getOS = function () {
		return os;
	};
}(exports));
