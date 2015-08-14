/*global window, define */
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
 * # Float layout
 *
 * @class ns.layout.float
 * @extends ns.layout
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../layout",
			"../util/object",
			"../widget/core/Box"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var float = {
				},
				objectUtil = ns.util.object,
				Box = ns.widget.core.Box,
				CLASSES_PREFIX = Box.classes.box,
				LAYOUT_PREFIX = CLASSES_PREFIX + "-float",
				classes = objectUtil.merge({}, Box.classes, {
					float: LAYOUT_PREFIX,
					floatLeft: LAYOUT_PREFIX + "-left",
					floatRight: LAYOUT_PREFIX + "-right",
					floatCenter: LAYOUT_PREFIX + "-center",
					floatTop: LAYOUT_PREFIX + "-top",
					floatMiddle: LAYOUT_PREFIX + "-middle",
					floatBottom: LAYOUT_PREFIX + "-bottom"
				}),
				defaults = {
					floatLayoutAlign: "left",
					floatVerticalAlign: "top",
					floatHorizontalSpacing: 0,
					floatVerticalSpacing: 0
				};

			/**
			 * Name of layout.
			 * @property {string} name
			 * @member ns.layout.float
			 */
			float.name = "float";
			/**
			 * CSS classes connected with layout.
			 * @property {Object} classes
			 * @member ns.layout.float
			 */
			float.classes = classes;
			/**
			 * Default values of properties connected with layout.
			 * There are set during Box's configuration in method configure.
			 * @property {Object} defaults
			 * @member ns.layout.float
			 */
			float.defaults = defaults;


			/**
			 * Configure layout.
			 * @method configure
			 * @param {ns.widget.core.Box} self
			 * @param {HTMLElement} element
			 * @member ns.layout.float
			 * @static
			 */
			float.configure = function(self, element) {
				// set defaults
				self.options = objectUtil.merge({}, defaults, self.options);
			};

			/**
			 * Set rule for spacing in Float Layout.
			 * @method setComponentsSpacing
			 * @param {ns.widget.core.Box} self
			 * @param {HTMLElement} element
			 * @member ns.layout.float
			 * @private
			 */
			function setComponentsSpacing(self, element) {
				var options = self.options,
					horizontal = options.floatHorizontalSpacing || defaults.floatHorizontalSpacing,
					vertical = options.floatVerticalSpacing || defaults.floatVerticalSpacing,
					propertyValue = "#" + element.id + ".ui-box-float > *:not(script)" +
					"{margin: " + horizontal / 2 + "px " + vertical / 2 + "px" + ";}";

				self.insertCSSRule(propertyValue);
			}

			/**
			 * Enable layout.
			 * @method enable
			 * @param {ns.widget.core.Box} self
			 * @param {HTMLElement} element
			 * @member ns.layout.float
			 * @static
			 */
			float.enable = function (self, element) {
				var options = self.options || {},
					classList = element.classList;

				// base class for float layout
				classList.add(classes.float);

				// configuration
				if (options.floatLayoutAlign === 'right') {
					classList.add(classes.floatRight);
				} else if (options.floatLayoutAlign === 'center') {
					classList.add(classes.floatCenter);
				} else { // default horizontal align;
					classList.add(classes.floatLeft);
				}

				switch (options.floatVerticalAlign) {
					case "middle":
						classList.add(classes.floatMiddle);
						break;
					case "bottom":
						classList.add(classes.floatBottom);
						break;
					default: // top
						classList.add(classes.floatTop);
				}

				setComponentsSpacing(self, element);
			};

			/**
			 * Disable layout.
			 * @method enable
			 * @param {ns.widget.core.Box} self
			 * @param {HTMLElement} element
			 * @member ns.layout.float
			 * @static
			 */
			float.disable = function (self, element) {
				var classList = self.element.classList;

				classList.remove(classes.floatRight);
				classList.remove(classes.floatCenter);
				classList.remove(classes.floatLeft);
				classList.remove(classes.floatTop);
				classList.remove(classes.floatMiddle);
				classList.remove(classes.floatBottom);
			};

			ns.layout.float = float;

			// Register float layout in Box widget, which can use it.
			Box.register("float", float);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.layout.float;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
