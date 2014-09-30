/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Drawer Widget
 * Drawer widget provides creating drawer widget and managing drawer operations.
 *
 * @class ns.widget.tv.Drawer
 * @extends ns.widget.core.Drawer
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/widget/core/Drawer",
			"../../wearable/widget/wearable/Page",
			"../../../core/engine",
			"./BaseKeyboardSupport"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreDrawer = ns.widget.core.Drawer,
				CoreDrawerPrototype = CoreDrawer.prototype,
				Page = ns.widget.wearable.Page,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				engine = ns.engine,
				Drawer = function () {
					var self = this;
					CoreDrawer.call(self);
					BaseKeyboardSupport.call(self);
					self._pageSelector = Page.classes.uiPage;
				},
				prototype = new CoreDrawer(),
				classes = CoreDrawer.classes,
				WIDE_SIZE = 937,
				NARROW_SIZE = 301,
				MAX_WIDTH = 1920;

			//fill classes
			classes.uiBlock = "ui-block";
			classes.uiDynamicBoxActive = "ui-dynamic-box-active";
			Drawer.prototype = prototype;
			Drawer.classes = classes;

			prototype.open = function() {
				var self = this;
				CoreDrawerPrototype.open.call(self);
				self._supportKeyboard = true;
				self._pageWidget._supportKeyboard = false;
			};

			prototype.close = function() {
				var self = this;
				CoreDrawerPrototype.close.call(self);
				self._supportKeyboard = false;
				self._pageWidget._supportKeyboard = true;
			};

			prototype._openActiveElement = function(element) {
				var self = this,
					id = element.href,
					ui = self._ui,
					dynamicListElement;
				if (element.parentElement.classList.contains(classes.uiBlock)) {
					if (ui.currentDynamic) {
						ui.currentDynamic.classList.remove(classes.uiDynamicBoxActive);
					}
					if (id) {
						dynamicListElement = document.getElementById(id.split("#")[1]);
					}
					if (dynamicListElement) {
						self.option("width", WIDE_SIZE);
						ui.currentDynamic = dynamicListElement;
						dynamicListElement.classList.add(classes.uiDynamicBoxActive);
					} else {
						self.option("width", NARROW_SIZE);
					}
				}
			};

			/**
			 * Refresh of Drawer widget
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._refresh = function() {
				// Drawer layout has been set by parent element layout
				var self = this,
					options = self.options,
					windowWidth = window.innerWidth,
					headerHeight = self._headerElement && self._headerElement.offsetHeight,
					drawerStyle = self.element.style,
					overlayStyle = self._drawerOverlay && self._drawerOverlay.style;

				drawerStyle.width = options.width * windowWidth/MAX_WIDTH + "px";
				drawerStyle.top = headerHeight || 0 + "px";

				if (overlayStyle) {
					overlayStyle.width = windowWidth + "px";
					overlayStyle.top = headerHeight + "px";
				}

				self._translateRight();
			};

			prototype._init = function(element) {
				CoreDrawerPrototype._init.call(this, element);
				this._pageWidget = engine.instanceWidget(element.parentElement, "page");
			};

			prototype._bindEvents = function() {
				CoreDrawerPrototype._bindEvents.call(this);
				this._bindEventKey();
			};

			prototype._destroy = function() {
				this._destroyEventKey();
				CoreDrawerPrototype._destroy.call(this);
			};

			ns.widget.tv.Drawer = Drawer;
			engine.defineWidget(
				"Drawer",
				"[data-role='drawer'], ui-drawer",
				[
					"open",
					"close",
					"isOpen"
				],
				Drawer,
				"tv",
				true
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Drawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
