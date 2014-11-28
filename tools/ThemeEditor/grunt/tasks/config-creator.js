/*jslint nomen: true, plusplus: true */
/*global module, console */
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs");

	grunt.registerMultiTask("create-config", "Creates config file based on less file for certain profile", function () {
		var profile = this.target,
			options = this.data,
			counter,
			hasColorMap,
			colorMap,
			theme,
			themeIndex,
			profilePath,
			themeColorLessFile,
			content,
			properties = {},
			lessColorMap = "";

		profilePath = options.cwd;

		for (themeIndex = 0; themeIndex < options.themes.length; themeIndex++) {
			theme = options.themes[themeIndex];
			hasColorMap = !!theme.colormap;
			themeColorLessFile = profilePath + theme.path + "theme.color.less";

			// Reset counter
			counter = {
				sections: 0,
				properties: 0
			};

			// Do not remove this, it will be needed to changable ThemeEditor colors implementation
			//fs.createReadStream("src/json/" + profile + "." + theme.name + ".colormap.json").pipe(fs.createWriteStream("colormap.json"));
			//colorMap = grunt.file.readJSON("src/json/" + profile + "." + theme.name + ".colormap.json"),
			if (hasColorMap) {
				colorMap = grunt.file.readJSON("../../tau/dist/" + profile + "/theme/" + theme.name +  "/colormap.json");
			}

			content = grunt.file.read(themeColorLessFile);
			grunt.log.subhead("Parsing less file: " + themeColorLessFile);

			/**
			 * @TODO describe regex
			 */
			content.replace(/(\/[\*]+([\n\r\s\w]*)[\*]+)\/[\n\r]+([\n\r\s\w#\/@:;\[\]]*)(\/\*|$)/g, function (match, header, headerContent, variables) {
					var sectionProperties = {};
					counter.sections++;

					headerContent = headerContent.trim();
					if (headerContent !== "") {
						/**
						 * @TODO describe regex
						 */
						variables.replace(/(@[a-z_]+)\s?:\s?([^;]+);\s?\/\/ #\[([\w]+)\](.*)/g, function (match, variableName, variableValue, widgetType, propertyDescription) {
							var colorTranslation,
								propertyOptions;

							colorTranslation = hasColorMap ? colorMap[variableValue.trim()] : variableValue;
							if (!colorTranslation) {
								grunt.log.warn("Color translation not found! Value _" + variableValue + "_ in " + variableName);
								return;
							}

							propertyOptions = {
								"lessVar": variableName,
								"widget": {
									"type": widgetType,
									"default": colorTranslation
								}
							};
							sectionProperties[propertyDescription.trim()] = propertyOptions;
							lessColorMap += variableName + ": " + colorTranslation + ";\n";
							counter.properties++;
						});
						properties[headerContent] = sectionProperties;
					}

					return match;
				}
			);
			grunt.log.ok("Created " + counter.properties + " properties divided to " + counter.sections + " sections");


			grunt.log.subhead("Saving files: ");
			fs.writeFileSync("src/json/" + profile + "." + theme.name + ".properties.json", JSON.stringify(properties, null, "\t"));
			grunt.log.ok("Theme properties JSON: " + profile + "." + theme.name + ".properties.less");
			if (hasColorMap) {
				fs.writeFileSync("src/res/" + profile + "." + theme.name + ".colormap.less", lessColorMap);
				grunt.log.ok("Color map less file: " + profile + "." + theme.name + ".colormap.less");
			}
		}
	});
};
