/*global window, define, ns */
/*jslint plusplus: true, nomen: true */
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
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, frameworkNamespace, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./navigator",
			"../../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/**
			 * Browser properties
			 * @property {Object} browser
			 * @property {boolean} browser.tizen
			 * @member ns
			 */
			frameworkNamespace.browser = {
				tizen: !!window.navigator.userAgent.match(/tizen/i)
			}

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, ns, window.tau));
