/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
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
 * # ContextualMenu Widget
 *
 * Shows a list of block which can be moved after click on box.
 *
 *
 * @class ns.widget.tv.ContextualMenu
 * @extends ns.widget.core.BaseWidget
 */
(function (document, tau) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/widget/BaseWidget",
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/util/array",
			"./BaseKeyboardSupport",
			"./Button",
			"./Listview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = tau.widget.BaseWidget,
				engine = tau.engine,
				util = tau.util,
				utilArray = util.array,
				utilsSelectors = tau.util.selectors,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				ContextualMenu = function () {
					var self = this;
					BaseWidget.call(self);
					BaseKeyboardSupport.call(self);
					self._ui = self._ui || {};
					this._isOpen = false;
				},
				prototype = new BaseWidget(),
				classes = {
					contextualMenu: "ui-contextual-menu",
					background: "ui-contextual-menu-background",
					buttons: "ui-contextual-menu-buttons",
					related: "ui-contextual-menu-related",
					open: "ui-contextual-menu-open"
				};

			ContextualMenu.classes = classes;

			function initButton (element) {
				tau.widget.Button(element, {
					inline: true,
					marquee: false,
					background: false
				});
			}

			function createButtons(element) {
				var buttonsContainer = utilsSelectors.getChildrenByClass(element, classes.buttons)[0],
					buttons = utilsSelectors.getChildrenByTag(buttonsContainer, "a");

				utilArray.forEach(buttons, initButton);
			}

			function initListview (element) {
				element.classList.add(tau.widget.tv.Listview.classes.transparent);
				tau.widget.Listview(element, {});
			}

			function createListview(element) {
				var relatedContainer = utilsSelectors.getChildrenByClass(element, classes.related)[0],
					listviews = utilsSelectors.getChildrenByTag(relatedContainer, "ul");

				utilArray.forEach(listviews, initListview);
			}

			function createWidgets(element) {
				createButtons(element);
				createListview(element);
			}

			/**
			 * Builds structure of widget
			 * @method _build
			 * @param {HTMLInputElement} element
			 * @return {HTMLInputElement} Built element
			 * @protected
			 * @member ns.widget.tv.ContextualMenu
			 */
			prototype._build = function(element) {
				this._ui.background = createBackground(this, element);
				createWidgets(element);
				return element;
			};

			/**
			 * Helper to create element and set class for it.
			 * @method createElement
			 * @param {string} classes classes to set
			 * @param {string} [tag="div"] tag name of element
			 * @private
			 * @static
			 * @member ns.widget.tv.ContextualMenu
			 */
			function createElement(classes, tag) {
				var div = document.createElement(tag || "div");

				div.className = classes;
				return div;
			}

			/**
			 * Create black background
			 * @method createBackground
			 * @param {ns.widget.tv.ContextualMenu} self
			 * @param {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.tv.ContextualMenu
			 */
			function createBackground(self, element) {
				var background = createElement(classes.background);
				background.id = self.id + "-bg";
				element.appendChild(background);
				return background;
			}

			/**
			 * Remove edit mode structure
			 * @method removeBackground
			 * @param {ns.widget.tv.ContextualMenu} self
			 * @private
			 * @static
			 * @member ns.widget.tv.ContextualMenu
			 */
			function removeBackground(self) {
				var background = self._ui.background;
				if (background) {
					background.parentNode.removeChild(background);
				}
			}

			/**
			 * Open contextual menu
			 * @method open
			 * @member ns.widget.tv.ContextualMenu
			 */
			prototype.open = function() {
				var self = this;
				self.element.classList.add(classes.open);
				self._isOpen = true;
				BaseKeyboardSupport.blurAll();
				self.saveKeyboardSupport();
				self.enableKeyboardSupport();
			};

			/**
			 * Return status of widget, true if is opened
			 * @method isOpen
			 * @return {boolean}
			 * @member ns.widget.tv.ContextualMenu
			 */
			prototype.isOpen = function() {
				return this._isOpen;
			};

			/**
			 * Close contextual menu
			 * @method close
			 * @member ns.widget.tv.ContextualMenu
			 */
			prototype.close = function() {
				var self = this;
				self.element.classList.remove(classes.open);
				self._isOpen = false;
				BaseKeyboardSupport.blurAll();
				self.disableKeyboardSupport();
				self.restoreKeyboardSupport();
			};

			/**
			 * Binds events to widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.tv.ContextualMenu
			 */
			prototype._bindEvents = function() {
				this._bindEventKey();
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.tv.ContextualMenu
			 */
			prototype._destroy = function() {
				this._destroyEventKey();
				removeBackground(this);
			};

			ContextualMenu.prototype = prototype;
			tau.widget.tv.ContextualMenu = ContextualMenu;

			engine.defineWidget(
				"ContextualMenu",
				".ui-contextual-menu",
				[],
				ContextualMenu,
				"tv"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ContextualMenu;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
