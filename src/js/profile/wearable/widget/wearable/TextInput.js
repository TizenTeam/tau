/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
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
/*global window, define, ns*/
/**
 * #TextInput Widget
 *
 * @class ns.widget.wearable.TextInput
 * @since 4.0
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilEvent = ns.event,
				selectors = ns.util.selectors,

				TextInput = function () {
					var self = this;

					self._initialWindowHeight = null;
					self._hasFocus = false;
				},

				prototype = new BaseWidget();

			TextInput.events = {};

			/**
			 * Build TextInput
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.TextInput
			 */
			prototype._build = function (element) {
				this._initialWindowHeight = window.innerHeight;

				return element;
			};

			prototype._init = function (element) {
				return element;
			};

			prototype._bindEvents = function (element) {
				var self = this;

				utilEvent.on(element, "focus", self, true);
				utilEvent.on(element, "blur", self, true);
				utilEvent.on(window, "resize", self, true);
			};

			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "focus":
						self._onFocus(event);
						break;
					case "blur":
						self._onBlur(event);
						break;
					case "resize":
						self._onWindowResize(event);
						break;
				}
			};

			prototype._onFocus = function () {
				this._hasFocus = true;
			};

			prototype._onWindowResize = function () {
				var self = this,
					element = self.element,
					pageElement = selectors.getClosestBySelector(element, ".ui-page"),
					scrollerElement = selectors.getClosestBySelector(element, ".ui-scroller"),
					footerElement = pageElement.querySelector(".ui-footer"),
					footerStyle = footerElement.style,
					elementRect = element.getBoundingClientRect(),
					currentWindowHeight = window.innerHeight;

				if (currentWindowHeight !== self._initialWindowHeight) {
					if (footerElement) {
						footerStyle.display = "none";
					}
					if (self._hasFocus) {
						scrollerElement.scrollTop = elementRect.top - elementRect.height;
					}
				} else {
					if (footerElement) {
						footerStyle.display = "flex";
					}
				}
			};

			prototype._onBlur = function () {
				this._hasFocus = false;
			};

			TextInput.prototype = prototype;
			ns.widget.wearable.TextInput = TextInput;

			engine.defineWidget(
				"TextInput",
				"input",
				[],
				TextInput,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.TextInput;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
