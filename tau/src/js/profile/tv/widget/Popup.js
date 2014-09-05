/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
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
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
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
				/**
				 * @property {Object} events Alias for class ns.event
				 * @member ns.widget.tv.Popup
				 * @private
				 */
				events = ns.event,
				objectUtils = ns.util.object,
				CorePopup = ns.widget.core.ContextPopup,
				CorePopupPrototype = CorePopup.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				Popup = function () {
					var self = this;
					self._ui = {};

					CorePopup.call(self);
					BaseKeyboardSupport.call(self);
				},
				classes = objectUtils.merge({}, CorePopup.classes, {
					toast: "ui-popup-toast",
					headerEmpty: "ui-header-empty",
					footerEmpty: "ui-footer-empty",
					content: "ui-popup-content",
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

			Popup.selectors = selectors;

			Popup.prototype = prototype;

			/**
			 * Build the popup DOM tree
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.tv.Popup
			 */
			prototype._build = function ( element) {
				var ui = this._ui,
					options = this.options,
					header = element.querySelector(selectors.header),
					content = element.querySelector(selectors.content),
					footer = element.querySelector(selectors.footer),
					elementChildren = element.childNodes,
					length = elementChildren.length,
					i,
					node;

				element.classList.add(classes.popup);

				if (!content) {
					//if content does not exist, it is created
					content = document.createElement(selectors.content);
					for (i = 0; i < length; ++i) {
						node = elementChildren[i];
						if (node !== footer && node !== header) {
							content.appendChild(elementChildren[i]);
						}
					}
					element.appendChild(content);
					ui.content = content;
				}
				content.classList.add(classes.content);

				if (header || (options.header && typeof options.header !== "boolean")) {
					if (!header) {
						//if header does not exist, it is created
						header = document.createElement(selectors.header);
						header.innerHTML = options.header;
						element.insertBefore(header, content);
					}
					ui.header = header;
				} else {
					element.classList.add(classes.headerEmpty);
				}

				if (footer || (options.footer && typeof options.footer !== "boolean")) {
					if (!footer) {
						//if footer does not exist, it is created
						footer = document.createElement(selectors.footer);
						footer.innerHTML = options.footer;
						element.appendChild(footer);
					}
					ui.footer = footer;
				} else {
					element.classList.add(classes.footerEmpty);
				}

				if (typeof CorePopupPrototype._build === FUNCTION_TYPE) {
					CorePopupPrototype._build.apply(this, arguments);
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
					self._onClickBound.call(self, event);
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
					autoFocus = options.autofocus,
					page = self._pageWidget,
					toastPopup = self.element.classList.contains(classes.toast);

				if (self._getActiveLinks().length || toastPopup) {
					// if there are links inside popup, we enable keyboard support on page
					// and enable in popup
					self.enableKeyboardSupport();
					page.blur();
					page.disableKeyboardSupport();

					if (autoFocus || autoFocus === 0) {
						self.focus(autoFocus);
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
			}

			prototype.open = function(options) {
				var self = this;

				if (!self._isActive()) {

					if (typeof CorePopupPrototype.open === FUNCTION_TYPE) {
						CorePopupPrototype.open.apply(self, arguments);
					}

					self._setKeyboardSupport(options);
				}
			};

			prototype.close = function(options) {
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
				"popup",
				"[data-role='popup'], .ui-popup",
				["setActive", "show", "hide", "open", "close"],
				Popup,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
