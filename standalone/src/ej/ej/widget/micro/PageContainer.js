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
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../engine",
			"../../utils/DOM/attributes",
			"../micro",
			"../BaseWidget",
			"./Page"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				Page = ns.widget.micro.Page,
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
				* @class ns.widget.micro.PageContainer
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
			* @memberOf ns.widget.micro.PageContainer
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
							self._removeExternalPage( fromPageWidget, options);
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
			* @param {ns.widget.micro.Page} toPageWidget the new page
			* @param {ns.widget.micro.Page} fromPageWidget the page to be replaced
			* @param {Object} [options] additional options for the transition
			* @param {string} [options.transition=none] the type of transition
			* @param {boolean} [options.reverse=false] specifies transition direction
			* @param {Object} [options.deferred] deferred object
			* @memberOf ns.widget.micro.PageContainer
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
			* @memberOf ns.widget.micro.PageContainer
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
			* @param {ns.widget.micro.Page} page a widget to set as the active page
			* @memberOf ns.widget.micro.PageContainer
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
			* @memberOf ns.widget.micro.PageContainer
			* @return {ns.widget.micro.Page} currently active page
			* @instance
			*/
			prototype.getActivePage = function () {
				return this.activePage;
			};

			/**
			* Displays a progress bar indicating loading process
			* @method showLoading
			* @memberOf ns.widget.micro.PageContainer
			* @return {null}
			* @instance
			*/
			prototype.showLoading = function () {
				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.warn("prototype.showLoading not yet implemented");
				//>>excludeEnd("ejDebug");
				return null;
			};
			/**
			* Hides any active progress bar
			* @method hideLoading
			* @memberOf ns.widget.micro.PageContainer
			* @return {null}
			* @instance
			*/
			prototype.hideLoading = function () {
				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.warn("prototype.hideLoading not yet implemented");
				//>>excludeEnd("ejDebug");
				return null;
			};
			/**
			* Removes page element from the given widget and destroys it
			* @method _removeExternalPage
			* @param {ns.widget.micro.Page} fromPageWidget the widget to destroy
			* @param {Object} [options] transition options 
			* @param {boolean} [options.reverse=false] specifies transition direction
			* @memberOf ns.widget.micro.PageContainer
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
			ns.widget.micro.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"./widget/ns.widget.micro.PageContainer",
				"",
				["change", "getActivePage", "showLoading", "hideLoading"],
				PageContainer,
				"micro"
			);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej));
