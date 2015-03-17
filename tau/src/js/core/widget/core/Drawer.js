/*global window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Drawer Widget
 * Core Drawer widget is a base for creating Drawer widgets for profiles. It
 * provides drawer functionality - container with ability to open and close with
 * an animation.
 *
 * ##Positioning Drawer left / right
 * To change position of a Drawer please set data-position attribute of Drawer
 * element to:
 * - left (left position, default)
 * - right (right position)
 *
 * ##Opening / Closing Drawer
 * To open / close Drawer one can use open() and close() methods.
 *
 * ##Checking if Drawer is opened.
 * To check if Drawer is opened use widget`s isOpen() method.
 *
 * ##Creating widget
 * Core drawer is a base class - examples of creating widgets are described in
 * documentation of profiles
 *
 * @class ns.widget.core.Drawer
 * @extends ns.widget.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../theme",
			"../../util/selectors",
			"../../util/DOM/css",
			"../../event",
			"../../event/gesture",
			"../../router/history",
			"../core", // fetch namespace
			"./Page",
			"../BaseWidget"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				/**
				 * @property {Object} selectors Alias for class ns.util.selectors
				 * @member ns.widget.core.Drawer
				 * @private
				 * @static
				 * @readonly
				 */
				selectors = ns.util.selectors,
				utilDOM = ns.util.DOM,
				events = ns.event,
				history = ns.router.history,
				Gesture = ns.event.gesture,
				Page = ns.widget.core.Page,
				STATE = {
					CLOSED: "closed",
					OPENED: "opened",
					SLIDING: "sliding",
					SETTLING: "settling"
				},
				CUSTOM_EVENTS = {
					OPEN: "draweropen",
					CLOSE: "drawerclose"
				},
				/**
				 * Default values
				 * @property {number} 240
				 */
				DEFAULT = {
					WIDTH: 240,
					DURATION: 300,
					POSITION: "left"
				},
				/**
				 * Drawer constructor
				 * @method Drawer
				 */
				Drawer = function () {
					var self = this;
					/**
					 * Drawer field containing options
					 * @property {string} Position of Drawer ("left" or "right")
					 * @property {number} Width of Drawer
					 * @property {number} Duration of Drawer entrance animation
					 * @property {boolean} If true Drawer will be closed on arrow click
					 * @property {boolean} Sets whether to show an overlay when Drawer is open.
					 */
					self.options = {
						position : DEFAULT.POSITION,
						width : DEFAULT.WIDTH,
						duration : DEFAULT.DURATION,
						closeOnClick: true,
						overlay: true,
						drawerTarget: "." + Page.classes.uiPage,
						enable: true,
						dragEdge: 1
					};

					self._pageSelector = null;

					self._isDrag = false;
					self._state = STATE.CLOSED;
					self._settlingType = STATE.CLOSED;
					self._traslatedX = 0;

					self._ui = {};

					self._drawerOverlay = null;
				},
				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @member ns.widget.core.Drawer
				 * @private
				 * @static
				 * @readonly
				 */
				classes = {
					page : "ui-page",
					header: "ui-header",
					drawer : "ui-drawer",
					drawerHeader : "ui-drawer-header",
					left : "ui-drawer-left",
					right : "ui-drawer-right",
					overlay : "ui-drawer-overlay",
					open : "ui-drawer-open",
					close : "ui-drawer-close"
				},
				/**
				 * {Object} Drawer widget prototype
				 * @member ns.widget.core.Drawer
				 * @private
				 * @static
				 */
				prototype = new BaseWidget();

			Drawer.prototype = prototype;
			Drawer.classes = classes;

			/**
			 * Unbind drag events
			 * @method unbindDragEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			function unbindDragEvents(element) {
				var self = this;

				ns.event.disableGesture(element);
				events.off(element, "drag dragstart dragend dragcancel swipe swipeleft swiperight vmouseup", self, false);
				events.off(self.element, "transitionEnd webkitTransitionEnd", self, false);
				events.off(window, "resize", self, false);
				if (self._drawerOverlay) {
					events.off(self._drawerOverlay, "vclick", self, false);
				}
				if (self._drawerPage) {
					events.off(self._drawerPage, "pagebeforeshow", self, false);
				}
			}

			/**
			 * bind drag events
			 * @method bindDragEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			function bindDragEvents(element) {
				var self = this;
				self._eventBoundElement = element;

				ns.event.enableGesture(
					element,

					new ns.event.gesture.Drag(),
					new ns.event.gesture.Swipe({
						orientation: Gesture.Orientation.HORIZONTAL
					})
				);

				events.on(element, "drag dragstart dragend dragcancel swipe swipeleft swiperight vmouseup", self, false);
				events.on(self.element, "transitionEnd webkitTransitionEnd", self, false);
				events.on(window, "resize", self, false);
				if (self._drawerOverlay) {
					events.on(self._drawerOverlay, "vclick", self, false);
				}
				if (self._drawerPage) {
					events.on(self._drawerPage, "pagebeforeshow", self, false);
				}

			};
			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype.handleEvent = function(event) {
				var self = this;
				switch (event.type) {
					case "drag":
						self._onDrag(event);
						break;
					case "dragstart":
						self._onDragStart(event);
						break;
					case "dragend":
						self._onDragEnd(event);
						break;
					case "dragcancel":
						self._onDragCancel(event);
						break;
					case "vmouseup":
						self._onMouseup(event);
						break;
					case "swipe":
					case "swipeleft":
					case "swiperight":
						self._onSwipe(event);
						break;
					case "vclick":
						self._onClick(event);
						break;
					case "transitionEnd":
					case "webkitTransitionEnd":
						self._onTransitionEnd(event);
						break;
					case "resize":
						self._onResize(event);
						break;
					case "pagebeforeshow":
						self._onPagebeforeshow(event);
						break;
				}
			};
			prototype._onMouseup = function() {
				var self = this;
				if (self._state === STATE.SLIDING) {
					self.close();
				}
			};
			/**
			 * Click event handler
			 * @method onClick
			 * @param {ns.widget.core.Drawer} self
			 * ;@member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			prototype._onClick = function() {
				var self = this;
				if (self._state === STATE.OPENED) {
					self.close();
				}
			};

			/**
			 * Resize event handler
			 * @method onResize
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			prototype._onResize = function() {
				var self = this;
				// resize event handler
				self._refresh();
			};

			/**
			 * Pageshow event handler
			 * @method onPageshow
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			prototype._onPagebeforeshow = function() {
				var self = this;
				self._refresh();
			};

			/**
			 * webkitTransitionEnd event handler
			 * @method _onTransitionEnd
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			prototype._onTransitionEnd = function (event) {
				var self = this,
					position = self.options.position,
					drawerOverlay = self._drawerOverlay;

				if (self._state === STATE.SETTLING) {
					if (self._settlingType === STATE.OPENED) {
						self.trigger(CUSTOM_EVENTS.OPEN, {
							position: position
						});
						self._setActive(true);
						self._state = STATE.OPENED;
					} else {
						self.close();
						self.trigger(CUSTOM_EVENTS.CLOSE, {
							position: position
						});
						self._setActive(false);
						self._state = STATE.CLOSED;
						if (drawerOverlay) {
							drawerOverlay.style.visibility = "hidden";
						}
					}
				}
			};

			/**
			 * Swipe event handler
			 * @method _onSwipe
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype._onSwipe = function(event) {
				var self = this,
					direction,
					options = self.options;

				// Now mobile has two swipe event
				if (event.detail) {
					direction = event.detail.direction === "left" ? "right" : "left";
				} else if (event.type === "swiperight") {
					direction = "left";
				} else if (event.type === "swipeleft") {
					direction = "right";
				}
				if (options.enable && self._isDrag && options.position === direction) {
					self.open();
					self._isDrag = false;
				}
			};
			/**
			 * Dragstart event handler
			 * @method _onDragStart
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype._onDragStart = function(event) {
				var self = this;
				if (self._state === STATE.OPENED) {
					return;
				}
				if (self.options.enable && !self._isDrag && self._state !== STATE.SETTLING && self._checkSideEdge(event)) {
					self._isDrag = true;
				} else {
					self.close();
				}
			};
			/**
			 * Drag event handler
			 * @method _onDrag
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype._onDrag = function(event) {
				var self = this,
					deltaX = event.detail.deltaX,
					options = self.options,
					translatedX = self._traslatedX,
					movedX;

				if (options.enable && self._isDrag && self._state !== STATE.SETTLING) {
					if (options.position === "left"){
						movedX = -options.width + deltaX + translatedX;
						if (movedX < 0) {
							self._translate(movedX, 0);
						}
					} else {
						movedX = options.width + deltaX - translatedX;
						if (movedX > 0) {
							self._translate(movedX, 0);
						}
					}
				}
			};
			/**
			 * DragEnd event handler
			 * @method _onDragEnd
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype._onDragEnd = function(event) {
				var self = this,
					options = self.options,
					detail = event.detail;
				if (options.enable && self._isDrag) {
					if (Math.abs(detail.deltaX) > options.width / 2) {
						self.open();
					} else if (self._state !== STATE.SETTLING) {
						self.close();
					}
				}
				self._isDrag = false;
			};
			/**
			 * DragCancel event handler
			 * @method _onDragCancel
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype._onDragCancel = function(event) {
				var self = this;
				if (self.options.enable && self._isDrag) {
					self.close();
				}
				self._isDrag = false;
			};
			/**
			 * Drawer translate function
			 * @method _translate
			 * @param {number} x
			 * @param {number} duration
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._translate = function (x, duration) {
				var self = this,
					element = self.element;

				if (self._state !== STATE.SETTLING) {
					self._state = STATE.SLIDING;
				}

				if (duration) {
					utilDOM.setPrefixedStyle(element, "transition", utilDOM.getPrefixedValue("transform " + duration / 1000 + "s ease-out"));
				}

				// there should be a helper for this :(
				utilDOM.setPrefixedStyle(element, "transform", "translate3d(" + x + "px, 0px, 0px)");
				if (self.options.overlay) {
					self._setOverlay(x);
				}
				if (!duration) {
					self._onTransitionEnd();
				}

			};
			prototype._setOverlay = function (x) {
				var self = this,
					options = self.options,
					overlay = self._drawerOverlay,
					overlayStyle = overlay.style,
					absX = Math.abs(x),
					ratio = options.position === "right" ? absX / window.innerWidth : absX / options.width;

				if(ratio < 1) {
					overlayStyle.visibility = "visible";
				} else {
					overlayStyle.visibility = "hidden";
				}
				overlayStyle.opacity = 1 - ratio;
			};
			prototype._setActive = function (active) {
				var self = this,
					route = engine.getRouter().getRoute("drawer");

				if (active) {
					route.setActive(self);
				} else {
					route.setActive(null);
				}
			};

			/**
			 * Build structure of Drawer widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this;
				element.classList.add(classes.drawer);
				self._drawerPage = selectors.getClosestByClass(element, classes.page);
				self._drawerPage.style.overflowX = "hidden";

				self._headerElement = selectors.getClosestByClass(element, classes.page).querySelector("." + classes.header);

				if (self._headerElement) {
					self._headerElement.classList.add(classes.drawerHeader);
				}

				if (self.options.overlay) {
					self._createOverlay(element);
					self._drawerOverlay.style.visibility = "hidden";
				}

				return element;
			};

			/**
			 * Initialization of Drawer widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._init = function (element) {
				this._initLayout();
				return element;
			};

			/**
			 * init Drawer widget layout
			 * @method _initLayout
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 */
			prototype._initLayout = function() {
				var self = this,
					options = self.options,
					element = self.element,
					ui = self._ui,
					overlayStyle = self._drawerOverlay ? self._drawerOverlay.style : false,
					placeholder = document.createComment(element.id + "-placeholder");

				ui._pageElement = selectors.getClosestByClass(element, Page.classes.uiPage);
				ui._targetElement = selectors.getClosestBySelector(element, options.drawerTarget);
				ui._targetElement.appendChild(element);
				if (!ui._placeholder) {
					ui._placeholder = placeholder;
					element.parentNode.insertBefore(placeholder, element);
				}
				options.width = options.width || element.offsetWidth;

				ui._targetElement.style.overflowX = "hidden";
				if (overlayStyle) {
					overlayStyle.width = window.innerWidth + "px";
					overlayStyle.height = window.innerHeight + "px";
				}
				if (options.position === "right") {
					element.classList.add(classes.right);
					self._translate(window.innerWidth, 0);
				} else {
					// left or default
					element.classList.add(classes.left);
					self._translate(-options.width, 0);
				}
				self._state = STATE.CLOSED;
			};

			/**
			 * Provides translation if position is set to right
			 * @method _translateRight
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._translateRight = function() {
				var self = this,
					options = self.options;
				if (options.position === "right") {
					// If drawer position is right, drawer should be moved right side
					if (self._STATE) {
						// drawer opened

						self._translate(window.innerWidth - options.width, 0);
					} else {
						// drawer closed
						self._translate(window.innerWidth, 0);
					}
				}
			};

			/**
			 * Check dragstart event whether triggerred on side edge area or not
			 * @method _checkSideEdge
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype._checkSideEdge = function(event) {
				var self = this,
					detail = event.detail,
					eventClientX = detail.pointer.clientX - detail.estimatedDeltaX,
					options = self.options,
					position = options.position,
					boundElement = self._eventBoundElement,
					boundElementOffsetWidth = boundElement.offsetWidth,
					boundElementRightEdge = boundElement.offsetLeft + boundElementOffsetWidth,
					dragStartArea = boundElementOffsetWidth * options.dragEdge;

				if ((position === "left" && eventClientX > 0 && eventClientX < dragStartArea) ||
					(position === "right" && eventClientX > boundElementRightEdge - dragStartArea &&
					eventClientX < boundElementRightEdge)) {
					return true;
				}
				return false;
			};
			/**
			 * Refreshes Drawer widget
			 * @method _refresh
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._refresh = function() {
				// Drawer layout has been set by parent element layout
				var self = this,
					options = self.options,
					drawerElementParent = self.element.parentNode,
					drawerHeight = drawerElementParent.clientHeight,
					drawerStyle = self.element.style,
					drawerOverlay = self._drawerOverlay,
					overlayStyle = drawerOverlay && drawerOverlay.style;

				drawerStyle.width = options.width + "px";
				drawerStyle.height = drawerHeight + "px";

				if (overlayStyle) {
					overlayStyle.width = window.innerWidth + "px";
					overlayStyle.height = window.innerHeight + "px";
				}

				self._translateRight();
				self._initLayout();
			};
			/**
			 * Creates Drawer overlay element
			 * @method _createOverlay
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._createOverlay = function(element) {
				var self = this,
					overlayElement = document.createElement("div");

				overlayElement.classList.add(classes.overlay);
				element.parentNode.insertBefore(overlayElement, element);
				self._drawerOverlay = overlayElement;
			};

			/**
			 * Binds events to a Drawer widget
			 * @method _bindEvents
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._bindEvents = function() {
				var self = this,
					targetElement = self._ui._targetElement;

				bindDragEvents.call(self, targetElement);
			};

			/**
			 * Enable Drawer widget
			 * @method _enable
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._enable = function() {
				this._oneOption("enable", true);
			};

			/**
			 * Disable Drawer widget
			 * @method _disable
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._disable = function() {
				this._oneOption("enable", false);
			};

			/**
			 * Checks Drawer status
			 * @method isOpen
			 * @member ns.widget.core.Drawer
			 * @return {boolean} Returns true if Drawer is open
			 */
			prototype.isOpen = function() {
				if (this._state == STATE.OPENED) {
					return true;
				}
				return false;
			};

			/**
			 * Opens Drawer widget
			 * @method open
			 * @param {number} [duration] Duration for opening, if is not set then method take value from options
			 * @member ns.widget.core.Drawer
			 */
			prototype.open = function(duration) {
				var self = this,
					options = self.options,
					drawerClassList = self.element.classList,
					drawerOverlay = self._drawerOverlay;
				if (self._state !== STATE.OPENED) {
					self._state = STATE.SETTLING;
					self._settlingType = STATE.OPENED;
					duration = duration !== undefined ? duration : options.duration;
					if (drawerOverlay) {
						drawerOverlay.style.visibility = "visible";
					}
					drawerClassList.remove(classes.close);
					drawerClassList.add(classes.open);
					if (options.position === "left") {
						self._translate(0, duration);
					} else {
						self._translate(window.innerWidth - options.width, duration);
					}
				}
			};

			/**
			 * Closes Drawer widget
			 * @method close
			 * @param {number} [duration] Duration for closing, if is not set then method take value from options
			 * @member ns.widget.core.Drawer
			 */
			prototype.close = function(options, duration) {
				var self = this,
					reverse = options ? options.reverse : false,
					selfOptions = self.options,
					drawerClassList = self.element.classList;
				if (self._state !== STATE.CLOSED) {
					if (!reverse && self._state === STATE.OPENED) {
						// This method was fired by JS code or this widget.
						history.back();
						return;
					}
					self._state = STATE.SETTLING;
					self._settlingType = STATE.CLOSED;
					duration = duration !== undefined ? duration : selfOptions.duration;
					drawerClassList.remove(classes.open);
					drawerClassList.add(classes.close);
					if (selfOptions.position === "left") {
						self._translate(-selfOptions.width, duration);
					} else {
						self._translate(window.innerWidth, duration);
					}
				}
			};

			/**
			 * Set Drawer drag handler.
			 * If developer use handler, drag event is bound at handler only.
			 */
			prototype.setDragHandler = function(element) {
				var self = this;
				self.options.dragEdge = 1;
				unbindDragEvents.call(self, self._eventBoundElement);
				bindDragEvents.call(self, element);
			};

			/**
			 * Transition Drawer widget.
			 * This method use only positive integer number.
			 */
			prototype.transition = function(position) {
				var self = this,
					options = self.options;
				if (options.position === "left"){
					self._translate(-options.width + position, options.duration);
				} else {
					self._translate(options.width - position , options.duration);
				}
				self._traslatedX = position;
			};

			/**
			 * Get state of Drawer widget.
			 */
			prototype.getState = function() {
				return this._state;
			};
			/**
			 * Destroys Drawer widget
			 * @method _destroy
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._destroy = function() {
				var self = this,
					drawerOverlay = self._drawerOverlay,
					placeholder = self._ui._placeholder,
					placeholderParent = placeholder.parentNode,
					element = self.element;

				placeholderParent.insertBefore(element, placeholder);
				placeholderParent.removeChild(placeholder);

				if (drawerOverlay) {
					drawerOverlay.removeEventListener("vclick", self._onClickBound, false);
				}
				unbindDragEvents.call(self, self._eventBoundElement);
			};

			ns.widget.core.Drawer = Drawer;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Drawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
