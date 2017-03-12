/*global window:false, ns:false, define:false*/
/*jslint nomen: true, plusplus: true */
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
/**
 * #Page
 * Page widget represents the screen of an application
 *
 * ## Default selectors
 * All elements which have a class _.ui-page or a _data-role=page
 * will become Page widgets
 *
 * ### HTML examples
 *
 * #### Create a page widget using the data-role attribute
 *
 *    @example
 *    <div data-role="page">
 *      <div data-role="content">
 *        page content
 *      </div>
 *    </div>
 *
 * #### Create page widget using data-role attribute with header and footer
 *
 *    @example
 *    <div data-role="page">
 *      <div data-role="header">
 *        My Page
 *      </div>
 *      <div data-role="content">
 *        page contents
 *      </div>
 *      <div data-role="footer">
 *        Status: OK
 *      </div>
 *    </div>
 *
 * #### Create a page widget using css classes
 *
 *    @example
 *    <div class="ui-page">
 *      <div class="ui-content">
 *        page content
 *      </div>
 *    </div>
 *
 * #### Create a page widget using css classes with header and footer
 *
 *    @example
 *    <div class="ui-page">
 *      <div class="ui-header">
 *        My Page
 *      </div>
 *      <div class="ui-content">
 *        page contents
 *      </div>
 *      <div class="ui-footer">
 *        Status: OK
 *      </div>
 *    </div>
 *
 * ### Manual constructor
 *
 * Thease examples show how to create a Page widget by hand using
 * JavaScript code
 *
 * #### Created using TAU api
 *
 *    @example
 *    <div id="myPage"></div>
 *    <script type="text/javascript">
 *      var page = tau.widget.Page(document.getElementById("myPage"));
 *    </script>
 *
 * #### Created using jQuery api
 *
 *    @example
 *    <div id="myPage"></div>
 *    <script type="text/javascript">
 *      var page = $("#myPage").page();
 *    </script>
 *
 * ## Options for Page widget
 *
 * Options can be set by using data-* attributes or by passing them
 * to the constructor.
 *
 * There is also a method **option** for changing them after widget
 * creation.
 *
 * jQuery mobile format is also supported.
 *
 * ### Themes
 *
 * By using theme options we can change the default theme of a Page
 *
 * Possible theme options are: *theme*, *contentTheme*, *footerTheme*
 * and *headerTheme*. The default value for all of them is *"a"*.
 *
 * #### Using data-* attributes
 *    @example
 *    <div data-role="page" data-theme="s" data-content-theme="s" data-footer-theme="s"></div>
 *
 * #### Using config object passed to constructor
 *
 *    @example
 *    <div id="myPage"></div>
 *    <script type="text/javascript">
 *      var page = tau.widget.Page(document.getElementById("myPage"), {
 *        "theme": "s",
 *        "footerTheme": "s",
 *        "contentTheme": "s"
 *      });
 *    </script>
 *
 * #### Using jQuery API
 *
 *    @example
 *    <div id="myPage"></div>
 *    <script type="text/javascript">
 *      var page = $("#myPage").page({
 *        "theme": "s",
 *        "footerTheme": "s",
 *        "contentTheme": "s"
 *      });
 *    </script>
 *
 * ## Methods
 *
 * Page methods can be can be accessed trough 2 APIs: TAU API and jQuery
 * API (jQuery Mobile-like API)
 *
 * **WARNING** Some methods are not accessible through jQuery API
 * since jQuery already supplies functionalities for them (ex. focus).
 *
 * @class ns.widget.mobile.Page
 * @extends ns.widget.core.Page
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Krzysztof Głodowski <k.glodowski@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */

/**
 * Triggered before switching current page
 * @event pagebeforchange
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before the widget is created and initialized
 * @event pagebeforecreate
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before current page is about to be closed
 * @event pagebeforehide
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before external page will be loaded
 * @event pagebeforeload
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before page will be displayed
 * @event pagebeforeshow
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after switching current page
 * @event pagechange
 * @member ns.widget.mobile.Page
 *
 */

