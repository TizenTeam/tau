/*global window, define, ns */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../core",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Button = function () {
					var self = this;

					self.options = {};
				},
				classes = {
					BTN: "ui-btn",
					DISABLED: "ui-state-disabled",
					INLINE: "ui-inline",
					BTN_ICON: "ui-btn-icon",
					ICON_PREFIX: "ui-icon-",
					BTN_CIRCLE: "ui-btn-circle",
					BTN_NOBG: "ui-btn-nobg",
					BTN_ICON_ONLY: "ui-btn-icon-only",
					BTN_TEXT_LIGHT: "ui-btn-text-light",
					BTN_TEXT_DARK: "ui-btn-text-dark",
					BTN_ICON_POSITION_PREFIX: "ui-btn-icon-"
				},
				buttonStyle = {
					CIRCLE: "circle",
					TEXTLIGHT: "light",
					TEXTDARK: "dark",
					NOBG: "nobg"
				},

				prototype = new BaseWidget();

			Button.classes = classes;
			Button.prototype = prototype;

			/**
			 * Configure button
			 * @method _configre
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._configure = function () {
				this.options = {
					// common options
					inline: false, //url
					icon: null,
					disabled: false,
					// mobile options
					style: null,
					iconpos: "left"
				};
			};

			/**
			 * Set style option
			 * @method _setStyle
			 * @param {HTMLElement} element
			 * @param {string} style
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setStyle = function (element, style) {
				var options = this.options,
					buttonClassList = element.classList,
					change = false;

				style = style || options.style;

				switch (style) {
					case buttonStyle.CIRCLE:
						buttonClassList.remove(classes.BTN_NOBG);
						buttonClassList.add(classes.BTN_CIRCLE);
						change = true;
						break;
					case buttonStyle.NOBG:
						buttonClassList.remove(classes.BTN_CIRCLE);
						buttonClassList.add(classes.BTN_NOBG);
						change = true;
						break;
					case buttonStyle.TEXTLIGHT:
						buttonClassList.add(classes.BTN_TEXT_LIGHT);
						change = true;
						break;
					case buttonStyle.TEXTDARK:
						buttonClassList.add(classes.BTN_TEXT_DARK);
						change = true;
						break;
					default:
				}

				if (change) {
					options.style = style;
				}
			};

			/**
			 * Set inline option
			 * @method _setInline
			 * @param {HTMLElement} element
			 * @param {boolean} inline
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setInline = function (element, inline) {
				var options = this.options;

				inline = inline || options.inline;

				if (inline) {
					element.classList.add(classes.INLINE);
					options.inline = inline;
				}
			};

			/**
			 * Set icon option
			 * @method _setIcon
			 * @param {HTMLElement} element
			 * @param {string} icon
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setIcon = function (element, icon) {
				var self = this,
					options = self.options;

				icon = icon || options.icon;

				if (icon) {
					element.classList.add(classes.BTN_ICON);
					element.classList.add(classes.ICON_PREFIX + icon);

					options.icon = icon;

					self._setTitleForIcon(element);
				}
			};

			/**
			 * Set iconpos option
			 * @method _setIconpos
			 * @param {HTMLElement} element
			 * @param {string} iconpos
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setIconpos = function (element, iconpos) {
				var options = this.options,
					style = options.style,
					innerTextLength = element.textContent.length || (element.value ? element.value.length : 0);

				iconpos = iconpos || options.iconpos;

				if (options.icon && style !== buttonStyle.CIRCLE && style !== buttonStyle.NOBG) {
					if (innerTextLength > 0) {
						element.classList.add(classes.BTN_ICON_POSITION_PREFIX + iconpos);
					} else {
						element.classList.add(classes.BTN_ICON_ONLY);
					}
					options.iconpos = iconpos;
				}
			};

			/**
			 * Set title for button without showing text
			 * @method _setTitleForIcon
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setTitleForIcon = function (element) {
				var options = this.options,
					buttonText = element.textContent;

				// Add title to element if button not has text.
				if (options.iconpos === "notext" && !element.getAttribute("title")) {
					element.setAttribute("title", buttonText);
					ns.warn("iconpos='notext' is deprecated.");
				}
			};

			/**
			 * Sets button to disabled if element.disabled or element.disabled property is true,
			 * or class is set to ui-state-disabled
			 * @method _setDisabled
			 * @param {HTMLElement} element
			 * @protected
			 */
			prototype._setDisabled = function (element, state) {
				var self = this,
					options = self.options,
					buttonClassList = element.classList;

				if (state === true || options.disabled === true || element.disabled || buttonClassList.contains(classes.DISABLED)) {
					options.disabled = true;
					self._disable(element);
				} else {
					options.disabled = false;
				}
			};

			/**
			 * Build Button
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.core.Button
			 */
			prototype._build = function (element) {
				var self = this,
					buttonClassList = element.classList;

				if (!buttonClassList.contains(classes.BTN)) {
					buttonClassList.add(classes.BTN);
				}

				self._setStyle(element);
				self._setInline(element);
				self._setIconpos(element);
				self._setIcon(element);
				self._setDisabled(element);

				return element;
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._refresh = function () {
				var self = this,
					element = this.element;

				self._setStyle(element);
				self._setInline(element);
				self._setIconpos(element);
				self._setIcon(element);
				self._setDisabled(element);

				return null;
			};

			/**
			 * Get value of button
			 * @method _getValue
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._getValue = function () {
				return this.element.textContent;
			};

			/**
			 * Set value of button
			 * @method _setValue
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setValue = function (value) {
				this.element.textContent = value;
			};

			/**
			 * Enable button
			 * @method _enable
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._enable = function (element) {
				var options = this.options;

				if (element) {
					if (element.tagName.toLowerCase() === "button") {
						element.disabled = false;
					}
					element.removeAttribute("disabled");
					element.classList.remove(classes.DISABLED);
					options.disabled = false;
				}
			};

			/**
			 * Disable button
			 * @method _disable
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._disable = function (element) {
				var options = this.options;

				if (element) {
					if (element.tagName.toLowerCase() === "button") {
						element.disabled = true;
					}
					element.setAttribute("disabled", "disabled");
					element.classList.add(classes.DISABLED);
					options.disabled = true;
				}
			};

			ns.widget.core.Button = Button;

			engine.defineWidget(
				"Button",
				"button, [data-role='button'], .ui-btn, input[type='button']",
				[],
				Button,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
