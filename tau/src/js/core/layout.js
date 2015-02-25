/*global window, define */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*
 * #Namespace for Layouts
 *
 * ## Creating new layout
 *
 * New layout has to have implemented methods:
 *  - configure
 *  - enable
 *  - disable
 *
 * All of these methods have to be static and take two arguments:
 * - instance of Box widget
 * - widget's element
 *
 * Moreover new layout has to have property "name" with the name of layout.
 *
 * Layout can be used only if it is registered in widget Box. Layout can register
 * itself by calling method *Box.register* and giving two arguments: name and object,
 * which describes all properties and static methods of layout.
 *
 *      @example
 *      var layout = {};
 *
 *      layout.name = "layout_name";
 *
 *      layout.configure = function (self, element) {
 *           // configure layout
 *           // e.g. set options connected with this layout
 *      }
 *
 *      layout.enable = function (self, element) {
 *           // enable layout
 *           // e.g. add proper CSS classes for element,
 *           //      create CSS rules for layout
 *      }
 *
 *      layout.disable = function (self, element) {
 *           // disable layout
 *           // (revert all changes, which are made in function "enable")
 *           // e.g. remove CSS classes
 *      }
 *
 *      Box.register("layout_name", layout);
 *
 *
 *
 * @class ns.layout
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
			ns.layout = ns.layout || {};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.layout;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));

