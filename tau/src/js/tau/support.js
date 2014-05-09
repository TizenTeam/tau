/*global window, define, ns */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, frameworkNamespace, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tau",
			"./navigator",
			"../core/wearable/selectors",
			"../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/**
			 * Browser properties
			 * @property {Object} browser
			 * @property {boolean} browser.tizen
			 */
			frameworkNamespace.browser = {
				tizen: !!window.navigator.userAgent.match(/tizen/i)
			}

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, ns, window.tau));
