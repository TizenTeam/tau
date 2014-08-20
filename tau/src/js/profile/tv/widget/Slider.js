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
/*jslint nomen: true */
/*
 * @class ns.widget.tv.Slider
 * @extends ns.widget.mobile.Slider
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../profile/mobile/widget/mobile/TizenSlider",
			"../../../core/engine",
			"../../../core/event",
			"../../../core/theme",
			"../../../core/util/selectors",
			"./BaseKeyboardSupport",
			"../tv"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseSlider = ns.widget.mobile.TizenSlider,
				BaseSliderPrototype = BaseSlider.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				Slider = function () {
					var self = this;
					BaseSlider.call(self);
					BaseKeyboardSupport.call(self);
					self._pageWidget = null;
					self._callbacks = {};
				},
				classes = BaseSlider.classes,
				selectors = ns.util.selectors,
				events = ns.event,
				engine = ns.engine,
				FUNCTION_TYPE = "function",
				prototype = new BaseSlider(),
				KEY_CODES = {
					left: 37,
					up: 38,
					right: 39,
					down: 40
				};

			Slider.classes = classes;
			Slider.prototype = prototype;

			function showPopup(self) {
				if (self.options.popup) {
					self._updateSlider();
					self._showPopup();
				}
			}

			function hidePopup(self) {
				self._closePopup();
			}

			function onKeyup(self, event) {
				var keyCode = event.keyCode;

				switch (keyCode) {
					case KEY_CODES.up:
					case KEY_CODES.down:
						self._pageWidget.enableKeyboardSupport();
						hidePopup(self);
						break;
					case KEY_CODES.left:
					case KEY_CODES.right:
						self._pageWidget.disableKeyboardSupport();
						showPopup(self);
						break;
				}
			}

			function onKeydown(event) {
				switch (event.keyCode) {
					case KEY_CODES.up:
					case KEY_CODES.down:
						event.preventDefault();
						event.stopPropagation();
						break;
				}
			}

			prototype._init = function(element) {
				var pageElement = selectors.getClosestByClass(element, "ui-page");

				if (typeof BaseSliderPrototype._init === FUNCTION_TYPE) {
					BaseSliderPrototype._init.call(this, element);
				}
				this._pageWidget = ns.engine.getBinding(pageElement);
			};

			prototype._bindEvents = function(element) {
				var callbacks = this._callbacks;

				if (typeof BaseSliderPrototype._bindEvents === FUNCTION_TYPE) {
					BaseSliderPrototype._bindEvents.call(this, element);
				}

				callbacks.onKeyup = onKeyup.bind(null, this);
				callbacks.onKeydown = onKeydown;

				document.addEventListener("keyup", this, false);
				this._ui.container.addEventListener("keyup", callbacks.onKeyup, false);
				this._ui.container.addEventListener("keydown", callbacks.onKeydown, true);
			};

			prototype._destroy = function() {
				var callbacks = this._callbacks;

				document.removeEventListener("keyup", this, false);
				this._ui.container.removeEventListener("keyup", callbacks.onKeyup, false);
				this._ui.container.removeEventListener("keydown", callbacks.onKeydown, false);

				if (typeof BaseSliderPrototype._destroy === FUNCTION_TYPE) {
					BaseSliderPrototype._destroy.call(this);
				}
			};


			// definition
			ns.widget.tv.Slider = Slider;

			engine.defineWidget(
				"TizenSlider",
				"input[type='range'], :not(select)[data-role='slider'], :not(select)[data-type='range']",
				[],
				Slider,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Slider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
