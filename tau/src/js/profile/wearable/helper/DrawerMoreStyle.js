/*global window, define, ns */
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
/**
 * #DrawerMoreStyle Helper Script
 * Helper script using drawer, sectionChanger.
 * @class ns.helper.DrawerMoreStyle
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../helper",
			"../../../core/event",
			"../../../core/engine",
			"../../../core/util/object",
			"../../../core/util/selectors",
			"../widget/wearable/Drawer",
			"../widget/wearable/Selector",
			"../../../core/widget/BaseWidget"
		],
		function () {//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				objectUtils = ns.util.object,
				events = ns.event,
				selectors = ns.util.selectors,
				Drawer = ns.widget.wearable.Drawer,
				defaults = {
					more: ".ui-more",
					selector: ".ui-selector",
					handler: ".ui-handler"
				},
				classes = {
					page: "ui-page"
				},

				DrawerMoreStyle = function (element) {
					var self = this;

					self.options = objectUtils.merge({}, defaults);
					self._drawerWidget = null;
					self._handlerElement = null;
					self._selectorWidget = null;

					Drawer.call(self);
				},
				prototype = new Drawer();

			DrawerMoreStyle.prototype = prototype;

			function bindDragEvents(element) {
				events.on(element, "touchstart touchend mousedown mouseup" , this, false);
			}

			function unbindDragEvents(element) {
				events.off(element, "touchstart touchend mousedown mouseup" , this, false);
			}

			prototype.handleEvent = function(event) {
				var self = this;
				switch (event.type) {
					case "touchstart":
					case "mousedown":
						self._onTouchStart(event);
						break;
					case "touchend":
					case "mouseup":
						self._onTouchEnd(event);
						break;
				}
			};

			prototype._onTouchStart = function(event) {
				event.preventDefault();
				event.stopPropagation();
			};

			prototype._onTouchEnd = function(event) {
				this._drawerWidget.close();
			};

			prototype._init = function(element) {
				var self = this,
					pageElement = selectors.getClosestByClass(element, classes.page),
					handlerElement,
					selectorElement;

				Drawer.prototype._init.call(self, element);

				handlerElement = pageElement.querySelector(self.options.handler);
				selectorElement = element.querySelector(self.options.selector);

				if (handlerElement) {
					self._handlerElement = handlerElement;
				}
				if (selectorElement) {
					self._selectorWidget = ns.widget.Selector(selectorElement);
				}
			};

			prototype._bindEvents = function() {
				var self = this;

				if (self._handlerElement) {
					bindDragEvents.call(self, self._handlerElement);
				}
			};

			prototype._unbindEvents = function() {
				var self = this;

				if (self._handlerElement) {
					unbindDragEvents.call(self, self._handlerElement);
				}
			};

			prototype._destroy = function() {
				var self = this;

				if (self._handlerElement) {
					self._unbindEvents();
				}
				self._handlerElement = null;
				self._selectorWidget = null;
			};

			ns.helper.DrawerMoreStyle = DrawerMoreStyle;
			engine.defineWidget(
				"DrawerMoreStyle",
				".ui-drawermorestyle",
				[
					"transition",
					"setDragHandler",
					"open",
					"close",
					"isOpen",
					"getState"
				],
				DrawerMoreStyle,
				"circular"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return DrawerMoreStyle;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
