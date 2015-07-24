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
 * # Page Widget
 * Page is main element of application's structure.
 *
 * ## Default selectors
 * In the Tizen TV Web UI framework the application page structure is based on a header, content and footer elements:
 *
 * - **The header** is placed at the top, and displays the page title and optionally buttons.
 * - **The content** is the section below the header, showing the main content of the page.
 * - **The footer** is abottom part of page which can display for example buttons
 *
 * ## Examples
 *
 * ### Empty header & footer
 * This is the standard page which can be fully arranged as one wishes. It is the basic version for all
 * pages.
 * 	@example
 * 		<div id="normal-page" class="ui-page" data-size="mini">
 * 			<div class="ui-content content-padding">
 * 				For create normal page create tag with class <i>ui-page</i>
 * 			</div>
 * 		</div>
 *
 * ### Title in header
 * A standard page can me enchanced with header containing title.
 * 	@example
 * 		<div id="normal-page" class="ui-page" data-size="mini">
 * 			<header class="ui-header">
 * 				<h2 class="ui-title">Title in header</h2>
 * 			</header>
 * 			<div class="ui-content content-padding">
 * 				For create normal page create tag with class <i>ui-page</i>
 * 			</div>
 * 		</div>
 *
 * ### Buttons in header
 * You can add buttons to header in case of need. By default text will appear on the left
 * side of the header and buttons on the right side.
 * 	@example
 * 		<div id="normal-page" class="ui-page" data-size="mini">
 * 			<header class="ui-header">
 * 				<a href="#" data-role="button">button 1</a>
 * 				<a href="#" data-role="button">button 2</a>
 * 				<h2 class="ui-title">Title in header</h2>
 * 			</header>
 * 			<div class="ui-content content-padding">
 * 				For create normal page create tag with class <i>ui-page</i>
 * 			</div>
 * 		</div>
 *
 * ### Structure with header and footer tag
 * 	@example
 * 		<div id="normal-page" class="ui-page" data-size="mini">
 * 			<header class="ui-header">
 * 				<h2 class="ui-title">Title in header</h2>
 * 			</header>
 * 			<div class="ui-content content-padding"></div>
 * 			<footer>
 * 				<div data-role="controlgroup" data-type="horizontal">
 * 					<a href="#" data-role="button">Button in footer</a>
 * 				</div>
 * 			</footer>
 * 		</div>
 *
 * ## Focus
 * Focus on page is working straightforward. Using diectional keys will make focus move in the
 * respective direction. Also using OK[remote control]/Enter[keyboard] while widget is focused
 * will send activation signal to it (response will differ between widgets).
 *
 * @class ns.widget.tv.Page
 * @extends ns.widget.wearable.Page
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/widget/core/Page",
			"../../../core/engine",
			"../../../core/util/DOM/css",
			"../../../core/util/DOM/attributes",
			"../../../core/util/selectors",
			"./BaseKeyboardSupport",
			"./Button"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Alias for {@link ns.widget.wearable.Page}
			 * @property {Object} Page
			 * @member ns.widget.tv.Page
			 * @private
			 * @static
			 */
			var WearablePage = ns.widget.core.Page,
				WearablePagePrototype = WearablePage.prototype,
				/**
				 * Alias for {@link ns.widget.tv.BaseKeyboardSupport}
				 * @property {Object} BaseKeyboardSupport
				 * @member ns.widget.tv.Page
				 * @private
				 * @static
				 */
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				/**
				 * Dictionary for page related css class names.
				 * It bases on {@link ns.widget.wearable.Page.classes}
				 * @property {Object} classes
				 * @member ns.widget.tv.Page
				 * @static
				 */
				classes = WearablePage.classes,
				/**
				 * Alias for {@link ns.util}
				 * @property {Object} util
				 * @member ns.widget.tv.Page
				 * @private
				 * @static
				 */
				util = ns.util,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.widget.tv.Page
				 * @private
				 * @static
				 */
				DOM = util.DOM,
				/**
				 * Alias for {@link ns.util.selectors}
				 * @property {Object} utilSelectors
				 * @member ns.widget.tv.Page
				 * @private
				 * @static
				 */
				utilSelectors = util.selectors,
				Page = function () {
					var self = this;
					BaseKeyboardSupport.call(self);
					self._ui = self._ui || {};
				},
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.tv.Page
				 * @private
				 * @static
				 */
				engine = ns.engine,
				FUNCTION_TYPE = "function",
				prototype = new WearablePage();

			classes.uiHeaderEmpty = "ui-header-empty";
			classes.uiFooterEmpty = "ui-footer-empty";
			classes.uiTitle = "ui-title";

			Page.events = WearablePage.events;
			Page.classes = classes;

			/**
			 * This method triggers SHOW event and turns keyboard support on.
			 * @method onShow
			 * @member ns.widget.tv.Page
			 */
			prototype.onShow = function() {
				var self = this;
				self.saveKeyboardSupport();
				self.enableKeyboardSupport();
				WearablePagePrototype.onShow.call(self);
			};

			/**
			 * This method triggers HIDE event and turns keyboard support on.
			 * @method onHide
			 * @member ns.widget.tv.Page
			 */
			prototype.onHide = function() {
				var self = this;
				self.disableKeyboardSupport();
				self.restoreKeyboardSupport();
				WearablePagePrototype.onHide.call(self);
			};

			/**
			 * Method creates buttons defined in page header.
			 * @method _buildButtonsInHeader
			 * @param {HTMLElement} header
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._buildButtonsInHeader = function (header) {
				var headerButtons = [].slice.call(header.querySelectorAll("[data-role='button']")),
					headerButtonsLength = headerButtons.length,
					i;
				for (i = 0; i < headerButtonsLength; i++) {
					engine.instanceWidget(headerButtons[i], "Button", {
						inline: true
					});
				}
			};

			/**
			 * Method creates title defined in page header.
			 * @method _buildTitleInHeader
			 * @param {HTMLElement} header
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._buildTitleInHeader = function(header) {
				var title = header.querySelector("h1,h2,h3,h4,h5,h6,h7,h8");
				if (title) {
					title.classList.add(classes.uiTitle);
				}
			};

			/**
			 * Method creates empty page header. It also checks for additional
			 * content to be added in header.
			 * @method _buildHeader
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._buildHeader = function(element) {
				var self = this,
					header;

				WearablePagePrototype._buildHeader.call(self, element);
				header = self._ui.header;

				if (!header) {
					element.classList.add(classes.uiHeaderEmpty);
				} else {
					self._buildButtonsInHeader(header);
					self._buildTitleInHeader(header);
				}
			};

			/**
			 * Method creates empty page footer.
			 * @method _buildFooter
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._buildFooter = function(element) {
				WearablePagePrototype._buildFooter.call(this, element);

				if (!this._ui.footer) {
					element.classList.add(classes.uiFooterEmpty);
				}
			};

			/**
			 * Clears header and footer class lists.
			 * @method _clearHeaderFooterInfo
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._clearHeaderFooterInfo = function(element) {
				var elementClassList = element.classList;
				elementClassList.remove(classes.uiHeaderEmpty);
				elementClassList.remove(classes.uiFooterEmpty);
			};

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method _contentFill
			 * @protected
			 * @member ns.widget.tv.Page
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
					nodeClasses,
					contentStyle,
					marginTop,
					marginBottom,
					marginLeft,
					marginRight,
					nodeStyle;

				elementStyle.width = screenWidth + "px";
				elementStyle.height = screenHeight + "px";

				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					nodeClasses = node.classList;
					if (nodeClasses.contains(headerSelector) ||
						nodeClasses.contains(footerSelector)) {
						extraHeight += DOM.getElementHeight(node, "outer", false, true);
					}
				}
				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					nodeStyle = node.style;
					if (node.classList.contains(contentSelector)) {
						contentStyle = window.getComputedStyle(node);
						marginTop = parseFloat(contentStyle.marginTop);
						marginBottom = parseFloat(contentStyle.marginBottom);
						marginLeft = parseFloat(contentStyle.marginLeft);
						marginRight = parseFloat(contentStyle.marginRight);
						// @todo always create (if it does not exist) footer and header
						nodeStyle.height = (screenHeight - extraHeight - marginTop - marginBottom) + "px";
						nodeStyle.width = (screenWidth - marginLeft - marginRight) + "px";
					}
				}
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._bindEvents = function(element) {
				WearablePagePrototype._bindEvents.call(this, element);
				this._bindEventKey();
				this._bindEventMouse();
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._destroy = function() {
				this._destroyEventKey();
				this._destroyEventMouse();
				WearablePagePrototype._destroy.call(this);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._refresh = function() {
				var self = this,
					element = self.element;
				WearablePagePrototype._refresh.call(self);
				self._clearHeaderFooterInfo(element);
				self._build(element);
				self._contentFill();
			};

			Page.prototype = prototype;

			// definition
			ns.widget.tv.Page = Page;

			engine.defineWidget(
				"Page",
				"[data-role=page],.ui-page",
				["onBeforeShow", "onShow", "onBeforeHide", "onHide", "setActive"],
				Page,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
