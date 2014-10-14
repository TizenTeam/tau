/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/**
 * #Tab Bar Widget
 * The tabbar widget shows an unordered list of buttons on the screen wrapped
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
 *			 	Content
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
 *		var tabBarElement = document.getElementById('tab-bar'),
 *			tabBar = tau.widget.TabBar(TabBarElement);
 *
 *		tabBar.methodName(methodArgument1, methodArgument2, ...);
 *		</script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		<script>
 *		$(".selector").tabbar('methodName', methodArgument1, methodArgument2, ...);
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
			"../mobile",  // fetch namespace
			"./BaseWidgetMobile",
			"./Button",
			"./Scrollview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var ButtonClasses = ns.widget.mobile.Button.classes,
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				selectors = ns.util.selectors,
				grid = ns.util.grid,
				DOM = ns.util.DOM,
				slice = [].slice,
				TabBar = function () {
					this.vclickCallback = null;
					this._ui = {};
					this.options = {
						active: 0,
						autoChange: true
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
					uiScrollviewView: "ui-scrollview-view",
					uiScrollviewClip: "ui-scrollview-clip",
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
					uiLandscapeTabbar: "ui-landscape-tabbar"
				};

			TabBar.prototype = new BaseWidget();

			/*
			* @todo move to options object
			*/

			/**
			 * Position of icon
			 * @property {string} [iconpos="top"]
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype.iconpos = 'top';
			/**
			 * Grid type
			 * @property {string} [grid=null]
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype.grid = null;

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
				return !elements.every(function (element) {
					return !element.getAttribute('data-icon');
				});
			}

			function setActive(self, index) {
				var element = self.element,
					uls = element.getElementsByTagName("ul"),
					ul = uls[0],
					buttons = element.getElementsByTagName("a"),
					i = 0,
					max,
					hasClass = false,
					buttonClasses,
					btnActiveClass = ButtonClasses.uiBtnActive,
					classes = TabBar.classes,
					activatedButton = buttons.length > index ? buttons[index] : null;

				while (!hasClass && ul) {
					if (ul.classList.contains(classes.tabbarScrollUl)) {
						hasClass = true;
					}
					ul = uls[++i];
				}

				if (hasClass) {
					for (i = 0, max = buttons.length; i < max; i++) {
						buttons[i].classList.remove(classes.uiTabbarActive);
					}
					/*
					* In original file btnActiveClass is always added.
					* Here, if button is disabled, this class will not be added
					*/
					if (activatedButton) {
						activatedButton.classList.add(classes.uiTabbarActive);
						self.options.active = index;
					}
				} else {
					for (i = 0, max = buttons.length; i < max; i++) {
						buttonClasses = buttons[i].classList;
						if (!buttonClasses.contains(classes.uiStatePersist)) {
							buttonClasses.remove(btnActiveClass);
						}
					}
					/*
					* In original file btnActiveClass is always added.
					* Here, if button is disabled, this class will not be added
					*/
					if (activatedButton) {
						activatedButton.classList.add(btnActiveClass);
						self.options.active = index;
					}
				}
			}

			/**
			 * @method vclickEvent
			 * @param {ns.widget.mobile.TabBar} self
			 * @member ns.widget.mobile.TabBar
			 * @static
			 * @private
			 */
			function vclickEvent(self) {
				var element = self.element,
					buttons = element.getElementsByTagName("a"),
					i = 0,
					max,
					activatedButton = selectors.getClosestByTag(event.target, "a"),
					active = 0;

				for (i = 0, max = buttons.length; i < max; i++) {
					if (activatedButton === buttons[i]) {
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
			function setDisabled(element, value, index) {
				var liItems = selectors.getChildrenByTag(element.children[0], 'li')[index];

				DOM.setAttribute(liItems, 'disabled', value);
				DOM.setAttribute(liItems, 'aria-disabled', value);
				if (value) {
					liItems.classList.add(ButtonClasses.uiDisabled);
				} else {
					liItems.classList.remove(ButtonClasses.uiDisabled);
				}
			}

			/**
			 * Build method
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._build = function (element) {
				var classes = TabBar.classes,
					tabbarClassList = element.classList,
					links = slice.call(element.getElementsByTagName('a')),
					headers = selectors.getParentsByClass(element, classes.uiHeader),
					scrollview = selectors.getParentsByClass(element, classes.uiScrollviewView)[0],
					li = slice.call(element.getElementsByTagName("li")),
					iconpos,
					i,
					textpos,
					instanceButtonOptions,
					instanceButtonHeaderOptions = {
						shadow: false,
						corners: false,
						inline: false,
						bar: true
					},
					instanceButtonFooterOptions = {
						shadow: true,
						inline: false,
						corners: true,
						bar: false
					};

				if (links.length) {
					iconpos = hasIcon(links) ? this.iconpos : false;
					textpos = links[0].innerHTML.length ? true : false;
				}

				if (headers.length && scrollview) {
					li.forEach(function (item) {
						item.classList.add(classes.tabbarScrollLi);
					});
					slice.call(element.getElementsByTagName("ul")).forEach(function (item) {
						item.classList.add(classes.tabbarScrollUl);
					});

					/* add shadow divider */
					selectors.getParentsByClass(element, classes.uiScrollviewClip).forEach(function (item) {
						item.insertAdjacentHTML('beforeend', '<div class="ui-tabbar-divider ui-tabbar-divider-left" style="display:none"></div><div class="ui-tabbar-divider ui-tabbar-divider-right" style="display:none"></div>');
					});

				} else {
					if (li.length) {
						tabbarClassList.add(classes.uiNavbar);
						slice.call(element.getElementsByTagName("ul")).forEach(function (item) {
							/*
							* @todo delete getAttribute
							*/
							grid.makeGrid(item, element.getAttribute("data-grid") || this.grid);
						});
					}
				}

				if (selectors.getParentsByClass(element, classes.uiFooter).length) {
					li.forEach(function (item) {
						item.classList.add(classes.uiTabBtnStyle);
					});
				}

				/* title tabbar */
				if (selectors.getChildrenByClass(element.parentElement, classes.uiTitle).length) {
					headers.forEach(function (header) {
						header.classList.add(classes.uiTitleTabbar);
					});
				}
				/* scrollable tabbar */
				if (element.parentNode.classList.contains(classes.uiScrollviewView)){
					if (li.length > 4) {
						i = headers.length;
						while (i--) {
							headers[i].classList.add(classes.uiTitleTabbar);
						}

						// scroller was needed when li element has more than forth.
						scrollview.style.width = parseInt(li[0].style.width, 10) * li.length + "px";
						this._ui.scrollview = scrollview;
						this._ui.scrollviewClip = selectors.getParentsByClass(element, classes.uiScrollviewClip)[0];
					}

				}

				if (!iconpos) {
					tabbarClassList.add(classes.uiTabbarNoicons);
				}
				if (!textpos) {
					tabbarClassList.add(classes.uiTabbarNotext);
				}
				if (textpos && iconpos) {
					headers.forEach(function (header) {
						header.classList.add(classes.uiTitleTabbarMultiline);
					});
				}

				if (links.length) {
					if (headers.length) {
						instanceButtonOptions = instanceButtonHeaderOptions;
					} else {
						instanceButtonOptions = instanceButtonFooterOptions;
					}
					if (iconpos) {
						instanceButtonOptions.iconpos = iconpos;
					}
					links.forEach(function (item) {
						DOM.setNSData(item, "role", "button");
						engine.instanceWidget(item, "Button", instanceButtonOptions);
					});
				}

				if (element.getElementsByClassName(classes.uiStatePersist).length) {
					tabbarClassList.add(classes.uiTabbarPersist);
				}

				tabbarClassList.add(classes.uiTabbar);

				return element;
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
					tabbarClassList = element.classList,
					li = slice.call(element.getElementsByTagName("li")),
					innerWidth = element.offsetWidth ? element.offsetWidth : window.innerWidth,
					innerHeight = element.offsetHeight ? element.offsetHeight : window.innerHeight,
					inHeaders = !!(selectors.getParentsByClass(element, classes.uiHeader).length),
					isLandscape = innerWidth > innerHeight,
					btnActiveClass = ButtonClasses.uiBtnActive,
					uiTabbarActive = classes.uiTabbarActive,
					links = slice.call(element.getElementsByTagName('a'));

				if (li.length > 4) {
					// tabbar elements should be showed maximum forth elements.
					this._setWidth(li, innerWidth / 4, inHeaders);
				} else {
					this._setWidth(li, innerWidth / li.length, inHeaders);
				}

				if (isLandscape) {
					tabbarClassList.remove(classes.uiPortraitTabbar);
					tabbarClassList.add(classes.uiLandscapeTabbar);
				} else {
					tabbarClassList.remove(classes.uiLandscapeTabbar);
					tabbarClassList.add(classes.uiPortraitTabbar);
				}

				[].forEach.call(links, function(element, index) {
					if (element.classList.contains(btnActiveClass) || element.classList.contains(uiTabbarActive)) {
						self.options.active = index;
					}
				});

				setActive(self, self.options.active);
			};

			/**
			 * Bind events for widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._bindEvents = function () {
				this.vclickCallback = vclickEvent.bind(null, this);
				this.element.addEventListener("vclick", this.vclickCallback, false);
				if (this._ui.scrollviewClip) {
					this._ui.scrollviewClip.addEventListener("scrollstop", roundTabBarPositionX);
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
				this.element.removeEventListener("vclick", this.vclickCallback, false);
				if (this._ui.scrollviewClip) {
					this._ui.scrollviewClip.removeEventListener("scrollstop", roundTabBarPositionX);
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
					setDisabled(element, true, index);
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
					setDisabled(element, false, index);
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
			}

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
				'tizen'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.TabBar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
