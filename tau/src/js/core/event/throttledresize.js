/*global window, define */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Event throttledresize
 * Object supports throttledresize event.
 * @class ns.event.throttledresize
 */
/**
 * Event throttledresize
 * @event throttledresize
 * @member ns.event.throttledresize
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../event" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var throttledresize = {
					/**
					 * State of event support
					 * @property {boolean} [enabled=true]
					 * @static
					 * @member ns.event.throttledresize
					 */
					enabled: ns.getConfig("enableThrottleResize", true),
					/**
					 * Timeout of triggering event.
					 * @property {number} [ttl=250]
					 * @static
					 * @member ns.event.throttledresize
					 */
					ttl: 250
				},
				timerID,
				eventUtils = ns.event,
				resizeHandler = function () {
					if (timerID) {
						window.clearTimeout(timerID);
					}
					timerID = window.setTimeout(function () {
						eventUtils.trigger(window, "throttledresize");
					}, throttledresize.ttl);
				},
				/**
				 * Enables event support
				 * @method enable
				 * @static
				 * @member ns.event.throttledresize
				 */
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

			ns.event.throttledresize = throttledresize;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.throttledresize;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
