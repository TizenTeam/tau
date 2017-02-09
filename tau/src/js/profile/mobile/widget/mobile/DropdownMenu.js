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
 * #DropdownMenu Widget
 * DropdownMenu widget provide creating DropdownMenu widget in the form of dropdown list and managing its operation.
 *
 * ##Default selector
 * In default all select elements are changed to Tizen WebUI DropdownMenu.
 * Additionally elements with _data-native-menu=false_ will use custom popups for option selection
 *
 * ###  HTML Examples
 *
 * ####  Create DropdownMenu
 * Default value of data-native-menu attribute is true and it makes native DropdownMenu.
 * This widget also offers the possibility of having custom DropdownMenu.
 *
 *        @example
 *        <select data-native-menu="false">
 *            <option value="1">Item1</option>
 *            <option value="2">Item2</option>
 *            <option value="3">Item3</option>
 *            <option value="4">Item4</option>
 *        </select>
 *
 * ## Manual constructor
 * For manual creation of DropdownMenu widget you can use constructor of widget.
 *
 *        @example
 *        <select id="dropdownmenu" data-native-menu="false">
 *            <option value="1">Item1</option>
 *            <option value="2">Item2</option>
 *            <option value="3">Item3</option>
 *            <option value="4">Item4</option>
 *        </select>
 *        <script>
 *            var element = document.getElementById("dropdownmenu"),
 *                widget = tau.widget.DropdownMenu(element);
 *        </script>
 *
 *
 * ##Inline type
 * When data-inline attribute is set to true, width of the DropdownMenu is determined by its text. (Default is false.)
 *
 *            @example
 *            <select id="dropdownmenu" data-native-menu="false" data-inline="true">
 *                <option value="1">Item1</option>
 *                <option value="2">Item2</option>
 *                <option value="3">Item3</option>
 *                <option value="4">Item4</option>
 *            </select>
 *
 * ##Placeholder options
 * If you use <option> with data-placeholder="true" attribute, you can make a default placeholder.
 * Default value of data-hide-placeholder-menu-items attribute is true and data-placeholder option is hidden.
 * If you don't want that, you can use data-hide-placeholder-menu-items="false" attribute.
 *
 *        @example
 *        <select id="dropdownmenu" data-native-menu="false" data-hide-placeholder-menu-items="false">
 *            <option value="choose-one" data-placeholder="true">Choose an option</option>
 *            <option value="1">Item1</option>
 *            <option value="2">Item2</option>
 *            <option value="3">Item3</option>
 *            <option value="4">Item4</option>
 *        </select>
 *
 * ##Methods
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace: RECOMMEND
 *
 *        @example
 *        var element = document.getElementById("dropdownmenu"),
 *            widget = tau.widget.DropdownMenu(element);
 *        widget.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use: Support for backward compatibility
 *
 *        @example
 *        $(".selector").dropdownmenu("methodName", methodArgument1, methodArgument2, ...);
 *
 * - "open" - DropdownMenu open
 *
 *        @example
 *        var elDropdownMenu = document.getElementById("dropdownmenu"),
 *            widget = tau.widget.DropdownMenu(elDropdownMenu);
 *        widget.open();
 *
 * - "close" - DropdownMenu close
 *
 *        @example
 *        var elDropdownMenu = document.getElementById("dropdownmenu"),
 *            widget = tau.widget.DropdownMenu(elDropdownMenu);
 *        widget.close();
 *
 * - "refresh" - This method refreshs the DropdownMenu widget.
 *
 *        @example
 *        var elDropdownMenu = document.getElementById("dropdownmenu"),
 *            widget = tau.widget.DropdownMenu(elDropdownMenu);
 *        widget.refresh();
 *
 * @class ns.widget.mobile.DropdownMenu
 * @extends ns.widget.mobile.BaseWidgetMobile
 * @author Hagun Kim <hagun.kim@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
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
				DropdownMenu = function () {
					var self = this;
					/**
					 * @property {boolean} _isOpen Open/Close status of DropdownMenu
					 * @member ns.widget.mobile.DropdownMenu
					 */

					self._isOpen = false;
					self._isClosing = false;
					/**
					 * @property {number} _selectedIndex Index of selected option in DropdownMenu
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._selectedIndex = null;
					/**
					 * @property {Object} _ui Object with html elements connected with DropdownMenu
					 * @member ns.widget.mobile.DropdownMenu
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
					 * @property {boolean} [options.nativeMenu=true] Sets the DropdownMenu widget as native/custom type.
					 * @property {boolean} [options.inline=false] Sets the DropdownMenu widget as inline/normal type.
					 * @property {boolean} [options.hidePlaceholderMenuItems=true] Hide/Reveal the placeholder option in dropdown list of the DropdownMenu.
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self.options = {
						nativeMenu: true,
						inline: false,
						hidePlaceholderMenuItems: true
					};
					/**
					 * @property {Function|null} _toggleMenuBound callback for select action
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._toggleMenuBound = null;
					/**
					 * @property {Function|null} _changeOptionBound callback for change value
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._changeOptionBound = null;
					/**
					 * @property {Function|null} _onResizeBound callback for throttledresize
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._onResizeBound = null;
					/**
					 * @property {Function|null} _nativeChangeOptionBound callback for change value
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._nativeChangeOptionBound = null;
					/**
					 * @property {Function|null} _focusBound callback for focus action
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._focusBound = null;
					/**
					 * @property {Function|null} _blurBound callback for blur action
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._blurBound = null;
					// event callbacks
					self._callbacks = {};
				},
				/**
				 * Dictionary for DropdownMenu related css class names
				 * @property {Object} classes
				 * @member ns.widget.mobile.DropdownMenu
				 * @static
				 */
				classes = {
					selectWrapper: "ui-dropdownmenu",
					optionGroup: "ui-dropdownmenu-optiongroup",
					placeHolder: "ui-dropdownmenu-placeholder",
					optionList: "ui-dropdownmenu-options",
					optionsWrapper: "ui-dropdownmenu-options-wrapper",
					selected: "ui-dropdownmenu-selected",
					active: "ui-dropdownmenu-active",
					opening: "ui-dropdownmenu-options-opening",
					closing: "ui-dropdownmenu-options-closing",
					opened: "ui-dropdownmenu-options-opened",
					filter: "ui-dropdownmenu-overlay",
					filterHidden: "ui-dropdownmenu-overlay-hidden",
					disabled: "ui-dropdownmenu-disabled",
					widgetDisabled: "ui-disabled",
					inline: "ui-dropdownmenu-inline",
					native: "ui-dropdownmenu-native",
					top: "ui-dropdownmenu-options-top",
					bottom: "ui-dropdownmenu-options-bottom",
					focus: "ui-focus"
				},
				prototype = new BaseWidget();

			DropdownMenu.prototype = prototype;
			DropdownMenu.classes = classes;

			/**
			 * vclick to toggle menu event handler
			 * @method toggleMenu
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.DropdownMenu
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
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.DropdownMenu
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
			 * Change option in native DropdownMenu
			 * @method nativeChangeOption
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @member ns.widget.mobile.DropdownMenu
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
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function onResize(self, event) {
				if (self._isOpen === true) {
					self._isOpen = !self._isOpen;
					self._toggleSelect();
					event.stopPropagation();
					event.preventDefault();
				}
			}

			/**
			 * Function adds ui-focus class on focus
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.DropdownMenu
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
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.DropdownMenu
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
			 * Toggle enable/disable DropdownMenu
			 * @method setDisabledStatus
			 * @private
			 * @static
			 * @param {HTMLElement} element
			 * @param {Boolean} isDisabled
			 * @member ns.widget.mobile.DropdownMenu
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
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function convertOptionToHTML(option, isDisabled) {
				var className = option.className;

				if (isDisabled) {
					className += " " + classes.disabled;
				}
				return "<li data-value='" + option.value + "'" + (className ? " class='" + className + "'" : "") + (!isDisabled ? " tabindex='0'" : "") + ">" + option.textContent + "</li>";
			}

			/**
			 * Return offset of element
			 * @method getOffsetOfElement
			 * @private
			 * @static
			 * @param {HTMLElement} element
			 * @param {HTMLElement} container
			 * @return {Object}
			 * @member ns.widget.mobile.DropdownMenu
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
			 * Construct element of option of DropdownMenu
			 * @method constructOption
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @return {string}
			 * @member ns.widget.mobile.DropdownMenu
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
						 * <option> with data-placeholder="true" is hidden in DropdownMenu.
						 * It means that the <option> doesn't have to be DropdownMenu element.
						 */
						if (widgetOptions.hidePlaceholderMenuItems && getData(forElement, "placeholder")) {
							continue;
						}
						// normal <option> tag will be DropdownMenu element.
						options += convertOptionToHTML(forElement, isDisabled);
					} else if (tag === "OPTGROUP") {
						// for <optgroup> tag
						options += "<li class='" + classes.optionGroup + (isDisabled ? (" " + classes.disabled + "'") : "'") + ">" + forElement.label + "</li>";
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
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function findDataPlaceHolder(element) {
				return element.querySelector("option[data-placeholder='true']");
			}

			/**
			 * Check whether the type is Inline or not
			 * @method _checkInline
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
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
			 * Build structure of DropdownMenu widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._build = function (element) {
				this._generate(element, true);
				return element;
			};

			/**
			 * Generate Placeholder and Options elements for DropdownMenu
			 * @method _generate
			 * @param {HTMLElement} element
			 * @param {boolean} create
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._generate = function (element, create) {
				var self = this,
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
					elOptionWrapper,
					pageClasses = Page.classes;

				ui.elSelect = element;
				ui.page = selectors.getParentsByClass(element, pageClasses.uiPage)[0] || document.body;
				ui.content = selectors.getParentsByClass(element, pageClasses.uiContent)[0] || selectors.getParentsByClass(element, pageClasses.uiHeader)[0];
				ui.elDefaultOption = findDataPlaceHolder(element);

				self._selectedIndex = element.selectedIndex;

				if (create) {
					selectedOption = ui.elDefaultOption || element[element.selectedIndex];
					elSelectWrapper = document.createElement("div");
					elSelectWrapper.className = classes.selectWrapper;
					elSelectWrapper.id = elementId + "-dropdownmenu";

					elPlaceHolder = document.createElement("span");
					elPlaceHolder.id = elementId + "-placeholder";
					elPlaceHolder.className = classes.placeHolder;
					domUtils.insertNodesBefore(element, elSelectWrapper);
					elSelectWrapper.appendChild(elPlaceHolder);
					elSelectWrapper.appendChild(element);
					if (self.options.nativeMenu) {
						elSelectWrapper.classList.add(classes.native);
					} else {
						screenFilter = document.createElement("div");
						screenFilter.className = classes.filterHidden;
						screenFilter.classList.add(classes.filter);
						screenFilter.id = elementId + "-overlay";

						elOptionWrapper = document.createElement("div");
						elOptionWrapper.className = classes.optionsWrapper;
						elOptionWrapper.id = elementId + "-options-wrapper";

						elOptionContainer = document.createElement("ul");
						elOptionContainer.className = classes.optionList;
						elOptionContainer.id = elementId + "-options";

						elOptionWrapper.appendChild(elOptionContainer);

						fragment = document.createDocumentFragment();
						fragment.appendChild(screenFilter);
						fragment.appendChild(elOptionWrapper);
						ui.page.appendChild(fragment);
					}
				} else {
					selectedOption = element[element.selectedIndex];
					elSelectWrapper = document.getElementById(elementId + "-dropdownmenu");
					elPlaceHolder = document.getElementById(elementId + "-placeholder");
					elOptionWrapper = document.getElementById(elementId + "-options-wrapper");
					if (!self.options.nativeMenu) {
						screenFilter = document.getElementById(elementId + "-overlay");
						elOptionContainer = document.getElementById(elementId + "-options");
					}
				}

				elPlaceHolder.innerHTML = selectedOption.textContent;

				if (self.options.nativeMenu) {
					elOptions = element.querySelectorAll("option");
				} else {
					options = constructOption(self);
					elOptionContainer.innerHTML = options;
					elOptions = elOptionContainer.querySelectorAll("li[data-value]");
					elOptions[self._selectedIndex].classList.add(classes.selected);
				}

				elSelectWrapper.setAttribute("tabindex", "0");

				ui.elSelectWrapper = elSelectWrapper;
				ui.elPlaceHolder = elPlaceHolder;
				ui.elOptions = elOptions;
				ui.screenFilter = screenFilter;
				ui.elOptionContainer = elOptionContainer;
				ui.elOptionWrapper = elOptionWrapper;

				self._checkInline();

				return element;
			};

			/**
			 * Init of DropdownMenu widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui,
					elementId = element.id;

				if (!ui.elSelectWrapper) {
					ui.elSelectWrapper = document.getElementById(elementId + "-dropdownmenu");
					ui.elPlaceHolder = document.getElementById(elementId + "-placeholder");
					ui.elOptionWrapper = document.getElementById(elementId + "-options-wrapper");
					ui.elSelect = element;
					if (!self.options.nativeMenu) {
						ui.screenFilter = document.getElementById(elementId + "-overlay");
						ui.elOptionContainer = document.getElementById(elementId + "-options");
						ui.elOptions = ui.elOptionContainer.querySelectorAll("li[data-value]");
					}
				}
			};

			/**
			 * Refresh of DropdownMenu widget
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._refresh = function () {
				this._generate(this.element, false);
			};

			/**
			 * Enables widget
			 * @method _enable
			 *  @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._enable = function () {
				setDisabledStatus(this._ui.elSelectWrapper, false);
				domUtils.removeAttribute(this.element, "disabled");
			};

			/**
			 * Disables widget
			 * @method _disable
			 *  @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._disable = function () {
				setDisabledStatus(this._ui.elSelectWrapper, true);
				domUtils.setAttribute(this.element, "disabled", true);
			};

			/**
			 * Open DropdownMenu
			 * @method open
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype.open = function () {
				var self = this;

				if (self._isOpen === false) {
					self._toggleSelect();
				}
			};

			/**
			 * Close DropdownMenu
			 * @method close
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype.close = function () {
				var self = this;

				if (self._isOpen === true) {
					self._toggleSelect();
				}
			};

			/**
			 * Bind events of DropdownMenu widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
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
			 * @member ns.widget.mobile.DropdownMenu
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
					optionHeight = ui.elOptionContainer.offsetHeight,
					options = self.options,
					scrollTop = ui.elOptionWrapper.parentNode.querySelector(".ui-scrollview-clip").scrollTop,
					height;

				self._offset = getOffsetOfElement(ui.elSelectWrapper, ui.page);
				areaInfo = self._chooseDirection();
				// the option list width is shorter than the placeholder.
				width = ui.elPlaceHolder.offsetWidth - (parseFloat(placeholderStyle.paddingLeft) * 2) + "px;";
				height = optionHeight;
				// This part decides the location and direction of option list.
				offsetLeft = self._offset.left;
				optionStyle = "left: " + offsetLeft + "px; ";

				if (options.inline === true) {
					height = ui.elOptionContainer.children[0].offsetHeight * 5;
					width = "auto;";
				}

				if (areaInfo.direction === "top") {
					offsetTop = 0;
					if (height < areaInfo.topArea) {
						offsetTop = self._offset.top - height - scrollTop;
					} else {
						height = areaInfo.topArea;
					}
					ui.elOptionWrapper.classList.add(classes.top);
				} else {
					offsetTop = self._offset.top + ui.elPlaceHolder.offsetHeight - scrollTop;
					if (height > areaInfo.belowArea) {
						height = areaInfo.belowArea;
					}
					ui.elOptionWrapper.classList.add(classes.bottom);
				}
				optionStyle += "top: " + offsetTop + "px; width: " + width + " max-height: " + height + "px;";
				return optionStyle;
			};

			/**
			 * Choose a spreading direction of option list and calculate area to display the option list
			 * @method _chooseDirection
			 * @return {Object}
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._chooseDirection = function () {
				var self = this,
					ui = self._ui,
					areaInfo = {
						belowArea: 0,
						topArea: 0,
						direction: ""
					},
					currentOffset = self._offset;

				areaInfo.belowArea = ui.page.offsetHeight - currentOffset.top - ui.elPlaceHolder.offsetHeight + ui.content.scrollTop;
				areaInfo.topArea = currentOffset.top - ui.content.scrollTop;

				if ((areaInfo.belowArea < areaInfo.topArea) && (ui.elOptionContainer.offsetHeight > areaInfo.belowArea)) {
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
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._toggleSelect = function () {
				var self = this,
					ui = self._ui,
					optionContainer = ui.elOptionContainer,
					optionWrapperClassList = ui.elOptionWrapper.classList;

				if (self._isOpen && !optionWrapperClassList.contains(classes.opening)) {
					optionWrapperClassList.remove(classes.opened);
					self._callbacks.hideAnimationEnd = hideAnimationEndHandler.bind(null, self);
					eventUtils.prefixedFastOn(optionContainer, "animationEnd", self._callbacks.hideAnimationEnd, false);
					self._hide();
					ui.elSelectWrapper.focus();
				} else if (optionWrapperClassList.contains(classes.closing) || optionWrapperClassList.contains(classes.opening)) {
					return;
				} else {
					optionWrapperClassList.add(classes.opening);
					self._callbacks.showAnimationEnd = showAnimationEndHandler.bind(null, self);
					eventUtils.prefixedFastOn(optionContainer, "animationEnd", self._callbacks.showAnimationEnd, false);
					self._show();
				}
				self._isOpen = !self._isOpen;
			};

			/**
			 * Function animationEnd event handler when showing
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function showAnimationEndHandler(self) {
				var ui = self._ui;

				ui.elOptionWrapper.classList.add(classes.opened);
				eventUtils.prefixedFastOff(ui.elOptionContainer, "animationEnd", self._callbacks.showAnimationEnd, false);
				ui.elOptionWrapper.classList.remove(classes.opening);
			}

			/**
			 * Function animationEnd event handler when hiding
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function hideAnimationEndHandler(self) {
				var wrapper = self._ui.elOptionWrapper,
					wrapperClassList = wrapper.classList,
					optionContainer = self._ui.elOptionContainer;

				wrapperClassList.remove(classes.active);
				wrapper.removeAttribute("style");
				eventUtils.prefixedFastOff(optionContainer, "animationEnd", self._callbacks.hideAnimationEnd, false);
				wrapperClassList.remove(classes.closing);
				wrapperClassList.remove(classes.top);
				wrapperClassList.remove(classes.bottom);
			}

			/**
			 * Hide DropdownMenu options
			 * @method _hide
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._hide = function () {
				var self = this,
					ui = self._ui,
					wrapper = ui.elOptionWrapper;

				if (ui.screenFilter) {
					ui.screenFilter.classList.add(classes.filterHidden);
				}
				self._ui.elSelectWrapper.classList.remove(classes.active);
				wrapper.classList.add(classes.closing);
			};

			/**
			 * Show DropdownMenu options
			 * @method _hide
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._show = function () {
				var self = this,
					ui = self._ui,
					wrapper = ui.elOptionWrapper;

				wrapper.setAttribute("style", self._coordinateOption());
				if (ui.screenFilter) {
					ui.screenFilter.classList.remove(classes.filterHidden);
				}
				ui.elSelectWrapper.classList.add(classes.active);
				wrapper.classList.add(classes.active);
				wrapper.setAttribute("tabindex", "0");
				wrapper.firstElementChild.focus();
			};

			/**
			 * Change Value of Select tag and Placeholder
			 * @method changeOption
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
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
			 * Destroy DropdownMenu widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self._ui,
					elSelectWrapper = ui.elSelectWrapper,
					elOptionContainer = ui.elOptionContainer,
					screenFilter = ui.screenFilter;

				elSelectWrapper.removeEventListener("focus", self._focusBound);
				elSelectWrapper.removeEventListener("blur", self._blurBound);
				domUtils.replaceWithNodes(ui.elSelectWrapper, ui.elSelect);
				if (!self.options.nativeMenu) {
					elSelectWrapper.removeEventListener("vclick", self._toggleMenuBound);
					elOptionContainer.removeEventListener("vclick", self._changeOptionBound);
					elOptionContainer.removeEventListener("focusin", self._focusBound);
					elOptionContainer.removeEventListener("focusout", self._blurBound);
					ui.elOptionWrapper.parentNode.removeChild(ui.elOptionWrapper);
					if (screenFilter) {
						screenFilter.removeEventListener("vclick", self._toggleMenuBound);
						screenFilter.parentNode.removeChild(screenFilter);
					}
					window.removeEventListener("throttledresize", self._onResizeBound, true);
				} else {
					ui.elSelect.removeEventListener("change", self._nativeChangeOptionBound);
				}
				ui = null;
			};

			ns.widget.mobile.DropdownMenu = DropdownMenu;

			engine.defineWidget(
				"DropdownMenu",
				"select:not([data-role='slider']):not([data-role='range']):not([data-role='toggleswitch']):not(.ui-toggleswitch):not(.ui-slider)" +
				", select.ui-select-menu:not([data-role='slider']):not([data-role='range']):not([data-role='toggleswitch'])",
				["open", "close"],
				DropdownMenu,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.DropdownMenu;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
