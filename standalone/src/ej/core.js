/*global window, console, define */
/** @namespace ej */
(function (window) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(function () {
		//>>excludeEnd("ejBuildExclude");
		var idCounter = 0,
			idNumberCounter = 0,
			currentDate = (new Date()).getTime(),
			slice = [].slice,
			/**
			* Ej core namespace
			* @class ej
			*/
			ej = {
				/**
				* Return unique id
				* @method getUniqueId
				* @static
				* @return {string}
				* @memberOf ej
				*/
				getUniqueId: function () {
					var uniqueId = "ej-" + idCounter + "-" + currentDate;
					idCounter += 1;
					return uniqueId;
				},

				/**
				* Return unique id
				* @method getNumberUniqueId
				* @static
				* @return {number}
				* @memberOf ej
				*/
				getNumberUniqueId: function () {
					var uniqueId = idNumberCounter;
					idNumberCounter += 1;
					return uniqueId;
				},

				/**
				* logs supplied messages/arguments
				* @method log
				* @static
				* @param {...*} argument
				* @memberOf ej
				*/
				log: function () {
					var args = slice.call(arguments),
						dateNow = new Date();
					args.unshift('[ej][' + dateNow.toLocaleString() + ']');
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
					var args = slice.call(arguments),
						dateNow = new Date();
					args.unshift('[ej][' + dateNow.toLocaleString() + ']');
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
					var args = slice.call(arguments),
						dateNow = new Date();
					args.unshift('[ej][' + dateNow.toLocaleString() + ']');
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
					if (typeof window.ejConfig === "object") {
						return window.ejConfig[key] !== undefined ? window.ejConfig[key] : defaultValue;
					}
					return defaultValue;
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
					if (typeof window.ejConfig === "object") {
						window.ejConfig[key] = value;
						return true;
					}
					return false;
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
}(window));
