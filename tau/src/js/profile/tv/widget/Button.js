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
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../profile/mobile/widget/mobile/Button",
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/theme",
			"../../../core/util/object",
			"../../../core/decorator/marquee",
			"../tv",
			"./BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseButton = ns.widget.mobile.Button,
				BaseButtonPrototype = BaseButton.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				utils = ns.util,
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
					footer: "footer"
				},
				classes = objectUtils.merge({}, BaseButton.classes, {
					background: "ui-background",
					blur: "ui-blur",
					blurPrefix: "ui-blur-",
					up: "up",
					down: "down",
					left: "left",
					right: "right",
					text: "ui-text"
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

				backgroundElement = createBackgroundElement(element);
				backgroundElement.id = element.id + "-background";
			};

			/**
			 * Builds footer inside widget.
			 * If element has a footer, the background for it will be created.
			 * @method _buildFooter
			 * @param element Element of widget
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._buildFooter = function (element) {
				var footer = selectorsUtils.getChildrenBySelector(element, selectors.footer)[0];

				if (footer) {
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
			prototype._buildTextNodes = function(element) {
				var children = element.childNodes,
					length = children.length,
					content,
					newChild,
					child,
					i;

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
			};

			/**
			 * Builds widget
			 * @method _build
			 * @param element Element of widget
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._build = function (element) {
				var self = this;

				// build footer
				this._buildFooter(element);
				// build text nodes
				this._buildTextNodes(element);
				// build button
				element = BaseButtonPrototype._build.call(self, element);
				// create background element for built button
				self._buildBackground(element);

				return element;
			};

			/**
			 * Initializes widget
			 * @method _init
			 * @param element
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._init = function (element) {
				var self = this;

				BaseButtonPrototype._init.call(self, element);

				self.ui.background = document.getElementById(self.id + "-background");
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

			function focusCallback(instance) {
				var container = instance.ui.container,
					textElement = container.querySelector("." + classes.uiBtnText);

				// if element is not disabled
				if (!instance.element.classList.contains(classes.uiDisabled)) {
					// set Marquee decorator on text element
					if (textElement) {
						ns.decorator.marquee.enable(textElement);
					}
				}
			};

			function blurCallback(instance) {
				// disable Marquee decorator on text element
				ns.decorator.marquee.disable(instance.ui.container);
			};

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
				background.addEventListener("transitionend", eventFunction, false);
				background.addEventListener("webkitTransitionEnd", eventFunction, false);
				background.addEventListener("mozTransitionEnd", eventFunction, false);
				background.addEventListener("msTransitionEnd", eventFunction, false);
				background.addEventListener("oTransitionEnd", eventFunction, false);
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
			prototype._destroy = function() {
				var self = this,
					element = self.element,
					callbacks = self._callbacks,
					background = self.ui.background,
					eventFunction,
					BaseButtonPrototype_destroy = BaseButtonPrototype._destroy;

				eventFunction = callbacks.transitionend;
				background.removeEventListener("transitionend", eventFunction, false);
				background.removeEventListener("webkitTransitionEnd", eventFunction, false);
				background.removeEventListener("mozTransitionEnd", eventFunction, false);
				background.removeEventListener("msTransitionEnd", eventFunction, false);
				background.removeEventListener("oTransitionEnd", eventFunction, false);

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
