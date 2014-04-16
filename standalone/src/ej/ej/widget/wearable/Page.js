/*global window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #PAge widget
 *
 * ##Default selectors
 * All elements with class=ui-page will be become Page widgets
 *
 * ##Manual constructor
 * To create the widget manually you can use the instanceWidget method
 *
 *     @example
 *         var page = ej.engine.instanceWidget(document.getElementById('page'), 'page');
 *         //or
 *         var page = tau.page(document.getElementById('page'));
 *
 * #HTML Examples
 *
 * ###Simple popup
 * <div id="popup-example" class="ui-popup">
 *		Hello world!
 * </div>
 * @class ns.widget.wearable.Page
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
			"../../wearable/selectors",
			"../../engine",
			"../../utils/selectors",
			"../../utils/DOM/css",
            "../../utils/object",
            "../../wearable/selectors",
			"../wearable",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			/**
			 * @property {Object} BaseWidget Alias for {@link ns.widget.BaseWidget}
			 * @memberOf ns.widget.wearable.Page
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * @property {Object} selectors Alias for {@link ns.wearable.selectors}
				 * @memberOf ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				selectors = ns.wearable.selectors,
				/**
				 * @property {Object} utils Alias for {@link ns.utils}
				 * @memberOf ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				utils = ns.utils,
				/**
				 * @property {Object} doms Alias for {@link ns.utils.DOM}
				 * @memberOf ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				doms = utils.DOM,
                utilsObject = utils.object,
				/**
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @memberOf ns.widget.wearable.Page
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
				 * @memberOf ns.widget.wearable.Page
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
				 * @memberOf ns.widget.wearable.Page
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
				prototype = {};

			Page.classes = classes;
			Page.events = EventType;

			/**
			 * @property {string} [page=".ui-page"] Selector for page element
			 * @mns.wearablens.micro.selectors
			 */
			selectors.page = "." + classes.uiPage;
			/**
			 * @property {string} [activePage=".ui-page-active"] Selector for active page element
			 ns.wearablerOf ns.micro.selectors
			 */
			selectors.activePage = "." + classes.uiPageActive;
			/**
			 * @property {string} [section=".ui-section"] Selector for section element
ns.wearableemberOf ns.micro.selectors
			 */
			selectors.section = "." + classes.uiSection;
			/**
			 * @property {string} [header=".ui-header"] Selector for header elemns.wearable* @memberOf ns.micro.selectors
			 */
			selectors.header = "." + classes.uiHeader;
			/**
			 * @property {string} [footer=".ui-footer"] Selector for footer ns.wearable			 * @memberOf ns.micro.selectors
			 */
			selectors.footer = "." + classes.uiFooter;
			/**
			 * @property {string} [content=".ui-content"] Selector for contns.wearableent
			 * @memberOf ns.micro.selectors
			 */
			selectors.content = "." + classes.uiContent;
			/**
			 * @property {string} [pageScroll=".ui-page-scroll"] selector for pagens.wearableelement
			 * @memberOf ns.micro.selectors
			 */
			selectors.pageScroll = "." + classes.uiPageScroll;

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method contentFill
			 * @param {ns.widget.wearable.Page} self
			 * @memberOf ns.widget.wearable.Page
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
			 * @param {string} template
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @memberOf ns.widget.wearable.Page
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
			 * @memberOf ns.widget.wearable.Page
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
			 * @memberOf ns.widget.wearable.Page
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
			 * @memberOf ns.widget.wearable.Page
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
			 * @memberOf ns.widget.wearable.Page
			 * @instance
			 */
			prototype._init = function (element) {
				this.element = element;
				contentFill(this);
			};

			/**
			 * Triggers BEFORE_SHOW event
			 * @method onBeforeShow
			 * @memberOf ns.widget.wearable.Page
			 * @instance
			 */
			prototype.onBeforeShow = function () {
				this.trigger(EventType.BEFORE_SHOW);
			};

			/**
			 * Triggers SHOW event
			 * @method onShow
			 * @memberOf ns.widget.wearable.Page
			 * @instance
			 */
			prototype.onShow = function () {
				this.trigger(EventType.SHOW);
			};

			/**
			 * Triggers BEFORE_HIDE event
			 * @method onBeforeHide
			 * @memberOf ns.widget.wearable.Page
			 * @instance
			 */
			prototype.onBeforeHide = function () {
				this.trigger(EventType.BEFORE_HIDE);
			};

			/**
			 * Triggers HIDE event
			 * @method onHide
			 * @memberOf ns.widget.wearable.Page
			 * @instance
			 */
			prototype.onHide = function () {
				this.trigger(EventType.HIDE);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @memberOf ns.widget.wearable.Page
			 * @instance
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element;

				element = element || self.element;
				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.log("Called _destroy in ns.widget.wearable.Page");
				//>>excludeEnd("ejDebug");

				window.removeEventListener("resize", self.contentFillAfterResizeCallback, false);
				element.removeEventListener("pageshow", self.contentFillCallback, false);

				// destroy widgets on children
				engine.destroyWidget(element, true);
			};

            utilsObject.inherit(Page, BaseWidget, prototype);
			// definition
			ns.widget.wearable.Page = Page;
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
}(window.document, ns));