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
/*jslint nomen: true */
/**
 * #Select Menu Widget
 *
 * ##Default selectors
 * In default all elements with _data-role=select_ are changed to Tizen WebUI selectmenu.
 * Additionally elements with _data-native-menu=false_ will use custom popups for option selection
 *
 * ##Manual constructor
 * For manual creation of selectmenu widget you can use constructor of widget:
 *
 * ##Examples
 * #### Build widget from JavaScript
 *
 *		@example
 *		var element = document.getElementById('id'),
 *			ns.engine.instanceWidget(element, 'Selectmenu');
 *
 * #### Build widget from jQuery
 *
 *		@example
 *		var element = $('#id').selectmenu();
 *
 * ##HTML Examples
 *
 * ###Create simple selectmenu from div
 *
 *		@example
 *		<select id="selectmenu" data-native-menu="false">
 *			<option value="1">The 1st Option</option>
 *			<option value="2">The 2nd Option</option>
 *			<option value="3">The 3rd Option</option>
 *			<option value="4">The 4th Option</option>
 *		</select>
 *
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 * @class ns.widget.Selectmenu
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/theme",
			"../../../../core/event",
			"../../../../core/utils/selectors",
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
				selectors = ns.utils.selectors,
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
				zoom = ns.utils.zoom,
				Selectmenu = function () {
					this.options = {
						theme: 's',
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
						//preventFocusZoom: /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1,
						preventFocusZoom: false,
						initSelector: "select:not(:jqmData(role='slider'))",
						mini: false,
						heading: "h1,h2,h3,h4,h5,h6,legend,li"
					};
					this._eventHandlers = {};
				};

			Selectmenu.prototype = new BaseWidget();

			/**
			* @property {Object} classes Dictionary object containing commonly used wiget classes
			* @static
			* @member ns.widget.Selectmenu
			*/
			Selectmenu.classes = {
				uiSelect: 'ui-select',
				uiSelectMenu: 'ui-selectmenu',
				uiScreenHidden: 'ui-screen-hidden',
				uiHeader: 'ui-header',
				uiTitle: 'ui-title',
				uiPopupTitle: 'ui-popup-title',
				uiLiDivider: 'ui-li-divider',
				uiSelectmenuPlaceholder: 'ui-selectmenu-placeholder',
				uiBtnActive: 'ui-btn-active',
				uiDisabled: 'ui-disabled',

				uiBar: 'ui-bar-',
				uiBtnDown: 'ui-btn-down-'
			};

			/**
			* Add class to label marked for select
			* @method markLabelAsSelectmenu
			* @param {HTMLElement} element
			* @param {String} id
			* @private
			* @static
			* @member ns.widget.Selectmenu
			*/
			function markLabelAsSelectmenu(element, id) {
				var classes = Selectmenu.classes,
					children,
					i,
					l;
					
				children = selectors.getChildrenBySelector(element, '[for=' + id + ']');
				for (i = 0, l = children.length; i < l; i++) {
					children[i].classList.add(classes.uiSelect);
				}
			}

			/**
			* Find select option by provided value
			* @method findOptionByValue
			* @param {Object} options
			* @param {String} value
			* @return {HTMLElement}
			* @private
			* @static
			* @member ns.widget.Selectmenu
			*/
			function findOptionByValue(options, value) {
				return (options[0] && options[0].parentNode.querySelector('option[value="' + value + '"]')) || null;
			}

			/**
			* Update text of a select button
			* @method updateButtonText
			* @param {HTMLSelectElement} element
			* @param {Boolean} isNative
			* @private
			* @static
			* @member ns.widget.Selectmenu
			*/
			function updateButtonText(element, isNative) {
				var selectOptions = element.options,
					selectButtonText,
					buttonText,
					i,
					l;

				if (isNative) {
					selectButtonText = element.parentNode.querySelector("span > span");
				} else {
					selectButtonText = element.parentNode.querySelector("a > span > span");
				}
				
				for (i = 0, l = selectOptions.length; i < l; i++) {
					if (selectOptions[i].selected) {
						if (buttonText) {
							buttonText = buttonText + ', ' + selectOptions[i].text;
						} else {
							buttonText = selectOptions[i].text;
						}
					}
				}
				selectButtonText.innerHTML = buttonText;
			}

			/**
			* No-op function placeholder for native support
			* @method open
			* @public
			* @static
			* @member ns.widget.Selectmenu
			*/
			Selectmenu.prototype.open = function() {
				return null;
			};

			/**
			* No-op function placeholder for native support
			* @method close
			* @public
			* @static
			* @member ns.widget.Selectmenu
			*/
			Selectmenu.prototype.close = function() {
				return null;
			};

			/**
			* Set widget state to disabled
			* @method _disable
			* @protected
			* @member ns.widget.Selectmenu
			*/
			Selectmenu.prototype._disable = function() {
				var element = this.element,
					options = this.options,
					classes = Selectmenu.classes,
					parentElement = element.parentNode,
					button;

				if (options.nativeElement === false) {
					options.disabled = true;
					element.setAttribute('disabled', 'disabled');
					button = parentElement.querySelector('a');
					if (button) {
						button.setAttribute('aria-disabled', 'true');
						button.classList.add(classes.uiDisabled);
					}
				}
			};

			/**
			* Set widget state to enabled
			* @method _enable
			* @protected
			* @member ns.widget.Selectmenu
			*/
			Selectmenu.prototype._enable = function() {
				var element = this.element,
					options = this.options,
					classes = Selectmenu.classes,
					parentElement = element.parentNode,
					button;

				if (options.nativeElement === false) {
					options.disabled = false;
					element.removeAttribute('disabled');
					button = parentElement.querySelector('a');
					if (button) {
						button.setAttribute('aria-disabled', 'false');
						button.classList.remove(classes.uiDisabled);
					}
				}
			};

			/**
			* Build custom select popup list structure
			* @method _buildList
			* @protected
			* @member ns.widget.Selectmenu
			*/
			Selectmenu.prototype._buildList = function () {
				var classes = Selectmenu.classes,
					options = this.options,
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
					selectOption,
					selectOptionGroup,
					selectOptionGroupClassList,
					optGroup,
					selectOptionParent,
					selectLink,
					selectOptions,
					optLabel,
					selectCheckbox;

				popupDiv = document.createElement('div');

				popupHeader = document.createElement('div');
				popupHeaderClassList = popupHeader.classList;
				popupHeaderClassList.add(classes.uiBar + options.theme);
				popupHeaderClassList.add(classes.uiHeader);

				popupHeaderTitle = document.createElement('div');
				popupHeaderTitle.classList.add(classes.uiTitle);
				popupHeader.appendChild(popupHeaderTitle);
				popupHeader.setAttribute("data-role", "header");
				popupDiv.appendChild(popupHeader);

				selectOptions = element.options;

				listView = document.createElement('ul');
				listView.setAttribute('id', element.id + '-menu');
				listView.setAttribute("data-role", "listview");
				listView.setAttribute("aria-labelledby", element.id);

				// If too many elements - should be display as dialog
				if (options.isDialog) {
					popupDiv.setAttribute("data-role", "dialog");
					elementLabel = document.querySelector('[for="' + element.id + '"]');
					if (elementLabel) {
						popupHeaderTitle.appendChild( document.createTextNode( elementLabel.innerText ) );
					} else {
						popupHeaderTitle.appendChild( document.createTextNode( '' ) );
					}
					popupContent = document.createElement('div');
					popupContent.setAttribute("data-role", "content");
					popupContent.appendChild(listView);
					popupDiv.appendChild(popupContent);
				} else {
					popupDiv.setAttribute("data-role", "popup");
					popupHeaderClassList.add(classes.uiScreenHidden);
					popupHeaderClassList.add(classes.uiPopupTitle);
					popupDiv.classList.add(classes.uiSelectMenu);

					if (options.multiple) {
						popupHeaderButton = document.createElement('a');
						popupHeaderButton.setAttribute("data-role", "button");
						popupHeaderButton.setAttribute("data-rel", "back");
						popupHeader.appendChild(popupHeaderButton);
						engine.instanceWidget(popupHeaderButton, "Button", {
							icon: 'delete',
							inline: true,
							theme: options.theme
						});
					}
					popupDiv.appendChild(listView);
				}

				wrapper.appendChild(popupDiv);

				for (i = 0, l = selectOptions.length; i < l; i++) {
					if (selectOptions[i].text) {
						selectOption = document.createElement('li');

						// Are we inside an optgroup?
						selectOptionParent = selectOptions[i].parentNode;
						if ( selectOptionParent !== element && selectOptionParent.nodeName.toLowerCase() === "optgroup" ) {
							optLabel = selectOptionParent.getAttribute('label');
							if ( optLabel !== optGroup ) {
								selectOptionGroup = document.createElement('li');
								selectOptionGroup.setAttribute( "data-role", 'list-divider' );
								selectOptionGroup.setAttribute( "role", 'heading' );
								selectOptionGroupClassList = selectOptionGroup.classList;
								selectOptionGroupClassList.add(classes.uiLiDivider);
								selectOptionGroupClassList.add(classes.uiBar + options.theme);
								selectOptionGroup.appendChild( document.createTextNode( optLabel ) );
								listView.appendChild( selectOptionGroup );
								optGroup = optLabel;
							}
						}

						if (selectOptions[i].getAttribute("data-placeholder") || !selectOptions[i].getAttribute("value")) {
							popupHeaderTitle.appendChild(document.createTextNode(selectOptions[i].text));
							popupHeader.classList.remove(classes.uiScreenHidden);
							selectOption.classList.add(classes.uiSelectmenuPlaceholder);
						}
						if (selectOptions[i].getAttribute("disabled")) {
							selectOption.appendChild(document.createTextNode(selectOptions[i].text));
							selectOption.classList.add(classes.uiDisabled);
							// Is multiple ?
						} else if (element.getAttribute("multiple")) {
							selectLink = document.createElement('a');
							selectCheckbox = document.createElement('input');
							selectCheckbox.setAttribute("value", selectOptions[i].value);
							selectCheckbox.setAttribute("type", "checkbox");
							selectCheckbox.setAttribute("data-style", "check");
							selectLink.appendChild(selectCheckbox);
							selectLink.appendChild(document.createTextNode(selectOptions[i].text));
							selectOption.appendChild(selectLink);
							if (selectOptions[i].selected) {
								selectCheckbox.setAttribute('checked', 'checked');
							}
						} else {
							selectLink = document.createElement('a');
							selectLink.setAttribute("data-rel", "back");
							selectLink.appendChild(document.createTextNode(selectOptions[i].text));
							selectOption.setAttribute("data-option-index", i);
							selectOption.setAttribute("role", 'option');
							selectOption.appendChild(selectLink);
							if (selectOptions[i].selected) {
								selectOption.classList.add(classes.uiBtnActive);
							}
						}
						listView.appendChild(selectOption);
						if (selectCheckbox) {
							engine.instanceWidget(selectCheckbox, "Checkboxradio", {
								theme: options.theme
							});
							selectCheckbox = null;
						}
					}
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

				wrapper.firstChild.setAttribute('href', '#' + popupDiv.id);
			};

			/**
			* Build widget structure
			* @method _build
			* @protected
			* @param {HTMLSelectElement} element
			* @return {HTMLElement}
			* @member ns.widget.Selectmenu
			*/
			Selectmenu.prototype._build = function (element) {
				var classes = Selectmenu.classes,
					options = this.options,
					wrapper,
					selectParent,
					selectButton,
					selectOptionClassList;

				this.element = element;

				checkIsNative(element, options);

				if (!options.nativeElement) {
					selectParent = element.parentNode;
					selectParent.removeChild(element);
					markLabelAsSelectmenu(selectParent, element.id);

					wrapper = document.createElement('div');
					wrapper.classList.add(classes.uiSelect);
					selectParent.appendChild(wrapper);

					if (options.nativeMenu) {
						selectButton = document.createElement('div');
						selectButton.appendChild(document.createTextNode(' '));
						// data-theme attribute is not set when widget instance is created (Test #24)
						selectButton.setAttribute('data-theme', options.theme);
						wrapper.appendChild(selectButton);
						engine.instanceWidget(selectButton, "Button", {
							iconpos: options.iconpos,
							icon: options.icon,
							mini: options.mini,
							theme: options.theme
						});
						selectButton.appendChild(element);
						updateButtonText(element, options.nativeMenu);

						// fix for test #31 - weird that classes must be overritten
						selectOptionClassList = element.options[element.selectedIndex].classList;
						if (selectOptionClassList.length > 0) {
							selectButton.firstChild.firstChild.setAttribute('class', selectOptionClassList);
						}
					} else {
						selectButton = document.createElement('a');
						selectButton.appendChild(document.createTextNode(' '));
						// Fix for bad looking buttons in current theme - to be removed
						selectButton.classList.add('ui-btn-box-' + options.theme);
						// data-theme attribute is not set when widget instance is created (Test #24)
						selectButton.setAttribute('data-theme', options.theme);
						if (options.isDialog) {
							selectButton.setAttribute('data-rel', 'dialog');
						} else {
							selectButton.setAttribute('data-rel', 'popup');
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
			 * @member ns.widget.Selectmenu
			 */
			Selectmenu.prototype._configure = function (element) {
				var classes = Selectmenu.classes,
					options = this.options,
					i,
					l;

				// If all options are empty  - whole widget should stay native (test #27)
				for (i = 0, l = element.options.length; i < l; i++) {
					if (element.options[i].text) {
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
						options.isDialog = element.options.length >= options.elementsToDialog;
					}
				}
			};

			/**
			 * Check if select is inside popup or have 0 options and set proper options
			 * @method checkIsNative
			 * @param {HTMLSelectElement} element
			 * @param {Object} options
			 * @private
			 */
			function checkIsNative(element, options) {
				if (element.getAttribute('data-native-menu') === 'false') {
					options.nativeMenu = false;
				}
				// test #17 - if select is inside popup - should stay native even if data-native is set to false
				if (selectors.getParentsBySelectorNS(element,'role = "popup"').length > 0 || element.options.length === 0) {
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
			*/
			function selectItemClickHandler(element, options, classes, event) {
				var clickedElement = event.target,
					liClicked,
					indexClicked,
					activeButton,
					dialog,
					dialogWidget;

				liClicked = selectors.getParentsByTag(clickedElement, 'li')[0];
				indexClicked = liClicked.getAttribute("data-option-index");
				activeButton = liClicked.parentNode.querySelector('.' + classes.uiBtnActive);

				if (!options.multiple) {
					if (activeButton) {
						activeButton.classList.remove(classes.uiBtnActive);
					}
					liClicked.classList.add(classes.uiBtnActive);
					liClicked.setAttribute('aria-selected', 'true');
					element.options[element.selectedIndex].selected = false;
					element.options[indexClicked].selected = true;
					element.selectedIndex = indexClicked;
					updateButtonText(element, options.nativeMenu);
					if (options.isDialog) {
						dialog = document.getElementById(selectors.getChildrenByTag(element.parentNode, 'a')[0].hash.slice(1));
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
			*/
			function selectItemChangeHandler(element, options, event) {
				var selectedValue = event.target.value,
					selectedOption;

				selectedOption = findOptionByValue(element.options, selectedValue);
				selectedOption.selected = event.target.checked;

				updateButtonText(element, options.nativeMenu);
			}

			/**
			* Handler function for native widget mouse down
			* @method nativeSelectMouseDownHandler
			* @param {Object} options
			* @private
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
			*/
			function nativeSelectChangeHandler(element, options, classes) {
				var selectOption,
					selectButtonText,
					selectParent;

				selectOption = findOptionByValue(element.options, element.value);
				selectButtonText = selectOption.text;
				selectParent = element.parentNode;
				selectParent.firstChild.firstChild.innerText = selectButtonText;
				selectParent.classList.remove(classes.uiBtnDown + options.theme);
			}

			/**
			* Handler function for popup screen click
			* @method popupScreenClickHandler
			* @param {HTMLElement} element
			* @private
			*/
			function popupScreenClickHandler(element) {
				events.trigger(element.parentNode.firstChild, 'focus');
			}

			/**
			 * Handler function after popup open
			 * @method popupAfterOpenHandler
			 * @param {HTMLElement} popup
			 * @private
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
			 */
			function dialogButtonClickHandler(element, popup) {
				var elementLabel = document.querySelector('[for="' + element.id + '"]'),
					dialogHeader = selectors.getChildrenByClass(popup.firstChild, 'ui-header')[0];
				if (elementLabel) {
					dialogHeader.firstChild.innerHTML = elementLabel.innerText;
				}
			}

			/**
			* Bind widget events
			* @method _bindEvents
			* @protected
			* @param {HTMLElement} element
			* @member ns.widget.Selectmenu
			*/
			Selectmenu.prototype._bindEvents = function (element) {
				var options = this.options,
					classes = Selectmenu.classes,
					eventHandlers = this._eventHandlers,
					elementParent = element.parentNode,
					popup,
					popupContent,
					popupScreen,
					popupId;

				if (options.isDialog) {
					popupId = selectors.getChildrenByTag(element.parentNode, 'a')[0].getAttribute('href').slice(1);
					popup = document.getElementById(popupId);
					popupContent = selectors.getChildrenByClass(popup.firstChild, 'ui-content')[0];
				} else {
					popupId = elementParent.lastElementChild.id.replace('placeholder', '');
					popupScreen = document.getElementById(popupId + 'screen');
					popup = document.querySelector('[aria-labelledby="' + element.id + '"]');
				}

				eventHandlers.dialogButtonClick = dialogButtonClickHandler.bind(null, element, popup);
				eventHandlers.selectItemClick = selectItemClickHandler.bind(null, element, options, classes);
				eventHandlers.selectItemChange = selectItemChangeHandler.bind(null, element, options);
				eventHandlers.nativeSelectMouseDown = nativeSelectMouseDownHandler.bind(null, options);
				eventHandlers.nativeSelectMouseUp = nativeSelectMouseUpHandler.bind(null, options);
				eventHandlers.nativeSelectChange = nativeSelectChangeHandler.bind(null, element, options, classes);
				eventHandlers.popupScreenClick = popupScreenClickHandler.bind(null, element);
				eventHandlers.popupAfterOpen = popupAfterOpenHandler.bind(null, popup);

				if (!options.nativeElement) {
					if (options.nativeMenu) {
						element.parentNode.addEventListener('vmousedown', eventHandlers.nativeSelectMouseDown, false);
						element.parentNode.addEventListener('mouseup', eventHandlers.nativeSelectMouseUp, false);
						element.addEventListener('change', eventHandlers.nativeSelectChange, false);
					} else if (options.isDialog) {
						elementParent.addEventListener('click', eventHandlers.dialogButtonClick, false);
						popupContent.addEventListener('click', eventHandlers.selectItemClick, false);
						popupContent.addEventListener('change', eventHandlers.selectItemChange, false);
					} else {
						popup.addEventListener('click', eventHandlers.selectItemClick, false);
						popup.addEventListener('change', eventHandlers.selectItemChange, false);
						popupScreen.addEventListener('vclick', eventHandlers.popupScreenClick, false);
						popup.parentNode.addEventListener('popupafteropen', eventHandlers.popupAfterOpen, false);
					}
				}
				return element;
			};

			Selectmenu.prototype._init = function (element) {
				var options = this.options;

				checkIsNative(element, options);
			};

			/**
			* Refresh structure
			* @method _refresh
			* @protected
			* @member ns.widget.Selectmenu
			*/
			Selectmenu.prototype._refresh = function () {
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
							popupId = selectors.getChildrenByTag(element.parentNode, 'a')[0].hash.slice(1);
							popup = document.getElementById(popupId);
							popup.parentNode.removeChild(popup);
							this._buildList();
						} else {
							popupPlaceholder = elementParent.lastChild;
							elementParent.removeChild(popupPlaceholder);
							popupId = popupPlaceholder.id.replace('placeholder', '');
							popupScreen = document.getElementById(popupId + 'screen');
							popupScreen.parentNode.removeChild(popupScreen);
							popup = document.querySelector('[id = ' + popupId + 'popup]');
							popup.parentNode.removeChild(popup);
							this._buildList();
						}
					}
					updateButtonText(element, options.nativeMenu);
				}
			};

			/**
			* Destroy widget
			* @method _destroy
			* @protected
			* @member ns.widget.Selectmenu
			*/
			Selectmenu.prototype._destroy = function () {
				var element = this.element,
					options = this.options,
					parentNode = element.parentNode,
					eventHandlers = this._eventHandlers,
					popup,
					popupId,
					popupScreen;

				if (!options.nativeElement) {
					if (options.nativeMenu) {
						parentNode.removeEventListener('vmousedown', eventHandlers.nativeSelectMouseDown, false);
						parentNode.removeEventListener('mouseup', eventHandlers.nativeSelectMouseUp, false);
						element.removeEventListener('change', eventHandlers.nativeSelectChange, false);
					} else if (options.isDialog) {
						parentNode.removeEventListener('click', eventHandlers.dialogButtonClick, false);
						popupId = selectors.getChildrenByTag(parentNode, 'a')[0].hash.slice(1);
						popup = selectors.getChildrenByClass(document.getElementById(popupId).firstChild, 'ui-content')[0];
						popup.removeEventListener('click', eventHandlers.selectItemClick, false);
						popup.removeEventListener('change', eventHandlers.selectItemChange, false);
					} else {
						popupId = parentNode.lastChild.id.replace('placeholder', '');
						popupScreen = document.getElementById(popupId + 'screen');
						popup = document.querySelector('[aria-labelledby="' + element.id + '"]');
						popup.removeEventListener('click', eventHandlers.selectItemClick, false);
						popup.removeEventListener('change', eventHandlers.selectItemChange, false);
						popupScreen.removeEventListener('click', eventHandlers.popupScreenClick, false);
						popup.parentNode.removeEventListener('afteropen', eventHandlers.popupAfterOpen, false);
					}
				}
				events.trigger(document, 'destroyed', {
					widget: "Selectmenu",
					parent: parentNode
				});
			};

			// definition
			ns.widget.mobile.Selectmenu = Selectmenu;
			engine.defineWidget(
				"SelectMenu",
				"select:not([data-role='slider']):not([data-role='range']), .ui-selectmenu",
				['open', 'close'],
				Selectmenu,
				'mobile'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Selectmenu;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
