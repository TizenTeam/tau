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
			"../type",
			"./interface",
			"../../Scroller",
			"../../../../../utils/object"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			// scroller.start event trigger when user try to move scroller
			var utilsObject = ns.utils.object,
				type = ns.widget.wearable.scroller.scrollbar.type,
				typeInterface = type.interface,
				Scroller = ns.widget.wearable.scroller.Scroller;

			type.bar = utilsObject.multiMerge({}, typeInterface, {
				options: {
					wrapperClass: "ui-scrollbar-bar-type",
					barClass: "ui-scrollbar-indicator",
					orientationClass: "ui-scrollbar-",
					margin: 2,
					animationDuration: 500
				},

				insertAndDecorate: function (data) {
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
					this.barSize = window.parseInt(containerSize / (clipSize / containerSize)) - ( margin * 2 );

					scrollbarElement.className = this.options.wrapperClass + " " + orientationClass;
					barElement.className = this.options.barClass;

					if (orientation === Scroller.Orientation.VERTICAL) {
						barStyle.height = this.barSize + "px";
						barStyle.top = "0px";
					} else {
						barStyle.width = this.barSize + "px";
						barStyle.left = "0px";
					}

					container.appendChild(scrollbarElement);
				},

				offset: function (orientation, offset) {
					var x, y;

					offset = offset === this.maxScrollOffset ? this.containerSize - this.barSize - this.options.margin * 2 : offset * this.scrollZoomRate;

					if (orientation === Scroller.Orientation.VERTICAL) {
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

				start: function (scrollbarElement/*, barElement */) {
					var style = scrollbarElement.style,
						duration = this.options.animationDuration;
					style["-webkit-transition"] = "opacity " + duration / 1000 + "s ease";
					style.opacity = 1;
				},

				end: function (scrollbarElement/*, barElement */) {
					var style = scrollbarElement.style,
						duration = this.options.animationDuration;
					style["-webkit-transition"] = "opacity " + duration / 1000 + "s ease";
					style.opacity = 0;
				}
			});

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, ns));