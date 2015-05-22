/*global window, define, ns */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
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
			"../../../core/widget/core/viewswitcher/ViewSwitcher"
		],
		function () {//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				objectUtils = ns.util.object,
				events = ns.event,
				selectors = ns.util.selectors,
				Drawer = ns.widget.wearable.Drawer,
				ViewSwitcher = ns.widget.core.ViewSwitcher,
				defaults = {
					more: ".ui-more",
					viewSwitcher: ".ui-view-switcher"
				},
				classes = {
					page: "ui-page"
				},

				DrawerMoreStyle = function (element, options) {
					var self = this;

					self.options = objectUtils.merge({}, defaults);
					self._drawerWidget = null;
					self._handlerElement = null;
					self._viewSwitcherWidget = null;

					self.init(element, options);
				},

				prototype = DrawerMoreStyle.prototype;

			function bindDragEvents(element) {

				events.on(element, "touchstart touchend mousedown mouseup" , this, false);
			}

			function unBindDragEvents(element) {

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
				this._drawerWidget.transition(60);
				event.preventDefault();
				event.stopPropagation();
			};

			prototype._onTouchEnd = function(event) {
				this._drawerWidget.close();
			};

			prototype.init = function(element, options) {
				var self = this,
					pageElement = selectors.getClosestByClass(element, classes.page),
					handlerElement,
					viewSwitcherElement;

				objectUtils.fastMerge(self.options, options);

				handlerElement = pageElement.querySelector(self.options.handler);
				viewSwitcherElement = element.querySelector(self.options.viewSwitcher);

				self._drawerWidget = engine.instanceWidget(element, "Drawer");
				if (handlerElement) {
					self._drawerWidget.setDragHandler(handlerElement);
					self._handlerElement = handlerElement;
					self._bindEvents();
				}
				if (viewSwitcherElement) {
					self._viewSwitcherWidget = engine.instanceWidget(viewSwitcherElement, "ViewSwitcher", self.options);
				}
			};

			prototype._bindEvents = function() {
				var self = this;

				bindDragEvents.call(self, self._handlerElement);
			};

			prototype._unbindEvents = function() {
				var self = this;

				unBindDragEvents.call(self, self._handlerElement);
			};

			prototype.destroy = function() {
				var self = this;

				if (self._handlerElement) {
					self._unbindEvents();
				}
				self._drawerWidget = null;
				self._handlerElement = null;
				self._viewSwitcherWidget = null;
			};

			DrawerMoreStyle.create = function(element, options) {
				return new DrawerMoreStyle(element, options);
			};

			ns.helper.DrawerMoreStyle = DrawerMoreStyle;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return DrawerMoreStyle;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
