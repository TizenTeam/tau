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
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, frameworkNamespace, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/conflict",
			"./selectors"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			document.addEventListener("mobileinit", function () {
				var navigator,
					selectors = frameworkNamespace.wearable.selectors;

				ns.defaults = {
					autoInitializePage: true,
					pageTransition: 'none',
					popupTransition: 'none'
				};
				/**
				 * Set dynamic base tag changes.
				 * @property {boolean} [dynamicBaseEnabled=true]
				 * @member tau
				 */
				ns.dynamicBaseEnabled = true;
				/**
				 * @inheritdoc ns.wearable.selectors
				 * @class tau.selectors
				 * @extend ns.wearable.selectors
				 */
				ns.selectors = selectors;
				navigator = ns.navigator || {};
				/**
				 * @property {Object} defaults Default values for router
				 * @property {boolean} [defaults.fromHashChange = false]
				 * @property {boolean} [defaults.reverse = false]
				 * @property {boolean} [defaults.showLoadMsg = true]
				 * @property {number} [defaults.loadMsgDelay = 0]
				 * @member tau.navigator
				 */
				navigator.defaults = {
					fromHashChange: false,
					reverse: false,
					showLoadMsg: true,
					loadMsgDelay: 0
				};
				ns.navigator = navigator;
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, ns, window.tau));
