/*global window, define*/
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
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
