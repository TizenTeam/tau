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
					focusEnabled: "ui-focus-enabled"
				},
				KEY_CODES = {
					left: 37,
					up: 38,
					right: 39,
					down: 40,
					enter: 13,
					tab: 9
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
				REF_COUNTERS = [1, 1, 1],
				currentKeyboardWidget,
				previousKeyboardWidgets = [];

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
			 * @method getNeighborhoodLinks
			 * @param {HTMLElement} element Base element fo find links
			 * @param {HTMLElement} [currentElement] current focused element
			 * @returns {Object}
			 * @private
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getNeighborhoodLinks(element, currentElement) {
				var offset = DOM.getElementOffset,
					links = getFocusableElements(element),
					currentLink = currentElement || getFocusedLink(),
					currentLinkOffset,
					left,
					top,
					right,
					bottom,
					linksOffset = [],
					result;

				if (currentLink && currentLink !== document.body) {
					currentLinkOffset = offset(currentLink);
					linksOffset = links.filter(function(link) {
						return link !== currentLink;
					}).map(function (link) {
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
							((linkOffset1.offset.top === linkOffset2.offset.top) ? 0 :
								(linkOffset1.offset.top > linkOffset2.offset.top ? -1 : 1)) :
								(linkOffset1.differentX < linkOffset2.differentX ? -1 : 1)
							// sort elements, elements with shortest distance are on top of list
							;
					}).map(mapToElement);
					bottom = linksOffset.filter(function (linkOffset) {
						return (linkOffset.offset.top > currentLinkOffset.top);
					}).sort(function (linkOffset1, linkOffset2) {
						return (linkOffset1.differentX === linkOffset2.differentX) ?
							(linkOffset1.offset.top === linkOffset2.offset.top ? 0 :
							(linkOffset1.offset.top < linkOffset2.offset.top ? -1 : 1)) :
							(linkOffset1.differentX < linkOffset2.differentX ? -1 : 1)
							;
					}).map(mapToElement);
					left = linksOffset.filter(function (linkOffset) {
						return (linkOffset.offset.left  < currentLinkOffset.left);
					}).sort(function (linkOffset1, linkOffset2) {
						return (linkOffset1.differentY === linkOffset2.differentY) ?
							((linkOffset1.offset.left === linkOffset2.offset.left) ? 0 :
							(linkOffset1.offset.left > linkOffset2.offset.left ? -1 : 1)) :
							(linkOffset1.differentY < linkOffset2.differentY ? -1 : 1)
							;
					}).map(mapToElement);
					right = linksOffset.filter(function (linkOffset) {
						return (linkOffset.offset.left > currentLinkOffset.left );
					}).sort(function (linkOffset1, linkOffset2) {
						return (linkOffset1.differentY === linkOffset2.differentY) ?
							(linkOffset1.offset.left === linkOffset2.offset.left ? 0 :
							(linkOffset1.offset.left < linkOffset2.offset.left ? -1 : 1)) :
							(linkOffset1.differentY < linkOffset2.differentY ? -1 : 1)
							;
					}).map(mapToElement);
				} else {
					linksOffset = links.map(function (link) {
						var linkOffset = offset(link);
						return {
							offset: linkOffset,
							element: link,
							width: link.offsetWidth,
							height: link.offsetHeight
						};
					});
					top = left = right = bottom = linksOffset.sort(function (linkOffset1, linkOffset2) {
						// sort elements
						return ((linkOffset1.offset.top === linkOffset2.offset.top) ? (linkOffset1.offset.left < linkOffset2.offset.left ? -1 : 1 ) :
								(linkOffset1.offset.top < linkOffset2.offset.top ? -1 : 1))
							// sort elements, elements with shortest distance are on top of list
							;
					}).map(mapToElement);
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
			 * Method trying to focus on widget or on HTMLElement and blur on active element or widget.
			 * @method focusOnElement
			 * @param {?ns.widget.BaseWidget} self
			 * @param {HTMLElement} element
			 * @param {"left"|"right"|"top"|"bottom"} [positionFrom]
			 * @return  {boolean} Return true if focus finished success
			 * @static
			 * @private
			 * @memberof ns.widget.tv.BaseKeyboardSupport
			 */
			function focusOnElement(self, element, positionFrom) {
				var setFocus,
					options = {},
					currentElement = getFocusedLink(),
					nextElementWidget,
					currentWidget;
				nextElementWidget = engine.getBinding(element);
				if (nextElementWidget) {
					// we call function focus if the element is connected with widget
					options.direction = positionFrom;
					options.previousElement = currentElement;
					setFocus = nextElementWidget.focus(options);
				} else {
					// or only set focus on element
					element.focus();
					// and blur the previous one
					if (currentElement) {
						currentWidget = engine.getBinding(currentElement);
						if (currentWidget) {
							options.direction = positionFrom;
							currentWidget.blur(options);
						} else {
							currentElement.blur();
						}
					}
					setFocus = true;
				}

				if (self && self._openActiveElement) {
					self._openActiveElement(element);
				}
				return setFocus;
			}

			function focusOnNeighborhood(self, element, direction, currentElement) {
				var neighborhoodLinks = getNeighborhoodLinks(element, currentElement),
					positionFrom,
					nextElements,
					nextElement,
					nextNumber = 0,
					setFocus = false;
				switch (direction) {
					case KEY_CODES.left:
						nextElements = neighborhoodLinks.left;
						nextElement = nextElements[nextNumber];
						positionFrom = EVENT_POSITION.left;
						break;
					case KEY_CODES.up:
						nextElements = neighborhoodLinks.top;
						nextElement = nextElements[nextNumber];
						positionFrom = EVENT_POSITION.up;
						break;
					case KEY_CODES.right:
						nextElements = neighborhoodLinks.right;
						nextElement = nextElements[nextNumber];
						positionFrom = EVENT_POSITION.right;
						break;
					case KEY_CODES.down:
						nextElements = neighborhoodLinks.bottom;
						nextElement = nextElements[nextNumber];
						positionFrom = EVENT_POSITION.down;
						break;
				}

				while (nextElement && !setFocus) {
					// if element to focus is found
					setFocus = focusOnElement(self, nextElement, positionFrom);
					nextElement = nextElements[++nextNumber];
				}
			}

			/**
			 * Supports keyboard event.
			 * @method _onKeyup
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._onKeyup = function(event) {
				var self = this;
				if (self._supportKeyboard) {
					focusOnNeighborhood(this, self.keybordElement || self.element, event.keyCode)
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
				if (!self._onKeyupHandler) {
					self._onKeyupHandler = self._onKeyup.bind(self);
					document.addEventListener("keyup", self._onKeyupHandler, false);
				}
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
				if (this._onKeyupHandler) {
					document.removeEventListener("keyup", this._onKeyupHandler, false);
				}
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
					focusedElementWidget.blur();
				} else if (focusedElement) {
					// or call blur on element
					focusedElement.blur();
				}
			};

			/**
			 * Focuses on element.
			 * @method focusElement
			 * @param {HTMLElement} [element] widget's element
			 * @param {?HTMLElement|number|boolean|string} [elementToFocus] element to focus
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.focusElement = function(element, elementToFocus, currentElement) {
				var links,
					linksLength,
					i;
				if (elementToFocus instanceof HTMLElement) {
					links = getFocusableElements(element);
					linksLength = links.length;
					for (i = 0; i < linksLength; i++) {
						if (links[i] === elementToFocus) {
							elementToFocus.focus();
						}
					}
				} else if (typeof elementToFocus === "number") {
					links = getFocusableElements(element);
					if (links[elementToFocus]) {
						focusOnElement(null, links[elementToFocus]);
					}
				} else if (typeof elementToFocus === "string" && KEY_CODES[elementToFocus]) {
					focusOnNeighborhood(null, element, KEY_CODES[elementToFocus], currentElement);
				} else {
					links = getFocusableElements(element);
					if (links[0]) {
						focusOnElement(null, links[0]);
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
				currentKeyboardWidget = this;
			};

			/**
			 * Enables keyboard support on widget.
			 * @method disableKeyboardSupport
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.restoreKeyboardSupport = function() {
				var previousKeyboardWidget = previousKeyboardWidgets.pop();
				if (previousKeyboardWidget) {
					previousKeyboardWidget.enableKeyboardSupport();
				}
			};

			/**
			 * Disables keyboard support on widget.
			 * @method disableKeyboardSupport
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.disableKeyboardSupport = function() {
				currentKeyboardWidget = null;
				this._supportKeyboard = false;
			};

			/**
			 * Disables keyboard support on widget.
			 * @method disableKeyboardSupport
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.saveKeyboardSupport = function() {
				if (currentKeyboardWidget) {
					previousKeyboardWidgets.push(currentKeyboardWidget);
					currentKeyboardWidget.disableKeyboardSupport();
				}
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
			 * Unregister an active selector.
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
