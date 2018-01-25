/*jslint nomen: true, plusplus: true */
/*global module, console */
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs");

	function buildRegex(type) {
		var regex,
			/**
			 * Header of section.
			 * \/[*]{3,}\n\r? - first line of header must contain at least 3 * chars after /. E.g. /***, /*******
			 * ( - starts atom which matches section name.
			 * [^*]+ - section name can contain all characters without * character
			 * ) - ends atom which matches section name.
			 * [*]{3,}\/\n\r? - last line of header must contain at least 3 * chars before /.
			 *
			 * @type {RegExp}
			 */
			sectionHeader = /\/[*]{3,}\n\r?([^*]+)[*]{3,}\/\n\r?/,
			/**
			 * Variable section
			 * ([^*]+) - matches body of all properties. Body must not contain a * character
			 * (\n|$) - variable section ends on new line character or string end character
			 */
			sectionVariables = /([^*]+)(\n|$)/,
			/**
			 * Less variable with value
			 * (@[a-z0-9_-]+) - atom for less variable
			 * \s* - match whitespace
			 * : - match separator between less variable and value
			 * \s* - match whitespace
			 * ([^;]+) - atom for variable value. Variable contains all without semicolon
			 * ; - match semicolon
			 * @type {RegExp}
			 */
			lessVariable = /(@[a-z0-9_\-]+)\s*:\s*([^;]+);/,
			/**
			 * Property description. Property description e.g.
			 * // #[color] Description content
			 * \/\/\s+#\[ - matching starting sequence. It must be at least one space between / and #, e.g.: // #[
			 * ([\w]+) - atom for property type
			 * \] - matching end sequence
			 * (.*) - atom for description
			 */
			propertyDescription = /\/\/\s+#\[([\w]+)\](.*)/;

		switch (type) {
			case "section":
				regex = sectionHeader.source + sectionVariables.source;
				break;
			case "property":
				regex = lessVariable.source + /\s*/.source + propertyDescription.source;
				break;
			default: grunt.fail.warn("Unsupported regex type!");
		}

		return new RegExp(regex, "gi");
	}

	function getExpectedVariables(content) {
		var lines = content.match(/.*#\[[\w]+\].*/gi),
			expected = [],
			i;

		for (i = lines.length -1 ; i >= 0; i--) {
			expected.push(lines[i].split(":",2)[0].trim());
		}

		return expected;
	}

	grunt.registerMultiTask("create-config", "Creates config file based on less file for certain profile", function () {
		var profile = this.target,
			options = this.data,
			counter,
			expected,
			matched,
			hasColorMap,
			colorMap,
			theme,
			themeIndex,
			themes = options.themes,
			themesLength = themes.length,
			profilePath,
			themeColorLessPath,
			themeColorMapPath,
			content,
			properties = {},
			summaryMessage,
			lessColorMap = "",
			regexSection = buildRegex("section"),
			regexProperty = buildRegex("property");

		profilePath = options.cwd;

		for (themeIndex = 0; themeIndex < themesLength; themeIndex++) {
			theme = themes[themeIndex];
			hasColorMap = !!theme.colormap;
			themeColorMapPath = "../../tau/dist/" + profile + "/theme/" + theme.name +  "/colormap.json";
			themeColorLessPath = profilePath + theme.path + "theme.color.less";

			summaryMessage = "";
			counter = {
				sections: 0,
				propertiesIgnored: 0,
				propertiesCreated: 0,
				propertiesMatched: 0,
				propertiesExpected: 0
			};

			// Notify what are you doing
			grunt.log.subhead("Preparing " + profile + " theme " + (themeIndex + 1) + "/" + themesLength + ": " + theme.name);

			// If theme has declared color map - include it!
			if (hasColorMap) {
				if (!grunt.file.isFile(themeColorMapPath)) {
					grunt.fail.warn("Can't find color map file at " + themeColorMapPath + ". Please build TAU with color map flag, e.g. run in tau folder: grunt css --generate-colormap=true. ");
				}
				colorMap = grunt.file.readJSON(themeColorMapPath);
			}

			// Read less file with definition of colors
			content = grunt.file.read(themeColorLessPath);
			grunt.log.writeln("\nParsing less file: " + themeColorLessPath);

			// Count all expected matches in case property description won't be catch by property regex
			expected = getExpectedVariables(content);
			counter.propertiesExpected = expected.length;

			content.replace(regexSection, function (match, headerContent, variables) {

					var sectionProperties = {},
						propertyDescription = '',
						tmpIndex;
					counter.sections++;

					headerContent = headerContent.trim();
					if (headerContent !== "") {
						variables.replace(regexProperty, function (match, variableName, variableValue, widgetType, propertyDescription) {
							//regexProperty
							var colorTranslation,
								propertyOptions;

							colorTranslation = hasColorMap ? colorMap[variableValue.trim()] : variableValue;
							propertyDescription = propertyDescription.trim();
							counter.propertiesMatched++;

							// Remove matched variable
							tmpIndex = expected.indexOf(variableName);
							if (tmpIndex > -1) {
								expected.splice(tmpIndex, 1);
							}


							if (!colorTranslation) {
								grunt.log.warn("No translation! Value _" + variableValue + "_ in " + variableName);
								counter.propertiesIgnored++;
								return;
							}

							if (sectionProperties[propertyDescription]) {
								grunt.log.warn("Duplicate! Property \"" + propertyDescription + "\" for " + variableName + ", which was first declared by " + sectionProperties[propertyDescription].lessVar);
								counter.propertiesIgnored++;
								return;
							}

							propertyOptions = {
								"lessVar": variableName,
								"widget": {
									"type": widgetType,
									"default": colorTranslation
								}
							};
							sectionProperties[propertyDescription] = propertyOptions;
							counter.propertiesCreated++;
							lessColorMap += variableName + ": " + colorTranslation + ";\n";
						});
						properties[headerContent] = sectionProperties;
					}

					return match;
				}
			);

			summaryMessage = "Created " + counter.propertiesCreated + "/" + counter.propertiesMatched + " properties divided to " + counter.sections + " sections";

			if (counter.propertiesIgnored > 0) {
				summaryMessage += " (" + counter.propertiesIgnored + " was ignored)";
			}

			if (counter.propertiesExpected === counter.propertiesMatched) {
				grunt.log.ok(summaryMessage);
			} else {
				summaryMessage += "\nExpected " + counter.propertiesExpected + " properties, but " + counter.propertiesMatched + " was matched. Missing:\n";
				summaryMessage += grunt.log.wordlist(expected, {separator: ", ", color: "cyan"});
				grunt.log.warn(summaryMessage);
			}


			grunt.log.writeln("\nSaving files: ");
			fs.writeFileSync("src/json/" + profile + "." + theme.name + ".properties.json", JSON.stringify(properties, null, "\t"));
			grunt.log.ok("Theme properties JSON: " + profile + "." + theme.name + ".properties.less");
			if (hasColorMap) {
				fs.writeFileSync("src/res/" + profile + "." + theme.name + ".colormap.less", lessColorMap);
				grunt.log.ok("Color map less file: " + profile + "." + theme.name + ".colormap.less");
			}
		}
	});
};
