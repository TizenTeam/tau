/*global window, define, Event, console, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Type Interface
 * Interface for types used in scroll bar widget.
 * @class ns.widget.wearable.scroller.scrollbar.type.interface
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../type"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// scroller.start event trigger when user try to move scroller

			ns.widget.wearable.scroller.scrollbar.type.interface = {
				/**
				 * Inserts elements end decorate.
				 * @method insertAndDecorate
				 * @param options
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.interface
				 */
				insertAndDecorate: function (/* options */) {
				},
				/**
				 * Removes element.
				 * @method remove
				 * @param options
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.interface
				 */
				remove: function (/* options */) {
				},
				/**
				 * ...
				 * @method start
				 * @param scrollbarElement
				 * @param barElement
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.interface
				 */
				start: function (/* scrollbarElement, barElement */) {
				},
				/**
				 * ...
				 * @method end
				 * @param scrollbarElement
				 * @param barElement
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.interface
				 */
				end: function (/* scrollbarElement, barElement */) {
				},
				/**
				 * ...
				 * @method offset
				 * @param orientation
				 * @param offset
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.interface
				 */
				offset: function (/* orientation, offset  */) {
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
