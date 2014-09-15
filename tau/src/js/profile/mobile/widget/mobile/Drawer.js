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
 *        @example
 *        <div data-role="drawer" data-position="left" id="leftdrawer">
 *            <ul data-role="listview">
 *                <li class="ui-drawer-main-list"><a href="#">List item 1</a></li>
 *                <li class="ui-drawer-main-list"><a href="#">List item 2</a></li>
 *                <li class="ui-drawer-sub-list"><a href="#">Sub item 1</a></li>
 *            </ul>
 *        </div>
 *
 * ##Drawer positioning
 * You can declare to drawer position manually. (Default is left)
 *
 * If you implement data-position attributes value is 'left', drawer appear from left side.
 *
 *        @example
 *        <div data-role="drawer" data-position="left" id="leftdrawer">
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
 *        @example
 *        $("#leftdrawer").drawer("open");
 *
 * - "close" - drawer close
 *
 *        @example
 *        $("#leftdrawer").drawer("isOpen");
 *
 * - "isOpen" - get drawer status, true is opened and false if closed
 *
 *        @example
 *        $("#leftdrawer").drawer"(isOpen");
 *
 * ##Drawer Options
 *
 * - position: drawer appeared position. Type is <String> and default is "left".
 * - width: drawer width. Type is <Integer> and default is 290.
 * - duration: drawer appreared duration. <Integer> and default is 100.
 *
 *

 * @class ns.widget.mobile.Drawer
 * @extends ns.widget.mobile.BaseWidgetMobile
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/widget/core/Drawer",
			"./Page",
			"../../../../core/engine"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreDrawer = ns.widget.core.Drawer,
				Page = ns.widget.mobile.Page,
				engine = ns.engine,
				Drawer = function () {
					CoreDrawer.call(this);
					this._pageSelector = Page.classes.uiPage;
				};

			Drawer.prototype = new CoreDrawer();
			Drawer.classes = CoreDrawer.classes;

			ns.widget.mobile.Drawer = Drawer;
			engine.defineWidget(
				"Drawer",
				"[data-role='drawer'], .ui-drawer",
				[
					"open",
					"close",
					"isOpen"
				],
				Drawer,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Drawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
