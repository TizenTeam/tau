/*global window, define */
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
/**
 * #Event orientationchange
 * Namespace to support orientationchange event
 * @class ns.event.orientationchange
 */
/**
 * Event orientationchange
 * @event orientationchange
 * @member ns.event.orientationchange
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../event" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var body = document.body,
				orientation = null,
				eventUtils = ns.event,
				orientationchange = {
					/**
					 * Informs about support orientation change event.
					 * @property {boolean} supported
					 * @member ns.event.orientationchange
					 */
					supported: (window.orientation !== undefined) && (window.onorientationchange !== undefined),
					/**
					 * Returns current orientation.
					 * @method getOrientation
					 * @return {"landscape"|"portrait"}
					 * @member ns.event.orientationchange
					 * @static
					 */
					getOrientation: function () {
						return orientation;
					},
					/**
					 * Triggers event orientationchange on element
					 * @method trigger
					 * @param {HTMLElement} element
					 * @member ns.event.orientationchange
					 * @static
					 */
					trigger: function (element) {
						eventUtils.trigger(element, "orientationchange", {'orientation': orientation});
					},
					/**
					 * List of properties copied to event details object
					 * @property {Array} properties
					 * @member ns.event.orientationchange
					 * @static
					 */
					properties: ['orientation']
				},
				detectOrientationByDimensions = function (omitCustomEvent) {
					var width = window.innerWidth,
						height = window.innerHeight;
					if (window.screen) {
						width = window.screen.availWidth;
						height = window.screen.availHeight;
					}

					if (width > height) {
						orientation = "landscape";
					} else {
						orientation = "portrait";
					}

					if (!omitCustomEvent) {
						eventUtils.trigger(window, "orientationchange", {'orientation': orientation});
					}
				},
				checkReportedOrientation = function () {
					if (window.orientation) {
						switch (window.orientation) {
						case 90:
						case -90:
							orientation = "portrait";
							break;
						default:
							orientation = "landscape";
							break;
						}
					} else {
						detectOrientationByDimensions(true);
					}
				},
				matchMediaHandler = function (mediaQueryList) {
					if (mediaQueryList.matches) {
						orientation = "portrait";
					} else {
						orientation = "landscape";
					}
					eventUtils.trigger(window, "orientationchange", {'orientation': orientation});
				},
				portraitMatchMediaQueryList;

			if (orientationchange.supported) {
				window.addEventListener("orientationchange", checkReportedOrientation, false);
				checkReportedOrientation();
				// try media queries
			} else {
				if (window.matchMedia) {
					portraitMatchMediaQueryList = window.matchMedia("(orientation: portrait)");
					if (portraitMatchMediaQueryList.matches) {
						orientation = "portrait";
					} else {
						orientation = "landscape";
					}
					portraitMatchMediaQueryList.addListener(matchMediaHandler);
				} else {
					body.addEventListener("throttledresize", detectOrientationByDimensions);
					detectOrientationByDimensions();
				}
			}

			ns.event.orientationchange = orientationchange;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.orientationchange;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
