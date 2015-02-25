/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Button Widget
 * Shows a control that can be used to generate an action event.
 *
 * @class ns.widget.tv.Button
 * @extends ns.widget.mobile.Button
 * @author Piotr Czajka <p.czajka@samsung.com>
 * @author Maciej Urbanski m.urbanski@samsung.com
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../profile/mobile/widget/mobile/Button",
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/event",
			"../../../core/theme",
			"../../../core/util/object",
			"../../../core/util/DOM/css",
			"../tv",
			"./BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseButton = ns.widget.mobile.Button,
				BaseButtonPrototype = BaseButton.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				utils = ns.util,
				setPrefixedStyle = utils.DOM.setPrefixedStyle,
				getPrefixedStyleValue = utils.DOM.getPrefixedStyleValue,
				utilEvent = ns.event,
				objectUtils = utils.object,
				selectorsUtils = utils.selectors,
				FUNCTION_TYPE = "function",
				Button = function () {
					var self = this;
					BaseButton.call(self);
					BaseKeyboardSupport.call(self);
					self._callbacks = {};
				},
				engine = ns.engine,
				selectors = {
					footer: "footer",
					icon: "img.ui-li-dynamic-icon-src",
					thumb: "img.ui-thumb-src"
				},
				classes = objectUtils.merge({}, BaseButton.classes, {
					background: "ui-background",
					blur: "ui-blur",
					blurPrefix: "ui-blur-",
					up: "up",
					down: "down",
					left: "left",
					right: "right",
					tooltip: "ui-tooltip",
					text: "ui-text",
					icon: "ui-li-dynamic-footer-icon",
					marquee: "ui-marquee",
					thumbnail: "thumb"
				}),
				prototype = new BaseButton();

			Button.events = BaseButton.events;
			Button.classes = classes;
			Button.selectors = selectors;
			Button.options = prototype.options;
			Button.prototype = prototype;
			Button.hoverDelay = 0;
			// definition
			ns.widget.tv.Button = Button;

			function setMaskFromIcon(icon) {
				var styles,
					currentMask,
					src = icon.style.getPropertyValue("background-image");

				if (src) {
					styles = window.getComputedStyle(icon);
					currentMask = getPrefixedStyleValue(styles, "mask-image");
					if (currentMask) {
						currentMask += ", " + src;
					} else {
						currentMask = src;
					}
					setPrefixedStyle(icon, "mask-image", currentMask);
				}
			}

			function setMaskFromImage(iconSource, self) {
				var styles,
					currentMask = "",
					icon,
					src;

				src = iconSource.getAttribute("src");
				if (src) {
					src = "url('" + src + "')";
					icon = document.createElement("span");
					icon.classList.add(classes.icon);
					iconSource.parentNode.replaceChild(icon, iconSource);

					styles = window.getComputedStyle(icon);
					currentMask = getPrefixedStyleValue(styles, "mask-image");
					if (currentMask) {
						currentMask += ", " + src;
					} else {
						currentMask = src;
					}
					setPrefixedStyle(icon, "mask-image", currentMask);

					icon.appendChild(iconSource);
					self.ui.icon = icon;
				}
			}

			function findIcon(element, self) {
				var iconSource = element.querySelector(selectors.icon),
					icon = self.ui.icon;

				// use icon from data-icon attribute as mask-image
				if (icon) {
					setMaskFromIcon(icon);
				}
				// use <img>.src attribute as mask-image
				if (iconSource) {
					setMaskFromImage(iconSource, self);
				}
			}

			function findThumbnail(element, self) {
				var thumbSource = element.querySelector(selectors.thumb),
					parent = element.querySelector("." + classes.uiBtnInner),
					styles,
					thumb;

				if (thumbSource) {
					thumb = document.createElement("div");
					thumb.classList.add(classes.thumbnail);
					thumbSource.parentNode.removeChild(thumbSource);

					thumb.style.setProperty(
						"background-image",
						"url('" + thumbSource.getAttribute("src") + "')"
					);

					parent.appendChild(thumb);
					thumb.appendChild(thumbSource);
				}
			}

			function findIconTitle (element, self) {
				var iconTitle = element.querySelector(".ui-icon-title"),
					styles,
					iconStyle,
					ui,
					icon,
					iconWrapper,
					currentMask,
					src;

				if (iconTitle) {
					ui = self.ui;
					icon = ui.icon;
					iconStyle = icon.style;
					src = icon.style.getPropertyValue("background-image");
					iconWrapper = document.createElement("div");
					iconWrapper.classList.add("ui-icon-wrapper");
					iconWrapper.appendChild(icon);
					iconWrapper.appendChild(iconTitle);
					ui.inner.appendChild(iconWrapper);

					styles = window.getComputedStyle(icon);

					currentMask = getPrefixedStyleValue(iconStyle, "mask-image");
					if (currentMask) {
						currentMask += ", " + src;
					} else {
						currentMask = src;
					}
					setPrefixedStyle(icon, "mask-image", currentMask);

					iconStyle.setProperty(
						"background-image",
						""
					);
				}
			}
			function createBackgroundElement(element) {
				var backgroundElement = document.createElement("div");

				backgroundElement.classList.add(classes.background);
				element.insertBefore(backgroundElement, element.firstChild);
				return backgroundElement;
			}

			/**
			 * Builds background of button.
			 * It is used e.g. for animated focus.
			 * @method _buildBackground
			 * @param element Element of widget
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._buildBackground = function (element) {
				var backgroundElement;
				if (this.options.background) {
					backgroundElement = createBackgroundElement(element);
					backgroundElement.id = element.id + "-background";
				}
			};

			/**
			 * Builds footer inside widget.
			 * If element has a footer, the background for it will be created.
			 * @method _buildFooter
			 * @param {HTMLElement} element Element of widget
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._buildFooter = function (element) {
				var footer = selectorsUtils.getChildrenBySelector(element, selectors.footer)[0];

				if (footer && this.options.background) {
					createBackgroundElement(footer);
				}
			};

			/**
			 * Builds wrapper for text nodes
			 * @method _buildTextNodes
			 * @param element Element of widget
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._buildTextNodes = function (element) {
				var children = element.childNodes,
					length = children.length,
					content,
					newChild,
					child,
					i;
				if (this.options.marquee) {
					for (i = 0; i < length; i++) {
						child = children[i];
						// the child is a text
						if (child.nodeType === 3) {
							// we create span and replace textNode
							content = child.textContent.trim();
							if (content.length) {
								newChild = document.createElement("span");
								newChild.className = classes.text;
								newChild.textContent = content;
								// replace element
								element.replaceChild(newChild, child);
							}
						}
					}
				}
			};

			/**
			 * Builds widget
			 * @method _build
			 * @param {HTMLElement} element Element of widget
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._build = function (element) {
				var self = this;

				// build footer
				self._buildFooter(element);
				// build text nodes
				self._buildTextNodes(element);
				// build button
				element = BaseButtonPrototype._build.call(self, element);

				// Mark base element for marquee decorator
				self.ui.buttonText.classList.add(classes.marquee);
				// create background element for built button
				self._buildBackground(element);

				this._buildTooltip(element);

				findThumbnail(element, this);
				findIcon(element, this);
				findIconTitle(element, this);
				return element;
			};

			/**
			 * Creates popup element and appends it container passed as argument
			 * @method _createPopup
			 * @return {ns.widget.Popup} reference to new widget instance
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._createPopup = function (element) {
				var pageElement = selectorsUtils.getClosestByClass(element, "ui-page"),
					popup = document.createElement("div"),
					options = this.options,
					popupInstance;

				// Append popup element to page with slider
				// Append popup element to page with slider
				pageElement.appendChild(popup);
				// Create widget instance out of popup element
				popupInstance = engine.instanceWidget(popup, "Popup", {
					positionTo: "origin",
					link: element, // positioned to button's element
					transition: "none",
					overlay: false,
					arrow: options.tooltipArrow,
					distance: 16,
					content: options.tooltip,
					timeout: options.tooltipTimeout,
					changeContext: false
				});
				popup.classList.add(classes.tooltip);

				return popupInstance;
			};

			/**
			 * Build tooltip
			 * @method _buildTooltip
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._buildTooltip = function (element) {
				var self = this;

				if (self.options.tooltip) {
					self._popup = self._createPopup(element);
				}
			};

			/**
			 * Initializes widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._init = function (element) {
				var self = this;

				BaseButtonPrototype._init.call(self, element);

				self.ui.background = document.getElementById(self.id + "-background");

				return element;
			};
			/**
			 * Set configuration for widget widget
			 * @method _configure
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._configure = function (element) {
				var self = this,
					options;

				BaseButtonPrototype._configure.call(self, element);

				options = self.options || {};
				/**
				 * @property {?string} [options.tooltip=null] Text for tooltip
				 * @property {?string} [options.tooltipArrow="t,b"] Position of arrow in tooltip
				 * @property {number} [options.tooltipTimeout=3000] Define timeout for tooltip close
				 * @property {boolean} [options.marquee=true] Marquee on text in button
				 * @property {boolean} [options.background=true] add background in button
				 */
				options.tooltip = null;
				options.tooltipArrow = "t,b";
				options.tooltipTimeout = 3000;
				options.marquee = true;
				options.background = true;

				self.options = options;

				return element;
			};

			function animationEndCallback(element) {
				var classList = element.classList;

				classList.remove(classes.blur);
				classList.remove(classes.blurPrefix + classes.up);
				classList.remove(classes.blurPrefix + classes.down);
				classList.remove(classes.blurPrefix + classes.right);
				classList.remove(classes.blurPrefix + classes.left);
			}

			function focusCallback(self) {
				var router = engine.getRouter(),
					options = self.options;

				// if element is not disabled
				if (!self.element.classList.contains(classes.uiDisabled)) {
					if (options.tooltip) {
						router.open(self._popup.id, {
							rel: "popup",
							history: false
						});
					}
				}
			}

			function blurCallback(self) {
				var router = engine.getRouter(),
					options = self.options;

				if (options.tooltip) {
					router.close(self._popup.id, {
						rel: "popup",
						history: false
					});
				}
			}

			/**
			 * Binds events
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._bindEvents = function () {
				var self = this,
					element = self.element,
					callbacks = self._callbacks,
					background = self.ui.background,
					eventFunction;

				BaseButtonPrototype._bindEvents.call(self);

				eventFunction = animationEndCallback.bind(null, self.element);
				if (background) {
					utilEvent.prefixedFastOn(background, "transitionEnd", eventFunction, false);
				}
				callbacks.transitionend = eventFunction;

				eventFunction = focusCallback.bind(null, self);
				element.addEventListener("focus", eventFunction, false);
				callbacks.focus = eventFunction;

				eventFunction = blurCallback.bind(null, self);
				element.addEventListener("blur", eventFunction, false);
				callbacks.blur = eventFunction;
			};

			/**
			 * Destroys widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element,
					callbacks = self._callbacks,
					background = self.ui.background,
					eventFunction,
					BaseButtonPrototype_destroy = BaseButtonPrototype._destroy;

				eventFunction = callbacks.transitionend;
				if (background) {
					utilEvent.prefixedFastOff(background, "transitionEnd", eventFunction, false);
				}
				eventFunction = callbacks.focus;
				element.removeEventListener("focus", eventFunction, false);

				eventFunction = callbacks.blur;
				element.removeEventListener("blur", eventFunction, false);

				if (typeof BaseButtonPrototype_destroy === FUNCTION_TYPE) {
					BaseButtonPrototype_destroy.call(self);
				}
			};

			engine.defineWidget(
				"Button",
				"[data-role='button'], button, [type='button'], [type='submit'], [type='reset'], .ui-button",
				[],
				Button,
				"tv",
				true
			);

			BaseKeyboardSupport.registerActiveSelector("[data-role='button'], button, [type='button'], [type='submit'], [type='reset'], .ui-button");

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
