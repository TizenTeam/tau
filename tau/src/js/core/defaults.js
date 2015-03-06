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
			"./core"
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

			Object.defineProperty(ns.defaults, "popupFullSize", {
				get: function(){
					return ns.getConfig("popupFullSize", false);
				},
				set: function(value){
					return ns.setConfig("popupFullSize", value);
				}
			});

			Object.defineProperty(ns.defaults, "enablePageScroll", {
				get: function(){
					return ns.getConfig("enablePageScroll", false);
				},
				set: function(value){
					return ns.setConfig("enablePageScroll", value);
				}
			});

			Object.defineProperty(ns.defaults, "scrollEndEffectArea", {
				get: function(){
					return ns.getConfig("scrollEndEffectArea", "content");
				},
				set: function(value){
					return ns.setConfig("scrollEndEffectArea", value);
				}
			});

			Object.defineProperty(ns.defaults, "enablePopupScroll", {
				get: function(){
					return ns.getConfig("enablePopupScroll", false);
				},
				set: function(value){
					return ns.setConfig("enablePopupScroll", value);
				}
			});
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
