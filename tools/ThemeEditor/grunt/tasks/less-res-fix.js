/*jslint nomen: true, plusplus: true */
/*global module, console */
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs"),
		themeRoot = "src/res/less/";

	grunt.registerMultiTask("less-res-fix", "Fixes directory structure in resources less files, adds color map", function () {
		var profile = this.target,
			options = this.data,
			themes = options.themes,
			theme,
			tmp,
			destThemePath,
			colorMapPath,
			themeIndex;


		for (themeIndex = 0; themeIndex < themes.length; themeIndex++) {
			theme = themes[themeIndex];
			colorMapPath = "../../../../" + profile + "." + theme.name + ".colormap.less";

			destThemePath = themeRoot + profile + "/" + theme.dest;

			if (theme.src !== theme.dest) {
				// Copy theme
				if (grunt.file.isDir(destThemePath)) {
					grunt.file.delete(destThemePath);
					grunt.log.ok("Destination directory was cleaned");
				}

				if (!fs.existsSync(destThemePath)) {
					fs.mkdirSync(destThemePath);
					grunt.log.ok("Destination directory was created");
				}


				grunt.file.recurse(themeRoot + profile + "/" + theme.src, function (abspath, rootdir, subdir, filename) {
					var path = (subdir ? subdir + "/" + filename : filename);
					grunt.file.copy(abspath, destThemePath + path);
					grunt.verbose.ok(abspath + "    -->   " + path);
				});

				grunt.log.ok("Source theme copied to " + destThemePath);
			}

			tmp = grunt.file.read(destThemePath + "theme.less");
			if (tmp.search(colorMapPath) < 0) {
				tmp += '\n@import "' + colorMapPath + '";'
			}
			grunt.file.write(destThemePath + "theme.less", tmp);
			grunt.log.ok("Color map injected to " + profile + "." + theme.name);
		}

	});
};
