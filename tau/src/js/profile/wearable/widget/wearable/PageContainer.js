/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # PageContainer Widget
 * PageContainer is a widget, which is supposed to have multiple child pages but display only one at a time.
 *
 * It allows for adding new pages, switching between them and displaying progress bars indicating loading process.
 *
 * @class ns.widget.wearable.PageContainer
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Krzysztof Głodowski <k.glodowski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/DOM/attributes",
			"../../../../core/widget/BaseWidget",
			"../wearable",
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				Page = ns.widget.wearable.Page,
				util = ns.util,
				eventUtils = ns.event,
				DOM = util.DOM,
				engine = ns.engine,
				classes = {
					uiViewportTransitioning: "ui-viewport-transitioning",
					out: "out",
					in: "in",
					uiPreIn: "ui-pre-in",
					uiBuild: "ui-page-build"
				},
				PageContainer = function () {
					/**
					 * Active page.
					 * @property {ns.widget.wearable.Page} [activePage]
					 * @member ns.widget.wearable.PageContainer
					 */
					this.activePage = null;
				},
				EventType = {
					/**
					 * Triggered after the changePage() request
					 * has finished loading the page into the DOM and
					 * all page transition animations have completed.
					 * @event pagechange
					 * @member ns.widget.wearable.PageContainer
					 */
					PAGE_CHANGE: "pagechange"
				},
				animationend = "animationend",
				webkitAnimationEnd = "webkitAnimationEnd",
				prototype = new BaseWidget();

			/**
			 * Dictionary for PageContainer related event types.
			 * @property {Object} events
			 * @property {string} [events.PAGE_CHANGE="pagechange"]
			 * @member ns.router.route.popup
			 * @static
			 */
			PageContainer.events = EventType;

			/**
			 * Dictionary for PageContainer related css class names
			 * @property {Object} classes
			 * @member ns.widget.wearable.Page
			 * @static
			 * @readonly
			 */
			PageContainer.classes = classes;

			/**
			 * This method changes active page to specified element.
			 * @method change
			 * @param {HTMLElement} toPage The element to set
			 * @param {Object} [options] Additional options for the transition
			 * @param {string} [options.transition=none] Specifies the type of transition
			 * @param {boolean} [options.reverse=false] Specifies the direction of transition
			 * @member ns.widget.wearable.PageContainer
			 */
			prototype.change = function (toPage, options) {
				var self = this,
					fromPageWidget = self.getActivePage(),
					toPageWidget;

				options = options || {};

				// The change should be made only if no active page exists
				// or active page is changed to another one.
				if (!fromPageWidget || (fromPageWidget.element !== toPage)) {
					if (toPage.parentNode !== self.element) {
						toPage = self._include(toPage);
					}

					toPage.classList.add(classes.uiBuild);

					toPageWidget = engine.instanceWidget(toPage, "page");

					// set sizes of page for correct display
					toPageWidget.layout();

					if (ns.getConfig("autoBuildOnPageChange", false)) {
						engine.createWidgets(toPage);
					}

					if (fromPageWidget) {
						fromPageWidget.onBeforeHide();
					}
					toPageWidget.onBeforeShow();

					toPage.classList.remove(classes.uiBuild);

					options.deferred = {
						resolve: function () {
							if (fromPageWidget) {
								fromPageWidget.onHide();
								self._removeExternalPage(fromPageWidget, options);
							}
							toPageWidget.onShow();
							self.trigger(EventType.PAGE_CHANGE);
						}
					};
					self._transition(toPageWidget, fromPageWidget, options);
				}
			};

			/**
			 * This method performs transition between the old and a new page.
			 * @method _transition
			 * @param {ns.widget.wearable.Page} toPageWidget The new page
			 * @param {ns.widget.wearable.Page} fromPageWidget The page to be replaced
			 * @param {Object} [options] Additional options for the transition
			 * @param {string} [options.transition=none] The type of transition
			 * @param {boolean} [options.reverse=false] Specifies transition direction
			 * @param {Object} [options.deferred] Deferred object
			 * @member ns.widget.wearable.PageContainer
			 * @protected
			 */
			prototype._transition = function (toPageWidget, fromPageWidget, options) {
				var self = this,
					element = self.element,
					elementClassList = element.classList,
					transition = !fromPageWidget || !options.transition ? "none" : options.transition,
					deferred = options.deferred,
					reverse = "reverse",
					clearClasses = [classes.in, classes.out, classes.uiPreIn, transition],
					oldDeferredResolve,
					classlist,
					classParam,
					oneEvent;

				if (options.reverse) {
					clearClasses.push(reverse);
				}
				elementClassList.add(classes.uiViewportTransitioning);
				oldDeferredResolve = deferred.resolve;
				deferred.resolve = function () {
					var fromPageWidgetClassList = fromPageWidget && fromPageWidget.element.classList,
						toPageWidgetClassList = toPageWidget.element.classList;
					elementClassList.remove(classes.uiViewportTransitioning);
					toPageWidgetClassList.remove.apply(toPageWidgetClassList, clearClasses);
					if (fromPageWidgetClassList) {
						fromPageWidgetClassList.remove.apply(fromPageWidgetClassList, clearClasses);
					}
					self._setActivePage(toPageWidget);
					oldDeferredResolve();
				};

				if (transition !== "none") {
					oneEvent = function () {
						eventUtils.off(toPageWidget.element, [animationend, webkitAnimationEnd], oneEvent, false);
						deferred.resolve();
					};
					eventUtils.one(toPageWidget.element, [animationend, webkitAnimationEnd], oneEvent, false);

					if (fromPageWidget) {
						classParam = [];
						classParam.push(transition, classes.out);
						if (options.reverse) {
							classParam.push(reverse);
						}
						classlist = fromPageWidget.element.classList;
						classlist.add.apply(classlist ,classParam);
					}

					classlist = toPageWidget.element.classList;
					classParam = [];
					classParam.push(transition, classes.in, classes.uiPreIn);
					if (options.reverse) {
						classParam.push(reverse);
					}
					classlist.add.apply(classlist, classParam);
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
			};
			/**
			 * This method adds an element as a page.
			 * @method _include
			 * @param {HTMLElement} page an element to add
			 * @member ns.widget.wearable.PageContainer
			 * @return {HTMLElement}
			 * @protected
			 */
			prototype._include = function (page) {
				var element = this.element;
				if (page.parentNode !== element) {
					page = util.importEvaluateAndAppendElement(page, element);
				}
				return page;
			};
			/**
			 * This method sets currently active page.
			 * @method _setActivePage
			 * @param {ns.widget.wearable.Page} page a widget to set as the active page
			 * @member ns.widget.wearable.PageContainer
			 * @protected
			 */
			prototype._setActivePage = function (page) {
				var self = this;
				if (self.activePage) {
					self.activePage.setActive(false);
				}
				self.activePage = page;
				page.setActive(true);
			};
			/**
			 * This method returns active page widget.
			 * @method getActivePage
			 * @member ns.widget.wearable.PageContainer
			 * @return {ns.widget.wearable.Page} Currently active page
			 */
			prototype.getActivePage = function () {
				return this.activePage;
			};

			/**
			 * This method displays a progress bar indicating loading process.
			 * @method showLoading
			 * @member ns.widget.wearable.PageContainer
			 * @return {null}
			 */
			prototype.showLoading = function () {
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.warn("PageContainer.prototype.showLoading not yet implemented");
				//>>excludeEnd("tauDebug");
				return null;
			};
			/**
			 * This method hides any active progress bar.
			 * @method hideLoading
			 * @member ns.widget.wearable.PageContainer
			 * @return {null}
			 */
			prototype.hideLoading = function () {
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.warn("PageContainer.prototype.hideLoading not yet implemented");
				//>>excludeEnd("tauDebug");
				return null;
			};
			/**
			 * This method removes page element from the given widget and destroys it.
			 * @method _removeExternalPage
			 * @param {ns.widget.wearable.Page} fromPageWidget the widget to destroy
			 * @param {Object} [options] transition options
			 * @param {boolean} [options.reverse=false] specifies transition direction
			 * @member ns.widget.wearable.PageContainer
			 * @protected
			 */
			prototype._removeExternalPage = function ( fromPageWidget, options) {
				var fromPage = fromPageWidget.element;
				options = options || {};
				if (options.reverse && DOM.hasNSData(fromPage, "external")) {
					fromPageWidget.destroy();
					if (fromPage.parentNode) {
						fromPage.parentNode.removeChild(fromPage);
					}
				}
			};

			PageContainer.prototype = prototype;

			// definition
			ns.widget.wearable.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"",
				["change", "getActivePage", "showLoading", "hideLoading"],
				PageContainer,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
