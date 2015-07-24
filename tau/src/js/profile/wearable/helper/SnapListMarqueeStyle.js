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
		function () {//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				objectUtils = ns.util.object,
				defaults = {
					marqueeDelay: 0
				},

				SnapListMarqueeStyle = function (listDomElement, options) {
					var self = this;

					self.options = objectUtils.merge({}, defaults);
					self._snapListStyleHelper = null;
					self._selectedMarqueeWidget = null;
					self._callbacks = {};

					self.init(listDomElement, options);
				},

				prototype = SnapListMarqueeStyle.prototype;

			function destroyMarqueeWidget(self) {
				if (self._selectedMarqueeWidget) {
					self._selectedMarqueeWidget.destroy();
					self._selectedMarqueeWidget = null;
				}
			}

			function touchStartHandler() {
				destroyMarqueeWidget(this);
			}

			function selectedHandler(e) {
				var self = this,
					marquee = e.target.querySelector(".ui-marquee");

				destroyMarqueeWidget(self);

				if (marquee) {
					self._selectedMarqueeWidget = engine.instanceWidget(marquee, "Marquee", {
						delay: self.options.marqueeDelay,
						autoRun: false
					});
					self._selectedMarqueeWidget.start();
				}
			}

			prototype.init = function(listDomElement, options) {
				var self = this;

				objectUtils.fastMerge(self.options, options);

				self.bindEvents();
				// create SnapListStyle helper
				self._snapListStyleHelper = tau.helper.SnapListStyle.create(listDomElement);
			};

			prototype.bindEvents = function() {
				var self = this,
					touchStartCallback,
					selectedCallback;

				touchStartCallback = touchStartHandler.bind(self);
				selectedCallback = selectedHandler.bind(self);

				self._callbacks.touchStart = touchStartCallback;
				self._callbacks.selected = selectedCallback;

				document.addEventListener("touchstart", touchStartCallback, false);
				document.addEventListener("rotarydetent", touchStartCallback, false);
				document.addEventListener("selected", selectedCallback, false);
			};

			prototype.unbindEvents = function() {
				var self = this;

				document.removeEventListener("touchstart", self._callbacks.touchStart, false);
				document.removeEventListener("rotarydetent", self._callbacks.touchStart, false);
				document.removeEventListener("selected", self._callbacks.selected, false);

				self._callbacks.touchStart = null;
				self._callbacks.selected = null;
			};

			prototype.destroy = function() {
				var self = this;

				self.unbindEvents();
				destroyMarqueeWidget(self);
				self._snapListStyleHelper.destroy();

				self.options = null;
				self._snapListStyleHelper = null;
				self._selectedMarqueeWidget = null;
				self._callbacks = null;
			};

			SnapListMarqueeStyle.create = function(listDomElement, options) {
				return new SnapListMarqueeStyle(listDomElement, options);
			};

			ns.helper.SnapListMarqueeStyle = SnapListMarqueeStyle;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return SnapListMarqueeStyle;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
