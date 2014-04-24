/*global window, define, ns */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Date utilities
 * Namespace with helper function for date modification/parsing
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../utils" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var timeRegex = /([\-0-9.]*)(ms|s)?/i,
				date = {
					/**
					 * Convert string time length to miliseconds
					 * Note: this was implemented only for animation package
					 * and the string input should be conforming to css <time>
					 * unit definition (ref: https://developer.mozilla.org/en-US/docs/Web/CSS/time)
					 * If a different format or more functionality needs to be implemented, please
					 * change this function and usage cases in animation pacakge accordingly
					 * @method convertToMiliseconds
					 * @param {string} string
					 * @return {number}
					 * @static
					 * @member ns.utils.date
					 */
					convertToMiliseconds: function (string) {
						var parsed = string.match(timeRegex),
							miliseconds = 0,
							parsedNumber = 0;
						if (parsed.length === 3) {
							parsedNumber = parseFloat(parsed[1]) || 0;
							switch (parsed[2]) {
							case "ms":
								miliseconds = parsedNumber;
								break;
							case "s":
								miliseconds = parsedNumber * 1000;
								break;
							}
						}
						return miliseconds;
					}
				};
			ns.utils.date = date;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
