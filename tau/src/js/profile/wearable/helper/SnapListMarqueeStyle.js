/*global window, define, ns */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
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

				// create SnapListStyle helper
				self._snapListStyleHelper = tau.helper.SnapListStyle.create(listDomElement);
				self.bindEvents();
			};

			prototype.bindEvents = function() {
				var self = this,
					touchStartCallback,
					selectedCallback;

				touchStartCallback = touchStartHandler.bind(self);
				selectedCallback = selectedHandler.bind(self);

				self._callbacks.touchStart = touchStartCallback;
				self._callbacks.selected = selectedCallback;

				document.addEventListener("touchstart", touchStartCallback);
				document.addEventListener("selected", selectedCallback);
			};

			prototype.unbindEvents = function() {
				var self = this;

				document.removeEventListener("touchstart", self._callbacks.touchStart);
				document.removeEventListener("selected", self._callbacks.selected);

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
