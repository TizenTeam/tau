/*global window, define*/
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
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
/*jslint bitwise: true */
/*
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/core",
			"../../core/support/tizen"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// Default configuration properties for wearable
			ns.setConfig("autoBuildOnPageChange", false, true);

			if(ns.support.shape.circle) {
				ns.setConfig("pageTransition", "pop");
				ns.setConfig("popupTransition", "slideup");

				ns.setConfig("popupFullSize", true);
				ns.setConfig("scrollEndEffectArea", "screen");
				ns.setConfig("enablePageScroll", true);
				ns.setConfig("enablePopupScroll", true);
			} else {
				ns.setConfig("popupTransition", "slideup");
				ns.setConfig("enablePageScroll", false);
				ns.setConfig("enablePopupScroll", false);
			}
			// .. other possible options
			// ns.setConfig('autoInitializePage', true);
			// ns.setConfig('pageContainer', document.body); // defining application container for wearable

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
