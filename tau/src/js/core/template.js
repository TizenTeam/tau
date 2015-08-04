/*global define, ns */
/*jslint nomen: true, plusplus: true, bitwise: false */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Template Manager
 *
 * Object menage template's engines and renderer HTMLElement by template engine.
 *
 * @class ns.template
 * @since 2.4
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core",
			"./util/path"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilPath = ns.util.path,
				template,
				templateFunctions = {},
				globalOptions = {
					"pathPrefix": "",
					"default" : ""
				};

			/**
			 * Function to get global option
			 *
			 *	@example
			 *		tau.template.get("pathPrefix");
			 *		// -> "/prefix/to/all/paths"
			 *
			 * @method get
			 * @param {string} name param name which will be return
			 * @return {*} return value of option
			 * @since 2.4
			 * @member ns.template
			 */
			function get(name) {
				return globalOptions[name];
			}

			/**
			 * Function to set global option
			 *
			 *	@example
			 *		tau.template.set("pathPrefix", "/views");
			 *
			 * @method set
			 * @param {string} name param name which will be set
			 * @param {*} value value to set
			 * @since 2.4
			 * @member ns.template
			 */
			function set(name, value) {
				globalOptions[name] = value;
			}

			/**
			 * Register new template function
			 *
			 * Template function should have 4 arguments:
			 *
			 *  - globalOptions - global options of template engine
			 *  - path - path or id of template content
			 *  - data - data for template render
			 *  - callback - callback call on finish
			 *
			 * and should call callback on finish with arguments:
			 *
			 *  - status - object describing status of render
			 *  - element - base HTMLElement of template results (on error can be null)
			 *
			 * after registration you can use engine in render function.
			 *
			 *	@example
			 *		tau.template.register("inline", function(globalOptions, path, data, callback) {
			 *			callback({
			 *						success: true
			 *					},
			 *					document.createElement("div")
			 *				);
			 *		});
			 *
			 * @method register
			 * @param {string} name Engine name
			 * @param {function} templateFunction function to renderer template
			 * @since 2.4
			 * @member ns.template
			 */
			function register(name, templateFunction) {
				templateFunctions[name] = templateFunction;
			}

			/**
			 * Unregister template function
			 *
			 * @method unregister
			 * @param {string} name Engine name
			 * @since 2.4
			 * @member ns.template
			 */
			function unregister(name) {
				templateFunctions[name] = null;
			}

			/**
			 * Return engine with given name
			 *
			 * @method engine
			 * @param {string} name Engine name
			 * @since 2.4
			 * @member ns.template
			 */
			function engine(name) {
				return templateFunctions[name];
			}

			/**
			 * Create absolute path for given path.
			 * If parameter withProfile is true, the returned path will have name of profile
			 * separated by dots before the last dot.
			 * @method getAbsUrl
			 * @param {string} path
			 * @param {boolean} withProfile Create path with profile's name
			 * @return {string} changed path
			 * @since 2.4
			 */
			function getAbsUrl(path, withProfile) {
				var profile = ns.info.profile,
					lastDot = path.lastIndexOf(".");

				if (utilPath.isAbsoluteUrl(path)) {
					return path;
				}

				if (withProfile) {
					path = path.substring(0, lastDot) + "." + profile + path.substring(lastDot);
				}

				return utilPath.makeUrlAbsolute((globalOptions.pathPrefix || "" ) + path, utilPath.getLocation());
			}

			/**
			 * Return HTMLElement for given path
			 *
			 * When engine name is not given then get default name from global options. If this is not set then get first registered engine.
			 *
			 * Result of this method is handed to callback. First parameter of callback is object with status. Second is HTMLElement generated by engine.
			 *
			 * Status object contains properties:
			 *
			 *  - _boolean_ success - inform about success or error
			 *  - _string_ description contains details on error
			 *
			 *	@example
			 *		tau.template.render("external/path/to/file.html", {additionalParameter: true}, function(status, element) {
			 *			if (status.success) {
			 *				document.body.appendChild(element);
			 *			} else {
			 *				console.error(status.description);
			 *			}, "html");
			 *
			 * @method render
			 * @param {string} path Path to file ot other id for template system
			 * @param {Object} data additional data for template system
			 * @param {function} callback function which will be called on finish
			 * @param {string} [engineName] engine name
			 * @since 2.4
			 * @member ns.template
			 */
			function render(path, data, callback, engineName) {
				var templateFunction = templateFunctions[engineName || get("default") || ""],
					targetCallback = function (status, element) {
						// add current patch
						status.absUrl = targetPath;
						callback(status, element);
					},
					templateCallback = function (status, element) {
						if (status.success) {
							// path was found and callback can be called
							targetCallback(status, element);
						} else {
							// try one more time with path without profile
							targetPath = getAbsUrl(path, false);
							templateFunction(globalOptions, targetPath, data || {}, targetCallback);
						}
					},
					targetPath;

				// if template engine name and default name is not given then we
				// take first registered engine
				if (!templateFunction) {
					templateFunction = templateFunctions[Object.keys(templateFunctions).pop()];
				}

				// if template system exists then we go to him
				if (templateFunction) {
					targetPath = getAbsUrl(path, true);
					templateFunction(globalOptions,targetPath, data || {}, templateCallback);
				} else {
					// else we return error
					callback({
						success: false,
						description: "Can't get engine system"
					}, null);
				}
			}

			template = {
				get: get,
				set: set,
				register: register,
				unregister: unregister,
				engine: engine,
				render: render
			};

			ns.template = template;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return template;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
