/*global window, ns, define */
/*jslint nomen: true */
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
 *		<select data-native-menu="false">
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
 *		<select id="selectmenu" data-native-menu="false">
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
 * ##Label type
 * You can declare to the type of SelectMenu manually.
 * If you set data-label attribute to true(Default is false.), SelectMenu has label type.
 * The size of label type is inherited its parent element.
 *
 * 		@example
 * 		<div style="width:300px; height:150px;">
 *			<select id="selectmenu" data-native-menu="false" data-label="true">
 *				<option value="1">Item1</option>
 *				<option value="2">Item2</option>
 *				<option value="3">Item3</option>
 *				<option value="4">Item4</option>
 *			</select>
 *		</div>
 *
 * ##Inline type
 * When data-inline attribute is set to true, width of the SelectMenu is determined by its text. (Default is false.)
 *
 *			@example
 * 			<select id="selectmenu" data-native-menu="false" data-inline="true">
 *				<option value="1">Item1</option>
 *				<option value="2">Item2</option>
 *				<option value="3">Item3</option>
 *				<option value="4">Item4</option>
 *			</select>
 *
 * ##Placeholder options
 * If you use <option> with data-placeholder="true" attribute, you can make a default placeholder.
 * Default value of data-hide-placeholder-menu-items attribute is true and data-placeholder option is hidden.
 * If you don't want that, you can use data-hide-placeholder-menu-items="false" attribute.
 *
 *		@example
 *		<select id="selectmenu" data-native-menu="false" data-hide-placeholder-menu-items="false">
 *			<option value="choose-one" data-placeholder="true">Choose an option</option>
 *			<option value="1">Item1</option>
 *			<option value="2">Item2</option>
 *			<option value="3">Item3</option>
 *			<option value="4">Item4</option>
 *		</select>
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
 * Second API is jQuery Mobile API and for call _methodName_ you can use: Support for backward compatibility
 *
 *		@example
 *		$(".selector").selectmenu("methodName", methodArgument1, methodArgument2, ...);
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
 * @class ns.widget.mobile.SelectMenu
 * @extends ns.widget.mobile.BaseWidgetMobile
 * @author Hagun Kim <hagun.kim@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/theme",
			"../../../../core/util/selectors",
			"../../../../core/event",
			"../../../../core/util/DOM/manipulation",
		 	"../../../../core/widget/core/Page",
			"../mobile",
			"./BaseWidgetMobile"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				domUtils = ns.util.DOM,
				eventUtils = ns.event,
				selectors = ns.util.selectors,
				slice = [].slice,
				Page = ns.widget.core.Page,
				indexOf = [].indexOf,
				SelectMenu = function () {
					var self = this;
					/**
					* @property {boolean} _isOpen Open/Close status of SelectMenu
					* @member ns.widget.mobile.SelectMenu
					*/
					self._isOpen = false;
					/**
					* @property {number} _selectedIndex Index of selected option in SelectMenu
					* @member ns.widget.mobile.SelectMenu
					*/
					self._selectedIndex = null;
					/**
					* @property {Object} _ui Object with html elements connected with SelectMenu
					* @member ns.widget.mobile.SelectMenu
					*/
					self._ui = {
						elSelectWrapper: null,
						elPlaceHolder: null,
						elSelect: null,
						screenFilter: null,
						elOptionContainer: null,
						elOptions: null,
						elPage: null,
						elContent: null,
						elDefaultOption: null
					};
					/**
					* @property {Object} options Object with default options
					* @property {boolean} [options.nativeMenu=true] Sets the SelectMenu widget as native/custom type.
					* @property {boolean} [options.inline=false] Sets the SelectMenu widget as inline/normal type.
					* @property {boolean} [options.label=false] Sets the SelectMenu widget as label/normal type.
					* @property {boolean} [options.hidePlaceholderMenuItems=true] Hide/Reveal the placeholder option in dropdown list of the SelectMenu.
					* @property {boolean} [options.backgroundLayer=true] Enable or disable background layer which close select menu after click
					* @member ns.widget.mobile.SelectMenu
					*/
					self.options = {
						nativeMenu: true,
						inline: false,
						label: false,
						hidePlaceholderMenuItems: true,
						backgroundLayer: true
					};

					/**
					 * @property {Function|null} _toggleMenuBound callback for select action
					 * @protected
					 * @member ns.widget.mobile.SelectMenu
					 */
					self._toggleMenuBound =  null;
					/**
					 * @property {Function|null} _changeOptionBound callback for change value
					 * @protected
					 * @member ns.widget.mobile.SelectMenu
					 */
					self._changeOptionBound = null;
					/**
					 * @property {Function|null} _onResizeBound callback for throttledresize
					 * @protected
					 * @member ns.widget.mobile.SelectMenu
					 */
					self._onResizeBound = null;
					/**
					 * @property {Function|null} _nativeChangeOptionBound callback for change value
					 * @protected
					 * @member ns.widget.mobile.SelectMenu
					 */
					self._nativeChangeOptionBound = null;
					/**
					 * @property {Function|null} _focusBound callback for focus action
					 * @protected
					 * @member ns.widget.mobile.SelectMenu
					 */
					self._focusBound = null;
					/**
					 * @property {Function|null} _blurBound callback for blur action
					 * @protected
					 * @member ns.widget.mobile.SelectMenu
					 */
					self._blurBound = null;
				},
				/**
				 * Dictionary for SelectMenu related css class names
				 * @property {Object} classes
				 * @member ns.widget.mobile.SelectMenu
				 * @static
				 */
				classes = {
					selectWrapper : "ui-selectmenu",
					optionGroup : "ui-selectmenu-optiongroup",
					placeHolder : "ui-selectmenu-placeholder",
					optionList : "ui-selectmenu-options",
					selected : "ui-selectmenu-selected",
					active : "ui-selectmenu-active",
					filter : "ui-selectmenu-screen-filter",
					filterHidden : "ui-selectmenu-filter-hidden",
					label : "ui-selectmenu-label",
					disabled : "ui-selectmenu-disabled",
					widgetDisabled : "ui-disabled",
					inline : "ui-selectmenu-inline",
					native : "ui-select-native",
					top : "ui-selectmenu-option-top",
					bottom : "ui-selectmenu-option-bottom",
					focus : "ui-focus"
				},
				prototype = new BaseWidget();

			SelectMenu.prototype = prototype;
			SelectMenu.classes = classes;

			/**
			 * vclick to toggle menu event handler
			 * @method toggleMenu
			 * @private
			 * @static
			 * @param {ns.widget.mobile.SelectMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.SelectMenu
			*/
			function toggleMenu(self, event) {
				self._toggleSelect();
				eventUtils.stopPropagation(event);
				eventUtils.preventDefault(event);
			}

			/**
			 * vclick to change option event handler
			 * @method changeOption
			 * @private
			 * @static
			 * @param {ns.widget.mobile.SelectMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.SelectMenu
			*/
			function changeOption(self, event) {
				var target = event.target,
					tag = target.tagName,
					classList = target.classList;
				if (tag === "LI" && !classList.contains(classes.optionGroup) && !classList.contains(classes.disabled)) {
					self._selectedIndex = indexOf.call(self._ui.elOptions, target);
					self._changeOption();
					self._toggleSelect();
				}
				event.stopPropagation();
				event.preventDefault();
			}

			/**
			 * Change option in native selectmenu
			 * @method nativeChangeOption
			 * @private
			 * @static
			 * @param {ns.widget.mobile.SelectMenu} self
			 * @member ns.widget.mobile.SelectMenu
			*/
			function nativeChangeOption(self) {
				var ui = self._ui,
					selectedOption = ui.elSelect[ui.elSelect.selectedIndex];
				ui.elPlaceHolder.textContent = selectedOption.textContent;
			}

			/**
			 * Function fires on window resizing
			 * @method onResize
			 * @private
			 * @static
			 * @param {ns.widget.mobile.SelectMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.SelectMenu
			*/
			function onResize(self, event) {
				self._isOpen = !self._isOpen;
				self._toggleSelect();
				event.stopPropagation();
				event.preventDefault();
			}

			/**
			 * Function adds ui-focus class on focus
			 * @private
			 * @static
			 * @param {ns.widget.mobile.SelectMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.SelectMenu
			 */
			function onFocus(self, event) {
				var ui = self._ui,
					target = event.target;
				if (target === ui.elSelectWrapper ||
						 target.parentNode === ui.elOptionContainer) {
					target.classList.add(classes.focus);
				}
			}

			/**
			 * Function removes ui-focus class on focus
			 * @private
			 * @static
			 * @param {ns.widget.mobile.SelectMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.SelectMenu
			 */
			function onBlur(self, event) {
				var ui = self._ui,
					target = event.target;
				if (target === ui.elSelectWrapper ||
						 target.parentNode === ui.elOptionContainer) {
					target.classList.remove(classes.focus);
				}
			}

			/**
			 * Toggle enable/disable selectmenu
			 * @method setDisabledStatus
			 * @private
			 * @static
			 * @param {HTMLElement} element
			 * @param {Boolean} isDisabled
			 * @member ns.widget.mobile.SelectMenu
			*/
			function setDisabledStatus(element, isDisabled) {
				var classList = element.classList;
				if (isDisabled) {
					classList.add(classes.disabled);
					classList.add(classes.widgetDisabled);
				} else {
					classList.remove(classes.disabled);
					classList.remove(classes.widgetDisabled);
				}
			}

			/**
			 * Convert option tag to li element
			 * @method convertOptionToHTML
			 * @private
			 * @static
			 * @param {HTMLElement} option
			 * @param {Boolean} isDisabled
			 * @return {string}
			 * @member ns.widget.mobile.SelectMenu
			*/
			function convertOptionToHTML(option, isDisabled) {
				var className = option.className;
				if (isDisabled) {
					className += " " + classes.disabled;
				}
				return "<li data-value='" + option.value + "'" + (className ? " class='" + className + "'" : "") + (!isDisabled ?  " tabindex='0'" : "") + ">" + option.textContent + "</li>";
			}

			/**
			 * Return offset of element
			 * @method getOffsetOfElement
			 * @private
			 * @static
			 * @param {HTMLElement} element
			 * @param {HTMLElement} container
			 * @return {Object}
			 * @member ns.widget.mobile.SelectMenu
			*/
			function getOffsetOfElement(element, container) {
				var top = element.offsetTop,
					left = element.offsetLeft,
					offsetParent;
				while (element.offsetParent) {
					offsetParent = element.offsetParent;
					top += offsetParent.offsetTop;
					left += offsetParent.offsetLeft;
					if (element === container) {
						break;
					}
					element = offsetParent;
				}
				return {top: top, left: left};
			}

			/**
			 * Construct element of option of selectmenu
			 * @method constructOption
			 * @private
			 * @static
			 * @param {ns.widget.mobile.SelectMenu} self
			 * @return {string}
			 * @member ns.widget.mobile.SelectMenu
			*/
			function constructOption(self) {
				var i,
					j,
					forElement,
					tag,
					options = "",
					optionArray,
					optionCount,
					groupOptionArray,
					groupOptCount,
					isDisabled,
					widgetOptions = self.options,
					getData = domUtils.getNSData;

				optionArray = slice.call(self._ui.elSelect.children);

				// This part is for optgroup tag.
				for (i = 0, optionCount = optionArray.length; i < optionCount; i++) {
					forElement = optionArray[i];
					isDisabled = !!forElement.disabled;
					tag = forElement.tagName;
					// for <option> tag
					if (tag === "OPTION") {
						/* When data-hide-placeholder-menu-items is true,
						 * <option> with data-placeholder="true" is hidden in selectmenu.
						 * It means that the <option> doesn't have to be selectmenu element.
						 */
						if (widgetOptions.hidePlaceholderMenuItems && getData(forElement, "placeholder")) {
							continue;
						}
						// normal <option> tag will be selectmenu element.
						options += convertOptionToHTML(forElement, isDisabled);
					} else if (tag === "OPTGROUP"){
						// for <optgroup> tag
						options += "<li class='" + classes.optionGroup + (isDisabled ? (" " + classes.disabled + "'") : "'" ) + ">" + forElement.label + "</li>";
						groupOptionArray = slice.call(forElement.children);
						for (j = 0, groupOptCount = groupOptionArray.length; j < groupOptCount; j++) {
							// If <optgroup> is disabled, all child of the optgroup are also disabled.
							isDisabled = !!forElement.disabled || !!groupOptionArray[j].disabled;
							if (widgetOptions.hidePlaceholderMenuItems && getData(forElement, "placeholder")) {
								continue;
							}
							options += convertOptionToHTML(groupOptionArray[j], isDisabled);
						}
					}
				}
				return options;
			}

			/**
			 * Check whether the placeholder option exist or not
			 * @method findDataPlaceHolder
			 * @private
			 * @static
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.SelectMenu
			*/
			function findDataPlaceHolder(element) {
				return element.querySelector("option[data-placeholder='true']");
			}

			/**
			 * Check whether the type is label or not
			 * @method _checkLabel
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._checkLabel = function () {
				var self = this,
					ui = self._ui;
				if (self.options.label) {
					ui.elSelectWrapper.classList.add(classes.label);
				} else {
					ui.elSelectWrapper.classList.remove(classes.label);
				}
			};

			/**
			 * Check whether the type is Inline or not
			 * @method _checkInline
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._checkInline = function () {
				var self = this,
					ui = self._ui;
				if (self.options.inline) {
					ui.elSelectWrapper.classList.add(classes.inline);
					ui.elPlaceHolder.removeAttribute("style");
				} else {
					ui.elSelectWrapper.classList.remove(classes.inline);
				}
			};

			/**
			 * Build structure of SelectMenu widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._build = function (element) {
				this._generate(element);
				return element;
			};

			/**
			 * Generate Placeholder and Options elements for SelectMenu
			 * @method _generate
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._generate = function (element) {
				var self = this,
					isNewBuild = false,
					options = "",
					selectedOption,
					fragment,
					elementId = element.id,
					ui = self._ui,
					elPlaceHolder,
					elSelectWrapper,
					elOptions,
					screenFilter,
					elOptionContainer,
					pageClasses = Page.classes;

				ui.elSelect = element;
				ui.page = selectors.getParentsByClass(element, pageClasses.uiPage)[0] || document.body;
				ui.content = selectors.getParentsByClass(element, pageClasses.uiContent)[0] || selectors.getParentsByClass(element, pageClasses.uiHeader)[0];
				ui.elDefaultOption = findDataPlaceHolder(element);
				if (!ui.elOptions) {
					self._selectedIndex = element.selectedIndex;
				}
				selectedOption = ui.elDefaultOption || element[self._selectedIndex];

				elSelectWrapper = document.getElementById(elementId + "-selectmenu");

				if (elSelectWrapper === null) {
					elSelectWrapper = document.createElement("div");
					elSelectWrapper.className = classes.selectWrapper;
					elSelectWrapper.id = elementId + "-selectmenu";
				}

				if (self.options.nativeMenu) {
					elPlaceHolder = document.getElementById(elementId + "-placeholder");
					if (elPlaceHolder === null) {
						elPlaceHolder = document.createElement("span");
						elPlaceHolder.id = elementId + "-placeholder";
						elPlaceHolder.className = classes.placeHolder;
						domUtils.insertNodesBefore(element, elSelectWrapper);
						elSelectWrapper.appendChild(elPlaceHolder);
						elSelectWrapper.appendChild(element);
						elSelectWrapper.classList.add(classes.native);
						elPlaceHolder.innerHTML = selectedOption.textContent;
					}
					elOptions = element.querySelectorAll("option");
				} else {
					options = constructOption(self);

					elPlaceHolder = document.getElementById(elementId + "-placeholder");

					if (elPlaceHolder === null) {
						elPlaceHolder = document.createElement("span");
						elPlaceHolder.id = elementId + "-placeholder";
						elPlaceHolder.className = classes.placeHolder;
						domUtils.insertNodesBefore(element, elSelectWrapper);
						elSelectWrapper.appendChild(elPlaceHolder);
						elSelectWrapper.appendChild(element);
						if (self.options.backgroundLayer) {
							screenFilter = document.createElement("div");
							screenFilter.className = classes.filterHidden;
							screenFilter.classList.add(classes.filter);
							screenFilter.id = elementId + "-screen";
						}
						elOptionContainer = document.createElement("ul");
						elOptionContainer.className = classes.optionList;
						elOptionContainer.id = elementId + "-options";
						isNewBuild = true;
					} else {
						screenFilter = document.getElementById(elementId + "-screen");
						elOptionContainer = document.getElementById(elementId + "-options");
					}

					elPlaceHolder.innerHTML = selectedOption.textContent;
					elOptionContainer.innerHTML = options;

					/*****************************************************************************************************
					 * FIX ME : When scrollview is removed, elOptionContainer can be located around SelectTag.
					 *****************************************************************************************************/
					if (isNewBuild) {
						fragment = document.createDocumentFragment();
						if (screenFilter) {
							fragment.appendChild(screenFilter);
						}
						fragment.appendChild(elOptionContainer);
						ui.page.appendChild(fragment);
					}

					elOptions = elOptionContainer.querySelectorAll("li[data-value]");
					elOptions[self._selectedIndex].classList.add(classes.selected);
				}

				elSelectWrapper.setAttribute("tabindex", "0");

				ui.elSelectWrapper = elSelectWrapper;
				ui.elPlaceHolder = elPlaceHolder;
				ui.elOptions = elOptions;
				ui.screenFilter = screenFilter;
				ui.elOptionContainer = elOptionContainer;

				self._checkLabel();
				self._checkInline();

				return element;
			};

			/**
			 * Init of SelectMenu widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui,
					elementId = element.id;
				if (!ui.elSelectWrapper) {
					ui.elSelectWrapper = document.getElementById(elementId + "-selectmenu");
					ui.elPlaceHolder = document.getElementById(elementId + "-placeholder");
					ui.elSelect = element;
					if (!self.options.nativeMenu) {
						ui.screenFilter = document.getElementById(elementId + "-screen");
						ui.elOptionContainer = document.getElementById(elementId + "-options");
						ui.elOptions = ui.elOptionContainer.querySelectorAll("li[data-value]");
					}
				}
			};

			/**
			 * Refresh of SelectMenu widget
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._refresh = function () {
				this._generate(this.element);
			};

			/**
			* Enables widget
			* @method _enable
			*  @protected
			* @member ns.widget.mobile.SelectMenu
			*/
			prototype._enable = function () {
				setDisabledStatus(this._ui.elSelectWrapper, false);
				domUtils.removeAttribute(this.element, "disabled");
			};

			/**
			* Disables widget
			* @method _disable
			*  @protected
			* @member ns.widget.mobile.SelectMenu
			*/
			prototype._disable = function () {
				setDisabledStatus(this._ui.elSelectWrapper, true);
				domUtils.setAttribute(this.element, "disabled", true);
			};

			/**
			 * Open SelectMenu
			 * @method open
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype.open = function () {
				var self = this;
				if (self._isOpen === false) {
					self._toggleSelect();
				}
			};

			/**
			 * Close SelectMenu
			 * @method close
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype.close = function () {
				var self = this;
				if (self._isOpen === true) {
					self._toggleSelect();
				}
			};

			/**
			 * Bind events of SelectMenu widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._bindEvents = function () {
				var self = this,
					ui = self._ui,
					elOptionContainer = ui.elOptionContainer,
					elSelectWrapper = ui.elSelectWrapper;

				self._toggleMenuBound = toggleMenu.bind(null, self);
				self._changeOptionBound = changeOption.bind(null, self);
				self._onResizeBound = onResize.bind(null, self);
				self._nativeChangeOptionBound = nativeChangeOption.bind(null, self);
				self._focusBound = onFocus.bind(null, self);
				self._blurBound = onBlur.bind(null, self);

				elSelectWrapper.addEventListener("focus", self._focusBound);
				elSelectWrapper.addEventListener("blur", self._blurBound);
				if (!self.options.nativeMenu) {
					elSelectWrapper.addEventListener("vclick", self._toggleMenuBound);
					elOptionContainer.addEventListener("vclick", self._changeOptionBound);
					elOptionContainer.addEventListener("focusin", self._focusBound); // bubble
					elOptionContainer.addEventListener("focusout", self._blurBound); // bubble
					if (ui.screenFilter) {
						ui.screenFilter.addEventListener("vclick", self._toggleMenuBound);
					}
					window.addEventListener("throttledresize", self._onResizeBound, true);
				} else {
					ui.elSelect.addEventListener("change", self._nativeChangeOptionBound);
				}
			};

			/**
			 * Coordinate Option ul element
			 * @method _coordinateOption
			 * @return {String}
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._coordinateOption = function () {
				var self = this,
					offsetTop,
					offsetLeft,
					width,
					placeholderStyle = window.getComputedStyle(self._ui.elPlaceHolder, null),
					areaInfo,
					optionStyle,
					ui = self._ui,
					overLapValue,
					optionHeight = ui.elOptionContainer.offsetHeight,
					scrollTop = ui.elOptionContainer.parentNode.querySelector(".ui-scrollview-clip").scrollTop;

				self._offset = getOffsetOfElement(ui.elSelectWrapper, ui.page);
				areaInfo = self._chooseDirection();
				// the option list width is shorter than the placeholder.
				width = ui.elPlaceHolder.offsetWidth - (parseFloat(placeholderStyle.paddingLeft) * 2);
				// This part decides the location and direction of option list.
				offsetLeft = self._offset.left;
				overLapValue = areaInfo.overLapValue;
				optionStyle = "left: " + offsetLeft + "px; ";
				if (areaInfo.direction === "top") {
					offsetTop = 0;
					if (optionHeight < areaInfo.topArea) {
						offsetTop = self._offset.top - optionHeight + 1- scrollTop + overLapValue;
					}
					optionStyle += "top: " + offsetTop + "px; width: " + width + "px; max-height: " + (areaInfo.topArea + 1 + overLapValue) + "px;";
					ui.elOptionContainer.classList.add(classes.top);
					ui.elOptionContainer.classList.remove(classes.bottom);
				} else {
					offsetTop = self._offset.top + ui.elPlaceHolder.offsetHeight - 1 - scrollTop - overLapValue;
					optionStyle += "top: " + offsetTop + "px; width: " + width + "px; max-height: " + (areaInfo.belowArea + 1 + overLapValue) + "px;";
					ui.elOptionContainer.classList.add(classes.bottom);
					ui.elOptionContainer.classList.remove(classes.top);
				}
				return optionStyle;
			};

			/**
			 * Choose a spreading direction of option list and calculate area to display the option list
			 * @method _chooseDirection
			 * @return {Object}
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._chooseDirection = function () {
				var self = this,
					ui = self._ui,
					areaInfo = {
						belowArea : null,
						topArea : null,
						direction : null,
						overLapValue : null
					},
					currentOffset = self._offset;

				areaInfo.belowArea = ui.page.offsetHeight - currentOffset.top - ui.elPlaceHolder.offsetHeight + ui.content.scrollTop;
				areaInfo.topArea = currentOffset.top - ui.content.scrollTop;
				areaInfo.overLapValue = ui.elOptions[0].offsetHeight / 8;

				if ((areaInfo.belowArea < areaInfo.topArea) && (ui.elOptionContainer.offsetHeight > areaInfo.belowArea + areaInfo.overLapValue)) {
					areaInfo.direction = "top";
				} else {
					areaInfo.direction = "bottom";
				}
				return areaInfo;
			};

			/**
			 * Open and Close Option List
			 * @method _toggleSelect
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._toggleSelect = function () {
				var self = this,
					ui = self._ui,
					container = ui.elOptionContainer;

				if (self._isOpen) {
					if (ui.screenFilter) {
						ui.screenFilter.classList.add(classes.filterHidden);
					}
					container.removeAttribute("style");
					ui.elSelectWrapper.classList.remove(classes.active);
					container.classList.remove(classes.active);
					ui.elSelectWrapper.focus();
				} else {
					container.setAttribute("style", self._coordinateOption());
					if (ui.screenFilter) {
						ui.screenFilter.classList.remove(classes.filterHidden);
					}
					ui.elSelectWrapper.classList.add(classes.active);
					container.classList.add(classes.active);
					container.setAttribute("tabindex", "0");
					container.firstElementChild.focus();
				}
				self._isOpen = !self._isOpen;
			};

			/**
			 * Change Value of Select tag and Placeholder
			 * @method changeOption
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._changeOption = function () {
				var self = this,
					ui = self._ui,
					selectedOption = ui.elOptions[self._selectedIndex],
					previousOption = ui.elOptionContainer.querySelector("." + classes.selected),
					getData = domUtils.getNSData;

				if ((selectedOption !== previousOption) || (ui.elDefaultOption && (ui.elPlaceHolder.textContent === ui.elDefaultOption.textContent))) {
					ui.elPlaceHolder.textContent = selectedOption.textContent;
					ui.elSelect.value = getData(selectedOption, "value");
					if (ui.elSelect.value === "") {
						ui.elSelect.value = getData(previousOption, "value");
						ui.elPlaceHolder.textContent = previousOption.textContent;
						return;
					}
					eventUtils.trigger(ui.elSelect, "change");
					previousOption.classList.remove(classes.selected);
					selectedOption.classList.add(classes.selected);
				}
			};

			/**
			 * Destroy SelectMenu widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self._ui,
					elSelectWrapper = ui.elSelectWrapper,
					elOptionContainer = ui.elOptionContainer;

				elSelectWrapper.removeEventListener("focus", self._focusBound);
				elSelectWrapper.removeEventListener("blur", self._blurBound);
				if (!self.options.nativeMenu) {
					elSelectWrapper.removeEventListener("vclick", self._toggleMenuBound);
					elOptionContainer.removeEventListener("vclick", self._changeOptionBound);
					elOptionContainer.removeEventListener("focusin", self._focusBound);
					elOptionContainer.removeEventListener("focusout", self._blurBound);
					if (ui.screenFilter) {
						ui.screenFilter.removeEventListener("vclick", self._toggleMenuBound);
					}
					window.removeEventListener("throttledresize", self._onResizeBound, true);
				} else {
					ui.elSelect.removeEventListener("change", self._nativeChangeOptionBound);
				}
			};

			ns.widget.mobile.SelectMenu = SelectMenu;
			engine.defineWidget(
				"SelectMenu",
				"select:not([data-role='slider']):not([data-role='range']):not([data-role='toggleswitch']):not(.ui-toggleswitch):not(.ui-slider)" +
				", select.ui-select-menu:not([data-role='slider']):not([data-role='range']):not([data-role='toggleswitch'])",
				["open", "close"],
				SelectMenu,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.SelectMenu;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
