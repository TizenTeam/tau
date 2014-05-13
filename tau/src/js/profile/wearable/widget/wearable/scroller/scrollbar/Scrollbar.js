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
			"../../../../../../core/engine",
			"../../../../../../core/utils/selectors",
			"../../../../../../core/utils/object",
			"../scrollbar",
			"./type/bar",
			"./type/tab",
			"../../../../../../core/widget/BaseWidget",
			"../Scroller"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// scroller.start event trigger when user try to move scroller
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				prototype = new BaseWidget(),
				utilsObject = ns.utils.object,
				scrollbarType = ns.widget.wearable.scroller.scrollbar.type,

				Scroller = ns.widget.wearable.scroller.Scroller,
				ScrollerScrollBar = function () {

					this.wrapper = null;
					this.barElement = null;

					this.container = null;
					this.clip = null;

					this.options = {};
					this.type = null;

					this.maxScroll = null;
					this.started = false;
					this.displayDelayTimeoutId = null;

				};

			prototype._build = function (scrollElement) {
				this.container = scrollElement;
				this.clip = scrollElement.children[0];
				return scrollElement;
			};

			prototype._configure = function () {
				this.options = utilsObject.merge({}, this.options, {
					type: false,
					displayDelay: 700,
					sections: null,
					orientation: Scroller.Orientation.VERTICAL
				});
			};

			prototype._init = function () {
				var type = this.options.type;

				if (!type) {
					return;
				}

				this.type = scrollbarType[type];
				if (!this.type) {
					throw "Bad options. [type : " + this.options.type + "]";
				}

				this._createScrollbar();
			};

			prototype._createScrollbar = function () {
				var sections = this.options.sections,
					orientation = this.options.orientation,
					wrapper = document.createElement("DIV"),
					bar = document.createElement("span");

				wrapper.appendChild(bar);

				this.type.insertAndDecorate({
					orientation: orientation,
					wrapper: wrapper,
					bar: bar,
					container: this.container,
					clip: this.clip,
					sections: sections
				});

				this.wrapper = wrapper;
				this.barElement = bar;
			};

			prototype._removeScrollbar = function () {
				if (this.wrapper) {
					this.wrapper.parentNode.removeChild(this.wrapper);
				}

				this.wrapper = null;
				this.barElement = null;
			};

			prototype._refresh = function () {
				this.clear();
				this.init();
			};

			prototype.translate = function (offset, duration) {
				var orientation = this.options.orientation,
					translate, transition, barStyle, endDelay;

				if (!this.wrapper || !this.type) {
					return;
				}

				offset = this.type.offset(orientation, offset);

				barStyle = this.barElement.style;
				if (duration) {
					transition = "-webkit-transform " + duration / 1000 + "s ease-out";
				} else {
					transition = "none";
				}

				translate = "translate3d(" + offset.x + "px," + offset.y + "px, 0)";

				barStyle["-webkit-transform"] = translate;
				barStyle["-webkit-transition"] = transition;

				if (!this.started) {
					this._start();
				}

				endDelay = ( duration || 0 ) + this.options.displayDelay;
				if (this.displayDelayTimeoutId !== null) {
					window.clearTimeout(this.displayDelayTimeoutId);
				}
				this.displayDelayTimeoutId = window.setTimeout(this._end.bind(this), endDelay);
			};

			prototype._start = function () {
				this.type.start(this.wrapper, this.barElement);
				this.started = true;
			};

			prototype._end = function () {
				this.started = false;
				this.displayDelayTimeoutId = null;

				if (this.type) {
					this.type.end(this.wrapper, this.barElement);
				}
			};

			prototype._clear = function () {
				this._removeScrollbar();

				this.started = false;
				this.type = null;
				this.wrapper = null;
				this.barElement = null;
				this.displayDelayTimeoutId = null;
			};

			prototype._destroy = function () {
				this._clear();

				this.options = null;
				this.container = null;
				this.clip = null;
			};

			ScrollerScrollBar.prototype = prototype;

			ns.widget.wearable.ScrollerScrollBar = ScrollerScrollBar;

			engine.defineWidget(
				"Scrollbar",
				"",
				[],
				ScrollerScrollBar
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));