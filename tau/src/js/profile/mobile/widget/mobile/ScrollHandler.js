/*global window, define, ns, console */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
*
* Licensed under the Flora License, Version 1.1 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://floralicense.org/license/
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/*jslint nomen: true */
/**
 * #Scroll Handler Extension for Scroll View Widget
 *
 * ##Default selectors
 * All scrollview selectors with added data-scroll none or data-hander=[DIRECTION] will become this widget
 *
 * ##Manual constructor
 * To create the widget manually you can use the instanceWidget method
 *
 * @example
 * var Scrollview = ns.engine.instanceWidget(document.getElementById('list'), 'ScrollHandler');
 * //or
 * var scrollview = $('#list').scrollhandler();
 * 
 * #HTML Examples
 *
 * ###Simple popup
 * <div id="list" data-handler="y" data-role="content">
 *		<ul>example</ul>
 *		<ul>example</ul>
 *		<ul>example</ul>
 *		<ul>example</ul>
 *		<ul>example</ul>
 *		<ul>example</ul>
 *		<ul>example</ul>
 *		<ul>example</ul>
 *		<ul>example</ul>
 * </div>
 * @class ns.widget.wearable.ScrollHandler
 * @inheritdoc ns.widget.mobile.Scrollview
 * @extends ns.widget.mobile.Scrollview
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/utils/DOM/css",
			"../../../../core/utils/selectors",
			"../mobile",
			"./Scrollview",
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var ScrollHandler = function () {
					var self = this;
					/**
					 * @property {Object} options Widget options
					 * @member ns.widget.ScrollHandler
					 * @instance
					 */
					self.options = {
						/**
						 * @property {boolean} [options.handler=true] Enabled flag
						 * @member ns.widget.ScrollHandler
						 * @instance
						 */
						handler: true,
						/**
						 * @property {string} [options.handlerTheme=s] Handler theme
						 * @member ns.widget.ScrollHandler
						 * @instance
						 */
						handlerTheme: "s",
						/**
						 * @property {string} [options.direction=y] The direction of the handler
						 * @member ns.widget.ScrollHandler
						 * @instance
						 */
						direction: "y",
						/**
						 * @property {string} [options.scroll=y] The direction of scrolling
						 * @member ns.widget.ScrollHandler
						 * @instance
						 */
						scroll: "y"
					};
					/**
					 * @property {Object} ui A collection of handler UI elements
					 * @member ns.widget.ScrollHandler
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
					 * A collection of callbacks
					 * @property {Object} _callbacks
					 * @member ns.widget.ScrollHandler
					 * @protected
					 * @instance
					 */
					self._callbacks = {
						/**
						 * @property {Function} scrollstart Start handler
						 * @member ns.widget.ScrollHandler
						 * @instance
						 */
						scrolstart: null,
						/**
						 * @property {Function} scrollupdate Scrolling handler
						 * @member ns.widget.ScrollHandler
						 * @instance
						 */
						scrollupdate: null,
						/**
						 * @property {Function} scrollend Scroll end handler
						 * @member ns.widget.ScrollHandler
						 * @instance
						 */
						scrollend: null,
						/**
						 * @property {Function} touchstart Start handler
						 * @member ns.widget.ScrollHandler
						 * @instance
						 */
						touchstart: null,
						/**
						 * @property {Function} touchmove Touch move  handler
						 * @member ns.widget.ScrollHandler
						 * @instance
						 */
						touchmove: null,
						/**
						 * @property {Function} touchend Touch end handler
						 * @member ns.widget.ScrollHandler
						 * @instance
						 */
						touchend: null,
						/**
						 * @property {Function} resize Window resize handler
						 * @member ns.widget.ScrollHandler
						 * @instance
						 */
						resize: null
					};
					/**
					 * @property {boolean} [_dragging=false] A drag indicator flag
					 * @member ns.widget.ScrollHandler
					 * @protected
					 * @instance
					 */
					self._dragging = false;
					/**
					 * @property {Object} Collection of scroll bounds params
					 * @member ns.widget.ScrollHandler
					 * @protected
					 * @instance
					 */
					self._offsets = {
						x: 0,
						y: 0,
						maxX: 0,
						maxY: 0
					};
					/**
					 * @property {string} [_lastPointerEvents=''] Holds original pointer events state
					 * @member ns.widget.ScrollHandler
					 * @protected
					 * @instance
					 */
					self._lastPointerEvents = '';
					/**
					 * @property {number} [_availableOffsetX=0] Holds information about scrollviews available offset
					 * @member ns.widget.ScrollHandler
					 * @protected
					 * @instance
					 */
					self._availableOffsetX = 0;
					/**
					 * @property {number} [_availableOffsetX=0] Holds information about scrollviews available offset
					 * @member ns.widget.ScrollHandler
					 * @protected
					 * @instance
					 */
					self._availableOffsetY = 0;
					/**
					 * @property {?number} [_hideTimer=null] Holds timer ID
					 * @member ns.widget.ScrollHandler
					 * @protected
					 * @instance
					 */
					self._hideTimer = null;
					/**
					 * @property {Object} _lastMouse Holds last mouse position
					 * @member ns.widget.ScrollHandler
					 * @protected
					 * @instance
					 */
					self._lastMouse = {
						x: 0,
						y: 0
					};
				},
				/**
				 * @property {Object} engine  alias for {@link ns.engine}
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} CSSUtils alias for {@link ns.utils.DOM}
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				CSSUtils = ns.utils.DOM,
				/**
				 * @property {Object} selectors alias for {@link ns.utils.selectors}
				 * @member ns.widget.selectors
				 * @private
				 * @static
				 */
				selectors = ns.utils.selectors,
				/**
				 * @property {Object} Page classes alias for {@link ns.widget.mobile.Page}
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				PageClasses = ns.widget.mobile.Page.classes,
				/**
				 * @property {Object} Scrollview alias for {@link ns.widget.mobile.Scrollview}
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				Scrollview = ns.widget.mobile.Scrollview,
				/**
				 * @property {Object} ScrollviewPrototype Original scrollview prototype
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				ScrollviewPrototype = Scrollview.prototype,
				/**
				 * @property {Function} ScrollviewBuild Original scrollview build method
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				ScrollviewBuild = ScrollviewPrototype._build,
				/**
				 * @property {Function} ScrollviewInit Original scrollview init method
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				ScrollviewInit = ScrollviewPrototype._init,
				/**
				 * @property {Function} ScrollviewBindEvents Original scrollview bind events method
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				ScrollviewBindEvents = ScrollviewPrototype._bindEvents,
				/**
				 * @property {Function} ScrollviewDestroy Original scrollview destroy method
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				ScrollviewDestroy = ScrollviewPrototype._destroy,
				/**
				 * @property {Function} max Alias for Math.max
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				max = Math.max,
				/**
				 * @property {Function} min Alias for Math.min
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				min = Math.min,
				/**
				 * @property {Function} floor alias ofr Math.floor
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				floor = Math.floor,
				/**
				 * @property {Object} classes A collection of ScrollHandlers classes
				 * @member ns.widget.ScrollHandler
				 * @static
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
					disabled: "disabled"
				},
				/**
				 * @property {Object} ScrollviewPrototype Original scrollview prototype
				 * @member ns.widget.ScrollHandler
				 * @private
				 * @static
				 */
				prototype = new Scrollview();

			ScrollHandler.classes = classes;

			/**
			 * Translates objects position to a new position
			 * @private
			 * @static
			 * @param {ns.widget.ScrollHandler} self
			 * @param {number} xOffset
			 * @param {number} yOffset
			 */
			function translate(self, xOffset, yOffset) {
				var style = null,
					translateString = null;
				if (self.options.handler) {
					style = self.ui.handle.style;
					translateString = 'translate3d(' + (xOffset || 0) + 'px, ' + (yOffset || 0) + 'px, 0px)';

					style.webkitTransform = translateString;
					style.mozTransform = translateString;
					style.transform = translateString;
				}
			}

			/**
			 * Sets handler position according to scrollviews position
			 * @private
			 * @static
			 * @param {ns.widget.ScrollHandler} self
			 */
			function syncHandleWithScroll(self) {
				var position = self.getScrollPosition(),
					offsets = self._offsets,
					x = floor(min(position.x, self._availableOffsetX) / self._availableOffsetX * offsets.maxX),
					y = floor(min(position.y, self._availableOffsetY) / self._availableOffsetY * offsets.maxY);

				if (isNaN(x) === true) {
					x = offsets.x;
				}

				if (isNaN(y) === true) {
					y = offsets.y;
				}

				translate(self, x, y);

				offsets.x = x;
				offsets.y = y;
			}

			/**
			 * Handles scroll start event
			 * @private
			 * @static
			 * @param {ns.widget.ScrollHandler} self
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
			 * @private
			 * @static
			 * @param {ns.widget.ScrollHandler}
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
			 * @private
			 * @static
			 * @param {ns.widget.ScrollHandler}
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
			 * @private
			 * @static
			 * @param {ns.widget.ScrollHandler} self
			 * @param {number} x
			 * @param {number} y
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
					direction === 'y' ? 0 : offsets.x,
					direction === 'x' ? 0 : offsets.y
				);

				self.scrollTo(
					direction === 'y' ? 0 : offsets.x / offsets.maxX * self._availableOffsetX,
					direction === 'x' ? 0 : offsets.y / offsets.maxY * self._availableOffsetY
				);

				if (self._hideTimer) {
					window.clearTimeout(self._hideTimer);
				}
			}

			/**
			 * Handles touch start event
			 * @private
			 * @static
			 * @param {ns.widget.ScrollHandler} self 
			 * @param {MouseEvent|TouchEvent} event
			 */
			function handleTouchstart(self, event) {
				var lastMouse = self._lastMouse,
					touches = event.touches,
					touch = touches && touches[0],
					parent = self.element.parentNode;
				self._dragging = true;
				self._lastPointerEvents = CSSUtils.getCSSProperty(parent, 'pointer-events');
				// this is just for scroll speedup purposes
				// through method since we are using important flag
				parent.style.setProperty('pointer-events', 'none', 'important');
				lastMouse.x = touch ? touch.clientX : event.clientX;
				lastMouse.y = touch ? touch.clientY : event.clientY;

				event.stopImmediatePropagation();
				event.preventDefault();
			}

			/**
			 * Handles touch move events
			 * @private
			 * @static
			 * @param {ns.widget.ScrollHandler} self
			 * @param {MouseEvent|TouchEvent} event
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
			 * @private
			 * @static
			 * @param {ns.widget.ScrollHandler}
			 * @param {MouseEvent|TouchEvent}
			 */
			function handleTouchend(self, event) {
				var lastPointerEvents = self._lastPointerEvents,
					parentStyle = self.element.parentNode.style;
				if (self._dragging) {
					parentStyle.removeProperty('pointer-events');
					if (lastPointerEvents !== 'auto') {
						parentStyle.setProperty('pointer-events', lastPointerEvents);
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
			 * @method _build
			 * @protected
			 * @instance
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.ScrollHandler
			 */
			prototype._build = function (element) {
				var node = ScrollviewBuild.call(this, element),
					handler = document.createElement('div'),
					handle = document.createElement('div'),
					track = document.createElement('div'),
					thumb = document.createElement('div'),
					options = this.options,
					ui = this.ui;

				handler.className = classes.handler + ' ' + classes.themePrefix + options.handlerTheme + ' ' + classes.directionPrefix + options.direction;
				handle.className = classes.handle;
				thumb.className = classes.thumb;
				track.className = classes.track;

				handle.setAttribute('tabindex', 0);
				handle.setAttribute('aria-label', (options.direction === 'y' ? 'Vertical' : 'Horizontal') + ' handler, double tap and move to scroll');

				handle.appendChild(thumb);
				track.appendChild(handle);
				handler.appendChild(track);

				node.appendChild(handler);

				ui.handler = handler;
				ui.handle = handle;
				ui.track = track;
				ui.thumb = thumb;

				return node;
			};

			/**
			 * Init the scrollhander and scrollview
			 * @method _init
			 * @protected
			 * @instance
			 * @param {HTMLElement} element
			 * @member ns.widget.ScrollHandler
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self.ui,
					page = ui.page;

				ScrollviewInit.call(self, element);

				if (ui.handler === null) {
					ui.handler = element.querySelector('.' + classes.handler);
				}

				if (ui.track  === null) {
					ui.track = element.querySelector('.' + classes.track);
				}

				if (ui.handle === null) {
					ui.handle = element.querySelector('.' + classes.handle);
				}

				if (ui.thumb  === null) {
					ui.thumb = element.querySelector('.' + classes.thumb);
				}

				if (page === null) {
					page = selectors.getClosestByClass(element, PageClasses.uiPage);
				}
				ui.page = page;

				self.enableHandler(true);

				if (page.classList.contains(PageClasses.uiPageActive)) {
					self._refresh();
				}
			};

			/**
			 * Refreshes the scrollhander bounds and dimensions
			 * @method _refresh
			 * @protected
			 * @instance
			 * @member ns.widget.ScrollHandler
			 */
			prototype._refresh = function () {
				var self = this,
					element = self.element,
					offsets = self._offsets,
					ui = self.ui,
					handle = ui.handle,
					parent = element.parentNode,
					childrenWidth = 0,
					childrenHeight = 0,
					clipHeight = CSSUtils.getElementHeight(element, 'inner', true),
					clipWidth = CSSUtils.getElementWidth(element, 'inner', true),
					view = element.querySelector("." + Scrollview.classes.view),
					marginTop = null,
					child = parent.firstElementChild;

				while (child) {
					// filter out current scrollview
					if (child !== element) {
						childrenWidth += CSSUtils.getElementWidth(child, 'inner', true);
						childrenHeight += CSSUtils.getElementHeight(child, 'inner', true);
					} else if (marginTop === null) {
						marginTop = childrenHeight;
					}
					child = child.nextElementSibling;
				}

				marginTop = marginTop || 0;

				offsets.maxX = floor(max(0, clipWidth - childrenWidth - (CSSUtils.getElementWidth(handle, 'inner', true) / 2)));
				offsets.maxY = floor(max(0, clipHeight - childrenHeight - (CSSUtils.getElementHeight(handle, 'inner', true) / 2)));
				self._availableOffsetX = max(0, CSSUtils.getElementWidth(view, 'inner', true) - clipWidth);
				self._availableOffsetY = max(0, CSSUtils.getElementHeight(view, 'inner', true) - clipHeight);
				ui.handler.style.marginTop = marginTop + 'px';
			};

			/**
			 * Buinds the scrollhander and scrollview events
			 * @method _bindEvents
			 * @protected
			 * @instance
			 * @param {HTMLElement} element
			 * @member ns.widget.ScrollHandler
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
			 * @method enableHandler
			 * @instance
			 * @param {boolean} template
			 * @return {boolean}
			 * @member ns.widget.ScrollHandler
			 */
			prototype.enableHandler = function (enabled) {
				var self = this,
					scrollBarDisabledClass = classes.scrollbarDisabled,
					disabledClass = classes.disabled,
					element = self.element,
					parentClassList = element.parentNode.classList,
					elementClassList = element.classList;

				if (enabled !== undefined) {
					self.options.handler = enabled;
					if (enabled) {
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
			 * @method _setHandlerTheme
			 * @protected
			 * @instance
			 * @param {string} theme
			 * @member ns.widget.ScrollHandler
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
			 * @instance
			 * @member ns.widget.ScrollHandler
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self.ui,
					callbacks = self._callbacks,
					element = self.element;

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

