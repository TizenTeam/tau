/*global window, define, Event, console, ns */
/*jslint nomen: true, plusplus: true */
/**
 * section Changer widget
 * @class ns.widget.SectionChanger
 * @extends ej.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../type"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			// scroller.start event trigger when user try to move scroller

			ns.widget.micro.scroller.scrollbar.type.interface = {
				insertAndDecorate: function (/* options */) {
				},
				start: function (/* scrollbarElement, barElement */) {
				},
				end: function (/* scrollbarElement, barElement */) {
				},
				offset: function (/* orientation, offset  */) {
				}
			};
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, ns));