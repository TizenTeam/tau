/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Popup Widget
 * Shows a pop-up window.
 *
 * @class ns.widget.tv.Popup
 * @extends ns.widget.core.ContextPopup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/widget/core/ContextPopup",
			"../../../core/engine",
			"../../../core/event",
			"../../../core/util/selectors",
			"../../../core/util/object",
			"../../../core/util/DOM",
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				utilSelectors = ns.util.selectors,
				objectUtils = ns.util.object,
				DOM = ns.util.DOM,
				CorePopup = ns.widget.core.ContextPopup,
				CorePopupPrototype = CorePopup.prototype,
				Page = ns.widget.tv.Page,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				Popup = function () {
					var self = this;

					CorePopup.call(self);
					BaseKeyboardSupport.call(self);

					self.options = objectUtils.merge(self.options, defaults);
					self.selectors = selectors;
					self._nearestLinkForArrow = null;
				},
				/**
				 * @property {string} [arrow="t,b,l,r"] Define priority of arrow position in context popup
				 * @property {number} [distance=16] define distance between element and border of popup
				 * @property {number|HTMLElement|boolean|null} [autofocus=0] define element which should be focused after open popup
				 */
				defaults = objectUtils.merge({}, CorePopup.defaults, {
					arrow: "t,b,l,r",
					distance: 16,
					positionTo: "window",
					autofocus: 0
				}),
				classes = objectUtils.merge({}, CorePopup.classes, {
					toast: "ui-popup-toast",
					headerEmpty: "ui-header-empty",
					footerEmpty: "ui-footer-empty",
					content: "ui-popup-content",
					focus: "ui-focus",
					uiPage: Page.classes.uiPage
				}),
				selectors = {
					header: "header",
					content: "div",
					footer: "footer"
				},
				prototype = new CorePopup(),
				FUNCTION_TYPE = "function",
				KEY_CODES = {
					enter: 13
				};

			Popup.events = CorePopup.events;

			Popup.classes = classes;

			Popup.prototype = prototype;

			/**
			 * Build the popup DOM tree
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.tv.Popup
			 */
			prototype._build = function (element) {
				var ui = this._ui;

				if (typeof CorePopupPrototype._build === FUNCTION_TYPE) {
					CorePopupPrototype._build.apply(this, arguments);
				}

				if (!ui.header) {
					element.classList.add(classes.headerEmpty);
				}

				if (!ui.footer) {
					element.classList.add(classes.footerEmpty);
				}

				return element;
			};

			prototype._init = function(element) {
				var page;

				if (typeof CorePopupPrototype._init === FUNCTION_TYPE) {
					CorePopupPrototype._init.call(this, element);
				}
				if (element.classList.contains(classes.toast)) {
					this._ui.container.classList.add(classes.toast);
				}
				page = utilSelectors.getClosestByClass(element, classes.uiPage);
				this._pageWidget = engine.getBinding(page, "Page");
			};

			function onKeydownClosing(self, event) {
				var keyCode = event.keyCode;

				if (keyCode === KEY_CODES.enter) {
					event.preventDefault();
					event.stopPropagation();
					setTimeout(self.close.bind(self), 10);
				}
			}

			function closingOnKeydown(self, added) {
				if (self.element.classList.contains(classes.toast)) {
					if (added) {
						self._onKeydownClosing = onKeydownClosing.bind(null, self);
						document.addEventListener("keydown", self._onKeydownClosing, false);
					} else {
						document.removeEventListener("keydown", self._onKeydownClosing, false);
					}
				}
			}

			prototype._setKeyboardSupport = function (options) {
				var self = this,
					element = self.element,
					autoFocus = options.autofocus,
					page = self._pageWidget,
					toastPopup = element.classList.contains(classes.toast),
					selector = self.getActiveSelector();

				if (toastPopup || (selector && element.querySelector(selector))) {
					// if there are links inside popup, we enable keyboard support on page
					// and enable in popup
					self.enableKeyboardSupport();
					BaseKeyboardSupport.blurAll();
					page.disableKeyboardSupport();

					if (autoFocus || autoFocus === 0) {
						BaseKeyboardSupport.focusElement(element, autoFocus);
					}
				}

				closingOnKeydown(self, true);
			};

			prototype._placementCoordsWindow = function(element) {
				// if popup is not a toast popup, we set position to the center
				if (!element.classList.contains(classes.toast) &&
					typeof CorePopupPrototype._placementCoordsWindow === FUNCTION_TYPE) {
					CorePopupPrototype._placementCoordsWindow.call(this, element);
					element.style.top = parseInt(element.style.top) / 2 + "px";
				}
			};

			prototype._findClickedElement = function(x, y) {
				var clickedElement =  document.elementFromPoint(x, y),
					button = utilSelectors.getClosestBySelector(clickedElement, engine.getWidgetDefinition("Button").selector);

				return button || clickedElement;
			};

			prototype.open = function(options) {
				var self = this;

				if (!self._isActive()) {

					if (typeof CorePopupPrototype.open === FUNCTION_TYPE) {
						CorePopupPrototype.open.apply(self, arguments);
					}

					self._setArrowFocus();
					self._setKeyboardSupport(options || {});
				}
			};

			/**
			 * Close popup
			 * @method close
			 * @protected
			 * @param {Object} options
			 * @param {boolean} [options.noBlur=false] Disable blur on close
			 * @member ns.widget.tv.Popup
			 */
			prototype.close = function(options) {
				var self = this,
					activeElement,
					popupElements;

				options = options || {};
				if (self._isOpened()) {
					if (typeof CorePopupPrototype.close === FUNCTION_TYPE) {
						CorePopupPrototype.close.apply(self, arguments);
					}

					self._cleanArrowFocus();
					self.disableKeyboardSupport();
					self._pageWidget.enableKeyboardSupport();

					closingOnKeydown(self, false);

					//checking that current focused element is inside this popup
					activeElement = document.activeElement;
					popupElements = utilSelectors.getClosestByClass(activeElement, classes.popup);
					if (popupElements && popupElements.indexOf(self.element) > -1) {
						// blur any focused elements
						document.activeElement.blur();
					}
				}
			};

			prototype._cleanArrowFocus = function () {
				var self = this,
					nearestLinkForArrow = self._nearestLinkForArrow,
					callbacks = self._callbacks;

				self._ui.arrow.classList.remove(classes.focus);
				if (nearestLinkForArrow) {
					nearestLinkForArrow.removeEventListener("focus", callbacks._onFocusArrow, false);
					nearestLinkForArrow.removeEventListener("blur", callbacks._onBlurArrow, false);
				}
			};

			prototype._setArrowFocus = function () {
				var self = this,
					element = self.element,
					callbacks = self._callbacks,
					arrow = self._ui.arrow,
					arrowHeight = arrow.offsetHeight,
					arrowTop = DOM.getElementOffset(arrow).top,
					links = element.querySelectorAll(self.getActiveSelector()),
					linksLength = links.length,
					link,
					linkTop,
					nearestLinkForArrow,
					i = 0;

				if (element.classList.contains(classes.context)) {
					switch (arrow.getAttribute("type")) {
						case "l":
						case "r":
							while (!nearestLinkForArrow && i < linksLength) {
								link = links[i];
								linkTop = DOM.getElementOffset(link).top;
								if (linkTop + link.offsetHeight > arrowTop && linkTop < arrowTop) {
									nearestLinkForArrow = link;
								}
								i++;
							}
							break;
						case "t":
							while (!nearestLinkForArrow && i < linksLength) {
								link = links[i];
								if (DOM.getElementOffset(link).top < arrowTop + arrowHeight) {
									nearestLinkForArrow = link;
								}
								i++;
							}
							break;
						case "b":
							while (!nearestLinkForArrow && i < linksLength) {
								link = links[i];
								if (DOM.getElementOffset(link).top + link.offsetHeight > arrowTop) {
									nearestLinkForArrow = link;
								}
								i++;
							}
							break;
					}
					if (nearestLinkForArrow) {
						callbacks._onFocusArrow = onFocusArrow.bind(null, arrow);
						callbacks._onBlurArrow = onBlurArrow.bind(null, arrow);
						nearestLinkForArrow.addEventListener("focus", callbacks._onFocusArrow, false);
						nearestLinkForArrow.addEventListener("blur", callbacks._onBlurArrow, false);
						self._nearestLinkForArrow = nearestLinkForArrow;
					}
				}
			};

			function onFocusArrow(arrow) {
				arrow.classList.add(classes.focus);
			}

			function onBlurArrow(arrow) {
				arrow.classList.remove(classes.focus);
			}

			prototype._bindEvents = function(element) {
				if (typeof CorePopupPrototype._bindEvents === FUNCTION_TYPE) {
					CorePopupPrototype._bindEvents.call(this, element);
				}
				this._bindEventKey();
			};

			prototype._destroy = function() {
				this._destroyEventKey();
				if (typeof CorePopupPrototype._destroy === FUNCTION_TYPE) {
					CorePopupPrototype._destroy.call(this);
				}
			};

			// definition
			ns.widget.tv.Popup = Popup;

			engine.defineWidget(
				"Popup",
				"[data-role='popup'], .ui-popup",
				["open", "close", "reposition"],
				Popup,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
