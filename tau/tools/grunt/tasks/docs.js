/*jslint nomen: true */
/* global require, module, __dirname */
/*
 * Generating docs Ej
 *
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * Licensed under the MIT license.
 */
var path = require("path"),
	mu = require("mu2"),
	dox = require("dox"),
	async = require("async"),
	marked = require("marked"),
	rjsBuildAnalysis = require("rjs-build-analysis"),
	additionalDocs = {},
	regexClearPRECODE = /\n*[ \t]*\n*<\/?(pre|code)>\n*[\t ]*\n*/gm;

function prepareNote(string) {
	return string.replace(/!!!(.*)!!!/mg, function (match, p1) {
		return "<div class='note'><strong>Note</strong><br />" + p1 + "</div>";
	});
}

function filterTypes(type) {
	return type === "JavaScript" || type === "HTML" || type === "CSS";
}

function prepareExamples(description) {
	var styles = "",
		types = null;

	description = description.replace(/<pre><code>[ \t]*(@example(.*))((.|\n)*?)<\/code><\/pre>/mg, function () {
		if (arguments[2].indexOf("signature") > -1) {
			styles = " signature";
		}
		types = arguments[2].split(" ").filter(filterTypes);
		return "<pre class=\"prettyprint" + styles + "\">" + arguments[3] + "<span class=\"types\">" + types.join(" ") + "</span></pre>";
	});
	return description;
}

/**
 * Trim function used in array map
 * @param {string} string
 * @return {string}
 */
function trimString(string) {
	return string.trim();
}

/**
 * Return length of string, used in array filter
 * @param {string} string
 * @return {number}
 */
function stringLength(string) {
	return string.length;
}

