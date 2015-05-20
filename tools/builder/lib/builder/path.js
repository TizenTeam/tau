/*global JavaImporter, javax, org, java, exports, require */

(function (exports) {
	"use strict";
	JavaImporter(
		java.io.File,
		org.apache.commons.io.FilenameUtils,
		org.apache.commons.io.FileUtils
	);
	var File = java.io.File,
		FilenameUtils = org.apache.commons.io.FilenameUtils,
		FileUtils = org.apache.commons.io.FileUtils,
		config = require("./config.js"),
		logger = require("./logger.js"),
		FILE_PREFIX = "file:";

	/**
	 * Create relative path between two paths.
	 * In our case, these paths are always related and the first one
	 * is a parent of the second one.
	 * @param parent
	 * @param child This path always includes the paths from parameter parent.
	 * @returns {string}
	 */
	function getRelativePath(parent, child) {
		var sep = config.get("os") !== "win" ? config.get("separator") : "\\\\";

		if (parent && child) {
			// replace parent direction in current path on dot
			child = child.replace(parent, ".");
			// change every part of path separator[^separator]+ on separator..
			child = child.replaceAll(sep + "[^" + sep + sep + "]+", sep + "..");
			return child;
		}
		// if something goes wrong, the parent without any change is returned
		return parent;
	}

	exports.clearPath = function (filePath, destinationDirPath) {
		var file = new File(filePath),
			destinationDir = new File(destinationDirPath),
			sep = config.get("os") !== "win" ? config.get("separator") : "\\\\",
			relativePath,
			pathToChange,
			data;

		// absolute path for destination directory
		destinationDirPath = FilenameUtils.normalize(destinationDir.getAbsolutePath());
		// absolute path for current file (without name of file)
		filePath = FilenameUtils.normalize(FilenameUtils.getFullPath(file.getAbsolutePath()));

		// read file to string
		try {
			data = FileUtils.readFileToString(file);
		} catch (e) {
			logger.error("failed to read file " + filePath, e);
			return false;
		}

		// count the relative path between destination directory and path of current file
		relativePath = getRelativePath(destinationDirPath, filePath);

		// replace paths in current file to relative ones and overwrite file
		if (data) {
			// file: separator separator path_without_separator_in_the_end separator
			pathToChange = FILE_PREFIX + sep + sep + destinationDirPath + sep;
			// replace absolute paths on relative
			data = data.replace(pathToChange, relativePath);
			try {
				// overwrite file
				FileUtils.writeStringToFile(file, data + "\n", false);
			} catch (e) {
				logger.error("failed to overwrite file " + filePath, e);
				return false;
			}
			return true;
		}
	};

}(exports));
