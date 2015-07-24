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
 *		@example
 *		<div data-role="page">
 *			<div data-role="header">
 *				<div data-role="tabbar">
 *					<ul>
 *						<li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *						<li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *						<li><a data-icon="naviframe-call">Tabbar3</a></li>
 *					</ul>
 *				</div>
 *			</div>
 *			<div data-role="content">
 *				Content
 *			</div>
 *		</div>
 *
 * ####Create simple tab bar in footer
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content">
 *			 	Content
 *			</div>
 *			<div data-role="footer">
 *				<div data-role="tabbar">
 *					<ul>
 *						<li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *						<li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *						<li><a data-icon="naviframe-call">Tabbar3</a></li>
 *					</ul>
 *				</div>
 *			</div>
 *		</div>
 *
 * ## Manual constructor
 * For manual creation of search bar widget you can use constructor of widget from
 * **tau** namespace:
 *
 *		@example
 *		<div data-role="page" id="tab-bar-page">
 *			<div data-role="header">
 *				<div id="ready-for-tab-bar">
 *					<ul>
 *						<li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *						<li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *						<li><a data-icon="naviframe-call">Tabbar3</a></li>
 *					</ul>
 *				</div>
 *			</div>
 *			<div data-role="content">
 *			 	Content
 *			</div>
 *		</div>
 *		<script>
 *			(function (document) {
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
 *		</script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter is **options** and it is a object
 * with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<div data-role="page" id="tab-bar-page">
 *			<div data-role="header">
 *				<div id="ready-for-tab-bar">
 *					<ul>
 *						<li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *						<li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *						<li><a data-icon="naviframe-call">Tabbar3</a></li>
 *					</ul>
 *				</div>
 *			</div>
 *			<div data-role="content">
 *			 	Content
 *			</div>
 *		</div>
 *		<script>
 *			(function (document) {
 *				function createPageHandle() {
 *					$("#ready-for-tab-bar").tabbar();
 *				}
 *
 *				$("#tab-bar-page").on("pagecreate", createPageHandle);
 *			}(document));
 *		</script>
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
 *		@example
 *		<script>
 *		var tabBarElement = document.getElementById("tab-bar"),
 *			tabBar = tau.widget.TabBar(TabBarElement);
 *
 *		tabBar.methodName(methodArgument1, methodArgument2, ...);
 *		</script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		<script>
 *		$(".selector").tabbar("methodName", methodArgument1, methodArgument2, ...);
 *		</script>
 *
 * @class ns.widget.mobile.TabBar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/selectors",
			"../../../../core/util/grid",
			"../../../../core/util/DOM/attributes",
			"../../../../core/event/vmouse",
			"../../../../core/widget/core/Scrollview",
			"../mobile",  // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				Scrollview = ns.widget.core.Scrollview,
				engine = ns.engine,
				selectors = ns.util.selectors,
				grid = ns.util.grid,
				DOM = ns.util.DOM,
				slice = [].slice,
				TabBar = function () {
					this._callbacks = {};
					this._ui = {};
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {string} [options.active="0"] Number of activated tab.
					 * @property {string} [options.autoChange=true] Defined if widget should set
					 * activated tab after click event.
					 * @property {string} [options.iconpos="top"] Position of icon in tabs.
					 * @property {string} [options.grid=null] Type of grid.
					 * @member ns.widget.mobile.TabBar
					 */
					this.options = {
						active: 0,
						autoChange: true,
						iconpos: "top",
						grid: null
					};
				},
				/**
				 * Object with class dictionary
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.mobile.TabBar
				 * @readonly
				 */
				classes = {
					tabbarScrollUl: "tabbar-scroll-ul",
					tabbarScrollLi: "tabbar-scroll-li",
					uiTabbarActive: "ui-tabbar-active",
					uiStatePersist: "ui-state-persist",
					uiHeader: "ui-header",
					uiNavbar: "ui-navbar",
					uiFooter: "ui-footer",
					uiTabBtnStyle: "ui-tab-btn-style",
					uiTitle: "ui-title",
					uiTitleTabbar: "ui-title-tabbar",
					uiTabbarNoicons: "ui-tabbar-noicons",
					uiTabbarNotext: "ui-tabbar-notext",
					uiTitleTabbarMultiline: "ui-title-tabbar-multiline",
					uiTabbarPersist: "ui-tabbar-persist",
					uiTabbar: "ui-tabbar",
					uiPortraitTabbar: "ui-portrait-tabbar",
					uiLandscapeTabbar: "ui-landscape-tabbar",
					uiTabbarLink: "ui-tabbar-link",
					uiTabbarText: "ui-tabbar-text",
					uiTabbarIcon: "ui-tabbar-icon",
					uiTabActive: "ui-tab-active",
					uiDisabled: "ui-disabled",
					uiIconPrefix: "ui-icon-",
					uiTabbarIconposPrefix: "ui-tabbar-icon-"
				};

			TabBar.prototype = new BaseWidget();

			TabBar.classes = classes;

			/**
			 * Returns true if one of elements has data-icon set to true
			 * @method hasIcon
			 * @param {Array} elements
			 * @member ns.widget.mobile.TabBar
			 * @static
			 * @private
			 * @return {boolean}
			 */
			function hasIcon(elements) {
				var length = elements.length,
					i;

				for (i = 0; i < length; i++) {
					if (DOM.getNSData(elements[i],"icon")) {
						return true;
					}
				}
				return false;
			}

			/**
			 * Active scrollable tabbar.
			 * @method activateScrollableTabbar
			 * @param {Array} tabs
			 * @param {HTMLElement} activatedTab
			 * @member ns.widget.mobile.TabBar
			 * @static
			 * @private
			 */
			function activateScrollableTabbar(tabs, activatedTab) {
				var length = tabs.length,
					i;

				for (i = 0; i < length; i++) {
					tabs[i].classList.remove(classes.uiTabbarActive);
				}
				/*
				* In original file btnActiveClass is always added.
				* Here, if tab is disabled, this class will not be added
				*/
				if (activatedTab) {
					activatedTab.classList.add(classes.uiTabbarActive);
				}
			}

			/**
			 * Active tabbar, which is not scrollable..
			 * @method activateUnscrollableTabbar
			 * @param {Array} tabs
			 * @param {HTMLElement} activatedTab
			 * @member ns.widget.mobile.TabBar
			 * @static
			 * @private
			 */
			function activateUnscrollableTabbar(tabs, activatedTab) {
				var tabActiveClass = classes.uiTabActive,
					tabClasses,
					length = tabs.length,
					i;

				for (i = 0; i < length; i++) {
					tabClasses = tabs[i].classList;
					if (!tabClasses.contains(classes.uiStatePersist)) {
						tabClasses.remove(tabActiveClass);
					}
				}
				/*
				* In original file tabActiveClass is always added.
				* Here, if tab is disabled, this class will not be added
				*/
				if (activatedTab) {
					activatedTab.classList.add(tabActiveClass);
				}
			}

			function setActive(self, index) {
				var element = self.element,
					uls = element.getElementsByTagName("ul"),
					ul = uls[0],
					tabs = element.getElementsByTagName("a"),
					hasClass = false,
					activatedTab = tabs.length > index ? tabs[index] : null,
					i = 0;

				while (!hasClass && ul) {
					if (ul.classList.contains(classes.tabbarScrollUl)) {
						hasClass = true;
					}
					ul = uls[++i];
				}

				// active tabbar
				if (hasClass) {
					activateScrollableTabbar(tabs, activatedTab);
				} else {
					activateUnscrollableTabbar(tabs, activatedTab);
				}
				// set option
				if (activatedTab) {
					self.options.active = index;
				}
			}

			/**
			 * @method vclickEvent
			 * @param {ns.widget.mobile.TabBar} self
			 * @param {Event} event
			 * @member ns.widget.mobile.TabBar
			 * @static
			 * @private
			 */
			function vclickEvent(self, event) {
				var tabs = self.element.getElementsByTagName("a"),
					activatedTab = selectors.getClosestByTag(event.target, "a"),
					active = 0,
					i,
					max;

				for (i = 0, max = tabs.length; i < max; i++) {
					if (activatedTab === tabs[i]) {
						active = i;
						break;
					}
				}

				if (self.options.autoChange) {
					setActive(self, active);
				}
			}

			/**
			 * Sets tabbar elements disabled and aria-disabled attributes according
			 * to specified value
			 * @method setDisabled
			 * @private
			 * @static
			 * @param {HTMLElement} element
			 * @param {boolean} value
			 * @param {number} index the element index
			 * @member ns.widget.mobile.TabBar
			 */
			function setDisabled(self, value, index) {
				var liItems = selectors.getChildrenByTag(self.element.children[0], "li")[index];

				DOM.setAttribute(liItems, "disabled", value);
				DOM.setAttribute(liItems, "aria-disabled", value);
				if (value) {
					liItems.classList.add(classes.uiDisabled);
				} else {
					liItems.classList.remove(classes.uiDisabled);
					setActive(self, index);
				}
			}

			function addClassForElements(elements, addedClass) {
				var length = elements.length,
					i;

				for (i = 0; i < length; i++) {
					elements[i].classList.add(addedClass);
				}
			}
			/**
			 * Set scrollable tabbar.
			 * @method _buildScrollableTabBar
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._buildScrollableTabBar = function (element) {
				var self = this,
					ui = self._ui,
					tabbarClassList = element.classList,
					headers = selectors.getParentsByClass(element, classes.uiHeader),
					li = slice.call(element.getElementsByTagName("li")),
					ul = slice.call(element.getElementsByTagName("ul")),
					scrollview = selectors.getClosestByClass(element, Scrollview.classes.view),
					scrollviewClip = selectors.getParentsByClass(element, Scrollview.classes.clip),
					length,
					i,
					gridOption = self.option.grid;

				if (headers.length && scrollview) {
					addClassForElements(li, classes.tabbarScrollLi);
					addClassForElements(ul, classes.tabbarScrollUl);

					/* add shadow divider */
					for (i = 0, length = scrollviewClip.length; i < length; i++) {
						scrollviewClip[i].insertAdjacentHTML("beforeend", "<div class='ui-tabbar-divider ui-tabbar-divider-left' style='display:none'></div><div class='ui-tabbar-divider ui-tabbar-divider-right' style='display:none'></div>");
					}

				} else {
					if (li.length) {
						tabbarClassList.add(classes.uiNavbar);
						for (i = 0, length = ul.length; i < length; i++) {
							grid.makeGrid(ul[i], gridOption);
						}
					}
				}

				/* scrollable tabbar */
				if (element.parentNode.classList.contains(Scrollview.classes.view)) {
					if (li.length > 4) {
						// scroller was needed when li element has more than forth.
						scrollview.style.width = parseInt(li[0].style.width, 10) * li.length + "px";
						ui.scrollview = scrollview;
						ui.scrollviewClip = scrollviewClip[0];
					}

				}
			};

			/**
			 * Set proper class for headers.
			 * @method _buildHeader
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._buildHeader = function (element) {
				var parent = element.parentNode,
					li = slice.call(element.getElementsByTagName("li")),
					header = selectors.getClosestByClass(element, classes.uiHeader);

				if (header && (selectors.getChildrenByClass(parent, classes.uiTitle).length ||
					(parent.classList.contains(Scrollview.classes.view) && li.length > 4))) {
					header.classList.add(classes.uiTitleTabbar);
				}
			};

			/**
			 * Set proper class for elements if they are in footer.
			 * @method _buildFooter
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._buildFooter = function (element) {
				var li = slice.call(element.getElementsByTagName("li"));

				if (selectors.getClosestByClass(element, classes.uiFooter)) {
					addClassForElements(li, classes.uiTabBtnStyle);
				}
			};

			/**
			 * Build tabs on links
			 * @method _buildTabs
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._buildTabs = function (element) {
				var links = slice.call(element.getElementsByTagName("a")),
					iconpos,
					linkLength = links.length,
					link,
					innerText,
					linkClassList,
					i;

				if (linkLength) {
					iconpos = hasIcon(links) ? this.options.iconpos : false;

					for (i = 0; i < linkLength; i++) {
						link = links[i];
						linkClassList = link.classList;
						if (link.firstChild) {
							innerText = document.createElement("span");
							innerText.classList.add(classes.uiTabbarText);
							innerText.appendChild(link.firstChild);
							link.appendChild(innerText);
						}

						if (iconpos) {
							linkClassList.add(classes.uiTabbarIconposPrefix + iconpos);
							linkClassList.add(classes.uiTabbarIcon);
							linkClassList.add(classes.uiIconPrefix + DOM.getNSData(link, "icon"));
						}

						linkClassList.add(classes.uiTabbarLink);
					}
				}
			};

			TabBar.prototype._buildFromOptions = function (element) {
				var tabbarClassList = element.classList,
					links = slice.call(element.getElementsByTagName("a")),
					headers = selectors.getParentsByClass(element, classes.uiHeader),
					iconpos,
					textpos;

				if (links.length) {
					iconpos = hasIcon(links) ? this.options.iconpos : false;
					textpos = links[0].innerHTML.length ? true : false;
				}

				if (!iconpos) {
					tabbarClassList.add(classes.uiTabbarNoicons);
				}
				if (!textpos) {
					tabbarClassList.add(classes.uiTabbarNotext);
				}
				if (textpos && iconpos) {
					addClassForElements(headers, classes.uiTitleTabbarMultiline);
				}

				if (element.getElementsByClassName(classes.uiStatePersist).length) {
					tabbarClassList.add(classes.uiTabbarPersist);
				}
				tabbarClassList.add(classes.uiTabbar);
			};

			/**
			 * Build method
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._build = function (element) {
				var self = this;

				self._buildScrollableTabBar(element);
				self._buildFooter(element);
				self._buildHeader(element);
				self._buildFromOptions(element);
				self._buildTabs(element);

				return element;
			};

			/**
			 * Init orientation.
			 * @method _initOrientation
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.TabBar
			 * @protected
			 */
			TabBar.prototype._initOrientation = function(element) {
				var tabbarClassList = element.classList,
					innerWidth = element.offsetWidth ? element.offsetWidth : window.innerWidth,
					innerHeight = element.offsetHeight ? element.offsetHeight : window.innerHeight;

				if (innerWidth > innerHeight) {
					tabbarClassList.remove(classes.uiPortraitTabbar);
					tabbarClassList.add(classes.uiLandscapeTabbar);
				} else {
					tabbarClassList.remove(classes.uiLandscapeTabbar);
					tabbarClassList.add(classes.uiPortraitTabbar);
				}
			};

			/**
			 * Init active tab.
			 * @method _initActiveTab
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.TabBar
			 * @protected
			 */
			TabBar.prototype._initActiveTab = function (element) {
				var links = slice.call(element.getElementsByTagName("a")),
					active,
					index;

				active = element.querySelector("a." + classes.uiTabbarActive);

				if (active) {
					index = links.indexOf(active);
					if (index < 0) {
						index = 0;
					}
					this.options.active = index;
				}
			};

			/**
			 * Init method
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.TabBar
			 * @protected
			 */
			TabBar.prototype._init = function (element) {
				var self = this,
					li = slice.call(element.getElementsByTagName("li")),
					innerWidth = element.offsetWidth ? element.offsetWidth : window.innerWidth,
					inHeaders = !!(selectors.getParentsByClass(element, classes.uiHeader).length);

				if (li.length > 4) {
					// tabbar elements should be showed maximum forth elements.
					self._setWidth(li, innerWidth / 4, inHeaders);
				} else {
					self._setWidth(li, innerWidth / li.length, inHeaders);
				}

				self._initOrientation(element);
				self._initActiveTab(element);

				setActive(self, self.options.active);
			};

			/**
			 * Bind events for widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._bindEvents = function () {
				var self = this,
					ui = self._ui,
					vclickCallback = vclickEvent.bind(null, self);

				self._callbacks.vclick = vclickCallback;
				self.element.addEventListener("vclick", vclickCallback, false);
				if (ui.scrollviewClip) {
					ui.scrollviewClip.addEventListener("scrollstop", roundTabBarPositionX);
				}
			};

			/**
			 * Destroy the tab bar
			 *
			 *		@example
			 *		<script>
			 *		var element = document.getElementById("tabbar"),
			 *			tabBarWidget = tau.widget.TabBar(element);
			 *		tabBarWidget.destroy();
			 *
			 *		// or
			 *
			 *		$( "#tabbar" ).tabbar( "destroy" );
			 *		</script>
			 *
			 * @method destroy
			 * @chainable
			 * @member ns.widget.mobile.TabBar
			 */

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._destroy = function () {
				var self = this,
					ui = self._ui;

				self.element.removeEventListener("vclick", self._callbacks.vclick, false);
				if (ui.scrollviewClip) {
					ui.scrollviewClip.removeEventListener("scrollstop", roundTabBarPositionX);
				}
			};

			/**
			 * Set width method
			 * @method _setWidth
			 * @param {Array} elements
			 * @param {number} width
			 * @param {boolean} setOnLink
			 * @member ns.widget.mobile.TabBar
			 * @protected
			 */
			TabBar.prototype._setWidth = function (elements, width, setOnLink) {
				var i,
					length = elements.length,
					element,
					linkElement,
					elementWidth = width + "px",
					linkWidth = width + "px";
				for (i = 0; i < length; i++) {
					element = elements[i];
					element.style.width = elementWidth;
					linkElement = selectors.getChildrenByTag(element, "a")[0];
					if (linkElement && setOnLink) {
						linkElement.style.width = linkWidth;
					}
				}
			};

			/**
			 * Move scroll to position from left border of li element
			 * @method roundTabBarPositionX
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TabBar
			 */
			function roundTabBarPositionX(event) {
				var element = event.target,
					lastX = element.scrollLeft,
					liWidth = parseInt(element.getElementsByTagName("li")[0].style.width),
					interval = lastX % liWidth,
					middle = liWidth / 2,
					scrollViewWidget = engine.instanceWidget(element, "Scrollview");

				if (interval !== 0) {
					if (interval <= middle) {
						scrollViewWidget.scrollTo(lastX - interval, 0, 500);
					} else {
						scrollViewWidget.scrollTo(lastX + (liWidth - interval), 0, 500);
					}
				}
			}

			/**
			 * Disables the tab bar
			 *
			 * Method add disabled attribute on tab bar and changes look
			 * of search bar to enabled state.
			 *
			 *		@example
			 *		<script>
			 *		var element = document.getElementById("tabbar"),
			 *			tabBarWidget = tau.widget.TabBar(element);
			 *		tabBarWidget.disable();
			 *
			 *		// or
			 *
			 *		$( "#tabbar" ).tabbar( "disable" );
			 *		</script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.TabBar
			 */

			/**
			 * Disables specified element in tabbar
			 * @method _disable
			 * @param {HTMLElement} element
			 * @param {number} index the element index
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._disable = function (element, index) {
				if (index !== undefined) {
					setDisabled(this, true, index);
				}
			};

			/**
			 * Enable the tab bar
			 *
			 * Method removes disabled attribute on tab bar and changes look
			 * of tab bar to enabled state.
			 *
			 *		@example
			 *		<script>
			 *		var element = document.getElementById("tabbar"),
			 *			tabBarWidget = tau.widget.TabBar(element);
			 *		tabBarWidget.enable();
			 *
			 *		// or
			 *
			 *		$( "#tabbar" ).tabbar( "enable" );
			 *		</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.TabBar
			 */

			/**
			 * Enables specified element in tabbar
			 * @method _enable
			 * @param {HTMLElement} element
			 * @param {number} index the element index
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._enable = function (element, index) {
				if (index !== undefined) {
					setDisabled(this, false, index);
				}
			};

			/**
			 * Refresh Tabbar widget.
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._refresh = function () {
				setActive(this, this.options.active);
			};

			/**
			 * Value method is not supported in this widget.
			 *
			 * @method value
			 * @chainable
			 * @member ns.widget.mobile.TabBar
			 */

			ns.widget.mobile.TabBar = TabBar;
			engine.defineWidget(
				"TabBar",
				"[data-role='tabbar'], .ui-tabbar",
				[],
				TabBar,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.TabBar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
