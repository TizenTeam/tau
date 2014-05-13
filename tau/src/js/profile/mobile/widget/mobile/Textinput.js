/*global window, define */
/*jslint nomen: true, plusplus: true */
/**
 * #Textinput widget
 * @class ns.widget.Textinput
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/theme",
			"../mobile",  // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
//>>excludeEnd("tauBuildExclude");
			var Textinput = function () {
				/**
					* @property {Object} options Object with default options
					* @property {string} [options.clearSearchButtonText="clear text"] Default text for search field clear text button
					* @property {boolean} [options.disabled=false] disable widget
					* @property {?boolean} [options.mini=null] set mini version
					* @property {string} [options.theme='s'] theme of widget
					* @member ns.widget.Textinput
					* @instance
					*/
					this.options = {
						clearSearchButtonText: "clear text",
						disabled: false,
						mini: null,
						theme: 's'
					};
				},
				/**
				* @property {Object} BaseWidget Alias for {ns.widget.BaseWidget}
				* @member ns.widget.Textinput
				* @static
				* @private
				*/
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* @property {Object} engine Alias for {ns.engine}
				* @member ns.widget.Textinput
				* @static
				* @private
				*/
				engine = ns.engine,
				/**
				* @property {Object} theme Alias for {ns.theme}
				* @member ns.widget.Textinput
				* @static
				* @private
				*/
				themes = ns.theme,
				/**
				* @property {boolean} eventsAdded Flag with informations about events
				* @private
				* @static
				*/
				eventsAdded = false;

			Textinput.prototype = new BaseWidget();

			/**
			* @property {Object} classes Dictionary for textinput related css class names
			* @member ns.widget.Textinput
			* @static
			*/
			Textinput.classes = {
				uiBodyTheme: "ui-body-",
				uiMini: "ui-mini",
				uiInputText: "ui-input-text"
			};

			/**
			* Enable textinput
			* @method _enable
			* @member ns.widget.Textinput
			* @protected
			* @instance
			*/
			Textinput.prototype._enable = function () {
				var element = this.element;
				if (element) {
					element.classList.remove("ui-disabled");
				}
			};

			/**
			* Disable textinput
			* @method _disable
			* @member ns.widget.Textinput
			* @protected
			* @instance
			*/
			Textinput.prototype._disable = function () {
				var element = this.element;
				if (element) {
					element.classList.add("ui-disabled");
				}
			};

			//@TODO move to our framework
//			function toggleClear(clearbtn, element) {
//				setTimeout(function () {
//					clearbtn.toggleClass("ui-input-clear-hidden", !element.val());
//				}, 0);
//			}

			/**
			* Find label tag for element
			* @method findLabel
			* @param {HTMLElement} element
			* @member ns.widget.Textinput
			* @return {HTMLElement}
			* @static
			* @private
			*/
			function findLabel(element) {
				var elemParent = element.parentNode;
				return elemParent.querySelector('label[for="' + element.id + '"]');
			}

			/**
			* return not disabled textinput element which is the closest to element
			* @method isEnabledTextInput
			* @param {HTMLElement} element
			* @return {?HTMLElement}
			* @private
			* @static
			* @member ns.widget.Textinput
			*/
			function isEnabledTextInput(element) {
				if (element.classList.contains("ui-input-text") && !element.classList.contains("ui-disabled")) {
					return element;
				}
				return null;
				//return selectors.getClosestBySelector(element, '.ui-input-text:not(.ui-disabled)');
			}

			/**
			* add class ui-focus to target element of event
			* @method onFocus
			* @param {Event} event
			* @private
			* @static
			* @member ns.widget.Textinput
			*/
			function onFocus(event) {
				var elem = isEnabledTextInput(event.target);
				if (elem) {
					elem.classList.add('ui-focus');
				}
			}

			/**
			 * add event for resize textarea
			 * @method onKeyup
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.Textinput
			 */
			function onKeyup(event) {
				var element = isEnabledTextInput(event.target);
				if (element) {
					_resize(element);
				}
			}
			/**
			* remove class ui-focus from target element of event
			* @method onBlur
			* @param {Event} event
			* @private
			* @static
			* @member ns.widget.Textinput
			*/
			function onBlur(event) {
				var elem = isEnabledTextInput(event.target);
				if (elem) {
					elem.classList.remove('ui-focus');
				}
			}

			/**
			* add events to all textinputs
			* @method addGlobalEvents
			* @private
			* @static
			* @member ns.widget.Textinput
			*/
			function addGlobalEvents() {
				if (!eventsAdded) {
					document.addEventListener('focus', onFocus, true);
					document.addEventListener('blur', onBlur, true);
					eventsAdded = true;
				}
			}
			/**
			 * resize textarea
			 * @method _resize
			 * @private
			 * @param {HTMLElement} element
			 * @member ns.widget.Textinput
			 * @param element
			 */
			function _resize(element){
				if (element.nodeName.toLowerCase() === "textarea") {
					if(element.clientHeight < element.scrollHeight){
						element.style.height = element.scrollHeight +" px";
					}
				}
			}
			/**
			* build Textinput Widget
			* @method _build
			* @param {HTMLElement} element
			* @member ns.widget.Textinput
			* @return {HTMLElement}
			* @protected
			* @instance
			*/
			Textinput.prototype._build = function (element) {
				var elementClassList = element.classList,
					classes = Textinput.classes,
					options = this.options,
					themeclass,
					labelFor = findLabel(element);

				options.theme = themes.getInheritedTheme(element) || options.theme;
				themeclass  = classes.uiBodyTheme + options.theme;

				if (labelFor) {
					labelFor.classList.add(classes.uiInputText);
				}

				elementClassList.add(classes.uiInputText);
				elementClassList.add(themeclass);

				switch (element.type) {
				case "text":
				case "password":
				case "number":
				case "email":
				case "url":
				case "tel":
					element.setAttribute("role", "textbox");
					element.setAttribute("aria-label", "Keyboard opened");
					break;
				default:
					if (element.tagName.toLowerCase() === "textarea") {
						element.setAttribute("role", "textbox");
						element.setAttribute("aria-label", "Keyboard opened");
					}
				}

				element.setAttribute("tabindex", 0);

				//Autogrow
				_resize(element);

				return element;
			};

			/**
			* Bind events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.Textinput
			* @instance
			*/
			Textinput.prototype._bindEvents = function (element) {
				element.addEventListener('keyup', onKeyup , false);
				addGlobalEvents();
			};

			ns.widget.mobile.Textinput = Textinput;
			engine.defineWidget(
				"Textinput",
				"input[type='text'], input[type='number'], input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='month'], input[type='week'], input[type='datetime-local'], input[type='color'], input:not([type]), .ui-textinput",
				[],
				Textinput,
				"mobile"
			);
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Textinput;
		}
	);
//>>excludeEnd("tauBuildExclude");
}(window.document, ns));