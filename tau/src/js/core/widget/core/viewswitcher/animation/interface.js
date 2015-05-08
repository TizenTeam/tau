/*global window, define, Event, console, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Animation Interface
 * Interface for animation for used viewswitcher
 * @class ns.widget.core.viewswitcher.animation.interface
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../animation"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			ns.widget.core.viewswitcher.animation.interface = {
				/**
				 * Init views position
				 * @method initPosition
				 * @param views array
				 * @param active index
				 * @static
				 * @member ns.widget.core.viewswitcher.animation.interface
				 */
				initPosition: function (/* views array, active index */) {
				},
				/**
				 * Animate views
				 * @method animate
				 * @param views array
				 * @param active index
				 * @param position
				 * @static
				 * @member ns.widget.core.viewswitcher.animation.interface
				 */
				animate: function (/* views array, active index, position */) {
				},
				/**
				 * Reset views position
				 * @method resetPosition
				 * @param views array
				 * @param active index
				 * @static
				 * @member ns.widget.core.viewswitcher.animation.interface
				 */
				resetPosition: function (/* views array, active index */) {
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
