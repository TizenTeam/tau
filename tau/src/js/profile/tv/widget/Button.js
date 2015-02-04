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
					right: "right"
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
				// build button
				element = BaseButtonPrototype._build.call(self, element);
				// create background element for built button
				self._buildBackground(element);

				return element;
			};

			/**
			 * Initializes widget
			 * @method _init
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._init = function (element) {
				var self = this;

				BaseButtonPrototype._init.call(self, element);

				self.ui.background = document.getElementById(element.id + "-background");
				return element;
			};

			function animationEndCallback(element) {
				var classList = element.classList;

				classList.remove(classes.blur);
				classList.remove(classes.blurPrefix + classes.up);
				classList.remove(classes.blurPrefix + classes.down);
				classList.remove(classes.blurPrefix + classes.right);
				classList.remove(classes.blurPrefix + classes.left);
			};

			/**
			 * Initializes widget
			 * @method _init
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._bindEvents = function () {
				var self = this,
					background = self.ui.background,
					transitionend;

				BaseButtonPrototype._bindEvents.call(self);

				transitionend = animationEndCallback.bind(null, self.element);
				background.addEventListener("transitionend", transitionend, false);
				background.addEventListener("webkitTransitionEnd", transitionend, false);
				background.addEventListener("mozTransitionEnd", transitionend, false);
				background.addEventListener("msTransitionEnd", transitionend, false);
				background.addEventListener("oTransitionEnd", transitionend, false);
				self._callbacks.transitionend = transitionend;
			};

			/**
			 * Initializes widget
			 * @method _init
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._destroy = function() {
				var self = this,
					background = self.ui.background,
					transitionend,
					BaseButtonPrototype_destroy = BaseButtonPrototype._destroy;

				transitionend = self._callbacks.transitionend;
				background.removeEventListener("transitionend", transitionend, false);
				background.removeEventListener("webkitTransitionEnd", transitionend, false);
				background.removeEventListener("mozTransitionEnd", transitionend, false);
				background.removeEventListener("msTransitionEnd", transitionend, false);
				background.removeEventListener("oTransitionEnd", transitionend, false);

				if (typeof BaseButtonPrototype_destroy === FUNCTION_TYPE) {
					BaseButtonPrototype_destroy.call(self);
				}
			};

			engine.defineWidget(
				"Button",
				"[data-role='button'], button, [type='button'], [type='submit'], [type='reset']",
				[],
				Button,
				"tv",
				true
			);

			BaseKeyboardSupport.registerActiveSelector("[data-role='button'], button, [type='button'], [type='submit'], [type='reset']");

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
