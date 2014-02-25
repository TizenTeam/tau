/*global window, console, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Ej core namespace
 * @class ej
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(function () {
		//>>excludeEnd("ejBuildExclude");
		var idNumberCounter = 0,
			currentDate = +new Date(),
			slice = [].slice,
			infoForLog = function (args) {
				var dateNow = new Date();
				args.unshift('[ej][' + dateNow.toLocaleString() + ']');
			},
			ej = {
				/**
				* Return unique id
				* @method getUniqueId
				* @static
				* @return {string}
				* @memberOf ej
				*/
				getUniqueId: function () {
					return "ej-" + this.getNumberUniqueId() + "-" + currentDate;
				},

				/**
				* Return unique id
				* @method getNumberUniqueId
				* @static
				* @return {number}
				* @memberOf ej
				*/
				getNumberUniqueId: function () {
					return idNumberCounter++;
				},

				/**
				* logs supplied messages/arguments
				* @method log
				* @static
				* @param {...*} argument
				* @memberOf ej
				*/
				log: function () {
					var args = slice.call(arguments);
					infoForLog(args);
					if (console) {
						console.log.apply(console, args);
					}
				},

				/**
				* logs supplied messages/arguments ad marks it as warning
				* @method warn
				* @static
				* @param {...*} argument
				* @memberOf ej
				*/
				warn: function () {
					var args = slice.call(arguments);
					infoForLog(args);
					if (console) {
						console.warn.apply(console, args);
					}
				},

				/**
				* logs supplied messages/arguments and marks it as error
				* @method error
				* @static
				* @param {...*} argument
				* @memberOf ej
				*/
				error: function () {
					var args = slice.call(arguments);
					infoForLog(args);
					if (console) {
						console.error.apply(console, args);
					}
				},

				/**
				* get from ejConfig
				* @method get
				* @param {string} key
				* @param {Mixed} defaultValue
				* @return {Mixed}
				* @static
				* @memberOf ej
				*/
				get: function (key, defaultValue) {
					var config = window.ejConfig || {};
					return config[key] !== undefined ? config[key] : defaultValue || undefined;
				},

				/**
				* set in ejConfig
				* @method set
				* @param {string} key
				* @param {Mixed} value
				* @return {boolean}
				* @static
				* @memberOf ej
				*/
				set: function (key, value) {
					var config = window.ejConfig || {};
					config[key] = value;
					window.ejConfig = config;
					return true;
				},

				getFrameworkPath : function () {
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
						if (arrayUrl[count - 1] === 'ej.js' || arrayUrl[count - 1] === 'ej.min.js') {
							return arrayUrl.slice(0, count - 1).join('/');
						}
					}
				}
			};

		window.ejConfig = window.ejConfig || {};

		window.ej = ej;
		//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		return ej;
	});
	//>>excludeEnd("ejBuildExclude");
}(window, window.document));
