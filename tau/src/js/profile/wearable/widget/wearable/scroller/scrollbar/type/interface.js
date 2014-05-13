/*global window, define, Event, console, ns */
/*jslint nomen: true, plusplus: true */
/**
 * section Changer widget
 * @class ns.widget.SectionChanger
 * @extends ns.widget.BaseWidget
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
				insertAndDecorate: function (/* options */) {
				},
				start: function (/* scrollbarElement, barElement */) {
				},
				end: function (/* scrollbarElement, barElement */) {
				},
				offset: function (/* orientation, offset  */) {
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));