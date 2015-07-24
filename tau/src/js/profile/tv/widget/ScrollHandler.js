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
/*jslint nomen: true */
/**
 * # ScrollHandler Widget
 *
 * @class ns.widget.tv.ScrollHandler
 * @extends ns.widget.mobile.ScrollHandler
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/engine",
			"../../../core/util/object",
			"../../../core/util/DOM/css",
			"../../../core/widget/core/Scrollview",
			"../../../profile/mobile/widget/mobile/ScrollHandler"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				objectUtils = ns.util.object,
				BaseScrollHandler = ns.widget.mobile.ScrollHandler,
				CSSUtils = ns.util.DOM,
				Scrollview = ns.widget.core.Scrollview,
				BaseScrollHandlerPrototype = BaseScrollHandler.prototype,
				ScrollHandler = function () {
					var self = this;
					self._callbacks = {};
					BaseScrollHandler.call(self);
					self.options = objectUtils.merge(self.options, defaults);
				},
				classes = BaseScrollHandler.classes,
				defaults = objectUtils.merge({}, BaseScrollHandler.defaults, {
					delay: 5000,
					scrollIndicator: true
				}),
				FUNCTION_TYPE = "function",
				prototype = new BaseScrollHandler(),
				min = Math.min,
				floor = Math.floor;

			ScrollHandler.events = BaseScrollHandler.events;
			ScrollHandler.classes = classes;
			ScrollHandler.prototype = prototype;

			/**
			 * Translates objects position to a new position
			 * @param {ns.widget.tv.ScrollHandler} self
			 * @param {number} xOffset
			 * @param {number} yOffset
			 * @member ns.widget.tv.ScrollHandler
			 * @private
			 * @static
			 */
			function translate(self, xOffset, yOffset) {
				var style = null,
					translateString = null;

				if (self.options.handler) {
					translateString = "translate3d(" + (xOffset || 0) + "px, " + (yOffset || 0) + "px, 0px)";
					CSSUtils.setPrefixedStyle(self.ui.handle, "transform", translateString);
				}
			}

			/**
			 * Sets handler position according to scrollviews position
			 * @param {ns.widget.tv.ScrollHandler} self
			 * @member ns.widget.tv.ScrollHandler
			 * @private
			 * @static
			 */
			function syncHandleWithScroll(self) {
				var position = self.getScrollPosition(),
					offsets = self._offsets,
					direction = self.options.direction,
					x = floor(min(position.x, self._availableOffsetX) / self._availableOffsetX * offsets.maxX),
					y = floor(min(position.y, self._availableOffsetY) / self._availableOffsetY * offsets.maxY);

				if (isNaN(x) === true) {
					x = offsets.x;
				}

				if (isNaN(y) === true) {
					y = offsets.y;
				}

				translate(
					self,
						direction === "y" ? 0 : x,
						direction === "x" ? 0 : y
				);

				offsets.x = x;
				offsets.y = y;
			}

			/**
			 * Handles Focus on elements
			 * Focus will show scrollhandler when an element from container has been focused
			 * @param {ns.widget.tv.ScrollHandler}
			 * @param {MouseEvent|TouchEvent}
			 * @member ns.widget.tv.ScrollHandler
			 * @private
			 * @static
			 */
			function handleFocus(self, event) {
				var element = self.element,
					handler = self.ui.handler,
					view = element.querySelector("." + Scrollview.classes.view),
					viewHeight = CSSUtils.getElementHeight(view, "inner", true),
					clipHeight = CSSUtils.getElementHeight(element, "inner", true);

				if (self._dragging === false && clipHeight <= viewHeight) {
					syncHandleWithScroll(self);
					if (self._hideTimer) {
						clearTimeout(self._hideTimer);
					}
					handler.classList.add(classes.visible);
					self._hideTimer = setTimeout(function () {
						handler.classList.remove(classes.visible);
					}, self.options.delay);
				}
			}

			/**
			 * Builds widget
			 * @method _build
			 * @param {HTMLElement} element Element of widget
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.tv.ScrollHandler
			 */
			prototype._build = function (element) {
				element = BaseScrollHandlerPrototype._build.call(this, element);
				element.style.minWidth = "";

				return element;
			};

			/**
			 * Corects view width and paddings
			 * @member ns.widget.tv.ScrollHandler
			 * @private
			 * @static
			 */
			prototype._setProperWidth = function () {
				var self = this,
					element = self.element,
					view = self._ui.view,
					contentStyle = window.getComputedStyle(element),
					width = parseFloat(contentStyle.width),
					paddingLeft = parseFloat(contentStyle.paddingLeft),
					paddingRight = parseFloat(contentStyle.paddingRight);
				view.style.width = Math.floor(width - paddingLeft - paddingRight) + "px";
			};

			/**
			 * Init the scrollhander and scrollview
			 * @param {HTMLElement} element
			 * @method _init
			 * @protected
			 * @member ns.widget.tv.ScrollHandler
			 */
			prototype._init = function (element) {
				element = BaseScrollHandlerPrototype._init.call(this, element);
				this._setProperWidth();
				return element;
			};

			/**
			 * Binds the scrollhander and scrollview events
			 * @param {HTMLElement} element
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.tv.ScrollHandler
			 */
			prototype._bindEvents = function (element) {
				var self = this,
					callbacks = self._callbacks;

				BaseScrollHandlerPrototype._bindEvents.call(self, element);

				callbacks.focus = handleFocus.bind(null, self);

				element.addEventListener("focus", callbacks.focus, true);
			};

			/**
			 * Destroys the scrollhander and scrollview DOM
			 * @method _destroy
			 * @protected
			 * @member ns.widget.tv.ScrollHandler
			 */
			prototype._destroy = function (element) {
				var callbacks = this._callbacks;
				if (typeof BaseScrollHandlerPrototype._destroy === FUNCTION_TYPE) {
					BaseScrollHandlerPrototype._destroy.call(this);
				}
				element.removeEventListener("focus", callbacks.focus, true);
			};

			// definition
			ns.widget.tv.ScrollHandler = ScrollHandler;

			engine.defineWidget(
				"ScrollHandler",
				".ui-content:not([data-scroll='none']):not(.ui-scrollview-clip):not(.ui-scrolllistview),[data-handler='true'], .ui-scrollhandler",
				[
					"enableHandler",
					"scrollTo",
					"ensureElementIsVisible",
					"centerToElement",
					"getScrollPosition",
					"skipDragging",
					"translateTo"
				],
				ScrollHandler,
				"tv",
				true
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.ScrollHandler;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));