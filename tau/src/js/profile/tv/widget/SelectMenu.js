/*global window, ns*/
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
 * #SelectMenu Widget
 * SelectMenu widget provide creating SelectMenu widget in the form of dropdown list and managing its operation.
 *
 * ##Default selector
 * In default all select elements with _data-role=select_ or with class .ui-select-menu
 * are changed to Tizen WebUI SelectMenu. Additionally elements with
 * _data-native-menu=false_ will use custom popups for option selection
 *
 * ###  HTML Examples
 *
 * ####  Create SelectMenu
 * Default value of data-native-menu attribute is true and it makes native SelectMenu.
 * This widget also offers the possibility of having custom SelectMenu.
 *
 * 		@example
 *		<select>
 *			<option value="1">Item1</option>
 *			<option value="2">Item2</option>
 *			<option value="3">Item3</option>
 *			<option value="4">Item4</option>
 *		</select>
 *
 * ## Manual constructor
 * For manual creation of SelectMenu widget you can use constructor of widget.
 *
 * 		@example
 *		<select id="selectmenu">
 *			<option value="1">Item1</option>
 *			<option value="2">Item2</option>
 *			<option value="3">Item3</option>
 *			<option value="4">Item4</option>
 *		</select>
 *		<script>
 *			var element = document.getElementById("selectmenu"),
 *				widget = tau.widget.SelectMenu(element);
 *		</script>
 *
 * ##Sort type
 * You can declare to the type of SelectMenu manually.
 * If you set data-label attribute to true(Default is false.), SelectMenu has sort type.
 *
 * 		@example
 * 		<div style="width:300px; height:150px;">
 *			<select id="selectmenu" data-sort="true">
 *				<option value="1">Item1</option>
 *				<option value="2">Item2</option>
 *				<option value="3">Item3</option>
 *				<option value="4">Item4</option>
 *			</select>
 *		</div>
 *
 * ##Methods
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace: RECOMMEND
 *
 *		@example
 *		var element = document.getElementById("selectmenu"),
 *			widget = tau.widget.SelectMenu(element);
 *		widget.methodName(methodArgument1, methodArgument2, ...);
 *
 *
 * - "open" - SelectMenu open
 *
 * 		@example
 * 		var elSelectMenu = document.getElementById("selectmenu"),
 * 			widget = tau.widget.SelectMenu(elSelectMenu);
 * 		widget.open();
 *
 * - "close" - SelectMenu close
 *
 * 		@example
 * 		var elSelectMenu = document.getElementById("selectmenu"),
 * 			widget = tau.widget.SelectMenu(elSelectMenu);
 * 		widget.close();
 *
 * - "refresh" - This method refreshs the SelectMenu widget.
 *
 * 		@example
 * 		var elSelectMenu = document.getElementById("selectmenu"),
 * 			widget = tau.widget.SelectMenu(elSelectMenu);
 * 		widget.refresh();
 *
 * @class ns.widget.tv.SelectMenu
 * @extends ns.widget.mobile.SelectMenu
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
		 	"../../../profile/mobile/widget/mobile/SelectMenu",
			"../../../core/engine",
			"../../../core/theme",
			"../../../core/util/selectors",
			"../../../core/event",
			"../../../core/util/DOM/manipulation",
			"../../../core/util/object",
			"../tv",
			"./BaseKeyboardSupport"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseSelectMenu = ns.widget.mobile.SelectMenu,
				BaseSelectMenuPrototype = BaseSelectMenu.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				engine = ns.engine,
				objectUtils = ns.util.object,
				selectors = ns.util.selectors,
				KEY_CODES = BaseKeyboardSupport.KEY_CODES,
				slice = Array.prototype.slice,
				SelectMenu = function () {
					var self = this;

					BaseSelectMenu.call(self);
					self._callbacks = {};
					BaseKeyboardSupport.call(self);

					/**
					* @property {Object} options Object with default options
					* @property {boolean} [options.nativeMenu=false] Sets the SelectMenu widget as native/custom type.
					* @property {boolean} [options.sort=false] Sets the SelectMenu widget with sorting possibility.
					* @member ns.widget.tv.SelectMenu
					*/
					self.options = {
						nativeMenu: false,
						inline: false,
						sort: false
					};
				},
				/**
				 * Dictionary for SelectMenu related css class names
				 * @property {Object} classes
				 * @member ns.widget.tv.SelectMenu
				 * @static
				 */
				classes = objectUtils.merge({}, BaseSelectMenu.classes, {
				}),
				FUNCTION_TYPE = "function",
				prototype = new BaseSelectMenu();

			SelectMenu.prototype = prototype;
			SelectMenu.classes = classes;

			prototype._configure = function () {
				/**
				 * @property {boolean} [options.backgroundLayer=false] Enable or disable background layer which close select menu after click
				 */
				this.options.backgroundLayer = false;
			};

			/**
			 * Calculate position of list after open
			 * @method _coordinateOption
			 * @return {String}
			 * @protected
			 * @member ns.widget.tv.SelectMenu
			 */
			prototype._coordinateOption = function () {
				var self = this,
					ui = self._ui,
					offsetTop,
					optionStyle,
					width;

				width = ui.elSelectWrapper.offsetWidth;
				optionStyle = BaseSelectMenuPrototype._coordinateOption.call(self);
				offsetTop = self._offset.top + ui.elSelectWrapper.offsetHeight;
				optionStyle = optionStyle.replace(/top: (\d+\.?\d*)px/i, "top:" + offsetTop + "px");
				optionStyle = optionStyle.replace(/width: (\d+\.?\d*)px/i, "width: " + width + "px");

				return optionStyle;
			};

			/**
			 * Init widget
			 * @method _init
			 * @protected
			 * @member ns.widget.tv.SelectMenu
			 */
			prototype._init = function(element) {
				var self= this,
					ui = self._ui;

				BaseSelectMenuPrototype._init.call(self, element);

				//change base element for keyboard support
				self.keyboardElement = ui.elOptionContainer;
			};

			/**
			 * Init widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.tv.SelectMenu
			 */
			prototype._bindEvents = function(element) {
				var self= this,
					ui = self._ui;

				BaseSelectMenuPrototype._bindEvents.call(self, element);

				self._bindEventKey();
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.tv.SelectMenu
			 */
			prototype._destroy = function(element) {
				var self= this,
					ui = self._ui;

				BaseSelectMenuPrototype._destroy.call(self, element);

				self._destroyEventKey();
			};

			/**
			 * Open and Close Option List
			 * @method _toggleSelect
			 * @protected
			 * @member ns.widget.tv.SelectMenu
			 */
			prototype._toggleSelect = function (){
				var self = this;
				if (self._isOpen) {
					self.disableKeyboardSupport();
					self.restoreKeyboardSupport();
				} else {
					self.saveKeyboardSupport();
					self.enableKeyboardSupport();
				}
				BaseSelectMenuPrototype._toggleSelect.call(self);
			};

			engine.defineWidget(
				"SelectMenu",
				"select:not([data-role='slider']):not([data-role='range']):not([data-role='toggleswitch']):not(.ui-toggleswitch):not(.ui-slider)" +
				", select.ui-select-menu:not([data-role='slider']):not([data-role='range']):not([data-role='toggleswitch'])",
				["open", "close"],
				SelectMenu,
				"tv",
				true
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.SelectMenu = SelectMenu;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));