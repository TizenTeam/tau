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

			type.tab = utilsObject.multiMerge({}, typeInterface, {
				options: {
					wrapperClass: "ui-scrollbar-tab-type",
					barClass: "ui-scrollbar-indicator",
					margin: 1
				},

				insertAndDecorate: function (data) {
					var scrollbarElement = data.wrapper,
						barElement = data.bar,
						container = data.container,
						clip = data.clip,
						sections = data.sections,
						orientation = data.orientation,
						margin = this.options.margin,
						clipWidth = clip.offsetWidth,
						clipHeight = clip.offsetHeight,
						containerWidth = container.offsetWidth,
						containerHeight = container.offsetHeight,
						clipSize = orientation === Scroller.Orientation.VERTICAL ? clipHeight : clipWidth,
						containerSize = orientation === Scroller.Orientation.VERTICAL ? containerHeight : containerWidth,
						sectionSize = clipSize / containerSize,
						height, barHeight, i, len;

					this.containerSize = containerWidth;
					this.maxScrollOffset = clipSize - containerSize;
					this.scrollZoomRate = containerWidth / clipSize;
					this.barSize = window.parseInt((containerWidth - margin * 2 * (sectionSize - 1)) / sectionSize);

					scrollbarElement.className = this.options.wrapperClass;
					barElement.className = this.options.barClass;

					barElement.style.width = this.barSize + "px";
					barElement.style.left = "0px";

					container.insertBefore(scrollbarElement, clip);

					// reset page container and section layout.
					barHeight = barElement.offsetHeight;
					height = clipHeight - barHeight;
					clip.style.height = height + "px";
					if (sections && sections.length) {
						for (i = 0, len = sections.length; i < len; i++) {
							sections[i].style.height = height + "px";
						}
					}
				},

				offset: function (orientation, offset) {
					return {
						x: offset === 0 ? -1 :
							offset === this.maxScrollOffset ? this.containerSize - this.barSize - this.options.margin : offset * this.scrollZoomRate,
						y: 0
					};
				}

			});
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, ns));