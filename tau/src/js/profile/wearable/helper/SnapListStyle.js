/*global window, define, ns */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #SnapListStyle Helper Script
 * Helper script using SnapListview.
 * @class ns.helper.SnapListStyle
 * @author Junyoung Park <jy-.park@samsung.com>
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../helper",
			"../../../core/engine",
			"../../../core/util/object",
			"../../../core/util/selectors"
		],
		function () {//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				objectUtils = ns.util.object,
				selectors = ns.util.selectors,

				SnapListStyle = function (listDomElement) {
					var self = this;

					self._snapListviewWidget = null;
					self._callbacks = {};
					self.init(listDomElement);
				},

				prototype = SnapListStyle.prototype;

			function rotaryDetentHandler(e) {
					var snapListviewWidget = this._snapListviewWidget,
						selectedIndex = snapListviewWidget.getSelectedIndex(),
						direction = e.detail.direction;

					if (direction === "CW" && selectedIndex !== null) {
						snapListviewWidget.scrollToPosition(selectedIndex + 1);
					} else if (direction === "CCW" && selectedIndex !== null) {
						snapListviewWidget.scrollToPosition(selectedIndex - 1);
					}
			}

			prototype.init = function(listDomElement) {
				var self = this;

				// create SnapListview widget
				self._snapListviewWidget = engine.instanceWidget(listDomElement, "SnapListview");
				self.bindEvents();
			};

			prototype.bindEvents = function() {
				var self = this,
					touchStartCallback,
					selectedCallback;

				rotaryDetentCallback = rotaryDetentHandler.bind(self);

				self._callbacks.rotarydetent = rotaryDetentCallback;

				window.addEventListener("rotarydetent", rotaryDetentCallback);
			};

			prototype.unbindEvents = function() {
				var self = this;

				window.removeEventListener("rotarydetent", self._callbacks.rotarydetent);

				self._callbacks.rotarydetent = null;
			};

			prototype.destroy = function() {
				var self = this;

				self.unbindEvents();
				self._snapListviewWidget.destroy();

				self._snapListviewWidget = null;
				self._callbacks = null;
			};

			prototype.getSnapList = function() {
				return this._snapListviewWidget;
			};

			SnapListStyle.create = function(listDomElement) {
				return new SnapListStyle(listDomElement);
			};

			ns.helper.SnapListStyle = SnapListStyle;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return SnapListStyle;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
