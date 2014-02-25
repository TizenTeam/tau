/*global window, define */
/*jslint nomen: true, plusplus: true */
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
			"../../utils/events",
			"../../utils/DOM/attributes",
			"../micro",
			"../BaseWidget",
			"./Page"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				Page = ns.widget.micro.Page,
				selectors = ns.micro.selectors,
				utils = ns.utils,
				events = utils.events,
				DOM = utils.DOM,
				engine = ns.engine,
				/**
				* PageContainer widget
				* @class ns.widget.PageContainer
				* @extends ns.widget.BaseWidget
				*/
				PageContainer = function () {
					this.activePage = null;
					return this;
				},
				EventType = {
					PAGE_CHANGE: "pagechange"
				},
				prototype = new BaseWidget();

			PageContainer.events = EventType;

			/**
			* build PageContainer
			* @method _build
			* @private
			* @param {string} template
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @memberOf ns.widget.PageContainer
			*/
			prototype._build = function (template, element) {
				return element;
			};

			prototype.change = function (toPage, options) {
				var fromPageWidget = this.getActivePage(),
					toPageWidget,
					self = this;

				options = options || {};

				if (toPage.parentNode !== this.element) {
					this._include(toPage);
				}

				toPageWidget = engine.instanceWidget(toPage, 'page');

				if (!fromPageWidget || (fromPageWidget.element !== toPage)) {
					this._include(toPage);
					if (fromPageWidget) {
						fromPageWidget.onBeforeHide();
					}
					toPageWidget.onBeforeShow();
				}

				options.deferred = {
					resolve: function () {
						self._setActivePage(toPageWidget);
						if (fromPageWidget) {
							fromPageWidget.onHide();
							self._removeExternalPage( fromPageWidget, options);
						}
						toPageWidget.onShow();
						events.trigger(self.element, EventType.PAGE_CHANGE);
					}
				};
				this._transition(toPageWidget, fromPageWidget, options);
			};

			prototype._transition = function (toPageWidget, fromPageWidget, options) {
				var element = this.element,
					elementClassList = element.classList,
					transition = !fromPageWidget ? "none" : options.transition,
					deferred = options.deferred,
					reverse = "reverse",
					clearClasses = ["in", "out", "ui-pre-in", transition],
					oldDeferredResolve,
					target,
					oneEvent;

				if (options.reverse) {
					clearClasses.push(reverse);
				}
				elementClassList.add("ui-viewport-transitioning");
				oldDeferredResolve = deferred.resolve;
				deferred.resolve = function () {
					var i,
						clearClassesLength = clearClasses.length,
						fromPageWidgetClassList = fromPageWidget && fromPageWidget.element.classList,
						toPageWidgetClassList = toPageWidget.element.classList;

					elementClassList.remove("ui-viewport-transitioning");
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
						target.removeEventListener('animationend', oneEvent, false);
						target.removeEventListener('webkitAnimationEnd', oneEvent, false);
						deferred.resolve();
					};
					target.addEventListener('animationend', oneEvent, false);
					target.addEventListener('webkitAnimationEnd', oneEvent, false);

					if (fromPageWidget) {
						fromPageWidget.element.classlist.add(transition);
						fromPageWidget.element.classlist.add('out');
						if (options.reverse) {
							fromPageWidget.element.classlist.add(reverse);
						}
					}

					// TODO why needs timeout??
					// if it make without timeout, it has some bugs when call external page or press forward button on browser.
					window.setTimeout(function () {
						toPageWidget.element.classlist.add(transition);
						toPageWidget.element.classlist.add('out');
						if (options.reverse) {
							toPageWidget.element.classlist.add(reverse);
						}
					}, 0);
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
			};

			prototype._include = function (page) {
				if (page.parentNode !== this.element) {
					this.element.appendChild(page);
				}
			};

			prototype._setActivePage = function (page) {
				if (this.activePage) {
					this.activePage.setActive(false);
				}
				this.activePage = page;
				page.setActive(true);
			};

			prototype.getActivePage = function () {
				return this.activePage;
			};

			prototype._bindEvents = function (element) {
				return element;
			};

			prototype.showLoading = function () {
				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.warn('prototype.showLoading not yet implemented');
				//>>excludeEnd("ejDebug");
				return null;
			};

			prototype.hideLoading = function () {
				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.warn('prototype.hideLoading not yet implemented');
				//>>excludeEnd("ejDebug");
				return null;
			};

			prototype._removeExternalPage = function ( fromPageWidget, options) {
				var fromPage = fromPageWidget.element;
				if (options.reverse && DOM.hasNSData(fromPage, 'external')) {
					fromPageWidget.destroy();
					fromPage.parentNode.removeChild(fromPage);
				}
			};

			/**
			* refresh structure
			* @method _refresh
			* @new
			* @memberOf ns.widget.PageContainer
			*/
			prototype._refresh = function () {
				return null;
			};

			/**
			* @method _destroy
			* @private
			* @memberOf ns.widget.PageContainer
			*/
			prototype._destroy = function () {
				return null;
			};

			PageContainer.prototype = prototype;

			// definition
			ns.widget.micro.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"./widget/ns.widget.micro.PageContainer",
				"",
				[],
				PageContainer,
				'micro'
			);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej));
