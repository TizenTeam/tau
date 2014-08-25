/*global window, define */
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
/**
 * #Drawer Widget
 * Drawer widget provide creating drawer widget and managing drawer operation.
 *
 * ##Default selector
 * You can make the drawer widget as data-role="drawer" with DIV tag.
 *
 * ###  HTML Examples
 *
 * ####  Create drawer using data-role
 *
 * 		@example
 *		<div data-role="drawer" data-position="left" id="leftdrawer">
 *			<ul data-role="listview">
 *				<li class="ui-drawer-main-list"><a href="#">List item 1</a></li>
 *				<li class="ui-drawer-main-list"><a href="#">List item 2</a></li>
 *				<li class="ui-drawer-sub-list"><a href="#">Sub item 1</a></li>
 *			</ul>
 *		</div>
 *
 * ##Drawer positioning
 * You can declare to drawer position manually. (Default is left)
 *
 * If you implement data-position attributes value is 'left', drawer appear from left side.
 *
 * 		@example
 *		<div data-role="drawer" data-position="left" id="leftdrawer">
 *
 * - "left" - drawer appear from left side
 * - "right" - drawer appear from right side
 *
 * ##Drawer inner list
 * Drawer has two list styles, main list style and sub list style.
 * You can implement two providing list styles as implement classes.
 *
 * - "ui-drawer-main-list" : Main list style of drawer
 * - "ui-drawer-sub-list" : Sub list style of drawer
 *
 * ##Drawer methods
 *
 * You can use some methods of drawer widget.
 *
 * - "open" - drawer open
 *
 * 		@example
 * 		$("#leftdrawer").drawer("open");
 *
 * - "close" - drawer close
 *
 * 		@example
 * 		$("#leftdrawer").drawer("isOpen");
 *
 * - "isOpen" - get drawer status, true is opened and false if closed
 *
 * 		@example
 * 		$("#leftdrawer").drawer"(isOpen");
 *
 * ##Drawer Options
 *
 * - position: drawer appeared position. Type is <String> and default is "left".
 * - width: drawer width. Type is <Integer> and default is 290.
 * - duration: drawer appreared duration. <Integer> and default is 100.
 *
 *

 * @class ns.widget.core.Drawer
 * @extends ns.widget.mobile.BaseWidgetMobile
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../theme",
			"../../util/selectors",
			"../core", // fetch namespace
			"../BaseWidget"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				selectors = ns.util.selectors,
				Drawer = function () {
					var self = this;
					self.options = {
						position : "left",
						width : 290,
						duration : 100,
						closeOnClick: true,
						overlay: true
					};

					self._onOverlayClickBound = null;
					self._onTransitionEndBound = null;
					self._onResizeBound = null;
					self._onPageshowBound = null;

					self._pageSelector = null;

					self._isOpen = false;

					self._ui = {};
				},
				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.core.Drawer
				 */
				classes = {
					drawer : "ui-drawer",
					header : "ui-drawer-header",
					left : "ui-drawer-left",
					right : "ui-drawer-right",
					overlay : "ui-drawer-overlay",
					open : "ui-drawer-open",
					close : "ui-drawer-close"
				},
				prototype = new BaseWidget();

			Drawer.prototype = prototype;
			Drawer.classes = classes;

			/**
			 * Click event handler
			 * @method onClick
			 * @private
			 * @static
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 */
			function onClick(self) {
				// vclick event handler
				if (self._isOpen) {
					self.close();
				}
			}

			/**
			 * webkitTransitionEnd event handler
			 * @method onTransitionEnd
			 * @private
			 * @static
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 */
			function onTransitionEnd(self) {
				// webkitTransitionEnd event handler
				if (!self._isOpen) {
					// not open -> transition -> open
					self._isOpen = true;
				} else {
					// open -> transition -> close
					self._isOpen = false;
					if (self._drawerOverlay) {
						self._drawerOverlay.style.visibility = "hidden";
					}
				}
			}

			/**
			 * Resize event handler
			 * @method onResize
			 * @private
			 * @static
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 */
			function onResize(self) {
				// resize event handler
				self._refresh();
			}

			/**
			 * Pageshow event handler
			 * @method onPageshow
			 * @private
			 * @static
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 */
			function onPageshow(self) {
				self._refresh();
			}

			/**
			 * Drawer translate function
			 * @method translate
			 * @private
			 * @static
			 * @param {HTMLElement} element
			 * @param {number} x
			 * @param {number} duration
			 * @member ns.widget.core.Drawer
			 */
			function translate(element, x, duration) {
				var transition = "none";

				if (duration) {
					transition =  "-webkit-transform " + duration / 1000 + "s ease-out";
				}

				element.style.webkitTransform = "translate3d(" + x + "px, 0px, 0px)";
				element.style.webkitTransition = transition;
			}

			/**
			 * Build structure of Drawer widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._build = function (element) {
				var self = this,
					headerElement;
				element.classList.add(classes.drawer);
				self._drawerPage = selectors.getClosestByClass(element, this._pageSelector);
				self._drawerPage.style.overflow = "hidden";

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
			 * Init of Drawer widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._init = function (element) {
				var self = this,
					options = self.options;

				if (options.position === "right") {
					element.classList.add(classes.right);
					translate(element, window.innerWidth, 0);
				} else {
					// left or default
					element.classList.add(classes.left);
					translate(element, -options.width, 0);
				}
			};

			/**
			 * Refresh of Drawer widget
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._refresh = function() {
				// Drawer layout has been set by parent element layout
				var self = this,
					options = self.options,
					drawerElementParent = self.element.parentNode,
					headerHeight = self._headerElement && self._headerElement.offsetHeight,
					drawerHeight = drawerElementParent.clientHeight - headerHeight,
					drawerStyle = self.element.style,
					overlayStyle = self._drawerOverlay && self._drawerOverlay.style;

				drawerStyle.width = options.width + "px";
				drawerStyle.height = drawerHeight + "px";
				drawerStyle.top = headerHeight + "px";

				if (overlayStyle) {
					overlayStyle.width = window.innerWidth + "px";
					overlayStyle.height = drawerHeight + "px";
					overlayStyle.top = headerHeight + "px";
				}

				if (options.position === "right") {
					// If drawer position is right, drawer should be moved right side
					if (self._isOpen) {
						// drawer opened
						translate(self.element, window.innerWidth - options.width, 0);
					} else {
						// drawer closed
						translate(self.element, window.innerWidth, 0);
					}
				}
			};

			/**
			 * Create drawer overlay element
			 * @method _createOverlay
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._createOverlay = function(element) {
				var self = this,
					overlayElement = document.createElement("div");

				overlayElement.classList.add(classes.overlay);
				element.parentNode.insertBefore(overlayElement, element);
				self._drawerOverlay = overlayElement;
			};

			/**
			 * Bind events of Drawer widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._bindEvents = function() {
				var self = this;
				self._onClickBound = onClick.bind(null, self);
				self._onTransitionEndBound = onTransitionEnd.bind(null, self);
				self._onResizeBound = onResize.bind(null, self);
				self._onPageshowBound = onPageshow.bind(null, self);

				if (self.options.overlay && self.options.closeOnClik) {
					self._drawerOverlay.addEventListener("vclick", self._onClickBound, false);
				}
				self.element.addEventListener("webkitTransitionEnd", self._onTransitionEndBound, false);
				self.element.addEventListener("transitionEnd", self._onTransitionEndBound, false);
				window.addEventListener("resize", self._onResizeBound, false);
				self._drawerPage.addEventListener("pageshow", self._onPageshowBound, false);
			};

			/**
			 * check drawer status
			 * @method isOpen
			 * @member ns.widget.core.Drawer
			 */
			prototype.isOpen = function() {
				return this._isOpen;
			};

			/**
			 * Open drawer widget
			 * @method open
			 * @member ns.widget.core.Drawer
			 */
			prototype.open = function() {
				var self = this,
					options = self.options,
					drawer = self.element,
					drawerClassList = self.element.classList;
				if (self._drawerOverlay) {
					self._drawerOverlay.style.visibility = "visible";
				}
				drawerClassList.remove(classes.close);
				drawerClassList.add(classes.open);
				if (options.position === "left") {
					translate(drawer, 0, options.duration);
				} else {
					translate(drawer, window.innerWidth - options.width, options.duration);
				}
			};

			/**
			 * Close drawer widget
			 * @method close
			 * @member ns.widget.core.Drawer
			 */
			prototype.close = function() {
				var self = this,
					options = self.options,
					drawer = self.element,
					drawerClassList = self.element.classList;
				drawerClassList.remove(classes.open);
				drawerClassList.add(classes.close);
				if (options.position === "left") {
					translate(drawer, -options.width, options.duration);
				} else {
					translate(drawer, window.innerWidth, options.duration);
				}
			};

			/**
			 * Destroy drawer widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._destroy = function() {
				var self = this;
				self._drawerOverlay.removeEventListener("vclick", self._onClickBound, false);
				self.element.removeEventListener("webkitTransitionEnd", self._onTransitionEndBound, false);
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