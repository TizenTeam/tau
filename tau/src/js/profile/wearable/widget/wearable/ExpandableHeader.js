/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * #Expandable Header
 * ExpandableHeader is to expand header component when user scroll over scroll top position.
 * This component is used when header has the long title text.
 *
 * TAU provide the HeaderMarqueeStyle helper method. ( tau.helper.HeaderMarqueeStyle.create method )
 * This helper method help to developer for implement more easy.
 * When the app (or the list view) is opened, text on the title bar is not sliding.
 * After pulling down the list to enlarge the title bar, text on the title bar is horizontally (text) sliding (marquee)
 * once if it is longer than a permitted limit by winset.
 *
 * ## HTML Example
 *
 *      @example
 *      <div class="ui-page ui-scroll-on">
 *          <header class="ui-header ui-expandable-header">
 *              <div class="ui-title">Long Title (Sub text)</div>
 *          </header>
 *          ...
 *      </div>
 *
 * ## JS Example
 *
 *     @example (Use Helper)
 *     <style>
 *         (function() {
 *              var page = document.getElementById("expandableHeaderPage"),
 *                      header = page.querySelector("#expandableHeader"),
 *                      title = header.querySelector(".ui-title"),
 *                      headerHelper;
 *
 *              page.addEventListener("pagebeforeshow", function() {
 *                  headerHelper = tau.helper.HeaderMarqueeStyle.create(header, title, {
 *                      scrollElement: page
 *                  });
 *              });
 *
 *              page.addEventListener("pagehide", function() {
 *                  headerHelper.destroy();
 *              });
 *          })();
 *     </style>
 *
 *     @example (Use only ExpandableHeader)
 *     <style>
 *         (function() {
 *              var page = document.getElementById("expandableHeaderPage"),
 *                      header = page.querySelector("#expandableHeader");
 *
 *              page.addEventListener("pagebeforeshow", function() {
 *                  tau.widget.ExpandableHeader(header, {
 *                      scrollElement: page
 *                  });
 *              });
 *          })();
 *     </style>
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/object",
			"../../../../core/event/gesture",
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.BaseWidget,
				Marquee = ns.widget.Marquee,
				engine = ns.engine,
				events = ns.event,
				Gesture = ns.event.gesture,
				object = ns.util.object,
				CustomEvents = {
					EXPAND: "headerexpand",
					COLLAPSE: "headercollapse",
					COMPLETE: "headerexpandcomplete",
					BEFORE_EXPAND: "headerbeforeexpand",
					BEFORE_COLLAPSE: "headerbeforecollapse"
				},

				ExpandableHeader = function () {
					var self = this;

					self._ui = {};
					self._expanded = false;
					self._basicText = null;
				},

				SCROLL_END_THRESHOLD = 300,
				/**
				 * Dictionary for page related css class names
				 * @property {Object} classes
				 * @member ns.widget.wearable.ExpandableHeader
				 * @static
				 * @readonly
				 */
				classes = {
					ExpandableHeader: "ui-expandable-header",
					EXPAND: "ui-header-expand",
					COLLAPSE: "ui-header-collapse",
					TITLE: "ui-title"
				},
				prototype = new BaseWidget();

			ExpandableHeader.classes = classes;
			ExpandableHeader.events = CustomEvents;

			function bindDragEvents(element) {
				var self = this;

				events.on(element, "scroll", self, false);
				events.on(self.element, "vclick", self, false);
			};

			function unBindDragEvents(element) {
				var self = this;

				events.off(element, "scroll", self, false);
				events.off(self.element, "vclick", self, false);
			};
			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.wearable.ExpandableHeader
			 */
			prototype.handleEvent = function(event) {
				var self = this;
				switch (event.type) {
					case "scroll":
						self._onScroll(event);
						break;
					case "vclick":
						self._onClick(event);
						break;
				}
			};
			/**
			 * Configure Expandable Header widget
			 * @method _configure
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.ExpandableHeader
			 */
			prototype._configure = function(){
				/**
				 * Widget options
				 * @property {HTMLElement} [options.scrollElement=document.getElementById("ui-page")] Delare scrollable element that contains this component. Default is header parent node.
				 */
				object.merge(this.options, {
					scrollElement: null
				});
			};

			prototype._build = function(element) {
				if (!element.classList.contains(classes.ExpandableHeader)) {
					element.classList.add(classes.ExpandableHeader);
				}
				return element;
			};
			/**
			 * Init Exapndable Header component
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.ExpandableHeader
			 */
			prototype._init = function (element) {
				this._initElements(element);
				return element;
			};

			/**
			 * Init element that related to Exapndable Header component
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.ExpandableHeader
			 */
			prototype._initElements = function(element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					basicHeight = element.offsetHeight,
					titleElement,
					scrollElement;

				titleElement = element.getElementsByClassName(classes.TITLE)[0];
				if (options.scrollElement) {
					if (typeof options.scrollElement === "string") {
						scrollElement = headerElement.querySelector(options.scrollElement);
					} else {
						scrollElement = options.scrollElement;
					}
				} else {
					scrollElement = element.parentNode;
				}

				events.trigger(element, CustomEvents.BEFORE_EXPAND);
				element.classList.add(classes.EXPAND);
				self._topOffset = element.offsetHeight - basicHeight;
				scrollElement.scrollTop = self._topOffset;
				events.trigger(element, CustomEvents.EXPAND);
				ui._titleElement = titleElement;
				ui._scrollElement = scrollElement;
			};

			/**
			 * click event handler
			 * @method _onClick
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.ExpandableHeader
			 */
			prototype._onClick = function(event) {
				var self = this,
					element = self.element,
					scrollElement = self._ui._scrollElement;

				if(element.classList.contains(classes.EXPAND)) {
					events.trigger(element, CustomEvents.BEFORE_COLLAPSE);
					scrollElement.scrollTop = scrollElement.scrollTop - self._topOffset;
					element.classList.remove(classes.EXPAND);
					element.classList.add(classes.COLLAPSE);
					events.trigger(element, CustomEvents.COLLAPSE);
				}
			};

			/**
			 * scroll event handler
			 * @method _onScroll
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.ExpandableHeader
			 */
			prototype._onScroll = function(event) {
				var self = this,
					element = self.element,
					options = self.options,
					ui = self._ui,
					scrollElement = ui._scrollElement;

				if (element.classList.contains(classes.EXPAND)) {
					if (scrollElement.scrollTop === 0) {
						events.trigger(element, CustomEvents.COMPLETE);
					} else if (scrollElement.scrollTop > self._topOffset) {
						events.trigger(element, CustomEvents.BEFORE_COLLAPSE);
						scrollElement.scrollTop = scrollElement.scrollTop - self._topOffset;
						element.classList.remove(classes.EXPAND);
						element.classList.add(classes.COLLAPSE);
						events.trigger(element, CustomEvents.COLLAPSE);
					}
				}

				clearTimeout(self._timer);
				self._timer = setTimeout(self._onScrollEnd.bind(self, event), SCROLL_END_THRESHOLD);
			};

			/**
			 * scrollEnd event handler. scrollEnd is made component self.
			 * @method _onScrollEnd
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.ExpandableHeader
			 */
			prototype._onScrollEnd = function(event) {
				var self = this,
					scrollElement = self._ui._scrollElement,
					element = self.element;

				if (scrollElement.scrollTop === 0 && element.classList.contains(classes.COLLAPSE)) {
					events.trigger(element, CustomEvents.BEFORE_EXPAND);
					element.classList.add(classes.EXPAND);
					element.classList.remove(classes.COLLAPSE);
					scrollElement.scrollTop = self._topOffset;
					events.trigger(element, CustomEvents.EXPAND);
				}
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.ExpandableHeader
			 */
			prototype._bindEvents = function () {
				var self = this;

				bindDragEvents.call(self, self._ui._scrollElement);
			};

			prototype._unbindEvents = function () {
				var self = this;

				unBindDragEvents.call(self, self._ui._scrollElement);
			};
			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.ExpandableHeader
			 */
			prototype._refresh = function () {
				var self = this;
				self._initElements(self.element);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.ExpandableHeader
			 */
			prototype._destroy = function () {
				this._unbindEvents();
			};

			ExpandableHeader.prototype = prototype;

			// definition
			ns.widget.wearable.ExpandableHeader = ExpandableHeader;
			engine.defineWidget(
				"ExpandableHeader",
				"",
				[],
				ExpandableHeader,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
