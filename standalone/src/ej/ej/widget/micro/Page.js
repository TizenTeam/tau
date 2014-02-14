/*global window, define */
/*jslint nomen: true */
(function (document, ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../core",
			"../../micro/selectors",
			"../../engine",
			"../../utils/selectors",
			"../../utils/events",
			"../micro",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var BaseWidget = ej.widget.BaseWidget,
				selectors = ej.micro.selectors,
				engine = ej.engine,
				events = ej.utils.events,
				/**
				* Page widget
				* @class ej.widget.micro.Page
				* @extends ej.widget.BaseWidget
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
					* @memberOf ej.widget.micro.Page
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
				* @memberOf ej.widget.micro.Page
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
				};
			Page.classes = classes;
			Page.events = EventType;

			selectors.page = '.' + classes.uiPage;
			selectors.activePage = '.' + classes.uiPageActive;
			selectors.section = '.' + classes.uiSection;
			selectors.header = '.' + classes.uiHeader;
			selectors.footer = '.' + classes.uiFooter;
			selectors.content = '.' + classes.uiContent;
			selectors.pageScroll = '.' + classes.uiPageScroll;

			Page.prototype = new BaseWidget();

			/**
			* Sets top-bottom css attributes for content element
			* to allow it to fill the page dynamically
			* @method contentFill
			* @param {ej.widget.micro.Page} self
			* @memberOf ej.widget.micro.Page
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
						extraHeight += node.offsetHeight;
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
			* @memberOf ej.widget.micro.Page
			*/
			Page.prototype._build = function (template, element) {
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
			* @memberOf ej.widget.micro.Page
			*/
			Page.prototype.setActive = function (value) {
				this.element.classList.toggle(classes.uiPageActive, value);
			};

			Page.prototype._bindEvents = function (element) {
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
			* @memberOf ej.widget.micro.Page
			*/
			Page.prototype._refresh = function () {
				contentFill(this);
			};

			/**
			* init widget
			* @method _init
			* @param {HTMLElement} element
			* @new
			* @memberOf ej.widget.micro.Page
			*/
			Page.prototype._init = function (element) {
				this.element = element;
				contentFill(this);
			};

			Page.prototype.onBeforeShow = function () {
				events.trigger(this.element, EventType.BEFORE_SHOW);
			};

			Page.prototype.onShow = function () {
				events.trigger(this.element, EventType.SHOW);
			};

			Page.prototype.onBeforeHide = function () {
				events.trigger(this.element, EventType.BEFORE_HIDE);
			};

			Page.prototype.onHide = function () {
				events.trigger(this.element, EventType.HIDE);
			};
			/**
			* @method _destroy
			* @private
			* @memberOf ej.widget.micro.Page
			*/
			Page.prototype._destroy = function () {
				var childWidgets = this.element.querySelectorAll("[data-ej-built='true']");

				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ej.log("Called _destroy in ej.widget.micro.Page");
				//>>excludeEnd("ejDebug");

				window.removeEventListener("resize", this.contentFillAfterResizeCallback, false);
				this.element.removeEventListener("pageshow", this.contentFillCallback, false);

				[].slice.call(childWidgets).forEach(function (widgetElement) {
					var binding = engine.getBinding(widgetElement);
					if (binding) {
						//>>excludeStart("ejDebug", pragmas.ejDebug);
						ej.log("Called .destroy() on Page child widget: " + binding.name + " with id: " + binding.id);
						//>>excludeEnd("ejDebug");
						binding.destroy();
					}
				});
			};

			// definition
			ej.widget.micro.Page = Page;
			engine.defineWidget(
				"page",
				"",
				"[data-role=page],.ui-page",
				[],
				Page,
				'micro'
			);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ej.widget.micro.Page;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej));
