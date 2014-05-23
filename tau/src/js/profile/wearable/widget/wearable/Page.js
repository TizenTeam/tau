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
/*jslint nomen: true */
/**
 * # Page Widget
 * Page is main element of application's structure.
 *
 * ## Default selectors
 * In the Tizen Wearable Web UI framework the application page structure is based on a header, content and footer elements:
 *
 * - **The header** is placed at the top, and displays the page title and optionally buttons.
 * - **The content** is the section below the header, showing the main content of the page.
 * - **The footer** is abottom part of page which can display for example buttons
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
 *          <td>Defines the element as a header.
 *
 * As the Tizen Wearable device screen size is small, avoid using the header element.</td>
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
 *		var pageElement = document.getElementById('page'),
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
 *      tau.changePage('page-two');
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
 * Tizen Wearable Web UI framework does not apply transitions by default. To set a custom transition effect, you must add the data-transition attribute to a link:
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
 *             window.addEventListener('tizenhwkey', function (event) {
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
 *		var pageElement = document.getElementById('page'),
 *			page = tau.widget.page(buttonElement);
 *
 *		page.methodName(methodArgument1, methodArgument2, ...);
 *
 * @class ns.widget.wearable.Page
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
			"../../selectors",
			"../../../../core/engine",
			"../../../../core/util/DOM/css",
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} BaseWidget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.wearable.Page
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * @property {Object} selectors Alias for {@link ns.wearable.selectors}
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				selectors = ns.wearable.selectors,
				/**
				 * @property {Object} util Alias for {@link ns.util}
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				util = ns.util,
				/**
				 * @property {Object} doms Alias for {@link ns.util.DOM}
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				doms = util.DOM,
				/**
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				engine = ns.engine,

				Page = function () {
					var self = this;
					self.pageSetHeight = false;
					self.contentFillCallback = null;
					self.contentFillAfterResizeCallback = null;
					self.options = {};
				},
				/**
				 * @property {Object} EventType Dictionary for page related event types
				 * @member ns.widget.wearable.Page
				 * @static
				 */
				EventType = {
					/**
					 * Triggered on the page we are transitioning to, after the transition animation has completed.
					 * @event pageshow
					 * @member ns.widget.wearable.Page
					 */
					SHOW: "pageshow",
					/**
					 * Triggered on the page we are transitioning away from, after the transition animation has completed.
					 * @event pagehide
					 * @member ns.widget.wearable.Page
					 */
					HIDE: "pagehide",
					/**
					 * Triggered when the page has been created in the DOM (for example, through Ajax) but before all widgets have had an opportunity to enhance the contained markup.
					 * @event pagecreate
					 * @member ns.widget.wearable.Page
					 */
					CREATE: "pagecreate",
					/**
					 * Triggered when the page is being initialized, before most plugin auto-initialization occurs.
					 * @event pagebeforecreate
					 * @member ns.widget.wearable.Page
					 */
					BEFORE_CREATE: "pagebeforecreate",
					/**
					 * Triggered on the page we are transitioning to, before the actual transition animation is kicked off.
					 * @event pagebeforeshow
					 * @member ns.widget.wearable.Page
					 */
					BEFORE_SHOW: "pagebeforeshow",
					/**
					 * Triggered on the page we are transitioning away from, before the actual transition animation is kicked off.
					 * @event pagebeforehide
					 * @member ns.widget.wearable.Page
					 */
					BEFORE_HIDE: "pagebeforehide"
				},
				/**
				 * @property {Object} classes Dictionary for page related css class names
				 * @member ns.widget.wearable.Page
				 * @static
				 */
				classes = {
					uiPage: "ui-page",
					uiPageActive: "ui-page-active",
					uiSection: "ui-section",
					uiHeader: "ui-header",
					uiFooter: "ui-footer",
					uiContent: "ui-content",
					uiPageScroll: "ui-page-scroll"
				},
				prototype = new BaseWidget();

			Page.classes = classes;
			Page.events = EventType;

			/**
			 * @property {string} [page=".ui-page"] Selector for page element
			 * @member ns.wearable.selectors
			 */
			selectors.page = "." + classes.uiPage;
			/**
			 * @property {string} [activePage=".ui-page-active"] Selector for active page element
			 * @member ns.wearable.selectors
			 */
			selectors.activePage = "." + classes.uiPageActive;
			/**
			 * @property {string} [section=".ui-section"] Selector for section element
			 * @member ns.wearable.selectors
			 */
			selectors.section = "." + classes.uiSection;
			/**
			 * @property {string} [header=".ui-header"] Selector for header element
			 * @member ns.wearable.selectors
			 */
			selectors.header = "." + classes.uiHeader;
			/**
			 * @property {string} [footer=".ui-footer"] Selector for footer element
			 * @member ns.wearable.selectors
			 */
			selectors.footer = "." + classes.uiFooter;
			/**
			 * @property {string} [content=".ui-content"] Selector for content element
			 * @member ns.wearable.selectors
			 */
			selectors.content = "." + classes.uiContent;
			/**
			 * @property {string} [pageScroll=".ui-page-scroll"] selector for page scroll element
			 * @member ns.wearable.selectors
			 */
			selectors.pageScroll = "." + classes.uiPageScroll;

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method contentFill
			 * @param {ns.widget.wearable.Page} self
			 * @member ns.widget.wearable.Page
			 * @private
			 * @static
			 */
			function contentFill(self) {
				var element = self.element,
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
			}

			/**
			 * Build page
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.Page
			 * @instance
			 */
			prototype._build = function (element) {
				element.classList.add(classes.uiPage);
				return element;
			};

			/**
			 * Set page active / unactive
			 * Sets ui-overlay-... class on `body` depending on current theme
			 * @method setActive
			 * @param {boolean} value if true then page will be active if false page will be unactive
			 * @member ns.widget.wearable.Page
			 * @instance
			 */
			prototype.setActive = function (value) {
				var elementClassList = this.element.classList;
				if ( value ) {
					elementClassList.add(classes.uiPageActive);
				} else {
					elementClassList.remove(classes.uiPageActive);
				}
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.Page
			 * @instance
			 */
			prototype._bindEvents = function (element) {
				var self = this;
				self.contentFillCallback = contentFill.bind(null, self);
				self.contentFillAfterResizeCallback = function () {
					self.pageSetHeight = false;
					contentFill(self);
				};
				window.addEventListener("resize", self.contentFillAfterResizeCallback, false);
				element.addEventListener("pageshow", self.contentFillCallback, false);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.Page
			 * @instance
			 */
			prototype._refresh = function () {
				contentFill(this);
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.Page
			 * @instance
			 */
			prototype._init = function (element) {
				this.element = element;
				contentFill(this);
			};

			/**
			 * Triggers BEFORE_SHOW event
			 * @method onBeforeShow
			 * @member ns.widget.wearable.Page
			 * @instance
			 */
			prototype.onBeforeShow = function () {
				this.trigger(EventType.BEFORE_SHOW);
			};

			/**
			 * Triggers SHOW event
			 * @method onShow
			 * @member ns.widget.wearable.Page
			 * @instance
			 */
			prototype.onShow = function () {
				this.trigger(EventType.SHOW);
			};

			/**
			 * Triggers BEFORE_HIDE event
			 * @method onBeforeHide
			 * @member ns.widget.wearable.Page
			 * @instance
			 */
			prototype.onBeforeHide = function () {
				this.trigger(EventType.BEFORE_HIDE);
			};

			/**
			 * Triggers HIDE event
			 * @method onHide
			 * @member ns.widget.wearable.Page
			 * @instance
			 */
			prototype.onHide = function () {
				this.trigger(EventType.HIDE);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.Page
			 * @instance
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element;

				element = element || self.element;
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Called _destroy in ns.widget.wearable.Page");
				//>>excludeEnd("tauDebug");

				window.removeEventListener("resize", self.contentFillAfterResizeCallback, false);
				element.removeEventListener("pageshow", self.contentFillCallback, false);

				// destroy widgets on children
				engine.destroyAllWidgets(element, true);
			};

			Page.prototype = prototype;

			// definition
			ns.widget.wearable.Page = Page;
			engine.defineWidget(
				"page",
				"[data-role=page],.ui-page",
				["onBeforeShow", "onShow", "onBeforeHide", "onHide", "setActive"],
				Page,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
