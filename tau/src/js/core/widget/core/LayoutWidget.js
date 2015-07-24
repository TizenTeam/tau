/*global define, ns, window:false, HTMLElement:false, Object:false*/
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
/*jslint nomen: true */
/*
 * ## JavaScript API
 *
 * Layout widget.
 *
 * @class ns.widget.core.Layout
 * @extends ns.widget.core.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				prototype = new BaseWidget(),
				slice = [].slice,
				/**
				 * Property with string represent function type
				 * (for better minification)
				 * @property {string} [TYPE_FUNCTION="function"]
				 * @private
				 * @static
				 * @readonly
				 */
				TYPE_FUNCTION = "function",

				LayoutWidget = function () {
					this.options = {};
				};

			prototype.layout = function () {
				var self = this,
					child,
					len,
					i;

				if (typeof self._layout === TYPE_FUNCTION) {
					self._layout(self.element);
				}
				// call layout method on children
				if (Array.isArray(self._children)) {
					for (i = 0, len = self._children.length; i < len; i++) {
						child = self._children[i];
						if (typeof child.layout === TYPE_FUNCTION) {
							child.layout();
						}
					}
				}
			};

			function createWidget(component) {
				if (!component.parentNode) {
					document.createDocumentFragment()
						.appendChild(component);
				}
				engine.createWidgets(component.parentNode);
				return engine.getBinding(component);
			}

			/**
			 * Appends a widget to layout widget
			 * @param {type} widget
			 */
			prototype._appendWidget = function (widget) {
				var self = this;
				if (!self.hasOwnProperty('_children')) {
					self._children = {};
				}

				if (widget instanceof BaseWidget &&
						self._children[widget.id] === undefined) {
					self._children[widget.id] = widget;
					return true;
				}
				return false;
			};

			/**
			 * Appends component to layout widget
			 * @param {BaseWidget|HTMLElement} component
			 */
			prototype._appendComponent = function (component) {
				var self = this,
					widget = (component instanceof HTMLElement) ?
						createWidget(component) :
						component;

				if (self._appendWidget(widget)) {
					if (typeof self._appendUIContainer === TYPE_FUNCTION) {
						self._appendUIContainer(widget.getContainer());
					}
				}
			};

			/**
			 * Append component as child
			 * (widget or widgets or HTML element which will be widget)
			 * @method append
			 * @param {BaseWidget|[BaseWidget]|HTMLElement|[HTMLElement]} widget
			 * @member ns.widget.core.LayoutWidget
			 */
			prototype.append = function (widget) {
				var i, len, self = this;

				if (!Array.isArray(widget)) {
					widget = [widget];
				}
				for (i = 0, len = widget.length; i < len; i++) {
					self._appendComponent(widget[i]);
				}

				// @TODO do we need to call .layout method after every .append
				self.layout();
			};

			prototype.remove = function (widget) {
				var self = this,
					children;

				if (typeof self._children === "object") {
					children = {};
					slice.call(self._children).forEach(function (child) {
						if (widget === child) {
							if (typeof self._removeUIContainer === TYPE_FUNCTION) {
								self._removeUIContainer(child);
							}
						} else {
							children[widget.id] = widget;
						}
					});
					self._children = children;
				}
			};

			prototype.getClientWidth = function () {
				var self = this;
				if (typeof self._getClientWidth === TYPE_FUNCTION) {
					return self._getClientWidth();
				}
				return 0;
			};

			prototype.getClientHeight = function () {
				var self = this;
				if (typeof self._getClientHeight === TYPE_FUNCTION) {
					return self._getClientHeight();
				}
				return 0;
			};

			prototype.getWidth = function () {
				var self = this;
				if (typeof self._getWidth === TYPE_FUNCTION) {
					return self._getWidth();
				}
				return 0;
			};

			prototype.getHeight = function () {
				var self = this;
				if (typeof self._getHeight === TYPE_FUNCTION) {
					return self._getHeight();
				}
				return 0;
			};

			prototype.getChildrenCount = function () {
				var self = this;

				if (typeof self._children === "object") {
					return Object.keys(self._children).length;
				}
				return 0;
			};

			prototype.setWidth = function (width) {
				var self = this;
				if (typeof self._setWidth === TYPE_FUNCTION) {
					return self._setWidth(width);
				}
			};

			prototype.setHeight = function (height) {
				var self = this;
				if (typeof self._setHeight === TYPE_FUNCTION) {
					return self._setHeight(height);
				}
			};

			prototype.setPosition = function (left, top) {
				var self = this;
				if (typeof self._setPosition === TYPE_FUNCTION) {
					return self._setPosition(left, top);
				}
			};

			prototype.getPosition = function () {
				var self = this;
				if (typeof self._getPosition === TYPE_FUNCTION) {
					return self._getPosition();
				}
			};

			LayoutWidget.prototype = prototype;
			ns.widget.core.LayoutWidget = LayoutWidget;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.LayoutWidget;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));