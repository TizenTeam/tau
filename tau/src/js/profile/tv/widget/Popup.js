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
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				utilSelectors = ns.util.selectors,
				objectUtils = ns.util.object,
				CorePopup = ns.widget.core.ContextPopup,
				CorePopupPrototype = CorePopup.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				Popup = function () {
					var self = this;

					CorePopup.call(self);
					BaseKeyboardSupport.call(self);

					self.options = objectUtils.merge(self.options, defaults);
					self.selectors = selectors;
				},
				defaults = objectUtils.merge({}, CorePopup.defaults, {
					arrow: "t,b,l,r",
					distance: 10
				}),
				classes = objectUtils.merge({}, CorePopup.classes, {
					toast: "ui-popup-toast",
					headerEmpty: "ui-header-empty",
					footerEmpty: "ui-footer-empty",
					content: "ui-popup-content"
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
				page = utilSelectors.getClosestByClass(element, ns.widget.tv.Page.classes.uiPage);
				this._pageWidget = engine.getBinding(page, "page");
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

					self._setKeyboardSupport(options || {});
				}
			};

			prototype.close = function() {
				if (this._isOpened()) {
					if (typeof CorePopupPrototype.close === FUNCTION_TYPE) {
						CorePopupPrototype.close.apply(this, arguments);
					}

					this.disableKeyboardSupport();
					this._pageWidget.enableKeyboardSupport();

					closingOnKeydown(this, false);
				}
			};

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
