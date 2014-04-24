/*global window, define */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../events", // fetch namespace
			"../utils/events"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var throttledresize = { // referenced throttledresize
					"enabled": ns.get("enableThrottleResize", true),
					"ttl": 250
				},
				timerID,
				eventUtils = ns.utils.events,
				resizeHandler = function () {
					if (timerID) {
						window.clearTimeout(timerID);
					}
					timerID = window.setTimeout(function () {
						eventUtils.trigger(window, "throttledresize");
					}, throttledresize.ttl);
				},
				enable = function () {
					if (!throttledresize.enabled) {
						throttledresize.enabled = true;
					}
					window.addEventListener("resize", resizeHandler, true);
				};

			if (throttledresize.enabled) {
				enable();
			}

			throttledresize.enable = enable;

			/**
			* Namespace to support throttledresize event
			* @class ns.events.throttledresize
			*/
			/**
			* Event throttledresize
			* @event throttledresize
			* @member ns.events.throttledresize
			*/
			ns.events.throttledresize = throttledresize;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.events.throttledresize;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
