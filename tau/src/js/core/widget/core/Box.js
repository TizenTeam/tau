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
/*
 * # Box widget for layout
 *
 * @class ns.widget.core.Box
 * @extends ns.widget.core.LayoutDOMWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core",
			"../../engine",
			"../../util/selectors",
			"../../util/DOM/attributes",
			"../../util/object",
			"../../support",
			"./LayoutDOMWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var CoreLayoutWidget = ns.widget.core.LayoutDOMWidget,
				engine = ns.engine,
				objectUtil = ns.util.object,
				domUtil = ns.util.DOM,
				Box = function () {
					var self = this;

					CoreLayoutWidget.call(self);
					// set options
					self.options = objectUtil.merge(self.options, defaults);
					// set object for current layout
					self._currentLayout = {};
					// set stylesheet
					self._styleSheet = null;
				},
				classes =  objectUtil.merge({}, CoreLayoutWidget.classes, {
					box: "ui-box"
				}),
				defaults = {
					layout: "default"
				},
				/**
				 * Dictionary for layouts.
				 * All registered layouts are saved in this object.
				 */
				layouts = {},
				prototype = new CoreLayoutWidget(),
				TYPE_FUNCTION = "function";

			Box.classes = classes;
			Box.layouts = layouts;

			/**
			 * Configure widget
			 * @method _configure
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Box
			 * @protected
			 */
			prototype._configure = function(element) {
				var self = this,
					options = self.options,
					currentLayout;

				if (typeof CoreLayoutWidget._configure === TYPE_FUNCTION) {
					CoreLayoutWidget._configure.call(self);
				}

				// read which layout is used
				options.layout = domUtil.getNSData(element, "layout");
				// try to set current layout
				currentLayout = layouts[options.layout];
				// if  such layout is registered, we configure it
				if (currentLayout) {
					// set and configure current layout
					self._currentLayout = currentLayout;
					currentLayout.configure(self, element);
				}
			};

			/**
			 * Insert CSS rule for layout
			 * @method insertCSSRule
			 * @param {string} rule
			 * @member ns.widget.core.Box
			 * @protected
			 */
			prototype.insertCSSRule = function(rule) {
				var self = this,
					id = ns.getUniqueId(),
					styleElement = self._styleSheet,
					styleContainer = styleElement && styleElement.sheet;

				// create style
				if (!styleContainer) {
					styleElement = document.createElement("style");
					// a text node hack, it forces the browser
					// to create a stylesheet object in the
					// HTMLStyleElement object, which we can
					// then use
					styleElement.appendChild(document.createTextNode(""));
					styleElement.id = id;
					document.head.appendChild(styleElement);
					styleContainer = styleElement.sheet;
				}
				// insert new rule
				styleContainer.insertRule(rule, 0);

				// set stylesheet, which was added
				self._styleSheet = styleElement;
			};

			/**
			 * Enable new layout.
			 * This function is called during building and on calling function "layout".
			 * @method enableNewLayout
			 * @param {ns.widget.core.Box} self
			 * @param {HTMLElement} element
			 * @param {string} name Name of layout
			 * @member ns.widget.core.Box
			 * @private
			 */
			function enableNewLayout(self, element, name) {
				var newLayout;

				element = element || self.element;
				name = name || self.options.layout;
				newLayout = layouts[name];

				if (newLayout) {
					// if layout is registered, we set it
					self.options.layout = name;
					self._currentLayout = newLayout;
					// configure and enable layout
					newLayout.configure(self, element);
					newLayout.enable(self, element);
				}
			}

			/**
			 * Set layout
			 * @method _setLayout
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @member ns.widget.core.Box
			 * @protected
			 */
			prototype._setLayout = function (element, value) {
				var self = this,
					currentLayoutName = self._currentLayout.name;

				if (currentLayoutName) {
					// if layout is changed, we try to reset the current one and enable the new one
					if (currentLayoutName !== value) {
						// if new options is different than the current one, we reset current layout
						disableCurrentLayout(self);
						// and set the new one
						enableNewLayout(self, element, value);
					}
				} else {
					// Enable layout for the first time
					enableNewLayout(self, element, value);
				}
			};

			/**
			 * Build Box
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.core.Box
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this;

				if (typeof CoreLayoutWidget._build === TYPE_FUNCTION) {
					CoreLayoutWidget._build.call(self, element);
				}
				// set layout
				enableNewLayout(self, element);

				return element;
			};

			/**
			 * Disable current layout.
			 * This function is called during destroying widget and changing layout.
			 * Function "layout" calls this function before setting new layout.
			 * @method disableCurrentLayout
			 * @param {ns.widget.core.Box} self
			 * @member ns.widget.core.Box
			 * @private
			 */
			function disableCurrentLayout(self) {
				var layout = self._currentLayout,
					styleSheet = self._styleSheet;

				if (typeof layout.disable === TYPE_FUNCTION) {
					// disable layout
					layout.disable(self, self.element);

					// set options
					self.options.layout = defaults.layout;
					self._currentLayout = {};

					// remove stylesheet
					if (styleSheet) {
						document.head.removeChild(styleSheet);
						self._styleSheet = null;
					}
				}
			}

			/**
			 * Destroy widget.
			 * @method _destroy
			 * @member ns.widget.core.Box
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this;

				disableCurrentLayout(self);
				if (typeof CoreLayoutWidget._destroy === TYPE_FUNCTION) {
					CoreLayoutWidget._destroy.call(self);
				}
			};

			/**
			 * Refresh Box
			 * @method _refresh
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Box
			 */
			prototype._refresh = function () {
				var self = this;
				if (typeof CoreLayoutWidget._refresh === TYPE_FUNCTION) {
					CoreLayoutWidget._refresh.call(self);
				}
				self._layout(self.element);
			};

			/**
			 * Register new layout.
			 * @method register
			 * @param {HTMLElement} name
			 * @param {Object} layout
			 * @static
			 * @member ns.widget.core.Box
			 */
			Box.register = function (name, layout) {
				layouts[name] = layout;
			};

			/**
			 * Unregister layout.
			 * @method unregister
			 * @param {HTMLElement} name
			 * @static
			 * @member ns.widget.core.Box
			 */
			Box.unregister = function (name) {
				delete layouts[name];
			};

			Box.prototype = prototype;
			ns.widget.core.Box = Box;

			engine.defineWidget(
				"Box",
				"[data-role='box']" +
				", ." + classes.box,
				[],
				Box
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Box;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
