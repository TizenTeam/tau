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
 * #Drawer Widget
 * Drawer widget provides drawer functionality for TV profile - container with
 * ability to open and close with an animation. Widget inherits from Core Drawer
 * widget. You can look for its documentation in {@link ns.widget.core.Drawer}.
 *
 * ##Default selectors
 * By default all elements with data-role="drawer" or class "ui-drawer" are
 * changed to Drawer widget.
 *
 * ##Placing rule
 *
 * Drawer HTML element should be placed inside a page (div with data-role="page"),
 * but not inside a content (div with data-role="content").
 *
 * ##HTML Examples
 *
 * ###Manual constructor
 * For manual creation of Drawer widget you can use constructor of widget:
 *
 *	@example
 *	<!-- Widget structure -->
 *	<div class="ui-page" data-role="page">
 *		<div data-role="drawer" data-position="left" id="drawer">
 *			<ul data-role="listview">
 *				<li class="ui-drawer-main-list" id="mainItem1"><a href="#">List item 1</a></li>
 *				<li class="ui-drawer-main-list" id="mainItem2"><a href="#">List item 2</a></li>
 *				<li class="ui-drawer-sub-list" id="subItem1"><a href="#">Sub item 1</a></li>
 *			</ul>
 *		</div>
 *	</div>
 *	<script>
 *	var drawer = document.getElementById("drawer"),
 *		widget = tau.widget.Drawer(drawer);
 *	</script>
 *
 * ###Opening / Closing Drawer. Checking if Drawer is open.
 * To open / close Drawer one can use open() and close() methods.
 * To check if Drawer is open use isOpen method.
 *
 *	@example
 *	<!-- Widget structure -->
 *	<div class="ui-page" data-role="page">
 *		<div data-role="drawer" data-position="left" id="drawer">
 *			<ul data-role="listview">
 *				<li class="ui-drawer-main-list" id="mainItem1"><a href="#">List item 1</a></li>
 *				<li class="ui-drawer-main-list" id="mainItem2"><a href="#">List item 2</a></li>
 *				<li class="ui-drawer-sub-list" id="subItem1"><a href="#">Sub item 1</a></li>
 *			</ul>
 *		</div>
 *	</div>
 *	<script>
 *	var drawer = document.getElementById("drawer"),
 *		widget = tau.widget.Drawer(drawer);
 *		// open
 *		widget.open();
 *		alert(widget.isOpen());
 *		// close
 *		widget.close();
 *		alert(widget.isOpen());
 *	</script>
 *
 * ###Positioning Drawer left
 * To position Drawer left set data-position to "left" or do not use this
 * attribute (left is default).
 *
 *	@example
 *	<!-- Widget structure -->
 *	<div class="ui-page" data-role="page">
 *		<div data-role="drawer" data-position="left" id="drawer">
 *			<ul data-role="listview">
 *				<li class="ui-drawer-main-list" id="mainItem1"><a href="#">List item 1</a></li>
 *				<li class="ui-drawer-main-list" id="mainItem2"><a href="#">List item 2</a></li>
 *				<li class="ui-drawer-sub-list" id="subItem1"><a href="#">Sub item 1</a></li>
 *			</ul>
 *		</div>
 *	</div>
 *
 *	@example
 *	<!-- Widget structure -->
 *	<div class="ui-page" data-role="page">
 *		<div data-role="drawer" id="drawer">
 *			<ul data-role="listview">
 *				<li class="ui-drawer-main-list" id="mainItem1"><a href="#">List item 1</a></li>
 *				<li class="ui-drawer-main-list" id="mainItem2"><a href="#">List item 2</a></li>
 *				<li class="ui-drawer-sub-list" id="subItem1"><a href="#">Sub item 1</a></li>
 *			</ul>
 *		</div>
 *	</div>
 *
 * ###Positioning Drawer right
 * To position Drawer right set data-position attribute to "right".
 *
 *	@example
 *	<!-- Widget structure -->
 *	<div class="ui-page" data-role="page">
 *		<div data-role="drawer" data-position="right" id="drawer">
 *			<ul data-role="listview">
 *				<li class="ui-drawer-main-list" id="mainItem1"><a href="#">List item 1</a></li>
 *				<li class="ui-drawer-main-list" id="mainItem2"><a href="#">List item 2</a></li>
 *				<li class="ui-drawer-sub-list" id="subItem1"><a href="#">Sub item 1</a></li>
 *			</ul>
 *		</div>
 *	</div>
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
			"../../../core/widget/core/Page",
			"../../../core/engine",
			"./BaseKeyboardSupport"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * {Object} Widget Alias for {@link ns.widget.core.Drawer}
			 * @member ns.widget.tv.Drawer
			 * @private
			 * @static
			 */
			var CoreDrawer = ns.widget.core.Drawer,
				/**
				 * {Object} Prototype of Core Drawer ({@link ns.widget.core.Drawer})
				 * @member ns.widget.tv.Drawer
				 * @private
				 * @static
				 */
				CoreDrawerPrototype = CoreDrawer.prototype,
				Page = ns.widget.core.Page,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				/**
				 * {Object} Alias for {@link ns.engine}
				 * @member ns.widget.tv.Drawer
				 * @private
				 * @static
				 */
				engine = ns.engine,
				Drawer = function () {
					var self = this;
					CoreDrawer.call(self);
					BaseKeyboardSupport.call(self);
					self._pageSelector = Page.classes.uiPage;
				},
				prototype = new CoreDrawer(),
				/**
				 * {Object} List of classes which can be added to widget`s element
				 * @member ns.widget.tv.Drawer
				 * @private
				 * @static
				 */
				classes = CoreDrawer.classes,
				/**
				 * {number} With size of element - wide
				 * @member ns.widget.tv.Drawer
				 * @private
				 * @static
				 * @readonly
				 */
				WIDE_SIZE = 937,
				/**
				 * {number} With size of element - narrow
				 * @member ns.widget.tv.Drawer
				 * @private
				 * @static
				 * @readonly
				 */
				NARROW_SIZE = 301,
				/**
				 * {number} Max width of Drawer
				 * @member ns.widget.tv.Drawer
				 * @private
				 * @static
				 * @readonly
				 */
				MAX_WIDTH = 1920,
				/**
				 * {string} Constant describing type of functions
				 * @member ns.widget.tv.Drawer
				 * @private
				 * @static
				 * @readonly
				 */
				FUNCTION_TYPE = "function";

			//fill classes
			classes.uiBlock = "ui-block";
			classes.uiDynamicBoxActive = "ui-dynamic-box-active";
			Drawer.prototype = prototype;
			Drawer.classes = classes;

			/**
			 * Opens drawer widget
			 * @method open
			 * @param {number} [duration]
			 * @member ns.widget.tv.Drawer
			 */
			prototype.open = function(duration) {
				var self = this,
					CorePrototypeOpen = CoreDrawerPrototype.open;
				if (typeof CorePrototypeOpen === FUNCTION_TYPE) {
					CorePrototypeOpen.call(self, duration);
				}
				self.saveKeyboardSupport();
				self.enableKeyboardSupport();
			};

			/**
			 * Closes drawer widget
			 * @method close
			 * @param {number} [duration]
			 * @member ns.widget.tv.Drawer
			 */
			prototype.close = function(duration) {
				var self = this,
					CorePrototypeClose = CoreDrawerPrototype.close;
				if (typeof CorePrototypeClose === FUNCTION_TYPE) {
					CorePrototypeClose.call(self, duration);
				}
				self.disableKeyboardSupport();
				self.restoreKeyboardSupport();
			};

			/**
			 * Method implements opening Drawer by focus mechanism
			 * @method _openActiveElement
			 * @param {HTMLElement} element Link element which show element which should be open
			 * @param {string?} [id=null] id of element to open
			 * @member ns.widget.tv.Drawer
			 * @protected
			 */
			prototype._openActiveElement = function(element, id) {
				var self = this,
					ui = self._ui,
					dynamicListElement;
				if ((element && element.dataset.rel === "dynamic") || id) {
					if (ui.currentDynamic) {
						ui.currentDynamic.classList.remove(classes.uiDynamicBoxActive);
					}
					if (!id) {
						id = element.href;
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
			 * Method implements opening Drawer by focus mechanism
			 * @method _closeActiveElement
			 * @member ns.widget.tv.Drawer
			 * @protected
			 */
			prototype._closeActiveElement = function() {
				var self = this,
					ui = self._ui;
				if (ui.currentDynamic) {
					ui.currentDynamic.classList.remove(classes.uiDynamicBoxActive);
				}
				self.option("width", NARROW_SIZE);
			};

			/**
			 * Close dynamic box and ser size od drawer to narrow
			 * @method _closeActiveElement
			 * @member ns.widget.tv.Drawer
			 * @protected
			 */
			prototype.closeDynamic = function() {
				this._closeActiveElement();
			};

			/**
			 * Open dynamic box and ser size of drawer to wide.
			 * @method openDynamic
			 * @param {string} id
			 * @member ns.widget.tv.Drawer
			 * @protected
			 */
			prototype.openDynamic = function(id) {
				this._openActiveElement(null, id);
			};

			/**
			 * Refresh of Drawer widget
			 * @method _refresh
			 * @protected
			 * @member ns.widget.tv.Drawer
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

			/**
			 * Binds events to Drawer widget
			 * @method _bindEvents
			 * @member ns.widget.tv.Drawer
			 * @protected
			 */
			prototype._bindEvents = function() {
				var CorePrototypeBindEvents = CoreDrawerPrototype._bindEvents;
				if (typeof CorePrototypeBindEvents === FUNCTION_TYPE) {
					CorePrototypeBindEvents.call(this);
				}
				this._bindEventKey();
			};

			/**
			 * Destroys Drawer widget
			 * @method _destroy
			 * @member ns.widget.tv.Drawer
			 * @protected
			 */
			prototype._destroy = function() {
				var CorePrototypeDestroy = CoreDrawerPrototype._destroy;
				this._destroyEventKey();
				if (typeof CorePrototypeDestroy === FUNCTION_TYPE) {
					CorePrototypeDestroy.call(this);
				}
			};

			// definition
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
