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
			"../../utils/events",
			"../micro",
			"../BaseWidget",
			"./Page"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var BaseWidget = ej.widget.BaseWidget,
				Page = ej.widget.micro.Page,
				selectors = ej.micro.selectors,
				events = ej.utils.events,
				engine = ej.engine,
				/**
				* PageContainer widget
				* @class ej.widget.PageContainer
				* @extends ej.widget.BaseWidget
				*/
				PageContainer = function () {
					this.activePage = null;
					return this;
				},
				EventType = {
					PAGE_CHANGE: "pagechange"
				};

			PageContainer.prototype = new BaseWidget();

			PageContainer.events = EventType;

			/**
			* build PageContainer
			* @method _build
			* @private
			* @param {string} template
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @memberOf ej.widget.PageContainer
			*/
			PageContainer.prototype._build = function (template, element) {
				return element;
			};

			PageContainer.prototype.change = function (toPage, options) {
				var fromPageWidget = this.getActivePage(),
					toPageWidget,
					self = this;

				options = options || {};

				if (toPage.parentNode !== this.element) {
					this._include(toPage);
				}

				toPageWidget = engine.instanceWidget(toPage, 'page');

				if (!fromPageWidget || (fromPageWidget.element != toPage)) {
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
							self._removeExternalPage();
						}
						toPageWidget.onShow();
						events.trigger(self.element, EventType.PAGE_CHANGE);
					}
				};
				this._transition(toPageWidget, fromPageWidget, options);
			};

			PageContainer.prototype._transition = function (toPageWidget, fromPageWidget, options) {
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

			PageContainer.prototype._include = function (page) {
				this.element.appendChild(page);
			};

			PageContainer.prototype.changePageFinish = function (fromPageWidget, toPageWidget) {
				this._setActivePage(toPageWidget);

				if (fromPageWidget) {
					fromPageWidget.onBeforeHide();
				}
				toPageWidget.onBeforeShow();

				events.trigger(this.element, PageContainer.events.PAGE_CHANGE);
				this._removeExternalPage();
			};

			PageContainer.prototype._setActivePage = function (page) {
				if (this.activePage) {
					this.activePage.setActive(false);
				}
				this.activePage = page;
				page.setActive(true);
			};

			PageContainer.prototype.getActivePage = function () {
				return this.activePage;
			};

			PageContainer.prototype._bindEvents = function (element) {
				return element;
			};

			PageContainer.prototype.showLoading = function () {
				ej.warn('PageContainer.prototype.showLoading not yet implemented');
				return null;
			};

			PageContainer.prototype.hideLoading = function () {
				ej.warn('PageContainer.prototype.hideLoading not yet implemented');
				return null;
			};

			PageContainer.prototype._removeExternalPage = function () {
				var pages = this.element.querySelectorAll(selectors.page + '[data-external-page=true]:not(.' + Page.classes.uiPageActive + ')'),
					i,
					pagesLength = pages.length,
					page;

				for (i = 0; i < pagesLength; i++) {
					page = engine.getBinding(pages[i]);
					// If page exists run destroy
					if (page) {
						page.destroy();
					}
					pages[i].parentNode.removeChild(pages[i]);
				}
			};

			/**
			* refresh structure
			* @method _refresh
			* @new
			* @memberOf ej.widget.PageContainer
			*/
			PageContainer.prototype._refresh = function () {
				return null;
			};

			/**
			* @method _destroy
			* @private
			* @memberOf ej.widget.PageContainer
			*/
			PageContainer.prototype._destroy = function () {
				return null;
			};

			// definition
			ej.widget.micro.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"./widget/ej.widget.micro.PageContainer",
				"",
				[],
				PageContainer,
				'micro'
			);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ej.widget.micro.PageContainer;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej));
