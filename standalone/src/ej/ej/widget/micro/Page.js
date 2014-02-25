/*global window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
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
			var BaseWidget = ns.widget.BaseWidget,
				selectors = ns.micro.selectors,
				doms = ns.utils.DOM,
				engine = ns.engine,
				events = ns.utils.events,
				/**
				* Page widget
				* @class ns.widget.micro.Page
				* @extends ns.widget.BaseWidget
				*/
				Page = function () {
					this.pageSetHeight = false;
					this.contentFillCallback = null;
					this.contentFillAfterResizeCallback = null;
					/**
					* @property {Object} options Object with default options
					* @property {boolean} [options.fullscreen=false] Fullscreen page flag
					* @property {string} [options.theme='s'] Page theme
					* @property {?string} [options.contentTheme=null] Page content theme
					* @property {string} [options.headerTheme='s'] Page header theme. If headerTheme is empty `theme` will be used
					* @property {string} [options.footerTheme='s'] Page footer theme. If footerTheme is empty `theme` will be used
					* @property {boolean} [options.addBackBtn=false] **[REMOVED]** Add back button
					* @memberOf ns.widget.micro.Page
					*/
					this.options = {
					};
				},
				EventType = {
					SHOW: "pageshow",
					HIDE: "pagehide",
					CREATE: "pagecreate",
					BEFORE_CREATE: "pagebeforecreate",
					BEFORE_SHOW: "pagebeforeshow",
					BEFORE_HIDE: "pagebeforehide"
				},
				/**
				* @property {Object} classes Dictionary for button related css class names
				* @memberOf ns.widget.micro.Page
				* @static
				*/
				classes = {
					uiPage: 'ui-page',
					uiPageActive: 'ui-page-active',
					uiSection: 'ui-section',
					uiHeader: 'ui-header',
					uiFooter: 'ui-footer',
					uiContent: 'ui-content',
					uiPageScroll: 'ui-page-scroll'
				},
				prototype = new BaseWidget();

			Page.classes = classes;
			Page.events = EventType;

			selectors.page = '.' + classes.uiPage;
			selectors.activePage = '.' + classes.uiPageActive;
			selectors.section = '.' + classes.uiSection;
			selectors.header = '.' + classes.uiHeader;
			selectors.footer = '.' + classes.uiFooter;
			selectors.content = '.' + classes.uiContent;
			selectors.pageScroll = '.' + classes.uiPageScroll;

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
						marginBottom;
					if (node.nodeType === 1 && node.classList.contains(contentSelector)) {
						contentStyle = window.getComputedStyle(node);
						marginTop = parseFloat(contentStyle.marginTop);
						marginBottom = parseFloat(contentStyle.marginBottom);
						node.style.height = (screenHeight - extraHeight - marginTop - marginBottom) + "px";
						node.style.width = screenWidth + "px";
					}
				});
			}

			/**
			* build page
			* @method _build
			* @private
			* @param {string} template
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @memberOf ns.widget.micro.Page
			*/
			prototype._build = function (template, element) {
				element.classList.add(Page.classes.uiPage);
				return element;
			};

			/**
			* Set page active / unactive
			* Sets ui-overlay-... class on `body` depending on current theme
			* @method setActive
			* @private
			* @param {boolean} value if true then page will be active if false page will be unactive
			* @instance
			* @memberOf ns.widget.micro.Page
			*/
			prototype.setActive = function (value) {
				var elementClassList = this.element.classList;
				if ( value ) {
					elementClassList.add("ui-page-active");
				} else {
					elementClassList.remove("ui-page-active");
				}
			};

			prototype._bindEvents = function (element) {
				var self = this;
				this.contentFillCallback = contentFill.bind(null, this);
				this.contentFillAfterResizeCallback = function () {
					self.pageSetHeight = false;
					contentFill(self);
				};
				window.addEventListener("resize", this.contentFillAfterResizeCallback, false);
				element.addEventListener("pageshow", this.contentFillCallback, false);
			};

			/**
			* refresh structure
			* @method _refresh
			* @new
			* @memberOf ns.widget.micro.Page
			*/
			prototype._refresh = function () {
				contentFill(this);
			};

			/**
			* init widget
			* @method _init
			* @param {HTMLElement} element
			* @new
			* @memberOf ns.widget.micro.Page
			*/
			prototype._init = function (element) {
				this.element = element;
				contentFill(this);
			};

			prototype.onBeforeShow = function () {
				events.trigger(this.element, EventType.BEFORE_SHOW);
			};

			prototype.onShow = function () {
				events.trigger(this.element, EventType.SHOW);
			};

			prototype.onBeforeHide = function () {
				events.trigger(this.element, EventType.BEFORE_HIDE);
			};

			prototype.onHide = function () {
				events.trigger(this.element, EventType.HIDE);
			};
			/**
			* @method _destroy
			* @private
			* @memberOf ns.widget.micro.Page
			*/
			prototype._destroy = function () {
				var childWidgets = this.element.querySelectorAll("[data-ej-built='true']");

				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.log("Called _destroy in ns.widget.micro.Page");
				//>>excludeEnd("ejDebug");

				window.removeEventListener("resize", this.contentFillAfterResizeCallback, false);
				this.element.removeEventListener("pageshow", this.contentFillCallback, false);

				[].slice.call(childWidgets).forEach(function (widgetElement) {
					var binding = engine.getBinding(widgetElement);
					if (binding) {
						//>>excludeStart("ejDebug", pragmas.ejDebug);
						ns.log("Called .destroy() on Page child widget: " + binding.name + " with id: " + binding.id);
						//>>excludeEnd("ejDebug");
						binding.destroy();
					}
				});
			};

			Page.prototype = prototype;

			// definition
			ns.widget.micro.Page = Page;
			engine.defineWidget(
				"page",
				"",
				"[data-role=page],.ui-page",
				[],
				Page,
				'micro'
			);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej));
