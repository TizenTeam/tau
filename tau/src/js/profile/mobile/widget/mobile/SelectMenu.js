/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true */
/**
 * #Select Menu Widget
 * Widget extends UI of standard select element.
 *
 * ##Default selectors
 * In default all elements with _data-role=select_ or with calss .ui-select-menu
 * are changed to Tizen WebUI SelectMenu. Additionally elements with
 * _data-native-menu=false_ will use custom popups for option selection
 *
 * ###HTML Examples
 *
 * ####Create simple selectmenu from select
 *
 *		@example
 *		<select id="selectmenu" data-native-menu="false">
 *			<option value="1">The 1st Option</option>
 *			<option value="2">The 2nd Option</option>
 *			<option value="3">The 3rd Option</option>
 *			<option value="4">The 4th Option</option>
 *		</select>
 *
 *
 * ##Manual constructor
 * For manual creation of selectmenu widget you can use constructor of widget:
 *
 *		@example
 *		<select id="selectmenu" data-native-menu="false">
 *			<option value="1">The 1st Option</option>
 *			<option value="2">The 2nd Option</option>
 *		</select>
 *		<script>
 *			var element = document.getElementById("selectmenu");
 *			tau.widget.SelectMenu(element, {mini: true});
 *		</script>
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<select id="selectmenu" data-native-menu="false">
 *			<option value="1">The 1st Option</option>
 *			<option value="2">The 2nd Option</option>
 *		</select>
 *		<script>
 *			$("#selectmenu").selectmenu();
 *		</script>
 *
 *
 * ##Options for SelectMenu Widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ###Mini version
 * For a more compact version that is useful in toolbars and tight spaces, add
 * the data-mini="true" attribute to the selectmenu to create a mini version.
 * This will produce a selectmenu that is not as tall as the standard version
 * and has a smaller text size.
 *
 *		@example
 *		<select id="selectmenu" data-native-menu="false" data-mini="true">
 *			<option value="1">The 1st Option</option>
 *			<option value="2">The 2nd Option</option>
 *		</select>
 *
 * ###Inline SelectMenu
 * By default, all selectmenus in the body content are styled as block-level
 * elements so they fill the width of the screen. If value is "true" then
 * selectmenu has css property display = "inline"
 *
 *		@example
 *		<select id="selectmenu" data-native-menu="false" data-inline="true">
 *			<option value="1">The 1st Option</option>
 *			<option value="2">The 2nd Option</option>
 *		</select>
 *
 * ###Icon positioning
 * By default, all icons in selectmenus are placed to the left of the
 * selectmenu text. This default may be overridden using
 * the data-iconpos attribute.
 *
 *		@example
 *		<select id="selectmenu" data-icon="delete" data-iconpos="right">
 *			<option value="1">The 1st Option</option>
 *			<option value="2">The 2nd Option</option>
 *		</select>
 *
 * Possible values of data-iconpos:
 *
 *  - "left"  - creates the selectmenu with left-aligned icon
 *  - "right"  - creates the selectmenu with right-aligned icon
 *  - "top"  - creates the selectmenu with icon positioned above the text
 *  - "bottom"  - creates the selectmenu with icon positioned below the text
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<select id="selectmenu" data-icon="delete" data-iconpos="right">
 *			<option value="1">The 1st Option</option>
 *			<option value="2">The 2nd Option</option>
 *		</select>
 *		<script>
 *			var selectMenu = document.getElementById("selectmenu"),
 *				selectWidget = tau.widget.SelectMenu(selectMenu);
 *
 *			// selectWidget.methodName(methodArgument1, methodArgument2, ...);
 *			// for example
 *
 *			selectWidget.open();
 *		</script>
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		<select id="select" data-icon="delete" data-iconpos="right">
 *			<option value="1">The 1st Option</option>
 *			<option value="2">The 2nd Option</option>
 *		</select>
 *		<script>
 *			// $("#select").selectmenu("methodName", argument1, argument2, ...);
 *			// for example
 *
 *			$("#select").selectmenu("open")
 *		</script>
 *
 *
 *
 *
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @class ns.widget.mobile.SelectMenu
 * @extends ns.widget.mobile.BaseWidgetMobile
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/theme",
			"../../../../core/event",
			"../../../../core/util/selectors",
			"../../../../core/util/zoom",
			"../mobile",
			"./BaseWidgetMobile",
			"./Button"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} BaseWidget alias variable
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {Object} engine alias variable
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} events alias variable
				 * @private
				 * @static
				 */
				events = ns.event,
				/**
				 * @property {Object} selectors alias variable
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				/**
				 * @property {Object} themes alias variable
				 * @private
				 * @static
				 */
				themes = ns.theme,
				/**
				 * @property {Object} zoom alias variable
				 * @private
				 * @static
				 */
				zoom = ns.util.zoom,
				SelectMenu = function () {
				/**
				 * All possible widget options
				 * @property {Object} options
				 * @property {string} [options.theme="s"] theme of widget
				 * @property {boolean} [options.disabled=false] start widget
				 * as enabled / disabled
				 * @property {string} [options.icon="arrow-d"] sets the icon
				 * type to use with widget
				 * @property {"left"|"right"|"top"|"bottom"|null}
				 * [options.iconpos="right"] position of the icon
				 * in the select button
				 * @property {boolean} [options.inline=false] if value is "true"
				 * then selectmenu has css property display = "inline"
				 * @property {boolean} [options.corners=true] applies the theme
				 * button border-radius to the select button if set to true
				 * @property {boolean} [options.shadow=true] applies the drop
				 * shadow style to the select button if set to true
				 * @property {boolean} [options.iconshadow=true] set the theme
				 * shadow to the select button's icon if set to true
				 * @property {string} [options.overlayTheme="a"] sets the color
				 * of the overlay layer
				 * @property {boolean} [options.hidePlaceholderMenuItems=true]
				 * sets whether placeholder menu items are hidden
				 * @property {string} [options.closeText="Close"] customizes the
				 * text of the close button
				 * @property {boolean} [options.nativeMenu=true] when set to
				 * true, clicking the custom-styled select menu will open the
				 * native select menu which is best for performance
				 * @property {boolean} [options.nativeElement=true] when "true"
				 * is set then widget will use native elements
				 * @property {boolean} [options.multiple=false] framework will
				 * enhance the element.
				 * @property {number} [options.elementsToDialog=9] treshold to
				 * check if we have Dialog
				 * @property {boolean} [options.isDialog=false] If too many
				 * elements then we it should be set to "true" to be display
				 * as Dialog
				 * @property {boolean} [options.preventFocusZoom=false] this
				 * option disables page zoom temporarily when a custom select
				 * is focused
				 * @property {boolean} [options.mini=false] if set to true,
				 * this will display a more compact version of the selectmenu
				 * that uses less vertical height
				 * @property {string}
				 * [options.heading="h1,h2,h3,h4,h5,h6,legend,li"] heading
				 * @member ns.widget.mobile.SelectMenu
				 */
					this.options = {
						theme: "s",
						disabled: false,
						icon: "arrow-d",
						iconpos: "right",
						inline: false,
						corners: true,
						shadow: true,
						iconshadow: true,
						overlayTheme: "a",
						hidePlaceholderMenuItems: true,
						closeText: "Close",
						nativeMenu: true,
						// Custom options
						nativeElement: true,
						multiple: false,
						elementsToDialog: 9,
						isDialog : false,
						// This option defaults to true on iOS devices.
						//preventFocusZoom:
						// /iPhone|iPad|iPod/.test( navigator.platform ) &&
						//navigator.userAgent.indexOf( "AppleWebKit" ) > -1,
						preventFocusZoom: false,
						mini: false,
						heading: "h1,h2,h3,h4,h5,h6,legend,li"
					};
					this._eventHandlers = {};
				},
				classes = {
					uiSelect: "ui-select",
					uiSelectMenu: "ui-selectmenu",
					uiScreenHidden: "ui-screen-hidden",
					uiHeader: "ui-header",
					uiTitle: "ui-title",
					uiPopupTitle: "ui-popup-title",
					uiLiDivider: "ui-li-divider",
					uiSelectMenuPlaceholder: "ui-selectmenu-placeholder",
					uiBtnActive: "ui-btn-active",
					uiDisabled: "ui-disabled",
					uiBar: "ui-bar-",
					uiBtnDown: "ui-btn-down-"
				};

			SelectMenu.prototype = new BaseWidget();

			/**
			 * Classes Dictionary object containing commonly used wiget classes
			 * @property {Object} classes
			 * @static
			 * @member ns.widget.SelectMenu
			 * @readonly
			 */
			SelectMenu.classes = classes;

			/**
			 * Add class to label marked for select
			 * @method markLabelAsSelectMenu
			 * @param {HTMLElement} element
			 * @param {string} id
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function markLabelAsSelectMenu(element, id) {
				var children,
					i,
					l;

				children = selectors.getChildrenBySelector(element,
						"[for='" + id + "']");
				for (i = 0, l = children.length; i < l; i++) {
					children[i].classList.add(classes.uiSelect);
				}
			}

			/**
			 * Find select option by provided value
			 * @method findOptionByValue
			 * @param {Object} options
			 * @param {string} value
			 * @return {?HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function findOptionByValue(options, value) {
				options = options || [];

				return (options[0] && options[0].parentNode.querySelector(
						'option[value="' + value + '"]')) || null;
			}

			/**
			 * Update text of a selected button
			 * @method updateButtonText
			 * @param {HTMLSelectElement} element
			 * @param {boolean} isNative
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function updateButtonText(element, isNative) {
				var selectOptions = element.options,
					selectButtonText,
					buttonText,
					i,
					l;

				if (isNative) {
					selectButtonText =
						element.parentNode.querySelector("span > span");
				} else {
					selectButtonText =
						element.parentNode.querySelector("a > span > span");
				}
				for (i = 0, l = selectOptions.length; i < l; i++) {
					if (selectOptions[i].selected) {
						if (buttonText) {
							buttonText = buttonText + ", " +
									selectOptions[i].text;
						} else {
							buttonText = selectOptions[i].text;
						}
					}
				}
				selectButtonText.innerHTML = buttonText;
			}

			/**
			 * Build option in the Select tag
			 * @method buildOptions
			 * @param {HTMLElement} listView
			 * @param {HTMLElement} popupHeaderTitle
			 * @param {HTMLElement} popupHeader
			 * @param {HTMLElement} option
			 * @param {number} index
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function buildOptions(listView, popupHeaderTitle, popupHeader, option, index) {
				var options = this.options,
					element = this.element,

					selectOption,
					selectOptionParent,
					optLabel,
					optGroup,

					selectOptionGroup,
					selectOptionGroupClassList,
					selectCheckbox,
					selectLink;

				if (option.text) {
					selectOption = document.createElement("li");

					// Are we inside an optgroup?
					selectOptionParent = option.parentNode;
					if (selectOptionParent !== element &&
							selectOptionParent.nodeName.toLowerCase() ===
								"optgroup") {

						optLabel = selectOptionParent.getAttribute("label");
						if (optLabel !== optGroup) {
							selectOptionGroup = document.createElement("li");
							selectOptionGroup.setAttribute("data-role",
									"list-divider");
							selectOptionGroup.setAttribute("role", "heading");
							selectOptionGroupClassList =
									selectOptionGroup.classList;
							selectOptionGroupClassList.add(
									classes.uiLiDivider);
							selectOptionGroupClassList.add(
									classes.uiBar + options.theme);
							selectOptionGroup.appendChild(
									document.createTextNode(optLabel));
							listView.appendChild(selectOptionGroup);
							optGroup = optLabel;
						}
					}

					if (option.getAttribute("data-placeholder") ||
								!option.getAttribute("value")) {
						popupHeaderTitle.appendChild(document.createTextNode(
								option.text));
						popupHeader.classList.remove(classes.uiScreenHidden);
						selectOption.classList.add(
								classes.uiSelectMenuPlaceholder);
					}
					if (option.getAttribute("disabled")) {
						selectOption.appendChild(document.createTextNode(
								option.text));
						selectOption.classList.add(classes.uiDisabled);
						// Is multiple ?
					} else if (element.getAttribute("multiple")) {
						selectLink = document.createElement("a");
						selectCheckbox = document.createElement("input");
						selectCheckbox.setAttribute("value", element.value);
						selectCheckbox.setAttribute("type", "checkbox");
						selectCheckbox.setAttribute("data-style", "check");
						selectLink.appendChild(selectCheckbox);
						selectLink.appendChild(document.createTextNode(
								option.text));
						selectOption.appendChild(selectLink);
						if (option.selected) {
							selectCheckbox.setAttribute("checked", "checked");
						}
					} else {
						selectLink = document.createElement("a");
						selectLink.setAttribute("data-rel", "back");
						selectLink.appendChild(document.createTextNode(
								option.text));
						selectOption.setAttribute("data-option-index", index);
						selectOption.setAttribute("role", "option");
						selectOption.appendChild(selectLink);
						if (option.selected) {
							selectOption.classList.add(classes.uiBtnActive);
						}
					}
					listView.appendChild(selectOption);
					if (selectCheckbox) {
						engine.instanceWidget(selectCheckbox, "Checkboxradio",
								{theme: options.theme}
						);
						selectCheckbox = null;
					}
				}
			}

			/**
			 * Open the select menu
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			var select = document.getElementById("select"),
			 *				selectWidget = tau.widget.SelectMenu(select);
			 *
			 *			selectWidget.open();
			 *		</script>
			 *
			 *####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			$( "#select" ).selectmenu( "open" );
			 *		</script>
			 *
			 * @method open
			 * @member ns.widget.mobile.SelectMenu
			 */
			SelectMenu.prototype.open = function() {
				// @TODO
				//needs implementation;
				return null;
			};

			/**
			 * Close the select menu
			 *
			 * Method removes disabled attribute on selectmenu and changes
			 * look of selectmenu to enabled state.
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			var select = document.getElementById("select"),
			 *				selectWidget = tau.widget.SelectMenu(select);
			 *
			 *			selectWidget.close();
			 *		</script>
			 *
			 *####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			$( "#select" ).selectmenu( "close" );
			 *		</script>
			 *
			 * @method close
			 * @member ns.widget.mobile.SelectMenu
			 */
			SelectMenu.prototype.close = function() {
				// @TODO
				//needs implementation;
				return null;
			};

			/**
			 * Disable the selectmenu
			 *
			 * Method sets disabled attribute on selectmenu and changes
			 * look of selectmenu to disabled state.
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			var select = document.getElementById("select"),
			 *				selectWidget = tau.widget.SelectMenu(select);
			 *
			 *			selectWidget.disable();
			 *		</script>
			 *
			 *####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			$( "#select" ).selectmenu( "disable" );
			 *		</script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.SelectMenu
			 */

			/**
			 * Set widget state to disabled
			 * @method _disable
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			SelectMenu.prototype._disable = function() {
				var element = this.element,
					options = this.options,
					parentElement = element.parentNode,
					button;

				if (options.nativeElement === false) {
					options.disabled = true;
					element.setAttribute("disabled", "disabled");
					button = parentElement.querySelector("a");
					if (button) {
						button.setAttribute("aria-disabled", "true");
						button.classList.add(classes.uiDisabled);
					}
				}
			};

			/**
			 * Enable the selectmenu
			 *
			 * Method removes disabled attribute on selectmenu and changes
			 * look of selectmenu to enabled state.
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			var select = document.getElementById("select"),
			 *				selectWidget = tau.widget.SelectMenu(select);
			 *
			 *			selectWidget.enable();
			 *		</script>
			 *
			 *####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			$( "#select" ).selectmenu( "enable" );
			 *		</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.SelectMenu
			 */

			/**
			 * Set widget state to enabled
			 * @method _enable
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			SelectMenu.prototype._enable = function() {
				var element = this.element,
					options = this.options,
					parentElement = element.parentNode,
					button;

				if (options.nativeElement === false) {
					options.disabled = false;
					element.removeAttribute("disabled");
					button = parentElement.querySelector("a");
					if (button) {
						button.setAttribute("aria-disabled", "false");
						button.classList.remove(classes.uiDisabled);
					}
				}
			};

			/**
			 * Build custom select popup list structure
			 * @method _buildList
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			SelectMenu.prototype._buildList = function () {
				var options = this.options,
					element = this.element,
					wrapper = element.parentNode,
					i,
					l,

					popupDiv,
					popupHeader,
					popupHeaderClassList,
					popupHeaderTitle,
					popupHeaderButton,
					popupContent,
					elementLabel,

					listView,
					selectOptions;

				popupDiv = document.createElement("div");

				popupHeader = document.createElement("div");
				popupHeaderClassList = popupHeader.classList;
				popupHeaderClassList.add(classes.uiBar + options.theme);
				popupHeaderClassList.add(classes.uiHeader);

				popupHeaderTitle = document.createElement("div");
				popupHeaderTitle.classList.add(classes.uiTitle);
				popupHeader.appendChild(popupHeaderTitle);
				popupHeader.setAttribute("data-role", "header");
				popupDiv.appendChild(popupHeader);

				selectOptions = element.options;

				listView = document.createElement("ul");
				listView.setAttribute("id", element.id + "-menu");
				listView.setAttribute("data-role", "listview");
				listView.setAttribute("aria-labelledby", element.id);

				// If too many elements - should be display as dialog
				if (options.isDialog) {
					popupDiv.setAttribute("data-role", "dialog");
					elementLabel = document.querySelector('[for="' +
							element.id + '"]');
					if (elementLabel) {
						popupHeaderTitle.appendChild(document.createTextNode(
								elementLabel.innerText));
					} else {
						popupHeaderTitle.appendChild(
								document.createTextNode(""));
					}
					popupContent = document.createElement("div");
					popupContent.setAttribute("data-role", "content");
					popupContent.appendChild(listView);
					popupDiv.appendChild(popupContent);
				} else {
					popupDiv.setAttribute("data-role", "popup");
					popupHeaderClassList.add(classes.uiScreenHidden);
					popupHeaderClassList.add(classes.uiPopupTitle);
					popupDiv.classList.add(classes.uiSelectMenu);

					if (options.multiple) {
						popupHeaderButton = document.createElement("a");
						popupHeaderButton.setAttribute("data-role", "button");
						popupHeaderButton.setAttribute("data-rel", "back");
						popupHeader.appendChild(popupHeaderButton);
						engine.instanceWidget(popupHeaderButton, "Button", {
							icon: "delete",
							inline: true,
							theme: options.theme
						});
					}
					popupDiv.appendChild(listView);
				}

				wrapper.appendChild(popupDiv);

				buildOptions = buildOptions.bind(this, listView, popupHeaderTitle, popupHeader)
				for (i = 0, l = selectOptions.length; i < l; i++) {
					buildOptions(selectOptions[i], i);
				}

				engine.instanceWidget(listView, "Listview", {
					theme: options.theme
				});

				if (options.isDialog) {
					engine.instanceWidget(popupDiv, "Dialog", {
						shadow: options.shadow,
						corners: options.corners,
						theme: options.theme
					});
				} else {
					engine.instanceWidget(popupDiv, "Popup", {
						shadow: options.shadow,
						corners: options.corners,
						theme: options.theme
					});
				}

				wrapper.firstChild.setAttribute("href", "#" + popupDiv.id);
			};

			/**
			 * Build widget structure
			 * @method _build
			 * @protected
			 * @param {HTMLSelectElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.SelectMenu
			 */
			SelectMenu.prototype._build = function (element) {
				var options = this.options,
					wrapper,
					selectParent,
					selectButton,
					selectOptionClassList;

				this.element = element;

				checkIsNative(element, options);

				if (!options.nativeElement) {
					selectParent = element.parentNode;
					selectParent.removeChild(element);
					markLabelAsSelectMenu(selectParent, element.id);

					wrapper = document.createElement("div");
					wrapper.classList.add(classes.uiSelect);
					selectParent.appendChild(wrapper);

					if (options.nativeMenu) {
						selectButton = document.createElement("div");
						selectButton.appendChild(document.createTextNode(" "));
						// data-theme attribute is not set when widget
						// instance is created (Test #24)
						selectButton.setAttribute("data-theme", options.theme);
						wrapper.appendChild(selectButton);
						engine.instanceWidget(selectButton, "Button", {
							iconpos: options.iconpos,
							icon: options.icon,
							mini: options.mini,
							theme: options.theme
						});
						selectButton.appendChild(element);
						updateButtonText(element, options.nativeMenu);

						// fix for test #31 - weird that classes must
						// be overritten
						selectOptionClassList =
							element.options[element.selectedIndex].classList;
						if (selectOptionClassList.length > 0) {
							selectButton.firstChild.firstChild.setAttribute(
									"class", selectOptionClassList);
						}
					} else {
						selectButton = document.createElement("a");
						selectButton.appendChild(document.createTextNode(" "));
						// Fix for bad looking buttons in current theme
						// - to be removed
						selectButton.classList.add("ui-btn-box-"
								+ options.theme);
						// data-theme attribute is not set when widget
						// instance is created (Test #24)
						selectButton.setAttribute("data-theme", options.theme);
						if (options.isDialog) {
							selectButton.setAttribute("data-rel", "dialog");
						} else {
							selectButton.setAttribute("data-rel", "popup");
						}
						wrapper.appendChild(selectButton);
						engine.instanceWidget(selectButton, "Button", {
							iconpos: options.iconpos,
							icon: options.icon,
							inline: options.inline,
							mini: options.mini,
							theme: options.theme
						});
						wrapper.appendChild(element);
						updateButtonText(element, options.nativeMenu);
						this._buildList();
					}
				}

				return element;
			};

			/**
			 * Configure widget options
			 * @method _configure
			 * @protected
			 * @param {HTMLSelectElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.SelectMenu
			 */
			SelectMenu.prototype._configure = function (element) {
				var options = this.options,
					elementOptions = element.options || [],
					i,
					l;

				// If all options are empty  - whole widget should
				// stay native (test #27)
				for (i = 0, l = elementOptions.length; i < l; i++) {
					if (elementOptions[i].text) {
						options.nativeElement = false;
						break;
					}
				}

				if (!options.nativeElement) {
					options.multiple = !!element.getAttribute("multiple");
					options.disabled = !!element.getAttribute("disabled");
					options.theme = themes.getInheritedTheme(element);

					checkIsNative(element, options);
					if (!options.nativeMenu) {
						options.isDialog = elementOptions.length >=
							options.elementsToDialog;
					}
				}
			};

			/**
			 * Check if select is inside popup or have 0 options and
			 * set proper options
			 * @method checkIsNative
			 * @param {HTMLSelectElement} element
			 * @param {Object} options
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function checkIsNative(element, options) {
				if (element.getAttribute("data-native-menu") === "false") {
					options.nativeMenu = false;
				}
				// test #17 - if select is inside popup - should stay
				// native even if data-native is set to false
				if (selectors.getParentsBySelectorNS(
						element,'role = "popup"').length > 0 ||
							(element.options && element.options.length === 0)) {
					options.nativeMenu = true;
				}
			}

			/**
			 * Handler function for clicking on widget menu element
			 * @method selectItemClickHandler
			 * @param {HTMLSelectElement} element
			 * @param {Object} options
			 * @param {Object} classes
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function selectItemClickHandler(element, options, event) {
				var clickedElement = event.target,
					liClicked,
					indexClicked,
					activeButton,
					dialog,
					dialogWidget;

				liClicked = selectors.getParentsByTag(clickedElement, "li")[0];
				indexClicked = liClicked.getAttribute("data-option-index");
				activeButton = liClicked.parentNode.querySelector("."
						+ classes.uiBtnActive);

				if (!options.multiple) {
					if (activeButton) {
						activeButton.classList.remove(classes.uiBtnActive);
					}
					liClicked.classList.add(classes.uiBtnActive);
					liClicked.setAttribute("aria-selected", "true");
					element.options[element.selectedIndex].selected = false;
					element.options[indexClicked].selected = true;
					element.selectedIndex = indexClicked;
					updateButtonText(element, options.nativeMenu);
					if (options.isDialog) {
						dialog = document.getElementById(selectors.getChildrenByTag(
								element.parentNode, "a")[0].hash.slice(1));
						dialogWidget = engine.getBinding(dialog);
						// Fix for jqm test #14
						dialogWidget.close();
					}
				}
			}

			/**
			 * Handler function for checkbox click in widget menu
			 * @method selectItemChangeHandler
			 * @param {HTMLSelectElement} element
			 * @param {Object} options
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function selectItemChangeHandler(element, options, event) {
				var selectedValue = event.target.value,
					selectedOption;

				selectedOption = findOptionByValue(element.options,
						selectedValue);
				selectedOption.selected = event.target.checked;

				updateButtonText(element, options.nativeMenu);
			}

			/**
			* Handler function for native widget mouse down
			 * @method nativeSelectMouseDownHandler
			 * @param {Object} options
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function nativeSelectMouseDownHandler(options) {
				if ( options.preventFocusZoom ) {
					zoom.disable(true);
				}
			}

			/**
			 * Handler function for native widget mouse up
			 * @method nativeSelectMouseUpHandler
			 * @param {Object} options
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function nativeSelectMouseUpHandler(options) {
				if ( options.preventFocusZoom ) {
					zoom.enable(true);
				}
			}

			/**
			 * Handler function for native widget selection changed
			 * @method nativeSelectChangeHandler
			 * @param {HTMLSelectElement} element
			 * @param {Object} options
			 * @param {Object} classes
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function nativeSelectChangeHandler(element, options, classes) {
				var selectOption,
					selectButtonText,
					selectParent;

				selectOption = findOptionByValue(element.options,
						element.value);
				selectButtonText = selectOption.text;
				selectParent = element.parentNode;
				selectParent.firstChild.firstChild.innerText
						= selectButtonText;
				selectParent.classList.remove(classes.uiBtnDown
						+ options.theme);
			}

			/**
			* Handler function for popup screen click
			 * @method popupScreenClickHandler
			 * @param {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function popupScreenClickHandler(element) {
				events.trigger(element.parentNode.firstChild, "focus");
			}

			/**
			 * Handler function after popup open
			 * @method popupAfterOpenHandler
			 * @param {HTMLElement} popup
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function popupAfterOpenHandler(popup) {
				popup.firstChild.focus();
			}

			/**
			 * Handler function on dialog button click
			 * @method dialogButtonClickHandler
			 * @param {HTMLElement} element
			 * @param {HTMLElement} popup
			 * @private
			 * @static
			 * @member ns.widget.mobile.SelectMenu
			 */
			function dialogButtonClickHandler(element, popup) {
				var elementLabel = document.querySelector('[for="' +
						element.id + '"]'),
						dialogHeaderTitle = popup.querySelector("." + classes.uiTitle);

				if (elementLabel) {
					dialogHeaderTitle.innerHTML = elementLabel.innerText;
				}
			}

			/**
			* Bind widget events
			 * @method _bindEvents
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.SelectMenu
			 */
			SelectMenu.prototype._bindEvents = function (element) {
				var options = this.options,
					eventHandlers = this._eventHandlers,
					elementParent = element.parentNode,
					popup,
					popupContent,
					popupScreen,
					popupId;

				if (options.isDialog) {
					popupId = selectors.getChildrenByTag(element.parentNode,
							"a")[0].getAttribute("href").slice(1);
					popup = document.getElementById(popupId);
					popupContent = selectors.getChildrenByClass(
							popup.firstChild, "ui-content")[0];
				} else {
					popupId = elementParent.lastElementChild.id.replace(
							"placeholder", "");
					popupScreen = document.getElementById(popupId + "screen");
					popup = document.querySelector('[aria-labelledby="'
							+ element.id + '"]');
				}

				eventHandlers.dialogButtonClick =
						dialogButtonClickHandler.bind(null, element, popup);
				eventHandlers.selectItemClick =
						selectItemClickHandler.bind(null, element, options);
				eventHandlers.selectItemChange =
						selectItemChangeHandler.bind(null, element, options);
				eventHandlers.nativeSelectMouseDown =
						nativeSelectMouseDownHandler.bind(null, options);
				eventHandlers.nativeSelectMouseUp =
						nativeSelectMouseUpHandler.bind(null, options);
				eventHandlers.nativeSelectChange =
						nativeSelectChangeHandler.bind(null, element, options,
								classes);
				eventHandlers.popupScreenClick =
						popupScreenClickHandler.bind(null, element);
				eventHandlers.popupAfterOpen = popupAfterOpenHandler.bind(null,
						popup);

				if (!options.nativeElement) {
					if (options.nativeMenu) {
						element.parentNode.addEventListener("vmousedown",
								eventHandlers.nativeSelectMouseDown, false);
						element.parentNode.addEventListener("mouseup",
								eventHandlers.nativeSelectMouseUp, false);
						element.addEventListener("change",
								eventHandlers.nativeSelectChange, false);
					} else if (options.isDialog) {
						elementParent.addEventListener("click",
								eventHandlers.dialogButtonClick, false);
						popupContent.addEventListener("click",
								eventHandlers.selectItemClick, false);
						popupContent.addEventListener("change",
								eventHandlers.selectItemChange, false);
					} else {
						popup.addEventListener("click",
								eventHandlers.selectItemClick, false);
						popup.addEventListener("change",
								eventHandlers.selectItemChange, false);
						popupScreen.addEventListener("vclick",
								eventHandlers.popupScreenClick, false);
						popup.parentNode.addEventListener("popupafteropen",
								eventHandlers.popupAfterOpen, false);
					}
				}
				return element;
			};

			/**
			 * Initialize options for widget
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.SelectMenu
			 */
			SelectMenu.prototype._init = function (element) {
				var options = this.options;
				checkIsNative(element, options);
			};

			/**
			 * Refresh a selectmenu markup.
			 *
			 * This method will rebuild while DOM structure of widget.
			 *
			 * This method should be called after are manually change in HTML
			 * attributes of widget DOM structure.
			 *
			 * This method is called automatically after change any option
			 * of widget.
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			var select = document.getElementById("select"),
			 *				selectWidget = tau.widget.SelectMenu(select);
			 *			selectWidget.refresh();
			 *		</script>
			 *
			 *####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			$( "#select" ).selectmenu( "refresh" );
			 *		</script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.SelectMenu
			 */

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			SelectMenu.prototype._refresh = function () {
				var options = this.options,
					element = this.element,
					elementParent = element.parentNode,
					popupPlaceholder,
					popupId,
					popupScreen,
					popup;

				if (options.nativeElement === false) {
					if (!options.nativeMenu) {
						if (options.isDialog) {
							popupId = selectors.getChildrenByTag(
									element.parentNode, "a")[0].hash.slice(1);
							popup = document.getElementById(popupId);
							popup.parentNode.removeChild(popup);
							this._buildList();
						} else {
							popupPlaceholder = elementParent.lastChild;
							elementParent.removeChild(popupPlaceholder);
							popupId = popupPlaceholder.id.replace(
									"placeholder", "");
							popupScreen = document.getElementById(
									popupId + "screen");
							popupScreen.parentNode.removeChild(
									popupScreen);
							popup = document.getElementById(popupId + "popup");
							popup.parentNode.removeChild(popup);
							this._buildList();
						}
					}
					updateButtonText(element, options.nativeMenu);
				}
			};

			/**
			 * Removes the selectmenu functionality completely.
			 *
			 * This will return the element back to its pre-init state.
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			var select = document.getElementById("select"),
			 *				selectWidget = tau.widget.SelectMenu(select);
			 *			selectWidget.destroy();
			 *		</script>
			 *####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="select" data-native-menu="false">
			 *			<option value="1">The 1st Option</option>
			 *			<option value="2">The 2nd Option</option>
			 *		</select>
			 *		<script>
			 *			$( "#select" ).selectmenu( "destroy" );
			 *		</script>
			 *
			 * @method destroy
			 * @member ns.widget.mobile.SelectMenu
			 */

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.SelectMenu
			 */
			SelectMenu.prototype._destroy = function () {
				var element = this.element,
					options = this.options,
					parentNode = element.parentNode,
					eventHandlers = this._eventHandlers,
					popup,
					popupId,
					popupScreen;

				if (!options.nativeElement) {
					if (options.nativeMenu) {
						parentNode.removeEventListener("vmousedown",
								eventHandlers.nativeSelectMouseDown, false);
						parentNode.removeEventListener("mouseup",
								eventHandlers.nativeSelectMouseUp, false);
						element.removeEventListener("change",
								eventHandlers.nativeSelectChange, false);
					} else if (options.isDialog) {
						parentNode.removeEventListener("click",
								eventHandlers.dialogButtonClick, false);
						popupId = selectors.getChildrenByTag(parentNode,
								"a")[0].hash.slice(1);
						popup = selectors.getChildrenByClass(
								document.getElementById(popupId).firstChild,
										"ui-content")[0];
						popup.removeEventListener("click",
								eventHandlers.selectItemClick, false);
						popup.removeEventListener("change",
								eventHandlers.selectItemChange, false);
					} else {
						popupId = parentNode.lastChild.id.replace(
								"placeholder", "");
						popupScreen = document.getElementById(
								popupId + "screen");
						popup = document.querySelector('[aria-labelledby="'
								+ element.id + '"]');
						popup.removeEventListener("click",
								eventHandlers.selectItemClick, false);
						popup.removeEventListener("change",
								eventHandlers.selectItemChange, false);
						popupScreen.removeEventListener("click",
								eventHandlers.popupScreenClick, false);
						popup.parentNode.removeEventListener("afteropen",
								eventHandlers.popupAfterOpen, false);
					}
				}
				events.trigger(document, "destroyed", {
					widget: "SelectMenu",
					parent: parentNode
				});
			};

			// definition
			ns.widget.mobile.SelectMenu = SelectMenu;
			engine.defineWidget(
				"SelectMenu",
				"select:not([data-role='slider']):not([data-role='range']):not([data-role='toggleswitch'])," +
				".ui-select-menu",
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
