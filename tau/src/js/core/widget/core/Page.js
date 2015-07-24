/*global window, define */
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
/*jslint nomen: true */
/**
 * # Page Widget
 * Page is main element of application's structure.
 *
 * ## Default selectors
 * In the Tizen Web UI framework the application page structure is based on a header, content and footer elements:
 *
 * - **The header** is placed at the top, and displays the page title and optionally buttons.
 * - **The content** is the section below the header, showing the main content of the page.
 * - **The footer** is a bottom part of page which can display for example buttons
 *
 * The following table describes the specific information for each section.
 *
 * <table>
 *     <tr>
 *         <th>Section</th>
 *         <th>Class</th>
 *         <th>Mandatory</th>
 *         <th>Description</th>
 *     </tr>
 *     <tr>
 *         <td rowspan="2">Page</td>
 *         <td>ui-page</td>
 *         <td>Yes</td>
 *         <td>Defines the element as a page.
 *
 * The page widget is used to manage a single item in a page-based architecture.
 *
 * A page is composed of header (optional), content (mandatory), and footer (optional) elements.</td>
 *      </tr>
 *      <tr>
 *          <td>ui-page-active</td>
 *          <td>No</td>
 *          <td>If an application has a static start page, insert the ui-page-active class in the page element to speed up the application launch. The start page with the ui-page-active class can be displayed before the framework is fully loaded.
 *
 *If this class is not used, the framework inserts the class automatically to the first page of the application. However, this has a slowing effect on the application launch, because the page is displayed only after the framework is fully loaded.</td>
 *      </tr>
 *      <tr>
 *          <td>Header</td>
 *          <td>ui-header</td>
 *          <td>No</td>
 *          <td>Defines the element as a header.</td>
 *      </tr>
 *      <tr>
 *          <td>Content</td>
 *          <td>ui-content</td>
 *          <td>Yes</td>
 *          <td>Defines the element as content.</td>
 *      </tr>
 *      <tr>
 *          <td>Footer</td>
 *          <td>ui-footer</td>
 *          <td>No</td>
 *          <td>Defines the element as a footer.
 *
 * The footer section is mostly used to include option buttons.</td>
 *      </tr>
 *  </table>
 *
 * All elements with class=ui-page will be become page widgets
 *
 *      @example
 *         <!--Page layout-->
 *         <div class="ui-page ui-page-active">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 *         <!--Page layout with more button in header-->
 *         <div class="ui-page ui-page-active">
 *             <header class="ui-header ui-has-more">
 *                 <h2 class="ui-title">Call menu</h2>
 *                 <button type="button" class="ui-more ui-icon-overflow">More Options</button>
 *             </header>
 *             <div class="ui-content">Content message</div>
 *             <footer class="ui-footer">
 *                 <button type="button" class="ui-btn">Footer Button</button>
 *             </footer>
 *         </div>
 *
 * ## Manual constructor
 * For manual creation of page widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		var pageElement = document.getElementById("page"),
 *			page = tau.widget.page(buttonElement);
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*.
 *
 * ## Multi-page Layout
 *
 * You can implement a template containing multiple page containers in the application index.html file.
 *
 * In the multi-page layout, the main page is defined with the ui-page-active class. If no page has the ui-page-active class, the framework automatically sets up the first page in the source order as the main page. You can improve the launch performance by explicitly defining the main page to be displayed first. If the application has to wait for the framework to set up the main page, the page is displayed with some delay only after the framework is fully loaded.
 *
 * You can link to internal pages by referring to the ID of the page. For example, to link to the page with an ID of two, the link element needs the href="#two" attribute in the code, as in the following example.
 *
 *      @example
 *         <!--Main page-->
 *         <div id="one" class="ui-page ui-page-active">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 *         <!--Secondary page-->
 *         <div id="two" class="ui-page">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 * To find the currently active page, use the ui-page-active class.
 *
 * ## Changing Pages
 * ### Go to page in JavaScript
 * To change page use method *tau.changePage*
 *
 *      @example
 *      tau.changePage("page-two");
 *
 * ### Back in JavaScript
 * To back to previous page use method *tau.back*
 *
 *      @example
 *      tau.back();
 *
 * ## Transitions
 *
 * When changing the active page, you can use a page transition.
 *
 * Tizen Web UI Framework does not apply transitions by default. To set a custom transition effect, you must add the data-transition attribute to a link:
 *
 *      @example
 *      <a href="index.html" data-transition="slideup">I'll slide up</a>
 *
 * To set a default custom transition effect for all pages, use the pageTransition property:
 *
 *      @example
 *      tau.defaults.pageTransition = "slideup";
 *
 * ### Transitions list
 *
 *  - **none** no transition.
 *  - **slideup** Makes the content of the next page slide up, appearing to conceal the content of the previous page.
 *
 * ## Handling Page Events
 *
 * With page widget we have connected many of events.
 *
 * To handle page events, use the following code:
 *
 *      @example
 *        <div id="page" class="ui-page">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *         </div>
 *
 *         <script>
 *             var page = document.getElementById("page");
 *             page.addEventListener("Event", function(event) {
 *                 // Your code
 *             });
 *         </script>
 *
 * To bind an event callback on the Back key, use the following code:
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * To bind an event callback on the Back key, use the following code:
 *
 *      @example
 *         <script>
 *             window.addEventListener("tizenhwkey", function (event) {
 *                 if (event.keyName == "back") {
 *                     // Call window.history.back() to go to previous browser window
 *                     // Call tizen.application.getCurrentApplication().exit() to exit application
 *                     // Add script to add another behavior
 *                 }
 *             });
 *         </script>
 *
 * ## Options for Page Widget
 *
 * Page widget hasn't any options.
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		var pageElement = document.getElementById("page"),
 *			page = tau.widget.page(buttonElement);
 *
 *		page.methodName(methodArgument1, methodArgument2, ...);
 *
 * @class ns.widget.core.Page
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/DOM/css",
			"../../util/DOM/attributes",
			"../../util/selectors",
			"../BaseWidget",
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Alias for {@link ns.widget.BaseWidget}
			 * @property {Object} BaseWidget
			 * @member ns.widget.core.Page
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for {@link ns.util}
				 * @property {Object} util
				 * @member ns.widget.core.Page
				 * @private
				 * @static
				 */
				util = ns.util,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} doms
				 * @member ns.widget.core.Page
				 * @private
				 * @static
				 */
				doms = util.DOM,
				/**
				 * Alias for {@link ns.util.selectors}
				 * @property {Object} utilSelectors
				 * @member ns.widget.core.Page
				 * @private
				 * @static
				 */
				utilSelectors = util.selectors,
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.core.Page
				 * @private
				 * @static
				 */
				engine = ns.engine,

				Page = function () {
					var self = this;
					/**
					 * Callback on resize
					 * @property {?Function} contentFillAfterResizeCallback
					 * @private
					 * @member ns.widget.core.Page
					 */
					self.contentFillAfterResizeCallback = null;
					self._initialContentStyle = {};
					/**
					 * Options for widget.
					 * It is empty object, because widget Page does not have any options.
					 * @property {Object} options
					 * @member ns.widget.core.Page
					 */
					self.options = {};

					self._contentStyleAttributes = ["height", "width", "minHeight", "marginTop", "marginBottom"];

					self._ui = {};
				},
				/**
				 * Dictionary for page related event types
				 * @property {Object} EventType
				 * @member ns.widget.core.Page
				 * @static
				 */
				EventType = {
					/**
					 * Triggered on the page we are transitioning to,
					 * after the transition animation has completed.
					 * @event pageshow
					 * @member ns.widget.core.Page
					 */
					SHOW: "pageshow",
					/**
					 * Triggered on the page we are transitioning away from,
					 * after the transition animation has completed.
					 * @event pagehide
					 * @member ns.widget.core.Page
					 */
					HIDE: "pagehide",
					/**
					 * Triggered when the page has been created in the DOM
					 * (for example, through Ajax) but before all widgets
					 * have had an opportunity to enhance the contained markup.
					 * @event pagecreate
					 * @member ns.widget.core.Page
					 */
					CREATE: "pagecreate",
					/**
					 * Triggered when the page is being initialized,
					 * before most plugin auto-initialization occurs.
					 * @event pagebeforecreate
					 * @member ns.widget.core.Page
					 */
					BEFORE_CREATE: "pagebeforecreate",
					/**
					 * Triggered on the page we are transitioning to,
					 * before the actual transition animation is kicked off.
					 * @event pagebeforeshow
					 * @member ns.widget.core.Page
					 */
					BEFORE_SHOW: "pagebeforeshow",
					/**
					 * Triggered on the page we are transitioning away from,
					 * before the actual transition animation is kicked off.
					 * @event pagebeforehide
					 * @member ns.widget.core.Page
					 */
					BEFORE_HIDE: "pagebeforehide"
				},
				/**
				 * Dictionary for page related css class names
				 * @property {Object} classes
				 * @member ns.widget.core.Page
				 * @static
				 * @readonly
				 */
				classes = {
					uiPage: "ui-page",
					uiPageActive: "ui-page-active",
					uiSection: "ui-section",
					uiHeader: "ui-header",
					uiFooter: "ui-footer",
					uiContent: "ui-content"
				},

				prototype = new BaseWidget();

			Page.classes = classes;
			Page.events = EventType;

			/**
			 * Configure default options for widget
			 * @method _configure
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._configure = function() {
				var options = this.options || {};
				/**
				 * Object with default options
				 * @property {Object} options
				 * @property {boolean|string|null} [options.header=false] Sets content of header.
				 * @property {boolean|string|null} [options.footer=false] Sets content of footer.
				 * @property {string} [options.content=null] Sets content of popup.
				 * @member ns.widget.core.Page
				 * @static
				 */
				options.header = null;
				options.footer = null;
				options.content = null;
				this.options = options;
			};

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method _contentFill
			 * @member ns.widget.core.Page
			 */
			prototype._contentFill = function () {
				var self = this,
					element = self.element,
					screenWidth = window.innerWidth,
					screenHeight = window.innerHeight,
					contentSelector = classes.uiContent,
					headerSelector = classes.uiHeader,
					footerSelector = classes.uiFooter,
					extraHeight = 0,
					children = [].slice.call(element.children),
					childrenLength = children.length,
					elementStyle = element.style,
					i,
					node,
					contentStyle,
					marginTop,
					marginBottom,
					nodeStyle;

				elementStyle.width = screenWidth + "px";
				elementStyle.height = screenHeight + "px";

				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					if (node.classList.contains(headerSelector) ||
						node.classList.contains(footerSelector)) {
						extraHeight += doms.getElementHeight(node);
					}
				}
				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					nodeStyle = node.style;
					if (node.classList.contains(contentSelector)) {
						contentStyle = window.getComputedStyle(node);
						marginTop = parseFloat(contentStyle.marginTop);
						marginBottom = parseFloat(contentStyle.marginBottom);
						nodeStyle.height = (screenHeight - extraHeight - marginTop - marginBottom) + "px";
						nodeStyle.width = screenWidth + "px";
					}
				}
			};

			prototype._storeContentStyle = function () {
				var initialContentStyle = this._initialContentStyle,
					contentStyleAttributes = this._contentStyleAttributes,
					content = this.element.querySelector("." + classes.uiContent),
					contentStyle = content ? content.style : {};

				contentStyleAttributes.forEach(function(name) {
					initialContentStyle[name] = contentStyle[name];
				});
			};

			prototype._restoreContentStyle = function () {
				var initialContentStyle = this._initialContentStyle,
					contentStyleAttributes = this._contentStyleAttributes,
					content = this.element.querySelector("." + classes.uiContent),
					contentStyle = content ? content.style : {};

				contentStyleAttributes.forEach(function(name) {
					contentStyle[name] = initialContentStyle[name];
				});
			};

			/**
			 * Setter for footer option
			 * @method _setFooter
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._setFooter = function(element, value) {
				var self = this,
					ui = self._ui,
					footer = ui.footer;

				// footer element if footer does not exist and value is true or string
				if (!footer && value) {
					footer = document.createElement("footer");
					element.appendChild(footer);
					ui.footer = footer;
				}
				if (footer) {
					// remove child if footer does not exist and value is set to false
					if (value === false) {
						element.removeChild(footer);
					} else {
						// if options is set to true, to string or not is set
						// add class
						footer.classList.add(classes.uiFooter);
						// if is string fill content by string value
						if (typeof value === "string") {
							ui.footer.textContent = value;
						}
					}
					// and remember options
					self.options.footer = value;
				}
			};

			/**
			 * Setter for header option
			 * @method _setHeader
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._setHeader = function(element, value) {
				var self = this,
					ui = self._ui,
					header = ui.header;

				// header element if header does not exist and value is true or string
				if (!header && value) {
					header = document.createElement("header");
					element.appendChild(header);
					ui.header = header;
				}
				if (header) {
					// remove child if header does not exist and value is set to false
					if (value === false) {
						element.removeChild(header);
					} else {
						// if options is set to true, to string or not is set
						// add class
						header.classList.add(classes.uiHeader);
						// if is string fill content by string value
						if (typeof value === "string") {
							ui.header.textContent = value;
						}
					}
					// and remember options
					self.options.header = value;
				}
			};

			/**
			 * Setter for content option
			 * @method _setContent
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._setContent = function(element, value) {
				if (typeof value === "string") {
					this.options.content =
						this._ui.content.textContent = value;
				}
			};

			/**
			 * Method creates empty page header. It also checks for additional
			 * content to be added in header.
			 * @method _buildHeader
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._buildHeader = function(element) {
				var self = this;
				self._ui.header = utilSelectors.getChildrenBySelector(element, "header,[data-role='header'],." + classes.uiHeader)[0];
				self._setHeader(element, self.options.header);
			};

			/**
			 * Method creates empty page footer.
			 * @method _buildFooter
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._buildFooter = function(element) {
				var self = this;

				self._ui.footer = utilSelectors.getChildrenBySelector(element, "footer,[data-role='footer'],." + classes.uiFooter)[0];
				self._setFooter(element, self.options.footer);
			};

			/**
			 * Method creates empty page content.
			 * @method _buildContent
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._buildContent = function(element) {
				var self = this,
					content = utilSelectors.getChildrenBySelector(element, "[data-role='content'],." + classes.uiContent)[0],
					next,
					child = element.firstChild,
					ui = self._ui;
				// content must always exists
				if (!content) {
					content = document.createElement("div");
					while (child) {
						next = child.nextSibling;
						if (child !== ui.footer && child !== ui.header) {
							content.appendChild(child);
						}
						child = next;
					}
				}

				// we put it before footer or if footer not exists as last child of element
				element.insertBefore(content, ui.footer);
				content.classList.add(classes.uiContent);
				ui.content = content;
				// we set content text if is set in options.content
				self._setContent(element, self.options.content);
			};

			/**
			 * Build page
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._build = function (element) {
				var self = this;
				element.classList.add(classes.uiPage);
				self._buildHeader(element);
				self._buildFooter(element);
				self._buildContent(element);
				return element;
			};

			/**
			 * This method sets page active or inactive.
			 * @method setActive
			 * @param {boolean} value If true, then page will be active. Otherwise, page will be inactive.
			 * @member ns.widget.core.Page
			 */
			prototype.setActive = function (value) {
				var elementClassList = this.element.classList;
				if (value) {
					this.focus();
					elementClassList.add(classes.uiPageActive);
				} else {
					this.blur();
					elementClassList.remove(classes.uiPageActive);
				}
			};

			/**
			 * Return current status of page.
			 * @method isActive
			 * @member ns.widget.core.Page
			 * @instance
			 */
			prototype.isActive = function () {
				return this.element.classList.contains(classes.uiPageActive);
			};

			/**
			 * Sets the focus to page
			 * @method focus
			 * @member ns.widget.core.Page
			 */
			prototype.focus = function () {
				var element = this.element,
					focusable = element.querySelector("[autofocus]") || element;
				focusable.focus();
			};

			/**
			 * Removes focus from page and all descendants
			 * @method blur
			 * @member ns.widget.core.Page
			 */
			prototype.blur = function () {
				var element = this.element,
					focusable = element.querySelector(":focus") || element;
				focusable.blur();
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._bindEvents = function (element) {
				var self = this;
				self.contentFillAfterResizeCallback = self._contentFill.bind(self);
				window.addEventListener("resize", self.contentFillAfterResizeCallback, false);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._refresh = function () {
				this._restoreContentStyle();
				this._contentFill();
			};

			/**
			 * Layouting page structure
			 * @method layout
			 * @member ns.widget.core.Page
			 */
			prototype.layout = function () {
				this._storeContentStyle();
				this._contentFill();
			};

			/**
			 * This method triggers BEFORE_SHOW event.
			 * @method onBeforeShow
			 * @member ns.widget.core.Page
			 */
			prototype.onBeforeShow = function () {
				this.trigger(EventType.BEFORE_SHOW);
			};

			/**
			 * This method triggers SHOW event.
			 * @method onShow
			 * @member ns.widget.core.Page
			 */
			prototype.onShow = function () {
				//>>excludeStart("tauPerformance", pragmas.tauPerformance);
				window.tauPerf.get("framework", "Trigger: pageshow");
				//>>excludeEnd("tauPerformance");
				this.trigger(EventType.SHOW);
			};

			/**
			 * This method triggers BEFORE_HIDE event.
			 * @method onBeforeHide
			 * @member ns.widget.core.Page
			 */
			prototype.onBeforeHide = function () {
				this.trigger(EventType.BEFORE_HIDE);
			};

			/**
			 * This method triggers HIDE event.
			 * @method onHide
			 * @member ns.widget.core.Page
			 */
			prototype.onHide = function () {
				this._restoreContentStyle();
				this.trigger(EventType.HIDE);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element;

				element = element || self.element;
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Called _destroy in ns.widget.core.Page");
				//>>excludeEnd("tauDebug");

				window.removeEventListener("resize", self.contentFillAfterResizeCallback, false);
				// destroy widgets on children
				engine.destroyAllWidgets(element, true);
			};

			Page.prototype = prototype;

			Page.createEmptyElement = function() {
				var div = document.createElement("div");
				div.classList.add(classes.uiPage);
				doms.setNSData(div, "role", "page");
				return div;
			};

			// definition
			ns.widget.core.Page = Page;
			engine.defineWidget(
				"Page",
				"[data-role=page],.ui-page",
				[
					"layout",
					"focus",
					"blur",
					"setActive",
					"isActive"
				],
				Page,
				"core"
			);

			engine.defineWidget(
				"page",
				"",
				[
					"layout",
					"focus",
					"blur",
					"setActive",
					"isActive"
				],
				Page,
				"core"
			);

			// @remove
			// THIS IS ONLY FOR COMPATIBILITY
			ns.widget.page = ns.widget.Page;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Page;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
