/*global window, define, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/*
 * Defaults settings object
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @class ns.defaults
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

			ns.defaults = {};

			Object.defineProperty(ns.defaults, "autoInitializePage", {
				 get: function(){
					 return ns.getConfig("autoInitializePage", true);
				 },
				 set: function(value){
					 return ns.setConfig("autoInitializePage", value);
				 }
			});

			Object.defineProperty(ns.defaults, "dynamicBaseEnabled", {
				 get: function(){
					 return ns.getConfig("dynamicBaseEnabled", true);
				 },
				 set: function(value){
					 return ns.setConfig("dynamicBaseEnabled", value);
				 }
			});

			Object.defineProperty(ns.defaults, "pageTransition", {
				 get: function(){
					 return ns.getConfig("pageTransition", "none");
				 },
				 set: function(value){
					 return ns.setConfig("pageTransition", value);
				 }
			});

			Object.defineProperty(ns.defaults, "popupTransition", {
				 get: function(){
					 return ns.getConfig("popupTransition", "none");
				 },
				 set: function(value){
					 return ns.setConfig("popupTransition", value);
				 }
			});

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
