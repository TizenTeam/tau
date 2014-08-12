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
			"../../../profile/wearable/widget/wearable/Popup",
			"../../../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var WearablePopup = ns.widget.wearable.Popup,
				WearablePopupPrototype = WearablePopup.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				classes = WearablePopup.classes,
				Popup = function () {
					WearablePopup.call(this);
					BaseKeyboardSupport.call(this);
				},
				engine = ns.engine,
				selectors = {
					header: "header",
					content: "div",
					footer: "footer"
				},
				prototype = new WearablePopup(),
				FUNCTION_TYPE = "function";

			Popup.events = WearablePopup.events;

			classes.popup = "ui-popup";
			classes.headerEmpty = "ui-header-empty";
			classes.footerEmpty = "ui-footer-empty";

			Popup.classes = classes;

			Popup.selectors = selectors;

			Popup.prototype = prototype;

			prototype._configure = function() {
				var options = this.options;
				options.minScreenHeigth = null;
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
				var ui = this.ui,
					options = this.options,
					header = element.querySelector(selectors.header),
					content = element.querySelector(selectors.content),
					footer = element.querySelector(selectors.footer),
					elementChildren = element.children,
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
				}
				content.classList.add(classes.content);

				if (header || (options.header && typeof options.header !== "boolean")) {
					if (!header) {
						//if header does not exist, it is created
						header = document.createElement(selectors.header);
						header.innerHTML = options.header;
						element.insertBefore(header, content);
					}
					header.classList.add(classes.header);
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
					footer.classList.add(classes.footer);
				} else {
					element.classList.add(classes.footerEmpty);
				}

				ui.header = header;
				ui.content = content;
				ui.footer = footer;

				return element;
			};

			prototype._init = function(element) {
				var ui = this.ui;
				if (typeof WearablePopupPrototype._init === FUNCTION_TYPE) {
					WearablePopupPrototype._init.call(this, element);
				}
				this._pageWidget = engine.instanceWidget(element.parentElement, "page");
				ui.header = element.querySelector(selectors.header);
				ui.content = element.querySelector(selectors.content);
				ui.footer = element.querySelector(selectors.footer);
			};

			prototype.open = function(options) {
				var self = this,
					page = self._pageWidget,
					autoFocus = options.autofocus;
				if (typeof WearablePopupPrototype.open === FUNCTION_TYPE) {
					WearablePopupPrototype.open.apply(self, arguments);
				}
				self.enableKeyboardSupport();
				page.blur();
				page.disableKeyboardSupport();
				if (autoFocus || autoFocus===0) {
					self.focus(autoFocus);
				}
			};

			prototype.close = function() {
				if (typeof WearablePopupPrototype.close === FUNCTION_TYPE) {
					WearablePopupPrototype.close.apply(this, arguments);
				}
				this.disableKeyboardSupport();
				this._pageWidget.enableKeyboardSupport();
			};

			prototype._bindEvents = function() {
				if (typeof WearablePopupPrototype._bindEvents === FUNCTION_TYPE) {
					WearablePopupPrototype._bindEvents.call(this);
				}
				this._bindEventKey();
			};

			prototype._destroy = function() {
				this._destroyEventKey();
				if (typeof WearablePopupPrototype._destroy === FUNCTION_TYPE) {
					WearablePopupPrototype._destroy.call(this);
				}
			};

			// definition
			ns.widget.tv.Page = Popup;

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
