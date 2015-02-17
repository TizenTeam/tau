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
 * ## Toast popup
 * Toast popups are popups displayed as a short message on the screen bottom. Toasts usually do not require any user
 * interaction.
 * To create a toast popup add `ui-popup-toast` class to popup markup.
 *
 * ## Notification popup
 * Notification popups are popups shown for a specific period of time.
 * To create a notification popup, developer needs to add an additional class `ui-popup-notification`. *
 *
 * @class ns.widget.tv.Popup
 * @extends ns.widget.core.ContextPopup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
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
			"../../../core/util/DOM"
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

					self._notificationTimeout = null;
				},
				/**
				 * Default properties for TV implementation of Popup
				 * @property {Object} defaults
				 * @property {string} defaults.arrow="t,b,l,r"
				 * @property {number} defaults.distance=10
				 * @property {string|null} defaults.headerIcon=null
				 * @property {string|null} defaults.mainColor=null
				 * @property {number|HTMLElement|boolean|null} [autofocus=0] define element which should be focused after open popup
				 * @property {boolean} [changeContext=true] define if context should be changed after opening popup.
				 * If value of this property is true, it means that after opening popup, the focus will be set only
				 * inside the popup's container and if popup does not have any focusable elements, the enter will cause
				 * closing popup.
				 * @property {number|null} defaults.timeout=null time after what popup will close itself. `.timeout` <= 0 turns off the delayed close
				 * @member ns.widget.tv.Popup
				 */
				defaults = objectUtils.merge({}, CorePopup.defaults, {
					arrow: "t,b,l,r",
					distance: 16,
					positionTo: "window",
					headerIcon: null,
					mainColor: null,
					autofocus: 0,
					changeContext: true,
					timeout: null
				}),
				/**
				 * Default values for notification popup type.
				 * @property {Object} notificationDefaults
				 * @property {number} notificationDefaults.actionTimeout=60000 default timeout for closing action popup
				 * @property {number} notificationDefaults.timeout=5000 default timeout for closing normal popup
				 * @member ns.widget.tv.Popup
				 */
				notificationDefaults = {
					actionTimeout: 60000,
					timeout: 5000
				},
				classes = objectUtils.merge({}, CorePopup.classes, {
					toast: "ui-popup-toast",
					headerEmpty: "ui-header-empty",
					footerEmpty: "ui-footer-empty",
					content: "ui-popup-content",
					custom: "ui-popup-custom",
					action: "ui-popup-action",
					notification: "ui-popup-notification",
					headerIcon: "ui-popup-header-icon",
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
			 * Sets header icon based on options
			 * @param {ns.widget.tv.Popup} self
			 * @param {HTMLElement} element
			 */
			function setHeaderIcon(self, element) {
				var ui = self._ui,
					uiHeader = ui.header,
					headerIconElement,
					headerText;

				// Prepend header icon if was given as option
				if (uiHeader && self.options.headerIcon) {
					element = element || self.element;

					headerIconElement = element.querySelector("." + classes.headerIcon);

					if (!headerIconElement) {
						headerIconElement = document.createElement("img");
						headerIconElement.classList.add(classes.headerIcon);
						headerText = uiHeader.firstChild;

						// Remove spaces inside blocks for keeping constant space between icon and text
						headerText.textContent = headerText.textContent.trim();

						// Insert before first child (first child should be a text node)
						uiHeader.insertBefore(headerIconElement, headerText);
					}

					headerIconElement.src = self.options.headerIcon;
					ui.headerIcon = headerIconElement;

					// Add custom flag to make sure CSS props will work
					element.classList.add(classes.custom);
				}
			}

			/**
			 * Sets custom colors for widget elements if defined in options
			 * @param {ns.widget.tv.Popup} self
			 * @param {HTMLElement} [element]
			 */
			function setCustomPopupColors(self, element) {
				var options = self.options;

				element = element || self.element;

				if (options.mainColor) {
					if (self._ui.header) {
						self._ui.header.style.backgroundColor = options.mainColor;
					} else {
						element.style.borderTopColor = options.mainColor;
					}

					// Add custom flag to make sure CSS props will work
					element.classList.add(classes.custom);
				}
			}

			/**
			 * If popup contains any input or button-like element it's considered as action popup.
			 * This method tests if a popup is an 'action' popup.
			 * @method _isActionPopup
			 * @return {boolean}
			 * @protected
			 * @member ns.widget.tv.Popup
			 */
			prototype._isActionPopup = function () {
				var element = this.element;
				return element.classList.contains(classes.action) || !!element.querySelector("input," + engine.getWidgetDefinition("Button").selector);
			};

			/**
			 * Build the popup DOM tree
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.tv.Popup
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui;

				if (typeof CorePopupPrototype._build === FUNCTION_TYPE) {
					CorePopupPrototype._build.apply(self, arguments);
				}

				if (!ui.header) {
					element.classList.add(classes.headerEmpty);
				}

				if (!ui.footer) {
					element.classList.add(classes.footerEmpty);
				}

				// Settings for customized popups
				setHeaderIcon(self, element);

				return element;
			};

			prototype._init = function(element) {
				var self = this,
					ui = self._ui,
					isActionPopup;

				if (typeof CorePopupPrototype._init === FUNCTION_TYPE) {
					CorePopupPrototype._init.call(this, element);
				}
				if (element.classList.contains(classes.toast)) {
					ui.container.classList.add(classes.toast);
				}

				isActionPopup = self._isActionPopup();

				if (isActionPopup) {
					element.classList.add(classes.action);
				}

				// The default values for timeout must be defined here because the same `timeout` property
				// is used for both types of popup (normal and action), but default value of that property
				// is different depending on type
				if (self.options.timeout === null) {
					// Action popup has different timeout than normal popup
					self.options.timeout = isActionPopup ? notificationDefaults.actionTimeout : notificationDefaults.timeout;
				}

				// Add reference when running without _build method
				ui.headerIcon = ui.headerIcon || element.querySelector("." + classes.headerIcon);
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
				var element = self.element,
					selector = self.getActiveSelector();

				if (added) {
					// if elements inside popup are not focusable, we enabled closing on keyup
					if (selector && !element.querySelector(selector)) {
						self._onKeydownClosing = onKeydownClosing.bind(null, self);
						document.addEventListener("keydown", self._onKeydownClosing, false);
					}
				} else {
					// if listener was added, we remove it
					if (self._onKeydownClosing) {
						document.removeEventListener("keydown", self._onKeydownClosing, false);
					}
				}
			}

			prototype._setKeyboardSupport = function (options) {
				var self = this,
					element = self.element,
					autoFocus = options.autofocus,
					toastPopup = element.classList.contains(classes.toast),
					selector = self.getActiveSelector();

				// if popup is not connected with slider, we change context
				if (options.changeContext) {
					self.saveKeyboardSupport();
					// if there are links inside popup, we enable keyboard support on page
					// and enable in popup
					self.enableKeyboardSupport();
					BaseKeyboardSupport.blurAll();

					if (autoFocus || autoFocus === 0) {
						BaseKeyboardSupport.focusElement(element, autoFocus);
					}

					closingOnKeydown(self, true);
				}
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
					self._setKeyboardSupport(objectUtils.merge({}, options || {}, self.options));
				}
			};

			/**
			 * Close popup
			 * @method close
			 * @protected
			 * @member ns.widget.tv.Popup
			 */
			prototype.close = function() {
				var self = this,
					activeElement,
					popupElement;

				if (self._isOpened()) {
					if (typeof CorePopupPrototype.close === FUNCTION_TYPE) {
						CorePopupPrototype.close.apply(self, arguments);
					}

					self._cleanArrowFocus();
					self.disableKeyboardSupport();
					self.restoreKeyboardSupport();

					// remove listener on keydown in case of popup without focusable elements
					closingOnKeydown(self, false);

					//checking that current focused element is inside this popup
					activeElement = document.activeElement;
					popupElement = utilSelectors.getClosestByClass(activeElement, classes.popup);
					if (popupElement) {
						// blur any focused elements
						activeElement.blur();
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

			/**
			 * Refresh popup settings and body.
			 * This method sets header icon and custom popup colors in case custom popup is used.
			 * @method _refresh
			 * @protected
			 * @member ns.widget.tv.Popup
			 */
			prototype._refresh = function() {
				var element = this.element;

				if (typeof CorePopupPrototype._refresh === FUNCTION_TYPE) {
					CorePopupPrototype._refresh.call(this);
				}

				setHeaderIcon(this, element);
				setCustomPopupColors(this);
			};

			/**
			 * Show popup.
			 * @method _onShow
			 * @protected
			 * @member ns.widget.tv.Popup
			 */
			prototype._onShow = function () {
				var self = this,
					options = self.options;

				setCustomPopupColors(self);

				if (typeof CorePopupPrototype._onShow === FUNCTION_TYPE) {
					CorePopupPrototype._onShow.call(self);
				}

				// Auto-close popup after a defined timeout
				if (self.element.classList.contains(classes.notification) && options.timeout > 0) {
					self._notificationTimeout = setTimeout(self.close.bind(self), options.timeout);
				}
			};

			/**
			 * Clears notification timeout in case it was set
			 * @method _clearNotificationTimeout
			 * @protected
			 * @member ns.widget.tv.Popup
			 */
			prototype._clearNotificationTimeout = function () {
				var self = this;
				if (self._notificationTimeout) {
					clearTimeout(self._notificationTimeout);
					self._notificationTimeout = null;
				}
			};

			/**
			 * On popup hide.
			 * @method _onHide
			 * @protected
			 * @member ns.widget.tv.Popup
			 */
			prototype._onHide = function () {
				var self = this;

				if (typeof CorePopupPrototype._onHide === FUNCTION_TYPE) {
					CorePopupPrototype._onHide.call(self);
				}

				self._clearNotificationTimeout();
			};

			/**
			 * Destroys the widget, removes the header icon if was created before
			 * @method _destroy
			 * @protected
			 * @member ns.widget.tv.Popup
			 */
			prototype._destroy = function() {
				var self = this,
					ui = this._ui;

				if (ui.headerIcon) {
					ui.headerIcon.parentElement.removeChild(ui.headerIcon);
					ui.headerIcon = null;
				}

				// Clear timeout in case the destroy was triggered before closing popup
				self._clearNotificationTimeout();

					// @TODO reset styles to base

				self._destroyEventKey();
				if (typeof CorePopupPrototype._destroy === FUNCTION_TYPE) {
					CorePopupPrototype._destroy.call(self);
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
