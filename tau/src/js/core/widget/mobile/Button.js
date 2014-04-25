/*global window, define, ns, DOMTokenList */
/*jslint nomen: true, plusplus: true */
/**
 * # Button widget
 * Button widget changes default browser buttons to special buttons with additional opportunities like icon, corners, shadow.
 *
 * ## Default selectors
 * In default all **BUTTON** tags and all **INPUT** tags with type equals _button_, _submit_ or _reset_ are change to Tizen WebUI buttons.
 * In addition all elements with _data-role=button_ are changed to Tizen WebUI buttons.
 *
 * ## Manual constructor
 * For manual creation of button widget you can use constructor of widget:
 *
 *		@example
 *		var button = ns.engine.instanceWidget(document.getElementById('button'), 'Button');
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		var button = $('#button').button();
 *
 * ##HTML Examples
 *
 * ###Create simple button from link using data-role
 *
 *		@example
 *		<a href="#page2" data-role="button">Link button</a>
 *
 * ###Create simple button using button's tag
 *
 *		@example
 *		<button>Button element</button>
 *
 * ###Create simple button from input using type
 *
 *		@example
 *		<input type="button" value="Button" />
 *		<input type="submit" value="Submit Button" />
 *		<input type="reset" value="Reset Button" />
 *
 * ##Mini version
 * For a more compact version that is useful in toolbars and tight spaces, add the data-mini="true" attribute to the button to create a mini version. This will produce a button that is not as tall as the standard version and has a smaller text size.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-mini="true">Link button</a>
 *
 * ##Inline buttons
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
 * ##Icon positioning
 * By default, all icons in buttons are placed to the left of the button text. This default may be overridden using the data-iconpos attribute.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-icon="delete" data-iconpos="right">Delete</a>
 *
 * Possible values of data-iconpos:<br>
 * * "left"  - creates the button with left-aligned icon<br>
 * * "right"  - creates the button with right-aligned icon<br>
 * * "top"  - creates the button with icon positioned above the text<br>
 * * "bottom"  - creates the button with icon positioned below the text
 *
 * You can also create an icon-only button, by setting the data-iconpos attribute to notext. The button plugin will hide the text on-screen, but add it as a title attribute on the link to provide context for screen readers and devices that support tooltips.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-icon="delete" data-iconpos="notext">Delete</a>
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
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../utils/selectors",
			"../../utils/DOM/manipulation",
			"../../events/vmouse",
			"../../theme",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				selectorsUtils = ns.utils.selectors,
				themes = ns.theme,
				Button = function () {
					var self = this;

					self.action = "";
					self.label = null;
				},
				classes = {
					uiDisabled: 'ui-disabled',
					uiBtn: 'ui-btn',
					uiBtnUpThemePrefix: 'ui-btn-up-',
					uiBtnHoverThemePrefix: 'ui-btn-hover-',
					uiBtnDownThemePrefix: 'ui-btn-down-',
					uiShadow: 'ui-shadow',
					uiBtnCornerAll: 'ui-btn-corner-all',
					uiBtnHidden: 'ui-btn-hidden',
					uiBtnBoxThemePrefix: 'ui-btn-box-',
					uiBtnTextPaddingTop: 'ui-btn-text-padding-top',
					uiBtnTextPaddingLeft: 'ui-btn-text-padding-left',
					uiBtnTextPaddingRight: 'ui-btn-text-padding-right',
					uiBtnTextPaddingBottom: 'ui-btn-text-padding-bottom',
					uiBtnCornerCircle: 'ui-btn-corner-circle',
					uiBtnHastxt: 'ui-btn-hastxt',
					uiBtnIconNobg: 'ui-btn-icon-nobg',
					uiBtnIconOnly: 'ui-btn-icon_only',
					uiBtnIconOnlyInner: 'ui-btn-icon-only',
					uiBtnIconRight: 'ui-btn-icon-right',
					uiBtnRound: 'ui-btn-round',
					uiMini: 'ui-mini',
					uiBtnInline: 'ui-btn-inline',
					uiBtnBlock: 'ui-btn-block',
					uiIcon: 'ui-icon',
					uiIconPositionPrefix: 'ui-icon-',
					uiIconShadow: 'ui-icon-shadow',
					uiBtnIconPostionPrefix: 'ui-btn-icon-',
					uiLink: 'ui-link',
					uiBtnInner: 'ui-btn-inner',
					uiBtnText: 'ui-btn-text',
					uiFocus: 'ui-focus',
					uiBtnEdit: 'ui-btn-edit',
					uiBtnLeft: 'ui-btn-left',
					uiBtnRight: 'ui-btn-right',
					uiSubmit: 'ui-submit',
					uiBtnActive: 'ui-btn-active',
					uiBtnIconNotext: 'ui-btn-icon-notext'
				},
				eventsAdded = false,
				prototype = new BaseWidget();

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
				var div = selectorsUtils.getClosestBySelector(element, '.' + classes.uiBtn + ':not(.' + classes.uiDisabled + ')'),
					button;
				if (div) {
					button = selectorsUtils.getChildrenByClass(div, classes.uiBtnHidden);
					if (button.length) {
						return button[0];
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
				return selectorsUtils.getClosestBySelector(element, '.' + classes.uiBtn + ':not(.' + classes.uiDisabled + ')');
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
					document.addEventListener('focus', onFocus, true);
					document.addEventListener('focusin', onFocus, true);
					document.addEventListener('blur', onBlur, true);
					document.addEventListener('focusout', onBlur, true);
					document.addEventListener('vmousedown', onMouseDown, true);
					document.addEventListener('vmouseup', onMouseUp, true);
					document.addEventListener('vmousecancel', onMouseUp, true);
					document.addEventListener('vmouseup', onMouseUp, true);
					document.addEventListener('touchend', onMouseUp, true);
					document.addEventListener('touchcancel', onMouseUp, true);
					document.addEventListener('vmouseover', onMouseOver, true);
					document.addEventListener('focus', onMouseOver, true);
					document.addEventListener('vmouseout', onMouseOut, true);
					document.addEventListener('blur', onMouseOut, true);
					document.addEventListener('scrollstart', onMouseOut, true);
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
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._configure = function () {
				/**
				 * @property {object} options All possible widget options
				 * @property {string|null} [options.theme=null] theme of widget
				 * @property {string|null} [options.icon=null] icon type
				 * @property {string|null} [options.iconpos=null] position of icon
				 * @property {string|null} [options.inline=null] if value is "true" then button has css property display = "inline"
				 * @property {boolean} [options.shadow=true] shadow of button
				 * @property {boolean} [options.iconshadow=true] shadow of button's icon
				 * @property {boolean} [options.corners=false] corners of button
				 * @property {boolean|null} [options.mini=null] size of button
				 * @property {boolean} [options.bar=false] if button is part of bar then you should set true
				 * @property {string|null} [options.style=null] style of button ("circle" or "nobg")
				 * @property {string} [options.wrapperEls='span'] wrapper tag name of button ("span" or "div")
				 * @member ns.widget.mobile.Button
				 */
				ns.utils.object.merge(this.options, {
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
					wrapperEls: 'span'
				});

				// Object for storing ui elements
				this.ui = {};
			};

			/**
			* Build structure of button widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._build = function (element) {
				var attributes = {
						"disabled": element.getAttribute("disabled")
					},
					iconClass,
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
					protoOptions = prototype.options;

				// Set theme
				options.theme = options.theme || themes.getInheritedTheme(element, (protoOptions && protoOptions.theme) || 's');

				// Create default structure of button
				buttonInner = document.createElement(options.wrapperEls);
				buttonText = document.createElement(options.wrapperEls);

				elementTagName = element.tagName.toLowerCase();
				buttonClassList = element.classList;

				if (elementTagName === "input" && element.type === "button") {
					options.corners = true;
				}
				buttonIcon = options.icon ? document.createElement("span") : null;
				buttonClassArray.push(classes.uiBtn, classes.uiBtnUpThemePrefix + options.theme);
				if (options.shadow){
					buttonClassArray.push(classes.uiShadow);
				}
				if (options.corners){
					buttonClassArray.push(classes.uiBtnCornerAll);
				}

				buttonInnerHTML = element.innerHTML;
				buttonValue = element.value;

				buttonStyle = options.style;

				if (elementTagName === "a") {
					container = element;
					if (buttonClassList.contains(classes.uiBtn)) {
						return element;
					}
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
				if ((element.getAttribute("data-role") === "button" && !options.bar) || elementTagName === "button" || elementTagName === "div" || elementTagName === "input") {
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
				}

				// Set icon
				if (options.icon) {
					if (innerTextLength > 0) {
						switch (options.iconpos) {
						case "right":
							textClass += " " + classes.uiBtnTextPaddingRight;
							break;
						case "left":
							textClass += " " + classes.uiBtnTextPaddingLeft;
							break;
						case "top":
							textClass += " " + classes.uiBtnTextPaddingTop;
							break;
						case "bottom":
							textClass += " " + classes.uiBtnTextPaddingBottom;
							break;
						default:
							textClass += " " + classes.uiBtnTextPaddingLeft;
							break;
						}
						innerClass += " " + classes.uiBtnHastxt;
					} else {
						buttonClassArray.push(classes.uiBtnIconOnly);
						innerClass += " " + classes.uiBtnIconOnlyInner;
					}
				} else if (innerTextLength > 0) {
					innerClass += " " + classes.uiBtnHastxt;
				}

				// Used to control styling in headers/footers, where buttons default to `mini` style.
				if (options.mini) {
					buttonClassArray.push(classes.uiMini);
				}

				// Used to control styling in headers/footers, where buttons default to `inline` style.
				if (options.inline !== null) {
					buttonClassArray.push(options.inline ? classes.uiBtnInline : classes.uiBtnBlock);
				}

				if (options.icon) {
					options.iconpos = options.iconpos || "left";
					iconClass = classes.uiIcon + " " + classes.uiIconPositionPrefix + options.icon;

					// Set icon shadow
					if (options.iconshadow) {
						iconClass += " " + classes.uiIconShadow;
					}

					// Set iconpos
					buttonClassArray.push(classes.uiBtnIconPostionPrefix + options.iconpos);
					if (options.iconpos === "notext" && !element.getAttribute("title")) {
						element.setAttribute("title", element.textContent);
					}
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
				DOMTokenList.prototype.add.apply(buttonClassList, buttonClassArray);

				buttonInner.className = innerClass;
				buttonText.className = textClass;
				buttonInner.appendChild(buttonText);

				if (buttonIcon) {
					buttonIcon.className = iconClass;
					buttonIcon.innerHTML = "&#160;";
					buttonInner.appendChild(buttonIcon);
				}

				// copy inner structure of button to new tag
				while (element.firstChild) {
					buttonText.appendChild(element.firstChild);
				}

				if (!buttonText.innerHTML.length && buttonIcon && elementTagName !== "label") {
					buttonText.innerHTML = options.icon.replace("naviframe-", "");
				}

				if (elementTagName === "button" || elementTagName === "input") {
					ns.utils.DOM.replaceWithNodes(element, container);
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
			* Refresh button
			* @method _refresh
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._refresh = function () {
				var element = this.element,
					container = this.ui.container;
				if (element) {
					if (element.getAttribute("disabled")) {
						this.disable(element);
					} else {
						this.enable(element);
					}
					if (element.innerHTML) {
						container.firstChild.firstChild.innerHTML = element.innerHTML;
					} else {
						container.firstChild.firstChild.textContent = element.value;
					}
				}
			};

			// definition
			ns.widget.mobile.Button = Button;
			engine.defineWidget(
				"Button",
				"[data-role='button'],button,[type='button'],[type='submit'],[type='reset']",
				[],
				Button,
				'mobile'
			);
			// ButtonMarkup is alias for Button widget
			// required for backward compatibility with jQM
			engine.defineWidget(
				"buttonMarkup",
				"",
				[],
				Button,
				'mobile',
				false, // redefine: false
				false // change name of widget to lowercase: false
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
