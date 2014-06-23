/*global window, define, ns */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
*
* Licensed under the Flora License, Version 1.1 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://floralicense.org/license/
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
 * #Date utilities
 * Namespace with helper function for date modification/parsing
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @class ns.util.date
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util" // fetch namespace
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
					 * @member ns.util.date
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
			ns.util.date = date;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
