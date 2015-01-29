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
			"../../core/core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var mql = window.matchMedia("(-tizen-geometric-shape: circle)");
			// Default configuration properties for wearable
			ns.setConfig("autoBuildOnPageChange", false, true);
			if(mql.matches) {
				ns.setConfig("pageTransition", "pop");
				ns.setConfig("popupTransition", "pop");
				ns.setConfig("popupFullSize", true);
				ns.setConfig("scrollEndEffectArea", "screen");
				ns.setConfig("enablePageScroll", true);
			} else {
				ns.setConfig("popupTransition", "slideup");
				ns.setConfig("enablePageScroll", false);
			}
			// .. other possible options
			// ns.setConfig('autoInitializePage', true);
			// ns.setConfig('pageContainer', document.body); // defining application container for wearable

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
