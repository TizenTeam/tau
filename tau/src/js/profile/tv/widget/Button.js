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
				objectUtils = ns.util.object,
				FUNCTION_TYPE = "function",
				Button = function () {
					BaseButton.call(this);
					BaseKeyboardSupport.call(this);
				},
				engine = ns.engine,
				classes = objectUtils.merge({}, BaseButton.classes, {
					background: "ui-background"
				}),
				prototype = new BaseButton();

			Button.events = BaseButton.events;
			Button.classes = classes;
			Button.options = prototype.options;
			Button.prototype = prototype;
			Button.hoverDelay = 0;
			// definition
			ns.widget.tv.Button = Button;

			prototype._build = function (element) {
				var backgroundElement;

				element = BaseButtonPrototype._build.call(this, element);

				backgroundElement = document.createElement("div");
				backgroundElement.classList.add(classes.background);
				backgroundElement.id = element.id + "-background";
				element.insertBefore(backgroundElement, element.firstChild);

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
