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
			"./Page",
			"../../../../core/engine"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreDrawer = ns.widget.core.Drawer,
				CoreDrawerPrototype = CoreDrawer.prototype,
				Page = ns.widget.mobile.Page,
				engine = ns.engine,
				Drawer = function () {
					var self = this;
					CoreDrawer.call(self);
					self.options.swipeStartAreaRatio = 0.05;
					self._pageSelector = Page.classes.uiPage;

					self._onSwipeBound = null;
					self._onMouseDownBound = null;
					self._onSideEdgeMouseUpBound = null;
					self._swiped = false;
				},
				prototype = new CoreDrawer(),
				classes = CoreDrawer.classes;

			Drawer.prototype = prototype;
			Drawer.classes = classes;

			/**
			 * Swipe event handler
			 * @method _onSwipe
			 * @private
			 * @static
			 * @param {Event} event
			 * @member ns.widget.mobile.Drawer
			 */
			prototype._onSwipe = function(event) {
				// If swipeleft event was triggered at drawer position right,
				// drawer should be opend. So 'direction' has reverse value for swipe direction.
				var self = this,
					direction = event.type === "swipeleft" ? "right" : "left";

				if (self.options.position === direction && self._swiped) {
					self.open();
					self._swiped = false;
				}

			}

			/**
			 * Check vmousedown event whether triggerred on side edge area or not
			 * @method _checkSideEdgeMouseDown
			 * @private
			 * @static
			 * @param {Event} event
			 * @member ns.widget.mobile.Drawer
			 */
			prototype._checkSideEdgeMouseDown = function(event) {
				var self = this,
					eventClientX = event.clientX,
					options = self.options,
					position = options.position,
					swipeStartArea = window.innerWidth * options.swipeStartAreaRatio;

				if ((position === "left" && eventClientX > 0 && eventClientX < swipeStartArea) ||
					(position === "right" && eventClientX < window.innerWidth && eventClientX > window.innerWidth - swipeStartArea)) {
					self._swiped = true;
				}
			}
			/**
			 * Vmousedown event handler
			 * @method _onMouseDown
			 * @private
			 * @static
			 * @param {Event} event
			 * @member ns.widget.mobile.Drawer
			 */
			prototype._onMouseDown = function(event) {
				this._checkSideEdgeMouseDown(event);
			}

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.Drawer
			 */
			prototype._bindEvents = function() {
				var self = this,
					page = self._drawerPage;
				CoreDrawerPrototype._bindEvents.call(self);

				self._onMouseDownBound = self._onMouseDown.bind(self);
				self._onSwipeBound = self._onSwipe.bind(self);
				page.addEventListener("vmousedown", self._onMouseDownBound, false);
				page.addEventListener("swipeleft", self._onSwipeBound, false);
				page.addEventListener("swiperight", self._onSwipeBound, false);
			};

			prototype._destroy = function() {
				var self = this,
					page = self._drawerPage;
				CoreDrawerPrototype._destroy.call(self);
				page.removeEventListener("vmousedown", self._onMouseDownBound, false);
				page.removeEventListener("swipeleft", self._onSwipeBound, false);
				page.removeEventListener("swiperight", self._onSwipeBound, false);
			};

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
