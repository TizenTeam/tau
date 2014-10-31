/*global window, ns, define */
/*jslint plusplus: true, nomen: true */
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
(function (window, document, ns, $) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./namespace",
			"../core/engine",
			"../profile/mobile/widget/mobile/Loader"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var initLoader = function () {
					if ($) {
						$.mobile = $.mobile || {};

						// DEPRECATED Should the text be visble in the loading message?
						$.mobile.loadingMessageTextVisible = undefined;

						// DEPRECATED When the text is visible, what theme does the loading box use?
						$.mobile.loadingMessageTheme = undefined;

						// DEPRECATED default message setting
						$.mobile.loadingMessage = undefined;

						// DEPRECATED
						// Turn on/off page loading message. Theme doubles as an object argument
						// with the following shape: { theme: '', text: '', html: '', textVisible: '' }
						// NOTE that the $.mobile.loading* settings and params past the first are deprecated
						$.mobile.showPageLoadingMsg = function (theme, msgText, textonly) {
							$.mobile.loading("show", theme, msgText, textonly);
						};

						// DEPRECATED
						$.mobile.hidePageLoadingMsg = function () {
							$.mobile.loading("hide");
						};

						$.mobile.loading = function () {
							var args = Array.prototype.slice.call(arguments),
								method = args[0],
								theme = args[1],
								msgText = args[2],
								textonly = args[3],
								element = document.querySelector("[data-role=loader]") || document.createElement("div"),
								loader = ns.engine.instanceWidget(element, "Loader");

							if (method === "show") {
								loader.show(theme, msgText, textonly);
							} else if (method === "hide") {
								loader.hide();
							}
						};
					}
				},
				eventType = ns.engine.eventType,
				/**
				 * Removes events listeners on framework destroy.
				 */
				destroyLoader = function () {
					document.removeEventListener(eventType.INIT, initLoader, false);
					document.removeEventListener(eventType.DESTROY, destroyLoader, false);
				};

			// Listen when framework is ready
			document.addEventListener(eventType.INIT, initLoader, false);
			document.addEventListener(eventType.DESTROY, destroyLoader, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns, ns.jqm.jQuery));
