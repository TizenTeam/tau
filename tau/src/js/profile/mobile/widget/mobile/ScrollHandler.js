/*global window, define, ns, console */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true */
/**
 * # Scroll Handler
 * Extension for Scroll View Widget, adds scroll handler.
 *
 * ## Default selectors
 * All scrollview selectors with have a class _.ui-scrollhandler_
 * or _data-handler=[DIRECTION]_ will become be enhanced
 *
 * ### HTML examples
 *
 * #### Enhanced scrollview using data-handler attribute
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content" data-handler="true">
 *				page content
 *			</div>
 *		</div>
 *
 * #### Enhanced scrollview using css .ui-scrollhandler class
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content" class="ui-scrollhandler">
 *				page content
 *			</div>
 *		</div>
 *
 * ## Manual constructor
 * To create the widget manually you can use 2 different APIs, the TAU
 * API or jQuery API
 *
 * ### Enhanced scrollview by using TAU API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				pagecontent
 *			<div>
 *		</div>
 *		<script>
 *			var handlerElement = document.getElementById("myPage")
 *						.querySelector("[data-role=content]");
 *			tau.widget.ScrollHandler(handlerElement);
 *		</script>
 *
 * ### Enhanced scrollview by using jQuery API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				pagecontent
 *			<div>
 *		</div>
 *		<script>
 *			$("#myPage > div[data-role=content]").scrollhandler();
 *		</script>
 *
 * ## Options for ScrollHandler
 *
 * Options can be set by using data-* attributes or by passing them to
 * the constructor.
 *
 * There is also a method **option** for changing them after widget
 * creation
 *
 * jQuery mobile API is also supported.
 *
 * ### Enable handler
 *
 * This option sets the handler status. The default value is true.
 *
 * You can change this option by all available methods for options
 * changing
 *
 * #### By data-handler attribute
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content" data-handler="true">
 *				pagecontent
 *			<div>
 *		</div>
 *
 * #### By passing object to constructor
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				pagecontent
 *			<div>
 *		</div>
 *		<script>
 *			var handlerElement = document.getElementById("myPage")
 *						.querySelector("[data-role=content]");
 *			tau.widget.ScrollHandler(handlerElement, {
 *				"handler": true
 *			});
 *		</script>
 *
 * #### By using jQuery API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				pagecontent
 *			<div>
 *		</div>
 *		<script>
 *			$("#myPage > div[data-role=content]").scrollhandler({
 *				"handler": "true"
 *			});
 *		</script>
 *
 * ### handlerTheme
 *
 * This option sets the handler theme. The default value is inherited
 * or "s" if none found.
 *
 * You can change this option by all available methods for options
 * changing
 *
 * #### By data-handler-theme attribute
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content" data-handler-theme="s" handler="true">
 *				pagecontent
 *			<div>
 *		</div>
 *
 *
 * #### By passing object to constructor
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				pagecontent
 *			<div>
 *		</div>
 *		<script>
 *			var handlerElement = document.getElementById("myPage")
 *						.querySelector("[data-role=content]");
 *			tau.widget.ScrollHandler(handlerElement, {
 *				"handlerTheme": "s"
 *			});
 *		</script>
 *
 * #### By using jQuery API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				pagecontent
 *			<div>
 *		</div>
 *		<script>
 *			$("#myPage > div[data-role=content]").scrollhandler({
 *				"handlerTheme": "s"
 *			});
 *		</script>
 *
 * ### direction
 *
 * This option sets the the direction of which the handler is presented.
 * The default value is "y" meaning vertical scroll button.
 *
 * You can change this option by all available methods for options
 * changing
 *
 * #### By data-handler-direction attribute
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content" data-direction="y" handler="true">
 *				pagecontent
 *			<div>
 *		</div>
 *
 * #### By passing object to constructor
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				pagecontent
 *			<div>
 *		</div>
 *		<script>
 *			var handlerElement = document.getElementById("myPage")
 *						.querySelector("[data-role=content]"),
 *			tau.widget.ScrollHandler(handlerElement, {
 *				"scroll": "y"
 *			});
 *		</script>
 *
 * #### By using jQuery API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				pagecontent
 *			<div>
 *		</div>
 *		<script>
 *			$("#myPage > div[data-role=content]").scrollhandler({
 *				"scroll": "y"
 *			});
 *		</script>
 *
 * ### scroll
 *
 * This option sets the the direction of which the handler is scrolling.
 * The default value is "y" which means vertical.
 *
 * You can change this option by all available methods for options
 * changing
 *
 * #### By data-handler-scroll attribute
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content" data-scroll="x" handler="true">
 *				pagecontent
 *			<div>
 *		</div>
 *
 * #### By passing object to constructor
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				pagecontent
 *			<div>
 *		</div>
 *		<script>
 *			var handlerElement = document.getElementById("myPage")
 *						.querySelector("[data-role=content]"),
 *			tau.widget.ScrollHandler(handlerElement, {
 *				"scroll": "x"
 *			});
 *		</script>
 *
 * #### By using jQuery API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				pagecontent
 *			<div>
 *		</div>
 *		<script>
 *			$("#myPage > div[data-role=content]").scrollhandler({
 *				"scroll": "x"
 *			});
 *		</script>
 *
 * ## Methods
 *
 * ScrollHandler methods can be called through 2 APIs: TAU API and jQuery
 * API (jQuery Mobile-like API). Since this widget extends Scrollview,
 * all the Scrollview methods can be called also.
 *
 * @class ns.widget.mobile.ScrollHandler
 * @extends ns.widget.mobile.Scrollview
 *
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/DOM/css",
			"../../../../core/util/selectors",
			"../mobile",
			"./Scrollview",
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var ScrollHandler = function () {
					var self = this;
					/**
					 * Widget options
					 * @property {Object} options
					 * @property {boolean} [options.handler=true] Enabled flag
					 * @property {string} [options.handlerTheme="s"] Handler theme
					 * @property {"x"|"y"} [options.direction="y"] The direction of the handler
					 * @property {"x"|"y"|"xy"} [options.scroll="y"] The direction of scrolling
					 * @member ns.widget.mobile.ScrollHandler
					 */
					self.options = {
						handler: true,
						handlerTheme: "s",
						direction: "y",
						scroll: "y"
					};
					/**
					 * A collection of handler UI elements
					 * @property {Object} ui
					 * @member ns.widget.mobile.ScrollHandler
					 * @instance
					 */
					self.ui = {
						handler: null,
						thumb: null,
						track: null,
						handle: null,
						page: null
					};
					/**
					 * Event listeners for various events
					 * @property {Object} _callbacks
					 * @property {Function} _callbacks.scrollstart Start handler
					 * @property {Function} _callbacks.scrollupdate Scrolling handler
					 * @property {Function} _callbacks.scrollend Scroll end handler
					 * @property {Function} _callbacks.touchstart Start handler
					 * @property {Function} _callbacks.touchmove Touch move  handler
					 * @property {Function} _callbacks.touchend Touch end handler
					 * @property {Function} _callbacks.resize Window resize handler
					 * @member ns.widget.mobile.ScrollHandler
					 * @protected
					 */
					self._callbacks = {
						scrolstart: null,
						scrollupdate: null,
						scrollend: null,
						touchstart: null,
						touchmove: null,
						touchend: null,
						resize: null
					};
					/**
					 * A drag indicator flag
					 * @property {boolean} [_dragging=false]
					 * @member ns.widget.mobile.ScrollHandler
					 * @protected
					 */
					self._dragging = false;
					/**
					 * Collection of scroll bounds params
					 * @property {Object} _offsets
					 * @member ns.widget.mobile.ScrollHandler
					 * @protected
					 */
					self._offsets = {
						x: 0,
						y: 0,
						maxX: 0,
						maxY: 0
					};
					/**
					 * Holds original pointer events state
					 * @property {string} [_lastPointerEvents=""]
					 * @member ns.widget.mobile.ScrollHandler
					 * @protected
					 */
					self._lastPointerEvents = "";
					/**
					 * Holds information about scrollviews available offset
					 * @property {number} [_availableOffsetX=0]
					 * @member ns.widget.mobile.ScrollHandler
					 * @protected
					 */
					self._availableOffsetX = 0;
					/**
					 * Holds information about scrollviews available offset
					 * @property {number} [_availableOffsetX=0]
					 * @member ns.widget.mobile.ScrollHandler
					 * @protected
					 */
					self._availableOffsetY = 0;
					/**
					 * @property {?number} [_hideTimer=null]
					 * Holds timer ID
					 * @member ns.widget.mobile.ScrollHandler
					 * @protected
					 */
					self._hideTimer = null;
					/**
					 * Holds last mouse position
					 * @property {Object} _lastMouse
					 * @member ns.widget.mobile.ScrollHandler
					 * @protected
					 */
					self._lastMouse = {
						x: 0,
						y: 0
					};
				},
				engine = ns.engine,
				CSSUtils = ns.util.DOM,
				selectors = ns.util.selectors,
				PageClasses = ns.widget.mobile.Page.classes,
				Scrollview = ns.widget.mobile.Scrollview,
				ScrollviewPrototype = Scrollview.prototype,
				ScrollviewBuild = ScrollviewPrototype._build,
				ScrollviewInit = ScrollviewPrototype._init,
				ScrollviewBindEvents = ScrollviewPrototype._bindEvents,
				ScrollviewDestroy = ScrollviewPrototype._destroy,
				max = Math.max,
				min = Math.min,
				floor = Math.floor,
				/**
				 * A collection of ScrollHandlers classes
				 * @property {Object} classes
				 * @property {string} [classes.handler="ui-handler"] Handler main class
				 * @property {string} [classes.directionPrefix="ui-handler-direction"] Direction class prefix
				 * @property {string} [classes.track="ui-handler-track"] Handler track class
				 * @property {string} [classes.thumb="ui-handler-thumb"] Handler thumb button prefix
				 * @property {string} [classes.themePrefix="ui-handller-"] Handler theme class prefix
				 * @property {string} [classes.scrollbarDisabled="scrollbar-disabled"] Scrollview scrollbar disabled class
				 * @property {string} [classes.disabled="disabled"] Disabled class
				 * @property {string} [classes.hideNativeScrollbar="ui-hide-scrollbar"] Hides native scrollbar in scrollview
				 * @member ns.widget.mobile.ScrollHandler
				 * @static
				 * @readonly
				 */
				classes = {
					handler: "ui-handler",
					directionPrefix: "ui-handler-direction-",
					track: "ui-handler-track",
					handle: "ui-handler-handle",
					thumb: "ui-handler-thumb",
					visible: "ui-handler-visible",
					themePrefix: "ui-handler-",
					scrollbarDisabled: "scrollbar-disabled",
					disabled: "disabled",
					hideNativeScrollbar: "ui-hide-scrollbar"
				},
				prototype = new Scrollview();

			ScrollHandler.classes = classes;

			/**
			 * Translates objects position to a new position
			 * @param {ns.widget.mobile.ScrollHandler} self
			 * @param {number} xOffset
			 * @param {number} yOffset
			 * @member ns.widget.mobile.ScrollHandler
			 * @private
			 * @static
			 */
			function translate(self, xOffset, yOffset) {
				var style = null,
					translateString = null;
				if (self.options.handler) {
					style = self.ui.handle.style;
					translateString = "translate3d(" + (xOffset || 0) + "px, " + (yOffset || 0) + "px, 0px)";

					style.webkitTransform = translateString;
					style.mozTransform = translateString;
					style.transform = translateString;
				}
			}

			/**
			 * Sets handler position according to scrollviews position
			 * @param {ns.widget.mobile.ScrollHandler} self
			 * @member ns.widget.mobile.ScrollHandler
			 * @private
			 * @static
			 */
			function syncHandleWithScroll(self) {
				var position = self.getScrollPosition(),
					offsets = self._offsets,
					direction = self.options.direction,
					x = floor(min(position.x, self._availableOffsetX) / self._availableOffsetX * offsets.maxX),
					y = floor(min(position.y, self._availableOffsetY) / self._availableOffsetY * offsets.maxY);

				if (isNaN(x) === true) {
					x = offsets.x;
				}

				if (isNaN(y) === true) {
					y = offsets.y;
				}

				translate(
					self,
						direction === "y" ? 0 : x,
						direction === "x" ? 0 : y
				);

				offsets.x = x;
				offsets.y = y;
			}

			/**
			 * Handles scroll start event
			 * @param {ns.widget.mobile.ScrollHandler} self
			 * @member ns.widget.mobile.ScrollHandler
			 * @private
			 * @static
			 */
			function handleScrollstart(self) {
				if (self._dragging === false) {
					syncHandleWithScroll(self);
					if (self._hideTimer) {
						window.clearTimeout(self._hideTimer);
					}
					self.ui.handler.classList.add(classes.visible);
				}
			}

			/**
			 * Handles scroll update event
			 * @param {ns.widget.mobile.ScrollHandler}
			 * @member ns.widget.mobile.ScrollHandler
			 * @private
			 * @static
			 */
			function handleScrollupdate(self) {
				if (self._dragging === false) {
					if (self._hideTimer) {
						window.clearTimeout(self._hideTimer);
					}
					syncHandleWithScroll(self);
				}
			}

			/**
			 * Handles scroll stop event
			 * @param {ns.widget.mobile.ScrollHandler}
			 * @member ns.widget.mobile.ScrollHandler
			 * @private
			 * @static
			 */
			function handleScrollstop(self) {
				if (self._dragging === false) {
					syncHandleWithScroll(self);
					if (self._hideTimer) {
						window.clearTimeout(self._hideTimer);
					}
					self._hideTimer = window.setTimeout(function () {
						self.ui.handler.classList.remove(classes.visible);
					}, 1500);
				}
			}

			/**
			 * Handles dragging
			 * @param {ns.widget.mobile.ScrollHandler} self
			 * @param {number} x
			 * @param {number} y
			 * @member ns.widget.mobile.ScrollHandler
			 * @private
			 * @static
			 */
			function handleDragging(self, x, y) {
				var lastMouse = self._lastMouse,
					offsets = self._offsets,
					direction = self.options.direction,
					diffX = lastMouse.x - x,
					diffY = lastMouse.y - y;

				lastMouse.x = x;
				lastMouse.y = y;

				// translate with direction locking
				offsets.x += -diffX;
				offsets.y += -diffY;

				// cap to between limits
				offsets.x = max(0, offsets.x);
				offsets.y = max(0, offsets.y);
				offsets.x = min(offsets.maxX, offsets.x);
				offsets.y = min(offsets.maxY, offsets.y);

				translate(
					self,
					direction === "y" ? 0 : offsets.x,
					direction === "x" ? 0 : offsets.y
				);

				self.scrollTo(
					direction === "y" ? 0 : offsets.x / offsets.maxX * self._availableOffsetX,
					direction === "x" ? 0 : offsets.y / offsets.maxY * self._availableOffsetY
				);

				if (self._hideTimer) {
					window.clearTimeout(self._hideTimer);
				}
			}

			/**
			 * Handles touch start event
			 * @param {ns.widget.mobile.ScrollHandler} self
			 * @param {MouseEvent|TouchEvent} event
			 * @member ns.widget.mobile.ScrollHandler
			 * @private
			 * @static
			 */
			function handleTouchstart(self, event) {
				var lastMouse = self._lastMouse,
					touches = event.touches,
					touch = touches && touches[0],
					parent = self.element.parentNode;
				self._dragging = true;
				self._lastPointerEvents = CSSUtils.getCSSProperty(parent, "pointer-events");
				// this is just for scroll speedup purposes
				// through method since we are using important flag
				parent.style.setProperty("pointer-events", "none", "important");
				lastMouse.x = touch ? touch.clientX : event.clientX;
				lastMouse.y = touch ? touch.clientY : event.clientY;

				event.stopImmediatePropagation();
				event.preventDefault();
			}

			/**
			 * Handles touch move events
			 * @param {ns.widget.mobile.ScrollHandler} self
			 * @param {MouseEvent|TouchEvent} event
			 * @member ns.widget.mobile.ScrollHandler
			 * @private
			 * @static
			 */
			function handleTouchmove(self, event) {
				var touches = event.touches,
					touch = touches && touches[0],
					x = 0,
					y = 0;
				// check for exactly 1 touch event
				// or a mouse event
				if (self._dragging && (touches === undefined || touches.length <= 1)) {
					event.stopImmediatePropagation();
					event.preventDefault();

					x = touch ? touch.clientX : event.clientX;
					y = touch ? touch.clientY : event.clientY;
					handleDragging(self, x, y);
				}
			}

			/**
			 * Handles touch end event
			 * @param {ns.widget.mobile.ScrollHandler}
			 * @param {MouseEvent|TouchEvent}
			 * @member ns.widget.mobile.ScrollHandler
			 * @private
			 * @static
			 */
			function handleTouchend(self, event) {
				var lastPointerEvents = self._lastPointerEvents,
					parentStyle = self.element.parentNode.style;
				if (self._dragging) {
					parentStyle.removeProperty("pointer-events");
					if (lastPointerEvents !== "auto") {
						parentStyle.setProperty("pointer-events", lastPointerEvents);
					}
					self._dragging = false;

					event.stopImmediatePropagation();
					event.preventDefault();

					if (self._hideTimer) {
						window.clearTimeout(self._hideTimer);
					}
					self._hideTimer = window.setTimeout(function () {
						self.ui.handler.classList.remove(classes.visible);
					}, 1500);
				}
			}

			/**
			 * Build the scrollhander and scrollview DOM
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @method _build
			 * @member ns.widget.mobile.ScrollHandler
			 * @protected
			 */
			prototype._build = function (element) {
				var node,
					nodeStyle,
					scrollviewViewStyle,
					handler = document.createElement("div"),
					handle = document.createElement("div"),
					track = document.createElement("div"),
					thumb = document.createElement("div"),
					options = this.options,
					ui = this.ui;

				// Set scroll option for scrollview
				options.scroll = options.direction === "y" ? "y" : "x";
				node = ScrollviewBuild.call(this, element);

				handler.className = classes.handler + " " + classes.themePrefix + options.handlerTheme + " " + classes.directionPrefix + options.direction;
				handle.className = classes.handle;
				thumb.className = classes.thumb;
				track.className = classes.track;

				handle.setAttribute("tabindex", 0);
				handle.setAttribute("aria-label", (options.direction === "y" ? "Vertical" : "Horizontal") + " handler, double tap and move to scroll");

				handle.appendChild(thumb);
				track.appendChild(handle);
				handler.appendChild(track);

				node.appendChild(handler);

				// Force scrollview to be full width of container
				nodeStyle = node.style;
				scrollviewViewStyle = node.firstElementChild.style;

				// NOTE: to hide native scrollbar, make sure that theme includes
				// *display* property set to *none* for
				// .ui-content.ui-scrollview-clip.ui-hide-scrollbar::-webkit-scrollbar
				element.classList.add(classes.hideNativeScrollbar);

				if (options.direction === "x") {
					scrollviewViewStyle.display = "inline-block";
					scrollviewViewStyle.minWidth = "100%";
				}
				if (options.direction === "y") {
					scrollviewViewStyle.display = "block";
					nodeStyle.minWidth = "100%";
				}

				ui.handler = handler;
				ui.handle = handle;
				ui.track = track;
				ui.thumb = thumb;

				return node;
			};

			/**
			 * Init the scrollhander and scrollview
			 * @param {HTMLElement} element
			 * @method _init
			 * @protected
			 * @member ns.widget.mobile.ScrollHandler
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self.ui,
					page = ui.page;

				ScrollviewInit.call(self, element);

				if (ui.handler === null) {
					ui.handler = element.querySelector("." + classes.handler);
				}

				if (ui.track  === null) {
					ui.track = element.querySelector("." + classes.track);
				}

				if (ui.handle === null) {
					ui.handle = element.querySelector("." + classes.handle);
				}

				if (ui.thumb  === null) {
					ui.thumb = element.querySelector("." + classes.thumb);
				}

				if (page === null) {
					page = selectors.getClosestByClass(element, PageClasses.uiPage);
				}
				ui.page = page;

				self.enableHandler(true);
			};

			/**
			 * Refreshes the scrollhander bounds and dimensions
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.ScrollHandler
			 */
			prototype._refresh = function () {
				var self = this,
					element = self.element,
					offsets = self._offsets,
					ui = self.ui,
					handle = ui.handle,
					handleStyle = handle.style,
					parent = element.parentNode,
					childrenHeight = 0,
					clipHeight = CSSUtils.getElementHeight(element, "inner", true),
					clipWidth = CSSUtils.getElementWidth(element, "inner", true),
					view = element.querySelector("." + Scrollview.classes.view),
					viewHeight = CSSUtils.getElementHeight(view, "inner", true),
					viewWidth = CSSUtils.getElementWidth(view, "inner", true),
					marginTop = null,
					child = parent.firstElementChild;

				while (child) {
					// filter out current scrollview
					if (child !== element) {
						childrenHeight += CSSUtils.getElementHeight(child, "inner", true);
					} else if (marginTop === null) {
						marginTop = childrenHeight;
					}
					child = child.nextElementSibling;
				}

				marginTop = marginTop || 0;

				if (self.options.direction === 'y') {
					handleStyle.height = floor(clipHeight / viewHeight * clipHeight) + 'px';
				} else {
					handleStyle.width = floor(clipWidth / viewWidth * clipWidth) + 'px';
				}

				offsets.maxX = floor(max(0, clipWidth - CSSUtils.getElementWidth(handle, "inner", true)));
				offsets.maxY = floor(max(0, clipHeight - CSSUtils.getElementHeight(handle, "inner", true)));

				self._availableOffsetX = max(0, viewWidth - clipWidth);
				self._availableOffsetY = max(0, viewHeight - clipHeight);
				ui.handler.style.marginTop = marginTop + "px";
			};

			/**
			 * Binds the scrollhander and scrollview events
			 * @param {HTMLElement} element
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.ScrollHandler
			 */
			prototype._bindEvents = function (element) {
				var self = this,
					callbacks = self._callbacks,
					ui = self.ui;
				ScrollviewBindEvents.call(self, element);

				callbacks.scrollstart = handleScrollstart.bind(null, self);
				callbacks.scrollupdate = handleScrollupdate.bind(null, self);
				callbacks.scrollstop = handleScrollstop.bind(null, self);
				callbacks.touchstart = handleTouchstart.bind(null, self);
				callbacks.touchmove = handleTouchmove.bind(null, self);
				callbacks.touchend = handleTouchend.bind(null, self);
				callbacks.resize = self._refresh.bind(self);

				element.addEventListener("scrollstart", callbacks.scrollstart, false);
				element.addEventListener("scrollupdate", callbacks.scrollupdate, false);
				element.addEventListener("scrollstop", callbacks.scrollstop, false);
				ui.handle.addEventListener("vmousedown", callbacks.touchstart, false);
				ui.page.addEventListener("pageshow", callbacks.resize, false);
				document.addEventListener("vmousemove", callbacks.touchmove, false);
				document.addEventListener("vmouseup", callbacks.touchend, false);
				window.addEventListener("throttledresize", callbacks.resize, false);

			};

			/**
			 * Enables/disables handler
			 *
			 * #### TAU API
			 *
			 *		@example
			 *		<div data-role="page" id="myPage">
			 *			<div data-role="content">
			 *				pagecontent
			 *			<div>
			 *		</div>
			 *		<script>
			 *			var handlerElement = document.getElementById("myPage")
			 *						.querySelector("[data-role=content]"),
			 *				scrollhandler = tau.widget.ScrollHandler(handlerElement);
			 *			scrollhandler.enableHandler(true);
			 *		</script>
			 *
			 * #### jQuery API
			 *
			 *		@example
			 *		<div data-role="page" id="myPage">
			 *			<div data-role="content">
			 *				pagecontent
			 *			<div>
			 *		</div>
			 *		<script>
			 *			#("#myPage > div[data-role=content]).scrollhandler("enableHandler", true);
			 *		</script>
			 *
			 * @param {boolean} enable
			 * @return {boolean}
			 * @method enableHandler
			 * @member ns.widget.mobile.ScrollHandler
			 */
			prototype.enableHandler = function (enable) {
				var self = this,
					scrollBarDisabledClass = classes.scrollbarDisabled,
					disabledClass = classes.disabled,
					element = self.element,
					parentClassList = element.parentNode.classList,
					elementClassList = element.classList;

				if (enable !== undefined) {
					self.options.handler = enable;
					if (enable) {
						parentClassList.add(scrollBarDisabledClass);
						elementClassList.remove(disabledClass);
						self._refresh();
					} else {
						parentClassList.remove(scrollBarDisabledClass);
						elementClassList.add(disabledClass);
					}
				}

				return self.options.handler;
			};

			/**
			 * Sets the handlers theme
			 * @param {string} theme
			 * @method _setHandlerTheme
			 * @protected
			 * @member ns.widget.mobile.ScrollHandler
			 */
			prototype._setHandlerTheme = function (theme) {
				var elementClassList = this.element.classList,
					themePrefix = classes.themePrefix,
					themeClass = themePrefix + theme;
				if (elementClassList.contains(themeClass) === false) {
					elementClassList.remove(themePrefix + this.options.handlerTheme);
					elementClassList.add(themeClass);
				}
			};

			/**
			 * Destroys the scrollhander and scrollview DOM
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.ScrollHandler
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self.ui,
					callbacks = self._callbacks,
					element = self.element;

				// Restore native scrollbar
				element.classList.remove(classes.hideNativeScrollbar);
				element.removeEventListener("scrollstart", callbacks.scrollstart, false);
				element.removeEventListener("scroll", callbacks.scrollupdate, false);
				element.removeEventListener("scrollstop", callbacks.scrollstop, false);
				ui.handle.removeEventListener("vmousedown", callbacks.touchstart, false);
				ui.page.removeEventListener("pageshow", callbacks.touchstart, false);
				document.removeEventListener("vmousemove", callbacks.touchmove, false);
				document.removeEventListener("vmouseup", callbacks.touchend, false);
				window.removeEventListener("throttledresize", callbacks.resize, false);

				ScrollviewDestroy.call(self);
			};

			ScrollHandler.prototype = prototype;

			ns.widget.mobile.ScrollHandler = ScrollHandler;
			engine.defineWidget(
				"ScrollHandler",
				"[data-role='content'][data-handler='true']:not([data-scroll='none']):not(.ui-scrollview-clip):not(.ui-scrolllistview),[data-handler='true'], .ui-scrollhandler",
				[
					"enableHandler",
					"scrollTo",
					"ensureElementIsVisible",
					"centerToElement",
					"getScrollPosition",
					"skipDragging",
					"translateTo"
				],
				ScrollHandler,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));

