/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Page Widget
 * Page is the main element of application's structure.
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
			"../../../profile/wearable/widget/wearable/Page",
			"../../../core/engine",
			"../../../core/util/DOM/css",
			"../../../core/util/DOM/attributes",
			"../../../core/util/selectors",
			"./BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var WearablePage = ns.widget.wearable.Page,
				WearablePagePrototype = WearablePage.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				classes = WearablePage.classes,
				selectors = ns.wearable.selectors,
				util = ns.util,
				DOM = util.DOM,
				utilSelectors = util.selectors,
				Page = function () {
					var self = this;
					BaseKeyboardSupport.call(self);
					self._ui = self._ui || {};
				},
				engine = ns.engine,
				FUNCTION_TYPE = "function",
				prototype = new WearablePage();

			classes.uiHeaderEmpty = "ui-header-empty";
			classes.uiFooterEmpty = "ui-footer-empty";
			classes.uiTitle = "ui-title";

			Page.events = WearablePage.events;
			Page.classes = classes;

			prototype.onShow = function() {
				WearablePagePrototype.onShow.call(this);
				this._supportKeyboard = true;
			};

			prototype.onHide = function() {
				WearablePagePrototype.onHide.call(this);
				this._supportKeyboard = false;
			};

			prototype._buildButtonsInHeader = function (header) {
				var headerButtons = [].slice.call(header.querySelectorAll("[data-role='button']")),
					headerButtonsLength = headerButtons.length,
					i;
				for (i = 0; i < headerButtonsLength; i++) {
					DOM.setNSData(headerButtons[i], "inline", "true");
				}
			};

			prototype._buildTitleInHeader = function(header) {
				var title = header.querySelector("h1,h2,h3,h4,h5,h6,h7,h8");
				if (title) {
					title.classList.add(classes.uiTitle);
				}
			};

			prototype._buildHeader = function(element) {
				var self = this,
					header = utilSelectors.getChildrenBySelector(element, "header,." + classes.uiHeader)[0];
				// add class if header does not exist
				if (!header) {
					element.classList.add(classes.uiHeaderEmpty);
				} else {
					header.classList.add(classes.uiHeader);
					self._buildButtonsInHeader(header);
					self._buildTitleInHeader(header);
				}
				self._ui.header = header;
			};

			prototype._buildFooter = function(element) {
				var footer = utilSelectors.getChildrenBySelector(element, "footer,." + classes.uiFooter)[0];
				// add class if footer does not exist
				if (!footer) {
					element.classList.add(classes.uiFooterEmpty);
				} else {
					footer.classList.add(classes.uiFooter);
				}
				this._ui.footer = footer;
			};

			prototype._buildContent = function(element) {
				var content = utilSelectors.getChildrenByClass(element, classes.uiContent)[0],
					next,
					child = element.firstChild,
					ui = this._ui;
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

				element.insertBefore(content, ui.footer);
				content.classList.add(classes.uiContent);
				ui.content = content;
			};

			prototype._build = function(element) {
				var self = this;

				if (typeof WearablePagePrototype._build === FUNCTION_TYPE) {
					WearablePagePrototype._build.call(self, element);
				}

				self._buildHeader(element);
				self._buildFooter(element);
				self._buildContent(element);

				return element;
			};

			prototype._clearHeaderFooterInfo = function(element) {
				var elementClassList = element.classList;
				elementClassList.remove(classes.uiHeaderEmpty);
				elementClassList.remove(classes.uiFooterEmpty);
			};

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method _contentFill
			 * @member ns.widget.wearable.Page
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

			prototype._bindEvents = function(element) {
				WearablePagePrototype._bindEvents.call(this, element);
				this._bindEventKey();
			};

			prototype._destroy = function() {
				this._destroyEventKey();
				WearablePagePrototype._destroy.call(this);
			};

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

			selectors.page = "[data-role=page],.ui-page";

			engine.defineWidget(
				"page",
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
