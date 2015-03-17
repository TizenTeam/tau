/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
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
			"../../../../core/util/object",
			"../../../../core/engine"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreDrawer = ns.widget.core.Drawer,
				engine = ns.engine,
				object = ns.util.object,
				Drawer = function () {
					var self = this;
					self.options = CoreDrawer.options;
					CoreDrawer.call(self);
				},
				prototype = new CoreDrawer();

			Drawer.prototype = prototype;

			/**
			 * Configure Drawer widget
			 * @method _configure
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._configure = function() {
				var self = this;
				/**
				 * Widget options
				 * @property {string} [options.drawerTarget="ui-page"] Drawer appended target. Value type is CSS selector type.
				 * @property {string} [options.position="left"] Drawer position. "left" or "right"
				 * @property {boolean} [options.enable=true] Enable drawer widget.
				 * @property {Number} [options.dragEdge=1] Start dragging gesture possible area ratio of target or handler between 0 and 1.
				 */
				object.merge(self.options, {
					dragEdge: 0.05
				});
			};
			prototype._build = function(element) {
				CoreDrawer.prototype._build.call(this, element);
				element.style.top = 0;
				return element;
			};

			ns.widget.mobile.Drawer = Drawer;
			engine.defineWidget(
				"Drawer",
				"[data-role='drawer'], .ui-drawer",
				[
					"transition",
					"setDragHandler",
					"open",
					"close",
					"isOpen",
					"getState"
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
