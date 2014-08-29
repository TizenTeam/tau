/*global window, define */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
*
* Licensed under the Flora License, Version 1.1 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://floralicense.org/license/
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
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
			"../../../profile/mobile/widget/mobile/Popup",
			"../../../core/engine",
			"../../../core/event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var MobilePopup = ns.widget.mobile.Popup,
				MobilePopupPrototype = MobilePopup.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				classes = MobilePopup.classes,
				Popup = function () {
					MobilePopup.call(this);
					BaseKeyboardSupport.call(this);
				},
				engine = ns.engine,
				/**
				* @property {Object} events Alias for class ns.event
				* @member ns.widget.tv.Popup
				* @private
				*/
				events = ns.event,
				selectors = {
					header: "header",
					content: "div",
					footer: "footer"
				},
				prototype = new MobilePopup(),
				FUNCTION_TYPE = "function";

			Popup.events = MobilePopup.events;

			classes.toast = "ui-popup-toast";
			classes.headerEmpty = "ui-header-empty";
			classes.footerEmpty = "ui-footer-empty";
			classes.content = "ui-popup-content";

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
				var options = this.options,
					header = element.querySelector(selectors.header),
					content = element.querySelector(selectors.content),
					footer = element.querySelector(selectors.footer),
					elementChildren = element.children,
					length = elementChildren.length,
					i,
					node;

				element.classList.add(classes.uiPopup);

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
				}
				content.classList.add(classes.content);

				if (header || (options.header && typeof options.header !== "boolean")) {
					if (!header) {
						//if header does not exist, it is created
						header = document.createElement(selectors.header);
						header.innerHTML = options.header;
						element.insertBefore(header, content);
					}
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
				} else {
					element.classList.add(classes.footerEmpty);
				}

				if (typeof MobilePopupPrototype._build === FUNCTION_TYPE) {
					MobilePopupPrototype._build.apply(this, arguments);
				}

				return element;
			};

			/**
			 * Set the state of the popup
			 * @method _setActive
			 * @param {boolean} active
			 * @param {Object} options
			 * @protected
			 * @member ns.widget.wearable.Popup
			 */
			prototype._setActive = function (active, options) {
				var activeClass = classes.uiPopupActive,
					elementCls = this.element.classList,
					route = ns.engine.getRouter().getRoute("popup");
				if (active) {
					// set global variable
					route.setActive(this, options);
					// add proper class
					elementCls.add(activeClass);
				} else {
					// no popup is opened, so set global variable on "null"
					route.setActive(null, options);
					// remove proper class
					elementCls.remove(activeClass);
				}

				this.active = elementCls.contains(activeClass);
			};

			prototype._init = function(element) {
				if (typeof MobilePopupPrototype._init === FUNCTION_TYPE) {
					MobilePopupPrototype._init.call(this, element);
				}
				if (element.classList.contains(classes.toast)) {
					this._ui.container.classList.add(classes.toast);
				}
				this._pageWidget = engine.instanceWidget(element.parentElement.parentElement, "page");
			};

			function checkLink(options) {
				var link = options && options.link,
					linkElement = options && document.getElementById(link);

				if (linkElement && linkElement.getAttribute("data-role") !== "button") {
					options.link = null;
				}
			}

			/**
			* Animation's callback on completed opening
			* @method _openPrereqsComplete
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			prototype._openPrereqsComplete = function() {
				var self = this,
					container = self._ui.container;

				container.classList.add(Popup.classes.uiPopupActive);
				self._isOpen = true;
				self._isPreOpen = false;

				// Android appears to trigger the animation complete before the popup
				// is visible. Allowing the stack to unwind before applying focus prevents
				// the "blue flash" of element focus in android 4.0
				setTimeout(function(){
					container.setAttribute("tabindex", "0");
					events.trigger(self.element, "popupafteropen");
				});
			};

			prototype._setKeyboardSupport = function (options) {
				var self = this,
					autoFocus = options.autofocus,
					page = self._pageWidget;

				if (self._getActiveLinks().length) {
					// if there are links inside popup, we enable keyboard support on page
					// and enable in popup
					self.enableKeyboardSupport();
					page.blur();
					page.disableKeyboardSupport();

					if (autoFocus || autoFocus === 0) {
						self.focus(autoFocus);
					}
				}
			};

			prototype.open = function(options) {
				var self = this;

				if (!self._isOpen) {
					checkLink(options);

					if (typeof MobilePopupPrototype.open === FUNCTION_TYPE) {
						MobilePopupPrototype.open.apply(self, arguments);
					}

					options = options || {};

					//TODO after transition
					self._setActive(true, options);

					self._setKeyboardSupport(options);

				}
			};

			prototype.close = function(options) {
				if (this._isOpen) {
					if (typeof MobilePopupPrototype.close === FUNCTION_TYPE) {
						MobilePopupPrototype.close.apply(this, arguments);
					}

					//TODO after transition
					this._setActive(false, options || {});

					this.disableKeyboardSupport();
					this._pageWidget.enableKeyboardSupport();
				}
			};

			prototype._bindEvents = function() {
				if (typeof MobilePopupPrototype._bindEvents === FUNCTION_TYPE) {
					MobilePopupPrototype._bindEvents.call(this);
				}
				this._bindEventKey();
			};

			prototype._destroy = function() {
				this._destroyEventKey();
				if (typeof MobilePopupPrototype._destroy === FUNCTION_TYPE) {
					MobilePopupPrototype._destroy.call(this);
				}
			};

			// definition
			ns.widget.tv.Page = Popup;

			engine.defineWidget(
				"Popup",
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
