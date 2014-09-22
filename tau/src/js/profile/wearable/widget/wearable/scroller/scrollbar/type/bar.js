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
					wrapperClass: "ui-scrollbar-bar-type",
					barClass: "ui-scrollbar-indicator",
					orientationClass: "ui-scrollbar-",
					margin: 2,
					animationDuration: 500
				},

				/**
				 *
				 * @method insertAndDecorate
				 * @param data
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.bar
				 */
				insertAndDecorate: function( data ) {
					var scrollbarElement = data.wrapper,
						barElement = data.bar,
						container = data.container,
						clip = data.clip,
						orientation = data.orientation,
						margin = this.options.margin,
						clipSize = orientation === Scroller.Orientation.VERTICAL ? clip.offsetHeight : clip.offsetWidth,
						containerSize = orientation === Scroller.Orientation.VERTICAL ? container.offsetHeight : container.offsetWidth,
						orientationClass = this.options.orientationClass + (orientation === Scroller.Orientation.VERTICAL ? "vertical" : "horizontal"),
						barStyle = barElement.style;

					this.containerSize = containerSize;
					this.maxScrollOffset = clipSize - containerSize;
					this.scrollZoomRate = containerSize / clipSize;
					this.barSize = window.parseInt( containerSize / (clipSize/containerSize) ) - ( margin * 2 );

					scrollbarElement.className = this.options.wrapperClass + " " + orientationClass;
					barElement.className = this.options.barClass;

					if ( orientation === Scroller.Orientation.VERTICAL ) {
						barStyle.height = this.barSize + "px";
						barStyle.top = "0px";
					} else {
						barStyle.width = this.barSize + "px";
						barStyle.left = "0px";
					}

					container.appendChild(scrollbarElement);
				},

				/**
				 * @method insertAndDecorate
				 * @param data
				 * @static
				 * @member ns.widget.wearable.scroller.scrollbar.type.bar
				 */
				remove: function (data) {
					var scrollbarElement = data.wrapper,
						container = data.container;

					if ( container && scrollbarElement) {
						container.removeChild(scrollbarElement);
					}
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

					offset = offset !== this.maxScrollOffset ?
						offset * this.scrollZoomRate :
						this.containerSize - this.barSize - this.options.margin * 2;

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
					style["-webkit-transition"] = "opacity " + duration / 1000 + "s ease";
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
					style["-webkit-transition"] = "opacity " + duration / 1000 + "s ease";
					style.opacity = 0;
				}
			});

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
