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
 * #SnapListMarqueeStyle Helper Script
 * Helper script using SnapListview and Marquee.
 * @class ns.helper.SnapListMarqueeStyle
 * @author Heeju Joo <heeju.joo@samsung.com>
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./SnapListStyle",
			"../helper",
			"../../../core/engine",
			"../../../core/util/object"
		],
		function () { //>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				objectUtils = ns.util.object,
				defaults = {
					marqueeDelay: 0,
					marqueeStyle: "slide",
					speed: 60,
					iteration: 1,
					timingFunction: "linear",
					ellipsisEffect: "gradient",
					runOnlyOnEllipsisText: true,
					autoRun: false
				},

				SnapListMarqueeStyle = function (listDomElement, options) {
					var self = this;

					self.options = objectUtils.merge({}, defaults);
					objectUtils.fastMerge(self.options, options);
					self._callbacks = {};

					if (window.tau.support.shape.circle) {
						self._snapListStyleHelper = null;
						self._selectedMarqueeWidget = null;
						self.initCircular(listDomElement);
					} else {
						self._lastMarqueeWidget = null;
						self.initRectangular();
					}
				},

				prototype = SnapListMarqueeStyle.prototype;

			function clickHandlerForRectangular(event) {
				var self = this,
					eventTarget = event.target,
					lastMarqueeWidget;

				if (self._lastMarqueeWidget) {
					lastMarqueeWidget = self._lastMarqueeWidget;
				}

				if (eventTarget.parentElement.id && lastMarqueeWidget &&
					eventTarget.parentElement.id === lastMarqueeWidget.id) {
					if (lastMarqueeWidget._state == "running") {
						lastMarqueeWidget.reset();
					} else {
						lastMarqueeWidget.start();
					}
				} else {
					if (lastMarqueeWidget && lastMarqueeWidget._ui) {
						lastMarqueeWidget.stop();
						lastMarqueeWidget.reset();
						lastMarqueeWidget.destroy();
					}

					if (eventTarget && eventTarget.classList.contains("ui-marquee")) {
						self._lastMarqueeWidget = new window.tau.widget.Marquee(eventTarget, self.options);
						self._lastMarqueeWidget.start();
					}
				}
			}

			function scrollHandlerForRectangular() {
				var	lastMarqueeWidget;

				if (this._lastMarqueeWidget) {
					lastMarqueeWidget = this._lastMarqueeWidget;
				}
				if (lastMarqueeWidget && lastMarqueeWidget._ui) {
					lastMarqueeWidget.stop();
					lastMarqueeWidget.reset();
					lastMarqueeWidget.destroy();
					lastMarqueeWidget = null;
				}
			}

			function destroyMarqueeWidget(self) {
				if (self._selectedMarqueeWidget) {
					self._selectedMarqueeWidget.destroy();
					self._selectedMarqueeWidget = null;
				}
			}

			function touchStartHandler() {
				if (this._selectedMarqueeWidget) {
					this._selectedMarqueeWidget.reset();
				}
			}

			function scrollEndHandler() {
				destroyMarqueeWidget(this);
			}

			function selectedHandler(e) {
				var self = this,
					marquee = e.target.querySelector(".ui-marquee");

				destroyMarqueeWidget(self);

				if (marquee) {
					self._selectedMarqueeWidget = engine.instanceWidget(marquee, "Marquee", self.options);
					self._selectedMarqueeWidget.start();
				}
			}

			prototype.initRectangular = function () {
				var self = this,
					clickCallbackForRectangular,
					scrollCallbackForRectangular;

				clickCallbackForRectangular = clickHandlerForRectangular.bind(self);
				scrollCallbackForRectangular = scrollHandlerForRectangular.bind(self);

				self._callbacks.click = clickHandlerForRectangular;
				self._callbacks.scroll = scrollHandlerForRectangular;

				document.addEventListener("click", clickCallbackForRectangular, false);
				document.addEventListener("scroll", scrollCallbackForRectangular, true);
			};

			prototype.initCircular = function (listDomElement) {
				var self = this;

				self.options.delay = self.options.delay || self.options.marqueeDelay;

				self.bindEvents();
				// create SnapListStyle helper
				self._snapListStyleHelper = ns.helper.SnapListStyle.create(listDomElement, self.options);
			};

			prototype.unbindEventsForRectangular = function () {
				var self = this;

				document.removeEventListener("click", self._callbacks.click, false);
				document.removeEventListener("scroll", self._callbacks.scroll, false);

				self._callbacks.click = null;
				self._callbacks.scroll = null;
			};

			prototype.bindEvents = function () {
				var self = this,
					touchStartCallback,
					scrollEndCallback,
					selectedCallback;

				touchStartCallback = touchStartHandler.bind(self);
				scrollEndCallback = scrollEndHandler.bind(self);
				selectedCallback = selectedHandler.bind(self);

				self._callbacks.touchStart = touchStartCallback;
				self._callbacks.scrollEnd = scrollEndCallback;
				self._callbacks.selected = selectedCallback;

				document.addEventListener("touchstart", touchStartCallback, false);
				document.addEventListener("scrollend", scrollEndCallback, false);
				document.addEventListener("rotarydetent", touchStartCallback, false);
				document.addEventListener("selected", selectedCallback, false);
			};

			prototype.unbindEventsForCircle = function () {
				var self = this;

				document.removeEventListener("touchstart", self._callbacks.touchStart, false);
				document.removeEventListener("scrollend", self._callbacks.scrollEnd, false);
				document.removeEventListener("rotarydetent", self._callbacks.touchStart, false);
				document.removeEventListener("selected", self._callbacks.selected, false);

				self._callbacks.touchStart = null;
				self._callbacks.selected = null;
			};

			prototype.destroy = function () {
				var self = this;

				if (ns.support.shape.circle) {
					self.unbindEventsForCircle();
				} else {
					self.unbindEventsForRectangular();
				}
				destroyMarqueeWidget(self);
				self._snapListStyleHelper.destroy();

				self.options = null;
				self._snapListStyleHelper = null;
				self._selectedMarqueeWidget = null;
				self._callbacks = null;
			};

			SnapListMarqueeStyle.create = function (listDomElement, options) {
				return new SnapListMarqueeStyle(listDomElement, options);
			};

			ns.helper.SnapListMarqueeStyle = SnapListMarqueeStyle;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return SnapListMarqueeStyle;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