module.exports = function (grunt) {
	"use strict";

	grunt.registerMultiTask("docs-html", "", function () {
		var done = this.async(),
			docsStructure = {},
			profile = this.data.profile,
			version = this.data.version || null,
			versionString = version ? " - v" + version : "",
			widgetRegExp = new RegExp("^tau\.widget\."),
			regexMobileTag = /<(mobile)>(.*)<\/mobile>/g,
			regexWearableTag = /<(wearable)>(.*)<\/wearable>/g,
			files = [],
			template = this.data.template,
			templateDir = template + "/",
			errorLogger = this.data.failOnError ? grunt.fail.fatal : grunt.log.error,
			next;

		mu.root = path.join(__dirname, "templates");

		/**
		 * Return only strings which match to profile, used in array filter
		 * @param {string} str
		 * @return {boolean}
		 */
		function filterProfile(str) {
			return str === profile;
		}

		/**
		 * if tag match to profile, return content of tag, else remove content of tag.
		 * This function is callback for regexp replace.
		 * @param {string} match
		 * @param {string} p1
		 * @param {string} p2
		 * @return {string}
		 */
		function clearUnmachedProfileBlocks(match, p1, p2) {
			if (p1 === profile) {
				return p2;
			} else {
				return "";
			}
		}


		function convertFile(profileName, file, callback) {
			var fileNameArray = file.split("/"),
				string = "",
				fileName = "";

			fileNameArray.shift();
			fileNameArray.shift();
			fileNameArray.shift();
			fileName = fileNameArray.join(path.sep).replace(/md$/, "htm");
			mu.compileAndRender(templateDir + "index.mustache", {
				description: prepareExamples(prepareNote(marked(grunt.file.read(file)))),
				basedir: "../"
			}).on("data", function (data) {
				string += data.toString();
			}).on("end", function () {
				grunt.file.write(path.join("docs", "sdk", profileName, "html", "ui_fw_api", "page", fileName), string);
				grunt.log.ok("Finished generating page for " + file + ".");
				callback();
			});
		}

		function prepareMDDocs(profileName) {
			async.each(grunt.file.expand(path.join("src", "docs", profileName, "**", "*.md")), convertFile.bind(null, profileName));
		}

		function createWidgetDoc(newFile, file, docsStructure, callback) {
			var string = "",
				toc = [],
				description,
				methods = docsStructure.methods.filter(function (method) {
					return method.isPublic;
				}),
				options = docsStructure.options,
				events = docsStructure.events.filter(function (event) {
					return event.isPublic;
				}),
				shortName,
				extendsClass = docsStructure.extends,
				extendsArray;

			if (extendsClass) {
				extendsArray = extendsClass.split(".").slice(1);
				extendsArray.unshift("tau");
				extendsClass = extendsArray.join(".");
			}
			grunt.log.ok("Start generating file for widget ", file);
			methods.sort(function (a, b) {
				return a.name > b.name ? 1 : -1;
			});
			options.sort(function (a, b) {
				return a.name > b.name ? 1 : -1;
			});
			events.sort(function (a, b) {
				return a.name > b.name ? 1 : -1;
			});
			description = docsStructure.description;
			if (additionalDocs[docsStructure.name]) {
				description += additionalDocs[docsStructure.name];
			}
			docsStructure.description = description;
			moveDestriptionPartToBlocs(docsStructure);
			description = docsStructure.description;
			description = description.replace(/(<h(2)( *id="(.*?)")?>)(.*?)(<\/h2>)/ig, function (match, p1, p2, p3, p4, p5, p6) {
				var name = p4 || p5.replace(/[ \/]/, "-").toLowerCase() + (Math.random());

				toc.push({
					href: name,
					name: p5
				});
				if (p4) {
					return match;
				} else {
					return p1 + "<a id='" + name + "'></a>" + p5 + p6;
				}
			});
			// prepare tags for example in main description
			description = prepareExamples(description);
			// and in additional descriptions
			docsStructure.descriptions.option = prepareExamples(docsStructure.descriptions.option || "");
			// if options exists then add position options to table of content
			if (options.length) {
				toc.push({
					href: "options-list",
					name: "Options"
				});
			}
			// if events exists then add position events to table of content
			if (events.length) {
				toc.push({
					href: "events-list",
					name: "Events"
				});
			}
			// if methods exists then add position methods to table of content
			if (methods.length) {
				toc.push({
					href: "methods-list",
					name: "Methods"
				});
			}
			shortName = docsStructure.name.split(".").pop();
			mu.compileAndRender(templateDir + "widget.mustache", {
				title: shortName,
				version: versionString,
				namespace: docsStructure.name,
				descriptions: docsStructure.descriptions,
				namespaceShort: shortName,
				brief: docsStructure.brief,
				description: description,
				toc: toc,
				options: options,
				showOptions: options.length,
				events: events,
				showEvents: events.length,
				methods: methods,
				showMethods: methods.length,
				since: docsStructure.since,
				extends: extendsClass,
				extendsFile: extendsClass && extendsClass.replace(/\./g, "_") + ".htm",
				basedir: "../",
				mobile: profile === "mobile",
				wearable: profile === "wearable"
			}).on("data", function (data) {
				string += data.toString();
			}).on("end", function () {
				grunt.file.write(newFile + "html/ui_fw_api/" + profile[0].toUpperCase() + profile.substring(1) + "_UIComponents/" + file, string);
				grunt.log.ok("Finished generating file for widget ", file);
				callback();
			});
		}

		function createClassDoc(newFile, file, name, docsStructure, callback) {
			var string = "",
				toc = [],
				parentToc = {
					1: {
						toc: toc
					}
				},
				description,
				shortName,
				publicMethodsCount = 0,
				methods = docsStructure.methods.filter(function (method) {
					return method.isPublic && !method.inherited;
				}),
				inheritedMethods = docsStructure.methods.filter(function (method) {
					return method.isPublic && method.inherited;
				});

			grunt.log.ok("Start generating file for class ", file);
			methods.sort(function (a, b) {
				return a.name > b.name ? 1 : -1;
			});
			inheritedMethods.sort(function (a, b) {
				return a.name > b.name ? 1 : -1;
			});
			docsStructure.properties.sort(function (a, b) {
				return a.name > b.name ? 1 : -1;
			});
			if (docsStructure.description.full) {
				docsStructure.description = docsStructure.description.full;
			}
			description = docsStructure.description.replace(/(<h([2-4])>)(.*?)(<\/h[2-4]>)/ig, function (match, p1, p2, p3, p4) {
				var name = p3.replace(" ", "-").toLowerCase() + (Math.random()),
					level = parseInt(p2, 10);

				parentToc[level] = {
					href: name,
					name: p3,
					toc: []
				};
				if (parentToc[level - 1]) {
					parentToc[level - 1].hasTOC = true;
					parentToc[level - 1].toc.push(parentToc[level]);
				}
				return p1 + "<a id='" + name + "'></a>" + p3 + p4;
			});
			if (docsStructure.events.length) {
				toc.push({
					href: "events-list",
					name: "Events list",
					toc: []
				});
			}
			if (methods.length) {
				toc.push({
					href: "methods-list",
					name: "Methods list",
					hasTOC: true,
					toc: methods.filter(function (method) {
						return method.isPublic;
					}).map(function (method) {
						method.first = (publicMethodsCount === 0);
						publicMethodsCount++;
						return {
							href: "method-" + method.name,
							name: method.name
						};
					})
				});
			}
			if (inheritedMethods.length) {
				toc.push({
					href: "inherited-methods-list",
					name: "Inherited methods list",
					hasTOC: true,
					toc: inheritedMethods.map(function (method) {
						return {
							href: "method-" + method.name,
							name: method.name
						};
					})
				});
			}
			if (docsStructure.properties.length) {
				toc.push({
					href: "properties-list",
					name: "Properties list",
					hasTOC: true,
					toc: docsStructure.properties.filter(function (property) {
						return property.isPublic;
					}).map(function (property) {
						return {
							href: "property-" + property.name,
							name: property.name
						};
					})
				});
			}
			shortName = docsStructure.name.split(".").pop();
			mu.compileAndRender(templateDir + "class.mustache", {
				title: name,
				version: versionString,
				namespace: docsStructure.name,
				namespaceShort: shortName,
				brief: docsStructure.brief,
				description: prepareExamples(description),
				toc: toc,
				options: docsStructure.options,
				showOptions: docsStructure.options.length,
				events: docsStructure.events,
				showEvents: docsStructure.events.length,
				methods: methods,
				showMethods: methods.length,
				inheritedMethods: inheritedMethods,
				showInheritedMethods: inheritedMethods.length,
				properties: docsStructure.properties,
				showProperties: docsStructure.properties.length,
				since: docsStructure.since
			}).on("data", function (data) {
				string += data.toString();
			}).on("end", function () {
				grunt.file.write(newFile + "html/ui_fw_api/class/" + file, string);
				grunt.log.ok("Finished generating file for class ", file);
				callback();
			});
		}

		function createBlockIndex(newFile, docsStructure, type, rows, callback) {
			var string = "",
				widgetsDoc = docsStructure["ns." + type + "." + profile] || docsStructure["ns." + type];

			rows.sort(function (a, b) {
				return a.name.trim() > b.name.trim() ? 1 : -1;
			});
			if (widgetsDoc) {
				grunt.log.ok("Started generating index for " + type + ".");
				mu.compileAndRender(templateDir + "index.mustache", {
					title: widgetsDoc.title,
					version: versionString,
					description: widgetsDoc.description.replace(/@example/g, "").replace(/<pre><code>\s*\n/g, "<pre class=\"prettyprint\">").replace(/<\/code>/g, ""),
					showTable: true,
					table: {
						module: type === "widget" ? "Component" : type,
						rows: rows
					},
					basedir: "../"
				}).on("data", function (data) {
					string += data.toString();
				}).on("end", function () {
					grunt.file.write(newFile + "html/ui_fw_api/" + (type === "widget" ? profile[0].toUpperCase() +
							profile.substr(1) + "_UIComponents" : type) + "/" + (type === "widget" ? profile + "_component" : type) +
							"_list.htm", string);
					grunt.log.ok("Finished generating index for " + type + ".");
					callback();
				});
			} else {
				callback();
			}
		}

		function createBlock(newFile, docsStructure, file, callback) {
			var string = "",
				description = docsStructure.description;

			if (additionalDocs[docsStructure.name]) {
				description += additionalDocs[docsStructure.name];
			}

			grunt.log.ok("Started generating page for " + file + ".");
			mu.compileAndRender(templateDir + "index.mustache", {
				title: docsStructure.title,
				description: description.replace(/@example/g, "").replace(/<pre><code>\s*\n/g, "<pre class=\"prettyprint\">").replace(/<\/code>/g, ""),
				basedir: "../"
			}).on("data", function (data) {
				string += data.toString();
			}).on("end", function () {
				grunt.file.write(newFile + "html/" + file, string);
				grunt.log.ok("Finished generating index for " + file + ".");
				callback();
			});
		}


		function createClassIndex(newFile, docsStructure, rows, callback) {
			var string = "",
				classDoc = docsStructure;

			grunt.log.ok("Started generating index for classes.");
			rows.sort(function (a, b) {
				return a.namespace > b.namespace ? 1 : -1;
			});
			mu.compileAndRender(templateDir + "index.mustache", {
				title: classDoc.title,
				version: versionString,
				namespace: classDoc.name,
				description: classDoc.description && classDoc.description.full,
				table: {
					caption: "Table: Tizen Advanced UI Classes",
					module: "Description",
					rows: rows
				},

				basedir: "../"
			}).on("data", function (data) {
				string += data.toString();
			}).on("end", function () {
				grunt.file.write(newFile + "html/ui_fw_api/class/class_reference.htm", string);
				grunt.log.ok("Finished generating index for classes.");
				callback();
			});
		}


		function createIndex(newFile, docsStructure, rows, callback) {
			var string = "",
				classDoc = docsStructure;

			grunt.log.ok("Started generating index.");
			rows.sort(function (a, b) {
				return a.name > b.name ? 1 : -1;
			});

			mu.compileAndRender(templateDir + "index.mustache", {
				title: classDoc.title,

				version: versionString,
				description: classDoc.description,
				showTable: rows.length,
				table: {
					caption: "Table: Tizen Advanced UI",
					module: "Description",
					rows: rows
				},
				basedir: ""
			}).on("data", function (data) {
				string += data.toString();
			}).on("end", function () {
				grunt.file.write(newFile + "html/ui_fw_api/ui_fw_api_cover.htm", string);
				grunt.log.ok("Finished generating index.");
				callback();
			});
		}

		function deleteBR(string) {
			return string.replace(/<br \/><br \/>/gm, "<double br />").replace(/<br \/>/gm, " ").replace(/<double br \/>/gm, "<br />");
		}

		function copyObject(object) {
			var newObject,
				value,
				i;

			if (object instanceof Array) {
				newObject = [];
			} else {
				newObject = {};
			}
			for (i in object) {
				if (object.hasOwnProperty(i)) {
					value = object[i];
					newObject[i] = (typeof value === "object") ? copyObject(value) : value;
				}
			}
			return newObject;
		}

		function filterStyle(style) {
			return style === "signature";
		}

		function prepareDescriptionAndExamples(method, block) {
			var description = deleteBR(prepareNote(block)),
				profiles = null,
				found = null;

			while (found = /(<h[0-9]>(.*?)<\/h[0-9]>(\t|\r| |\n)*?)?<pre><code>[ \t]*(@example(.*))((.|\n)*?)<\/code><\/pre>/mg.exec(description)) {
				// finding profile information after @example tag
				profiles = found[5].split(" ").map(trimString).filter(stringLength);
				// if example tag not have any information about profile or current profile is on profiles list
				if (profiles.length === 0 || profiles.filter(filterProfile).length) {
					// add example to example blocks
					method.examples.push({
						name: found[1] || "",
						types: profiles.filter(filterTypes),
						style: profiles.filter(filterStyle),
						code: found[6].replace(regexClearPRECODE, "")
					});
				}
				// remove example from description
				description = description.replace(found[0], "");
			}

			// clear in description tags not matched to profile
			description = description.replace(regexMobileTag, clearUnmachedProfileBlocks)
				.replace(regexWearableTag, clearUnmachedProfileBlocks);
			// save description
			method.description = description;
		}

		function moveDestriptionPartToBlocs(object) {
			// divide divide to title blocks
			var descriptionBlocks = object.description.split("<h").map(trimString).filter(stringLength),
				// map with all blocks types
				descriptions = {};

			if (descriptionBlocks.length > 1) {
				// filter blocks
				descriptionBlocks = descriptionBlocks.map(function (block) {
					// divide string to lines
					var lines = block.split("\n"),
					// get first line
						firstLine = lines.shift(),
					// match first lines to parts
						found = /([2-4].*?>)(.*?)\((.*?)(-(.*?))?\)(<\/h[2-4]>)/.exec(firstLine);
					// if first line match to title with type

					if (found) {
						// init description block
						descriptions[found[3]] = descriptions[found[3]] || "";
						// add block to matched block
						descriptions[found[3]] += "<h" + found[1] + found[2] + found[6] + lines.join("\n");
						return "";
					} else {
						// this is not block with type, adding to standard description
						return block;
					}
				});

				descriptionBlocks = descriptionBlocks.filter(stringLength);
				if (descriptionBlocks.length) {
					object.description = "<H" + descriptionBlocks.join("<h");
				}
			}

			object.descriptions = descriptions;
		}

		function parseDox(file) {
			var docs,
				doxFile = file.replace("dist", "tmp/dox"),
				structureFile = "docs/js/" + profile + "/tau.js",
				newFile = "docs/" + templateDir + "/" + profile + "/",
				modules = [],
				i,
				next,
				jsContent,
				rowsWidgets = [],
				rowsClasses = [],
				rowsEvents = [],
				rowsUtil = [],
				namespaceArray,
				series = [],
				filename,
				name,
				description;

			jsContent = grunt.file.read(file);
			docs = dox.parseComments(jsContent);
			grunt.file.write(doxFile, JSON.stringify(docs));

			docs.forEach(function (block) {
				block.tags.filter(function (tag) {
					return tag.type === "page";
				}).forEach(function (tag) {
					var pageObj = {
							name: tag.string
						},
						descriptionArray;

					docsStructure[tag.string] = pageObj;
					pageObj.authors = block.tags.filter(function (tag) {
						return tag.type === "author";
					}).map(function (tag) {
						return tag.string;
					});
					pageObj.title = block.tags.filter(function (tag) {
						return tag.type === "title";
					}).map(function (tag) {
						return tag.string;
					})[0];
					pageObj.type = "page";
					descriptionArray = (block.description.summary || "").split("\n");
					pageObj.title = descriptionArray[0].replace(/<.*?>/g, "");
					pageObj.brief = descriptionArray[2] && descriptionArray[2].replace(/<.*?>/g, "") || "";
					pageObj.description = prepareNote(deleteBR(block.description.body));

					pageObj.methods = [];
					pageObj.properties = [];
					pageObj.events = [];
					pageObj.options = [];
				});
				block.tags.filter(function (tag) {
					return tag.type === "class";
				}).forEach(function (tag) {
					var classObj = {
							name: tag.string
						},
						nameArray = tag.string.split("."),
						shortName = nameArray.pop(),
						descriptionArray;

					if (docsStructure[tag.string]) {
						grunt.log.warn("double definition of class " + tag.string + ".");
					} else {
						docsStructure[tag.string] = classObj;
					}
					classObj.shortName = shortName;
					docsStructure[tag.string] = classObj;
					classObj.authors = block.tags.filter(function (tag) {
						return tag.type === "author";
					}).map(function (tag) {
						return tag.string;
					});
					classObj.extends = block.tags.filter(function (tag) {
						return tag.type === "extends";
					}).map(function (tag) {
						return tag.string;
					})[0];
					classObj.override = block.tags.filter(function (tag) {
						return tag.type === "override";
					}).map(function (tag) {
						return tag.string;
					})[0];
					descriptionArray = (block.description.summary || "").split("\n");
					classObj.title = descriptionArray[0].replace(/<.*?>/g, "");
					classObj.brief = descriptionArray[2] && descriptionArray[2].replace(/<.*?>/g, "") || "";
					classObj.description = prepareNote(deleteBR(block.description.body));

					classObj.isPrivate = block.isPrivate;
					classObj.isInternal = !!(block.tags.filter(function (tag) {
						return tag.type === "internal";
					})[0]);
					classObj.since = block.tags.filter(function (tag) {
						return tag.type === "since";
					}).map(function (tag) {
						return tag.string;
					})[0];
					classObj.deprecated = block.tags.filter(function (tag) {
						return tag.type === "deprecated";
					}).map(function (tag) {
						return tag.string;
					})[0];
					classObj.code = block.code;
					classObj.properties = [];
					classObj.events = [];
					classObj.options = [];
					classObj.methods = [];
					classObj.children = [];
					if (classObj.extends && docsStructure[classObj.extends]) {
						docsStructure[classObj.extends].children.push(classObj.name);
						classObj.methods = docsStructure[classObj.extends].methods.map(function (method) {
							var newMethod = copyObject(method);

							newMethod.inherited = classObj.extends;
							// mapping inherited classname to new classname
							newMethod.params.forEach(function (param) {
								param.types = param.types.split(" | ").map(function (type) {
									return type === docsStructure[classObj.extends].shortName ?
										classObj.shortName : type;
								}).join(" | ");
							});
							if (newMethod.return && newMethod.return.types) {
								newMethod.return.types = newMethod.return.types.map(function (type) {
									return type === docsStructure[classObj.extends].shortName ?
										classObj.shortName : type;
								});
							}
							return newMethod;
						});
						classObj.events = docsStructure[classObj.extends].events.map(function (event) {
							var _event = copyObject(event);

							_event.inherited = classObj.extends;
							return _event;
						});
						classObj.options = docsStructure[classObj.extends].options.map(function (option) {
							var _option = copyObject(option);

							_option.inherited = _option.extends;
							return _option;
						});
					}
					if (classObj.override && docsStructure[classObj.override]) {
						classObj.methods = docsStructure[classObj.override].methods.map(function (method) {
							method.inherited = classObj.extends;
							return method;
						});
					}

				});
				block.tags.filter(function (tag) {
					return tag.type === "property";
				}).forEach(function (tag) {
					var classObj,
						property,
						name,
						type,
						description,
						propertiesArray,
						defaultValue,
						memberOf = block.tags.filter(function (tag) {
							return tag.type === "member";
						}).map(function (tag) {
							return tag.string;
						})[0],
						canBeNull = false;

					classObj = docsStructure[memberOf];
					if (classObj) {
						propertiesArray = tag.string.split(" ");
						type = propertiesArray.shift().replace(/[{}]/g, "").replace(/\|/g, " | ").replace(/^\?/, function replacer() {
							canBeNull = true;
							return "";
						});
						if (canBeNull) {
							type += " | null";
						}
						name = propertiesArray.shift();
						description = propertiesArray.join(" ");
						if (name) {
							name = name.replace(/[\[\]]/g, "");

							propertiesArray = name.split("=");
							name = propertiesArray.shift();
							defaultValue = propertiesArray.shift();

							property = {};

							property.types = type;
							property.defaultValue = defaultValue;
							property.tags = block.tags;
							property.description = description || block.description.full;
							property.isPrivate = !!(block.tags.filter(function (tag) {
								return tag.type === "private";
							})[0]);
							property.isInternal = !!(block.tags.filter(function (tag) {
								return tag.type === "internal";
							})[0]);
							property.isProtected = !!(block.tags.filter(function (tag) {
								return tag.type === "protected";
							})[0]);
							property.isPublic = !(property.isPrivate || property.isProtected || (property.isInternal && (template !== "dld")));
							property.code = block.code;
							if (name.match(/^options\./)) {
								name = name.substring(8);
								if (name) {
									property.name = name;
									// filter inherited options to eliminate duplicatioes
									classObj.options = classObj.options.filter(function (option) {
										return option.name !== name;
									});
									classObj.options.push(property);
								}
							} else {
								property.name = name;
								classObj.properties.push(property);
							}
						}
					} else {
						errorLogger("no memberOf for property " + tag.string + " in \n" + block.code);
					}
				});
				block.tags.filter(function (tag) {
					return tag.type === "event";
				}).forEach(function (tag) {
					var classObj,
						event,
						name,
						description,
						eventArray,
						memberOf = block.tags.filter(function (tag) {
							return tag.type === "member";
						}).map(function (tag) {
							return tag.string;
						})[0];

					classObj = docsStructure[memberOf];
					if (classObj) {
						eventArray = tag.string.split(" ");
						name = eventArray.shift();
						description = eventArray.join(" ");
						if (name) {
							event = {};
							event.name = name;
							event.tags = block.tags;
							event.description = description || block.description.full;
							event.code = block.code;
							event.isInternal = !!(block.tags.filter(function (tag) {
								return tag.type === "internal";
							})[0]);
							event.isPublic = !event.isInternal;
							classObj.events.push(event);
						}
					} else {
						errorLogger("no memberOf for event " + tag.string);
					}
				});
				block.tags.filter(function (tag) {
					return tag.type === "method";
				}).forEach(function (tag) {
					var classObj,
						method,
						inherited,
						name = tag.string,
						memberOf = block.tags.filter(function (tag) {
							return tag.type === "member";
						}).map(function (tag) {
							return tag.string;
						})[0] || "";

					classObj = docsStructure[memberOf];
					inherited = block.tags.filter(function (tag) {
						return tag.type === "inherited";
					}).map(function (tag) {
						return tag.string || true;
					})[0];
					if (inherited) {
						method = classObj.methods.filter(function (_method) {
							return _method.name !== name;
						})[0] || {};
					} else {
						method = {};
					}
					method.params = block.tags.filter(function (tag) {
						return tag.type === "param";
					}).map(function (tag) {
						var type = tag.types.join("|"),
							name = tag.name,
							canBeNull = false,
							isOptional = false,
							nameArray;

						tag.types = type.replace(/\|/g, " | ").replace(/^\?/, function replacer() {
							canBeNull = true;
							return "";
						}).replace(/\=$/, function replacer() {
							isOptional = true;
							return "";
						});
						tag.name = name.replace(/[\[\]]/g, function replacer() {
							isOptional = true;
							return "";
						});
						nameArray = tag.name.split("=");
						tag.name = nameArray.shift();
						tag.defaultValue = nameArray.shift();
						tag.isOptional = isOptional;
						tag.canBeNull = canBeNull;
						return tag;
					});
					if (method.params.length) {
						method.params[method.params.length - 1].isLast = true;
					}
					method.hasParams = !!method.params.length;

					method.since = block.tags.filter(function (tag) {
						return tag.type === "since";
					}).map(function (tag) {
						return tag.string;
					})[0];
					method.deprecated = block.tags.filter(function (tag) {
						return tag.type === "deprecated";
					}).map(function (tag) {
						return tag.string;
					})[0];
					method.name = name;
					method.tags = block.tags;
					method.examples = [];
					method.brief = block.description.summary;
					prepareDescriptionAndExamples(method, block.description.body);
					method.isPrivate = !!(block.tags.filter(function (tag) {
						return tag.type === "private";
					})[0]);
					method.isInternal = !!(block.tags.filter(function (tag) {
						return tag.type === "internal";
					})[0]);
					method.isProtected = !!(block.tags.filter(function (tag) {
						return tag.type === "protected";
					})[0]);
					method.isPublic = !(method.isPrivate || method.isProtected || (method.isInternal && (template !== "dld")) || (method.deprecated && (template === "dld")));
					method.code = block.code;
					if (classObj) {
						classObj.methods = classObj.methods.filter(function (_method) {
							return _method.name !== method.name;
						});
						classObj.methods.push(method);
					} else {
						errorLogger("no memberOf for method " + tag.string);
					}
				});
			});

			next = files.pop();
			if (next) {
				parseDox(next);
			} else {
				for (i in docsStructure) {
					if (docsStructure.hasOwnProperty(i)) {
						modules.push(docsStructure[i]);
						name = docsStructure[i].name;
						// change ej or ns to tau
						namespaceArray = name.split(".").slice(1);
						namespaceArray.unshift("tau");
						name = namespaceArray.join(".");
						docsStructure[i].name = name;
						grunt.log.ok("processing: ", i, name);
						if (name.match(widgetRegExp) &&
							(name !== "tau.widget" && name !== "tau.widget.mobile" && name !== "tau.widget.wearable" &&
									name !== "tau.widget.core" && name !== "tau.widget.tv") &&
							!(docsStructure[i].isInternal &&
							(template !== "dld")) &&
							docsStructure[i].type !== "page") {
							file = profile + "_" + namespaceArray.pop() + ".htm";
							filename = name.replace(/\./g, "/") + ".js";
							description = docsStructure[i].brief || "";
							if (docsStructure[i].children.length === 0) {
								rowsWidgets.push({
									file: file,
									namespace: name,
									name: docsStructure[i].title,
									filename: filename,
									description: description,
									since: docsStructure[i].deprecated ? "deprecated" : docsStructure[i].since
								});
							}
							series.push(createWidgetDoc.bind(null, newFile,
								file, docsStructure[i]));
						} else if (name.match(/^tau\.event/) &&
							!(docsStructure[i].isInternal &&
							(template !== "dld")) &&
							docsStructure[i].type !== "page") {
							file = name.replace(/\./g, "_") + ".htm";
							filename = name.replace(/\./g, "/") + ".js";
							description = docsStructure[i].brief || "";
							rowsEvents.push({file: "../class/" + file,
								namespace: name,
								name: docsStructure[i].title,
								filename: filename,
								description: description
							});
							series.push(createClassDoc.bind(null, newFile,
								file, name, docsStructure[i]));
						} else if (name.match(/^tau\.util/) &&
							!(docsStructure[i].isInternal &&
							(template !== "dld")) &&
							docsStructure[i].type !== "page") {
							file = name.replace(/\./g, "_") + ".htm";
							filename = name.replace(/\./g, "/") + ".js";
							name = docsStructure[i].title;
							description = docsStructure[i].brief || "";
							rowsUtil.push({file: "../class/" + file,
								namespace: name,
								name: docsStructure[i].title,
								filename: filename,
								description: description
							});
							series.push(createClassDoc.bind(null, newFile,
								file, name, docsStructure[i]));
						} else if (name.match(/^tau\.page/) &&
							!(docsStructure[i].isInternal &&
							(template !== "dld"))) {
							series.push(createBlock.bind(null, newFile,
								docsStructure[i], name.replace(/^tau/, "").replace(/\./g, "/") + ".htm"));
						} else if (docsStructure[i].type !== "page") {
							file = name.replace(/\./g, "_") + ".htm";
							filename = name.replace(/\./g, "/") + ".js";
							description = docsStructure[i].brief || "";
							rowsClasses.push({file: file,
								name: docsStructure[i].title,
								namespace: name,
								filename: filename,
								description: description}
							);
							series.push(createClassDoc.bind(null, newFile, file, name, docsStructure[i]));
						}
					}
				}

				series.push(createBlockIndex.bind(null, newFile, docsStructure, "widget", rowsWidgets));
				series.push(createBlockIndex.bind(null, newFile, docsStructure, "event", rowsEvents));
				series.push(createBlockIndex.bind(null, newFile, docsStructure, "util", rowsUtil));
				series.push(createClassIndex.bind(null, newFile, docsStructure, rowsClasses));
				if (profile !== "mobile_support") {
					series.push(createIndex.bind(null, newFile, docsStructure.ns, []));
				}
				series.push(done);

				grunt.file.write(structureFile, "window.tauDocumentation = " + JSON.stringify(modules) + ";");
				async.series(series);
			}
		}

		this.files.forEach(function (f) {
			f.src.forEach(function (file) {
				files.push(file);
			});
		});
		prepareMDDocs(profile);
		next = files.pop();
		if (next) {
			parseDox(next);
		}
	});

	function prepareFilesList(done, output) {
		var result = rjsBuildAnalysis.parse(output),
			slice = [].slice;

		if (result && result.bundles.length > 0) {
			slice.call(result.bundles[0].children).forEach(function (modulePath) {
				var mdFile = modulePath.replace(/(\.js)+/gi, ".md"),
					moduleName = path.relative("src/js/", modulePath).replace(/(\.js)+/gi, "").split(path.sep),
					files = grunt.file.expand(mdFile);

				if (files.length) {
					if (moduleName[0] === "profile") {
						moduleName.shift();
						moduleName.shift();
					}
					moduleName.unshift("tau");
					additionalDocs[moduleName.join(".")] = prepareNote(marked(grunt.file.read(mdFile)));
				}
			});
		}
		done();
	}

	grunt.registerMultiTask("analize-docs", "", function () {
		var configProperty = grunt.config.get("requirejs"),
			profile = this.data.profile;

		configProperty["docs-" + profile] = configProperty[profile];
		configProperty["docs-" + profile].options.out = path.join("tmp", "docs.js");
		configProperty["docs-" + profile].options.done = prepareFilesList.bind(null);
		grunt.config.set("requirejs", configProperty);

		grunt.task.run("requirejs:docs-" + profile, "docs-html:" + profile);
	});
};
