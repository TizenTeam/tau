/*global window, define */
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
			"../../../core/util/object",
			"../../../core/util/DOM/css"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var DOM = ns.util.DOM,
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
				KEY_CODES =	{
					left: 37,
					up: 38,
					right: 39,
					down: 40,
					enter: 13
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
			 * @method _getFocusesLink
			 * @returns {HTMLElement}
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._getFocusesLink = function() {
				return document.querySelector(":focus") || document.activeElement;
			};

			/**
			 * Finds all visible links.
			 * @method _getActiveLinks
			 * @returns {Array}
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._getActiveLinks = function() {
				return [].slice.call(this.element.querySelectorAll(selectorsString)).filter(function(element){
					return element.offsetWidth && element.style.visibility !== "hidden";
				});
			};

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
					links = self._getActiveLinks(),
					currentLink = self._getFocusesLink(),
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
					nextElement;

				if (self._supportKeyboard) {
					neighborhoodLinks = self._getNeighborhoodLinks();
					switch (keyCode) {
						case KEY_CODES.left:
							nextElement = neighborhoodLinks.left;
							break;
						case KEY_CODES.up:
							nextElement = neighborhoodLinks.top;
							break;
						case KEY_CODES.right:
							nextElement = neighborhoodLinks.right;
							break;
						case KEY_CODES.down:
							nextElement = neighborhoodLinks.bottom;
							break;
					}
					if (nextElement) {
						nextElement.focus();
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
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.blur = function() {
				var focusedElement = this._getFocusesLink();
				if (focusedElement) {
					focusedElement.blur();
				}
			};

			/**
			 * Focuses on element.
			 * @method focus
			 * @param {?HTMLElement|number|boolean} [element]
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.focus = function(element) {
				var links = this._getActiveLinks(),
					linksLength = links.length,
					i;
				if (element instanceof HTMLElement) {
					for (i = 0; i < linksLength; i++) {
						if (links[i] === element) {
							element.focus();
						}
					}
				} else if (typeof element === "number") {
					if (links[element]) {
						links[element].focus();
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
				var index = selectors.indexOf(selector);
				// check if not registered yet
				if (index === -1) {
					selectors.push(selector);
					// new selector - create reference counter for it
					REF_COUNTERS.push(1);
				} else {
					// such a selector exist - increment reference counter
					++REF_COUNTERS[index];
				}
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
				var index = selectors.indexOf(selector);
				if (index != -1) {
					--REF_COUNTERS[index];
					// check reference counter
					if (REF_COUNTERS[index] === 0) {
						// remove selector
						selectors.splice(index, 1);
						REF_COUNTERS.splice(index, 1);
					}
				}
				prepareSelector();
			};

			ns.widget.tv.BaseKeyboardSupport = BaseKeyboardSupport;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Drawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
