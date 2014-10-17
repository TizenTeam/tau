/*global window, define, ns, HTMLElement */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Keyboard Support for TV Widgets
 * @class ns.widget.tv.BaseKeyboardSupport
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/engine",
			"../../../core/util/object",
			"../../../core/util/DOM/css"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				DOM = ns.util.DOM,
				object = ns.util.object,
				BaseKeyboardSupport = function () {
					object.merge(this, prototype);
					// prepare selector
					if (selectorsString === "") {
						prepareSelector();
					}
				},
				prototype = {
					_supportKeyboard: false
				},
				classes = {
					focusDisabled: "ui-focus-disabled",
					focusEnabled: "ui-focus-enabled",
				},
				KEY_CODES = {
					left: 37,
					up: 38,
					right: 39,
					down: 40,
					enter: 13
				},
				EVENT_POSITION = {
					up: "up",
					down: "down",
					left: "left",
					right: "right"
				},
				selectorSuffix = ":not(." + classes.focusDisabled + ")",
				selectors = ["a", "." + classes.focusEnabled, "[tabindex]"],
				selectorsString = "",
				/**
				* @property {Array} Array containing number of registrations of each selector
				* @member ns.widget.tv.BaseKeyboardSupport
				* @private
				*/
				REF_COUNTERS = [1, 1, 1];

			BaseKeyboardSupport.KEY_CODES = KEY_CODES;
			BaseKeyboardSupport.classes = classes;
			/**
			 * Get focussed element.
			 * @method getFocusedLink
			 * @returns {HTMLElement}
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getFocusedLink() {
				return document.querySelector(":focus") || document.activeElement;
			}

			/**
			 * Finds all visible links.
			 * @method getFocusableElements
			 * @param {HTMLElement} widgetElement
			 * @returns {Array}
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getFocusableElements(widgetElement) {
				return [].slice.call(widgetElement.querySelectorAll(selectorsString)).filter(function(element){
					return element.offsetWidth && window.getComputedStyle(element).visibility !== "hidden";
				});
			}

			/**
			 * Extracts element from offsetObject.
			 * @method mapToElement
			 * @param {Object} linkOffset
			 * @param {HTMLElement} linkOffset.element
			 * @returns {HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function mapToElement(linkOffset) {
				return linkOffset.element;
			}

			/**
			 * Set string with selector
			 * @method prepareSelector
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function prepareSelector() {
				selectorsString = selectors.join(selectorSuffix + ",") + selectorSuffix;
			}

			prototype.getActiveSelector = function() {
				return selectorsString;
			};

			/**
			 * Calculates neighborhood links.
			 * @method _getNeighborhoodLinks
			 * @returns {Object}
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._getNeighborhoodLinks = function() {
				var self = this,
					offset = DOM.getElementOffset,
					links = getFocusableElements(self.element),
					currentLink = getFocusedLink(),
					currentLinkOffset,
					left,
					top,
					right,
					bottom,
					linksOffset = [],
					result;

				if (currentLink) {
					currentLinkOffset = offset(currentLink);
					linksOffset = links.map(function (link) {
						var linkOffset = offset(link),
							differentX = Math.abs(currentLinkOffset.left - linkOffset.left),
							differentY = Math.abs(currentLinkOffset.top - linkOffset.top),
							xyProportion = differentY  / differentX;
						return {
							offset: linkOffset,
							element: link,
							differentX: differentX,
							differentY: differentY,
							width: link.offsetWidth,
							height: link.offsetHeight,
							xyProportion: xyProportion
						};
					});
					top = linksOffset.filter(function (linkOffset) {
						// filter only element upper in compare with current element
						return (linkOffset.offset.top < currentLinkOffset.top);
					}).sort(function (linkOffset1, linkOffset2) {
						// sort elements
						return (linkOffset1.differentX === linkOffset2.differentX) ?
							// if elements have the same top position then on a
							// top of list will be element with
							(linkOffset1.offset.top > linkOffset2.offset.top ? -1 : 1) :
							(linkOffset1.differentX < linkOffset2.differentX ? -1 : 1)
							// sort elements, elements with shortest distance are on top of list
							;
					}).map(mapToElement);
					top = top[0];
					bottom = linksOffset.filter(function (linkOffset) {
						return (linkOffset.offset.top > currentLinkOffset.top);
					}).sort(function (linkOffset1, linkOffset2) {
						return (linkOffset1.differentX === linkOffset2.differentX) ?
							(linkOffset1.offset.top < linkOffset2.offset.top ? -1 : 1) :
							(linkOffset1.differentX < linkOffset2.differentX ? -1 : 1)
							;
					});
					bottom = bottom.map(mapToElement)[0];
					left = linksOffset.filter(function (linkOffset) {
						return (linkOffset.offset.left  < currentLinkOffset.left);
					}).sort(function (linkOffset1, linkOffset2) {
						return (linkOffset1.differentY === linkOffset2.differentY) ?
							(linkOffset1.offset.left > linkOffset2.offset.left ? -1 : 1) :
							(linkOffset1.differentY < linkOffset2.differentY ? -1 : 1)
							;
					}).map(mapToElement)[0];
					right = linksOffset.filter(function (linkOffset) {
						return (linkOffset.offset.left > currentLinkOffset.left );
					}).sort(function (linkOffset1, linkOffset2) {
						return (linkOffset1.differentY === linkOffset2.differentY) ?
							(linkOffset1.offset.left < linkOffset2.offset.left ? -1 : 1) :
							(linkOffset1.differentY < linkOffset2.differentY ? -1 : 1)
							;
					});
					right = right.map(mapToElement)[0];
				} else {
					top = left = right = bottom = links[0];
				}
				result = {
					top: top,
					left: left,
					bottom: bottom,
					right: right
				};
				return result;
			};

			/**
			 * Supports keyboard event.
			 * @method _onKeyup
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._onKeyup = function(event) {
				var self = this,
					keyCode = event.keyCode,
					neighborhoodLinks,
					currentLink = getFocusedLink(),
					currentLinkWidget,
					positionFrom,
					nextElement,
					nextElementWidget;

				if (self._supportKeyboard) {
					neighborhoodLinks = self._getNeighborhoodLinks();
					switch (keyCode) {
						case KEY_CODES.left:
							nextElement = neighborhoodLinks.left;
							positionFrom = EVENT_POSITION.left;
							break;
						case KEY_CODES.up:
							nextElement = neighborhoodLinks.top;
							positionFrom = EVENT_POSITION.up;
							break;
						case KEY_CODES.right:
							nextElement = neighborhoodLinks.right;
							positionFrom = EVENT_POSITION.right;
							break;
						case KEY_CODES.down:
							nextElement = neighborhoodLinks.bottom;
							positionFrom = EVENT_POSITION.down;
							break;
					}

					// if element to focus is found
					if (nextElement) {
						nextElementWidget = engine.getBinding(nextElement);
						if (nextElementWidget) {
							// we call function focus if the element is connected with widget
							nextElementWidget._focus(positionFrom);
						} else {
							// or only set focus on element
							nextElement.focus();
						}

						// and remove focus from previous element if it is possible
						if (currentLink) {
							currentLinkWidget = engine.getBinding(currentLink);
							if (currentLinkWidget) {
								currentLinkWidget._blur(positionFrom);
							} else {
								currentLink.blur();
							}
						}

						if (self._openActiveElement) {
							self._openActiveElement(nextElement);
						}
					}
				}
			};

			/**
			 * Add Supports keyboard event.
			 *
			 * This method should be called in _bindEvent method in widget.
			 * @method _bindEventKey
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._bindEventKey = function() {
				var self = this;
				self._onKeyupHandler = self._onKeyup.bind(self);
				document.addEventListener("keyup", self._onKeyupHandler, false);
			};

			/**
			 * Supports keyboard event.
			 *
			 * This method should be called in _destroy method in widget.
			 * @method _destroyEventKey
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._destroyEventKey = function() {
				document.removeEventListener("keyup", this._onKeyupHandler, false);
			};

			/**
			 * Blurs from focused element.
			 * @method blur
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.blurAll = function() {
				var focusedElement = getFocusedLink(),
					focusedElementWidget = focusedElement && engine.getBinding(focusedElement);

				if (focusedElementWidget) {
					// call blur on widget
					focusedElementWidget._blur();
				} else if (focusedElement) {
					// or call blur on element
					focusedElement.blur();
				}
			};

			/**
			 * Focuses on element.
			 * @method focus
			 * @param {HTMLElement} [element] widget's element
			 * @param {?HTMLElement|number|boolean} [elementToFocus] element to focus
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.focusElement = function(element, elementToFocus) {
				var links = getFocusableElements(element),
					linksLength = links.length,
					i;
				if (elementToFocus instanceof HTMLElement) {
					for (i = 0; i < linksLength; i++) {
						if (links[i] === elementToFocus) {
							elementToFocus.focus();
						}
					}
				} else if (typeof elementToFocus === "number") {
					if (links[elementToFocus]) {
						links[elementToFocus].focus();
					}
				} else {
					if (links[0]) {
						links[0].focus();
					}
				}
			};

			/**
			 * Enables keyboard support on widget.
			 * @method disableKeyboardSupport
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.enableKeyboardSupport = function() {
				this._supportKeyboard = true;
			};

			/**
			 * Disables keyboard support on widget.
			 * @method disableKeyboardSupport
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.disableKeyboardSupport = function() {
				this._supportKeyboard = false;
			};

			/**
			 * Registers an active selector.
			 * @param {string} selector
			 * @method registerActiveSelector
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.registerActiveSelector = function (selector) {
				var selectorArray = selector.split(","),
					index;

				selectorArray.forEach(function(currentSelector){
					currentSelector = currentSelector.trim();
					index = selectors.indexOf(currentSelector);

					// check if not registered yet
					if (index === -1) {
						selectors.push(currentSelector);
						// new selector - create reference counter for it
						REF_COUNTERS.push(1);
					} else {
						// such a selector exist - increment reference counter
						++REF_COUNTERS[index];
					}
				});

				prepareSelector();
			};

			/**
			 * Unregisters an active selector.
			 * @param {string} selector
			 * @method unregisterActiveSelector
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.unregisterActiveSelector = function (selector) {
				var selectorArray = selector.split(","),
					index;

				selectorArray.forEach(function(currentSelector){
					currentSelector = currentSelector.trim();
					index = selectors.indexOf(currentSelector);

					if (index !== -1) {
						--REF_COUNTERS[index];
						// check reference counter
						if (REF_COUNTERS[index] === 0) {
							// remove selector
							selectors.splice(index, 1);
							REF_COUNTERS.splice(index, 1);
						}
					}
				});

				prepareSelector();
			};

			ns.widget.tv.BaseKeyboardSupport = BaseKeyboardSupport;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Drawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
