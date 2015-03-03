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
			"../../../core/event",
			"../../../core/util/object",
			"../../../core/util/array",
			"../../../core/util/selectors",
			"../../../core/util/DOM/css",
			"../../../core/widget/BaseWidget"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				DOM = ns.util.DOM,
				object = ns.util.object,
				utilArray = ns.util.array,
				eventUtils = ns.event,
				selectorUtils = ns.util.selectors,
				atan2 = Math.atan2,
				PI = Math.PI,
				BaseKeyboardSupport = function () {
					object.merge(this, prototype);
					// prepare selector
					if (selectorsString === "") {
						prepareSelector();
					}
					this._onKeyupHandler = null;
					this._onClickHandler = null;
					this._focusedElement = null;
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
				selectorSuffix = ":not(." + classes.focusDisabled + ")" +
								":not(." + ns.widget.BaseWidget.classes.disable + ")",
				// define standard focus selectors
				// includeDisabled: false - disabled element will be not focusable
				// includeDisabled: true - disabled element will be focusable
				// count - number of defined selectors
				selectors = [{
						value: "a",
						includeDisabled: false,
						count: 1
					}, {
						value: "." + classes.focusEnabled,
						includeDisabled: false,
						count: 1
					}, {
						value: "[tabindex]",
						includeDisabled: false,
						count: 1
					}],
				selectorsString = "",
				/**
				* @property {Array} Array containing number of registrations of each selector
				* @member ns.widget.tv.BaseKeyboardSupport
				* @private
				*/
				currentKeyboardWidget,
				previousKeyboardWidgets = [];

			BaseKeyboardSupport.KEY_CODES = KEY_CODES;
			BaseKeyboardSupport.classes = classes;
			/**
			 * Get focused element.
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
				var length = selectors.length;
				selectorsString = "";
				utilArray.forEach(selectors, function(object, index){
					selectorsString += object.value;
					if (!object.includeDisabled) {
						selectorsString += selectorSuffix;
					}
					if (index < length - 1) {
						selectorsString += ",";
					}
				});
			}

			prototype.getActiveSelector = function() {
				return selectorsString;
			};


			/**
			 * Returns angle between two elements
			 * @method getRelativeAngle
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 * @param {HTMLElement} context
			 * @param {HTMLElement} referenceElement
			 * @return {number}
			 */
			function getRelativeAngle(context, referenceElement) {
				var contextRect = context.getBoundingClientRect(),
					referenceRect = referenceElement.getBoundingClientRect();
				return atan2(contextRect.top - referenceRect.top, contextRect.left - referenceRect.left) * 180 / PI;
			}

			/**
			 * Returns direction from angle
			 * @method getDirectionFromAngle
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 * @param {number} angle
			 * @return {string}
			 */
			function getDirectionFromAngle(angle) {
				var a = Math.abs(angle);
				if (a >= 0 && a < 45) { // motion right
					return EVENT_POSITION.right;
				}

				if (a > 135 && a <= 180) { // motion left
					return EVENT_POSITION.left;
				}

				if (angle < 0) { // negative is motion up
					return EVENT_POSITION.up;
				}

				return EVENT_POSITION.down;
			}

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
			}

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
					options = {
						direction: positionFrom
					},
					currentElement = (self && self._focusedElement) || getFocusedLink(),
					nextElementWidget,
					currentWidget;
				nextElementWidget = engine.getBinding(element);
				if (nextElementWidget) {
					// we call function focus if the element is connected with widget
					options.previousElement = currentElement;
					setFocus = nextElementWidget.focus(options);
				} else {
					// or only set focus on element
					element.focus();
					options.element = element;
					eventUtils.trigger(document, "taufocus", options);
					// and blur the previous one
					if (currentElement) {
						currentWidget = engine.getBinding(currentElement);
						if (currentWidget) {
							currentWidget.blur(options);
						} else {
							currentElement.blur();
							options.element = currentElement;
							eventUtils.trigger(document, "taublur", options);
						}
					}
					setFocus = true;
				}

				if (self) {
					self._focusedElement = element;
					if (self._openActiveElement) {
						self._openActiveElement(element);
					}
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
					focusOnNeighborhood(this, self.keybordElement || self.element, event.keyCode);
				}
			};

			/**
			 * Mouse click listener
			 * @method _onClick
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._onClick = function(event) {
				var self = this,
						target = event.target,
						element = null,
						currentElement = self._focusedElement,
						fromPosition = EVENT_POSITION.down;
				if (self._supportKeyboard) {
					// check matching or find matching parent
					element = selectorUtils.matchesSelector(selectorsString, element)
							? target
							: null;
					// maybe some parent could be focused
					if (!element) {
						element = selectorUtils.getClosestBySelector(target, selectorsString);
					}

					if (element) {
						if (currentElement) {
							fromPosition = getDirectionFromAngle(
								getRelativeAngle(element, currentElement)
							);
						}
						focusOnElement(self, element, fromPosition);
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
				if (!self._onKeyupHandler) {
					self._onKeyupHandler = self._onKeyup.bind(self);
					document.addEventListener("keyup", self._onKeyupHandler, false);
				}
			};

			/**
			 * Adds support for mouse events
			 * @method _bindEventMouse
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._bindEventMouse = function () {
				var self = this;
				if (!self._onClickHandler) {
					self._onClickHandler = self._onClick.bind(self);
					document.addEventListener("click", self._onClickHandler, false);
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
			 * Removes support for mouse events
			 * @method _destroyEventMouse
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._destroyEventMouse = function () {
				if (this._onClickHandler) {
					document.removeEventListener("click", this._onClickHandler, false);
				}
			};

			/**
			 * Blurs from focused element.
			 * @method blur
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.blurAll = function() {
				var focusedElement = this._focusedElement || getFocusedLink(),
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
			 * @param {HTMLElement} [currentElement] define element which is interpreted as current focused
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
			 * Convert selector object to string
			 * @method getValueOfSelector
			 * @param {Object} selectorObject
			 * @static
			 * @private
			 * @return {string}
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getValueOfSelector(selectorObject){
				return selectorObject.value
			}

			/**
			 * Find index in selectors array for given selector
			 * @method findSelectorIndex
			 * @param {string} selector
			 * @static
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function findSelectorIndex(selector) {
				return utilArray.map(selectors, getValueOfSelector).indexOf(selector);
			}
			/**
			 * Registers an active selector.
			 * @param {string} selector
			 * @param {boolean} includeDisabled
			 * @method registerActiveSelector
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.registerActiveSelector = function (selector, includeDisabled) {
				var selectorArray = selector.split(","),
					index;

				utilArray.forEach(selectorArray, function(currentSelector){
					currentSelector = currentSelector.trim();
					index = findSelectorIndex(currentSelector);

					// check if not registered yet
					if (index === -1) {
						selectors.push({
							value: currentSelector,
							includeDisabled: includeDisabled,
							count: 1
						});
					} else {
						selectors[index].count++;
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

				utilArray.forEach(selectorArray, function(currentSelector){
					currentSelector = currentSelector.trim();
					index = findSelectorIndex(currentSelector);

					if (index !== -1) {
						--selectors[index].count;
						// check reference counter
						if (selectors[index].count === 0) {
							// remove selector
							selectors.splice(index, 1);
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
