/*global window:false, HTMLElement:false, define:false */
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
 * Layout widget based on DOM elements.
 *
 * @class ns.widget.core.LayoutDOMWidget
 * @extends ns.widget.core.LayoutWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util",
			"./LayoutWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var LayoutWidget = ns.widget.core.LayoutWidget,
				CLASSES_PREFIX = "ui-layout",
				classes = {
					layout: CLASSES_PREFIX
				},
				prototype = new LayoutWidget(),

				LayoutDOMWidget = function () {
					LayoutWidget.call(this);
				};

			LayoutDOMWidget.classes = classes;

			/**
			 * Appends DOM based container
			 * @param {HTMLElement} container
			 */
			prototype._appendUIContainer = function (container) {
				if (this.element &&
						container instanceof HTMLElement) {
					this.element.appendChild(container);
				}
			};

			// removes DOM based widgets for DOM tree
			prototype._removeUIContainer = function (child) {
				if (this.element) {
					this.element.removeChild(child.element);
				}
			};

			/**
			 * Return widget width
			 * @returns {number}
			 */
			prototype._getWidth = function () {
				var container = this.getContainer();
				if (container) {
					return container.offsetWidth;
				}
				return 0;
			};

			/**
			 * Return widget height
			 * @returns {number}
			 */
			prototype._getHeight = function () {
				var container = this.getContainer();
				if (container) {
					return container.offsetHeight;
				}
				return 0;
			};

			function setStyle(element, property, value) {
				if (ns.util.isNumber(value)) {
					value = value + "px";
				}
				if (typeof value === "string") {
					element.style[property] = value;
				} else {
					ns.warn("not supported value");
				}
			}

			/**
			 * Sets widget height
			 * @returns {number}
			 */
			prototype._setHeight = function (height) {
				var container = this.getContainer();
				if (container) {
					setStyle(container, "height", height);
				}
			};

			/**
			 * Sets widget width
			 * @returns {number}
			 */
			prototype._setWidth = function (width) {
				var container = this.getContainer();
				if (container) {
					setStyle(container, "width", width);
				}
			};

			/**
			 * Sets widget position
			 * @param {number|string} left
			 * @param {number|string} top
			 * @returns {number}
			 */
			prototype._setPosition = function (left, top) {
				var container = this.getContainer();
				if (container) {
					setStyle(container, "left", left);
					setStyle(container, "top", top);
				}
			};

			/**
			 * Gets widget position
			 * @returns {Object}
			 */
			prototype._getPosition = function () {
				var container = this.getContainer();
				if (container) {
					return container.getBoundingClientRect();
				}
			};

			/**
			 * Return widget client width
			 * @returns {number}
			 */
			prototype._getClientWidth = function () {
				var container = this.getContainer();
				if (container) {
					return container.getBoundingClientRect().width;
				}
				return 0;
			};

			/**
			 * Return widget client height
			 * @returns {number}
			 */
			prototype._getClientHeight = function () {
				var container = this.getContainer();
				if (container) {
					return container.getBoundingClientRect().height;
				}
				return 0;
			};

			LayoutDOMWidget.prototype = prototype;
			ns.widget.core.LayoutDOMWidget = LayoutDOMWidget;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.LayoutDOMWidget;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));