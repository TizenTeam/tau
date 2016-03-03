/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
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
/*jslint nomen: true, plusplus: true */
/**
 * #Tab Bar Widget
 * The tabbar widget shows an unordered list of tabs on the screen wrapped
 * together in a single group.
 *
 * This widget can be placed in the header or footer of page.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - HTML elements with data-role="tabbar"
 *  - HTML elements with class ui-tabbar
 *
 * ###HTML Examples
 *
 * ####Create simple tab bar in header
 *
 *        @example
 *        <div data-role="page">
 *            <div data-role="header">
 *                <div data-role="tabbar">
 *                    <ul>
 *                        <li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *                        <li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *                        <li><a data-icon="naviframe-call">Tabbar3</a></li>
 *                    </ul>
 *                </div>
 *            </div>
 *            <div data-role="content">
 *                Content
 *            </div>
 *        </div>
 *
 * ####Create simple tab bar in footer
 *
 *        @example
 *        <div data-role="page">
 *            <div data-role="content">Content</div>
 *            <div data-role="footer">
 *                <div data-role="tabbar">
 *                    <ul>
 *                        <li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *                        <li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *                        <li><a data-icon="naviframe-call">Tabbar3</a></li>
 *                    </ul>
 *                </div>
 *            </div>
 *        </div>
 *
 * ## Manual constructor
 * For manual creation of search bar widget you can use constructor of widget from
 * **tau** namespace:
 *
 *        @example
 *        <div data-role="page" id="tab-bar-page">
 *            <div data-role="header">
 *                <div id="ready-for-tab-bar">
 *                    <ul>
 *                        <li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *                        <li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *                        <li><a data-icon="naviframe-call">Tabbar3</a></li>
 *                    </ul>
 *                </div>
 *            </div>
 *            <div data-role="content">Content</div>
 *      </div>
 *        <script>
 *            (function (document) {
 *				var pageElement = document.getElementById("tab-bar-page"),
 *					tabBarElement = document.getElementById("ready-for-tab-bar"),
 *					tabBar;
 *
 *				function createPageHandle() {
 *					tabBar = tau.widget.TabBar(tabBarElement);
 *				}
 *
 *				pageElement.addEventListener("pagecreate", createPageHandle);
 *			}(document));
 *        </script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter is **options** and it is a object
 * with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *        @example
 *        <div data-role="page" id="tab-bar-page">
 *            <div data-role="header">
 *                <div id="ready-for-tab-bar">
 *                    <ul>
 *                        <li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *                        <li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *                        <li><a data-icon="naviframe-call">Tabbar3</a></li>
 *                    </ul>
 *                </div>
 *            </div>
 *            <div data-role="content">Content</div>
 *        </div>
 *        <script>
 *            (function (document) {
 *				function createPageHandle() {
 *					$("#ready-for-tab-bar").tabbar();
 *				}
 *
 *				$("#tab-bar-page").on("pagecreate", createPageHandle);
 *			}(document));
 *        </script>
 *
 * jQuery Mobile constructor has one optional parameter is **options** and it is
 * a object with options for widget.
 *
 * ##Options for tab bar widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *        @example
 *        <script>
 *        var tabBarElement = document.getElementById("tab-bar"),
 *            tabBar = tau.widget.TabBar(TabBarElement);
 *
 *        tabBar.methodName(methodArgument1, methodArgument2, ...);
 *        </script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *        @example
 *        <script>
 *        $(".selector").tabbar("methodName", methodArgument1, methodArgument2, ...);
 *        </script>
 *
 * @class ns.widget.core.TabBar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../BaseWidget",
			"../../../engine",
			"../../../util/selectors",
			"../../../util/grid",
			"../../../util/DOM",
			"../../../util/DOM/attributes",
			"../../../util/DOM/css",
			"../../../event/vmouse",
			"../../../event",
			"../Scrollview",
			"../Tab",
			"../Page",
			"../../../event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Tab = ns.widget.core.Tab,
				TabPrototype = Tab.prototype,
				engine = ns.engine,
				Page = ns.widget.core.Page,
				domUtils = ns.util.DOM,

				TabBar = function () {
					var self = this;

					self._type = {
						orientation: "portrait",
						withIcon: false,
						withTitle: false,
						static: false
					};
					self._ui = {};
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {string} [options.active="0"] Number of activated tab.
					 * @property {string} [options.autoChange=true] Defined if widget should set
					 * @member ns.widget.core.TabBar
					 */
					self.options = {
						active: 0,
						autoChange: true,
						autoPositionSet: true
					};
				},
				CLASS_PREFIX = "ui-tabbar",
				/**
				 * Object with class dictionary
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.core.TabBar
				 * @readonly
				 */
				classes = {
					TABBAR: CLASS_PREFIX,
					TAB_ACTIVE: "ui-tab-active",
					TAB_NO_TEXT: "ui-tab-no-text",
					TITLE: "ui-title",
					TABS_WITH_TITLE: "ui-tabs-with-title",
					TABBAR_WITH_TITLE: CLASS_PREFIX + "-with-title",
					TABBAR_WITH_ICON: CLASS_PREFIX + "-with-icon",
					TABBAR_PORTRAIT: CLASS_PREFIX + "-portrait",
					TABBAR_LANDSCAPE: CLASS_PREFIX + "-landscape",
					TABBAR_TEXT: CLASS_PREFIX + "-text",
					TABBAR_STATIC: CLASS_PREFIX + "-static",
					ANCHOR: CLASS_PREFIX + "-anchor"
				},
				events = ns.event,
				DEFAULT_NUMBER = {
					PORTRAIT_LIMIT_LENGTH: 3,
					PORTRAIT_DEVIDE_NUMBER: 3.7,
					LANDSCAPE_LIMIT_LENGTH: 4,
					LANDSCAPE_DEVIDE_NUMBER: 4.7,
					WITH_ICON_WITH_TITLE: 2,
					WITH_ICON_NO_TITLE: 4,
					DURATION: 250
				},
				prototype = new Tab();

			TabBar.prototype = prototype;
			TabBar.classes = classes;

			function findTitle(element) {
				var parentNode = element.parentNode,
					title;

				while (parentNode && !parentNode.classList.contains(Page.classes.uiPage)) {
					title = parentNode.querySelector("." + classes.TITLE);
					if (title) {
						return title;
					}
					parentNode = parentNode.parentNode;
				}
				return 0;
			}

			/**
			 * Build method
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._build = function (element) {
				var self = this,
					type = self._type,
					ui = self._ui,
					title = findTitle(element),
					tabs = element.querySelectorAll("li"),
					links = element.querySelectorAll("li a"),
					innerText,
					i,
					liLength,
					link,
					text;

				element.classList.add(classes.TABBAR);
				if (links.length === 0) {
					links = element.querySelectorAll("li div");
					if (links.length === 0) {
						ns.warn("There is no tab element");
						ui.links = links;
						ui.tabs = tabs;
						return element;
					}
				}
				if (title) {
					title.parentNode.classList.add(classes.TABS_WITH_TITLE);
					element.classList.add(classes.TABBAR_WITH_TITLE);
					type.withTitle = true;
				}
				if (links[0].hasAttribute("data-icon")) {
					element.classList.add(classes.TABBAR_WITH_ICON);
					type.withIcon = true;
				}

				for (i = 0, liLength = tabs.length; i < liLength; i++) {
					link = links[i];
					text = link.firstChild;
					if (text) {
						innerText = document.createElement("span");
						innerText.classList.add(classes.TABBAR_TEXT);
						innerText.appendChild(link.firstChild);
						link.appendChild(innerText);
					} else {
						link.classList.add(classes.TAB_NO_TEXT);
					}
					link.classList.add(classes.ANCHOR);
				}

				ui.links = links;
				ui.tabs = tabs;
				return element;
			};

			/**
			 * Init method
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.core.TabBar
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this,
					type = self._type,
					tabs = self._ui.tabs,
					options = self.options,
					offsetWidth = element.offsetWidth,
					length = tabs.length,
					wholeWidth = 0,
					elementWidth = 0,
					i = 0,
					isStatic = false;

				// get from class
				isStatic = type.static = element.classList.contains(classes.TABBAR_STATIC);
				// check if we have enough elements to make the list dynamic again
				if (tabs[0]) {
					elementWidth = domUtils.getElementWidth(tabs[0]);
					if (elementWidth === elementWidth && (elementWidth * length < offsetWidth) && !isStatic) { // check NaN
						isStatic = true;
					}
				}

				if (window.innerWidth < window.innerHeight) {
					element.classList.remove(classes.TABBAR_LANDSCAPE);
					element.classList.add(classes.TABBAR_PORTRAIT);
					type.orientation = "portrait";
				} else {
					element.classList.remove(classes.TABBAR_PORTRAIT);
					element.classList.add(classes.TABBAR_LANDSCAPE);
					type.orientation = "landscape";
				}

				for (i = 0; i < length; i++) {
					if (isStatic) { // make the elements "fit"
						elementWidth = parseInt(offsetWidth / length, 10) || 0;
						tabs[i].style.width = elementWidth + "px";
					} else { // just get each element with for scroll support
						elementWidth = domUtils.getElementWidth(tabs[i]);
					}
					wholeWidth += elementWidth;
				}
				self._wholeWidth = wholeWidth;
				self._translatedX = 0;
				self._lastX = 0;

				self._setActive(options.active);

				return element;
			};

			/**
			 * Bind events for widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._bindEvents = function () {
				var self = this,
					element = self.element,
					tabs = self._ui.tabs;

				events.enableGesture(
					element,
					new events.gesture.Drag()
				);
				events.on(element, "drag dragend", self, false);
				events.on(tabs, "vclick", self, false);
				window.addEventListener("resize", self, false);
			};

			/**
			 * Unbind events for widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._unBindEvents = function () {
				var self = this,
					element = self.element,
					tabs = self._ui.tabs;

				events.disableGesture(
					element,
					new events.gesture.Drag()
				);
				events.off(element, "drag dragend", self, false);
				events.off(tabs, "vclick", self, false);
				window.removeEventListener("resize", self, false);
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.TabBar
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "drag":
						self._onDrag(event);
						break;
					case "dragend":
						self._onDragEnd(event);
						break;
					case "vclick":
						self._onClick(event);
						break;
					case "resize":
						self._init(self.element);
				}
			};

			/**
			 * translate tabbar element
			 * @method _translate
			 * @param {number} x position
			 * @param {number} duration of animation
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._translate = function (x, duration) {
				var self = this,
					element = this.element;

				if (duration) {
					domUtils.setPrefixedStyle(element, "transition", domUtils.getPrefixedValue("transform " + duration / 1000 + "s ease-out"));
				}

				domUtils.setPrefixedStyle(element, "transform", "translate3d(" + x + "px, 0px, 0px)");

				self._lastX = x;
			};

			/**
			 * click event handler
			 * @method _onClick
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._onClick = function (event) {
				var self = this,
					ui = self._ui,
					options = self.options,
					selectTab = event.currentTarget.querySelector("A"),
					index,
					i,
					tabLength;

				for (i = 0, tabLength = ui.links.length; i < tabLength; i++) {
					if (ui.links[i] === selectTab) {
						index = i;
						break;
					}
					index = 0;
				}

				if (options.autoChange) {
					self._setActive(index);
				}
			};

			/**
			 * Drag event handler
			 * @method _onDrag
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.TabBar
			 */
			prototype._onDrag = function (event) {
				var self = this,
					element = self.element,
					deltaX = event.detail.deltaX,
					movedX = self._translatedX + deltaX,
					limitWidth = element.offsetWidth - self._wholeWidth;

				if (movedX > 0) {
					movedX = 0;
				} else if (movedX < limitWidth) {
					movedX = limitWidth;
				}
				self._translate(movedX, 0);
			};
			/**
			 * Dragend event handler
			 * @method _onDragEnd
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._onDragEnd = function () {
				var self = this;

				self._translatedX = self._lastX;
			};

			/**
			 * set the active tab
			 * @method _setActive
			 * @param {number} index
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._setActive = function (index) {
				var self = this,
					options = self.options,
					ui = self._ui;

				if (ui.links.length === 0) {
					return;
				}

				ui.links[options.active].classList.remove(classes.TAB_ACTIVE);
				ui.links[index].classList.add(classes.TAB_ACTIVE);
				options.active = index;
				self._setTabbarPosition();
				TabPrototype._setActive.call(self, index);
			};

			/**
			 * set Tabbar position automatically
			 * @method _setTabbarPosition
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._setTabbarPosition = function () {
				var self = this,
					offsetWidth = self.element.offsetWidth,
					activeIndex = self.options.active,
					relativeWidth = -self._lastX + offsetWidth,
					tabs = self._ui.tabs,
					activeTabOffsetWidth = tabs[0].offsetWidth * ((activeIndex - 0) + 1);

				if (activeTabOffsetWidth > relativeWidth) {
					self._translate(offsetWidth - activeTabOffsetWidth, DEFAULT_NUMBER.DURATION);
				} else if (activeTabOffsetWidth < relativeWidth) {
					if (activeTabOffsetWidth < offsetWidth) {
						self._translate(0, DEFAULT_NUMBER.DURATION);
					} else if (activeTabOffsetWidth <= relativeWidth + self._lastX) {
						self._translate(offsetWidth - activeTabOffsetWidth, DEFAULT_NUMBER.DURATION);
					}
				}
			};
			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._destroy = function () {
				var self = this;

				self._unBindEvents();
				self._type = null;
				self._ui = null;
				self.options = null;
			};

			ns.widget.core.TabBar = TabBar;
			engine.defineWidget(
				"TabBar",
				"[data-role='tabbar'], ." + CLASS_PREFIX,
				[
					"setActive",
					"getActive"
				],
				TabBar,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.TabBar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
