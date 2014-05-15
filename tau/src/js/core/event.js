/*global window, ns, define, CustomEvent */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * events namespace
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var event = ns.event || {};

			/**
			* Device is supporting touches or not.
			* @property touchDevice
			* @return {boolean}
			* @memberOf ns.events
			* @static
			*/
			event.touchDevice = 'ontouchstart' in window;

			ns.event = event;
            //>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
