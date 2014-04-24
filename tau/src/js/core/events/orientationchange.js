/*global window, define */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../events", // fetch namespace
			"../utils/events"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			* Namespace to support orientationchange event
			* @class ns.events.orientationchange
			*/
			/**
			* Event orientation change
			* @event orientationchange
			* @member ns.events.orientationchange
			*/
			var body = document.body,
				orientation = null,
				eventUtils = ns.utils.events,
				orientationchange = {
					supported: (window.orientation !== undefined) && (window.onorientationchange !== undefined),
					getOrientation: function () {
						return orientation;
					},
					trigger: function (element) {
						eventUtils.trigger(element, "orientationchange", {'orientation': orientation});
					},
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

			ns.events.orientationchange = orientationchange;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.events.orientationchange;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));