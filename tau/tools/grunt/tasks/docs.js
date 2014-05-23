/*global require, module, __dirname, process */
/*
 * Generating docs Ej
 *
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
	'use strict';
	var path = require("path"),
		mu = require('mu2'),
		fs = require('fs'),
		dox = require('dox'),
		async = require('async');
	mu.root = __dirname + '/templates';

	grunt.registerMultiTask('sdk-docs-html', '', function () {
		var done = this.async(),
			docsStructure = {},
			profile = this.data.profile,
			files = [],
			serie = [],
			next;

		function createWidgetDoc(newFile, file, name,  docsStructure, callback) {
			var string = "",
				toc = [],
				parentToc = {
					1: {
						toc: toc
					}
				},
				description;
			grunt.log.ok("Start generating file for widget ", file);
			docsStructure.methods.sort(function(a, b) {
				return a.name > b.name ? 1 : -1;
			});
			docsStructure.options.sort(function(a, b) {
				return a.name > b.name ? 1 : -1;
			});
			description = docsStructure.description.replace(/(<h([2-4])>)(.*?)(<\/h[2-4]>)/ig, function (match, p1, p2, p3, p4) {
				var name = p3.replace(" ", "-").toLowerCase() + (Math.random(100)),
					level = parseInt(p2, 10);
				parentToc[level] = {
					href: name,
					name: p3,
					toc: []
				};
				if (parentToc[level-1]) {
					parentToc[level - 1].hasTOC = true;
					parentToc[level - 1].toc.push(parentToc[level]);
				}
				return p1 + "<a id='" + name + "'></a>" + p3 + p4;
			});
			if (docsStructure.options.length) {
				toc.push({
					href: "options-list",
					name: "Options list",
					toc: []
				});
			}
			if (docsStructure.events.length) {
				toc.push({
					href: "events-list",
					name: "Events list",
					toc: []
				});
			}
			if (docsStructure.methods.length) {
				toc.push({
					href: "methods-list",
					name: "Methods list",
					hasTOC: true,
					toc: docsStructure.methods.filter(function (method) {
						return method.isPublic;
					}).map(function (method) {
						return {
							href: "method-" + method.name,
							name: method.name
						};
					})
				});
			}
			mu.compileAndRender('widget.mustache', {
				title: name,
				brief: docsStructure.brief,
				description: description.replace(/@example/g, "").replace(/\<pre\>\<code\>\s*\n/g, "<pre class=\"prettyprint\">").replace(/\<\/code\>/g, ""),
				toc: toc,
				seeMore: docsStructure.seeMore,
				options: docsStructure.options,
				showOptions: docsStructure.options.length,
				events: docsStructure.events,
				showEvents: docsStructure.events.length,
				methods: docsStructure.methods,
				showMethods: docsStructure.methods.length,
				since: docsStructure.since
			}).on('data', function (data) {
				string += data.toString();
			}).on('end', function () {
				grunt.file.write(newFile + "html/widgets/" + file, string);
				grunt.log.ok("Finished generating file for widget ", file);
				callback();
			});
		}

		function createWidgetIndex(newFile, docsStructure, rows, callback) {
			var string = "";
			rows.sort(function(a, b) {
			   return a.name > b.name ? 1 : -1;
			});
			var widgetsDoc = docsStructure["ns.widget.mobile"] || docsStructure["ns.widget.wearable"] || docsStructure["ns.widget.tv"];
			mu.compileAndRender('index.mustache', {
				title: widgetsDoc.title,
				description: widgetsDoc.description.full,
				seeMore: widgetsDoc.seeMore,
				table: {
					caption: "Table: Tizen Widgets",
					module: "Widget",
					rows: rows
				}
			}).on('data', function (data) {
				string += data.toString();
			}).on('end', function () {
				grunt.file.write(newFile + "html/widgets/widget_reference.htm", string);
				callback();
			});
		}

		function parseDox(file) {
			var docs,
				doxFile = file.replace('dist', 'tmp/dox'),
				structureFile = 'docs/dox.json',
				newFile = 'docs/sdk/' + profile + '/',
				modules = [],
				i,
				next,
				string = '',
				jsContent;

			jsContent = grunt.file.read(file);
			docs = dox.parseComments(jsContent);
			grunt.file.write(doxFile, JSON.stringify(docs));

			docs.forEach(function (block) {
				block.tags.filter(function (tag) {
					return tag.type === 'page';
				}).forEach(function (tag) {
					var pageObj = {
						name: tag.string
					};
					docsStructure[tag.string] = pageObj;
					pageObj.authors = block.tags.filter(function (tag) {
						return tag.type === 'author';
					}).map(function (tag) {
						return tag.string
					});
					pageObj.title = block.tags.filter(function (tag) {
						return tag.type === 'title';
					}).map(function (tag) {
						return tag.string
					})[0];
					pageObj.type = 'page';
					pageObj.description = block.description;
					pageObj.seeMore = block.tags.filter(function (tag) {
						return tag.type === 'seeMore';
					}).map(function (tag) {
						var valueArray = tag.string.split(" "),
							file = valueArray.shift(),
							name = valueArray.join(" ");
						return {file: file, name: name};
					});
				});
				block.tags.filter(function (tag) {
					return tag.type === 'class';
				}).forEach(function (tag) {
					var classObj = {
							name: tag.string
						},
						descriptionArray
					docsStructure[tag.string] = classObj;
					classObj.authors = block.tags.filter(function (tag) {
						return tag.type === 'author';
					}).map(function (tag) {
						return tag.string
					});
					classObj.extends = block.tags.filter(function (tag) {
						return tag.type === 'extends';
					}).map(function (tag) {
						return tag.string;
					})[0];
					classObj.override = block.tags.filter(function (tag) {
						return tag.type === 'override';
					}).map(function (tag) {
						return tag.string;
					})[0];
					descriptionArray = (block.description.summary || "").split("\n");
					classObj.title = descriptionArray[0].replace(/\<.*?\>/g, "");
					classObj.brief = descriptionArray[2] && descriptionArray[2].replace(/\<.*?\>/g, "") || "";
					classObj.description = block.description.body;

					classObj.isPrivate = block.isPrivate;
					classObj.isInternal = !!(block.tags.filter(function (tag) {
						return tag.type === 'internal';
					})[0]);
					classObj.since = block.tags.filter(function (tag) {
						return tag.type === 'since';
					}).map(function (tag) {
						return tag.string;
					})[0];
					classObj.code = block.code;
					classObj.properties = [];
					classObj.events = [];
					classObj.options = [];
					classObj.methods = [];
					if (classObj.extends && docsStructure[classObj.extends]) {
						classObj.methods = docsStructure[classObj.extends].methods.slice(0);
						classObj.events = docsStructure[classObj.extends].events.slice(0);
					}
					if (classObj.override && docsStructure[classObj.override]) {
						classObj.methods = docsStructure[classObj.override].methods.slice(0);
					}

				});
				block.tags.filter(function (tag) {
					return tag.type === 'property';
				}).forEach(function (tag) {
					var classObj,
						property,
						name,
						type, description,
						propertiesArray,
						defaultValue,
						memberOf = block.tags.filter(function (tag) {
							return tag.type === 'member';
						}).map(function (tag) {
							return tag.string
						})[0],
						canBeNull = false;
					classObj = docsStructure[memberOf];
					if (classObj) {
						propertiesArray = tag.string.split(" ");
						type = propertiesArray.shift().replace(/[{}]/g, '').replace(/\|/g, " | ").replace(/^\?/, function replacer(match, offset, string){
							canBeNull = true;
							return "";
						});
						if (canBeNull) {
							type += " | null";
						}
						name = propertiesArray.shift();
						description = propertiesArray.join(" ");
						if (name) {
							name = name.replace(/[\[\]]/g, '');

							propertiesArray = name.split('=');
							name = propertiesArray.shift();
							defaultValue = propertiesArray.shift();

							property = {};

							property.types = type;
							property.defaultValue = defaultValue;
							property.tags = block.tags;
							property.description = description || block.description.full;
							property.isPrivate = block.isPrivate;
							property.code = block.code;
							if (name.match(/^options/)) {
								name = name.substring(8);
								property.name = "data-" + name.replace(/[A-Z]/g, function (c) {
									return "-" + c.toLowerCase();
								});
								classObj.options.push(property);
							} else {
								property.name = name;
								classObj.properties.push(property);
							}
						}
					} else {
						grunt.log.error('no memberOf for property ', tag.string);
					}
				});
				block.tags.filter(function (tag) {
					return tag.type === 'event';
				}).forEach(function (tag) {
					var classObj,
						event,
						name,
						description,
						eventArray,
						memberOf = block.tags.filter(function (tag) {
							return tag.type === 'member';
						}).map(function (tag) {
							return tag.string
						})[0];
					classObj = docsStructure[memberOf];
					if (classObj) {
						eventArray = tag.string.split(" ");
						name = eventArray.shift();
						description = eventArray.join(" ");
						if (name) {
							event = {}
							event.name = name;
							event.tags = block.tags;
							event.description = description || block.description.full;
							event.code = block.code;
							classObj.events.push(event);
						}
					} else {
						grunt.log.error('no memberOf for event ', tag.string);
					}
				});
				block.tags.filter(function (tag) {
					return tag.type === 'method';
				}).forEach(function (tag) {
					var classObj,
						method,
						memberOf = block.tags.filter(function (tag) {
							return tag.type === 'member';
						}).map(function (tag) {
							return tag.string
						})[0] || "";
					classObj = docsStructure[memberOf];
					method = {};
					method.params = block.tags.filter(function (tag) {
						return tag.type === 'param';
					}).map(function(tag) {
						var type = tag.types.join("|"),
							name = tag.name,
							canBeNull = false,
							isOptional = false,
							nameArray;
						tag.types = type.replace(/\|/g, " | ").replace(/^\?/, function replacer(match, offset, string){
							canBeNull = true;
							return "";
						}).replace(/\=$/, function replacer(match, offset, string){
							isOptional = true;
							return "";
						});
						tag.name = name.replace(/[\[\]]/g, function replacer(match, offset, string){
							isOptional = true;
							return "";
						});
						nameArray = tag.name.split('=');
						tag.name = nameArray.shift();
						tag.defaultValue = nameArray.shift();
						tag.isOptional = isOptional;
						return tag;
					});
					if (method.params.length) {
						method.params[method.params.length - 1].isLast = true;
					}
					method.hasParams = !!method.params.length;
					method.return = block.tags.filter(function (tag) {
						return tag.type === 'chainable';
					}).map(function(tag) {
						return {types: [memberOf.replace("ns.widget.mobile.", "")], description: "return this"}
					}).concat(block.tags.filter(function (tag) {
						return tag.type === 'return' || tag.type === 'returns';
					}))[0];
					method.since = block.tags.filter(function (tag) {
						return tag.type === 'since';
					}).map(function(tag) {
						return tag.string;
					})[0];
					method.name = tag.string;
					method.tags = block.tags;
					method.example = "";
					method.brief = block.description.summary;
					method.description = block.description.body.replace(/@example/gm, "").replace(/<pre><code>(.|\n)*?<\/code><\/pre>/m, function (match, p1) {
						method.example = match.replace(/\n* *<\/?(pre|code)> *\n*/gm, "");
						return "";
					});
					method.isPrivate = !!(block.tags.filter(function (tag) {
						return tag.type === 'private';
					})[0]);
					method.isInternal = !!(block.tags.filter(function (tag) {
						return tag.type === 'internal';
					})[0]);
					method.isProtected = !!(block.tags.filter(function (tag) {
						return tag.type === 'protected';
					})[0]);
					method.isPublic = !(method.isPrivate || method.isProtected || method.isInternal);
					method.code = block.code;
					if (classObj) {
						classObj.methods = classObj.methods.filter(function(_method) {
							return _method.name !== method.name;
						});
						classObj.methods.push(method);
					} else {
						grunt.log.error('no memberOf for method ', tag.string);
					}
				});
			});

			next = files.pop();
			if (next) {
				parseDox(next);
			} else {
				var rows = [];

				for (i in docsStructure) {
					if (docsStructure.hasOwnProperty(i)) {
						modules.push(docsStructure[i]);
						if (docsStructure[i].name.match(/^ns\.widget/) && !docsStructure[i].isInternal && docsStructure[i].type !== "page") {
							var file = docsStructure[i].name.replace(/\./g, "_") + ".htm",
								name = docsStructure[i].title,
								description = docsStructure[i].brief || "";
							rows.push({file: file,
									name: name,
									description: description}
							);
							serie.push(createWidgetDoc.bind(null, newFile, file, name, docsStructure[i]));
						}
					}
				}

				serie.push(createWidgetIndex.bind(null, newFile, docsStructure, rows));
				serie.push(done);

				grunt.file.write(structureFile, JSON.stringify(modules));
				async.series(serie);


			}

		}

		this.files.forEach(function (f) {
			f.src.forEach(function (file) {
				files.push(file);
			});
		});
		next = files.pop();
		if (next) {
			parseDox(next);
		}
	});

};