/*global window, define, CustomEvent */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Utils class with events functions
 * @class ns.utils.events
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../utils" // fetch namespace
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
				/**
				* Checks if specified variable is a array or not
				* @method isArray
				* @return {boolean}
				* @memberOf ns.utils.events
				* @private
				* @static
				*/
			var isArray = Array.isArray,
				/**
				 * @property {RegExp} SPLIT_BY_SPACES_REGEXP
				 */
				SPLIT_BY_SPACES_REGEXP = /\s+/g,
				/**
				 * Returns trimmed value
				 * @method trim
				 * @param {string} value
				 * @return {string} trimmed string
				 * @static
				 * @private
				 * @memberOf ns.utils.events
				 */
				trim = function (value) {
					return value.trim();
				},
				/**
				 * Split string to array
				 * @method trim
				 * @param {string|Array|Object} names string with one name of event, many names of events divided by spaces, array with names of widgets or object in which keys are names of events and values are callbacks
				 * @param {Function} globalListener
				 * @return {Array}
				 * @static
				 * @private
				 * @memberOf ns.utils.events
				 */
				getEventsListeners = function (names, globalListener) {
                    var name,
                        result = [],
                        i;
                    if (typeof names === 'string') {
                        names = names.split(SPLIT_BY_SPACES_REGEXP).map(trim);
                    }
					if (isArray(names)) {
                        for (i=0; i<names.length; i++) {
                            result.push({type: names[i], callback: globalListener});
                        }
                    } else {
                        for (name in names) {
                            if (names.hasOwnProperty(name)) {
                                result.push({type: name, callback: names[name]});
                            }
                        }
                    }
                    return result;
				},
				events = {
				/**
				* @method trigger
				* Triggers custom event fastOn element
				* The return value is false, if at least one of the event
				* handlers which handled this event, called preventDefault.
				* Otherwise it returns true.
				* @param {HTMLElement} element
				* @param {string} type
				* @param {?*} [data=null]
				* @param {boolean=} [bubbles=true]
				* @param {boolean=} [cancelable=true]
				* @return {boolean=}
				* @memberOf ns.utils.events
				* @static
				*/
				trigger: function ejUtilsEvents_trigger(element, type, data, bubbles, cancelable) {
					var evt = new CustomEvent(type, {
							"detail": data,
							//allow event to bubble up, required if we want to allow to listen fastOn document etc
							bubbles: typeof bubbles === "boolean" ? bubbles : true,
							cancelable: typeof cancelable === "boolean" ? cancelable : true
						});
					//>>excludeStart("ejDebug", pragmas.ejDebug);
					ns.log("triggered event " + type + " on:", element.tagName + '#' + (element.id || "--no--id--"));
					//>>excludeEnd("ejDebug");
					return element.dispatchEvent(evt);
				},

				/**
				 * Prevent default fastOn original event
				 * @method preventDefault
				 * @param {CustomEvent} event
				 * @memberOf ns.utils.events
				 * @static
				 */
				preventDefault: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;
					if (originalEvent && originalEvent.preventDefault) {
						originalEvent.preventDefault();
					}
					event.preventDefault();
				},

				/**
				* Stop event propagation
				* @method stopPropagation
				* @param {CustomEvent} event
				* @memberOf ns.utils.events
				* @static
				*/
				stopPropagation: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;
					if (originalEvent && originalEvent.stopPropagation) {
						originalEvent.stopPropagation();
					}
					event.stopPropagation();
				},

				/**
				* Stop event propagation immediately
				* @method stopImmediatePropagation
				* @param {CustomEvent} event
				* @memberOf ns.utils.events
				* @static
				*/
				stopImmediatePropagation: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;
					if (originalEvent && originalEvent.stopImmediatePropagation) {
						originalEvent.stopImmediatePropagation();
					}
					event.stopImmediatePropagation();
				},

				/**
				 * Return document relative cords for event
				 * @method documentRelativeCoordsFromEvent
				 * @param {Event} event
				 * @return {Object}
				 * @return {number} return.x
				 * @return {number} return.y
				 * @memberOf ns.utils.events
				 * @static
				 */
				documentRelativeCoordsFromEvent: function(event) {
					var _event = event ? event : window.event,
							client = {
								x: _event.clientX,
								y: _event.clientY
							},
							page = {
								x: _event.pageX,
								y: _event.pageY
							},
							posX = 0,
							posY = 0,
							touch0,
							body = document.body,
							documentElement = document.documentElement;

						if (event.type.match(/^touch/)) {
							touch0 = _event.originalEvent.targetTouches[0];
							page = {
								x: touch0.pageX,
								y: touch0.pageY
							};
							client = {
								x: touch0.clientX,
								y: touch0.clientY
							};
						}

						if (page.x || page.y) {
							posX = page.x;
							posY = page.y;
						}
						else if (client.x || client.y) {
							posX = client.x + body.scrollLeft + documentElement.scrollLeft;
							posY = client.y + body.scrollTop  + documentElement.scrollTop;
						}

						return { x: posX, y: posY };
				},

				/**
				 * Return target relative cords for event
				 * @method targetRelativeCoordsFromEvent
				 * @param {Event} event
				 * @return {Object}
				 * @return {number} return.x
				 * @return {number} return.y
				 * @memberOf ns.utils.events
				 * @static
				 */
				targetRelativeCoordsFromEvent: function(event) {
					var target = event.target,
						cords = {
							x: event.offsetX,
							y: event.offsetY
						};

					if (cords.x === undefined || isNaN(cords.x) ||
						cords.y === undefined || isNaN(cords.y)) {
						cords = events.documentRelativeCoordsFromEvent(event);
						cords.x -= target.offsetLeft;
						cords.y -= target.offsetTop;
					}

					return cords;
				},

				/**
				 * Add event listener to element
				 * @method fastOn
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @memberOf ns.utils.events
				 * @static
				 */
				fastOn: function(element, type, listener, useCapture) {
					element.addEventListener(type, listener, useCapture || false);
				},

				/**
				 * Remove event listener to element
				 * @method fastOff
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @memberOf ns.utils.events
				 * @static
				 */
				fastOff: function(element, type, listener, useCapture) {
					element.removeEventListener(type, listener, useCapture || false);
				},

				/**
				 * Add event listener to element
				 * @method on
                 * @param {HTMLElement|HTMLCollection} element
                 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @memberOf ns.utils.events
				 * @static
				 */
				on: function(element, type, listener, useCapture) {
					var i,
                        j,
						elementsLength = elements.length,
                        typesLength,
                        elements,
                        listeners;
                    if (element instanceof HTMLElement) {
                        elements = [element];
                    } else {
                        elements = element;
                    }

                    listeners = getEventsListeners(type, listener);
                    typesLength = listeners.length;
					for (i = 0; i < elementsLength; i++) {
                        for (j = 0; j < typesLength; j++) {
                            events.fastOn(elements[i], listeners[j].type, listeners[j].callback, useCapture);
                        }
					}
				},

				/**
				 * Remove event listener to element
				 * @method off
                 * @param {HTMLElement|HTMLCollection} element
                 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @memberOf ns.utils.events
				 * @static
				 */
				off: function(element, type, listener, useCapture) {
                    var i,
                        j,
                        elementsLength = elements.length,
                        typesLength,
                        elements,
                        listeners;
                    if (element instanceof HTMLElement) {
                        elements = [element];
                    } else {
                        elements = element;
                    }

                    listeners = getEventsListeners(type, listener);
                    typesLength = listeners.length;
                    for (i = 0; i < elementsLength; i++) {
                        for (j = 0; j < typesLength; j++) {
                            events.fastOn(elements[i], listeners[j].type, listeners[j].callback, useCapture);
                        }
                    }
				},

				/**
				 * Add event listener to element only for one trigger
				 * @method one
				 * @param {HTMLElement|HTMLCollection} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @memberOf ns.utils.events
				 * @static
				 */
				one: function(element, type, listener, useCapture) {
                    var i,
                        j,
                        elementsLength = elements.length,
                        typesLength,
                        elements,
                        types,
                        listeners,
                        callback;
                    if (element instanceof HTMLElement) {
                        elements = [element];
                    } else {
                        elements = element;
                    }

                    listeners = getEventsListeners(type, listener);
                    typesLength = listeners.length;
                    for (i = 0; i < elementsLength; i++) {
                        for (j = 0; j < typesLength; j++) {
                            callback = function() {
                                events.fastOff(elements[i], listeners[j].type, callback, useCapture);
                                listeners[j].callback.apply(this, arguments);
                            }
                            events.fastOn(elements[i], listeners[j].type, callback, useCapture);
                        }
                    }
				}
			};
			ns.utils.events = events;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return events;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(ns));
