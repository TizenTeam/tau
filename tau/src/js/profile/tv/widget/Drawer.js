/*global window, define */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
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
 * #Drawer Widget
 * Drawer widget provide creating drawer widget and managing drawer operation.
 *
 * ##Default selector
 * You can make the drawer widget as data-role="drawer" with DIV tag.
 *
 * ###  HTML Examples
 *
 * ####  Create drawer using data-role
 *
 * 		@example
 *		<div data-role="drawer" data-position="left" id="leftdrawer">
 *			<ul data-role="listview">
 *				<li class="ui-drawer-main-list"><a href="#">List item 1</a></li>
 *				<li class="ui-drawer-main-list"><a href="#">List item 2</a></li>
 *				<li class="ui-drawer-sub-list"><a href="#">Sub item 1</a></li>
 *			</ul>
 *		</div>
 *
 * ##Drawer positioning
 * You can declare to drawer position manually. (Default is left)
 *
 * If you implement data-position attributes value is 'left', drawer appear from left side.
 *
 * 		@example
 *		<div data-role="drawer" data-position="left" id="leftdrawer">
 *
 * - "left" - drawer appear from left side
 * - "right" - drawer appear from right side
 *
 * ##Drawer inner list
 * Drawer has two list styles, main list style and sub list style.
 * You can implement two providing list styles as implement classes.
 *
 * - "ui-drawer-main-list" : Main list style of drawer
 * - "ui-drawer-sub-list" : Sub list style of drawer
 *
 * ##Drawer methods
 *
 * You can use some methods of drawer widget.
 *
 * - "open" - drawer open
 *
 * 		@example
 * 		$("#leftdrawer").drawer("open");
 *
 * - "close" - drawer close
 *
 * 		@example
 * 		$("#leftdrawer").drawer("isOpen");
 *
 * - "isOpen" - get drawer status, true is opened and false if closed
 *
 * 		@example
 * 		$("#leftdrawer").drawer"(isOpen");
 *
 * ##Drawer Options
 *
 * - position: drawer appeared position. Type is <String> and default is "left".
 * - width: drawer width. Type is <Integer> and default is 290.
 * - duration: drawer appreared duration. <Integer> and default is 100.
 *
 *

 * @class ns.widget.tv.Drawer
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
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
					dynamicListElement = document.getElementById(id.split("#")[1]);
				if (element.parentElement.classList.contains(classes.uiBlock)) {
					if (ui.currentDynamic) {
						ui.currentDynamic.classList.remove(classes.uiDynamicBoxActive);
					}
					if (dynamicListElement) {
						self.option('width', WIDE_SIZE);
						ui.currentDynamic = dynamicListElement;
						dynamicListElement.classList.add(classes.uiDynamicBoxActive);
					} else {
						self.option('width', NARROW_SIZE);
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
				"tv"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Drawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
