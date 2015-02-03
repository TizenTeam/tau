/*global window, define, ns */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #ListMarqueeStyle Helper Script
 * Helper script using SnapListview and Marquee.
 * @class ns.helper.ListMarqueeStyle
 * @author Heeju Joo <heeju.joo@samsung.com>
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
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

				ListMarqueeStyle = function (listDomElement, options) {
					var self = this;

					self.options = objectUtils.merge({}, defaults);
					self._snapListviewWidget = null;
					self._selectedMarqueeWidget = null;
					self._callbacks = {};


					self.init(listDomElement, options);
				},

				prototype = ListMarqueeStyle.prototype;

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
				var self = this;
				destroyMarqueeWidget(self);
				self._selectedMarqueeWidget = engine.instanceWidget(e.target.querySelector(".ui-marquee"), "Marquee", {
					delay: self.options.marqueeDelay,
					autoRun: false
				});
				self._selectedMarqueeWidget.start();
			}

			prototype.init = function(listDomElement, options) {
				var self = this;

				objectUtils.fastMerge(self.options, options);

				// create SnapListview widget
				self._snapListviewWidget = engine.instanceWidget(listDomElement, "SnapListview");
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
				self._snapListviewWidget.destroy();

				self.options = null;
				self._snapListviewWidget = null;
				self._selectedMarqueeWidget = null;
				self._callbacks = null;
			};

			ListMarqueeStyle.create = function(listDomElement, options) {
				return new ListMarqueeStyle(listDomElement, options);
			};

			ns.helper.ListMarqueeStyle = ListMarqueeStyle;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ListMarqueeStyle;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
