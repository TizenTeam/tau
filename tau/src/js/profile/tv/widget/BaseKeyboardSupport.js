/*global window, define, ns, HTMLElement */
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
				keyIsPressed = false,
				PI = Math.PI,
				BaseKeyboardSupport = function () {
					var self = this;

					object.merge(self, prototype);
					// prepare selector
					if (selectorsString === "") {
						prepareSelector();
					}
					this._onKeyupHandler = null;
					this._onClickHandler = null;
					this._focusedElement = null;
					// time of keydown event
					self.keydownEventTimeStart = null; // [ms]
					// flag for keydown event
					self.keydownEventRepeated = false;
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
				previousKeyboardWidgets = [],
				ANIMATION_MIN_TIME = 50;

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
			 * @param {Object} [options] Options for function
			 * @param {Function} [options._filterNeighbors] Function used to filtering focusable elements
			 * @param {"top"|"right"|"bottom"|"left"} [options.direction] direction
			 * @returns {Object}
			 * @private
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getNeighborhoodLinks(element, currentElement, options) {
				var offset = DOM.getElementOffset,
					links = getFocusableElements(element),
					direction = options.direction,
					currentLink = currentElement || getFocusedLink(),
					customFocus = (currentLink && fetchCustomFocusElement(currentLink, direction, element)),
					filterNeighbors = options._filterNeighbors,
					currentLinkOffset,
					linksOffset = [];

				if (customFocus) {
					return [customFocus];
				}

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

					switch (direction) {
						case "up":
							return linksOffset.filter(function (linkOffset) {
								// filter only element upper in compare with current element
								return filterNeighbors ? filterNeighbors("top", linkOffset, currentLink, currentLinkOffset) : (linkOffset.offset.top < currentLinkOffset.top);
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
						case "right":
							return linksOffset.filter(function (linkOffset) {
								return filterNeighbors ? filterNeighbors("right", linkOffset, currentLink, currentLinkOffset) :(linkOffset.offset.left > currentLinkOffset.left );
							}).sort(function (linkOffset1, linkOffset2) {
								return (linkOffset1.differentY === linkOffset2.differentY) ?
									(linkOffset1.offset.left === linkOffset2.offset.left ? 0 :
									(linkOffset1.offset.left < linkOffset2.offset.left ? -1 : 1)) :
									(linkOffset1.differentY < linkOffset2.differentY ? -1 : 1)
									;
							}).map(mapToElement);
						case "down":
							return linksOffset.filter(function (linkOffset) {
								return filterNeighbors ? filterNeighbors("bottom", linkOffset, currentLink, currentLinkOffset) : (linkOffset.offset.top > currentLinkOffset.top);
							}).sort(function (linkOffset1, linkOffset2) {
								return (linkOffset1.differentX === linkOffset2.differentX) ?
									(linkOffset1.offset.top === linkOffset2.offset.top ? 0 :
									(linkOffset1.offset.top < linkOffset2.offset.top ? -1 : 1)) :
									(linkOffset1.differentX < linkOffset2.differentX ? -1 : 1)
									;
							}).map(mapToElement);
						default:
							return linksOffset.filter(function (linkOffset) {
								return filterNeighbors ? filterNeighbors("left", linkOffset, currentLink, currentLinkOffset) : (linkOffset.offset.left  < currentLinkOffset.left);
							}).sort(function (linkOffset1, linkOffset2) {
								return (linkOffset1.differentY === linkOffset2.differentY) ?
									((linkOffset1.offset.left === linkOffset2.offset.left) ? 0 :
									(linkOffset1.offset.left > linkOffset2.offset.left ? -1 : 1)) :
									(linkOffset1.differentY < linkOffset2.differentY ? -1 : 1)
									;
							}).map(mapToElement);
						}
				}
				linksOffset = utilArray.map(links, function (link) {
					var linkOffset = offset(link);
					return {
						offset: linkOffset,
						element: link,
						width: link.offsetWidth,
						height: link.offsetHeight
					};
				});
				return utilArray.map(linksOffset.sort(function (linkOffset1, linkOffset2) {
					// sort elements
					return ((linkOffset1.offset.top === linkOffset2.offset.top) ? (linkOffset1.offset.left < linkOffset2.offset.left ? -1 : 1 ) :
							(linkOffset1.offset.top < linkOffset2.offset.top ? -1 : 1))
						// sort elements, elements with shortest distance are on top of list
						;
				}), mapToElement);
			}

			/**
			 * Method trying to focus on widget or on HTMLElement and blur on active element or widget.
			 * @method focusOnElement
			 * @param {?ns.widget.BaseWidget} self
			 * @param {HTMLElement} element
			 * @param {Object} [options]
			 * @return  {boolean} Return true if focus finished success
			 * @static
			 * @private
			 * @memberof ns.widget.tv.BaseKeyboardSupport
			 */
			function focusOnElement(self, element, options) {
				var setFocus,
					currentElement = (self && self._focusedElement) || getFocusedLink(),
					nextElementWidget,
					currentWidget;

				options = options || {};
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

			function fetchCustomFocusElement(element, direction, queryContext) {
				var selector = element.getAttribute("data-focus-" + direction),
					eventData = {
						selector: selector,
						direction: direction,
						currentElement: element,
						nextElement: null
					},
					useQueryContext = element.getAttribute("data-focus-container-context") === "true",
					customQueryContextSelector = element.getAttribute("data-focus-context");

				if (selector) {
					// notify observers about custom query for focus element
					// observers can catch the event and choose their own elements
					// this supports customSelectors like ::virtualgrid-* which
					// is implemented in virtualgrid, if the event was not consumed
					// assume normal selector
					if (eventUtils.trigger(element, "focusquery", eventData, true, true)) {
						if (useQueryContext) {
							if (customQueryContextSelector) {
								queryContext = document.querySelector(customQueryContextSelector);
							}
							if (queryContext) {
								return queryContext.parentNode.querySelector(selector);
							}
						}
						return element.parentNode.querySelector(selector);
					}
					// if some code managed to fill nextElement use it
					if (eventData.nextElement) {
						return eventData.nextElement;
					}
				}

				return null;
			}

			function focusOnNeighborhood(self, element, options, currentElement) {
				var	positionFrom = "",
					nextElements = [],
					nextElement,
					nextNumber = 0,
					setFocus = false;

				switch (options.direction) {
					case KEY_CODES.left:
						positionFrom = EVENT_POSITION.left;
						break;
					case KEY_CODES.up:
						positionFrom = EVENT_POSITION.up;
						break;
					case KEY_CODES.right:
						positionFrom = EVENT_POSITION.right;
						break;
					case KEY_CODES.down:
						positionFrom = EVENT_POSITION.down;
						break;
					default:
						return;
				}
				options.direction = positionFrom;
				nextElement = fetchCustomFocusElement(element, positionFrom);
				if (!nextElement) {
					nextElements = getNeighborhoodLinks(element, currentElement, options);
					nextElement = nextElements[nextNumber];
				}

				options.direction = positionFrom;

				if (options._last) {
					// we are looking for element to focus from the farthest to the nearest
					nextNumber = nextElements.length - 1;
					nextElement = nextElements[nextNumber];
					while (nextElement && !setFocus) {
						// if element to focus is found
						setFocus = focusOnElement(self, nextElement, options);
						nextElement = nextElements[--nextNumber];
					}
				} else {
					// we are looking for element to focus from the nearest
					nextNumber = 0;
					nextElement = nextElements[nextNumber];
					while (nextElement && !setFocus) {
						// if element to focus is found
						setFocus = focusOnElement(self, nextElement, options);
						nextElement = nextElements[++nextNumber];
					}
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
					if (!self.keydownEventRepeated) {
						// short press was detected
						self._onShortPress(event);
					}
					self.keydownEventTimeStart = null;
					self.keydownEventRepeated = false;
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
			 * This function is used as a filtering function in function getNeighborhoodLinks.
			 * @method _onKeyup
			 * @param {String} direction
			 * @param {Object} filteredElement Infomation about element, which is being already filtered.
			 * @param {HTMLElement} element Current element
			 * @param {Object} [elementOffset] Offset of current element
			 * @private
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function filterNeighbors(direction, filteredElement, element, elementOffset) {
				var filteredElementOffset = filteredElement.offset,
					filteredElementHeight = filteredElement.height,
					filteredElementWidth = filteredElement.width,
					elementHeight = element.offsetHeight,
					elementWidth = element.offsetWidth;

				elementOffset = elementOffset || DOM.getElementOffset(element);

				switch (direction) {
					case "top":
						// we are looking for elements, which are above the current element, but
						// only in the same column
						if (elementOffset.left >= filteredElementOffset.left + filteredElementWidth ||
							elementOffset.left + elementWidth <= filteredElementOffset.left) {
							// if element is on the right or on the left of the current element,
							// we remove it from the set
							return false;
						}
						return filteredElementOffset.top < elementOffset.top;
					case "bottom":
						// we are looking for elements, which are under the current element, but
						// only in the same column
						if (elementOffset.left >= filteredElementOffset.left + filteredElementWidth ||
							elementOffset.left + elementWidth <= filteredElementOffset.left) {
							return false;
						}
						return filteredElementOffset.top > elementOffset.top;
					case "left":
						// we are looking for elements, which are on the left of the current element, but
						// only in the same row
						if (elementOffset.top >= filteredElementOffset.top + filteredElementHeight ||
							elementOffset.top + elementHeight <= filteredElementOffset.top) {
							return false;
						}
						return filteredElementOffset.left  < elementOffset.left;
					case "right":
						// we are looking for elements, which are ont the right of the current element, but
						// only in the same row
						if (elementOffset.top >= filteredElementOffset.top + filteredElementHeight ||
							elementOffset.top + elementHeight <= filteredElementOffset.top) {
							return false;
						}
						return filteredElementOffset.left > elementOffset.left;
				}
			}

			/**
			 * Supports keyboard long press event.
			 * It is called on keydown event, when the long press was not detected.
			 * @method _onLongPress
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._onLongPress = function(event) {
				var self = this,
					delay = ns.getConfig("keyboardLongpressInterval", 100),
					options = {
						direction: event.keyCode,
						// it is repeated event, so we make animation shorter
						duration: ((delay - 30) >= ANIMATION_MIN_TIME ? delay - 30 : ANIMATION_MIN_TIME),
						_last: true, // option for function focusOnNeighborhood
						_filterNeighbors: filterNeighbors // option for function getNeighborhoodLinks
					};

				// set focus on next element
				focusOnNeighborhood(self, self.keyboardElement || self.element, options);
			};

			/**
			 * Supports keyboard short press event.
			 * It is called on keyup event, when the long press was not detected.
			 * @method _onShortPress
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._onShortPress = function(event) {
				var self = this;

				// set focus on next element
				focusOnNeighborhood(self, self.keyboardElement || self.element, {
					direction: event.keyCode
				});
			};

			/**
			 * Supports keyboard event.
			 * @method _onKeydown
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._onKeydown = function(event) {
				var self = this,
					delay = ns.getConfig("keyboardLongpressInterval", 100),
					currentTime;

				// if widget supports keyboard's events
				if (self._supportKeyboard) {
					// stop scrolling
					event.preventDefault();
					event.stopPropagation();

					currentTime = (new Date()).getTime();
					// we check if it is a single event or repeated one
					// @note: On TV property .repeat for event is not available, so we have to count time
					//        between events
					if (!self.keydownEventTimeStart || (currentTime - self.keydownEventTimeStart > delay)) {
						// stop scrolling
						//event.preventDefault();
						//event.stopPropagation();
						// set that this is a long press
						keyIsPressed = true;

						// if it is repeated event, we make animation shorter
						if (self.keydownEventTimeStart) {
							// long press was detected
							self._onLongPress(event);
							self.keydownEventRepeated = true;
						}
						self.keydownEventTimeStart = currentTime;
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
					self._onKeydownHandler = self._onKeydown.bind(self);
					document.addEventListener("keyup", self._onKeyupHandler, false);
					document.addEventListener("keydown", self._onKeydownHandler, false);
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
					//we resign from virtual events because of problems with enter event
					document.addEventListener("mousedown", self._onClickHandler, false);
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
					document.removeEventListener("keydown", this._onKeydownHandler, false);
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
					//we resign from virtual events because of problems with enter event
					document.removeEventListener("mousedown", this._onClickHandler, false);
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
			 * @param {Object} [options]
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.focusElement = function(element, elementToFocus, options) {
				var links,
					linksLength,
					i;

				options = options || {};

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
						focusOnElement(null, links[elementToFocus], options);
					}
				} else if (typeof elementToFocus === "string" && KEY_CODES[elementToFocus]) {
					options.direction = KEY_CODES[elementToFocus];
					focusOnNeighborhood(null, element, options);
				} else {
					links = getFocusableElements(element);
					if (links[0]) {
						focusOnElement(null, links[0], options);
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
				return selectorObject.value;
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
