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
 * ## JavaScript API
 *
 * Float Layout
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
			"../util/selectors",
			"../util/DOM/css",
			"../util/array",
			"../widget/core/Box"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var layout = {},
				objectUtil = ns.util.object,
				selectorUtil = ns.util.selectors,
				cssUtil = ns.util.DOM,
				utilArrayMap = ns.util.array.map,
				Box = ns.widget.core.Box,
				CLASSES_PREFIX = Box.classes.box,
				LAYOUTABLE_ELEMENTS_SELECTOR = "*:not(script)",
				positionClassPrefix = "position-",

				classes = objectUtil.merge({}, Box.classes, {
					relative: CLASSES_PREFIX + "-relative"
				}),
				defaults = {
					position: null
				},
				positionFlags = {
					TOP: 1,
					BOTTOM: 2,
					LEFT: 4,
					RIGHT: 8,
					CENTER: 16
				},
				positionKeys = Object.keys(positionFlags),
				// Calculate prefixed translate rules once, as they won't change afterwards
				prefixedTranslate = (function () {
					var transform = cssUtil.getPrefixedValue("transform"),
						transformKeys = Object.keys(transform);

					return {
						xy: utilArrayMap(transformKeys, function (propKey) {
							return transform[propKey] + ":" + "translate(-50%,-50%);";
						}),
						x: utilArrayMap(transformKeys, function (propKey) {
							return transform[propKey] + ":" + "translateX(-50%);";
						}),
						y: utilArrayMap(transformKeys, function (propKey) {
							return transform[propKey] + ":" + "translateY(-50%);";
						})
					};

				}());

			layout.name = "relative";
			layout.classes = classes;
			layout.defaults = defaults;

			layout.positions = positionFlags;

			/**
			 *
			 * @param {String} id
			 * @param {String} key Index of child or selector
			 * @returns {string}
			 */
			function positionSelector(id, key) {
				var selector = "#" + id + " > " + LAYOUTABLE_ELEMENTS_SELECTOR,
					nthChild = parseInt(key, 10);

				if (!isNaN(nthChild)){
					return selector + ":nth-child(" + nthChild +")";
				}

				return selector + key;
			}

			function setPosition(self, element, positionSettings) {
				var children,
					i,
					len,
					rule = "",
					positionSelectors;

				// If none global position was defined parse children
				if (!positionSettings) {
					children = selectorUtil.getChildrenBySelector(element, LAYOUTABLE_ELEMENTS_SELECTOR);

					for (i = 0, len = children.length; i < len; i++) {
						setChildPosition(children[i]);
					}
				} else {
					positionSelectors = Object.keys(positionSettings);

					for(i = 0, len = positionSelectors.length; i < len; i++) {
						self.insertCSSRule(positionSelector(element.id, positionSelectors[i]) + " {" + createChildPosition(positionSettings[positionSelectors[i]]) + "}");
					}
				}
			}

			function parsePosition(position) {
				return position.split("-");
			}

			function createChildPosition(position) {
				var positionArray = parsePosition(position),
					cssStyles = "",
					xPos = positionArray[0],
					yPos = positionArray[1];

				if (xPos === yPos && xPos === "center") {
					cssStyles += "top:50%;left:50%;" + prefixedTranslate.xy;
				} else {
					switch(xPos) {
						case "center":
							cssStyles += "left:50%;" + prefixedTranslate.x;
							break;
						case "left":
							cssStyles += "left:0;";
							break;
						case "right":
							cssStyles += "right:0;";
							break;
						default:
							ns.warn("Layout invalid horizontal position '" + xPos + "'");
					}

					if (yPos) {
						switch(yPos) {
							case "center":
								cssStyles += "top:50%;" + prefixedTranslate.y;
								break;
							case "top":
								cssStyles += "top:0;";
								break;
							case "bottom":
								cssStyles += "bottom:0;";
								break;
							default:
								ns.warn("Layout invalid vertical position '" + yPos + "'");
						}
					}
				}

				return cssStyles;
			}

			function setChildPosition(element, position) {
				var positionArray;

				if (!position) {
					position = element.getAttribute("data-position");
				}

				// If position was defined on child elements
				if (position) {
					positionArray = parsePosition(position);
					while(positionArray.length) {
						element.classList.add(positionClassPrefix + positionArray.pop());
					}
				}
			}

			layout.configure = function(self, element) {
				// set defaults
				self.options = objectUtil.merge({}, defaults, self.options);
			};

			layout.enable = function (self, element) {
				element.classList.add(classes.relative);

				setPosition(self, element, self.options.position);
			};

			layout.disable = function (self) {
				var element = self.element || null;

				if (element) {
					element.classList.remove(classes.relative);
				}
			};

			ns.layout.relative = layout;

			// register float layout
			Box.register("relative", layout);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.layout.relative;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
