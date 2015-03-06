/*global window, define, Event, console, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Bar Type
 * Bar type support for scroll bar widget.
 * @class ns.widget.wearable.scroller.scrollbar.type.bar
 * @extends ns.widget.wearable.scroller.scrollbar.type.interface
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../type",
			"./interface",
			"../../Scroller",
			"../../../../../../../core/util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// scroller.start event trigger when user try to move scroller
			var utilsObject = ns.util.object,
				type = ns.widget.wearable.scroller.scrollbar.type,
				typeInterface = type.interface,
				Scroller = ns.widget.wearable.scroller.Scroller;

			type.bar = utilsObject.merge({}, typeInterface, {
				options: {
					animationDuration: 500
				},

				/**
				 * @method setScrollbar
				 * @param viewLayout
				 * @param firstChildLayout
				 * @param clipLayout
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.bar
				 */

				setScrollbar: function(viewLayout, firstChildLayout, clipLayout) {
					this._viewLayout = viewLayout;
					this._clipLayout = clipLayout;
					this._firstChildLayout = firstChildLayout;
					this._ratio = clipLayout / firstChildLayout;
				},

				/**
				 * @method getScrollbarSize
				 * @return scrollbar size
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.bar
				 */
				getScrollbarSize: function() {
					return this._firstChildLayout / this._viewLayout * this._firstChildLayout * this._ratio;
				},
				/**
				 * @method offset
				 * @param orientation
				 * @param offset
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.bar
				 */
				offset: function( orientation, offset ) {
					var x, y;

					offset = offset * this._clipLayout / this._viewLayout;

					if ( orientation === Scroller.Orientation.VERTICAL ) {
						x = 0;
						y = offset;
					} else {
						x = offset;
						y = 0;
					}

					return {
						x: x,
						y: y
					};
				},

				/**
				 * @method start
				 * @param scrollbarElement
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.bar
				 */
				start: function( scrollbarElement/*, barElement */) {
					var style = scrollbarElement.style,
						duration = this.options.animationDuration;
					style["-webkit-transition"] =
							style["-moz-transition"] =
							style["-ms-transition"] =
							style["-o-transition"] =
							style.transition = "opacity " + duration / 1000 + "s ease";
					style.opacity = 1;
				},

				/**
				 * @method end
				 * @param scrollbarElement
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.bar
				 */
				end: function( scrollbarElement/*, barElement */) {
					var style = scrollbarElement.style,
						duration = this.options.animationDuration;
					style["-webkit-transition"] =
							style["-moz-transition"] =
							style["-ms-transition"] =
							style["-o-transition"] =
							style.transition = "opacity " + duration / 1000 + "s ease";
					style.opacity = 0;
				}
			});

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
