/*global window, define, ns */
/*jslint nomen: true, plusplus: true, bitwise: false */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Template Engine
 * @class ns.template
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var template,
				templateFunctions = {},
				globalOptions = {
					"pathPrefix": "",
					"default" : ""
				};

			/**
			 * Function to get global option
			 *
			 * 	@example
			 * 		tau.template.get("pathPrefix");
			 * 		// -> "/prefix/to/all/paths"
			 *
			 * @method get
			 * @param {string} name param name which will be return
			 * @return {*} return value of option
			 * @member ns.template
			 */
			function get(name) {
				return globalOptions[name];
			}

			/**
			 * Function to set global option
			 *
			 * 	@example
			 * 		tau.template.set("pathPrefix", "/views");
			 *
			 * @method set
			 * @param {string} name param name which will be set
			 * @param {*} value value to set
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
			 * 	- globalOptions - global options of template engine
			 * 	- path - path or id of template content
			 * 	- data - data for template render
			 * 	- callback - callback call on finish
			 *
			 * and should call callback on finish with arguments:
			 *
			 * 	- status - object describing status of render
			 * 	- element - base HTMLElement of template results (on error can be null)
			 *
			 * 	@exmaple
			 * 		tau.template.register("inline", function(globalOptions, path, data, callback) {
			 *
			 * 		});
			 *
			 * @method register
			 * @param {string} name Engine name
			 * @param {function} templateFunction function to renderer template
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
			 * @member ns.template
			 */
			function engine(name) {
				return templateFunctions[name];
			}

			/**
			 * Return HTMLElement for given path
			 *
			 * 	@example
			 * 		tau.template.render("external/path/to/file.html", {additionalParameter: true}, function(status, element) {
			 * 			if (status.success) {
			 * 				document.body.appendChild(element);
			 * 			} else {
			 * 				console.error(status.description);
			 * 			}, "html");
			 *
			 * @method render
			 * @param {string} path Path to file ot other id for template system
			 * @param {Object} data additional data for template system
			 * @param {function} callback function which will be called on finish
			 * @param {string} [engineName] engine name
			 * @member ns.template
			 */
			function render(path, data, callback, engineName) {
				var templateFunction = templateFunctions[engineName || get("default") || ""];

				// if template engine name and default name is not given then we
				// take first registered engine
				if (!templateFunction) {
					templateFunction = templateFunctions[Object.keys(templateFunctions).pop()];
				}

				// if template system exists then we go to him
				if (templateFunction) {
					templateFunction(globalOptions, path, data || {}, callback);
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
}(window, window.document, ns));
