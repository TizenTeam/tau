/*global window, console, define, ns, nsConfig */
/*jslint plusplus:true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Core namespace
 * @class ns
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns, nsConfig) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(function () {
		//>>excludeEnd("tauBuildExclude");
		var idNumberCounter = 0,
			currentDate = +new Date(),
			slice = [].slice,
			rootNamespace = nsConfig.rootNamespace,
			fileName = nsConfig.fileName,
			infoForLog = function (args) {
				var dateNow = new Date();
				args.unshift('[' + rootNamespace + '][' + dateNow.toLocaleString() + ']');
			};

		/**
		* Return unique id
		* @method getUniqueId
		* @static
		* @return {string}
		* @member ns
		*/
		ns.getUniqueId = function () {
			return rootNamespace + "-" + ns.getNumberUniqueId() + "-" + currentDate;
		};

		/**
		* Return unique id
		* @method getNumberUniqueId
		* @static
		* @return {number}
		* @member ns
		*/
		ns.getNumberUniqueId = function () {
			return idNumberCounter++;
		};

		/**
		* logs supplied messages/arguments
		* @method log
		* @static
		* @param {...*} argument
		* @member ns
		*/
		ns.log = function (argument) {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.log.apply(console, args);
			}
		};

		/**
		* logs supplied messages/arguments ad marks it as warning
		* @method warn
		* @static
		* @param {...*} argument
		* @member ns
		*/
		ns.warn = function (argument) {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.warn.apply(console, args);
			}
		};

		/**
		* logs supplied messages/arguments and marks it as error
		* @method error
		* @static
		* @param {...*} argument
		* @member ns
		*/
		ns.error = function (argument) {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.error.apply(console, args);
			}
		};

		/**
		* get from nsConfig
		* @method getConfig
		* @param {string} key
		* @param {*} defaultValue
		* @return {*}
		* @static
		* @member ns
		*/
		ns.getConfig = function (key, defaultValue) {
			return nsConfig[key] === undefined ? defaultValue : nsConfig[key];
		};

		/**
		 * set in nsConfig
		 * @method setConfig
		 * @param {string} key
		 * @param {*} value
		 * @param {boolean} [asDefault=false] value should be treated as default (doesn't overwrites the config[key] if it already exists)
		 * @static
		 * @member ns
		*/
		ns.setConfig = function (key, value, asDefault) {
			if (!asDefault || (asDefault && nsConfig[key] === undefined)) {
				nsConfig[key] = value;
			}
		};

		/**
		 * Return path for framework script file.
		 * @method getFrameworkPath
		 * @returns {?string}
		 * @member ns
		 */
		ns.getFrameworkPath = function () {
			var scripts = document.getElementsByTagName('script'),
				countScripts = scripts.length,
				i,
				url,
				arrayUrl,
				count;
			for (i = 0; i < countScripts; i++) {
				url = scripts[i].src;
				arrayUrl = url.split('/');
				count = arrayUrl.length;
				if (arrayUrl[count - 1] === fileName + '.js' || arrayUrl[count - 1] === fileName + '.min.js') {
					return arrayUrl.slice(0, count - 1).join('/');
				}
			}
			return null;
		};

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		return ns;
	});
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns, nsConfig));
