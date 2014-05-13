/*global window, define */
/*jslint nomen: true, plusplus: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/* 
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
			"../../../../core/utils/DOM/attributes",
			"../../../../core/widget/BaseWidget",
			"../wearable",
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				Page = ns.widget.wearable.Page,
				utils = ns.utils,
				DOM = utils.DOM,
				engine = ns.engine,
				classes = {
					uiViewportTransitioning: "ui-viewport-transitioning",
					out: "out",
					in: "in",
					uiPreIn: "ui-pre-in"
				},
				/**
				* PageContainer is a widget, which is supposed to have multiple child pages but display only one at a time.
				* It allows for adding new pages, switching between them and displaying progress bars indicating loading process.
				* @class ns.widget.wearable.PageContainer
				* @extends ns.widget.BaseWidget
				*/
				PageContainer = function () {
					this.activePage = null;
					return this;
				},
				EventType = {
					PAGE_CHANGE: "pagechange"
				},
				animationend = "animationend",
				webkitAnimationEnd = "webkitAnimationEnd",
				prototype = new BaseWidget();

			PageContainer.events = EventType;

			/**
			* Changes active page to specified element
			* @method change
			* @param {HTMLElement} toPage the element to set
			* @param {Object} [options] additional options for the transition
			* @param {string} [options.transition=none] the type of transition
			* @param {boolean} [options.reverse=false] specifies transition direction
			* @member ns.widget.wearable.PageContainer
			* @instance
			*/
			prototype.change = function (toPage, options) {
				var self = this,
					fromPageWidget = self.getActivePage(),
					toPageWidget;

				options = options || {};

				if (toPage.parentNode !== self.element) {
					self._include(toPage);
				}

				toPageWidget = engine.instanceWidget(toPage, "page");

				if (ns.get("autoBuildOnPageChange", false)) {
					engine.createWidgets(toPage);
				}

				if (!fromPageWidget || (fromPageWidget.element !== toPage)) {
					self._include(toPage);
					if (fromPageWidget) {
						fromPageWidget.onBeforeHide();
					}
					toPageWidget.onBeforeShow();
				}

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
			};
			/**
			* Performs transition between the old and a new page.
			* @method _transition
			* @param {ns.widget.wearable.Page} toPageWidget the new page
			* @param {ns.widget.wearable.Page} fromPageWidget the page to be replaced
			* @param {Object} [options] additional options for the transition
			* @param {string} [options.transition=none] the type of transition
			* @param {boolean} [options.reverse=false] specifies transition direction
			* @param {Object} [options.deferred] deferred object
			* @member ns.widget.wearable.PageContainer
			* @protected
			* @instance
			*/
			prototype._transition = function (toPageWidget, fromPageWidget, options) {
				var element = this.element,
					elementClassList = element.classList,
					transition = !fromPageWidget || !options.transition ? "none" : options.transition,
					deferred = options.deferred,
					reverse = "reverse",
					clearClasses = [classes.in, classes.out, classes.uiPreIn, transition],
					oldDeferredResolve,
					target,
					classlist,
					oneEvent;

				if (options.reverse) {
					clearClasses.push(reverse);
				}
				elementClassList.add(classes.uiViewportTransitioning);
				oldDeferredResolve = deferred.resolve;
				deferred.resolve = function () {
					var i,
						clearClassesLength = clearClasses.length,
						fromPageWidgetClassList = fromPageWidget && fromPageWidget.element.classList,
						toPageWidgetClassList = toPageWidget.element.classList;

					elementClassList.remove(classes.uiViewportTransitioning);
					for (i = 0; i < clearClassesLength; i++) {
						if (fromPageWidgetClassList) {
							fromPageWidgetClassList.remove(clearClasses[i]);
						}
						toPageWidgetClassList.remove(clearClasses[i]);
					}
					oldDeferredResolve();
				};

				if (transition !== "none") {
					target = options.reverse ? fromPageWidget : toPageWidget;
					oneEvent = function () {
						target.element.removeEventListener(animationend, oneEvent, false);
						target.element.removeEventListener(webkitAnimationEnd, oneEvent, false);
						deferred.resolve();
					};
					target.element.addEventListener(animationend, oneEvent, false);
					target.element.addEventListener(webkitAnimationEnd, oneEvent, false);

					if (fromPageWidget) {
						classlist = fromPageWidget.element.classList;
						classlist.add(transition);
						classlist.add(classes.out);
						if (options.reverse) {
							classlist.add(reverse);
						}
					}

					classlist = target.element.classList;
					classlist.add(transition);
					classlist.add(classes.in);
					if (options.reverse) {
						classlist.add(reverse);
					}
					this._setActivePage(target);
				} else {
					this._setActivePage(toPageWidget);
					window.setTimeout(deferred.resolve, 0);
				}
			};
			/**
			* Adds an element as a page
			* @method _include
			* @param {HTMLElement} page an element to add
			* @member ns.widget.wearable.PageContainer
			* @protected
			* @instance
			*/
			prototype._include = function (page) {
				var element = this.element;
				if (page.parentNode !== element) {
					element.appendChild(page);
				}
			};
			/**
			* Sets currently active page
			* @method _setActivePage
			* @param {ns.widget.wearable.Page} page a widget to set as the active page
			* @member ns.widget.wearable.PageContainer
			* @instance
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
			* Returns active page element
			* @method getActivePage
			* @member ns.widget.wearable.PageContainer
			* @return {ns.widget.wearable.Page} currently active page
			* @instance
			*/
			prototype.getActivePage = function () {
				return this.activePage;
			};

			/**
			* Displays a progress bar indicating loading process
			* @method showLoading
			* @member ns.widget.wearable.PageContainer
			* @return {null}
			* @instance
			*/
			prototype.showLoading = function () {
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.warn("PageContainer.prototype.showLoading not yet implemented");
				//>>excludeEnd("tauDebug");
				return null;
			};
			/**
			* Hides any active progress bar
			* @method hideLoading
			* @member ns.widget.wearable.PageContainer
			* @return {null}
			* @instance
			*/
			prototype.hideLoading = function () {
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.warn("PageContainer.prototype.hideLoading not yet implemented");
				//>>excludeEnd("tauDebug");
				return null;
			};
			/**
			* Removes page element from the given widget and destroys it
			* @method _removeExternalPage
			* @param {ns.widget.wearable.Page} fromPageWidget the widget to destroy
			* @param {Object} [options] transition options
			* @param {boolean} [options.reverse=false] specifies transition direction
			* @member ns.widget.wearable.PageContainer
			* @instance
			* @protected
			*/
			prototype._removeExternalPage = function ( fromPageWidget, options) {
				var fromPage = fromPageWidget.element;
				options = options || {};
				if (options.reverse && DOM.hasNSData(fromPage, "external")) {
					fromPageWidget.destroy();
					fromPage.parentNode.removeChild(fromPage);
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