/**
 * Triggered when page switching failed
 * @event pagechangefailed
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after widget creation
 * @event pagecreate
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after the page is hidden
 * @event pagehide
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after widget initialization occurs
 * @event pageinit
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after an external page is loaded
 * @event pageload
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after the external page is removed from the DOM
 * @event pagremove
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after the page is displayed
 * @event pageshow
 * @member ns.widget.mobile.Page
 */

(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/selectors",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/css",
			"../../../../core/util/object",
			"../../../../core/event/orientationchange",
			"../../../../core/widget/core/Page",
			"../../../../core/widget/core/Button",
			"../mobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CorePage = ns.widget.core.Page,
				CorePagePrototype = CorePage.prototype,
				engine = ns.engine,
				selectors = ns.util.selectors,
				object = ns.util.object,
				utilsDOM = ns.util.DOM,
				Page = function () {
					CorePage.call(this);
				},
				classes,
				prototype = new CorePage();

			Page.prototype = prototype;

			/**
			 * Dictionary for page related css class names
			 * @property {Object} classes
			 * @property {string} [classes.uiPrefix='ui-'] Main ui prefix
			 * @property {string} [classes.uiTitle='ui-title'] Title class
			 * @member ns.widget.mobile.Page
			 * @static
			 * @readonly
			 */
			classes = object.merge({}, CorePage.classes, {
				uiTitle: "ui-title"
			});

			Page.classes = classes;

			/**
			 * Set ARIA attributes on page structure
			 * @method _setAria
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			prototype._setAria = function () {
				var self = this,
					ui = self._ui,
					content = ui.content,
					header = ui.header,
					footer = ui.footer,
					title = ui.title;

				if (content) {
					content.setAttribute("role", "main");
				}

				if (header) {
					header.setAttribute("role", "header");
				}

				if (footer) {
					footer.setAttribute("role", "footer");
				}

				if (title) {
					title.setAttribute("role", "heading");
					title.setAttribute("aria-level", 1);
					title.setAttribute("aria-label", "title");
				}
			};

			/**
			 * Find title of page
			 * @param {HTMLElement} element
			 * @method _setTitle
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			prototype._setTitle = function (element) {
				var self = this,
					dataPageTitle = utilsDOM.getNSData(element, "title"),
					header = self._ui.header,
					pageTitle = dataPageTitle,
					titleElement,
					classes = Page.classes;

				if (header) {
					titleElement = selectors.getChildrenBySelector(header, "h1, h2, h3, h4, h5, h6")[0];
					if (titleElement) {
						titleElement.classList.add(classes.uiTitle);
					}

					if (!pageTitle && titleElement) {
						pageTitle = titleElement.innerText;
						self._ui.title = titleElement;
					}

					if (!dataPageTitle && pageTitle) {
						utilsDOM.setNSData(element, "title", pageTitle);
					}
				}
			};

			/**
			 * Build page
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			prototype._build = function (element) {
				var self = this;

				CorePagePrototype._build.call(self, element);
				self._setTitle(element);
				self._setAria();
				return element;
			};

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method _contentFill
			 * @member ns.widget.mobile.Page
			 */
			prototype._contentFill = function () {
				var self = this,
					ui = self._ui,
					content = ui.content,
					contentStyle = null,
					element = self.element,
					header = ui.header,
					top = 0,
					bottom = 0,
					footer = ui.footer;

				CorePagePrototype._contentFill.call(self, element);

				if (content) {
					contentStyle = content.style;
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("Page (contentFill) on ", self.id, " styles was recalculated");
					//>>excludeEnd("tauDebug");

					if (header) {
						top = utilsDOM.getElementHeight(header);
					}

					if (footer) {
						bottom = utilsDOM.getElementHeight(footer);
					}

					contentStyle.top = top + "px";
					contentStyle.bottom = bottom + "px";
					contentStyle.height = (window.innerHeight - top - bottom) + "px";
					contentStyle.width = window.innerWidth + "px";
				}
			};

			Page.createEmptyElement = CorePage.createEmptyElement;

			// definition
			ns.widget.mobile.Page = Page;

			engine.defineWidget(
				"page",
				"",
				[
					"focus",
					"blur",
					"setActive"
				],
				Page,
				"mobile",
				true
			);

			engine.defineWidget(
				"Page",
				"[data-role='page'], .ui-page",
				[
					"focus",
					"blur",
					"setActive"
				],
				Page,
				"mobile",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Page;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
