/*global window, define, ns, setTimeout, clearTimeout */
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
/*jslint nomen: true, plusplus: true */
/**
 * # Button Widget
 * Button widget changes default browser buttons to special buttons with additional opportunities like icon, corners, shadow.
 *
 * ## Default selectors
 * In default all **BUTTON** tags and all **INPUT** tags with type equals _button_, _submit_ or _reset_ are change to Tizen WebUI buttons.
 * In addition all elements with _data-role=button_ and class _ui-btn_ are changed to Tizen Web UI buttons.
 * To prevent auto enhance element to Tizen Web UI buttons you can use _data-role=none_ attribute on **BUTTON** or **INPUT** element.
 *
 * ###HTML Examples
 *
 * ####Create simple button from link using data-role
 *
 *		@example
 *		<a href="#page2" data-role="button">Link button</a>
 *
 * ####Create simple button from link using class selector
 *
 *		@example
 *		<a href="#page2" class="ui-btn">Link button</a>
 *
 * ####Create simple button using button's tag
 *
 *		@example
 *		<button>Button element</button>
 *
 * ####Create simple button from input using type
 *
 *		@example
 *		<input type="button" value="Button" />
 *		<input type="submit" value="Submit Button" />
 *		<input type="reset" value="Reset Button" />
 *
 * ## Manual constructor
 * For manual creation of button widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		var buttonElement = document.getElementById("button"),
 *			button = tau.widget.button(buttonElement, {mini: true});
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*. Second parameter is **options** and it is a object with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		var button = $("#button").button({mini: true});
 *
 * jQuery Mobile constructor has one optional parameter is **options** and it is a object with options for widget.
 *
 * ##Options for Button Widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ###Mini version
 * For a more compact version that is useful in toolbars and tight spaces, add the data-mini="true" attribute to the button to create a mini version. This will produce a button that is not as tall as the standard version and has a smaller text size.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-mini="true">Link button</a>
 *
 *
 * ###Inline buttons
 * By default, all buttons in the body content are styled as block-level elements so they fill the width of the screen. However, if you want a more compact button that is only as wide as the text and icons inside, add the data-inline="true" attribute to the button.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-inline="true">Cancel</a>
 *
 * If you have multiple buttons that should sit side-by-side on the same line, add the data-inline="true" attribute to each button. This will style the buttons to be the width of their content and float the buttons so they sit on the same line.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-inline="true">Cancel</a>
 *		<a href="index.html" data-role="button" data-inline="true" data-theme="b">Save</a>
 *
 * ###Icon positioning
 * By default, all icons in buttons are placed to the left of the button text. This default may be overridden using the data-iconpos attribute.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-icon="delete" data-iconpos="right">Delete</a>
 *
 * Possible values of data-iconpos:<br>
 *
 *  - "left"  - creates the button with left-aligned icon<br>
 *  - "right"  - creates the button with right-aligned icon<br>
 *  - "top"  - creates the button with icon positioned above the text<br>
 *  - "bottom"  - creates the button with icon positioned below the text
 *
 * You can also create an icon-only button, by setting the data-iconpos attribute to notext. The button plugin will hide the text on-screen, but add it as a title attribute on the link to provide context for screen readers and devices that support tooltips.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-icon="delete" data-iconpos="notext">Delete</a>
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		var buttonElement = document.getElementById("button"),
 *			button = tau.widget.button(buttonElement, "Button");
 *
 *		button.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		$(".selector").button("methodName", methodArgument1, methodArgument2, ...);
 *
 * @class ns.widget.mobile.Button
 * @extends ns.widget.BaseWidget
 * @author Grzegorz Osimowicz <g.osimowicz@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Marcin Jakuszko <m.jakuszko@samsung.com>
 * @author Piotr Gorny <p.gorny2@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 * @author Sergiusz Struminski <s.struminski@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function(document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/selectors",
			"../../../../core/util/object",
			"../../../../core/util/DOM/manipulation",
			"../../../../core/event/vmouse",
			"../../../../core/theme",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile"
		],
		function() {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				selectorsUtils = ns.util.selectors,
				themes = ns.theme,
				Button = function Button() {
					var self = this;

					self.action = "";
					self.label = null;
					self.options = {};
					self.ui = {};
				},
				classes = {
					uiDisabled: "ui-disabled",
					uiBtn: "ui-btn",
					uiBtnUpThemePrefix: "ui-btn-up-",
					uiBtnHoverThemePrefix: "ui-btn-hover-",
					uiBtnDownThemePrefix: "ui-btn-down-",
					uiShadow: "ui-shadow",
					uiBtnCornerAll: "ui-btn-corner-all",
					uiBtnHidden: "ui-btn-hidden",
					uiBtnBoxThemePrefix: "ui-btn-box-",
					uiBtnTextPaddingPrefix: "ui-btn-text-padding-",
					uiBtnCornerCircle: "ui-btn-corner-circle",
					uiBtnHastxt: "ui-btn-hastxt",
					uiBtnIconNobg: "ui-btn-icon-nobg",
					uiBtnIconOnly: "ui-btn-icon_only",
					uiBtnIconOnlyInner: "ui-btn-icon-only",
					uiBtnRound: "ui-btn-round",
					uiMini: "ui-mini",
					uiBtnInline: "ui-btn-inline",
					uiBtnBlock: "ui-btn-block",
					uiIcon: "ui-icon",
					uiIconPrefix: "ui-icon-",
					uiIconShadow: "ui-icon-shadow",
					uiBtnIconPositionPrefix: "ui-btn-icon-",
					uiLink: "ui-link",
					uiBtnInner: "ui-btn-inner",
					uiBtnText: "ui-btn-text",
					uiFocus: "ui-focus",
					uiBtnEdit: "ui-btn-edit",
					uiBtnLeft: "ui-btn-left",
					uiBtnRight: "ui-btn-right",
					uiSubmit: "ui-submit",
					uiBtnActive: "ui-btn-active",
					uiBtnIconNotext: "ui-btn-icon-notext"
				},
				eventsAdded = false,
				prototype = new BaseWidget();

			prototype.options = {
				theme: null,
				icon: null,
				iconpos: null,
				inline: null,
				shadow: true,
				iconshadow: true,
				corners: false,
				mini: null,
				bar: false,
				style: null,
				wrapperEls: "span"
			};

				Button.prototype = prototype;

			/**
			 * @property {Object} classes Dictionary for button related css class names
			 * @member ns.widget.mobile.Button
			 * @static
			 * @readonly
			 */
			Button.classes = classes;

			/**
			 * @property {number} hoverDelay=0
			 * @member ns.widget.mobile.Button
			 * @static
			 */
			Button.hoverDelay = 0;

			// Return not disabled button element which is the closest to element and has div container
			// @method closestEnabledButtonInDiv
			// @param {HTMLElement} element
			// @return {HTMLElement}
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function closestEnabledButtonInDiv(element) {
				var div = selectorsUtils.getClosestBySelector(element, "." + classes.uiBtn + ":not(." + classes.uiDisabled + ")"),
					button;
				if (div) {
					button = selectorsUtils.getChildrenByClass(div, classes.uiBtnHidden);
					if (button.length) {
						div = button[0];
					}
				}
				return div;
			}

			// Return not disabled button element which is the closest to element
			// @method closestEnabledButton
			// @param {HTMLElement} element
			// @return {HTMLElement}
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function closestEnabledButton(element) {
				return selectorsUtils.getClosestBySelector(element, "." + classes.uiBtn + ":not(." + classes.uiDisabled + ")");
			}

			// Add class ui-focus to target element of event
			// @method onFocus
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onFocus(event) {
				var button = closestEnabledButton(event.target);
				if (button) {
					button.classList.add(classes.uiFocus);
				}
			}

			// Remove class ui-focus from target element of event
			// @method onBlur
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onBlur(event) {
				var button = closestEnabledButton(event.target);
				if (button) {
					button.classList.remove(classes.uiFocus);
				}
			}

			// Function removes button up theme class and adds button up
			// @method addDownClass
			// @param {ns.widget.mobile.Button}
			// @private
			// @static
			function addDownClass(instance) {
				var theme = instance.options.theme,
					buttonClassList = instance.ui.container.classList;
				buttonClassList.remove(classes.uiBtnUpThemePrefix + theme);
				buttonClassList.add(classes.uiBtnDownThemePrefix + theme);
			}

			// Function fires on mouse down event
			// @method onMouseDown
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onMouseDown(event) {
				var button = closestEnabledButtonInDiv(event.target),
					instance;

				if (button) {
					instance = engine.getBinding(button, "Button");
					if (instance) {
						if (Button.hoverDelay) {
							instance.timeout = setTimeout(addDownClass.bind(null, instance), Button.hoverDelay);
						} else {
							addDownClass(instance);
						}
					}
				}
			}

			// Function fires on mouse up event
			// @method onMouseUp
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onMouseUp(event) {
				var button = closestEnabledButtonInDiv(event.target),
					instance,
					buttonClassList,
					theme;
				if (button) {
					instance = engine.getBinding(button, "Button");
					if (instance) {
						if (instance.timeout) {
							clearTimeout(instance.timeout);
						}
						theme = instance.options.theme;
						buttonClassList = instance.ui.container.classList;
						buttonClassList.add(classes.uiBtnUpThemePrefix + theme);
						buttonClassList.remove(classes.uiBtnDownThemePrefix + theme);
					}
				}
			}

			// Function fires on mouse over event
			// @method onMouseOver
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onMouseOver(event) {
				var button = closestEnabledButtonInDiv(event.target),
					instance,
					buttonClassList,
					theme;
				if (button) {
					instance = engine.getBinding(button, "Button");
					if (instance) {
						theme = instance.options.theme;
						buttonClassList = instance.ui.container.classList;
						buttonClassList.add(classes.uiBtnHoverThemePrefix + theme);
						buttonClassList.remove(classes.uiBtnUpThemePrefix + theme);
					}
				}
			}

			// Function fires on mouse out event
			// @method onMouseOut
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onMouseOut(event) {
				var button = closestEnabledButtonInDiv(event.target),
					instance,
					buttonClassList,
					theme;
				if (button) {
					instance = engine.getBinding(button, "Button");
					if (instance) {
						theme = instance.options.theme;
						buttonClassList = instance.ui.container.classList;
						buttonClassList.add(classes.uiBtnUpThemePrefix + theme);
						buttonClassList.remove(classes.uiBtnHoverThemePrefix + theme);
					}
				}
			}

			// Add events to all buttons
			// @method addGlobalEvents
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function addGlobalEvents() {
				if (!eventsAdded) {
					document.addEventListener("focus", onFocus, true);
					document.addEventListener("focusin", onFocus, true);
					document.addEventListener("blur", onBlur, true);
					document.addEventListener("focusout", onBlur, true);
					document.addEventListener("vmousedown", onMouseDown, true);
					document.addEventListener("vmouseup", onMouseUp, true);
					document.addEventListener("vmousecancel", onMouseUp, true);
					document.addEventListener("vmouseup", onMouseUp, true);
					document.addEventListener("touchend", onMouseUp, true);
					document.addEventListener("touchcancel", onMouseUp, true);
					document.addEventListener("vmouseover", onMouseOver, true);
					document.addEventListener("focus", onMouseOver, true);
					document.addEventListener("vmouseout", onMouseOut, true);
					document.addEventListener("blur", onMouseOut, true);
					document.addEventListener("scrollstart", onMouseOut, true);
					eventsAdded = true;
				}
			}

			// Removes disabled attributes and removes uiDisabled class
			// @method enableElement
			// @param {HTMLElement} element html element to enable
			// @param {HTMLElement} divElement html container of element to enable
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function enableElement(element, divElement) {
				if (element) {
					divElement.removeAttribute("disabled");
					element.setAttribute("aria-disabled", false);
					element.classList.remove(classes.uiDisabled);
				}
			}

			// Adds disabled attributes and uiDisabled class
			// @method disableElement
			// @param {HTMLElement} element html element to disable
			// @param {HTMLElement} divElement html container of element to disable
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function disableElement(element, divElement) {
				if (element) {
					divElement.setAttribute("disabled", "disabled");
					element.setAttribute("aria-disabled", true);
					element.classList.add(classes.uiDisabled);
				}
			}

			/**
			 * Configure button widget
			 * @method _configure
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._configure = function (element) {
				var prototypeOptions = prototype.options,
					options;
				/**
				 * @property {object} options All possible widget options
				 * @property {?string} [options.theme=null] theme of widget
				 * @property {?string} [options.icon=null] icon type
				 * @property {"left"|"right"|"top"|"bottom"|null} [options.iconpos=null] position of icon
				 * @property {?string} [options.inline=null] if value is "true" then button has css property display = "inline"
				 * @property {boolean} [options.shadow=true] shadow of button
				 * @property {boolean} [options.iconshadow=true] shadow of button's icon
				 * @property {boolean} [options.corners=false] corners of button
				 * @property {?boolean} [options.mini=null] size of button
				 * @property {boolean} [options.bar=false] if button is part of bar then you should set true
				 * @property {"circle"|"nobg"|null} [options.style=null] style of button
				 * @property {"span"|"div"} [options.wrapperEls="span"] wrapper tag name of button
				 * @member ns.widget.mobile.Button
				 */
				ns.util.object.merge(this.options, prototypeOptions);

				options = this.options;

				// Set theme
				options.theme = themes.getInheritedTheme(element, (prototypeOptions && prototypeOptions.theme) || "s");

			};

			/**
			 * Remove all classes started from given prefix
			 * @method removePrefixesClasses
			 * @param {DOMTokenList} classList
			 * @param {string} prefix
			 * @private
			 * @static
			 * @member ns.widget.mobile.Button
			 */
			function removePrefixesClasses(classList, prefix) {
				var classListLength = classList.length,
					className;
				while (classListLength-- > 0) {
					className = classList.item(classListLength);
					if (className.indexOf(prefix) === 0) {
						classList.remove(className);
					}
				}
			}

			/**
			 * Method clear all classes depends from options before set new options
			 * @method _clearClasses
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._clearClasses = function (element) {
				var ui = this.ui,
					textClassList = ui.buttonText.classList,
					innerClassList = ui.inner.classList,
					elementClassList = element.classList;

				removePrefixesClasses(textClassList, classes.uiBtnTextPaddingPrefix);

				innerClassList.remove(classes.uiBtnIconOnlyInner);

				elementClassList.remove(classes.uiBtnIconOnly);
				removePrefixesClasses(elementClassList, classes.uiIconPositionPrefix);
			};

			/**
			 * Method to reset icon from button
			 * @method _resetIcon
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._resetIcon = function () {
				var ui = this.ui,
					iconElement = ui.icon;
				if (iconElement) {
					iconElement.parentElement.removeChild(iconElement);
					ui.icon = null;
				}
			};

			/**
			 * Set icon shadow classes
			 * @method _setIconShadow
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setIconShadow = function () {
				if (this.options.iconshadow) {
					this.ui.icon.classList.add(classes.uiIconShadow);
				}
			};

			/**
			 * Set icon position classes
			 * @method _setIconPos
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setIconPos = function (element) {
				var self = this,
					ui = self.ui,
					optionIconpos = self.options.iconpos || "left",
					innerText = element.value || element.textContent,
					innerTextLength = innerText.length;

				element.classList.add(classes.uiBtnIconPositionPrefix + optionIconpos);

				if (innerTextLength > 0) {
					ui.buttonText.classList.add(classes.uiBtnTextPaddingPrefix + optionIconpos);
				}
			};

			/**
			 * Set title for button without showing text
			 * @method _setTitleForIcon
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setTitleForIcon = function (element) {
				var self = this,
					elementTagName = element.tagName.toLowerCase(),
					options = self.options,
					buttonText = self.ui.buttonText;
				// Add title to element if button not has text.
				if (options.iconpos === "notext" && !element.getAttribute("title")) {
					element.setAttribute("title", element.textContent);
				}
				if (!buttonText.innerHTML.length && elementTagName !== "label") {
					self._setValue(element, options.icon.replace("naviframe-", ""));
				}
			};

			/**
			 * Create icon element and set correct classes
			 * @method _createIcon
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._createIcon = function mobileButtonCreateIcon() {
				var iconElement = document.createElement("span"),
					iconElementClassList = iconElement.classList,
					ui = this.ui;

				iconElement.innerHTML = "&#160;";

				// Set icon classes
				iconElementClassList.add(classes.uiIcon);
				iconElementClassList.add(classes.uiIconPrefix + this.options.icon);

				// Add icon element to DOM
				ui.inner.appendChild(iconElement);
				ui.icon = iconElement;
			};

			/**
			 * Set text classes connected with icon
			 * @method _setIconTextOnly
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setIconTextOnly = function (element) {
				var innerText = element.value || element.textContent,
					innerTextLength = innerText.length,
					elementClassList = element.classList,
					innerClassList = this.ui.inner.classList;

				if (!innerTextLength) {
					elementClassList.add(classes.uiBtnIconOnly);
					innerClassList.add(classes.uiBtnIconOnlyInner);
				}
			};

			/**
			 * Set class has text if is any text to show in button
			 * @method _setHasText
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setHasText = function (element) {
				var innerText = element.value || element.textContent,
					innerTextLength = innerText.length,
					innerClassList = this.ui.inner.classList;
				if (innerTextLength > 0) {
					innerClassList.add(classes.uiBtnHastxt);
				}
			};

			/**
			 * Method to create/rebuild icon element in button
			 * @method _buildIcon
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._buildIcon = function (element) {
				var self = this;

				//Set icon options
				if (self.options.icon) {
					self._setIconPos(element);
					self._setIconTextOnly(element);
					self._createIcon();
					self._setIconShadow();
					self._setTitleForIcon(element);
				}
			};

			/**
			* Build structure of button widget
			* @method _build
			* @param {HTMLElement|HTMLInputElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._build = function (element) {
				var self = this,
					ui = self.ui,
					attributes = {
						"disabled": element.getAttribute("disabled")
					},
					buttonInner,
					buttonText,
					buttonIcon,
					buttonStyle,
					buttonClassList,
					buttonClassArray = [],
					elementTagName,
					innerClass = classes.uiBtnInner,
					textClass = classes.uiBtnText,
					options = this.options,
					buttonValue,
					buttonInnerHTML,
					container,
					innerTextLength,
					label,
					prototypeOptions = prototype.options,
					i;

				// Create default structure of button
				buttonInner = document.createElement(options.wrapperEls);
				buttonInner.id = element.id + "-div-inner";
				buttonText = document.createElement(options.wrapperEls);
				buttonText.id = element.id + "-div-text";

				this.ui.buttonText = buttonText;

				elementTagName = element.tagName.toLowerCase();
				buttonClassList = element.classList;

				if (elementTagName === "input" && element.type === "button") {
					options.corners = true;
				}
				buttonClassArray.push(classes.uiBtn, classes.uiBtnUpThemePrefix + options.theme);
				if (options.shadow) {
					buttonClassArray.push(classes.uiShadow);
				}
				if (options.corners) {
					buttonClassArray.push(classes.uiBtnCornerAll);
				}

				buttonInnerHTML = element.innerHTML;
				buttonValue = element.value;

				buttonStyle = options.style;

				if (elementTagName === "a") {
					container = element;
				} else {
					if (elementTagName === "button" || elementTagName === "input") {
						buttonClassList.add(classes.uiBtnHidden);
						container = document.createElement("div");
						container.setAttribute("id", element.id + "-div-container");

						if (buttonClassList.contains(classes.uiBtnRight)) {
							container.classList.add(classes.uiBtnRight);
						} else if (buttonClassList.contains(classes.uiBtnLeft)) {
							container.classList.add(classes.uiBtnLeft);
						}
						if (element.type === "submit" || element.type === "reset") {
							container.classList.add(classes.uiSubmit);
						}
					} else {
						container = element;
					}

					label = document.querySelector("label[for='" + element.id + "']");
					if (label) {
						label.classList.add(classes.uiSubmit);
					}
				}

				container.setAttribute("tabindex", 0);
				if ((element.getAttribute("data-role") === "button" && !options.bar) || (elementTagName !== "a")) {
					buttonClassArray.push(classes.uiBtnBoxThemePrefix + options.theme);
				}

				innerTextLength = element.textContent.length || (element.value ? element.value.length : 0);

				switch (buttonStyle) {
				case "circle":
					if (innerTextLength > 0) {
						buttonClassArray.push(classes.uiBtnRound);
					} else {
						buttonClassArray.push(classes.uiBtnCornerCircle, classes.uiBtnIconOnly);
						if (options.icon) {
							// Style: no text, Icon only
							innerClass += " " + classes.uiBtnCornerCircle;
						} else {
							buttonClassArray.push(classes.uiBtnRound);
						}
					}
					break;
				case "nobg":
					buttonClassArray.push(classes.uiBtnIconNobg, classes.uiBtnIconOnly);
					if (options.icon && innerTextLength <= 0) {
						// Style: no text, Icon only, no background
						innerClass += " " + classes.uiBtnIconNobg;
					}
					break;
				case "edit":
					buttonClassArray.push(classes.uiBtnEdit);
					break;
				case "round":
					buttonClassArray.push(classes.uiBtnRound);
					break;
					default:
				}

				// Used to control styling in headers/footers, where buttons default to `mini` style.
				if (options.mini) {
					buttonClassArray.push(classes.uiMini);
				}

				// Used to control styling in headers/footers, where buttons default to `inline` style.
				if (options.inline !== null) {
					buttonClassArray.push(options.inline ? classes.uiBtnInline : classes.uiBtnBlock);
				}

				// Default disable element
				if (attributes.disabled) {
					disableElement(element, container);
				} else {
					enableElement(element, container);
				}

				innerClass += options.corners ? " "  + classes.uiBtnCornerAll : "";

				// Copy classes of structure
				buttonClassList = container.classList;
				buttonClassList.remove(classes.uiLink);

				// Copy all classes from buttonClassArray to buttonClassList
				i = buttonClassArray.length;
				while (--i >= 0) {
					buttonClassList.add(buttonClassArray[i]);
				}

				buttonInner.className = innerClass;
				buttonText.className = textClass;
				buttonInner.appendChild(buttonText);

				// copy inner structure of button to new tag
				while (element.firstChild) {
					buttonText.appendChild(element.firstChild);
				}

				if (elementTagName === "button" || elementTagName === "input") {
					ns.util.DOM.replaceWithNodes(element, container);
					container.appendChild(buttonInner);
					container.appendChild(element);
					if (buttonInnerHTML) {
						container.firstChild.firstChild.innerHTML = buttonInnerHTML;
						element.innerHTML = buttonInnerHTML;
					} else {
						container.firstChild.firstChild.textContent = buttonValue;
						element.value = buttonValue;
					}
				} else {
					element.appendChild(buttonInner);
				}

				ui.inner = buttonInner;

				self._setHasText(element);
				self._buildIcon(element);

				return element;
			};

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._init = function (element) {
				var container = document.getElementById(element.id + "-div-container");
				if (!container) {
					container = element;
				}
				this.ui.container = container;
				this.ui.buttonText = document.getElementById(element.id + "-div-text");
				this.ui.inner = document.getElementById(element.id + "-div-inner");
			};

			/**
			* Bind events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._bindEvents = function () {
				addGlobalEvents();
			};

			/**
			 * Enable the button
			 *
			 * Method removes disabled attribute on button and changes look of button to enabled state.
			 *
			 *      @example
			 *      var buttonWidget = tau.widget.Button(document.getElementById("button"));
			 *      buttonWidget.enable();
			 *
			 *      // or
			 *
			 *      $( "#button" ).button( "enable" );
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.Button
			 */

			/**
			* Enable button
			* @method _enable
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._enable = function (element) {
				if (element) {
					enableElement(element, this.ui.container);
				}
			};

			/**
			 * Get or set value
			 *
			 * Return inner text of button or set text on button
			 *
			 *      @example
			 *      var buttonWidget = tau.widget.Button(document.getElementById("button")),
			 *          value = buttonWidget.value(); // value contains inner text of button
			 *
			 *      buttonWidget.value( "New text" ); // "New text" will be text of button
			 *
			 *      // or
			 *
			 *      $( "#button" ).button( "value" ); // value contains inner text of button
			 *
			 *      $( "#button" ).button( "value", "New text" ); // "New text" will be text of button
			 *
			 * @method value
			 * @param {string} [value] Value to set on button
			 * @return {string} In get mode return inner text of button.
			 * @since 2.3
			 * @member ns.widget.mobile.Button
			 */

			/**
			 * Get value of button
			 * @method _getValue
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._getValue = function () {
				return this.ui.buttonText.innerText;
			};

			/**
			 * Set value of button
			 * @method _setValue
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setValue = function (element, value) {
				var elementTagName;
				element = element || this.element;
				elementTagName = element.tagName.toLowerCase();

				this.ui.buttonText.innerText = value;

				if (elementTagName === "button" || elementTagName === "input") {
					element.innerText = value;
					element.value = value;
				}
			};

			/**
			 * Disable the button
			 *
			 * Method sets disabled attribute on button and changes look of button to disabled state.
			 *
			 *      @example
			 *      var buttonWidget = tau.widget.Button(document.getElementById("button"));
			 *      buttonWidget.disable();
			 *
			 *      // or
			 *
			 *      $( "#button" ).button( "disable" );
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.Button
			 */

			/**
			* Disable button
			* @method _disable
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._disable = function (element) {
				if (element) {
					disableElement(element, this.ui.container);
				}
			};

			/**
			 * Refresh a button markup.
			 *
			 * This method will rebuild while DOM structure of widget.
			 *
			 * This method should be called after are manually change in HTML attributes of widget DOM structure.
			 *
			 * This method is called automatically after change any option of widget.
			 *
			 *      @example
			 *      var buttonWidget = tau.widget.Button(document.getElementById("button"));
			 *      buttonWidget.refresh();
			 *
			 *      // or
			 *
			 *      $( "#button" ).button( "refresh" );
			 *
			 *      // also will be called after
			 *
			 *      buttonWidget.option("mini", true);
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.Button
			 */

			/**
			* Refresh button
			* @method _refresh
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._refresh = function () {
				var self = this,
					element = self.element,
					container = self.ui.container,
					tagName = element.tagName.toLowerCase();
				if (element) {
					if (element.getAttribute("disabled")) {
						self.disable(element);
					} else {
						self.enable(element);
					}
					if (tagName === "button" || tagName === "input") {
						if (element.innerHTML) {
							container.firstChild.firstChild.innerHTML = element.innerHTML;
						} else {
							container.firstChild.firstChild.textContent = element.value;
						}
					}
					self._clearClasses(element);
					self._resetIcon();
					self._setHasText(element);
					self._buildIcon(element);
				}
			};

			/**
			 * Removes the button functionality completely.
			 *
			 * This will return the element back to its pre-init state.
			 *
			 *      @example
			 *      var buttonWidget = tau.widget.Button(document.getElementById("button"));
			 *      buttonWidget.destroy();
			 *
			 *      // or
			 *
			 *      $( "#button" ).button( "destroy" );
			 *
			 * @method destroy
			 * @member ns.widget.mobile.Button
			 */

			// definition
			//@todo bring back ui-btn selector and refactor _build method to make it more intelligent for checking if structure is build
			ns.widget.mobile.Button = Button;
			engine.defineWidget(
				"Button",
				"[data-role='button'], button, [type='button'], [type='submit'], [type='reset']",
				[],
				Button,
				"mobile"
			);
			// ButtonMarkup is alias for Button widget
			// required for backward compatibility with jQM
			engine.defineWidget(
				"buttonMarkup",
				"",
				[],
				Button,
				"mobile",
				false, // redefine: false
				false // change name of widget to lowercase: false
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
