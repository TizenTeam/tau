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
			"../core", // fetch namespace
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
				STATUSES = {
					CLOSE: 0,
					CLOSING: 1,
					OPENING: 2,
					OPEN: 3
				},
				/**
				 * Default values
				 * @property {number} 240
				 */
				DEFAUT = {
					WIDTH: 240
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
						position : "left",
						width : 0,
						duration : 100,
						closeOnClick: true,
						overlay: true
					};

					self._onOverlayClickBound = null;
					self._onResizeBound = null;
					self._onPageshowBound = null;

					self._pageSelector = null;

					self._status = STATUSES.CLOSE;

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
					drawer : "ui-drawer",
					header : "ui-drawer-header",
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
			 * Click event handler
			 * @method onClick
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			function onClick(self) {
				// vclick event handler
				if (self._status === STATUSES.OPEN) {
					self.close();
				}
			}

			/**
			 * Resize event handler
			 * @method onResize
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			function onResize(self) {
				// resize event handler
				self._refresh();
			}

			/**
			 * Pageshow event handler
			 * @method onPageshow
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			function onPageshow(self) {
				self._refresh();
			}

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
					drawerOverlay = self._drawerOverlay;
				// webkitTransitionEnd event handler
				// event is called many times for each property which is transitioned
				if (!event || (self.element === event.target &&
					self._lastEventTimeStamp !== event.timeStamp)) {
					if (self._status === STATUSES.OPENING) {
						// not open -> transition -> open
						self._status = STATUSES.OPEN;
					} else {
						// open -> transition -> close
						self._status = STATUSES.CLOSE;
						if (drawerOverlay) {
							drawerOverlay.style.visibility = "hidden";
						}
					}
				}
				if (event) {
					self._lastEventTimeStamp = event.timeStamp;
				}
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
				var element = this.element;

				if (duration) {
					utilDOM.setPrefixedStyle(element, "transition", utilDOM.getPrefixedValue("transform " + duration / 1000 + "s ease-out"));
				}

				// there should be a helper for this :(
				utilDOM.setPrefixedStyle(element, "transform", "translate3d(" + x + "px, 0px, 0px)");
				if (!duration) {
					this._onTransitionEnd();
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
				var self = this,
					headerElement;
				element.classList.add(classes.drawer);
				self._drawerPage = selectors.getClosestByClass(element, classes.page);
				self._drawerPage.style.overflowX = "hidden";

				headerElement = element.nextElementSibling;
				while (headerElement) {
					if (headerElement.classList.contains("ui-header")) {
						break;
					}
					headerElement = headerElement.nextElementSibling;
				}

				if (headerElement) {
					headerElement.classList.add(classes.header);
				}

				self._headerElement = headerElement;

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
				var self = this,
					options = self.options;

				options.width = options.width || DEFAUT.WIDTH;
				if (options.position === "right") {
					element.classList.add(classes.right);
					self._translate(window.innerWidth, 0);
				} else {
					// left or default
					element.classList.add(classes.left);
					self._translate(-options.width, 0);
				}
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
					if (self._status) {
						// drawer opened

						self._translate(window.innerWidth - options.width, 0);
					} else {
						// drawer closed
						self._translate(window.innerWidth, 0);
					}
				}
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
					overlayStyle.height = drawerHeight + "px";
				}

				self._translateRight();
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
					options = self.options,
					drawerOverlay = self._drawerOverlay,
					element = self.element;
				self._onClickBound = onClick.bind(null, self);
				self._onResizeBound = onResize.bind(null, self);
				self._onPageshowBound = onPageshow.bind(null, self);
				self._onTransitionEndBound = function(e) {
					self._onTransitionEnd(e);
				};

				if (options.overlay && options.closeOnClick && drawerOverlay) {
					drawerOverlay.addEventListener("vclick", self._onClickBound, false);
				}
				events.prefixedFastOn(element, "transitionEnd", self._onTransitionEndBound, false);
				window.addEventListener("resize", self._onResizeBound, false);
				self._drawerPage.addEventListener("pageshow", self._onPageshowBound, false);
			};

			/**
			 * Checks Drawer status
			 * @method isOpen
			 * @member ns.widget.core.Drawer
			 * @return {boolean} Returns true if Drawer is open
			 */
			prototype.isOpen = function() {
				return this._status === STATUSES.OPEN;
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
				if (self._status === STATUSES.CLOSE) {
					duration = duration !== undefined ? duration : options.duration;
					if (drawerOverlay) {
						drawerOverlay.style.visibility = "visible";
					}
					drawerClassList.remove(classes.close);
					drawerClassList.add(classes.open);
					self._status = STATUSES.OPENING;
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
			prototype.close = function(duration) {
				var self = this,
					options = self.options,
					drawerClassList = self.element.classList;
				if (self._status === STATUSES.OPEN) {
					duration = duration !== undefined ? duration : options.duration;
					drawerClassList.remove(classes.open);
					drawerClassList.add(classes.close);
					self._status = STATUSES.CLOSING;
					if (options.position === "left") {
						self._translate(-options.width, duration);
					} else {
						self._translate(window.innerWidth, duration);
					}
				}
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
					element = self.element;
				if (drawerOverlay) {
					drawerOverlay.removeEventListener("vclick", self._onClickBound, false);
				}
				events.prefixedFastOff(element, "transitionEnd", self._onTransitionEndBound, false);
				window.removeEventListener("resize", self._onResizeBound, false);
				self._drawerPage.removeEventListener("pageshow", self._onPageshowBound, false);
			};

			ns.widget.core.Drawer = Drawer;


			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Drawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
