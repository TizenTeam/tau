/*global window, define, Event, console, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Scroll Bar Widget
 * Widget creates scroll bar.
 * @class ns.widget.wearable.scroller.scrollbar.ScrollBar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../../../core/engine",
			"../../../../../../core/util/object",
			"../../../../../../core/util/selectors",
			"../scrollbar",
			"./type/bar",
			"../../../../../../core/widget/BaseWidget",
			"../../Page",
			"../Scroller"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// scroller.start event trigger when user try to move scroller
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				prototype = new BaseWidget(),
				utilsObject = ns.util.object,
				selectors = ns.util.selectors,
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

					this.lastScrollPosition = 0;
				};

			prototype._build = function (scrollElement) {
				this.container = scrollElement;
				this.clip = scrollElement.children[0];
				return scrollElement;
			};

			prototype._configure = function () {
				/**
				 * @property {Object} options Options for widget
				 * @property {boolean} [options.type=false]
				 * @property {number} [options.displayDelay=700]
				 * @property {"vertical"|"horizontal"} [options.orientation="vertical"]
				 * @member ns.widget.wearable.scroller.scrollbar.ScrollBar
				 */
				this.options = utilsObject.merge({}, this.options, {
					type: false,
					displayDelay: 700,
					orientation: Scroller.Orientation.VERTICAL
				});
			};

			prototype._init = function () {
				this.type = this.options.type;

				if ( !this.type ) {
					return;
				}
				this._createScrollbar();
			};

			prototype._bindEvents = function() {
				document.addEventListener("visibilitychange", this);
			};

			prototype._createScrollbar = function () {
				var orientation = this.options.orientation,
					wrapper = document.createElement("DIV"),
					bar = document.createElement("span");

				wrapper.appendChild(bar);

				this.type.insertAndDecorate({
					orientation: orientation,
					wrapper: wrapper,
					bar: bar,
					container: this.container,
					clip: this.clip
				});

				this.wrapper = wrapper;
				this.barElement = bar;
			};

			prototype._removeScrollbar = function () {
				this.type.remove({
					orientation: this.options.orientation,
					wrapper: this.wrapper,
					bar: this.barElement,
					container: this.container,
					clip: this.clip
				});

				this.wrapper = null;
				this.barElement = null;
			};

			prototype._refresh = function () {
				var self = this;
				self._clear();
				self._init();
				self.translate(self.lastScrollPosition);
			};

			/**
			 * Translates widget.
			 * @method translate
			 * @param offset
			 * @param duration
			 * @member ns.widget.wearable.scroller.scrollbar.ScrollBar
			 */
			prototype.translate = function (offset, duration, autoHidden) {
				var orientation = this.options.orientation,
					translate,
					transition,
					barStyle,
					endDelay;

				if ( !this.wrapper || !this.type || this.lastScrollPosition === offset ) {
					return;
				}

				autoHidden = autoHidden !== false;

				this.lastScrollPosition = offset;

				offset = this.type.offset( orientation, offset );

				barStyle = this.barElement.style;
				if ( !duration ) {
					transition = "none";
				} else {
					transition = "-webkit-transform " + duration / 1000 + "s ease-out";
				}

				translate = "translate3d(" + offset.x + "px," + offset.y + "px, 0)";

				barStyle["-webkit-transform"] = translate;
				barStyle["-webkit-transition"] = transition;

				if ( !this.started ) {
					this._start();
				}

				if ( this.displayDelayTimeoutId !== null ) {
					window.clearTimeout( this.displayDelayTimeoutId );
					this.displayDelayTimeoutId = null;
				}

				if ( autoHidden ) {
					endDelay = ( duration || 0 ) + this.options.displayDelay;
					this.displayDelayTimeoutId = window.setTimeout(this._end.bind(this), endDelay);
				}
			};

			prototype.end = function () {
				if ( !this.displayDelayTimeoutId ) {
					this.displayDelayTimeoutId = window.setTimeout(this._end.bind(this), this.options.displayDelay);
				}
			};

			prototype._start = function () {
				this.type.start(this.wrapper, this.barElement);
				this.started = true;
			};

			prototype._end = function () {
				this.started = false;
				this.displayDelayTimeoutId = null;

				if ( this.type ) {
					this.type.end(this.wrapper, this.barElement);
				}
			};

			/**
			 * Supports events.
			 * @method handleEvent
			 * @param event
			 * @member ns.widget.wearable.scroller.scrollbar.ScrollBar
			 */
			prototype.handleEvent = function(event) {
				var page;

				switch(event.type) {
				case "visibilitychange":
					page = selectors.getClosestBySelector(this.container, "." + ns.widget.wearable.Page.classes.uiPage);
					if (document.visibilityState === "visible" && page === ns.activePage) {
						this.refresh();
					}
					break;
				}
			};

			prototype._clear = function () {
				this._removeScrollbar();

				this.started = false;
				this.type = null;
				this.barElement = null;
				this.displayDelayTimeoutId = null;
			};

			prototype._destroy = function () {
				this._clear();
				document.removeEventListener("visibilitychange", this);

				this.options = null;
				this.container = null;
				this.clip = null;
			};

			ScrollerScrollBar.prototype = prototype;

			ns.widget.wearable.scroller.scrollbar.ScrollBar = ScrollerScrollBar;

			engine.defineWidget(
				"ScrollBar",
				"",
				["translate"],
				ScrollerScrollBar
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
