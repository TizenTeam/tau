/*global window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * @class gear.ui.Page
 * @inheritdoc ns.widget.micro.Page
 * @extends ns.widget.micro.Page
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
/**
 * @class ns.widget.micro.Page
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../core",
			"../../micro/selectors",
			"../../engine",
			"../../utils/selectors",
			"../../utils/events",
			"../../utils/DOM",
			"../micro",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			/**
			 * @property {Object} BaseWidget Alias for {@link ns.widget.BaseWidget}
			 * @memberOf ns.widget.micro.Page
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * @property {Object} selectors Alias for {@link ns.micro.selectors}
				 * @memberOf ns.widget.micro.Page
				 * @private
				 * @static
				 */
				selectors = ns.micro.selectors,
				/**
				 * @property {Object} utils Alias for {@link ns.utils}
				 * @memberOf ns.widget.micro.Page
				 * @private
				 * @static
				 */
				utils = ns.utils,
				/**
				 * @property {Object} doms Alias for {@link ns.utils.DOM}
				 * @memberOf ns.widget.micro.Page
				 * @private
				 * @static
				 */
				doms = utils.DOM,
				/**
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @memberOf ns.widget.micro.Page
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} events Alias for {@link ns.utils.events}
				 * @memberOf ns.widget.micro.Page
				 * @private
				 * @static
				 */
				events = utils.events,

				Page = function () {
					var self = this;
					self.pageSetHeight = false;
					self.contentFillCallback = null;
					self.contentFillAfterResizeCallback = null;
					self.options = {};
				},
				/**
				 * @property {Object} EventType Dictionary for page related event types
				 * @memberOf ns.widget.micro.Page
				 * @static
				 */
				EventType = {
					SHOW: "pageshow",
					HIDE: "pagehide",
					CREATE: "pagecreate",
					BEFORE_CREATE: "pagebeforecreate",
					BEFORE_SHOW: "pagebeforeshow",
					BEFORE_HIDE: "pagebeforehide"
				},
				/**
				 * @property {Object} classes Dictionary for page related css class names
				 * @memberOf ns.widget.micro.Page
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
			 * @property {string} [page=".ui-page"]
			 * @memberOf ns.micro.selectors
			 */
			selectors.page = "." + classes.uiPage;
			/**
			 * @property {string} [activePage=".ui-page-active"]
			 * @memberOf ns.micro.selectors
			 */
			selectors.activePage = "." + classes.uiPageActive;
			/**
			 * @property {string} [section=".ui-section"]
			 * @memberOf ns.micro.selectors
			 */
			selectors.section = "." + classes.uiSection;
			/**
			 * @property {string} [header=".ui-header"]
			 * @memberOf ns.micro.selectors
			 */
			selectors.header = "." + classes.uiHeader;
			/**
			 * @property {string} [footer=".ui-footer"]
			 * @memberOf ns.micro.selectors
			 */
			selectors.footer = "." + classes.uiFooter;
			/**
			 * @property {string} [content=".ui-content"]
			 * @memberOf ns.micro.selectors
			 */
			selectors.content = "." + classes.uiContent;
			/**
			 * @property {string} [pageScroll=".ui-page-scroll"]
			 * @memberOf ns.micro.selectors
			 */
			selectors.pageScroll = "." + classes.uiPageScroll;

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method contentFill
			 * @param {ns.widget.micro.Page} self
			 * @memberOf ns.widget.micro.Page
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
					elementStyle = element.style;

				elementStyle.width = screenWidth + "px";
				elementStyle.height = screenHeight + "px";

				children.forEach(function (node) {
					if (node.nodeType === 1 &&
							(node.classList.contains(headerSelector) ||
								node.classList.contains(footerSelector))) {
						extraHeight += doms.getElementHeight(node);
					}
				});
				children.forEach(function (node) {
					var contentStyle,
						marginTop,
						marginBottom,
						nodeStyle = node.style;
					if (node.nodeType === 1 && node.classList.contains(contentSelector)) {
						contentStyle = window.getComputedStyle(node);
						marginTop = parseFloat(contentStyle.marginTop);
						marginBottom = parseFloat(contentStyle.marginBottom);
						nodeStyle.height = (screenHeight - extraHeight - marginTop - marginBottom) + "px";
						nodeStyle.width = screenWidth + "px";
					}
				});
			}

			/**
			 * Build page
			 * @method _build
			 * @param {string} template
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype._build = function (template, element) {
				element.classList.add(classes.uiPage);
				return element;
			};

			/**
			 * Set page active / unactive
			 * Sets ui-overlay-... class on `body` depending on current theme
			 * @method setActive
			 * @param {boolean} value if true then page will be active if false page will be unactive
			 * @memberOf ns.widget.micro.Page
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
			 * @memberOf ns.widget.micro.Page
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
			 * @memberOf ns.widget.micro.Page
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
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype._init = function (element) {
				this.element = element;
				contentFill(this);
			};

			/**
			 * Triggers BEFORE_SHOW event
			 * @method onBeforeShow
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype.onBeforeShow = function () {
				this.trigger(EventType.BEFORE_SHOW);
			};

			/**
			 * Triggers SHOW event
			 * @method onShow
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype.onShow = function () {
				this.trigger(EventType.SHOW);
			};

			/**
			 * Triggers BEFORE_HIDE event
			 * @method onBeforeHide
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype.onBeforeHide = function () {
				this.trigger(EventType.BEFORE_HIDE);
			};

			/**
			 * Triggers HIDE event
			 * @method onHide
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype.onHide = function () {
				this.trigger(EventType.HIDE);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element,
					childWidgets = element.querySelectorAll("[data-ej-built='true']");

				element = element || self.element;
				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.log("Called _destroy in ns.widget.micro.Page");
				//>>excludeEnd("ejDebug");

				window.removeEventListener("resize", self.contentFillAfterResizeCallback, false);
				element.removeEventListener("pageshow", self.contentFillCallback, false);

				// destroy widgets on children
				engine.destroyWidget(element, true);
			};

			Page.prototype = prototype;

			// definition
			ns.widget.micro.Page = Page;
			engine.defineWidget(
				"page",
				"",
				"[data-role=page],.ui-page",
				["onBeforeShow", "onShow", "onBeforeHide", "onHide", "setActive"],
				Page,
				"micro"
			);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej));
