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
		FileUtils.forceMkdir(dir);
	}

	function copyFile(source, destination) {
		var src = new File(source),
			dst = new File(destination);
		logger.info("copy " + src.getPath());
		try {
			FileUtils.copyFile(src, dst);
		} catch (e) {
			logger.error("failed to copy", e);
			return false;
		}
		return true;
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
				try {
					FileUtils.copyDirectory(entity, destination, filter, true);
				} catch (e) {
					logger.error("copy operation failed", e);
				}
			} else if (filter.accept(entity)) {
				try {
					FileUtils.copyFileToDirectory(entity, destination, true);
				} catch (copyException) {
					logger.error("copy operation failed", copyException);
				}
			}
		}
	}

	function trim(str) {
		return str.trim();
	}

	function removeEmpty(str) {
		return str && str.length > 0;
	}

	function parseArguments(argumentString) {
		var firstParamIndex,
			paramPrefix = "--",
			paramInfix = "=",
			result = {},
			paramsSplitedByPrefix,
			paramSplitedByInfix,
			argumentStringSub,
			i,
			l;

		if (argumentString && (firstParamIndex = argumentString.indexOf(paramPrefix)) > -1) {
			argumentStringSub = argumentString.substr(firstParamIndex);
			if (argumentStringSub.length > 0) {
				paramsSplitedByPrefix = argumentStringSub.split(paramPrefix).map(trim).filter(removeEmpty);
				for (i = 0, l = paramsSplitedByPrefix.length; i < l; ++i) {
					paramSplitedByInfix = paramsSplitedByPrefix[i].split(paramInfix).map(trim).filter(removeEmpty);
					result[paramSplitedByInfix[0]] = paramSplitedByInfix[1] !== undefined ?
							paramSplitedByInfix[1] : true;
				}
			}
		}
		return result;
	}

	function readJSON(path) {
		var file = new File(path),
			data;
		if (file.exists() && file.canRead()) {
			try {
				data = FileUtils.readFileToString(file);
			} catch (readException) {
				// pass
			}
			if (data) {
				return JSON.parse(data);
			}
		}
		return {};
	}

	function writeFile(data, path) {
		var file = new File(path);

		try {
			FileUtils.writeStringToFile(file, data + "\n", false);
			logger.info("File written: " + file.getPath());
		} catch (fileWriteException) {
			return false;
		}

		return true;
	}

	exports.copyContents = copyContents;
	exports.copyFile = copyFile;
	exports.mkdir = mkdir;
	exports.parseArguments = parseArguments;
	exports.readJSON = readJSON;
	exports.writeFile = writeFile;
	exports.getArchitecture = function () {
		return arch;
	};
	exports.getOS = function () {
		return os;
	};
}(exports));
