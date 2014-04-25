/*global java, JavaImporter, exports, require, org, JavaAdapter */
/*jslint plusplus: true */
(function (exports) {
	"use strict";
	JavaImporter(
		java.io.File,
		org.apache.commons.io.FileUtils,
		org.apache.commons.io.filefilter.FileFilterUtils,
		java.util.regex.Pattern
	);
	var File = java.io.File,
		FileUtils = org.apache.commons.io.FileUtils,
		FileFilterUtils = org.apache.commons.io.filefilter.FileFilterUtils,
		Pattern = java.util.regex.Pattern,
		logger = require("./logger.js"),
		filterDefault = Pattern.compile(".*"),
		filterFlags = Pattern.CASE_INSENSITIVE;

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

	exports.copyContents = copyContents;
	exports.mkdir = mkdir;
}(exports));
