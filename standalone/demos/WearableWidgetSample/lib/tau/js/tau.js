/*
  * Copyright (c) 2013 Samsung Electronics Co., Ltd
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

(function(window, document, undefined) {

var ns = {},
	nsConfig = window.nsConfig = window.nsConfig || {};
nsConfig.rootNamespace = 'ns';
nsConfig.fileName = 'tau';
/*global window, console, define, ns, nsConfig */
/*jslint plusplus:true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Ej core namespace
 * @class ns
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns, nsConfig) {
	
			var idNumberCounter = 0,
			currentDate = +new Date(),
			slice = [].slice,
			rootNamespace = nsConfig.rootNamespace,
			fileName = nsConfig.fileName,
			infoForLog = function (args) {
				var dateNow = new Date();
				args.unshift('[' + rootNamespace + '][' + dateNow.toLocaleString() + ']');
			};

		/**
		* Return unique id
		* @method getUniqueId
		* @static
		* @return {string}
		* @memberOf ns
		*/
		ns.getUniqueId = function () {
			return rootNamespace + "-" + this.getNumberUniqueId() + "-" + currentDate;
		};

		/**
		* Return unique id
		* @method getNumberUniqueId
		* @static
		* @return {number}
		* @memberOf ns
		*/
		ns.getNumberUniqueId = function () {
			return idNumberCounter++;
		};

		/**
		* logs supplied messages/arguments
		* @method log
		* @static
		* @param {...*} argument
		* @memberOf ns
		*/
		ns.log = function (argument) {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.log.apply(console, args);
			}
		};

		/**
		* logs supplied messages/arguments ad marks it as warning
		* @method warn
		* @static
		* @param {...*} argument
		* @memberOf ns
		*/
		ns.warn = function (argument) {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.warn.apply(console, args);
			}
		};

		/**
		* logs supplied messages/arguments and marks it as error
		* @method error
		* @static
		* @param {...*} argument
		* @memberOf ns
		*/
		ns.error = function (argument) {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.error.apply(console, args);
			}
		};

		/**
		* get from ejConfig
		* @method get
		* @param {string} key
		* @param {Mixed} defaultValue
		* @return {Mixed}
		* @static
		* @memberOf ns
		*/
		ns.get = function (key, defaultValue) {
			return nsConfig[key] === undefined ? defaultValue : nsConfig[key];
		};

		/**
		* set in ejConfig
		* @method set
		* @param {string} key
		* @param {Mixed} value
		* @static
		* @memberOf ns
		*/
		ns.set = function (key, value) {
			nsConfig[key] = value;
		};

		/**
		 * Return path for framework script file.
		 * @method getFrameworkPath
		 * @returns {?string}
		 * @memberOf ns
		 */
		ns.getFrameworkPath = function () {
			var scripts = document.getElementsByTagName('script'),
				countScripts = scripts.length,
				i,
				url,
				arrayUrl,
				count;
			for (i = 0; i < countScripts; i++) {
				url = scripts[i].src;
				arrayUrl = url.split('/');
				count = arrayUrl.length;
				if (arrayUrl[count - 1] === fileName + '.js' || arrayUrl[count - 1] === fileName + '.min.js') {
					return arrayUrl.slice(0, count - 1).join('/');
				}
			}
			return null;
		};

		}(window, window.document, ns, nsConfig));

/*global window, define*/
/*jslint bitwise: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (ns) {
	
				ns.set('rootDir', ns.getFrameworkPath());
			ns.set('version', '');
			ns.set('allowCrossDomainPages', false);
			ns.set('domCache', false);
			}(ns));

/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Tizen Advanced UI Framework main namespace
 * @class tau
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document) {
	
				var orgTau,
				tau = {
					/**
					 * revert changes in gear namespace make by framework and return framework object
					 * @method noConflict
					 * @return {Object}
					 * @memberOf tau
					 */
					noConflict: function () {
						var newTau = window.tau;
						window.tau = orgTau;
						orgTau = null;
						return newTau;
					},
					/**
					 * Return original window.gear object;
					 * @method getOrginalNamespace
					 * @return {Object}
					 * @memberOf tau
					 */
					getOrginalNamespace: function () {
						return orgTau;
					},
					/**
					 * Create new window.gear object;
					 * @method createNewNamespace
					 * @memberOf tau
					 */
					createNewNamespace: function() {
						orgTau = orgTau || window.tau;
						window.tau = tau;
					}
				};
				tau.createNewNamespace();
				document.addEventListener('mobileinit', tau.createNewNamespace, false);
			}(window, document));

/*global window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Utils
 * Namespace for all utils class
 * @class ns.utils
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (window, ns) {
	
				var currentFrame = null,
				/**
				 * requestAnimationFrame function
				 * @method requestAnimationFrame
				 * @return {Function}
				 * @static
				 * @memberOf ns.utils
				*/
				requestAnimationFrame = (window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					function (callback) {
						currentFrame = window.setTimeout(callback.bind(callback, +new Date()), 1000 / 60);
					}).bind(window),
				/**
				* Class with utils functions
				* @class ns.utils
				*/
				/** @namespace ns.utils */
				utils = ns.utils || {};

			utils.requestAnimationFrame = requestAnimationFrame;

			/**
			* cancelAnimationFrame function
			* @method cancelAnimationFrame
			* @return {Function}
			* @memberOf ns.utils
			* @static
			*/
			utils.cancelAnimationFrame = (window.cancelAnimationFrame ||
					window.webkitCancelAnimationFrame ||
					window.mozCancelAnimationFrame ||
					window.oCancelAnimationFrame ||
					function () {
						// propably wont work if there is any more than 1
						// active animationFrame but we are trying anyway
						window.clearTimeout(currentFrame);
					}).bind(window);

			/**
			 * Method make asynchronous call of function
			 * @method async
			 * @inheritdoc #requestAnimationFrame
			 * @memberOf ns.utils
			 * @static
			 */
			utils.async = requestAnimationFrame;

			/**
			* Checks if specified string is a number or not
			* @method isNumber
			* @return {boolean}
			* @memberOf ns.utils
			* @static
			*/
			utils.isNumber = function (query) {
				var parsed = parseFloat(query);
				return !isNaN(parsed) && isFinite(parsed);
			};

			ns.utils = utils;
			}(window, ns));

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
	
				var events = {
				/**
				* @method trigger
				* Triggers custom event on element
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
							//allow event to bubble up, required if we want to allow to listen on document etc
							bubbles: typeof bubbles === "boolean" ? bubbles : true,
							cancelable: typeof cancelable === "boolean" ? cancelable : true
						});
										return element.dispatchEvent(evt);
				},

				/**
				 * Prevent default on original event
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
				 * @method on
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @memberOf ns.utils.events
				 * @static
				 */
				on: function(element, type, listener, useCapture) {
					element.addEventListener(type, listener, useCapture || false);
				},

				/**
				 * Remove event listener to element
				 * @method off
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @memberOf ns.utils.events
				 * @static
				 */
				off: function(element, type, listener, useCapture) {
					element.removeEventListener(type, listener, useCapture || false);
				},

				/**
				 * Add event listener to element
				 * @method onMany
				 * @param {HTMLCollection} elements
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @memberOf ns.utils.events
				 * @static
				 */
				onMany: function(elements, type, listener, useCapture) {
					var i,
						length = elements.length;
					for (i = 0; i < length; i++) {
						events.on(elements[i], type, listener, useCapture);
					}
				},

				/**
				 * Remove event listener to element
				 * @method offMany
				 * @param {HTMLCollection} elements
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @memberOf ns.utils.events
				 * @static
				 */
				offMany: function(elements, type, listener, useCapture) {
					var i,
						length = elements.length;
					for (i = 0; i < length; i++) {
						events.off(elements[i], type, listener, useCapture);
					}
				},

				/**
				 * Add event listener to element only for one trigger
				 * @method one
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @memberOf ns.utils.events
				 * @static
				 */
				one: function(element, type, listener, useCapture) {
					var callback = function() {
						events.off(element, type, callback, useCapture);
						listener.apply(this, arguments);
					};
					events.on(element, type, callback, useCapture);
				}
			};
			ns.utils.events = events;
			}(ns));

/*global window, define, ns */
/*jslint nomen: true, plusplus: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 * Main class with engine of library
 * @class ns.engine
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Michal Szepielak <m.szepielak@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 */
(function (window, document, ns) {
	
				/**
			 * @method slice Array.slice
			 * @private
			 * @static
			 * @memberOf ns.engine
			 */
			var slice = [].slice,
				/**
				 * @property {Object} eventUtils {@link ns.utils.events}
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				eventUtils = ns.utils.events,
				/**
				 * @property {Object} widgetDefs Object with widgets definitions
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				widgetDefs = {},
				/**
				 * @property {Object} widgetBindingMap Object with widgets bindings
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				widgetBindingMap = {},
				location = window.location,
				/**
				 * @property {boolean} justBuild engine mode, if true then engine only builds widgets
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				justBuild = location.hash === "#build",
				/**
				 * Returns trimmed value
				 * @method trim
				 * @param {string} value
				 * @return {string} trimmed string
				 * @static
				 * @private
				 * @memberOf ns.engine
				 */
				trim = function (value) {
					return value.trim();
				},
				/**
				 * @property {string} [TYPE_STRING="string"] local cache of string type name
				 * @private
				 * @static
				 * @readonly
				 * @memberOf ns.engine
				 */
				TYPE_STRING = "string",
				/**
				 * @property {string} [TYPE_FUNCTION="function"] local cache of function type name
				 * @private
				 * @static
				 * @readonly
				 * @memberOf ns.engine
				 */
				TYPE_FUNCTION = "function",
				/**
				 * @property {string} [STRING_TRUE="true"] local cache of string "true"
				 * @private
				 * @static
				 * @readonly
				 * @memberOf ns.engine
				 */
				STRING_TRUE = "true",
				/**
				 * @property {string} [DATA_BUILT="data-ej-built"] attribute informs that widget id build
				 * @private
				 * @static
				 * @readonly
				 * @memberOf ns.engine
				 */
				DATA_BUILT = "data-ej-built",
				/**
				 * @property {string} [DATA_NAME="data-ej-name"] attribute contains widget name
				 * @private
				 * @static
				 * @readonly
				 * @memberOf ns.engine
				 */
				DATA_NAME = "data-ej-name",
				/**
				 * @property {string} [DATA_BOUND="data-ej-bound"] attribute informs that widget id bound
				 * @private
				 * @static
				 * @readonly
				 * @memberOf ns.engine
				 */
				DATA_BOUND = "data-ej-bound",
				/**
				 * @property {string} [DATA_SELECTOR="data-ej-selector"] attribute contains widget selector
				 * @private
				 * @static
				 * @readonly
				 * @memberOf ns.engine
				 */
				DATA_SELECTOR = "data-ej-selector",
				/**
				 * @property {string} [querySelectorWidgets="*[data-ej-built=true][data-ej-selector][data-ej-name]:not([data-ej-bound])"] query selector for all widgets which are built but not bound
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				querySelectorWidgets = "*[" + DATA_BUILT + "=true][" + DATA_SELECTOR + "][" + DATA_NAME + "]:not([" + DATA_BOUND + "])",
				/**
				 * @property {string} [excludeBuiltAndBound=":not([data-ej-built]):not([data-ej-bound])"] attribute contains widget binding
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				excludeBuiltAndBound = ":not([" + DATA_BUILT + "]):not([" + DATA_BOUND + "])",
				/**
				 * @property {string} [EVENT_BOUND="bound"] name of bound event
				 * @private
				 * @static
				 * @readonly
				 * @memberOf ns.engine
				 */				
				EVENT_BOUND = "bound",
				/**
				 * @property {string} [EVENT_WIDGET_BUILT="widgetbuilt"] name of widget built event
				 * @private
				 * @static
				 * @readonly
				 * @memberOf ns.engine
				 */
				EVENT_WIDGET_BUILT = "widgetbuilt",
				/**
				 * @property {string} [EVENT_WIDGET_BOUND="widgetbound"] name of widget bound event
				 * @private
				 * @static
				 * @readonly
				 * @memberOf ns.engine
				 */
				EVENT_WIDGET_BOUND = "widgetbound",
				engine,
				/**
				 * @property {Object} router Router object
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				router;

			/**
			* Function to define widget
			* @method defineWidget
			* @param {string} name
			* @param {string} binding
			* @param {string} selector
			* @param {Array} methods
			* @param {Object} widgetClass
			* @param {string} [namespace]
			* @param {boolean} [redefine]
			* @param {boolean} [widgetNameToLowercase = true]
			* @return {boolean}
			* @memberOf ns.engine
			* @static
			*/
			function defineWidget(name, binding, selector, methods, widgetClass, namespace, redefine, widgetNameToLowercase) {
				// @TODO parameter binding is unused, can be removed
				var definition;
				if (!widgetDefs[name] || redefine) {
										methods = methods || [];
					methods.push("destroy", "disable", "enable", "option", "refresh", "value");
					definition = {
						name: name,
						methods: methods,
						selector: selector || "",
						selectors: selector ? selector.split(",").map(trim) : [],
						binding: binding || "",
						widgetClass: widgetClass || null,
						namespace: namespace || "",
						widgetNameToLowercase: widgetNameToLowercase === undefined ? true : !!widgetNameToLowercase
					};

					widgetDefs[name] = definition;
					eventUtils.trigger(document, "widgetdefined", definition, false);
					return true;
				}
								return false;
			}

			/**
			 * Load widget
			 * @method processWidget
			 * @param {Object} definition definition of widget
			 * @param {Object} definition.binding
			 * @param {ns.widget.BaseWidget} definition.widgetClass
			 * @param {string} definition.name
			 * @param {string} template
			 * @param {HTMLElement} element base element of widget
			 * @param {Object} [options] options for widget
			 * @private
			 * @static
			 * @memberOf ns.engine
			 */
			function processWidget(definition, template, element, options) {
									var widgetOptions = options || {},
						createFunction = widgetOptions.create,
						Widget = definition.widgetClass,
						widgetInstance = Widget ? new Widget(element) : false,
						postBuildCallback;

					if (widgetInstance) {
												widgetInstance.configure(definition, element, options);

						if (typeof createFunction === TYPE_FUNCTION) {
							eventUtils.on(element, definition.name.toLowerCase() + "create", createFunction);
						}

						if (element.id) {
							widgetInstance.id = element.id;
						}

						if (element.getAttribute(DATA_BUILT) !== STRING_TRUE) {
							element = widgetInstance.build(template, element);
						}

						if (element) {
							widgetInstance.element = element;

							setBinding(widgetInstance);

							postBuildCallback = function (element) {
								if (justBuild) {
									widgetInstance.bindEvents(element, true);
								} else {
									widgetInstance.init(element);
									widgetInstance.bindEvents(element);
								}
								eventUtils.trigger(element, EVENT_WIDGET_BOUND, widgetInstance, false);
								eventUtils.trigger(document, EVENT_WIDGET_BOUND, widgetInstance);
							}.bind(null, element);

							eventUtils.one(element, EVENT_WIDGET_BUILT, postBuildCallback, true);
							widgetInstance.trigger(EVENT_WIDGET_BUILT, widgetInstance, false);
						} else {
													}
					}
					return widgetInstance.element;
								}

			/**
			* @method Call destroy method of widget and it's child. Remove bindings.
			* @param {HTMLElement|string} element
			* @param {boolean} [childOnly=false] destroy only widget on children elements
			* @static
			* @memberOf ns.engine
			*/
			function destroyWidget(element, childOnly) {
				var widgetInstance,
					childWidgets,
					i;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(element);
				}
				
				// getBinding returns .instance directly in return statement
				// no need to access .instance property manually
				if (!childOnly) {
					widgetInstance = getBinding(element);
                    if( widgetInstance) {
                        //Destroy widget
                        widgetInstance.destroy();
                        widgetInstance.trigger("widgetdestroyed");
                    }
				}

				//Destroy child widgets, if there something left.
				childWidgets = slice.call(element.querySelectorAll("[" + DATA_BOUND + "='true']"));
				for (i = childWidgets.length - 1; i >= 0; i -= 1) {
					if (childWidgets[i]) {
						destroyWidget(childWidgets[i]);
					}
				}

				removeBinding(element);
			}

			/**
			* Load widgets from data-* definition
			* @method processHollowWidget
			* @param {Object} definition widget definition
			* @param {HTMLElement} element base element of widget
			* @param {Object} [options] options for create widget
			* @return {HTMLElement} base element of widget
			* @private
			* @static
			* @memberOf ns.engine
			*/
			function processHollowWidget(definition, element, options) {
				var name = element.getAttribute(DATA_NAME);
					definition = definition || (name && widgetDefs[name]) || {
						"name": name,
						"selector": element.getAttribute(DATA_SELECTOR),
						"binding": element.getAttribute(DATA_SELECTOR)
					};
				return processWidget(definition, null, element, options);
			}

			/**
			* Build widgets on all children of context element
			* @method createWidgets
			* @static
			* @param {HTMLElement} context base html for create children
			* @memberOf ns.engine
			*/
			function createWidgets(context) {
				var builtWithoutTemplates = slice.call(context.querySelectorAll(querySelectorWidgets)),
					selectorKeys = Object.keys(widgetDefs),
					normal = [],
					i,
					len = selectorKeys.length,
					definition,
					selectors;

				
				// @TODO EXPERIMENTAL WIDGETS WITHOUT TEMPLATE DEFINITION
				builtWithoutTemplates.forEach(processHollowWidget.bind(null, null));

				/* NORMAL */
				for (i = 0; i < len; ++i) {
					definition = widgetDefs[selectorKeys[i]];
					selectors = definition.selectors;
					if (selectors.length) {
						normal = slice.call(context.querySelectorAll(selectors.join(excludeBuiltAndBound + ",") + excludeBuiltAndBound));
						normal.forEach(processHollowWidget.bind(null, definition));
					}
				}

				eventUtils.trigger(document, "built");
				eventUtils.trigger(document, EVENT_BOUND);
							}

			/**
			 * Get binding for element
			 * @method getBinding
			 * @static
			 * @param {HTMLElement|string} element
			 * @return {?Object}
			 * @memberOf ns.engine
			 */
			function getBinding(element) {
				var id = !element || typeof element === TYPE_STRING ? element : element.id,
					binding,
					bindingInstance,
					bindingElement;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(id);
				}

				binding = widgetBindingMap[id];

				if (typeof binding === "object") {
					bindingInstance = binding.instance;
					
					if (bindingInstance.element === element) {
						return bindingInstance;
					}
					// Remove garbage
					if (element) {
						bindingInstance.destroy(element);
					} else {
						bindingInstance.destroy();
					}
				}

				return null;
			}

			/**
			* Set binding of widget
			* @method setBinding
			* @param {ns.widget.BaseWidget} widgetInstance
			* @static
			* @memberOf ns.engine
			*/
			function setBinding(widgetInstance) {
				var id = widgetInstance.id;

				
				widgetBindingMap[id] = {
					"elementId": id,
					"element": widgetInstance.element,
					"binding": widgetInstance.binding,
					"instance": widgetInstance
				};
			}

			/**
			 * Remove binding data attributes for element.
			 * @method removeBindingAttributes
			 * @param {HTMLElement} element
			 * @static
			 * @memberOf ns.engine
			 */
			function removeBindingAttributes(element) {
				element.removeAttribute(DATA_BUILT);
				element.removeAttribute(DATA_BOUND);
				element.removeAttribute(DATA_NAME);
				element.removeAttribute(DATA_SELECTOR);
			}

			/**
			 * Remove binding for widget based on element.
			 * @method removeBinding
			 * @param {HTMLElement|string} element
			 * @return {boolean}
			 * @static
			 * @memberOf ns.engine
			 */
			function removeBinding(element) {
				var id = typeof element === TYPE_STRING ? element : element.id;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(id);
				}

				if (element) {
					removeBindingAttributes(element);
				}
				if (widgetBindingMap[id]) {
					if (widgetBindingMap[id].element && typeof widgetBindingMap[id].element.setAttribute === TYPE_FUNCTION) {
						removeBindingAttributes(widgetBindingMap[id].element);
					}
					delete widgetBindingMap[id];
					return true;
				}
				return false;
			}

			/**
			 * Handler for event create
			 * @method createEventHandler
			 * @param {Event} event
			 * @static
			 * @memberOf ns.engine
			 */
			function createEventHandler(event) {
				createWidgets(event.target);
			}

			/**
			 * Build first page
			 * @method build
			 * @static
			 * @memberOf ns.engine
			 */
			function build() {
				if (router) {
					eventUtils.trigger(document, "beforerouterinit", router, false);
					router.init(justBuild);
					eventUtils.trigger(document, "routerinit", router, false);
				}
			}

			/**
			 * Method to remove all listeners bound in run
			 * @method stop
			 * @static
			 * @memberOf ns.engine
			 */
			function stop() {
				if (router) {
					router.destroy();
				}
			}
/*
			document.addEventListener(EVENT_BOUND, function () {
				//@TODO dump it to file for faster binding by ids
				nsWidgetBindingMap = widgetBindingMap;
			}, false);
*/
			ns.widgetDefinitions = {};
			engine = {
				justBuild: location.hash === "#build",
				/**
				 * @property {Object} dataEj object with names of engine attributes
				 * @property {string} [dataEj.built="data-ej-built"] attribute inform that widget id build
				 * @property {string} [dataEj.name="data-ej-name"] attribute contains widget name
				 * @property {string} [dataEj.bound="data-ej-bound"] attribute inform that widget id bound
				 * @property {string} [dataEj.selector="data-ej-selector"] attribute contains widget selector
				 * @static
				 * @memberOf ns.engine
				 */
				dataEj: {
					built: DATA_BUILT,
					name: DATA_NAME,
					bound: DATA_BOUND,
					selector: DATA_SELECTOR
				},
				destroyWidget: destroyWidget,
				createWidgets: createWidgets,

				/**
				 * Method to get all definitions of widgets
				 * @method getDefinitions
				 * @return {Object}
				 * @static
				 * @memberOf ns.engine
				 */
				getDefinitions: function () {
					return widgetDefs;
				},
				getWidgetDefinition: function (name) {
					return widgetDefs[name];
				},
				defineWidget: defineWidget,
				getBinding: getBinding,
				setBinding: setBinding,
				// @TODO either rename or fix functionally because
				// this method does not only remove binding but
				// actually destroys widget
				removeBinding: removeBinding,

				/**
				* Clear bindings of widgets
				* @method _clearBindings
				* @static
				* @protected
				* @memberOf ns.engine
				*/
				_clearBindings: function () {
					//clear and set references to the same object
					widgetBindingMap = {};
				},

				build: build,

				/**
				* Run engine
				* @method run
				* @static
				* @memberOf ns.engine
				*/
				run: function () {
					stop();

					eventUtils.on(document, "create", createEventHandler);

					eventUtils.trigger(document, "mobileinit");

					if (document.readyState === "complete") {
						build();
					} else {
						eventUtils.on(document, "DOMContentLoaded", build.bind(engine));
					}
				},

				/**
				 * Return router
				 * @method getRouter
				 * @return {Object}
				 * @static
				 * @memberOf ns.engine
				 */
				getRouter: function () {
					return router;
				},

				/**
				* Initialize router. This method should be call in file with router class definition.
				* @method initRouter
				* @param {Function} RouterClass Router class
				* @static
				* @memberOf ns.engine
				*/
				initRouter: function (RouterClass) {
					router = new RouterClass();
				},

				/**
				* Build instance of widget and binding events
				* Returns error when empty element is passed
				* @method instanceWidget
				* @param {HTMLElement} element
				* @param {string} name
				* @param {Object} options
				* @return {?Object}
				* @static
				* @memberOf ns.engine
				*/
				instanceWidget: function (element, name, options) {
					var binding = getBinding(element),
						definition;

					if (!element) {
						ns.error("'element' cannot be empty");
						return null;
					}

					if (!binding && widgetDefs[name]) {
						definition = widgetDefs[name];
						element = processHollowWidget(definition, element, options);
						binding = getBinding(element);
					}
					return binding;
				},

				stop: stop,

				/**
				 * Method to change build mode
				 * @method setJustBuild
				 * @param {boolean} newJustBuild
				 * @static
				 * @memberOf ns.engine
				 */
				setJustBuild: function (newJustBuild) {
					// Set location hash to have a consistent behavior
					if(newJustBuild){
						location.hash = "build";
					} else {
						location.hash = "";
					}

					justBuild = newJustBuild;
				},

				/**
				 * Method to get build mode
				 * @method getJustBuild
				 * @return {boolean}
				 * @static
				 * @memberOf ns.engine
				 */
				getJustBuild: function () {
					return justBuild;
				},
				_createEventHandler : createEventHandler
			};
			ns.engine = engine;
			}(window, window.document, ns));

/*global window, define, ns */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (ns) {
	
				/** @namespace ns.router */
			ns.router = ns.router || {};
			}(ns));

/*global window, define, ns */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/** @namespace ns.router.micro */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (ns) {
	
				ns.router.micro = ns.router.micro || {};
			}(ns));

/*global window, define, ns */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #route
 * Object contains rules for router.
 * @class ns.router.micro.route
 */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (ns) {
	
				ns.router.micro.route = ns.router.micro.route || {};
			}(ns));

/*global window, define, ns */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Object utilities
 * Namespace with helpers function connected with objects.
 *
 * @class ns.utils.object
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ns) {
	
	
			var object = {
				/**
				* Copy object to new object
				* @method copy
				* @param {Object} orgObject
				* @return {Object}
				* @static
				* @memberOf ns.utils.object
				*/
				copy: function (orgObject) {
					return object.merge({}, orgObject);
				},

				/**
				* Attach fields from second object to first object.
				* @method merge
				* @param {Object} newObject
				* @param {Object} orgObject
				* @return {Object}
				* @static
				* @memberOf ns.utils.object
				*/
				merge: function (newObject, orgObject) {
					var key;
					for (key in orgObject) {
						if (orgObject.hasOwnProperty(key)) {
							newObject[key] = orgObject[key];
						}
					}
					return newObject;
				},

				/**
				* Attach fields from second and next object to first object.
				* @method multiMerge
				* @param {Object} newObject
				* @param {...Object} orgObject
				* @param {?boolean} [override=true]
				* @return {Object}
				* @static
				* @memberOf ns.utils.object
				*/
				multiMerge: function ( /* newObject, orgObject, override */ ) {
					var newObject, orgObject, override,
						key,
						args = [].slice.call(arguments),
						argsLength = args.length,
						i;
					newObject = args.shift();
					override = true;
					if (typeof arguments[argsLength-1] === "boolean") {
						override = arguments[argsLength-1];
						argsLength--;
					}
					for (i = 0; i < argsLength; i++) {
						orgObject = args.shift();
						if (orgObject !== null) {
							for (key in orgObject) {
								if (orgObject.hasOwnProperty(key) && ( override || newObject[key] === undefined )) {
									newObject[key] = orgObject[key];
								}
							}
						}
					}
					return newObject;
				},

				/**
				 * Function add to Constructor prototype Base object and add to prototype properties and methods from
				 * prototype object.
				 * @method inherit
				 * @param {Function} Constructor
				 * @param {Function} Base
				 * @param {Object} prototype
				 * @static
				 * @memberOf ns.utils.object
				 */
				/* jshint -W083 */
				inherit: function( Constructor, Base, prototype ) {
					var basePrototype = new Base(),
						property,
						value;
					for (property in prototype) {
						if (prototype.hasOwnProperty(property)) {
							value = prototype[property];
							if ( typeof value === "function" ) {
								basePrototype[property] = (function createFunctionWithSuper(Base, property, value) {
									var _super = function() {
										var superFunction = Base.prototype[property];
										if (superFunction) {
											return superFunction.apply(this, arguments);
										}
										return null;
									};
									return function() {
										var __super = this._super,
											returnValue;

										this._super = _super;
										returnValue = value.apply(this, arguments);
										this._super = __super;
										return returnValue;
									};
								}(Base, property, value));
							} else {
								basePrototype[property] = value;
							}
						}
					}

					Constructor.prototype = basePrototype;
					Constructor.prototype.constructor = Constructor;
				}
			};
			ns.utils.object = object;
			}(ns));

/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #History
 * Object controls history changes.
 * @class ns.router.micro.history
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	
				var historyVolatileMode,
				object = ns.utils.object,
				historyUid = 0,
				historyActiveIndex = 0,
				windowHistory = window.history,
				history = {
					/**
					 * Property contains active state in history.
					 * @property {Object} activeState
					 * @static
					 * @memberOf ns.router.micro.history
					 */
					activeState : null,

					/**
					 * Replace or push to history.
					 * @method replace
					 * @param {Object} state
					 * @param {string} pageTitle
					 * @param {string} url
					 * @static
					 * @memberOf ns.router.micro.history
					 */
					replace: function (state, pageTitle, url) {
						var newState = object.multiMerge({},
								state,
								{
							uid: historyVolatileMode ? historyActiveIndex : ++historyUid
						});
						windowHistory[historyVolatileMode ? "replaceState" : "pushState"](newState, pageTitle, url);
						history.setActive(newState);
					},

					/**
					 * Back in history.
					 * @method back
					 * @static
					 * @memberOf ns.router.micro.history
					 */
					back: function () {
						windowHistory.back();
					},

					/**
					 * Set active state.
					 * @method setActive
					 * @param {Object} state
					 * @static
					 * @memberOf ns.router.micro.history
					 */
					setActive: function (state) {
						if (state) {
							history.activeState = state;
							historyActiveIndex = state.uid;

							if (state.volatileRecord) {
								history.enableVolatileRecord();
								return;
							}
						}

						history.disableVolatileMode();
					},

					/**
					 * Return "back" if state is in history or "forward" if it is new state.
					 * @method getDirection
					 * @param {Object} state
					 * @return {string}
					 * @static
					 * @memberOf ns.router.micro.history
					 */
					getDirection: function (state) {
						if (state) {
							return state.uid < historyActiveIndex ? "back" : "forward";
						}
						return "back";
					},

					/**
					 * Set volatile mode to true.
					 * @method enableVolatileRecord
					 * @static
					 * @memberOf ns.router.micro.history
					 */
					enableVolatileRecord: function () {
						historyVolatileMode = true;
					},

					/**
					 * Set volatile mode to true.
					 * @method disableVolatileMode
					 * @static
					 * @memberOf ns.router.micro.history
					 */
					disableVolatileMode: function () {
						historyVolatileMode = false;
					}
				};
			ns.router.micro.history = history;
			}(window, ns));

/*global window, define */
/*jslint plusplus: true, nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class tau.navigator
 * @inheritdoc ns.router.micro.Router
 * @extends ns.router.micro.Router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
(function (document, frameworkNamespace, ns) {
	
	
			document.addEventListener("beforerouterinit", function (evt) {
				var tau = ns.getOrginalNamespace();
				if (tau && tau.autoInitializePage !== undefined) {
					ns.autoInitializePage = tau.autoInitializePage;
				} else {
					ns.autoInitializePage = true;
				}
				frameworkNamespace.set('autoInitializePage', ns.autoInitializePage);
			}, false);

			document.addEventListener("routerinit", function (evt) {
				var router = evt.detail,
					history = frameworkNamespace.router.micro.history,
					navigator,
					back = history.back.bind(router),
					changePage = router.open.bind(router),
					rule = frameworkNamespace.router.micro.route;
				/**
				 * @method changePage
				 * @inheritdoc ns.router.micro.Router#open
				 * @memberOf tau
				 */
				ns.changePage = router.open.bind(router);
				document.addEventListener('pageshow', function () {
					/**
					 * Current active page
					 * @property {HTMLElement} activePage
					 * @memberOf tau
					 */
					ns.activePage = document.querySelector('.' + frameworkNamespace.widget.micro.Page.classes.uiPageActive);
				});
				/**
				 * First page element
				 * @inheritdoc ns.router.micro.Router#firstPage
				 * @property {HTMLElement} firstPage
				 * @memberOf tau
				 */
				ns.firstPage = router.getFirstPage();
				/**
				 * @inheritdoc ns.router.micro.history#back
				 * @method back
				 * @memberOf tau
				 */
				ns.back = back;
				/**
				 * @inheritdoc ns.router.micro.Router#init
				 * @method initializePage
				 * @memberOf tau
				 */
				ns.initializePage = router.init.bind(router);
				/**
				 * Page Container widget
				 * @property {HTMLElement} pageContainer
				 * @inheritdoc ns.router.micro.Router#container
				 * @memberOf tau
				 */
				ns.pageContainer = router.container;
				/**
				 * @property {Object} rule
				 * @extends ns.router.micro.route
				 * @memberOf tau
				 */
				ns.rule = rule;
				/**
				 * @method openPopup
				 * @inheritdoc ns.router.micro.Router#openPopup
				 * @memberOf tau
				 */
				ns.openPopup = function(to, options) {
					var htmlElementTo;
					if (to && to.length !== undefined && typeof to === 'object') {
						htmlElementTo = to[0];
					} else {
						htmlElementTo = to;
					}
					router.openPopup(htmlElementTo, options);
				};
				/**
				 * @method closePopup
				 * @inheritdoc ns.router.micro.Router#closePopup
				 * @memberOf tau
				 */
				ns.closePopup = router.closePopup.bind(router);

				/**
				 * @property {Object} navigator
				 * @extends ns.router.micro.Router
				 * @instance
				 * @memberOf tau
				 */
				navigator = router;
				/**
				 * @property {Object} rule object contains rules for navigator
				 * @extends ns.router.micro.rule
				 * @instance
				 * @memberOf tau.navigator
				 */
				navigator.rule = rule;
				/**
				 * @method back
				 * @inheritdoc ns.router.micro.history#back
				 * @memberOf tau.navigator
				 */
				navigator.back = back;
				/**
				 * Object to change history of browsing pages or popups
				 * @property {Object} history
				 * @extends ns.router.micro.history
				 * @memberOf tau.navigator
				 */
				navigator.history = history;
				ns.navigator = navigator;
			}, false);

			}(window.document, ns, window.tau));

/*global window, define, ns*/
/*jslint bitwise: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Object contains selectors used in widgets.
 * @class ns.micro.selectors */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (ns) {
	
			var micro = ns.micro || {};
			micro.selectors = {};
			ns.micro = micro;
			}(ns));

/*global window, define, ns */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, frameworkNamespace, ns) {
	
	
			document.addEventListener("mobileinit", function () {
				var navigator,
					selectors = frameworkNamespace.micro.selectors;

				ns.defaults = {
					autoInitializePage: true,
					pageTransition: 'none',
					popupTransition: 'none'
				};
				/**
				 * Set dynamic base tag changes.
				 * @property {boolean} [dynamicBaseEnabled=true]
				 * @memberOf tau
				 */
				ns.dynamicBaseEnabled = true;
				/**
				 * @inheritdoc ns.micro.selectors
				 * @class tau.selectors
				 * @extend ns.micro.selectors
				 */
				ns.selectors = selectors;
				navigator = ns.navigator || {};
				/**
				 * @property {Object} defaults Default values for router
				 * @property {boolean} [defaults.fromHashChange = false]
				 * @property {boolean} [defaults.reverse = false]
				 * @property {boolean} [defaults.showLoadMsg = true]
				 * @property {number} [defaults.loadMsgDelay = 0]
				 * @memberOf tau.navigator
				 */
				navigator.defaults = {
					fromHashChange: false,
					reverse: false,
					showLoadMsg: true,
					loadMsgDelay: 0
				};
				ns.navigator = navigator;
			}, false);

			}(document, ns, window.tau));

/*global define: true, window: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Selectors
 * Utils class with selectors functions
 * @class ns.utils.selectors
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, ns) {
	
				/**
			 * @method slice Alias for array slice method
			 * @memberOf ns.utils.selectors
			 * @private
			 * @static
			 */
			var slice = [].slice,
				/**
				 * @method matchesSelectorType
				 * @return {string|boolean}
				 * @memberOf ns.utils.selectors
				 * @private
				 * @static
				 */
				matchesSelectorType = (function () {
					var el = document.createElement("div");

					if (typeof el.webkitMatchesSelector === "function") {
						return "webkitMatchesSelector";
					}

					if (typeof el.mozMatchesSelector === "function") {
						return "mozMatchesSelector";
					}

					if (typeof el.msMatchesSelector === "function") {
						return "msMatchesSelector";
					}

					if (typeof el.matchesSelector === "function") {
						return "matchesSelector";
					}

					return false;
				}());

			/**
			 * Prefix selector with 'data-' and namespace if present
			 * @method getDataSelector
			 * @param {string} selector
			 * @return {string}
			 * @memberOf ns.utils.selectors
			 * @private
			 * @static
			 */
			function getDataSelector(selector) {
				var namespace = ns.get(namespace);
				return '[data-' + (namespace ? namespace + '-' : '') + selector + ']';
			}

			/**
			 * Runs matches implementation of matchesSelector
			 * method on specified element
			 * @method matchesSelector
			 * @param {HTMLElement} element
			 * @param {string} Selector
			 * @return {boolean}
			 * @static
			 * @memberOf ns.utils.selectors
			 */
			function matchesSelector(element, selector) {
				if (matchesSelectorType) {
					return element[matchesSelectorType](selector);
				}
				return false;
			}

			/**
			 * Return array with all parents of element.
			 * @method parents
			 * @param {HTMLElement} element
			 * @return {Array}
			 * @memberOf ns.utils.selectors
			 * @private
			 * @static
			 */
			function parents(element) {
				var items = [],
					current = element.parentNode;
				while (current && current !== document) {
					items.push(current);
					current = current.parentNode;
				}
				return items;
			}

			/**
			 * Checks if given element and its ancestors matches given function
			 * @method closest
			 * @param {HTMLElement} element
			 * @param {Function} testFunction
			 * @return {?HTMLElement}
			 * @memberOf ns.utils.selectors
			 * @static
			 * @private
			 */
			function closest(element, testFunction) {
				var current = element;
				while (current && current !== document) {
					if (testFunction(current)) {
						return current;
					}
					current = current.parentNode;
				}
				return null;
			}

			/**
			 * @method testSelector
			 * @param {string} selector
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @memberOf ns.utils.selectors
			 * @static
			 * @private
			 */
			function testSelector(selector, node) {
				return matchesSelector(node, selector);
			}

			/**
			 * @method testClass
			 * @param {string} className
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @memberOf ns.utils.selectors
			 * @static
			 * @private
			 */
			function testClass(className, node) {
				return node && node.classList && node.classList.contains(className);
			}

			/**
			 * @method testTag
			 * @param {string} tagName
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @memberOf ns.utils.selectors
			 * @static
			 * @private
			 */
			function testTag(tagName, node) {
				return node.tagName.toLowerCase() === tagName;
			}

			/**
			 * @class ns.utils.selectors
			 */
			ns.utils.selectors = {
				matchesSelector: matchesSelector,

				/**
				* Return array with children pass by given selector.
				* @method getChildrenBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getChildrenBySelector: function (context, selector) {
					return slice.call(context.children).filter(testSelector.bind(null, selector));
				},

				/**
				* Return array with children pass by given data-namespace-selector.
				* @method getChildrenByDataNS
				* @param {HTMLElement} context
				* @param {string} dataSelector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getChildrenByDataNS: function (context, dataSelector) {
					return slice.call(context.children).filter(testSelector.bind(null, getDataSelector(dataSelector)));
				},

				/**
				* Return array with children with given class name.
				* @method getChildrenByClass
				* @param {HTMLElement} context
				* @param {string} className
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getChildrenByClass: function (context, className) {
					return slice.call(context.children).filter(testClass.bind(null, className));
				},

				/**
				* Return array with children with given tag name.
				* @method getChildrenByTag
				* @param {HTMLElement} context
				* @param {string} tagName
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getChildrenByTag: function (context, tagName) {
					return slice.call(context.children).filter(testTag.bind(null, tagName));
				},

				/**
				* Return array with all parents of element.
				* @method getParents
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getParents: parents,

				/**
				* Return array with all parents of element pass by given selector.
				* @method getParentsBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getParentsBySelector: function (context, selector) {
					return parents(context).filter(testSelector.bind(null, selector));
				},

				/**
				* Return array with all parents of element pass by given selector with namespace.
				* @method getParentsBySelectorNS
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getParentsBySelectorNS: function (context, selector) {
					return parents(context).filter(testSelector.bind(null, getDataSelector(selector)));
				},

				/**
				* Return array with all parents of element with given class name.
				* @method getParentsByClass
				* @param {HTMLElement} context
				* @param {string} className
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getParentsByClass: function (context, className) {
					return parents(context).filter(testClass.bind(null, className));
				},

				/**
				* Return array with all parents of element with given tag name.
				* @method getParentsByTag
				* @param {HTMLElement} context
				* @param {string} tagName
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getParentsByTag: function (context, tagName) {
					return parents(context).filter(testTag.bind(null, tagName));
				},

				/**
				* Return first element from parents of element pass by selector.
				* @method getClosestBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getClosestBySelector: function (context, selector) {
					return closest(context, testSelector.bind(null, selector));
				},

				/**
				* Return first element from parents of element pass by selector with namespace.
				* @method getClosestBySelectorNS
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getClosestBySelectorNS: function (context, selector) {
					return closest(context, testSelector.bind(null, getDataSelector(selector)));
				},

				/**
				* Return first element from parents of element with given class name.
				* @method getClosestByClass
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getClosestByClass: function (context, selector) {
					return closest(context, testClass.bind(null, selector));
				},

				/**
				* Return first element from parents of element with given tag name.
				* @method getClosestByTag
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getClosestByTag: function (context, selector) {
					return closest(context, testTag.bind(null, selector));
				},

				/**
				* Return array of elements from context with given data-selector
				* @method getAllByDataNS
				* @param {HTMLElement} context
				* @param {string} dataSelector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getAllByDataNS: function (context, dataSelector) {
					return slice.call(context.querySelectorAll(getDataSelector(dataSelector)));
				}
			};
			}(window.document, ns));

/*global window, define */
/*jslint plusplus: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * # DOM Object
 * Utilities object with function to manipulation DOM
 *
 * # How to replace jQuery methods  by ns methods
 * ## append vs {@link #appendNodes}
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).append( "<span>Test</span>" );

 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.utils.DOM.appendNodes(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And
 *             <span>Test</span>
 *         </div>
 *        <div id="third">Goodbye</div>
 *     </div>
 *
 * ## replaceWith vs {@link #replaceWithNodes}
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $('#second').replaceWith("<span>Test</span>");
 *
 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.utils.DOM.replaceWithNodes(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <span>Test</span>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * ## before vs {@link #insertNodesBefore}
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).before( "<span>Test</span>" );
 *
 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.utils.DOM.insertNodesBefore(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <span>Test</span>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * ## wrapInner vs {@link #wrapInHTML}
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).wrapInner( "<span class="new"></span>" );
 *
 * #### ns manipulation
 *
 *     @example
 *     var element = document.getElementById("second");
 *     ns.utils.DOM.wrapInHTML(element, "<span class="new"></span>");
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">
 *             <span class="new">And</span>
 *         </div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * @class ns.utils.DOM
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ns) {
	
				ns.utils.DOM = ns.utils.DOM || {};
			}(ns));

/*global window, define */
/*jslint plusplus: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	
	

			var selectors = ns.utils.selectors,
				DOM = ns.utils.DOM,
				namespace = "namespace";

			/**
			 * Returns given attribute from element or the closest parent,
			 * which matches the selector.
			 * @method inheritAttr
			 * @memberOf ns.utils.DOM
			 * @param {HTMLElement} element
			 * @param {string} attr
			 * @param {string} selector
			 * @return {?string}
			 * @static
			 */
			DOM.inheritAttr = function (element, attr, selector) {
				var value = element.getAttribute(attr),
					parent;
				if (!value) {
					parent = selectors.getClosestBySelector(element, selector);
					if (parent) {
						return parent.getAttribute(attr);
					}
				}
				return value;
			};

			/**
			 * Returns Number from properties described in html tag
			 * @method getNumberFromAttribute
			 * @memberOf ns.utils.DOM
			 * @param {HTMLElement} element
			 * @param {string} attribute
			 * @param {string=} [type] auto type casting
			 * @param {number} [defaultValue] default returned value
			 * @static
			 * @return {number}
			 */
			DOM.getNumberFromAttribute = function (element, attribute, type, defaultValue) {
				var value = element.getAttribute(attribute),
					result = defaultValue;

				if (value) {
					if (type === "float") {
						value = parseFloat(value);
						if (value) {
							result = value;
						}
					} else {
						value = parseInt(value, 10);
						if (value) {
							result = value;
						}
					}
				}
				return result;
			};

			function getDataName(name) {
				var namespace = ns.get(namespace);
				return "data-" + (namespace ? namespace + "-" : "") + name;
			}

			/**
			 * This function sets value of attribute data-{namespace}-{name} for element.
			 * If the namespace is empty, the attribute data-{name} is used.
			 * @method setNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @param {string|number|boolean} value New value
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.setNSData = function (element, name, value) {
				element.setAttribute(getDataName(name), value);
			};

			/**
			 * This function returns value of attribute data-{namespace}-{name} for element.
			 * If the namespace is empty, the attribute data-{name} is used.
			 * Method may return boolean in case of 'true' or 'false' strings as attribute value.
			 * @method getNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @memberOf ns.utils.DOM
			 * @return {?string|boolean}
			 * @static
			 */
			DOM.getNSData = function (element, name) {
				var value = element.getAttribute(getDataName(name));

				if (value === "true") {
					return true;
				}

				if (value === "false") {
					return false;
				}

				return value;
			};

			/**
			 * This function returns true if attribute data-{namespace}-{name} for element is set
			 * or false in another case. If the namespace is empty, attribute data-{name} is used.
			 * @method hasNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @memberOf ns.utils.DOM
			 * @return {boolean}
			 * @static
			 */
			DOM.hasNSData = function (element, name) {
				return element.hasAttribute(getDataName(name));
			};

			/**
			 * Get or set value on data attribute.
			 * @method nsData
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @param {?Mixed} [value]
			 * @static
			 * @memberOf ns.utils.DOM
			 */
			DOM.nsData = function (element, name, value) {
				// @TODO add support for object in value
				if (value === undefined) {
					return DOM.getNSData(element, name);
				} else {
					return DOM.setNSdata(element, name, value);
				}
			};

			/**
			 * This function removes attribute data-{namespace}-{name} from element.
			 * If the namespace is empty, attribute data-{name} is used.
			 * @method removeNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.removeNSData = function (element, name) {
				element.removeAttribute(getDataName(name));
			};

			/**
			 * Returns object with all data-* attributes of element
			 * @method getData
			 * @param {HTMLElement} element Base element
			 * @memberOf ns.utils.DOM
			 * @return {Object}
			 * @static
			 */
			DOM.getData = function (element) {
				var dataPrefix = "data-",
					data = {},
					attrs = element.attributes,
					attr,
					nodeName,
					i,
					length = attrs.length;

				for (i = 0; i < length; i++) {
					attr = attrs.item(i);
					nodeName = attr.nodeName;
					if (nodeName.indexOf(dataPrefix) > -1) {
						data[nodeName.replace(dataPrefix, "")] = attr.nodeValue;
					}
				}

				return data;
			};

			/**
			 * Special function to remove attribute and property in the same time
			 * @method removeAttribute
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.removeAttribute = function (element, name) {
				element.removeAttribute(name);
				element[name] = false;
			};

			/**
			 * Special function to set attribute and property in the same time
			 * @method setAttribute
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @param {Mixed} value
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.setAttribute = function (element, name, value) {
				element[name] = value;
				element.setAttribute(name, value);
			};
			}(window, window.document, ns));

/*global window, define, RegExp */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
/**
 * #Path
 * Ej utils path namespace
 * @class ns.utils.path
 * @static
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	
					/**
				* Local alias for ns.engine
				* @property {Object} engine Alias for {@link ns.engine}
				* @memberOf ns.utils.path
				* @static
				* @private
				*/
			var engine = ns.engine,
				/**
				* Local alias for ns.utils.object
				* @property {Object} utilsObject Alias for {@link ns.utils.object}
				* @memberOf ns.utils.path
				* @static
				* @private
				*/
				utilsObject = ns.utils.object,
				/**
				* Local alias for ns.utils.selectors
				* @property {Object} utilsSelectors Alias for {@link ns.utils.selectors}
				* @memberOf ns.utils.path
				* @static
				* @private
				*/
				utilsSelectors = ns.utils.selectors,
				/**
				* Local alias for ns.utils.DOM
				* @property {Object} utilsDOM Alias for {@link ns.utils.DOM}
				* @memberOf ns.utils.path
				* @static
				* @private
				*/
				utilsDOM = ns.utils.DOM,
				/**
				* Cache for document base element
				* @memberOf ns.utils.path
				* @property {HTMLBaseElement} base
				* @static
				* @private
				*/
				base,
				/**
				 * location object
				 * @property {Object} location
				 * @static
				 * @private
				 * @memberOf ns.utils.path
				 */
				location = {},
				path = {
					/**
					 * href part for mark state
					 * @property {string} [uiStateKey="&ui-state"]
					 * @static
					 * @memberOf ns.utils.path
					 */
					uiStateKey: "&ui-state",

					// This scary looking regular expression parses an absolute URL or its relative
					// variants (protocol, site, document, query, and hash), into the various
					// components (protocol, host, path, query, fragment, etc that make up the
					// URL as well as some other commonly used sub-parts. When used with RegExp.exec()
					// or String.match, it parses the URL into a results array that looks like this:
					//
					//	[0]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content
					//	[1]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread
					//	[2]: http://jblas:password@mycompany.com:8080/mail/inbox
					//	[3]: http://jblas:password@mycompany.com:8080
					//	[4]: http:
					//	[5]: //
					//	[6]: jblas:password@mycompany.com:8080
					//	[7]: jblas:password
					//	[8]: jblas
					//	[9]: password
					//	[10]: mycompany.com:8080
					//	[11]: mycompany.com
					//	[12]: 8080
					//	[13]: /mail/inbox
					//	[14]: /mail/
					//	[15]: inbox
					//	[16]: ?msg=1234&type=unread
					//	[17]: #msg-content
					//
					/**
					* @property {RegExp} urlParseRE Regular expression for parse URL
					* @memberOf ns.utils.path
					* @static
					*/
					urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,

					/**
					* Abstraction to address xss (Issue #4787) by removing the authority in
					* browsers that auto decode it. All references to location.href should be
					* replaced with a call to this method so that it can be dealt with properly here
					* @method getLocation
					* @param {string|Object} url
					* @return {string}
					* @memberOf ns.utils.path
					*/
					getLocation: function (url) {
						var uri = this.parseUrl(url || window.location.href),
							hash = uri.hash;
						// mimic the browser with an empty string when the hash is empty
						hash = hash === "#" ? "" : hash;
						location = uri;
						// Make sure to parse the url or the location object for the hash because using location.hash
						// is autodecoded in firefox, the rest of the url should be from the object (location unless
						// we're testing) to avoid the inclusion of the authority
						return uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash;
					},

					/**
					* Return the original document url
					* @method getDocumentUrl
					* @memberOf ns.utils.path
					* @param {boolean} [asParsedObject=false]
					* @return {string|Object}
					* @static
					*/
					getDocumentUrl: function (asParsedObject) {
						return asParsedObject ? utilsObject.copy(path.documentUrl) : path.documentUrl.href;
					},

					/**
					* Parse a location into a structure
					* @method parseLocation
					* @return {Object}
					* @memberOf ns.utils.path
					*/
					parseLocation: function () {
						return this.parseUrl(this.getLocation());
					},

					/**
					* Parse a URL into a structure that allows easy access to
					* all of the URL components by name.
					* If we're passed an object, we'll assume that it is
					* a parsed url object and just return it back to the caller.
					* @method parseUrl
					* @memberOf ns.utils.path
					* @param {string|Object} url
					* @return {Object} uri record
					* @return {string} return.href
					* @return {string} return.hrefNoHash
					* @return {string} return.hrefNoSearch
					* @return {string} return.domain
					* @return {string} return.protocol
					* @return {string} return.doubleSlash
					* @return {string} return.authority
					* @return {string} return.username
					* @return {string} return.password
					* @return {string} return.host
					* @return {string} return.hostname
					* @return {string} return.port
					* @return {string} return.pathname
					* @return {string} return.directory
					* @return {string} return.filename
					* @return {string} return.search
					* @return {string} return.hash
					* @static
					*/
					parseUrl: function (url) {
						var matches;
						if (typeof url === "object") {
							return url;
						}

						matches = path.urlParseRE.exec(url || "") || [];

							// Create an object that allows the caller to access the sub-matches
							// by name. Note that IE returns an empty string instead of undefined,
							// like all other browsers do, so we normalize everything so its consistent
							// no matter what browser we're running on.
						return {
							href:		matches[0] || "",
							hrefNoHash:   matches[1] || "",
							hrefNoSearch: matches[2] || "",
							domain:	matches[3] || "",
							protocol:	matches[4] || "",
							doubleSlash:  matches[5] || "",
							authority:	matches[6] || "",
							username:	matches[8] || "",
							password:	matches[9] || "",
							host:		matches[10] || "",
							hostname:	matches[11] || "",
							port:		matches[12] || "",
							pathname:	matches[13] || "",
							directory:	matches[14] || "",
							filename:	matches[15] || "",
							search:	matches[16] || "",
							hash:		matches[17] || ""
						};
					},

					/**
					* Turn relPath into an asbolute path. absPath is
					* an optional absolute path which describes what
					* relPath is relative to.
					* @method makePathAbsolute
					* @memberOf ns.utils.path
					* @param {string} relPath
					* @param {string} [absPath=""]
					* @return {string}
					* @static
					*/
					makePathAbsolute: function (relPath, absPath) {
						var absStack,
							relStack,
							directory,
							i;
						if (relPath && relPath.charAt(0) === "/") {
							return relPath;
						}

						relPath = relPath || "";
						absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";

						absStack = absPath ? absPath.split("/") : [];
						relStack = relPath.split("/");
						for (i = 0; i < relStack.length; i++) {
							directory = relStack[i];
							switch (directory) {
							case ".":
								break;
							case "..":
								if (absStack.length) {
									absStack.pop();
								}
								break;
							default:
								absStack.push(directory);
								break;
							}
						}
						return "/" + absStack.join("/");
					},

					/**
					* Returns true if both urls have the same domain.
					* @method isSameDomain
					* @memberOf ns.utils.path
					* @param {string|Object} absUrl1
					* @param {string|Object} absUrl2
					* @return {boolean}
					* @static
					*/
					isSameDomain: function (absUrl1, absUrl2) {
						return path.parseUrl(absUrl1).domain === path.parseUrl(absUrl2).domain;
					},

					/**
					* Returns true for any relative variant.
					* @method isRelativeUrl
					* @memberOf ns.utils.path
					* @param {string|Object} url
					* @return {boolean}
					* @static
					*/
					isRelativeUrl: function (url) {
						// All relative Url variants have one thing in common, no protocol.
						return path.parseUrl(url).protocol === "";
					},

					/**
					* Returns true for an absolute url.
					* @memberOf ns.utils.path
					* @param {string} url
					* @return {boolean}
					* @static
					*/
					isAbsoluteUrl: function (url) {
						return path.parseUrl(url).protocol !== "";
					},

					/**
					* Turn the specified realtive URL into an absolute one. This function
					* can handle all relative variants (protocol, site, document, query, fragment).
					* @method makeUrlAbsolute
					* @memberOf ns.utils.path
					* @param {string} relUrl
					* @param {string} absUrl
					* @return {string}
					* @static
					*/
					makeUrlAbsolute: function (relUrl, absUrl) {
						if (!path.isRelativeUrl(relUrl)) {
							return relUrl;
						}

						var relObj = path.parseUrl(relUrl),
							absObj = path.parseUrl(absUrl),
							protocol = relObj.protocol || absObj.protocol,
							doubleSlash = relObj.protocol ? relObj.doubleSlash : (relObj.doubleSlash || absObj.doubleSlash),
							authority = relObj.authority || absObj.authority,
							hasPath = relObj.pathname !== "",
							pathname = path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname),
							search = relObj.search || (!hasPath && absObj.search) || "",
							hash = relObj.hash;

						return protocol + doubleSlash + authority + pathname + search + hash;
					},

					/**
					* Add search (aka query) params to the specified url.
					* @method addSearchParams
					* @memberOf ns.utils.path
					* @param {string|Object} url
					* @param {Object|string} params
					* @return {string}
					*/
					addSearchParams: function (url, params) {
						var urlObject = path.parseUrl(url),
							paramsString = (typeof params === "object") ? this.getAsURIParameters(params) : params,
							searchChar = urlObject.search || "?";
						return urlObject.hrefNoSearch + searchChar + (searchChar.charAt(searchChar.length - 1) === "?" ? "" : "&") + paramsString + (urlObject.hash || "");
					},

					/**
					 * Add search params to the specified url with hash
					 * @memberOf ns.utils.path
					 * @param {string|Object} url
					 * @param {Object|string} params
					 * @returns {string}
					 */
					addHashSearchParams: function (url, params) {
						var urlObject = path.parseUrl(url),
							paramsString = (typeof params === "object") ? path.getAsURIParameters(params) : params,
							hash = urlObject.hash,
							searchChar = hash ? (hash.indexOf("?") < 0 ? hash + "?" : hash + "&") : "#?";
						return urlObject.hrefNoHash + searchChar + (searchChar.charAt(searchChar.length - 1) === "?" ? "" : "&") + paramsString;
					},

					/**
					* Convert absolute Url to data Url
					* - for embedded pages strips hash and paramters
					* - for the same domain as document base remove domain
					* otherwise returns decoded absolute Url
					* @method convertUrlToDataUrl
					* @memberOf ns.utils.path
					* @param {string} absUrl
					* @param {string} dialogHashKey
					* @param {Object} documentBase uri structure
					* @return {string}
					* @static
					*/
					convertUrlToDataUrl: function (absUrl, dialogHashKey, documentBase) {
						var urlObject = path.parseUrl(absUrl);

						if (path.isEmbeddedPage(urlObject, dialogHashKey)) {
							// For embedded pages, remove the dialog hash key as in getFilePath(),
							// otherwise the Data Url won't match the id of the embedded Page.
							return urlObject.hash.replace(/^#|\?.*$/g, "");
						}
						documentBase = documentBase || path.documentBase;
						if (path.isSameDomain(urlObject, documentBase)) {
							return urlObject.hrefNoHash.replace(documentBase.domain, "");
						}

						return window.decodeURIComponent(absUrl);
					},

					/**
					* Get path from current hash, or from a file path
					* @method get
					* @memberOf ns.utils.path
					* @param {string} newPath
					* @return {string}
					*/
					get: function (newPath) {
						if (newPath === undefined) {
							newPath = this.parseLocation().hash;
						}
						return this.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, '');
					},

					/**
					* Test if a given url (string) is a path
					* NOTE might be exceptionally naive
					* @method isPath
					* @memberOf ns.utils.path
					* @param {string} url
					* @return {boolean}
					* @static
					*/
					isPath: function (url) {
						return (/\//).test(url);
					},

					/**
					* Return a url path with the window's location protocol/hostname/pathname removed
					* @method clean
					* @memberOf ns.utils.path
					* @param {string} url
					* @param {Object} documentBase  uri structure
					* @return {string}
					* @static
					*/
					clean: function (url, documentBase) {
						return url.replace(documentBase.domain, "");
					},

					/**
					* Just return the url without an initial #
					* @method stripHash
					* @memberOf ns.utils.path
					* @param {string} url
					* @return {string}
					* @static
					*/
					stripHash: function (url) {
						return url.replace(/^#/, "");
					},

					/**
					* Return the url without an query params
					* @method stripQueryParams
					* @memberOf ns.utils.path
					* @param {string} url
					* @return {string}
					* @static
					*/
					stripQueryParams: function (url) {
						return url.replace(/\?.*$/, "");
					},

					/**
					* Validation proper hash
					* @method isHashValid
					* @memberOf ns.utils.path
					* @param {string} hash
					* @static
					*/
					isHashValid: function (hash) {
						return (/^#[^#]+$/).test(hash);
					},

					/**
					* Check whether a url is referencing the same domain, or an external domain or different protocol
					* could be mailto, etc
					* @method isExternal
					* @memberOf ns.utils.path
					* @param {string|Object} url
					* @param {Object} documentUrl uri object
					* @return {boolean}
					* @static
					*/
					isExternal: function (url, documentUrl) {
						var urlObject = path.parseUrl(url);
						return urlObject.protocol && urlObject.domain !== documentUrl.domain ? true : false;
					},

					/**
					* Check if the url has protocol
					* @method hasProtocol
					* @memberOf ns.utils.path
					* @param {string} url
					* @return {boolean}
					* @static
					*/
					hasProtocol: function (url) {
						return (/^(:?\w+:)/).test(url);
					},

					/**
					 * Check if the url refers to embedded content
					 * @method isEmbedded
					 * @memberOf ns.utils.path
					 * @param {string} url
					 * @returns {boolean}
					 * @static
					 */
					isEmbedded: function (url) {
						var urlObject = path.parseUrl(url);

						if (urlObject.protocol !== "") {
							return (!path.isPath(urlObject.hash) && !!urlObject.hash && (urlObject.hrefNoHash === path.parseLocation().hrefNoHash));
						}
						return (/^#/).test(urlObject.href);
					},

					/**
					* Get the url as it would look squashed on to the current resolution url
					* @method squash
					* @memberOf ns.utils.path
					* @param {string} url
					* @param {string} [resolutionUrl=undefined]
					* @return {string}
					*/
					squash: function (url, resolutionUrl) {
						var href,
							cleanedUrl,
							search,
							stateIndex,
							isPath = this.isPath(url),
							uri = this.parseUrl(url),
							preservedHash = uri.hash,
							uiState = "";

						// produce a url against which we can resole the provided path
						resolutionUrl = resolutionUrl || (path.isPath(url) ? path.getLocation() : path.getDocumentUrl());

						// If the url is anything but a simple string, remove any preceding hash
						// eg #foo/bar -> foo/bar
						//	#foo -> #foo
						cleanedUrl = isPath ? path.stripHash(url) : url;

						// If the url is a full url with a hash check if the parsed hash is a path
						// if it is, strip the #, and use it otherwise continue without change
						cleanedUrl = path.isPath(uri.hash) ? path.stripHash(uri.hash) : cleanedUrl;

						// Split the UI State keys off the href
						stateIndex = cleanedUrl.indexOf(this.uiStateKey);

						// store the ui state keys for use
						if (stateIndex > -1) {
							uiState = cleanedUrl.slice(stateIndex);
							cleanedUrl = cleanedUrl.slice(0, stateIndex);
						}

						// make the cleanedUrl absolute relative to the resolution url
						href = path.makeUrlAbsolute(cleanedUrl, resolutionUrl);

						// grab the search from the resolved url since parsing from
						// the passed url may not yield the correct result
						search = this.parseUrl(href).search;

						// @TODO all this crap is terrible, clean it up
						if (isPath) {
							// reject the hash if it's a path or it's just a dialog key
							if (path.isPath(preservedHash) || preservedHash.replace("#", "").indexOf(this.uiStateKey) === 0) {
								preservedHash = "";
							}

							// Append the UI State keys where it exists and it's been removed
							// from the url
							if (uiState && preservedHash.indexOf(this.uiStateKey) === -1) {
								preservedHash += uiState;
							}

							// make sure that pound is on the front of the hash
							if (preservedHash.indexOf("#") === -1 && preservedHash !== "") {
								preservedHash = "#" + preservedHash;
							}

							// reconstruct each of the pieces with the new search string and hash
							href = path.parseUrl(href);
							href = href.protocol + "//" + href.host + href.pathname + search + preservedHash;
						} else {
							href += href.indexOf("#") > -1 ? uiState : "#" + uiState;
						}

						return href;
					},

					/**
					* Check if the hash is preservable
					* @method isPreservableHash
					* @memberOf ns.utils.path
					* @param {string} hash
					* @return {boolean}
					*/
					isPreservableHash: function (hash) {
						return hash.replace("#", "").indexOf(this.uiStateKey) === 0;
					},

					/**
					* Escape weird characters in the hash if it is to be used as a selector
					* @method hashToSelector
					* @memberOf ns.utils.path
					* @param {string} hash
					* @return {string}
					* @static
					*/
					hashToSelector: function (hash) {
						var hasHash = (hash.substring(0, 1) === "#");
						if (hasHash) {
							hash = hash.substring(1);
						}
						return (hasHash ? "#" : "") + hash.replace(new RegExp('([!"#$%&\'()*+,./:;<=>?@[\\]^`{|}~])', 'g'), "\\$1");
					},

					/**
					* Check if the specified url refers to the first page in the main application document.
					* @method isFirstPageUrl
					* @memberOf ns.utils.path
					* @param {string} url
					* @param {Object} documentBase uri structure
					* @param {boolean} documentBaseDiffers
					* @param {Object} documentUrl uri structure
					* @return {boolean}
					* @static
					*/
					isFirstPageUrl: function (url, documentBase, documentBaseDiffers, documentUrl) {
						var urlStructure,
							samePath,
							firstPage,
							firstPageId,
							hash;

						documentBase = documentBase === undefined ? path.documentBase : documentBase;
						documentBaseDiffers = documentBaseDiffers === undefined ? path.documentBaseDiffers : documentBaseDiffers;
						documentUrl = documentUrl === undefined ? path.documentUrl : documentUrl;

						// We only deal with absolute paths.
						urlStructure = path.parseUrl(path.makeUrlAbsolute(url, documentBase));

						// Does the url have the same path as the document?
						samePath = urlStructure.hrefNoHash === documentUrl.hrefNoHash || (documentBaseDiffers && urlStructure.hrefNoHash === documentBase.hrefNoHash);

						// Get the first page element.
						firstPage = engine.getRouter().firstPage;

						// Get the id of the first page element if it has one.
						firstPageId = firstPage ? firstPage.id : undefined;
						hash = urlStructure.hash;

						// The url refers to the first page if the path matches the document and
						// it either has no hash value, or the hash is exactly equal to the id of the
						// first page element.
						return samePath && (!hash || hash === "#" || (firstPageId && hash.replace(/^#/, "") === firstPageId));
					},

					/**
					* Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
					* requests if the document doing the request was loaded via the file:// protocol.
					* This is usually to allow the application to "phone home" and fetch app specific
					* data. We normally let the browser handle external/cross-domain urls, but if the
					* allowCrossDomainPages option is true, we will allow cross-domain http/https
					* requests to go through our page loading logic.
					* @method isPermittedCrossDomainRequest
					* @memberOf ns.utils.path
					* @param {Object} docUrl
					* @param {string} reqUrl
					* @return {boolean}
					* @static
					*/
					isPermittedCrossDomainRequest: function (docUrl, reqUrl) {
						return ns.get('allowCrossDomainPages', false) &&
							docUrl.protocol === "file:" &&
							reqUrl.search(/^https?:/) !== -1;
					},

					/**
					* Convert a object data to URI parameters
					* @method getAsURIParameters
					* @memberOf ns.utils.path
					* @param {Object} data
					* @return {string}
					* @static
					*/
					getAsURIParameters: function (data) {
						var url = '',
							key;
						for (key in data) {
							if (data.hasOwnProperty(key)) {
								url += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
							}
						}
						return url.substring(0, url.length - 1);
					},

					/**
					* Document Url
					* @memberOf ns.utils.path
					* @property {string|null} documentUrl
					*/
					documentUrl: null,

					/**
					* The document base differs
					* @memberOf ns.utils.path
					* @property {boolean} documentBaseDiffers
					*/
					documentBaseDiffers: false,

					/**
					* Set location hash to path
					* @method set
					* @memberOf ns.utils.path
					* @param {string} path
					* @static
					*/
					set: function (path) {
						location.hash = path;
					},

					/**
					* Return the substring of a filepath before the sub-page key,
					* for making a server request
					* @method getFilePath
					* @memberOf ns.utils.path
					* @param {string} path
					* @param {string} dialogHashKey
					* @return {string}
					* @static
					*/
					getFilePath: function (path, dialogHashKey) {
						var splitkey = '&' + ns.get('subPageUrlKey', '');
						return path && path.split(splitkey)[0].split(dialogHashKey)[0];
					},

					/**
					* Remove the preceding hash, any query params, and dialog notations
					* @method cleanHash
					* @memberOf ns.utils.path
					* @param {string} hash
					* @param {string} dialogHashKey
					* @return {string}
					* @static
					*/
					cleanHash: function (hash, dialogHashKey) {
						return path.stripHash(hash.replace(/\?.*$/, "").replace(dialogHashKey, ""));
					},

					/**
					* Check if url refers to the embedded page
					* @method isEmbeddedPage
					* @memberOf ns.utils.path
					* @param {string} url
					* @param {boolean} allowEmbeddedOnlyBaseDoc
					* @return {boolean}
					* @static
					*/
					isEmbeddedPage: function (url, allowEmbeddedOnlyBaseDoc) {
						var urlObject = path.parseUrl(url);

						//if the path is absolute, then we need to compare the url against
						//both the documentUrl and the documentBase. The main reason for this
						//is that links embedded within external documents will refer to the
						//application document, whereas links embedded within the application
						//document will be resolved against the document base.
						if (urlObject.protocol !== "") {
							return (urlObject.hash &&
									( allowEmbeddedOnlyBaseDoc ?
											urlObject.hrefNoHash === path.documentUrl.hrefNoHash :
											urlObject.hrefNoHash === path.parseLocation().hrefNoHash ));
						}
						return (/^#/).test(urlObject.href);
					}
				};

			path.documentUrl = path.parseLocation();

			base = document.querySelector('base');

			/**
			* The document base URL for the purposes of resolving relative URLs,
			* and the name of the default browsing context for the purposes of
			* following hyperlinks
			* @memberOf ns.utils.path
			* @property {Object} documentBase uri structure
			* @static
			*/
			path.documentBase = base ? path.parseUrl(path.makeUrlAbsolute(base.getAttribute("href"), path.documentUrl.href)) : path.documentUrl;

			path.documentBaseDiffers = (path.documentUrl.hrefNoHash !== path.documentBase.hrefNoHash);

			/**
			* Get document base
			* @method getDocumentBase
			* @memberOf ns.utils.path
			* @param {boolean} [asParsedObject=false]
			* @return {string|Object}
			* @static
			*/
			path.getDocumentBase = function (asParsedObject) {
				return asParsedObject ? utilsObject.copy(path.documentBase) : path.documentBase.href;
			};

			/**
			* Find the closest page and extract out its url
			* @method getClosestBaseUrl
			* @memberOf ns.utils.path
			* @param {HTMLElement} element
			* @param {string} selector
			* @return {string}
			* @static
			*/
			path.getClosestBaseUrl = function (element, selector) {
				// Find the closest page and extract out its url.
				var url = utilsDOM.getNSData(utilsSelectors.getClosestBySelector(element, selector), "url"),
					baseUrl = path.documentBase.hrefNoHash;

				if (!ns.get('dynamicBaseEnabled', true) || !url || !path.isPath(url)) {
					url = baseUrl;
				}

				return path.makeUrlAbsolute(url, baseUrl);
			};

			ns.utils.path = path;
			}(window, window.document, ns));

/*global window, define */
/*jslint plusplus: true */
/*jshint -W069 */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	
	
			var DOM = ns.utils.DOM;

			/**
			 * Returns css property for element
			 * @param {HTMLElement} element
			 * @param {string} property
			 * @param {string=} [def] default returned value
			 * @param {string=} [type] auto type casting
			 * @return {string|number|null}
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.getCSSProperty = function (element, property, def, type) {
				var style = window.getComputedStyle(element),
					value = null,
					result = def;
				if (style) {
					value = style.getPropertyValue(property);
					if (value) {
						switch (type) {
						case "integer":
							value = parseInt(value, 10);
							if (!isNaN(value)) {
								result = value;
							}
							break;
						case "float":
							value = parseFloat(value);
							if (!isNaN(value)) {
								result = value;
							}
							break;
						default:
							result = value;
							break;
						}
					}
				}
				return result;
			};

			/**
			 * Extracts css properties from computed css for an element.
			 * The properties values are applied to the specified
			 * properties list (dictionary)
			 * @param {HTMLElement} element
			 * @param {Object} properties
			 * @param {string=} [pseudoSelector]
			 * @param {boolean=} [noConversion]
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.extractCSSProperties = function (element, properties, pseudoSelector, noConversion) {
				var style = window.getComputedStyle(element, pseudoSelector),
					property,
					value = null,
					utils = ns.utils;
				for (property in properties) {
					if (properties.hasOwnProperty(property)) {
						value = style.getPropertyValue(property);
						if (utils.isNumber(value) && !noConversion) {
							if (value.match(/\./gi)) {
								properties[property] = parseFloat(value);
							} else {
								properties[property] = parseInt(value, 10);
							}
						} else {
							properties[property] = value;
						}
					}
				}
			};

			/**
			 * Returns elements height from computed style
			 * @param {HTMLElement} element
			 * @param {string=} [type] outer|inner
			 * @param {boolean=} [includeOffset]
			 * @param {boolean=} [includeMargin]
			 * @param {string=} [pseudoSelector]
			 * @param {boolean=} [force] check even if element is hidden
			 * @return {number}
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.getElementHeight = function (element, type, includeOffset, includeMargin, pseudoSelector, force) {
				var height = 0,
					style,
					originalDisplay = null,
					originalVisibility = null,
					originalPosition = null,
					outer = (type && type === "outer") || false,
					offsetHeight = 0,
					props = {
						"height": 0,
						"margin-top": 0,
						"margin-bottom": 0,
						"padding-top": 0,
						"padding-bottom": 0,
						"border-top-width": 0,
						"border-bottom-width": 0,
						"box-sizing": ""
					};
				if (element) {
					style = element.style;

					if (style.display !== "none") {
						this.extractCSSProperties(element, props, pseudoSelector);
						offsetHeight = element.offsetHeight;
					} else if (force) {
						originalDisplay = style.display;
						originalVisibility = style.visibility;
						originalPosition = style.position;

						style.display = "block";
						style.visibility = "hidden";
						style.position = "relative";

						this.extractCSSProperties(element, props, pseudoSelector);
						offsetHeight = element.offsetHeight;
						
						style.display = originalDisplay;
						style.visibility = originalVisibility;
						style.position = originalPosition;
					}

					height += props["height"] + props["padding-top"] + props["padding-bottom"];

					if (includeOffset) {
						height = offsetHeight;
					} else if (outer && props["box-sizing"] !== 'border-box') {
						height += props["border-top-width"] + props["border-bottom-width"];
					}

					if (includeMargin) {
						height += Math.max(0, props["margin-top"]) + Math.max(0, props["margin-bottom"]);
					}
				}
				return height;
			};

			/**
			 * Returns elements width from computed style
			 * @param {HTMLElement} element
			 * @param {string=} [type] outer|inner
			 * @param {boolean=} [includeOffset]
			 * @param {boolean=} [includeMargin]
			 * @param {string=} [pseudoSelector]
			 * @param {boolean=} [force] check even if element is hidden
			 * @return {number}
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.getElementWidth = function (element, type, includeOffset, includeMargin, pseudoSelector, force) {
				var width = 0,
					style,
					originalDisplay = null,
					originalVisibility = null,
					originalPosition = null,
					offsetWidth = 0,
					outer = (type && type === "outer") || false,
					props = {
						"width": 0,
						"margin-left": 0,
						"margin-right": 0,
						"padding-left": 0,
						"padding-right": 0,
						"border-left-width": 0,
						"border-right-width": 0,
						"box-sizing": ""
					};

				if (element) {
					style = element.style;

					if (style.display !== "none") {
						this.extractCSSProperties(element, props, pseudoSelector);
						offsetWidth = element.offsetWidth;
					} else if (force) {
						originalDisplay = style.display;
						originalVisibility = style.visibility;
						originalPosition = style.position;

						style.display = "block";
						style.visibility = "hidden";
						style.position = "relative";

						this.extractCSSProperties(element, props, pseudoSelector);
						
						style.display = originalDisplay;
						style.visibility = originalVisibility;
						style.position = originalPosition;
					}

					width += props["width"] + props["padding-left"] + props["padding-right"];

					if (includeOffset) {
						width = offsetWidth;
					} else if (outer && props["box-sizing"] !== 'border-box') {
						width += props["border-left-width"] + props["border-right-width"];
					}

					if (includeMargin) {
						width += Math.max(0, props["margin-left"]) + Math.max(0, props["margin-right"]);
					}
				}
				return width;
			};

			/**
			 * Returns offset of element
			 * @method getElementOffset
			 * @param {HTMLElement} element
			 * @return {Object}
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.getElementOffset = function (element) {
				var left = 0,
					top = 0;
				do {
					top += element.offsetTop;
					left += element.offsetLeft;
					element = element.offsetParent;
				} while (element !== null);

				return {
					top: top,
					left: left
				};
			};

			}(window, window.document, ns));

/*global window, define */
/*jslint plusplus: true, nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, frameworkNamespace, ns) {
	
	
			document.addEventListener("mobileinit", function () {
				var utils = frameworkNamespace.utils,
					utilsDOM = utils.DOM,
					events = utils.events,
					utilsObject = utils.object;
				/**
				 * @class tau.path
				 * @inheritdoc ns.utils.path
				 * @extends ns.utils.path
				 */
				ns.path = utils.path;
				/**
				 * @method fireEvent
				 * @inheritdoc ns.utils.events#trigger
				 * @memberOf tau
				 */
				ns.fireEvent = events.trigger.bind(events);
				/**
				 * @method getData
				 * @inheritdoc ns.utils.DOM#getData
				 * @memberOf tau
				 */
				ns.getData = utilsDOM.getData.bind(utilsDOM);
				/**
				 * @method extendObject
				 * @inheritdoc ns.utils.object#multiMerge
				 * @memberOf tau
				 */
				ns.extendObject = utilsObject.multiMerge.bind(utilsObject);
				/**
				 * @method inherit
				 * @inheritdoc ns.utils.object#inherit
				 * @memberOf tau
				 */
				ns.inherit = utilsObject.inherit.bind(utilsObject);
				/**
				 * Namespace with DOM utilities.
				 * @class tau.dom
				 */
				ns.dom = {
					/**
					 * @method getElementOffset
					 * @inheritdoc ns.utils.DOM#getElementOffset
					 * @static
					 * @memberOf tau.dom
					 */
					getOffset: utilsDOM.getElementOffset.bind(utilsDOM),
					/**
					 * @method triggerCustomEvent
					 * @inheritdoc ns.utils.events#trigger
					 * @memberOf tau.dom
					 */
					triggerCustomEvent: events.trigger.bind(events),
					/**
					 * @method data
					 * @inheritdoc ns.utils.DOM#nsData
					 * @static
					 * @memberOf tau.dom
					 */
					data: utilsDOM.nsData.bind(utilsDOM)
				};
			}, false);

			}(window.document, ns, window.tau));

/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (ns) {
	
				/** @namespace ns.widget */
			ns.widget = ns.widget || {};
			}(ns));

/*global window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 */
/**
 * #BaseWidget
 * Prototype class of widget
 * ## How to invoke creation of widget from JavaScript
 *
 * To build and initialize widget in JavaScript you have to use method {@link ns.engine#instanceWidget} . First argument for method
 * is HTMLElement, which specifies the element of widget. Second parameter is name of widget to create.
 *
 * If you load jQuery before initializing ej library, you can use standard jQuery UI Widget notation.
 *
 * ### Examples
 * #### Build widget from JavaScript
 *
 *     @example
 *     var element = document.getElementById('id'),
 *         ns.engine.instanceWidget(element, 'Button');
 *
 * #### Build widget from jQuery
 *
 *     @example
 *     var element = $('#id').button();
 *
 * ## How to create new widget
 *
 *     @example
 *     (function (ns) {
 *         
 *          *                 var BaseWidget = ns.widget.BaseWidget, // create alias to main objects
 *                     ...
 *                     arrayOfElements, // example of private property, common for all instances of widget
 *                     Button = function () { // create local object with widget
 *                         ...
 *                     },
 *                     prototype = new BaseWidget(); // add ns.widget.BaseWidget as prototype to widget's object, for better minification this should be assign to local variable and next variable should be assign to prototype of object
 *
 *                 function closestEnabledButton(element) { // example of private method
 *                     ...
 *                 }
 *                 ...
 *
 *                 prototype.options = { //add default options to be read from data- attributes
 *                     theme: 's',
 *                     ...
 *                 };
 *
 *                 prototype._build = function (template, element) { // method called when the widget is being built, should contain all HTML manipulation actions
 *                     ...
 *                     return element;
 *                 };
 *
 *                 prototype._init = function (element) { // method called during initialization of widget, should contain all actions necessary on application start
 *                     ...
 *                     return element;
 *                 };
 *
 *                 prototype._bindEvents = function (element) { // method to bind all events, should contain all event bindings
 *                     ...
 *                 };
 *
 *                 prototype._buildBindEvents = function (element) { // method to bind all events, should contain all event bindings necessary during build
 *                     ...
 *                 };
 *
 *                 prototype._enable = function (element) { // method called during invocation of enable() method
 *                     ...
 *                 };
 *
 *                 prototype._disable = function (element) { // method called during invocation of disable() method
 *                     ...
 *                 };
 *
 *                 prototype.refresh = function (element) { // example of public method
 *                     ...
 *                 };
 *
 *                 prototype._refresh = function () { // example of protected method
 *                     ...
 *                 };
 *
 *                 Button.prototype = prototype;
 *
 *                 engine.defineWidget( // define widget
 *                     "Button", //name of widget
 *                     "./widget/ns.widget.Button", // name of widget's module (name of file), deprecated
 *                     "[data-role='button'],button,[type='button'],[type='submit'],[type='reset']",  //widget's selector
 *                     [ // public methods, here should be list all public method, without that method will not be available
 *                         "enable",
 *                         "disable",
 *                         "refresh"
 *                     ],
 *                     Button, // widget's object
 *                     "mobile" // widget's namespace
 *                 );
 *                 ns.widget.Button = Button;
 *                  *     }(ns));
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @class ns.widget.BaseWidget
 * @alias BaseWidget
 */
(function (document, ns) {
	
				/**
			* Alias to Array.slice function
			* @method slice
			* @memberOf ns.widget.BaseWidget
			* @private
			* @static
			*/
			var slice = [].slice,
				/**
				* @property {ns.engine} engine Alias to ns.engine
				* @memberOf ns.widget.BaseWidget
				* @private
				* @static
				*/
				engine = ns.engine,
				engineDataEj = engine.dataEj,
				utils = ns.utils,
				/**
				* @property {Object} eventUtils Alias to {@link ns.utils.events}
				* @memberOf ns.widget.BaseWidget
				* @private
				* @static
				*/
				eventUtils = utils.events,
				/**
				* @property {Object} domUtils Alias to {@link ns.utils.DOM}
				* @private
				* @static
				*/
				domUtils = utils.DOM,
				/**
				 * @property {Object} objectUtils Alias to {@link ns.utils.object}
				 * @private
				 * @static
				 */
				objectUtils = utils.object,
				BaseWidget = function () {
					return this;
				},
				prototype = {},
				/**
				 * @property {string} [TYPE_FUNCTION="function"] property with string represent function type (for better minification)
				 * @private
				 * @static
				 * @readonly
				 */
				TYPE_FUNCTION = "function";

			/**
			 * Configure widget object from definition
			 * @method configure
			 * @param {Object} definition
			 * @param {string} definition.name Name of the widget
			 * @param {string} definition.selector Selector of the widget
			 * @param {HTMLElement} element
			 * @param {Object} options Configure options
			 * @memberOf ns.widget.BaseWidget
			 * @chainable
			 * @instance
			 */
			/**
			 * Protected method configuring the widget
			 * @method _configure
			 * @memberOf ns.widget.BaseWidget
			 * @template
			 * @instance
			 */
			prototype.configure = function (definition, element, options) {
				var self = this,
					definitionName,
					definitionNamespace;
				/**
				 * @property {Object} [options={}] Object with options for widget
				 * @memberOf ns.widget.BaseWidget
				 * @instance
				 */
				self.options = self.options || {};
				/**
				 * @property {?HTMLElement} [element=null] Base element of widget
				 * @memberOf ns.widget.BaseWidget
				 * @instance
				 */
				self.element = self.element || null;
				if (definition) {
					definitionName = definition.name;
					definitionNamespace = definition.namespace;
					/**
					* @property {string} name Name of the widget
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					self.name = definitionName;

					/**
					* @property {string} widgetName Name of the widget (in lower case)
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					self.widgetName = definitionName;

					/**
					* @property {string} widgetEventPrefix Namespace of widget events
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					self.widgetEventPrefix = definitionName.toLowerCase();

					/**
					* @property {string} namespace Namespace of the widget
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					self.namespace = definitionNamespace;

					/**
					* @property {string} widgetFullName Full name of the widget
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					self.widgetFullName = ((definitionNamespace ? definitionNamespace + '-' : "") + definitionName).toLowerCase();
					/**
					* @property {string} id Id of widget instance
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					self.id = ns.getUniqueId();

					/**
					* @property {string} selector widget's selector
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					self.selector = definition.selector;
				}

				if (typeof self._configure === TYPE_FUNCTION) {
					self._configure();
				}

				self._getCreateOptions(element);

				objectUtils.merge(self.options, options);
			};

			/**
			* Read data-* attributes and save to #options object
			* @method _getCreateOptions
			* @param {HTMLElement} element Base element of the widget
			* @return {Object}
			* @memberOf ns.widget.BaseWidget
			* @protected
			* @instance
			*/
			prototype._getCreateOptions = function (element) {
				var options = this.options,
					bigRegexp = new RegExp(/[A-Z]/g);
				if (options !== undefined) {
					Object.keys(options).forEach(function (option) {
						// Get value from data-{namespace}-{name} element's attribute
						// based on widget.options property keys
						var value = domUtils.getNSData(element, (option.replace(bigRegexp, function (c) {
							return "-" + c.toLowerCase();
						})));

						if (value !== null) {
							options[option] = value;
						}
					});
				}
				return options;
			};
			/**
			* Protected method building the widget
			* @method _build
			* @param template
			* @param {HTMLElement} element
			* @return {HTMLElement} widget's element
			* @memberOf ns.widget.BaseWidget
			* @protected
			* @template
			* @instance
			*/
			/**
			* Build widget. Call #\_getCreateOptions, #\_build
			* @method build
			* @param template
			* @param {HTMLElement} element
			* @return {HTMLElement} widget's element
			* @memberOf ns.widget.BaseWidget
			* @instance
			*/
			prototype.build = function (template, element) {
				var self = this,
					id,
					node;
				eventUtils.trigger(element, this.widgetEventPrefix + "beforecreate");
				element.setAttribute(engineDataEj.built, true);
				element.setAttribute(engineDataEj.binding, self.binding);
				element.setAttribute(engineDataEj.name, self.name);
				element.setAttribute(engineDataEj.selector, self.selector);
				id = element.id;
				if (id) {
					self.id = id;
				} else {
					element.id = self.id;
				}

				if (typeof self._build === TYPE_FUNCTION) {
					node = self._build(template, element);
				} else {
					node = element;
				}
				return node;
			};

			/**
			* Protected method initializing the widget
			* @method _init
			* @param {HTMLElement} element
			* @memberOf ns.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Init widget, call: #\_getCreateOptions, #\_init
			* @method init
			* @param {HTMLElement} element
			* @memberOf ns.widget.BaseWidget
			* @chainable
			* @instance
			*/
			prototype.init = function (element) {
				var self = this;
				self.id = element.id;

				if (typeof self._init === TYPE_FUNCTION) {
					self._init(element);
				}

				if (element.getAttribute("disabled")) {
					self.disable();
				} else {
					self.enable();
				}

				return self;
			};

			/**
			* Bind widget events attached in build mode
			* @method _buildBindEvents
			* @param {HTMLElement} element Base element of widget
			* @memberOf ns.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Bind widget events attached in init mode
			* @method _bindEvents
			* @param {HTMLElement} element Base element of widget
			* @memberOf ns.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Bind widget events, call: #\_buildBindEvents, #\_bindEvents
			* @method bindEvents
			* @param {HTMLElement} element Base element of the widget
			* @param {boolean} onlyBuild Inform about the type of bindings: build/init
			* @memberOf ns.widget.BaseWidget
			* @chainable
			* @instance
			*/
			prototype.bindEvents = function (element, onlyBuild) {
				var self = this;
				if (!onlyBuild) {
					element.setAttribute(engineDataEj.bound, "true");
				}
				if (typeof self._buildBindEvents === TYPE_FUNCTION) {
					self._buildBindEvents(element);
				}
				if (!onlyBuild && typeof self._bindEvents === TYPE_FUNCTION) {
					self._bindEvents(element);
				}

				self.trigger(self.widgetEventPrefix + "create", self);

				return self;
			};

			/**
			* Protected method destroying the widget
			* @method _destroy
			* @template
			* @protected
			* @memberOf ns.widget.BaseWidget
			* @instance
			*/
			/**
			* Destroy widget, call #\_destroy
			* @method destroy
			* @memberOf ns.widget.BaseWidget
			* @instance
			*/
			prototype.destroy = function (element) {
				var self = this;
				if (typeof self._destroy === TYPE_FUNCTION) {
					self._destroy(element);
				}
				if (self.element) {
					self.trigger(self.widgetEventPrefix + "destroy");
				}
				element = element || self.element;
				if (element) {
					engine.removeBinding(element);
				}
			};

			/**
			* Protected method disabling the widget
			* @method _disable
			* @protected
			* @memberOf ns.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Disable widget, call: #\_disable
			* @method disable
			* @memberOf ns.widget.BaseWidget
			* @chainable
			* @instance
			*/
			prototype.disable = function () {
				var self = this,
					element = self.element,
					args = slice.call(arguments);

				if (typeof self._disable === TYPE_FUNCTION) {
					args.unshift(element);
					self._disable.apply(self, args);
				}
				return this;
			};

			/**
			* Protected method enabling the widget
			* @method _enable
			* @protected
			* @memberOf ns.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Enable widget, call: #\_enable
			* @method enable
			* @memberOf ns.widget.BaseWidget
			* @chainable
			* @instance
			*/
			prototype.enable = function () {
				var self = this,
					element = self.element,
					args = slice.call(arguments);

				if (typeof self._enable === TYPE_FUNCTION) {
					args.unshift(element);
					self._enable.apply(self, args);
				}
				return this;
			};

			/**
			* Protected method causing the widget to refresh
			* @method _refresh
			* @protected
			* @memberOf ns.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Refresh widget, call: #\_refresh
			* @method refresh
			* @memberOf ns.widget.BaseWidget
			* @chainable
			* @instance
			*/
			prototype.refresh = function () {
				var self = this;
				if (typeof self._refresh === TYPE_FUNCTION) {
					self._refresh();
				}
				return self;
			};


			/**
			 * Get/Set options of the widget
			 * @method option
			 * @memberOf ns.widget.BaseWidget
			 * @return {*}
			 * @instance
			 */
			prototype.option = function () {
				var self = this,
					args = slice.call(arguments),
					firstArgument = args.shift(),
					secondArgument = args.shift(),
					methodName;
				/*
				* @TODO fill content of function
				*/
				if (typeof firstArgument === "string") {
					if (secondArgument === undefined) {
						methodName = '_get' + (firstArgument[0].toUpperCase() + firstArgument.slice(1));
						if (typeof self[methodName] === TYPE_FUNCTION) {
							return self[methodName]();
						}
						return self.options[firstArgument];
					}
					methodName = '_set' + (firstArgument[0].toUpperCase() + firstArgument.slice(1));
					if (typeof self[methodName] === TYPE_FUNCTION) {
						self[methodName](self.element, secondArgument);
					} else {
						this.options[firstArgument] = secondArgument;
						if (self.element) {
							self.element.setAttribute('data-' + (firstArgument.replace(/[A-Z]/g, function (c) {
								return "-" + c.toLowerCase();
							})), secondArgument);
							self.refresh();
						}
					}
				}
			};

			/**
			* Checks if the widget has bounded events through the {@link ns.widget.BaseWidget#bindEvents} method.
			* @method isBound
			* @memberOf ns.widget.BaseWidget
			* @instance
			* @return {boolean} true if events are bounded
			*/
			prototype.isBound = function () {
				var element = this.element;
				return element && element.hasAttribute(engineDataEj.bound);
			};

			/**
			* Checks if the widget was built through the {@link ns.widget.BaseWidget#build} method.
			* @method isBuilt
			* @memberOf ns.widget.BaseWidget
			* @instance
			* @return {boolean} true if the widget was built
			*/
			prototype.isBuilt = function () {
				var element = this.element;
				return element && element.hasAttribute(engineDataEj.built);
			};

			/**
			* Protected method getting the value of widget
			* @method _getValue
			* @return {*}
			* @memberOf ns.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Protected method setting the value of widget
			* @method _setValue
			* @param {*} value
			* @return {*}
			* @memberOf ns.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Get/Set value of the widget
			* @method value
			* @param {*} [value]
			* @memberOf ns.widget.BaseWidget
			* @return {*}
			* @instance
			*/
			prototype.value = function (value) {
				var self = this;
				if (value !== undefined) {
					if (typeof self._setValue === TYPE_FUNCTION) {
						return self._setValue(value);
					}
					return self;
				}
				if (typeof self._getValue === TYPE_FUNCTION) {
					return self._getValue();
				}
				return self;
			};

			/**
			 * Trigger an event on widget's element.
			 * @method trigger
			 * @param {string} eventName the name of event to trigger
			 * @param {?*} [data] additional object to be carried with the event
			 * @param {Boolean=} [bubbles=true]
			 * @param {Boolean=} [cancelable=true]
			 * @memberOf ns.widget.BaseWidget
			 * @return {boolean} false, if any callback invoked preventDefault on event object
			 * @instance
			*/
			prototype.trigger = function (eventName, data, bubbles, cancelable) {
				return eventUtils.trigger(this.element, eventName, data, bubbles, cancelable);
			};

			/**
			 * Add event listener to this.element.
			 * @method on
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param tu addEventListener
			 * @memberOf ns.widget.BaseWidget
			 * @instance
			 */
			prototype.on = function (eventName, listener, useCapture) {
				eventUtils.on(this.element, eventName, listener, useCapture);
			};

			/**
			 * Remove event listener to this.element.
			 * @method off
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param tu addEventListener
			 * @memberOf ns.widget.BaseWidget
			 * @instance
			 */
			prototype.off = function (eventName, listener, useCapture) {
				eventUtils.off(this.element, eventName, listener, useCapture);
			};

			BaseWidget.prototype = prototype;

			// definition
			ns.widget.BaseWidget = BaseWidget;

			}(window.document, ns));

/*global window, define */
/*jslint plusplus: true, nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
/**
 * @class tau.VirtualGrid
 * @inheritdoc ns.widget.micro.VirtualGrid
 * @extends ns.widget.micro.VirtualGrid
 */
/**
 * @class tau.VirtualListview
 * @inheritdoc ns.widget.micro.VirtualListview
 * @extends ns.widget.micro.VirtualListview
 */
/**
 * @class tau.Popup
 * @inheritdoc ns.widget.micro.Popup
 * @extends ns.widget.micro.Popup
 */
/**
 * @class tau.Page
 * @inheritdoc ns.widget.micro.Page
 * @extends ns.widget.micro.Page
 */
/**
 * @class tau.PageContainer
 * @inheritdoc ns.widget.micro.PageContainer
 * @extends ns.widget.micro.PageContainer
 */
/**
 * @class tau.IndexScrollbar
 * @inheritdoc ns.widget.micro.IndexScrollbar
 * @extends ns.widget.micro.IndexScrollbar
 */
(function (document, frameworkNamespace, ns) {
	
	            ns.widget = {};

			document.addEventListener("widgetdefined", function (evt) {
				var definition = evt.detail,
					name = definition.name,
					engine = frameworkNamespace.engine;

				ns.widget[name] = (function (definitionName) {
					return function (element, options) {
						return engine.instanceWidget(element, definitionName, options);
					};
				}(name));
			}, false);

			}(window.document, ns, window.tau));

/*global define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */

/*global window, define, ns */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * Utility enable highlight links.
 * @class ns.utils.anchorHighlight
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, window, ns) {
	
				/* anchorHighlightController.js
			To prevent perfomance regression when scrolling,
			do not apply hover class in anchor.
			Instead, this code checks scrolling for time threshold and
			decide how to handle the color.
			When scrolling with anchor, it checks flag and decide to highlight anchor.
			While it helps to improve scroll performance,
			it lowers responsiveness of the element for 50msec.
			*/

			/**
			 * @property {number} startX Touch start x
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			var startX,
				/**
				 * @property {number} startY Touch start y
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				startY,
				/**
				 * @property {boolean} didScroll Did page scrolled
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				didScroll,
				/**
				 * @property {HTMLElement} target Touch target element
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				target,
				/**
				 * @property {number} touchLength Length of touch
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				touchLength,
				/**
				 * @property {number} addActiveClassTimerID Timer id of adding activeClass delay
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				addActiveClassTimerID,
				/**
				 * @property {Object} options Object with default options
				 * @property {number} [options.scrollThreshold=5] Treshold after which didScroll will be set
				 * @property {number} [options.addActiveClassDelay=10] Time to wait before adding activeClass
				 * @property {number} [options.keepActiveClassDelay=100] Time to stay activeClass after touch end
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				options = {
					scrollThreshold: 5,
					addActiveClassDelay: 10,
					keepActiveClassDelay: 100
				},
				/**
				 * @property {string} [activeClassLI='ui-li-active'] Class used to mark element as active
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				activeClassLI = "ui-li-active",
				/**
				 * Function invoked after touch move ends
				 * @method removeTouchMove
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				removeTouchMove,
				/**
				 * @property {Object} selectors Alias for class {@link ns.utils.selectors}
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				selectors = ns.utils.selectors;


			/**
			 * Get closest highlightable element
			 * @method detectHighlightTarget
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function detectHighlightTarget(target) {
				target = selectors.getClosestBySelector(target, 'a, label');
				return target;
			}

			/**
			 * Get closest li element
			 * @method detectLiElement
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function detectLiElement(target) {
				target = selectors.getClosestByTag(target, 'li');
				return target;
			}

			/**
			 * Add active class to touched element
			 * @method addActiveClass
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function addActiveClass() {
				var liTarget;
				target = detectHighlightTarget(target);
				if (!didScroll && target && (target.tagName === "A" || target.tagName === "LABEL")) {
					liTarget = detectLiElement(target);
					if( liTarget ) {
						liTarget.classList.add(activeClassLI);
					}
				}
			}

			/**
			 * Get all active elements
			 * @method getActiveElements
			 * @return {Array}
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function getActiveElements() {
				return document.getElementsByClassName(activeClassLI);
			}

			/**
			 * Remove active class from active elements
			 * @method removeActiveClass
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function removeActiveClass() {
				var activeA = getActiveElements(),
					activeALength = activeA.length,
					i;
				for (i = 0; i < activeALength; i++) {
					activeA[i].classList.remove(activeClassLI);
				}
			}

			/**
			 * Function invoked during touch move
			 * @method touchmoveHandler
			 * @param {Event} event
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function touchmoveHandler(event) {
				var touch = event.touches[0];
				didScroll = didScroll ||
					(Math.abs(touch.clientX - startX) > options.scrollThreshold || Math.abs(touch.clientY - startY) > options.scrollThreshold);

				if (didScroll) {
					removeTouchMove();
					removeActiveClass();
				}
			}

			/**
			 * Function invoked after touch start
			 * @method touchstartHandler
			 * @param {Event} event
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function touchstartHandler(event) {
				var touches = event.touches,
					touch = touches[0];
				touchLength = touches.length;

				if (touchLength === 1) {
					didScroll = false;
					startX = touch.clientX;
					startY = touch.clientY;
					target = event.target;

					document.addEventListener("touchmove", touchmoveHandler, false);
					clearTimeout(addActiveClassTimerID);
					addActiveClassTimerID = setTimeout(addActiveClass, options.addActiveClassDelay);
				}
			}

			removeTouchMove = function () {
				document.removeEventListener("touchmove", touchmoveHandler, false);
			};

			/**
			 * Function invoked after touch
			 * @method touchendHandler
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function touchendHandler() {
				if (touchLength === 1) {
					clearTimeout(addActiveClassTimerID);
					addActiveClassTimerID = null;
					if (!didScroll) {
						setTimeout(removeActiveClass, options.keepActiveClassDelay);
					}
					didScroll = false;
				}
			}

			/**
			 * Bind events to document
			 * @method eventBinding
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function eventBinding() {
				document.addEventListener("touchstart", touchstartHandler, false);
				document.addEventListener("touchend", touchendHandler, false);
				window.addEventListener("pagehide", removeActiveClass, false);
			}

			eventBinding();

			}(document, window, ns));
/*global window, define, ns */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	
				/** @namespace ns.widget.micro */
			ns.widget.micro = ns.widget.micro || {};
			}(window, ns));

/*global window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #PAge widget
 *
 * ##Default selectors
 * All elements with class=ui-page will be become Page widgets
 *
 * ##Manual constructor
 * To create the widget manually you can use the instanceWidget method
 *
 *     @example
 *         var page = ej.engine.instanceWidget(document.getElementById('page'), 'page');
 *         //or
 *         var page = tau.page(document.getElementById('page'));
 *
 * #HTML Examples
 *
 * ###Simple popup
 * <div id="popup-example" class="ui-popup">
 *		Hello world!
 * </div>
 * @class ns.widget.micro.Page
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, ns) {
	
				/**
			 * @property {Object} BaseWidget Alias for {@link ns.widget.BaseWidget}
			 * @memberOf ns.widget.micro.Page
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * @property {Object} selectors Alias for {@link ns.micro.selectors}
				 * @memberOf ns.widget.micro.Page
				 * @private
				 * @static
				 */
				selectors = ns.micro.selectors,
				/**
				 * @property {Object} utils Alias for {@link ns.utils}
				 * @memberOf ns.widget.micro.Page
				 * @private
				 * @static
				 */
				utils = ns.utils,
				/**
				 * @property {Object} doms Alias for {@link ns.utils.DOM}
				 * @memberOf ns.widget.micro.Page
				 * @private
				 * @static
				 */
				doms = utils.DOM,
                utilsObject = utils.object,
				/**
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @memberOf ns.widget.micro.Page
				 * @private
				 * @static
				 */
				engine = ns.engine,

				Page = function () {
					var self = this;
					self.pageSetHeight = false;
					self.contentFillCallback = null;
					self.contentFillAfterResizeCallback = null;
					self.options = {};
				},
				/**
				 * @property {Object} EventType Dictionary for page related event types
				 * @memberOf ns.widget.micro.Page
				 * @static
				 */
				EventType = {
					SHOW: "pageshow",
					HIDE: "pagehide",
					CREATE: "pagecreate",
					BEFORE_CREATE: "pagebeforecreate",
					BEFORE_SHOW: "pagebeforeshow",
					BEFORE_HIDE: "pagebeforehide"
				},
				/**
				 * @property {Object} classes Dictionary for page related css class names
				 * @memberOf ns.widget.micro.Page
				 * @static
				 */
				classes = {
					uiPage: "ui-page",
					uiPageActive: "ui-page-active",
					uiSection: "ui-section",
					uiHeader: "ui-header",
					uiFooter: "ui-footer",
					uiContent: "ui-content",
					uiPageScroll: "ui-page-scroll"
				},
				prototype = {};

			Page.classes = classes;
			Page.events = EventType;

			/**
			 * @property {string} [page=".ui-page"] Selector for page element
			 * @memberOf ns.micro.selectors
			 */
			selectors.page = "." + classes.uiPage;
			/**
			 * @property {string} [activePage=".ui-page-active"] Selector for active page element
			 * @memberOf ns.micro.selectors
			 */
			selectors.activePage = "." + classes.uiPageActive;
			/**
			 * @property {string} [section=".ui-section"] Selector for section element
			 * @memberOf ns.micro.selectors
			 */
			selectors.section = "." + classes.uiSection;
			/**
			 * @property {string} [header=".ui-header"] Selector for header element
			 * @memberOf ns.micro.selectors
			 */
			selectors.header = "." + classes.uiHeader;
			/**
			 * @property {string} [footer=".ui-footer"] Selector for footer element
			 * @memberOf ns.micro.selectors
			 */
			selectors.footer = "." + classes.uiFooter;
			/**
			 * @property {string} [content=".ui-content"] Selector for content element
			 * @memberOf ns.micro.selectors
			 */
			selectors.content = "." + classes.uiContent;
			/**
			 * @property {string} [pageScroll=".ui-page-scroll"] selector for page scroll element
			 * @memberOf ns.micro.selectors
			 */
			selectors.pageScroll = "." + classes.uiPageScroll;

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method contentFill
			 * @param {ns.widget.micro.Page} self
			 * @memberOf ns.widget.micro.Page
			 * @private
			 * @static
			 */
			function contentFill(self) {
				var element = self.element,
					screenWidth = window.innerWidth,
					screenHeight = window.innerHeight,
					contentSelector = classes.uiContent,
					headerSelector = classes.uiHeader,
					footerSelector = classes.uiFooter,
					extraHeight = 0,
					children = [].slice.call(element.children),
					childrenLength = children.length,
					elementStyle = element.style,
					i,
					node,
					contentStyle,
					marginTop,
					marginBottom,
					nodeStyle;

				elementStyle.width = screenWidth + "px";
				elementStyle.height = screenHeight + "px";

				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					if (node.classList.contains(headerSelector) ||
								node.classList.contains(footerSelector)) {
						extraHeight += doms.getElementHeight(node);
					}
				}
				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					nodeStyle = node.style;
					if (node.classList.contains(contentSelector)) {
						contentStyle = window.getComputedStyle(node);
						marginTop = parseFloat(contentStyle.marginTop);
						marginBottom = parseFloat(contentStyle.marginBottom);
						nodeStyle.height = (screenHeight - extraHeight - marginTop - marginBottom) + "px";
						nodeStyle.width = screenWidth + "px";
					}
				}
			}

			/**
			 * Build page
			 * @method _build
			 * @param {string} template
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype._build = function (template, element) {
				element.classList.add(classes.uiPage);
				return element;
			};

			/**
			 * Set page active / unactive
			 * Sets ui-overlay-... class on `body` depending on current theme
			 * @method setActive
			 * @param {boolean} value if true then page will be active if false page will be unactive
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype.setActive = function (value) {
				var elementClassList = this.element.classList;
				if ( value ) {
					elementClassList.add(classes.uiPageActive);
				} else {
					elementClassList.remove(classes.uiPageActive);
				}
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype._bindEvents = function (element) {
				var self = this;
				self.contentFillCallback = contentFill.bind(null, self);
				self.contentFillAfterResizeCallback = function () {
					self.pageSetHeight = false;
					contentFill(self);
				};
				window.addEventListener("resize", self.contentFillAfterResizeCallback, false);
				element.addEventListener("pageshow", self.contentFillCallback, false);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype._refresh = function () {
				contentFill(this);
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype._init = function (element) {
				this.element = element;
				contentFill(this);
			};

			/**
			 * Triggers BEFORE_SHOW event
			 * @method onBeforeShow
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype.onBeforeShow = function () {
				this.trigger(EventType.BEFORE_SHOW);
			};

			/**
			 * Triggers SHOW event
			 * @method onShow
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype.onShow = function () {
				this.trigger(EventType.SHOW);
			};

			/**
			 * Triggers BEFORE_HIDE event
			 * @method onBeforeHide
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype.onBeforeHide = function () {
				this.trigger(EventType.BEFORE_HIDE);
			};

			/**
			 * Triggers HIDE event
			 * @method onHide
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype.onHide = function () {
				this.trigger(EventType.HIDE);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @memberOf ns.widget.micro.Page
			 * @instance
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element;

				element = element || self.element;
				
				window.removeEventListener("resize", self.contentFillAfterResizeCallback, false);
				element.removeEventListener("pageshow", self.contentFillCallback, false);

				// destroy widgets on children
				engine.destroyWidget(element, true);
			};

            utilsObject.inherit(Page, BaseWidget, prototype);
			// definition
			ns.widget.micro.Page = Page;
			engine.defineWidget(
				"page",
				"",
				"[data-role=page],.ui-page",
				["onBeforeShow", "onShow", "onBeforeHide", "onHide", "setActive"],
				Page,
				"micro"
			);
			}(window.document, ns));

/*global window, define */
/*jslint nomen: true, plusplus: true */

/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */

/**
 * #Popup widget
 *
 * ##Default selectors
 * All elements with class=ui-popup will be become Popup widgets
 *
 * ##Manual constructor
 * To create the widget manually you can use the instanceWidget method
 *
 *     @example
 *         var popup = ej.engine.instanceWidget(document.getElementById('popup'), 'popup');
 *         //or
 *         var popup = tau.popup(document.getElementById('popup'));
 * 
 * #HTML Examples
 *
 * ###Simple popup
 * <div id="popup-example" class="ui-popup">
 *		Hello world!
 * </div>
 * @class ns.widget.micro.Popup
 * @extends ns.widget.BaseWidget
 */
(function (window, document, screen, ns) {
	
				var Popup = function () {
					var self = this,
						ui = {};

					/**
					 * @property {Object} options Options for widget
					 * @property {string|boolean} [options.header=false] Header content
					 * @property {string|boolean} [options.footer=false] Footer content
					 * @memberOf ns.widget.micro.Popup
					 * @instance
					 */
					self.options = {
						header: false,
						footer: false
					};

					/**
					 * @private
					 * @property {?DOMTokenList} [_elementClassList=null] Popup element classList 
					 * @memberOf ns.widget.micro.Popup
					 * @instance
					 */
					self._elementClassList = null;

					/**
					 * @property {Object} ui A collection of UI elements
					 * @property {?HTMLElement} [ui.header=null] Header element
					 * @property {?HTMLElement} [ui.footer=null] Footer element
					 * @property {?HTMLElement} [ui.content=null] Content element
					 * @memberOf ns.widget.micro.Popup
					 * @instance
					 */
					self.ui = ui;
					ui.header = null;
					ui.footer = null;
					ui.content = null;

					/**
					 * @property {boolean} [active=false] Popup state flag
					 * @memberOf ns.widget.micro.Popup
					 * @instance
					 */
					self.active = false;
				},
				/**
				* @property {Function} BaseWidget Alias for {@link ns.widget.BaseWidget}
				* @memberOf ns.widget.micro.Popup
				* @private
				*/
				BaseWidget = ns.widget.BaseWidget,
				/**
				* @property {ns.engine} engine Alias for class ns.engine
				* @memberOf ns.widget.micro.Popup
				* @private
				*/
				engine = ns.engine,
				/**
				* @property {ns.utils.utilsObject} utilsObject Alias for class ns.utils.events
				* @memberOf ns.widget.micro.Popup
				* @private
				*/
				utilsObject = ns.utils.object,
				/**
				* @property {ns.utils.selectors} selectors Alias for class ns.selectors
				* @memberOf ns.widget.micro.Popup
				* @private
				*/
				selectors = ns.micro.selectors,
				prototype = {},
				/**
				* @property {Object} classes Dictionary for popup related css class names
				* @memberOf ns.widget.micro.Popup
				* @static
				*/
				classes = {
					active: "ui-popup-active",
					header: "ui-popup-header",
					footer: "ui-popup-footer",
					content: "ui-popup-content",
					background: "ui-popup-background",
					toast: "ui-popup-toast"
				};

			/**
			* @property {Object} events Dictionary for popup related events
			* @memberOf ns.widget.micro.Popup
			* @static
			*/
			Popup.events = {
				show: "popupshow",
				hide: "popuphide",
				before_show: "popupbeforeshow",
				before_hide: "popupbeforehide"
			};
			Popup.classes = classes;

			/**
			 * @property {string} [popup=".ui-popup"] Selector for popup element
			 * @memberOf ns.micro.selectors
			 */
			selectors.popup = ".ui-popup";

			/**
			* Build the popup DOM tree
			* @method _build
			* @protected
			* @instance
			* @param {string} template
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @memberOf ns.widget.micro.Popup
			*/
			prototype._build = function (template, element) {
				var ui = this.ui,
					options = this.options,
					header = element.querySelector("." + classes.header),
					content = element.querySelector("." + classes.content),
					footer = element.querySelector("." + classes.footer),
					i,
					l,
					node;

				if (!content) {
					content = document.createElement("div");
					content.className = classes.content;
					if (element.children.length > 0) {
						for (i = 0, l = element.children.length; i < l; ++i) {
							node = element.children[i];
							if (node !== footer && node !== header) {
								content.appendChild(element.children[i]);
							}
						}
					}
					element.appendChild(content);
				}

				if (!header && options.header !== false) {
					header = document.createElement("div");
					header.className = classes.header;
					if (typeof options.header !== "boolean") {
						header.innerHTML = options.header;
					}
					element.insertBefore(header, content);
				}

				if (!footer && options.footer !== false) {
					footer = document.createElement("div");
					footer.className = classes.footer;
					if (typeof options.footer !== "boolean") {
						footer.innerHTML = options.footer;
					}
					element.appendChild(footer);
				}

				ui.header = header;
				ui.content = content;
				ui.footer = footer;

				return element;
			};

			/**
			* Initialize popup
			* @method _init
			* @protected
			* @instance
			* @param {HTMLElement} element
			* @memberOf ns.widget.micro.Popup
			*/
			prototype._init = function (element) {
				var self = this,
					ui = self.ui;

				// re-init if already built
				if (!ui.header) {
					ui.header = element.querySelector("." + classes.header);
				}
				if (!ui.footer) {
					ui.footer = element.querySelector("." + classes.footer);
				}
				if (!ui.content) {
					ui.content = element.querySelector("." + classes.content);
				}
				ui.content.style.overflowY = "scroll";
				self._elementClassList = element.classList;
				self._refresh();
			};

			/**
			* Bind events
			* @method _bindEvents
			* @protected
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
			prototype._bindEvents = function () {
				var self = this;
				self.closeFunction = function () {
					self.close({transition: "none"});
				};
				self.onResize = function () {
					if (self.active === true) {
						self._refresh();
					}
				};
				window.addEventListener("resize", self.onResize, false);
				document.addEventListener("pagebeforehide", self.closeFunction, false);
			};

			/**
			* Destroy the popup
			* @method _destroy
			* @protected
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
			prototype._destroy = function () {
				window.removeEventListener("resize", this.onResize, false);
				document.removeEventListener("pagebeforehide", this.closeFunction, false);
			};

			/**
			* Refresh the popup 
			* @method _refresh
			* @protected
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
			prototype._refresh = function () {
				var ui = this.ui,
					header = ui.header,
					footer = ui.footer,
					element = this.element,
					content = ui.content,
					props = {
						"margin-top": 0,
						"margin-bottom": 0,
						"margin-left": 0,
						"margin-right": 0,
						"border-width": 0,
						"display": null
					},
					elementStyle = element.style,
					contentStyle = content.style,
					borderWidth,
					headerHeight = 0,
					footerHeight = 0,
					contentHeight = 0,
					contentWidth,
					isToast = element.classList.contains(classes.toast),
					dom = ns.utils.DOM,
					originalDisplay = '',
					originalVisibility = '',
					isDisplayNone;

				dom.extractCSSProperties(element, props);

				borderWidth = parseFloat(props["border-width"]) || 0;

				isDisplayNone = props.display === "none";

				if (isDisplayNone) {
					originalDisplay = elementStyle.display;
					originalVisibility = elementStyle.visibility;
					elementStyle.visibility = "hidden";
					elementStyle.display = "block";
				}

				contentWidth = window.innerWidth - (parseInt(props["margin-left"], 10) + parseInt(props["margin-right"], 10));
				elementStyle.width = contentWidth + "px";

				if (!isToast) {
					if (header) {
						headerHeight = header.offsetHeight;
					}

					if (footer) {
						footerHeight = footer.offsetHeight;
					}

					contentHeight = window.innerHeight - (parseInt(props["margin-top"], 10) + parseInt(props["margin-bottom"], 10));

					elementStyle.height = contentHeight + "px";
					contentStyle.height = (contentHeight - headerHeight - footerHeight - borderWidth * 2) + "px";
					contentStyle.overflowY = "scroll";
				}

				if (isDisplayNone) {
					elementStyle.display = originalDisplay;
					elementStyle.visibility = originalVisibility;
				}
			};

			/**
			* Set the state of the popup
			* @method _setActive
			* @param {boolean} active
			* @protected
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
			prototype._setActive = function (active) {
				var activeClass = classes.active,
					elementCls = this._elementClassList;
				if (active) {
					elementCls.add(activeClass);
				} else {
					elementCls.remove(activeClass);
				}

				this.active = elementCls.contains(activeClass);
			};

			/**
			* Open the popup 
			* @method open
			* @param {Object=} [options]
			* @param {string=} [options.transition] options.transition
			* @param {string=} [options.ext= in ui-pre-in] options.ext
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
			prototype.open = function (options) {
				var transitionOptions = utilsObject.multiMerge({}, options, {ext: " in ui-pre-in "}),
					events = Popup.events,
					self = this,
					element = self.element,
					container = document.createElement("div");

				container.classList.add(classes.background);
				container.appendChild(element.parentElement.replaceChild(container, element));

				if (element.classList.contains(classes.toast)) {
					container.addEventListener("click", self.closePopup, false);
				}
				self.background = container;

				self.trigger(events.before_show);
				self._transition(transitionOptions, function () {
					self._setActive(true);
					self.trigger(events.show);
				});
			};

			/**
			* Close the popup 
			* @method close
			* @param {Object=} [options]
			* @param {string=} [options.transition]
			* @param {string=} [options.ext= in ui-pre-in] options.ext 
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
			prototype.close = function (options) {
				var transitionOptions = utilsObject.multiMerge({}, options, {ext: " in ui-pre-in "}),
					events = Popup.events,
					self = this,
					element = self.element,
					container = self.background,
					parent = container.parentElement;

				if (element.classList.contains(classes.toast)) {
					container.removeEventListener("click", self.closePopup, false);
				}

				if ( parent ) {
					parent.appendChild(element);
					parent.removeChild(container);
				}
				container = null;

				self.trigger(events.before_hide);
				self._transition(transitionOptions, function () {
					self._setActive(false);
					self.trigger(events.hide);
				});
			};

			/**
			* Animate popup opening/closing
			* @method _transition
			* @protected
			* @instance
			* @param {Object} [options]
			* @param {string=} [options.transition]
			* @param {string=} [options.ext]
			* @param {?Function} [resolve]
			* @memberOf ns.widget.micro.Popup
			*/

			prototype._transition = function (options, resolve) {
				var self = this,
					transition = options.transition || self.options.transition || '',
					transitionClass = transition + options.ext,
					element = self.element,
					elementClassList = element.classList,
					pageContainer = engine.getRouter().getContainer().element,
					deferred = {
						resolve: resolve
					},
					animationEnd = function () {
						element.removeEventListener("animationend", animationEnd, false);
						element.removeEventListener("webkitAnimationEnd", animationEnd, false);
						pageContainer.classList.remove("ui-viewport-transitioning");
						transitionClass.split(" ").forEach(function (cls) {
							var _cls = cls.trim();
							if (_cls.length > 0) {
								elementClassList.remove(_cls);
							}
						});
						deferred.resolve();
					};

				if (transition !== "none") {
					element.addEventListener("animationend", animationEnd, false);
					element.addEventListener("webkitAnimationEnd", animationEnd, false);
					pageContainer.classList.add("ui-viewport-transitioning");
					transitionClass.split(" ").forEach(function (cls) {
						var _cls = cls.trim();
						if (_cls.length > 0) {
							elementClassList.add(_cls);
						}
					});
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
				return deferred;
			};

            utilsObject.inherit(Popup, BaseWidget, prototype);

			engine.defineWidget(
				"popup",
				"",
				".ui-popup",
				["setActive", "show", "hide", "open", "close"],
				Popup,
				"micro"
			);
			ns.widget.micro.Popup = Popup;
			}(window, window.document, window.screen, ns));

/*global window, define */
/*jslint nomen: true, plusplus: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/* 
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Krzysztof Głodowski <k.glodowski@samsung.com>
 */
(function (document, ns) {
	
				var BaseWidget = ns.widget.BaseWidget,
				Page = ns.widget.micro.Page,
				utils = ns.utils,
                utilsObject = utils.object,
				DOM = utils.DOM,
				engine = ns.engine,
				classes = {
					uiViewportTransitioning: "ui-viewport-transitioning",
					out: "out",
					in: "in",
					uiPreIn: "ui-pre-in"
				},
				/**
				* PageContainer is a widget, which is supposed to have multiple child pages but display only one at a time.
				* It allows for adding new pages, switching between them and displaying progress bars indicating loading process.
				* @class ns.widget.micro.PageContainer
				* @extends ns.widget.BaseWidget
				*/
				PageContainer = function () {
					this.activePage = null;
					return this;
				},
				EventType = {
					PAGE_CHANGE: "pagechange"
				},
				animationend = "animationend",
				webkitAnimationEnd = "webkitAnimationEnd",
				prototype = {};

			PageContainer.events = EventType;

			/**
			* Changes active page to specified element
			* @method change
			* @param {HTMLElement} toPage the element to set
			* @param {Object} [options] additional options for the transition
			* @param {string} [options.transition=none] the type of transition
			* @param {boolean} [options.reverse=false] specifies transition direction
			* @memberOf ns.widget.micro.PageContainer
			* @instance
			*/
			prototype.change = function (toPage, options) {
				var self = this,
					fromPageWidget = self.getActivePage(),
					toPageWidget;

				options = options || {};

				if (toPage.parentNode !== self.element) {
					self._include(toPage);
				}

				toPageWidget = engine.instanceWidget(toPage, "page");

				if (!fromPageWidget || (fromPageWidget.element !== toPage)) {
					self._include(toPage);
					if (fromPageWidget) {
						fromPageWidget.onBeforeHide();
					}
					toPageWidget.onBeforeShow();
				}

				options.deferred = {
					resolve: function () {
						if (fromPageWidget) {
							fromPageWidget.onHide();
							self._removeExternalPage( fromPageWidget, options);
						}
						toPageWidget.onShow();
						self.trigger(EventType.PAGE_CHANGE);
					}
				};
				self._transition(toPageWidget, fromPageWidget, options);
			};
			/**
			* Performs transition between the old and a new page.
			* @method _transition
			* @param {ns.widget.micro.Page} toPageWidget the new page
			* @param {ns.widget.micro.Page} fromPageWidget the page to be replaced
			* @param {Object} [options] additional options for the transition
			* @param {string} [options.transition=none] the type of transition
			* @param {boolean} [options.reverse=false] specifies transition direction
			* @param {Object} [options.deferred] deferred object
			* @memberOf ns.widget.micro.PageContainer
			* @protected
			* @instance
			*/
			prototype._transition = function (toPageWidget, fromPageWidget, options) {
				var element = this.element,
					elementClassList = element.classList,
					transition = !fromPageWidget || !options.transition ? "none" : options.transition,
					deferred = options.deferred,
					reverse = "reverse",
					clearClasses = [classes.in, classes.out, classes.uiPreIn, transition],
					oldDeferredResolve,
					target,
					classlist,
					oneEvent;

				if (options.reverse) {
					clearClasses.push(reverse);
				}
				elementClassList.add(classes.uiViewportTransitioning);
				oldDeferredResolve = deferred.resolve;
				deferred.resolve = function () {
					var i,
						clearClassesLength = clearClasses.length,
						fromPageWidgetClassList = fromPageWidget && fromPageWidget.element.classList,
						toPageWidgetClassList = toPageWidget.element.classList;

					elementClassList.remove(classes.uiViewportTransitioning);
					for (i = 0; i < clearClassesLength; i++) {
						if (fromPageWidgetClassList) {
							fromPageWidgetClassList.remove(clearClasses[i]);
						}
						toPageWidgetClassList.remove(clearClasses[i]);
					}
					oldDeferredResolve();
				};

				if (transition !== "none") {
					target = options.reverse ? fromPageWidget : toPageWidget;
					oneEvent = function () {
						target.element.removeEventListener(animationend, oneEvent, false);
						target.element.removeEventListener(webkitAnimationEnd, oneEvent, false);
						deferred.resolve();
					};
					target.element.addEventListener(animationend, oneEvent, false);
					target.element.addEventListener(webkitAnimationEnd, oneEvent, false);

					if (fromPageWidget) {
						classlist = fromPageWidget.element.classList;
						classlist.add(transition);
						classlist.add(classes.out);
						if (options.reverse) {
							classlist.add(reverse);
						}
					}

					classlist = target.element.classList;
					classlist.add(transition);
					classlist.add(classes.in);
					if (options.reverse) {
						classlist.add(reverse);
					}
					this._setActivePage(target);
				} else {
					this._setActivePage(toPageWidget);
					window.setTimeout(deferred.resolve, 0);
				}
			};
			/**
			* Adds an element as a page
			* @method _include
			* @param {HTMLElement} page an element to add
			* @memberOf ns.widget.micro.PageContainer
			* @protected
			* @instance
			*/
			prototype._include = function (page) {
				var element = this.element;
				if (page.parentNode !== element) {
					element.appendChild(page);
				}
			};
			/**
			* Sets currently active page
			* @method _setActivePage
			* @param {ns.widget.micro.Page} page a widget to set as the active page
			* @memberOf ns.widget.micro.PageContainer
			* @instance
			*/
			prototype._setActivePage = function (page) {
				var self = this;
				if (self.activePage) {
					self.activePage.setActive(false);
				}
				self.activePage = page;
				page.setActive(true);
			};
			/**
			* Returns active page element
			* @method getActivePage
			* @memberOf ns.widget.micro.PageContainer
			* @return {ns.widget.micro.Page} currently active page
			* @instance
			*/
			prototype.getActivePage = function () {
				return this.activePage;
			};

			/**
			* Displays a progress bar indicating loading process
			* @method showLoading
			* @memberOf ns.widget.micro.PageContainer
			* @return {null}
			* @instance
			*/
			prototype.showLoading = function () {
								return null;
			};
			/**
			* Hides any active progress bar
			* @method hideLoading
			* @memberOf ns.widget.micro.PageContainer
			* @return {null}
			* @instance
			*/
			prototype.hideLoading = function () {
								return null;
			};
			/**
			* Removes page element from the given widget and destroys it
			* @method _removeExternalPage
			* @param {ns.widget.micro.Page} fromPageWidget the widget to destroy
			* @param {Object} [options] transition options 
			* @param {boolean} [options.reverse=false] specifies transition direction
			* @memberOf ns.widget.micro.PageContainer
			* @instance
			* @protected
			*/
			prototype._removeExternalPage = function ( fromPageWidget, options) {
				var fromPage = fromPageWidget.element;
				options = options || {};
				if (options.reverse && DOM.hasNSData(fromPage, "external")) {
					fromPageWidget.destroy();
					fromPage.parentNode.removeChild(fromPage);
				}
			};

            utilsObject.inherit(PageContainer, BaseWidget, prototype);
			// definition
			ns.widget.micro.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"./widget/ns.widget.micro.PageContainer",
				"",
				["change", "getActivePage", "showLoading", "hideLoading"],
				PageContainer,
				"micro"
			);
			}(window.document, ns));

/*global window, define, ns */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	
				/** @namespace ns.widget.micro */
			ns.widget.micro.indexscrollbar = ns.widget.micro.indexscrollbar || {};
			}(window, ns));

/*global define, ns, document, window */
/*jslint nomen: true, plusplus: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * IndexScrollbar widget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @class ns.widget.micro.IndexScrollbar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	
				var utilsObject = ns.utils.object,
				utilsDOM = ns.utils.DOM;

			function IndexBar(element, options) {
				this.element = element;
				this.options = utilsObject.multiMerge(options, this._options, false);
				this.container = this.options.container;

				this.indices = {
					original: this.options.index,
					merged: []
				};

				this._init();

				return this;
			}
			IndexBar.prototype = {
				_options: {
					container: null,
					offsetLeft: 0,
					index: [],
					verticalCenter: false,
					moreChar: "*",
					indexHeight: 36,
					selectedClass: "ui-state-selected",
					ulClass: null
				},
				_init: function() {
					this.indices.original = this.options.index;
					this.maxIndexLen = 0;
					this.indexLookupTable = [];
					this.indexElements = null;
					this.selectedIndex = -1;

					this._setMaxIndexLen();
					this._makeMergedIndices();
					this._drawDOM();
					this._appendToContainer();
					if(this.options.verticalCenter) {
						this._adjustVerticalCenter();
					}
					this._setIndexCellInfo();
				},

				_clear: function() {
					while(this.element.firstChild) {
						this.element.removeChild(this.element.firstChild);
					}

					this.indices.merged.length = 0;
					this.indexLookupTable.length = 0;
					this.indexElements = null;
					this.selectedIndex = -1;
				},

				refresh: function() {
					this._clear();
					this._init();
				},

				destroy: function() {
					this._clear();
					this.element = null;
				},

				show: function() {
					this.element.style.visibility="visible";
				},

				hide: function() {
					this.element.style.visibility="hidden";
				},

				_setMaxIndexLen: function() {
					var maxIndexLen,
						containerHeight = this.container.offsetHeight;
					maxIndexLen = Math.floor( containerHeight / this.options.indexHeight );
					if(maxIndexLen > 0 && maxIndexLen%2 === 0) {
						maxIndexLen -= 1;	// Ensure odd number
					}
					this.maxIndexLen = maxIndexLen;
				},

				_makeMergedIndices: function() {
					var origIndices = this.indices.original,
						origIndexLen = origIndices.length,
						visibleIndexLen = Math.min(this.maxIndexLen, origIndexLen),
						totalLeft = origIndexLen - visibleIndexLen,
						nIndexPerItem = parseInt(totalLeft / parseInt(visibleIndexLen/2, 10), 10),
						leftItems = totalLeft % parseInt(visibleIndexLen/2, 10),
						indexItemSize = [],
						mergedIndices = [],
						i, len, position=0;

					for(i = 0, len = visibleIndexLen; i < len; i++) {
						indexItemSize[i] = 1;
						if(i % 2) {	// even number: omitter
							indexItemSize[i] += nIndexPerItem + (leftItems-- > 0 ? 1 : 0);
						}
						position +=  indexItemSize[i];
						mergedIndices.push( {
							start: position-1,
							length: indexItemSize[i]
						});
					}
					this.indices.merged = mergedIndices;
				},

				_drawDOM: function() {
					var origIndices = this.indices.original,
						indices = this.indices.merged,
						indexLen = indices.length,
					//container = this.container,
					//containerHeight = container.offsetHeight,
						indexHeight = this.options.indexHeight,
					//maxIndexLen = Math.min(this.maxIndexLen, indices.length),
						moreChar = this.options.moreChar,
						addMoreCharLineHeight = 9,
						text,
						frag,
						li,
						i,
						m;

					frag = document.createDocumentFragment();
					for(i=0; i < indexLen; i++) {
						m = indices[i];
						text = m.length === 1 ? origIndices[m.start] : moreChar;
						li = document.createElement("li");
						li.innerText = text.toUpperCase();
						li.style.height = indexHeight + "px";
						li.style.lineHeight = text === moreChar ? indexHeight + addMoreCharLineHeight + "px" : indexHeight + "px";
						frag.appendChild(li);
					}
					this.element.appendChild(frag);

					if(this.options.ulClass) {
						this.element.classList.add( this.options.ulClass );
					}
				},

				_adjustVerticalCenter: function() {
					var nItem = this.indices.merged.length,
						totalIndexLen = nItem * this.options.indexHeight,
						vPadding = parseInt((this.container.offsetHeight - totalIndexLen) / 2, 10);
					this.element.style.paddingTop = vPadding + "px";
				},

				_appendToContainer: function() {
					this.container.appendChild(this.element);
					this.element.style.left = this.options.offsetLeft + "px";
				},

				setPaddingTop: function(paddingTop) {
					var height = this.element.clientHeight,
						oldPaddingTop = this.element.style.paddingTop,
						oldPaddingBottom = this.element.style.paddingBottom,
						containerHeight = this.container.clientHeight;

					if(oldPaddingTop === "") {
						oldPaddingTop = 0;
					} else {
						oldPaddingTop = parseInt(oldPaddingTop, 10);
					}
					if(oldPaddingBottom === "") {
						oldPaddingBottom = 0;
					} else {
						oldPaddingBottom = parseInt(oldPaddingBottom, 10);
					}

					height = height - oldPaddingTop - oldPaddingBottom;

					if(paddingTop + height > containerHeight) {
						paddingTop -= (paddingTop + height - containerHeight);
					}
					this.element.style.paddingTop = paddingTop + "px";

					this._setIndexCellInfo();	// update index cell info
				},

				// Return index DOM element's offsetTop of given index
				getOffsetTopByIndex: function(index) {
					var cellIndex = this.indexLookupTable[index].cellIndex,
						el = this.indexElements[cellIndex],
						offsetTop = el.offsetTop;

					return offsetTop;
				},

				_setIndexCellInfo: function() {
					var element = this.element,
						mergedIndices = this.indices.merged,
						containerOffsetTop = utilsDOM.getElementOffset(this.container).top,
						listitems = this.element.querySelectorAll("LI"),
						lookupTable = [];

					[].forEach.call(listitems, function(node, idx) {
						var m = mergedIndices[idx],
							i = m.start,
							len = i + m.length,
							top = containerOffsetTop + node.offsetTop,
							height = node.offsetHeight / m.length;

						for ( ; i < len; i++ ) {
							lookupTable.push({
								cellIndex: idx,
								top: top,
								range: height
							});
							top += height;
						}
					});
					this.indexLookupTable = lookupTable;
					this.indexElements = element.children;
				},

				getIndexByPosition: function(posY) {
					var table = this.indexLookupTable,
						info,
						i, len, range;

					// boundary check
					if( table[0] ) {
						info = table[0];
						if(posY < info.top) {
							return 0;
						}
					}
					if( table[table.length -1] ) {
						info = table[table.length -1];
						if(posY >= info.top + info.range) {
							return table.length - 1;
						}
					}
					for ( i=0, len=table.length; i < len; i++) {
						info = table[i];
						range = posY - info.top;
						if ( range >= 0 && range < info.range ) {
							return i;
						}
					}
					return 0;
				},

				getValueByIndex: function(idx) {
					if(idx < 0) { idx = 0; }
					return this.indices.original[idx];
				},

				select: function(idx) {
					var cellIndex,
						eCell;

					this.clearSelected();

					if(this.selectedIndex === idx) {
						return;
					}
					this.selectedIndex = idx;

					cellIndex = this.indexLookupTable[idx].cellIndex;
					eCell = this.indexElements[cellIndex];
					eCell.classList.add(this.options.selectedClass);
				},

				/* Clear selected class
				 */
				clearSelected: function() {
					var el = this.element,
						selectedClass = this.options.selectedClass,
						selectedElement = el.querySelectorAll("."+selectedClass);

					[].forEach.call(selectedElement, function(node) {
						node.classList.remove(selectedClass);
					});
					this.selectedIndex = -1;
				}
			};

			ns.widget.micro.indexscrollbar.IndexBar = IndexBar;

			}(window.document, ns));

/*global define, ns, document, window */
/*jslint nomen: true, plusplus: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * IndexScrollbar widget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @class ns.widget.micro.IndexScrollbar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	
				var utilsObject = ns.utils.object;

			function IndexIndicator(element, options) {
				this.element = element;
				this.options = utilsObject.multiMerge(options, this._options, false);
				this.value = null;

				this._init();

				return this;
			}
			IndexIndicator.prototype = {
				_options: {
					className: "ui-indexscrollbar-indicator",
					selectedClass: "ui-selected",
					container: null
				},
				_init: function() {
					var element = this.element;
					element.className = this.options.className;
					element.innerHTML = "<span></span>";

					// Add to DOM tree
					this.options.container.appendChild(element);
					this.fitToContainer();
				},

				fitToContainer: function() {
					var element = this.element,
						container = this.options.container,
						containerPosition = window.getComputedStyle(container).position;

					element.style.width = container.offsetWidth + "px";
					element.style.height = container.offsetHeight + "px";

					if ( containerPosition !== "absolute" && containerPosition !== "relative" ) {
						element.style.top = container.offsetTop + "px";
						element.style.left = container.offsetLeft + "px";
					}
				},

				setValue: function( value ) {
					this.value = value;	// remember value
					value = value.toUpperCase();

					var selected = value.substr(value.length - 1),
						remained = value.substr(0, value.length - 1),
						inner = "<span>" + remained + "</span><span class=\"ui-selected\">" + selected + "</span>";
					this.element.firstChild.innerHTML = inner;	// Set indicator text
				},

				show: function() {
					//this.element.style.visibility="visible";
					this.element.style.display="block";
				},
				hide: function() {
					this.element.style.display="none";
				},
				destroy: function() {
					while(this.element.firstChild) {
						this.element.removeChild(this.element.firstChild);
					}
					this.element = null;	// unreference element
				}
			};
			ns.widget.micro.indexscrollbar.IndexIndicator = IndexIndicator;
			}(window.document, ns));

/*global define, ns, document, window */
/*jslint nomen: true, plusplus: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * IndexScrollbar widget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @class ns.widget.micro.IndexScrollbar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	
				var IndexScrollbar = function() {
				// Support calling without 'new' keyword
				this.element = null;
				this.indicator = null;
				this.indexBar1 = null;	// First IndexBar. Always shown.
				this.indexBar2 = null;	// 2-depth IndexBar. shown if needed.


				this.index = null;
				this.touchAreaOffsetLeft = 0;
				this.indexElements = null;
				this.selectEventTriggerTimeoutId = null;
				this.ulMarginTop = 0;

				this.eventHandlers = {};

			},
			BaseWidget = ns.widget.BaseWidget,
			/**
			 * @property {Object} engine Alias for class {@link ns.engine}
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @private
			 * @static
			 */
				engine = ns.engine,
			/**
			 * @property {Object} events Alias for class {@link ns.utils.events}
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @private
			 * @static
			 */
				events = ns.utils.events,
			/**
			 * @property {Object} doms Alias for class {@link ns.utils.DOM}
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @private
			 * @static
			 */
				doms = ns.utils.DOM,
				EventType = {},
				prototype = new BaseWidget(),
				utilsObject = ns.utils.object,
				IndexBar = ns.widget.micro.indexscrollbar.IndexBar,
				IndexIndicator = ns.widget.micro.indexscrollbar.IndexIndicator;

			utilsObject.inherit(IndexScrollbar, BaseWidget, {
				widgetName: "IndexScrollbar",
				widgetClass: "ui-indexscrollbar",

				_configure: function () {
					this.options = {
						moreChar: "*",
							selectedClass: "ui-state-selected",
							delimeter: ",",
							index: [
							"A", "B", "C", "D", "E", "F", "G", "H",
							"I", "J", "K", "L", "M", "N", "O", "P", "Q",
							"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"
						],
							maxIndexLen: 0,
							indexHeight: 36,
							keepSelectEventDelay: 50,
							container: null,
							supplementaryIndex: null,
							supplementaryIndexMargin: 1
					};
				},

				_build: function (template, element) {
					return element;
				},

				_init: function () {
					this._setInitialLayout();	// This is needed for creating sub objects
					this._createSubObjects();

					this._updateLayout();

					// Mark as extended
					this._extended(true);
				},

				_refresh: function () {
					if( this._isExtended() ) {
						this._unbindEvent();
						this.indicator.hide();
						this._extended( false );
					}

					this._updateLayout();
					this._extended( true );
				},

				_destroy: function() {
                    if (this.isBound()) {
                        this._unbindEvent();
                        this._extended(false);
                        this._destroySubObjects();
                        this.element = null;
                        this.indicator = null;
                        this.index = null;
                        this.eventHandlers = {};
                    }
                },

				_setOptions: function (options) {
					options = options || {};
					this.options = ns.utils.object.multiMerge(options, this._options, false);

					// data-* attributes
					this.options.index = this._getIndex();
				},

				/* Create indexBar1 and indicator in the indexScrollbar
				 */
				_createSubObjects: function() {
					// indexBar1
					this.indexBar1 = new IndexBar( document.createElement("UL"), {
						container: this.element,
						offsetLeft: 0,
						index: this.options.index,
						verticalCenter: true,
						indexHeight: this.options.indexHeight
					});

					// indexBar2
					if(this.options.supplementaryIndex) {
						this.indexBar2 = new IndexBar( document.createElement("UL"), {
							container: this.element,
							offsetLeft: -this.element.clientWidth - this.options.supplementaryIndexMargin,
							index: [],	// empty index
							indexHeight: this.options.indexHeight,
							ulClass: "ui-indexscrollbar-supplementary"
						});
						this.indexBar2.hide();
					}

					// indicator
					this.indicator = new IndexIndicator(document.createElement("DIV"), {
						container: this._getContainer()
					});

				},

				_destroySubObjects: function() {
					var subObjs = {
							iBar1: this.indexBar1,
							iBar2: this.indexBar2,
							indicator: this.indicator
						},
						subObj,
						el,
						i;
					for(i in subObjs) {
						subObj = subObjs[i];
						if(subObj) {
							el = subObj.element;
							subObj.destroy();
							el.parentNode.removeChild(el);
						}
					}
				},

				/* Set initial layout
				 */
				_setInitialLayout: function () {
					var indexScrollbar = this.element,
						container = this._getContainer(),
						containerPosition = window.getComputedStyle(container).position;

					// Set the indexScrollbar's position, if needed
					if (containerPosition !== "absolute" && containerPosition !== "relative") {
						indexScrollbar.style.top = container.offsetTop + "px";
						indexScrollbar.style.height = container.style.height;
					}
				},

				/* Calculate maximum index length
				 */
				_setMaxIndexLen: function() {
					var maxIndexLen = this.options.maxIndexLen,
						container = this._getContainer(),
						containerHeight = container.offsetHeight;
					if(maxIndexLen <= 0) {
						maxIndexLen = Math.floor( containerHeight / this.options.indexHeight );
					}
					if(maxIndexLen > 0 && maxIndexLen%2 === 0) {
						maxIndexLen -= 1;	// Ensure odd number
					}
					this.options.maxIndexLen = maxIndexLen;
				},

				_updateLayout: function() {
					this._setInitialLayout();
					this._draw();

					this.touchAreaOffsetLeft = this.element.offsetLeft - 10;
				},

				/**	Draw additinoal sub-elements
				 *	@param {array} indices	List of index string
				 */
				_draw: function () {
					this.indexBar1.show();
					return this;
				},

				_removeIndicator: function() {
					var indicator = this.indicator,
						parentElem = indicator.element.parentNode;

					parentElem.removeChild(indicator.element);
					indicator.destroy();
					this.indicator = null;
				},

				_getEventReceiverByPosition: function( posX ) {
					var windowWidth = window.innerWidth,
						elementWidth = this.element.clientWidth,
						receiver;

					if( this.options.supplementaryIndex ) {
						if( windowWidth - elementWidth <= posX && posX <= windowWidth) {
							receiver = this.indexBar1;
						} else {
							receiver = this.indexBar2;
						}
					} else {
						receiver = this.indexBar1;
					}
					return receiver;
				},

				_updateIndicatorAndTriggerEvent: function( val ) {
					this.indicator.setValue( val );
					this.indicator.show();
					if(this.selectEventTriggerTimeoutId) {
						window.clearTimeout(this.selectEventTriggerTimeoutId);
					}
					this.selectEventTriggerTimeoutId = window.setTimeout(function() {
						this._trigger(this.element, "select", {index: val});
						this.selectEventTriggerTimeoutId = null;
					}.bind(this), this.options.keepSelectEventDelay);
				},

				_onTouchStartHandler: function( ev ) {
					if (ev.touches.length > 1) {
						ev.preventDefault();
						ev.stopPropagation();
						return;
					}
					var pos = this._getPositionFromEvent( ev ),
					// At touchstart, only indexbar1 is shown.
						iBar1 = this.indexBar1,
						idx = iBar1.getIndexByPosition( pos.y ),
						val = iBar1.getValueByIndex( idx );

					iBar1.select( idx );	// highlight selected value

					this._updateIndicatorAndTriggerEvent( val );
				},

				_onTouchMoveHandler: function( ev ) {
					if (ev.touches.length > 1) {
						ev.preventDefault();
						ev.stopPropagation();
						return;
					}

					var pos = this._getPositionFromEvent( ev ),
						iBar1 = this.indexBar1,
						iBar2 = this.indexBar2,
						idx,
						iBar,
						val;

					// Check event receiver: ibar1 or ibar2
					iBar = this._getEventReceiverByPosition( pos.x );
					if( iBar === iBar2 ) {
						iBar2.options.index = this.options.supplementaryIndex(iBar1.getValueByIndex(iBar1.selectedIndex));
						iBar2.refresh();
					}

					// get index and value from ibar1 or ibar2
					idx = iBar.getIndexByPosition( pos.y );
					val = iBar.getValueByIndex( idx );
					if(iBar === iBar2) {
						// Update val
						val = iBar1.getValueByIndex(iBar1.selectedIndex) + val;

						// Set iBar2's paddingTop
						iBar2.setPaddingTop( iBar1.getOffsetTopByIndex(iBar1.selectedIndex) );
					}

					// update ibars
					iBar.select(idx);	// highlight selected value
					iBar.show();
					if( iBar1 === iBar && iBar2 ) {
						iBar2.hide();
					}

					// update indicator
					this._updateIndicatorAndTriggerEvent( val );

					ev.preventDefault();
					ev.stopPropagation();
				},

				_onTouchEndHandler: function( ev ) {
					if (ev.touches.length > 0) {
						return;
					}

					this.indicator.hide();
					this.indexBar1.clearSelected();
					if(this.indexBar2) {
						this.indexBar2.clearSelected();
						this.indexBar2.hide();
					}
				},

				_bindEvents: function() {
					this._bindResizeEvent();
					this._bindEventToTriggerSelectEvent();
				},

				_unbindEvent: function() {
					this._unbindResizeEvent();
					this._unbindEventToTriggerSelectEvent();
				},

				_bindResizeEvent: function() {
					this.eventHandlers.onresize = function(/* ev */) {
						this.refresh();
					}.bind(this);

					window.addEventListener( "resize", this.eventHandlers.onresize );
				},

				_unbindResizeEvent: function() {
					if ( this.eventHandlers.onresize ) {
						window.removeEventListener( "resize", this.eventHandlers.onresize );
					}
				},

				_bindEventToTriggerSelectEvent: function() {
					this.eventHandlers.touchStart = this._onTouchStartHandler.bind(this);
					this.eventHandlers.touchEnd = this._onTouchEndHandler.bind(this);
					this.eventHandlers.touchMove = this._onTouchMoveHandler.bind(this);

					this.element.addEventListener("touchstart", this.eventHandlers.touchStart);
					this.element.addEventListener("touchmove", this.eventHandlers.touchMove);
					document.addEventListener("touchend", this.eventHandlers.touchEnd);
					document.addEventListener("touchcancel", this.eventHandlers.touchEnd);
				},

				_unbindEventToTriggerSelectEvent: function() {
					this.element.removeEventListener("touchstart", this.eventHandlers.touchStart);
					this.element.removeEventListener("touchmove", this.eventHandlers.touchMove);
					document.removeEventListener("touchend", this.eventHandlers.touchEnd);
					document.removeEventListener("touchcancel", this.eventHandlers.touchEnd);
				},

				/**
				 * Trgger a custom event to the give element
				 * @param {obj}		elem	element
				 * @param {string}	eventName	event name
				 * @param {obj}		detail	detail data of the custom event
				 */
				_trigger: function(elem, eventName, detail) {
					var ev;
					if(!elem || !elem.nodeType || elem.nodeType !== 1) {	// DOM element check
						throw "Given element is not a valid DOM element";
					}
					if("string" !== typeof eventName || eventName.length <= 0) {
						throw "Given eventName is not a valid string";
					}
					ev = new CustomEvent(
						eventName,
						{
							detail: detail,
							bubbles: true,
							cancelable: true
						}
					);
					elem.dispatchEvent(ev);

					return true;
				},

				_data: function (key, val) {
					var el = this.element,
						d = el.__data,
						idx;
					if(!d) {
						d = el.__data = {};
					}
					if(typeof key === "object") {
						// Support data collection
						for(idx in key) {
							this._data(idx, key[idx]);
						}
						return this;
					} else {
						if("undefined" === typeof val) {	// Getter
							return d[key];
						} else {	// Setter
							d[key] = val;
							return this;
						}
					}
				},

				_isValidElement: function (el) {
					return el.classList.contains(this.widgetClass);
				},

				_isExtended: function () {
					return !!this._data("extended");
				},

				_extended: function (flag) {
					this._data("extended", flag);
					return this;
				},

				_getIndex: function () {
					var el = this.element,
						options = this.options,
						indices = el.getAttribute("data-index");
					if(indices) {
						indices = indices.split(options.delimeter);	// Delimeter
					} else {
						indices = options.indices;
					}
					return indices;
				},

				_getOffset: function( el ) {
					var left=0, top=0 ;
					do {
						top += el.offsetTop;
						left += el.offsetLeft;
						el = el.offsetParent;
					} while (el);

					return {
						top: top,
						left: left
					};
				},

				_getContainer: function() {
					return this.options.container || this.element.parentNode;
				},

				_getPositionFromEvent: function( ev ) {
					return ev.type.search(/^touch/) !== -1 ?
					{x: ev.touches[0].clientX, y: ev.touches[0].clientY} :
					{x: ev.clientX, y: ev.clientY};
				},

				addEventListener: function (type, listener) {
					this.element.addEventListener(type, listener);
				},

				removeEventListener: function (type, listener) {
					this.element.removeEventListener(type, listener);
				}

			});

			// definition
			ns.widget.micro.IndexScrollbar = IndexScrollbar;
			engine.defineWidget(
				"IndexScrollbar",
				"",
				".ui-indexscrollbar",
				[],
				IndexScrollbar,
				'micro'
			);
			}(window.document, ns));

/*global window, define */
/*jslint nomen: true, white: true, plusplus: true*/
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 *#Virtual List
 *
 * In the Web environment, it is challenging to display a large amount of data in a list, such as
 * displaying a contact list of over 1000 list items. It takes time to display the entire list in
 * HTML and the DOM manipulation is complex.
 *
 * The virtual list widget is used to display a list of unlimited data elements on the screen
 * for better performance. This widget provides easy access to databases to retrieve and display data.
 * It based on **result set** which is fixed size defined by developer by data-row attribute. Result
 * set should be **at least 3 times bigger** then size of clip (number of visible elements).
 *
 * To add a virtual list widget to the application follow these steps:
 *
 * ##Create widget container - list element
 *

   &lt;ul id=&quot;vlist&quot; class=&quot;ui-listview ui-virtuallistview&quot;&gt;&lt;/ul&gt;

 *
 * ##Initialize widget
 *
	// Get HTML Element reference
	var elList = document.getElementById("vlist"),
		// Set up config. All config options can be found in virtual list reference
		vListConfig = {
		dataLength: 2000,
		bufferSize: 40,
		listItemUpdater: function(elListItem, newIndex){
			// NOTE: JSON_DATA is global object with all data rows.
			var data = JSON_DATA["newIndex"];
			elListItem.innerHTML = '<span class="ui-li-text-main">' +
												data.NAME + '</span>';
			}
		};
	vlist = tau.VirtualListview(elList, vListConfig);
 *
 * More config options can be found in {@link ns.widget.micro.VirtualListview#options}
 *
 * ##Set list item update function
 *
 * List item update function is responsible to update list element depending on data row index. If you didn’t
 * pass list item update function by config option, you have to do it using following method.
 * Otherwise you will see an empty list.
 *
 *
	vlist.setListItemUpdater(function(elListItem, newIndex){
		// NOTE: JSON_DATA is global object with all data rows.
		var data = JSON_DATA["newIndex"];
		elListItem.innerHTML = '<span class="ui-li-text-main">' +
									data.NAME + '</span>';
	});
 *
 * **Attention:** Virtual List manipulates DOM elements to be more efficient. It doesn’t remove or create list
 * elements before calling list item update function. It means that, you have to take care about list element
 * and keep it clean from custom classes an attributes, because order of li elements is volatile.
 *
 * ##Draw child elements
 * If all configuration options are set, call draw method to draw child elements and make virtual list work.
 *
	vlist.draw();
 *
 * ##Destroy Virtual List
 * It’s highly recommended to destroy widgets, when they aren’t necessary. To destroy Virtual List call destroy method.
 *
	vlist.destroy();
 *
 * ##Full working code
 *
	var page = document.getElementById("pageTestVirtualList"),
		vlist,
		// Assing data.
		JSON_DATA = [
			{NAME:"Abdelnaby, Alaa", ACTIVE:"1990 - 1994", FROM:"College - Duke", TEAM_LOGO:"../test/1_raw.jpg"},
			{NAME:"Abdul-Aziz, Zaid", ACTIVE:"1968 - 1977", FROM:"College - Iowa State", TEAM_LOGO:"../test/2_raw.jpg"}
			// A lot of records.
			// These database can be found in Gear Sample Application Winset included to Tizen SDK
			];

		page.addEventListener("pageshow", function() {
			var elList = document.getElementById("vlist");

			vlist = tau.VirtualListview(elList, {
					dataLength: JSON_DATA.length,
					bufferSize: 40
			});

			// Set list item updater
			vlist.setListItemUpdater(function(elListItem, newIndex) {
				//TODO: Update listitem here
				var data =  JSON_DATA[newIndex];
				elListItem.innerHTML = '<span class="ui-li-text-main">' +
											data.NAME + '</span>';
			});
			// Draw child elements
			vlist.draw();
		});
		page.addEventListener("pagehide", function() {
			// Remove all children in the vlist
			vlist.destroy();
		});
 *
 * @class ns.widget.micro.VirtualListview
 * @extend ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 */
(function(document, ns) {
	
					var BaseWidget = ns.widget.BaseWidget,
						/**
						 * @property {Object} engine Alias for class {@link ns.engine}
						 * @private
						 * @static
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						engine = ns.engine,
						events = ns.utils.events,
						// Constants definition
						/**
						 * @property {number} SCROLL_UP Defines index of scroll `{@link ns.widget.micro.VirtualListview#_scroll}.direction`
						 * to retrive if user is scrolling up
						 * @private
						 * @static
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						SCROLL_UP = 0,
						/**
						 * @property {number} SCROLL_RIGHT Defines index of scroll `{@link ns.widget.micro.VirtualListview#_scroll}.direction`
						 * to retrive if user is scrolling right
						 * @private
						 * @static
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						SCROLL_RIGHT = 1,
						/**
						 * @property {number} SCROLL_DOWN Defines index of scroll {@link ns.widget.micro.VirtualListview#_scroll}
						 * to retrive if user is scrolling down
						 * @private
						 * @static
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						SCROLL_DOWN = 2,
						/**
						 * @property {number} SCROLL_LEFT Defines index of scroll {@link ns.widget.micro.VirtualListview#_scroll}
						 * to retrive if user is scrolling left
						 * @private
						 * @static
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						SCROLL_LEFT = 3,
						/**
						 * @property {string} VERTICAL Defines vertical scrolling orientation. It's default orientation.
						 * @private
						 * @static
						 */
						VERTICAL = 'y',
						/**
						 * @property {string} HORIZONTAL Defines horizontal scrolling orientation.
						 * @private
						 * @static
						 */
						HORIZONTAL = 'x',
						/**
						 * @property {boolean} blockEvent Determines that scroll event should not be taken into account if scroll event accurs.
						 * @private
						 * @static
						 */
						blockEvent = false,
						/**
						 * @property {number} timeoutHandler Handle window timeout ID.
						 * @private
						 * @static
						 */
						timeoutHandler,
						/**
						 * @property {Object} origTarget Reference to original target object from touch event.
						 * @private
						 * @static
						 */
						origTarget,
						/**
						 * @property {number} tapholdThreshold Number of miliseconds to determine if tap event occured.
						 * @private
						 * @static
						 */
						tapholdThreshold = 250,
						/**
						 * @property {Object} tapHandlerBound Handler for touch event listener to examine tap occurance.
						 * @private
						 * @static
						 */
						tapHandlerBound = null,
						/**
						 * @property {Object} lastTouchPos Stores last touch position to examine tap occurance.
						 * @private
						 * @static
						 */
						lastTouchPos =	{},

						/**
						 * Local constructor function
						 * @method VirtualListview
						 * @private
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						VirtualListview = function() {
							var self = this;
							/**
							 * @property {Object} ui VirtualListview widget's properties associated with
							 * User Interface
							 * @property {?HTMLElement} [ui.scrollview=null] Scroll element
							 * @property {number} [ui.itemSize=0] Size of list element in piksels. If scrolling is
							 * vertically it's item width in other case it"s height of item element
							 * @memberOf ns.widget.micro.VirtualListview
							 */
							self.ui = {
								scrollview: null,
								spacer: null,
								itemSize: 0
							};

							/**
							 * @property {Object} _scroll Holds information about scrolling state
							 * @property {Array} [_scroll.direction=[0,0,0,0]] Holds current direction of scrolling.
							 * Indexes suit to following order: [up, left, down, right]
							 * @property {number} [_scroll.lastPositionX=0] Last scroll position from top in pixels.
							 * @property {number} [_scroll.lastPositionY=0] Last scroll position from left in pixels.
							 * @property {number} [_scroll.lastJumpX=0] Difference between last and current
							 * position of horizontal scroll.
							 * @property {number} [_scroll.lastJumpY=0] Difference between last and current
							 * position of vertical scroll.
							 * @property {number} [_scroll.clipWidth=0] Width of clip - visible area for user.
							 * @property {number} [_scroll.clipHeight=0] Height of clip - visible area for user.
							 * @memberOf ns.widget.micro.VirtualListview
							 */
							self._scroll = {
								direction: [0, 0, 0, 0],
								lastPositionX: 0,
								lastPositionY: 0,
								lastJumpX: 0,
								lastJumpY: 0,
								clipWidth: 0,
								clipHeight: 0
							};

							self.name = "VirtualListview";

							/**
							 * @property {number} _currentIndex Current zero-based index of data set.
							 * @memberOf ns.widget.micro.VirtualListview
							 * @protected
							 * @instance
							 */
							self._currentIndex = 0;

							/**
							 * @property {Object} options VirtualListview widget options.
							 * @property {number} [options.bufferSize=100] Number of items of result set. The default value is 100.
							 * As the value gets higher, the loading time increases while the system performance
							 * improves. So you need to pick a value that provides the best performance
							 * without excessive loading time. It's recomended to set bufferSize at least 3 times bigger than number
							 * of visible elements.
							 * @property {number} [options.dataLength=0] Total number of items.
							 * @property {string} [options.orientation='y'] Scrolling orientation. Default vertical scrolling enabled.
							 * @property {Object} options.listItemUpdater Holds reference to method which modifies list item, depended
							 * at specified index from database. **Method should be overridden by developer using
							 * {@link ns.widget.micro.VirtualListview#setListItemUpdater} method.** or defined as a config
							 * object. Method takes two parameters:
							 *  -  element {HTMLElement} List item to be modified
							 *  -  index {number} Index of data set
							 * @memberOf ns.widget.micro.VirtualListview
							 */
							self.options = {
								bufferSize: 100,
								dataLength: 0,
								orientation: VERTICAL,
								listItemUpdater: null
							};

							/**
							* @method _scrollEventBound Binding for scroll event listener.
							* @memberOf ns.widget.micro.VirtualListview
							* @protected
							* @instance
							*/
							self._scrollEventBound = null;
							/**
							* @method _touchStartEventBound Binding for touch start event listener.
							* @memberOf ns.widget.micro.VirtualListview
							* @protected
							* @instance
							*/
							self._touchStartEventBound = null;

							return self;
						},
						// Cached prototype for better minification
						prototype = new BaseWidget();

				/**
				 * @property {Object} classes Dictionary object containing commonly used wiget classes
				 * @static
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				VirtualListview.classes = {
					uiVirtualListContainer: "ui-virtual-list-container",
					uiListviewActive: "ui-listview-active"
				};

				/**
				 * Remove highlight from items.
				 * @method _removeHighlight
				 * @param {Object} self Reference to VirtualListview object.
				 * @memberOf ns.widget.micro.VirtualListview
				 * @private
				 * @static
				 */
				function _removeHighlight (self) {
					var children = self.element.children,
						i = children.length;
					while (--i >= 0) {
						children[i].classList.remove(VirtualListview.classes.uiListviewActive);
					}
				}

				/**
				 * Checks if tap meet the condition.
				 * @method _tapHandler
				 * @param {Object} self Reference to VirtualListview object.
				 * @param {Event} event Received Touch event
				 * @memberOf ns.widget.micro.VirtualListview
				 * @private
				 * @static
				 */
				function _tapHandler (self, event) {
					var eventTouch = event.changedTouches[0];

					if (event.type === 'touchmove') {
						if (Math.abs(lastTouchPos.clientX - eventTouch.clientX) > 10 && Math.abs(lastTouchPos.clientY - eventTouch.clientY) > 10) {
							_removeHighlight(self);
							window.clearTimeout(timeoutHandler);
						}
					} else {
						_removeHighlight(self);
						window.clearTimeout(timeoutHandler);
					}

				}

				/**
				 * Adds highlight
				 * @method tapholdListener
				 * @param {Object} self Reference to VirtualListview object.
				 * @memberOf ns.widget.micro.VirtualListview
				 * @private
				 * @static
				 */
				function tapholdListener(self) {
					var liElement;

					liElement = origTarget.tagName === 'LI' ? origTarget : origTarget.parentNode;

					origTarget.removeEventListener('touchmove', tapHandlerBound, false);
					origTarget.removeEventListener('touchend', tapHandlerBound, false);
					tapHandlerBound = null;

					_removeHighlight(self);
					liElement.classList.add(VirtualListview.classes.uiListviewActive);
					lastTouchPos = {};
				}

				/**
				 * Binds touching events to examine tap event.
				 * @method _touchStartHandler
				 * @param {Object} self Reference to VirtualListview object.
				 * @memberOf ns.widget.micro.VirtualListview
				 * @private
				 * @static
				 */
				function _touchStartHandler (self, event) {
					origTarget = event.target;

					// Clean up
					window.clearTimeout(timeoutHandler);
					origTarget.removeEventListener('touchmove', tapHandlerBound, false);
					origTarget.removeEventListener('touchend', tapHandlerBound, false);

					timeoutHandler = window.setTimeout(tapholdListener.bind(null, self), tapholdThreshold);
					lastTouchPos.clientX = event.touches[0].clientX;
					lastTouchPos.clientY = event.touches[0].clientY;

					//Add touch listeners
					tapHandlerBound = _tapHandler.bind(null, self);
					origTarget.addEventListener('touchmove', tapHandlerBound, false);
					origTarget.addEventListener('touchend', tapHandlerBound, false);

				}


				/**
				 * Updates scroll information about position, direction and jump size.
				 * @method _updateScrollInfo
				 * @param {ns.widget.micro.VirtualListview} self VirtualListview widget reference
				 * @memberOf ns.widget.micro.VirtualListview
				 * @private
				 * @static
				 */
				function _updateScrollInfo(self) {
					var scrollInfo = self._scroll,
						scrollDirection = scrollInfo.direction,
						scrollViewElement = self.ui.scrollview,
						scrollLastPositionX = scrollInfo.lastPositionX,
						scrollLastPositionY = scrollInfo.lastPositionY,
						scrollviewPosX = scrollViewElement.scrollLeft,
						scrollviewPosY = scrollViewElement.scrollTop;

					self._refreshScrollbar();
					//Reset scroll matrix
					scrollDirection = [0, 0, 0, 0];

					//Scrolling UP
					if (scrollviewPosY < scrollLastPositionY) {
						scrollDirection[SCROLL_UP] = 1;
					}

					//Scrolling RIGHT
					if (scrollviewPosX < scrollLastPositionX) {
						scrollDirection[SCROLL_RIGHT] = 1;
					}

					//Scrolling DOWN
					if (scrollviewPosY > scrollLastPositionY) {
						scrollDirection[SCROLL_DOWN] = 1;
					}

					//Scrolling LEFT
					if (scrollviewPosX > scrollLastPositionX) {
						scrollDirection[SCROLL_LEFT] = 1;
					}

					scrollInfo.lastJumpY = Math.abs(scrollviewPosY - scrollLastPositionY);
					scrollInfo.lastJumpX = Math.abs(scrollviewPosX - scrollLastPositionX);
					scrollInfo.lastPositionX = scrollviewPosX;
					scrollInfo.lastPositionY = scrollviewPosY;
					scrollInfo.direction = scrollDirection;
					scrollInfo.clipHeight = scrollViewElement.clientHeight;
					scrollInfo.clipWidth = scrollViewElement.clientWidth;
				}

				/**
				 * Computes list element size according to scrolling orientation
				 * @method _computeElementSize
				 * @param {HTMLElement} element Element whose size should be computed
				 * @param {string} orientation Scrolling orientation
				 * @return {number} Size of element in pixels
				 * @memberOf ns.widget.micro.VirtualListview
				 * @private
				 * @static
				 */
				function _computeElementSize(element, orientation) {
					// @TODO change to utils method if it will work perfectly
					return parseInt(orientation === VERTICAL ? element.clientHeight : element.clientWidth, 10) + 1;
				}

				/**
				 * Scrolls and manipulates DOM element to destination index. Element at destination
				 * index is the first visible element on the screen. Destination index can
				 * be different from Virtual List's current index, because current index points
				 * to first element in the buffer.
				 * @memberOf ns.widget.micro.VirtualListview
				 * @param {ns.widget.micro.VirtualListview} self VirtualListview widget reference
				 * @param {number} toIndex Destination index.
				 * @method _orderElementsByIndex
				 * @private
				 * @static
				 */
				function _orderElementsByIndex(self, toIndex) {
					var element = self.element,
						options = self.options,
						scrollInfo = self._scroll,
						scrollClipSize = 0,
						dataLength = options.dataLength,
						indexCorrection = 0,
						bufferedElements = 0,
						avgListItemSize = 0,
						bufferSize = options.bufferSize,
						i,
						offset = 0,
						index;

					//Get size of scroll clip depended on scroll direction
					scrollClipSize = options.orientation === VERTICAL ? scrollInfo.clipHeight : scrollInfo.clipWidth;

					//Compute average list item size
					avgListItemSize = _computeElementSize(element, options.orientation) / bufferSize;

					//Compute average number of elements in each buffer (before and after clip)
					bufferedElements = Math.floor((bufferSize - Math.floor(scrollClipSize / avgListItemSize)) / 2);

					if (toIndex - bufferedElements <= 0) {
						index = 0;
						indexCorrection = 0;
					} else {
						index = toIndex - bufferedElements;
					}

					if (index + bufferSize >= dataLength) {
						index = dataLength - bufferSize;
					}
					indexCorrection = toIndex - index;

					self._loadData(index);
					blockEvent = true;
					offset = index * avgListItemSize;
					if (options.orientation === VERTICAL) {
						element.style.top = offset + "px";
					} else {
						element.style.left = offset + "px";
					}

					for (i = 0; i < indexCorrection; i += 1) {
						offset += _computeElementSize(element.children[i], options.orientation);
					}

					if (options.orientation === VERTICAL) {
					self.ui.scrollview.scrollTop = offset;
					} else {
						self.ui.scrollview.scrollLeft = offset;
					}
					blockEvent = false;
					self._currentIndex = index;
				}

				/**
				 * Orders elements. Controls resultset visibility and does DOM manipulation. This
				 * method is used during normal scrolling.
				 * @method _orderElements
				 * @param {ns.widget.micro.VirtualListview} self VirtualListview widget reference
				 * @memberOf ns.widget.micro.VirtualListview
				 * @private
				 * @static
				 */
				function _orderElements(self) {
					var element = self.element,
						scrollInfo = self._scroll,
						options = self.options,
						elementStyle = element.style,
						//Current index of data, first element of resultset
						currentIndex = self._currentIndex,
						//Number of items in resultset
						bufferSize = parseInt(options.bufferSize, 10),
						//Total number of items
						dataLength = options.dataLength,
						//Array of scroll direction
						scrollDirection = scrollInfo.direction,
						scrollClipWidth = scrollInfo.clipWidth,
						scrollClipHeight = scrollInfo.clipHeight,
						scrollLastPositionY = scrollInfo.lastPositionY,
						scrollLastPositionX = scrollInfo.lastPositionX,
						elementPositionTop = parseInt(elementStyle.top, 10) || 0,
						elementPositionLeft = parseInt(elementStyle.left, 10) || 0,
						elementsToLoad = 0,
						bufferToLoad = 0,
						elementsLeftToLoad = 0,
						temporaryElement = null,
						avgListItemSize = 0,
						resultsetSize = 0,
						childrenNodes,
						i = 0,
						jump = 0,
						hiddenPart = 0,
						newPosition;

					childrenNodes = element.children;
					for (i = childrenNodes.length - 1; i > 0; i -= 1) {
						if (options.orientation === VERTICAL) {
							resultsetSize += childrenNodes[i].clientHeight;
						} else {
							resultsetSize += childrenNodes[i].clientWidth;
						}
					}
					avgListItemSize = resultsetSize / options.bufferSize;

					//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling DOWN
					if (scrollDirection[SCROLL_DOWN]) {
						hiddenPart = scrollLastPositionY - elementPositionTop;
						elementsLeftToLoad = dataLength - currentIndex - bufferSize;
					}

					//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling UP
					if (scrollDirection[SCROLL_UP]) {
						hiddenPart = (elementPositionTop + resultsetSize) - (scrollLastPositionY + scrollClipHeight);
						elementsLeftToLoad = currentIndex;
					}

					//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling RIGHT
					if (scrollDirection[SCROLL_RIGHT]) {
						hiddenPart = scrollLastPositionX - elementPositionLeft;
						elementsLeftToLoad = dataLength - currentIndex - bufferSize;
					}

					//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling LEFT
					if (scrollDirection[SCROLL_LEFT]) {
						hiddenPart = (elementPositionLeft + resultsetSize) - (scrollLastPositionX - scrollClipWidth);
						elementsLeftToLoad = currentIndex;
					}

					//manipulate DOM only, when at least 2/3 of result set is hidden
					//NOTE: Result Set should be at least 3x bigger then clip size
					if (hiddenPart > 0 && (resultsetSize / hiddenPart) <= 1.5) {

						//Left half of hidden elements still hidden/cached
						elementsToLoad = Math.floor(hiddenPart / avgListItemSize) - Math.floor((bufferSize - scrollClipHeight / avgListItemSize) / 2);
						elementsToLoad = elementsLeftToLoad < elementsToLoad ? elementsLeftToLoad : elementsToLoad;
						bufferToLoad = Math.floor(elementsToLoad / bufferSize);
						elementsToLoad = elementsToLoad % bufferSize;

						// Scrolling more then buffer
						if (bufferToLoad > 0) {
							self._loadData(currentIndex + bufferToLoad * bufferSize);
							if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
								if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
									jump += bufferToLoad * bufferSize * avgListItemSize;
								}

								if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_LEFT]) {
									jump -= bufferToLoad * bufferSize * avgListItemSize;
								}
							}
						}


						if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
							//Switch currentIndex to last
							currentIndex = currentIndex + bufferSize - 1;
						}
						for (i = elementsToLoad; i > 0; i -= 1) {
							if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
								temporaryElement = element.appendChild(element.firstElementChild);
								++currentIndex;

								//Updates list item using template
								self._updateListItem(temporaryElement, currentIndex);
								jump += temporaryElement.clientHeight;
							}

							if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_LEFT]) {
								temporaryElement = element.insertBefore(element.lastElementChild, element.firstElementChild);
								--currentIndex;

								//Updates list item using template
								self._updateListItem(temporaryElement, currentIndex);
								jump -= temporaryElement.clientHeight;
							}
						}
						if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_DOWN]) {
							newPosition = elementPositionTop + jump;

							if (newPosition < 0 || currentIndex <= 0) {
								newPosition = 0;
								currentIndex = 0;
							}

							elementStyle.top = newPosition + "px";
						}

						if (scrollDirection[SCROLL_LEFT] || scrollDirection[SCROLL_RIGHT]) {
							newPosition = elementPositionLeft + jump;

							if (newPosition < 0 || currentIndex <= 0) {
								newPosition = 0;
							}

							elementStyle.left = newPosition + "px";
						}

						if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
							//Switch currentIndex to first
							currentIndex = currentIndex - bufferSize + 1;
						}
						//Save current index
						self._currentIndex = currentIndex;
					}
				}

				/**
				 * Check if scrolling position is changed and updates list if it needed.
				 * @method _updateList
				 * @param {ns.widget.micro.VirtualListview} self VirtualListview widget reference
				 * @memberOf ns.widget.micro.VirtualListview
				 * @private
				 * @static
				 */
				function _updateList(self) {
					var _scroll = self._scroll;
					_updateScrollInfo.call(null, self);
					if (_scroll.lastJumpY > 0 || _scroll.lastJumpX > 0) {
						if (!blockEvent) {
							_orderElements(self);
						}
					}
				}

				/**
				 * Updates list item using user defined listItemUpdater function.
				 * @method _updateListItem
				 * @param {HTMLElement} element List element to update
				 * @param {number} index Data row index
				 * @memberOf ns.widget.micro.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._updateListItem = function (element, index) {
					this.options.listItemUpdater(element, index);
				};

				/**
				 * Build widget structure
				 * @method _build
				 * @param {string} template
				 * @param {HTMLElement} element Widget's element
				 * @return {HTMLElement} Element on which built is widget
				 * @memberOf ns.widget.micro.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._build = function(template, element) {
					var classes = VirtualListview.classes;

					element.classList.add(classes.uiVirtualListContainer);
					return element;
				};


				/**
				 * Initialize widget on an element.
				 * @method _init
				 * @param {HTMLElement} element Widget's element
				 * @memberOf ns.widget.micro.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._init = function(element) {
					var self = this,
						ui = self.ui,
						options = self.options,
						orientation,
						scrollview,
						scrollviewStyle,
						spacer,
						spacerStyle;

					//Set orientation, default vertical scrolling is allowed
					orientation = options.orientation.toLowerCase() === HORIZONTAL ? HORIZONTAL : VERTICAL;

					//Get scrollview instance
					scrollview = element.parentElement;
					scrollviewStyle = scrollview.style;

					// Prepare spacer (element which makes scrollbar proper size)
					spacer = document.createElement("div");
					spacerStyle = spacer.style;
					spacerStyle.display = "block";
					spacerStyle.position = "static";
					scrollview.appendChild(spacer);

					//Prepare element
					element.style.position = "relative";

					if (orientation === HORIZONTAL) {
						// @TODO check if whiteSpace: nowrap is better for vertical listes
						spacerStyle.float = 'left';
						scrollviewStyle.overflowX = "scroll";
						scrollviewStyle.overflowY = "hidden";
					} else {
						scrollviewStyle.overflowX = "hidden";
						scrollviewStyle.overflowY = "scroll";
					}

					if (options.dataLength < options.bufferSize) {
						options.bufferSize = options.dataLength - 1;
					}

					if (options.bufferSize < 1) {
						options.bufferSize = 1;
					}

					// Assign variables to members
					ui.spacer = spacer;
					ui.scrollview = scrollview;
					self.element = element;
					options.orientation = orientation;
				};

				/**
				 * Builds Virtual List structure
				 * @method _buildList
				 * @memberOf ns.widget.micro.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._buildList = function() {
					var listItem,
						list = this.element,
						numberOfItems = this.options.bufferSize,
						documentFragment = document.createDocumentFragment(),
						touchStartEventBound = _touchStartHandler.bind(null, this),
						orientation = this.options.orientation,
						i;

					for (i = 0; i < numberOfItems; ++i) {
						listItem = document.createElement("li");

						if (orientation === HORIZONTAL) {
							// TODO: check if whiteSpace: nowrap is better for vertical listes
							// NOTE: after rebuild this condition check possible duplication from _init method
							listItem.style.float = 'left';
						}

						this._updateListItem(listItem, i);
						documentFragment.appendChild(listItem);
						listItem.addEventListener('touchstart', touchStartEventBound, false);
					}

					list.appendChild(documentFragment);
					this._touchStartEventBound = touchStartEventBound;
					this._refresh();
				};

				/**
				 * Refresh list
				 * @method _refresh
				 * @memberOf ns.widget.micro.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._refresh = function() {
					//Set default value of variable create
					this._refreshScrollbar();
				};

				/**
				 * Loads data from specified index to result set.
				 * @method _loadData
				 * @param {number} index Index of first row
				 * @memberOf ns.widget.micro.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._loadData = function(index) {
					var children = this.element.firstElementChild;

					if (this._currentIndex !== index) {
						this._currentIndex = index;
						do {
							this._updateListItem(children, index);
							++index;
							children = children.nextElementSibling;
						} while (children);
					}
				};

				/**
				 * Sets proper scrollbar size: height (vertical), width (horizontal)
				 * @method _refreshScrollbar
				 * @memberOf ns.widget.micro.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._refreshScrollbar = function() {
					var self = this,
						element = self.element,
						options = self.options,
						ui = self.ui,
						spacerStyle = ui.spacer.style,
						bufferSizePx;

					if (options.orientation === VERTICAL) {
						//Note: element.clientHeight is variable
						bufferSizePx = parseFloat(element.clientHeight) || 0;
						spacerStyle.height = (bufferSizePx / options.bufferSize * (options.dataLength - 1) - 4 / 3 * bufferSizePx) + "px";
					} else {
						//Note: element.clientWidth is variable
						bufferSizePx = parseFloat(element.clientWidth) || 0;
						spacerStyle.width = (bufferSizePx / options.bufferSize * (options.dataLength - 1) - 4 / 3 * bufferSizePx) + "px";
					}
				};

				/**
				 * Binds VirtualListview events
				 * @method _bindEvents
				 * @memberOf ns.widget.micro.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._bindEvents = function() {
					var scrollEventBound = _updateList.bind(null, this),
						scrollviewClip = this.ui.scrollview;

					if (scrollviewClip) {
						scrollviewClip.addEventListener("scroll", scrollEventBound, false);
						this._scrollEventBound = scrollEventBound;
					}
				};

				/**
				 * Cleans widget's resources
				 * @method _destroy
				 * @memberOf ns.widget.micro.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._destroy = function() {
					var self = this,
						scrollviewClip = self.ui.scrollview,
						uiSpacer = self.ui.spacer,
						element = self.element,
						elementStyle = element.style,
						listItem;

					// Restore start position
					elementStyle.position = "static";
					if (self.options.orientation === VERTICAL) {
						elementStyle.top = "auto";
					} else {
						elementStyle.left = "auto";
					}

					if (scrollviewClip) {
						scrollviewClip.removeEventListener("scroll", self._scrollEventBound, false);
					}

					//Remove spacer element
					if (uiSpacer.parentNode) {
						uiSpacer.parentNode.removeChild(uiSpacer);
					}

					//Remove li elements.
					while (element.firstElementChild) {
						listItem = element.firstElementChild;
						listItem.removeEventListener('touchstart', self._touchStartEventBound, false);
						element.removeChild(listItem);
					}

				};

				/**
				 * Scrolls list to defined position in pixels.
				 * @method scrollTo
				 * @param {number} position Scroll position expressed in pixels.
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype.scrollTo = function(position) {
					this.ui.scrollview.scrollTop = position;
				};

				/**
				 * Scrolls list to defined index.
				 * @method scrollToIndex
				 * @param {number} index Scroll Destination index.
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype.scrollToIndex = function(index) {
					if (index < 0) {
						index = 0;
					}
					if (index >= this.options.dataLength) {
						index = this.options.dataLength - 1;
					}
					_updateScrollInfo(this);
					_orderElementsByIndex(this, index);
				};

				/**
				 * Builds widget
				 * @method draw
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype.draw = function() {
					this._buildList();
					this.trigger('draw');
				};

				/**
				 * Sets list item updater function. To learn how to create list item updater function please
				 * visit Virtual List User Guide
				 * @method setListItemUpdater
				 * @param {Object} updateFunction Function reference.
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype.setListItemUpdater = function(updateFunction) {
					this.options.listItemUpdater = updateFunction;
				};

				// Assign prototype
				VirtualListview.prototype = prototype;

				// definition
				ns.widget.micro.VirtualListview = VirtualListview;

				engine.defineWidget(
						"VirtualListview",
						"",
						"",
						["draw", "setListItemUpdater", "getTopByIndex", "scrollTo", "scrollToIndex"],
						VirtualListview,
						"micro"
						);
				}(window.document, ns));

/*global window, define, ns */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	
				/** @namespace ns.widget.micro */
			ns.widget.micro.scroller = ns.widget.micro.scroller || {};
			}(window, ns));

/*global window, define, ns */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	
				/** @namespace ns.widget.micro */
			ns.widget.micro.scroller.effect = ns.widget.micro.scroller.effect || {};
			}(window, ns));

/*global window, define, Event, console, ns */
/*jslint nomen: true, plusplus: true */
/**
 * section Changer widget
 * @class ns.widget.SectionChanger
 * @extends ej.widget.BaseWidget
 */
(function (document, ns) {
	
	}(window.document, ns));
/*global window, define, Event, console, ns */
/*jslint nomen: true, plusplus: true */
/**
 * section Changer widget
 * @class ns.widget.SectionChanger
 * @extends ej.widget.BaseWidget
 */
(function (document, ns) {
	
				// scroller.start event trigger when user try to move scroller
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilsObject = ns.utils.object,
				prototype = new BaseWidget(),
				EffectBouncing = ns.widget.micro.scroller.effect.Bouncing,
				eventType = {
					// scroller.move event trigger when scroller start
					START: "scrollstart",
					// scroller.move event trigger when scroller move
					//MOVE: "scroller.move",
					// scroller.move event trigger when scroller end
					END: "scrollend",
					// scroller.move event trigger when scroller canceled
					CANCEL: "scrollcancel"
				},

				Scroller = function () {
				};

			Scroller.Orientation = {
				VERTICAL: 1,
				HORIZONTAL: 2
			};

			prototype._build = function (template, element) {
				if (element.children.length !== 1) {
					throw "scroller has only one child.";
				}

				this.scroller = element.children[0];
				this.scrollerStyle = this.scroller.style;

				this.bouncingEffect = null;
				this.scrollbar = null;

				this.width = 0;
				this.height = 0;

				this.scrollerWidth = 0;
				this.scrollerHeight = 0;
				this.scrollerOffsetX = 0;
				this.scrollerOffsetY = 0;

				this.maxScrollX = 0;
				this.maxScrollY = 0;

				this.startTouchPointX = 0;
				this.startTouchPointY = 0;
				this.startScrollerOffsetX = 0;
				this.startScrollerOffsetY = 0;

				this.lastVelocity = 0;
				this.lastEstimatedPoint = 0;

				this.lastTouchPointX = -1;
				this.lastTouchPointY = -1;

				this.orientation = null;

				this.initiated = false;
				this.enabled = true;
				this.scrolled = false;
				this.moved = false;
				this.scrollCanceled = false;

				this.startTime = null;
				return element;
			};

			prototype._configure = function () {
				this.options = utilsObject.multiMerge({}, this.options, {
					scrollDelay: 300,
					threshold: 10,
					minThreshold: 5,
					flickThreshold: 30,
					scrollbar: false,
					useBouncingEffect: false,
					orientation: "vertical",		// vertical or horizontal,
					// TODO implement scroll momentum.
					momentum: true
				});
			};

			prototype._init = function () {
				this.width = this.element.offsetWidth;
				this.height = this.element.offsetHeight;

				this.scrollerWidth = this.scroller.offsetWidth;
				this.scrollerHeight = this.scroller.offsetHeight;

				this.maxScrollX = this.width - this.scrollerWidth;
				this.maxScrollY = this.height - this.scrollerHeight;

				this.orientation = this.options.orientation === "horizontal" ? Scroller.Orientation.HORIZONTAL : Scroller.Orientation.VERTICAL;

				this.initiated = false;
				this.scrolled = false;
				this.moved = false;
				this.touching = true;
				this.scrollCanceled = false;

				if (this.orientation === Scroller.Orientation.HORIZONTAL) {
					this.maxScrollY = 0;
					this.scrollerHeight = this.height;
				} else {
					this.maxScrollX = 0;
					this.scrollerWidth = this.width;
				}

				this._initLayout();
				this._initScrollbar();
				this._initBouncingEffect();
			};

			prototype._initLayout = function () {
				var elementStyle = this.element.style,
					scrollerStyle = this.scroller.style;

				elementStyle.overflow = "hidden";
				elementStyle.position = "relative";

				scrollerStyle.position = "absolute";
				scrollerStyle.top = "0px";
				scrollerStyle.left = "0px";
				scrollerStyle.width = this.scrollerWidth + "px";
				scrollerStyle.height = this.scrollerHeight + "px";
			};

			prototype._initScrollbar = function () {
				var scrollbarType = this.options.scrollbar,
					i;

				this.scrollbarelement = document.createElement('div');
				for (i=0; i<this.element.children.length; i++) {
					this.scrollbarelement.appendChild(this.element.children[i]);
				}
				this.element.appendChild(this.scrollbarelement);
				if (scrollbarType) {
					this.scrollbar = engine.instanceWidget(this.scrollbarelement, 'Scrollbar', {
						type: scrollbarType,
						orientation: this.orientation
					});
				}
			};

			prototype._initBouncingEffect = function () {
				var o = this.options;
				if (o.useBouncingEffect) {
					this.bouncingEffect = new EffectBouncing(this.element, {
						maxScrollX: this.maxScrollX,
						maxScrollY: this.maxScrollY,
						orientation: this.orientation
					});
				}
			};

			prototype._resetLayout = function () {
				var elementStyle = this.element.style;

				elementStyle.overflow = "";
				elementStyle.position = "";
			};

			prototype._bindEvents = function () {
				if ("ontouchstart" in window) {
					this.scroller.addEventListener("touchstart", this);
					this.scroller.addEventListener("touchmove", this);
					this.scroller.addEventListener("touchend", this);
					this.scroller.addEventListener("touchcancel", this);
				} else {
					this.scroller.addEventListener("mousedown", this);
					document.addEventListener("mousemove", this);
					document.addEventListener("mouseup", this);
					document.addEventListener("mousecancel", this);
				}

				window.addEventListener("resize", this);
			};

			prototype._unbindEvents = function () {
				if ("ontouchstart" in window) {
					this.scroller.removeEventListener("touchstart", this);
					this.scroller.removeEventListener("touchmove", this);
					this.scroller.removeEventListener("touchend", this);
					this.scroller.removeEventListener("touchcancel", this);
				} else {
					this.scroller.removeEventListener("mousedown", this);
					document.removeEventListener("mousemove", this);
					document.removeEventListener("mouseup", this);
					document.removeEventListener("mousecancel", this);
				}

				window.removeEventListener("resize", this);
			};

			/* jshint -W086 */
			prototype.handleEvent = function (event) {
				var pos = this._getPointPositionFromEvent(event);

				switch (event.type) {
					case "mousedown":
						event.preventDefault();
					case "touchstart":
						this._start(event, pos);
						break;
					case "mousemove":
						event.preventDefault();
					case "touchmove":
						this._move(event, pos);
						break;
					case "mouseup":
					case "touchend":
						this._end(event, pos);
						break;
					case "mousecancel":
					case "touchcancel":
						this.cancel(event);
						break;
					case "resize":
						this.refresh();
						break;
				}
			};

			prototype.setOptions = function (options) {
				var name;
				for (name in options) {
					if (options.hasOwnProperty(name) && !!options[name]) {
						this.options[name] = options[name];
					}
				}
			};

			prototype._refresh = function () {
				this._clear();
				this._init();
			};

			prototype.scrollTo = function (x, y, duration) {
				this._translate(x, y, duration);
				this._translateScrollbar(x, y, duration);
			};

			prototype._translate = function (x, y, duration) {
				var translate,
					transition,
					scrollerStyle = this.scrollerStyle;

				if (duration) {
					transition = "-webkit-transform " + duration / 1000 + "s ease-out";
				} else {
					transition = "none";
				}
				translate = "translate3d(" + x + "px," + y + "px, 0)";

				this.scrollerOffsetX = window.parseInt(x, 10);
				this.scrollerOffsetY = window.parseInt(y, 10);

				scrollerStyle["-webkit-transform"] = translate;
				scrollerStyle["-webkit-transition"] = transition;
			};

			prototype._translateScrollbar = function (x, y, duration) {
				if (!this.scrollbar) {
					return;
				}

				this.scrollbar.translate(this.orientation === Scroller.Orientation.HORIZONTAL ? -x : -y, duration);
			};

			prototype._getEstimatedCurrentPoint = function (current, last) {
				var velocity,
					timeDifference = 15, /* pause time threshold.. tune the number to up if it is slow */
					estimated;

				if (last === current) {
					this.lastVelocity = 0;
					this.lastEstimatedPoint = current;
					return current;
				}

				velocity = ( current - last ) / 22;
				/*46.8 s_moveEventPerSecond*/
				estimated = current + ( timeDifference * velocity );

				// Prevent that point goes back even though direction of velocity is not changed.
				if ((this.lastVelocity * velocity >= 0) &&
					(!velocity || (velocity < 0 && estimated > this.lastEstimatedPoint) ||
						(velocity > 0 && estimated < this.lastEstimatedPoint))) {
					estimated = this.lastEstimatedPoint;
				}

				this.lastVelocity = velocity;
				this.lastEstimatedPoint = estimated;

				return estimated;
			};

			prototype._getPointPositionFromEvent = function (ev) {
				return ev.type.search(/^touch/) !== -1 && ev.touches && ev.touches.length ?
				{x: ev.touches[0].clientX, y: ev.touches[0].clientY} :
				{x: ev.clientX, y: ev.clientY};
			};

			prototype._start = function (e, pos) {
				if (this.initiated || !this.enabled) {
					return;
				}

				this.startTime = (new Date()).getTime();

				this.startTouchPointX = pos.x;
				this.startTouchPointY = pos.y;
				this.startScrollerOffsetX = this.scrollerOffsetX;
				this.startScrollerOffsetY = this.scrollerOffsetY;
				this.lastTouchPointX = pos.x;
				this.lastTouchPointY = pos.y;

				this.initiated = true;
				this.scrollCanceled = false;
				this.scrolled = false;
				this.moved = false;
				this.touching = true;
			};

			prototype._move = function (e, pos) {
				var timestamp = (new Date()).getTime(),
					scrollDelay = this.options.scrollDelay || 0,
					threshold = this.options.threshold || 0,
					minThreshold = this.options.minThreshold || 0,
					distX = this.startTouchPointX - pos.x,
					distY = this.startTouchPointY - pos.y,
					absDistX = Math.abs(distX),
					absDistY = Math.abs(distY),
					maxDist = Math.max(absDistX, absDistY),
					newX, newY;

				if (!this.initiated || !this.touching || this.scrollCanceled) {
					return;
				}

				this.lastTouchPointX = pos.x;
				this.lastTouchPointY = pos.y;

				// We need to move at least 10 pixels, delay 300ms for the scrolling to initiate
				if (!this.scrolled &&
					( maxDist < minThreshold ||
						( maxDist < threshold && ( !scrollDelay || timestamp - this.startTime < scrollDelay ) ) )) {
					/* TODO if touchmove event is preventDefaulted, click event not performed.
					 * but to keep touch mode on android have to prevent default.
					 * some idea are using ua or to change webkit threshold.*/
					//e.preventDefault();
					return;
				}

				if (!this.scrolled) {
					switch (this.orientation) {
						case Scroller.Orientation.HORIZONTAL:
							if (absDistX < absDistY) {
								this.cancel();
								return;
							}
							break;
						case Scroller.Orientation.VERTICAL:
							if (absDistY < absDistX) {
								this.cancel();
								return;
							}
							break;
					}

					this._fireEvent(eventType.START);

					this.startTouchPointX = pos.x;
					this.startTouchPointY = pos.y;
				}

				this.scrolled = true;

				if (this.orientation === Scroller.Orientation.HORIZONTAL) {
					newX = this.startScrollerOffsetX + this._getEstimatedCurrentPoint(pos.x, this.lastTouchPointX) - this.startTouchPointX;
					newY = this.startScrollerOffsetY;
				} else {
					newX = this.startScrollerOffsetX;
					newY = this.startScrollerOffsetY + this._getEstimatedCurrentPoint(pos.y, this.lastTouchPointY) - this.startTouchPointY;
				}

				if (newX > 0 || newX < this.maxScrollX) {
					newX = newX > 0 ? 0 : this.maxScrollX;
				}
				if (newY > 0 || newY < this.maxScrollY) {
					newY = newY > 0 ? 0 : this.maxScrollY;
				}

				if (newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY) {
					this.moved = true;
					this._translate(newX, newY);
					this._translateScrollbar(newX, newY);
					// TODO to dispatch move event is too expansive. it is better to use callback.
					//this._fireEvent( eventType.MOVE );

					if (this.bouncingEffect) {
						this.bouncingEffect.hide();
					}
				} else {
					if (this.bouncingEffect) {
						this.bouncingEffect.drag(newX, newY);
					}
				}

				e.preventDefault(); //this function make overflow scroll don't used
			};

			prototype._end = function (e) {
				var lastX = Math.round(this.lastTouchPointX),
					lastY = Math.round(this.lastTouchPointY),
					distanceX = Math.abs(lastX - this.startTouchPointX),
					distanceY = Math.abs(lastY - this.startTouchPointY),
					distance = this.orientation === Scroller.Orientation.HORIZONTAL ? distanceX : distanceY,
					maxDistance = this.orientation === Scroller.Orientation.HORIZONTAL ? this.maxScrollX : this.maxScrollY,
					endOffset = this.orientation === Scroller.Orientation.HORIZONTAL ? this.scrollerOffsetX : this.scrollerOffsetY,
					requestScrollEnd = this.initiated && this.scrolled,
					endTime, duration;

				this.touching = false;

				if (!requestScrollEnd || this.scrollCanceled) {
					this.initiated = false;
					return;
				}

				// bouncing effect
				if (this.bouncingEffect) {
					this.bouncingEffect.dragEnd();
				}

				if (!this.moved) {
					this._endScroll();
					return;
				}

				endTime = (new Date()).getTime();
				duration = endTime - this.startTime;

				// start momentum animation if needed
				if (this.options.momentum &&
					duration < 300 &&
					( endOffset < 0 && endOffset > maxDistance ) &&
					( distance > this.options.flickThreshold )) {
					this._startMomentumScroll();
				} else {
					this._endScroll();
				}

				e.preventDefault();
			};

			prototype._endScroll = function () {
				if (this.scrolled) {
					this._fireEvent(eventType.END);
				}

				this.moved = false;
				this.scrolled = false;
				this.scrollCanceled = false;
				this.initiated = false;
			};

			prototype.cancel = function () {
				this.scrollCanceled = true;

				if (this.initiated) {
					this._translate(this.startScrollerOffsetX, this.startScrollerOffsetY);
					this._translateScrollbar(this.startScrollerOffsetX, this.startScrollerOffsetY);
					this._fireEvent(eventType.CANCEL);
				}

				this.initiated = false;
				this.scrolled = false;
				this.moved = false;
				this.touching = false;
			};

			// TODO implement _startMomentumScroll method
			prototype._startMomentumScroll = function () {
				this._endMomentumScroll();
			};

			prototype._endMomentumScroll = function () {
				this._endScroll();
			};

			prototype._fireEvent = function (eventName, detail) {
				var evt = new CustomEvent(eventName, {
					"bubbles": true,
					"cancelable": true,
					"detail": detail
				});
				this.element.dispatchEvent(evt);
			};

			prototype._clear = function () {
				this.initiated = false;
				this.scrolled = false;
				this.moved = false;
				this.scrollCanceled = false;
				this.touching = false;

				this._resetLayout();
				this._clearScrollbar();
				this._clearBouncingEffect();
			};

			prototype._clearScrollbar = function () {
				if (this.scrollbar) {
					this.scrollbar.destroy();
				}
				this.scrollbar = null;
			};

			prototype._clearBouncingEffect = function () {
				if (this.bouncingEffect) {
					this.bouncingEffect.destroy();
				}
				this.bouncingEffect = null;
			};

			prototype._disable = function () {
				this.element.setAttribute("disabled", "disabled");
				this.enabled = false;
			};

			prototype._enable = function () {
				this.element.removeAttribute("disabled");
				this.enabled = true;
			};

			prototype._destroy = function () {
				this._clear();
				this._unbindEvents();
				this.scrollerStyle = null;
				this.scroller = null;
			};

			Scroller.prototype = prototype;

			ns.widget.micro.scroller.Scroller = Scroller;

			engine.defineWidget(
				"Scroller",
				"",
				".scroller",
				[],
				Scroller
			);
			}(window.document, ns));
/*global window, define, Event, console */
/*jslint nomen: true, plusplus: true */
/**
 * section Changer widget
 * @class ns.widget.SectionChanger
 * @extends ej.widget.BaseWidget
 */
(function (document, ns) {
	
				var Scroller = ns.widget.micro.scroller.Scroller,
				engine = ns.engine,
				utilsObject = ns.utils.object,
				eventType = {
					CHANGE: "sectionchange"
				};

			function SectionChanger( ) {
				this.options = {};
			}

			utilsObject.inherit(SectionChanger, Scroller, {
				_build: function( template, element ) {

					this.sections = null;
					this.sectionPositions = [];
					this.activeIndex = 0;

					this._super( template, element );
					return element;
				},

				_configure : function( ) {
					this._super();
					var options = this.options;
					options.items = "section";
					options.activeClass = "section-active";
					options.circular = false;
					options.animate = true;
					options.animateDuration = 100;
					options.orientation = "horizontal";
					options.changeThreshold = -1;
				},

				_init: function() {
					var sectionLength, i, className;

					this.sections = typeof this.options.items === "string" ?
						this.scroller.querySelectorAll( this.options.items ) :
						this.options.items;

					sectionLength = this.sections.length;

					if (  this.options.circular && sectionLength < 3 ) {
						throw "if you use circular option, you must have at least three sections.";
					}

					if ( this.activeIndex >= sectionLength ) {
						this.activeIndex = sectionLength - 1;
					}

					for( i = 0; i < sectionLength; i++ ) {
						className = this.sections[i].className;
						if ( className && className.indexOf( this.options.activeClass ) > -1 ) {
							this.activeIndex = i;
						}

						this.sectionPositions[i] = i;
					}

					this.setActiveSection( this.activeIndex );
					this._prepareLayout();
					this._super();
					this._repositionSections( true );

					// set corret options values.
					if ( !this.options.animate ) {
						this.options.animateDuration = 0;
					}
					if ( this.options.changeThreshold < 0 ) {
						this.options.changeThreshold = this.width / 3;
					}

					if ( sectionLength > 1 ) {
						this.enable();
					} else {
						this.disable();
					}
				},

				_prepareLayout: function() {
					var sectionLength = this.sections.length,
						width = this.element.offsetWidth,
						height = this.element.offsetHeight,
						orientation = this.options.orientation === "horizontal" ? Scroller.Orientation.HORIZONTAL : Scroller.Orientation.VERTICAL,
						scrollerStyle = this.scroller.style;

					// circular option is false.
					if ( orientation === Scroller.Orientation.HORIZONTAL ) {
						scrollerStyle.width = width * sectionLength + "px"; //set Scroller width
						scrollerStyle.height = height + "px"; //set Scroller width
					} else {
						scrollerStyle.width = width + "px"; //set Scroller width
						scrollerStyle.height = height * sectionLength + "px"; //set Scroller width
					}
				},

				_initLayout: function() {
					var sectionStyle = this.sections.style,
						i, sectionLength, top, left;

					//section element has absolute position
					for( i = 0, sectionLength = this.sections.length; i < sectionLength; i++ ){
						//Each section set initialize left position
						sectionStyle = this.sections[i].style;

						sectionStyle.position = "absolute";
						sectionStyle.width = this.width + "px";
						sectionStyle.height = this.height + "px";
						if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
							top = 0;
							left = this.width * i;
						} else {
							top = this.height * i;
							left = 0;
						}

						sectionStyle.top = top + "px";
						sectionStyle.left = left + "px";
					}

					this._super();
				},

				_initScrollbar: function() {
					var scrollbarType = this.options.scrollbar,
						i;

					this.scrollbarelement = document.createElement('div');
					for (i=0; i<this.element.children.length; i++) {
						this.scrollbarelement.appendChild(this.element.children[i]);
					}
					this.element.appendChild(this.scrollbarelement);
					if (scrollbarType) {
						this.scrollbar = engine.instanceWidget(this.scrollbarelement, 'Scrollbar', {
							type: scrollbarType,
							orientation: this.orientation
						});
					}
				},

				_initBouncingEffect: function() {
					var o = this.options;
					if ( o.useBouncingEffect && !o.circular ) {
						this.bouncingEffect = new Scroller.Effect.Bouncing(this.element, {
							maxScrollX: this.maxScrollX,
							maxScrollY: this.maxScrollY,
							orientation: this.orientation
						});
					}
				},

				_translateScrollbar: function( x, y, duration ) {
					var offset, preOffset, fixedOffset;

					if ( !this.scrollbar ) {
						return;
					}

					if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
						preOffset = this.sectionPositions[this.activeIndex] * this.width;
						offset = this.activeIndex * this.width;
						fixedOffset = offset - preOffset;
						offset = -x + fixedOffset;
					} else {
						preOffset = this.sectionPositions[this.activeIndex] * this.height;
						offset = this.activeIndex * this.height;
						fixedOffset = offset - preOffset;
						offset = -y + fixedOffset;
					}

					this.scrollbar.translate( offset, duration );
				},

				_translateScrollbarWithPageIndex: function(pageIndex, duration) {
					var offset;

					if ( !this.scrollbar ) {
						return;
					}

					if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
						offset = pageIndex * this.width;
					} else {
						offset = pageIndex * this.height;
					}

					this.scrollbar.translate( offset, duration );
				},

				_resetLayout: function() {
					var scrollerStyle = this.scroller.style,
						sectionStyle = this.sections.style,
						i, sectionLength;

					scrollerStyle.width = "";
					scrollerStyle.height = "";

					for( i = 0, sectionLength = this.sections.length; i < sectionLength; i++ ){
						sectionStyle = this.sections[i].style;

						sectionStyle.position = "";
						sectionStyle.width = "";
						sectionStyle.height = "";
						sectionStyle.top = "";
						sectionStyle.left = "";
					}

					this._super();
				},

				_bindEvents: function() {
					this._super();
					this.scroller.addEventListener( "webkitTransitionEnd", this);
				},

				_unbindEvents: function() {
					this._super();
					this.scroller.removeEventListener( "webkitTransitionEnd", this);
				},

				handleEvent: function( event ) {
					this._super( event );
					switch (event.type) {
						case "webkitTransitionEnd":
							this._endScroll();
							break;
					}
				},

				setActiveSection: function( index, duration ) {
					var activeClass = this.options.activeClass,
						scrollbarIndex, section, sectionLength, position, newX, newY, i;

					sectionLength = this.sections.length;
					position = this.sectionPositions[ index ];

					if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
						newY = 0;
						newX = -this.width * position;
					} else {
						newY = -this.height * position;
						newX = 0;
					}

					// scrollbar index when circular option is true.
					if ( this.activeIndex - index > 1 ) {
						scrollbarIndex = this.activeIndex + 1;
					} else if ( this.activeIndex - index < -1 ) {
						scrollbarIndex = this.activeIndex - 1;
					} else {
						scrollbarIndex = index;
					}

					this.activeIndex = index;

					for ( i=0; i < sectionLength; i++) {
						section = this.sections[i];
						section.classList.remove(activeClass);
						if (i === this.activeIndex) {
							section.classList.add(activeClass);
						}
					}

					if ( newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY ) {
						this._translate( newX, newY, duration);
						this._translateScrollbarWithPageIndex( scrollbarIndex, duration);
					} else {
						this._endScroll();
					}
				},

				getActiveSectionIndex: function() {
					return this.activeIndex;
				},

				_end: function(/* e */) {
					var lastX = Math.round(this.lastTouchPointX),
						lastY = Math.round(this.lastTouchPointY),
						distX = this.lastTouchPointX - this.startTouchPointX,
						distY = this.lastTouchPointY - this.startTouchPointY,
						dist = this.orientation === Scroller.Orientation.HORIZONTAL ? distX : distY,
						distanceX = Math.abs(lastX - this.startTouchPointX),
						distanceY = Math.abs(lastY - this.startTouchPointY),
						distance = this.orientation === Scroller.Orientation.HORIZONTAL ? distanceX : distanceY,
						maxDistance = this.orientation === Scroller.Orientation.HORIZONTAL ? this.maxScrollX : this.maxScrollY,
						endOffset = this.orientation === Scroller.Orientation.HORIZONTAL ? this.scrollerOffsetX : this.scrollerOffsetY,
						endTime = (new Date()).getTime(),
						duration = endTime - this.startTime,
						flick = duration < 300 && endOffset <= 0 && endOffset >= maxDistance && distance > this.options.flickThreshold,
						requestScrollEnd = this.initiated && ( this.moved || flick ),
						sectionLength = this.sections.length,
						changeThreshold = this.options.changeThreshold,
						cancel = !flick && changeThreshold > distance,
						newIndex=0;

					this.touching = false;

					// bouncing effect
					if ( this.bouncingEffect ) {
						this.bouncingEffect.dragEnd();
					}

					if ( !requestScrollEnd ) {
						this._endScroll();
						return;
					}

					if ( !cancel && dist < 0 ) {
						newIndex = this.activeIndex + 1;
					} else if ( !cancel && dist > 0 ){
						newIndex = this.activeIndex - 1;
					} else {
						// canceled
						newIndex = this.activeIndex;
					}

					if (this.options.circular) {
						newIndex = (sectionLength + newIndex) % sectionLength;
					} else {
						newIndex = newIndex < 0 ? 0 : (newIndex > sectionLength - 1 ? sectionLength - 1 : newIndex);
					}

					this.setActiveSection( newIndex, this.options.animateDuration );
				},

				_endScroll: function() {
					this._repositionSections();
					this._fireEvent( eventType.CHANGE, {
						active: this.activeIndex
					});
					this._super();
				},

				_repositionSections: function( init ) {
					// if developer set circular option is true, this method used when webkitTransitionEnd event fired
					var sectionLength = this.sections.length,
						curPosition = this.sectionPositions[this.activeIndex],
						centerPosition = window.parseInt(sectionLength/2, 10),
						circular = this.options.circular,
						i, sectionStyle, sIdx, top, left, newX, newY;

					if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
						newX = -(this.width * ( circular ? centerPosition : this.activeIndex) );
						newY = 0;
					} else {
						newX = 0;
						newY = -(this.height * ( circular ? centerPosition : this.activeIndex) );
					}

					this._translateScrollbarWithPageIndex(this.activeIndex);

					if ( init || ( curPosition === 0 || curPosition === sectionLength - 1) ) {

						this._translate( newX, newY );

						if ( circular ) {
							for ( i = 0; i < sectionLength; i++ ) {
								sIdx = ( sectionLength + this.activeIndex - centerPosition + i ) % sectionLength;
								sectionStyle = this.sections[ sIdx ].style;

								this.sectionPositions[sIdx] = i;

								if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
									top = 0;
									left = this.width * i;
								} else {
									top = this.height * i;
									left = 0;
								}

								sectionStyle.top = top + "px";
								sectionStyle.left = left + "px";
							}
						}
					}
				},

				_clear: function() {
					this._super();
					this.sectionPositions.length = 0;
				}
			});

			ns.widget.micro.SectionChanger = SectionChanger;

			engine.defineWidget(
				"SectionChanger",
				"",
				".scroller",
				[],
				SectionChanger
			);
			}(window.document, ns));

/*global window, define */
/*jslint nomen: true, plusplus: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Virtual grid widget
 * @class ns.widget.micro.VirtualGrid
 * @extends ns.widget.micro.VirtualListview
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	
				/**
			 * @property {Object} VirtualList Alias for {@link ns.widget.micro.VirtualListview}
			 * @memberOf ns.widget.micro.VirtualGrid
			 * @private
			 * @static
			 */
			var VirtualList = ns.widget.micro.VirtualListview,
				/**
				 * @property {Object} engine Alias for class {@link ns.engine}
				 * @memberOf ns.widget.micro.VirtualGrid
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} DOM Alias for class {@link ns.utils.DOM}
				 * @memberOf ns.widget.micro.VirtualGrid
				 * @private
				 * @static
				 */
				DOM = ns.utils.DOM,
                utilsObject = ns.utils.object,
				/**
				 * @property {string} HORIZONTAL="x" constans for horizontal virtual grid
				 * @private
				 * @memberOf ns.widget.micro.VirtualGrid
				 * @static
				 */
				HORIZONTAL = "x",
				/**
				 * @property {string} VERTICAL="y" constans for vertical virtual grid
				 * @private
				 * @memberOf ns.widget.micro.VirtualGrid
				 * @static
				 */
				VERTICAL = "y",
				/**
				 * Alias for class VirtualGrid
				 * @method VirtualGrid
				 * @memberOf ns.widget.micro.VirtualGrid
				 * @private
				 * @static
				 */
				VirtualGrid = function () {
					/**
					 * @property {Object} options Object with default options
					 * @property {number} [options.bufferSize=100] Element count in buffer
					 * @property {number} [options.dataLength=0] Element count in list
					 * @property {number} [options.orientation='y'] Orientation : horizontal ('x'), vertical ('y')
					 * @memberOf ns.widget.micro.VirtualGrid
					 * @instance
					 */
					this.options = {
						bufferSize: 100,
						dataLength: 0,
						orientation: VERTICAL,
						/**
						 * Method which modifies list item, depended at specified index from database.
						 * @method listItemUpdater
						 * @param {HTMLElement} element List item to be modified.
						 * @param {number} index Index of data set.
						 * @memberOf ns.widget.micro.VirtualGrid
						 */
						listItemUpdater: function () {
							return null;
						}
					};
					return this;
				},

				prototype = new VirtualList(),
				/**
				 * @property {Object} VirtualListPrototype Alias for VirtualList prototype
				 * @memberOf ns.widget.micro.VirtualGrid
				 * @private
				 * @static
				 */
				VirtualListPrototype = VirtualList.prototype,
				/**
				 * @method parent_draw alias for {@link ns.widget.micro.VirtualListview#draw VirtualList.draw}
				 * @memberOf ns.widget.micro.VirtualGrid
				 * @private
				 * @static
				 */
				parent_draw = VirtualListPrototype.draw,
				/**
				 * @method parent_refreshScrollbar alias for {@link ns.widget.micro.VirtualListview#_refreshScrollbar VirtualList.\_refreshScrollbar}
				 * @memberOf ns.widget.micro.VirtualGrid
				 * @private
				 * @static
				 */
				parent_refreshScrollbar = VirtualListPrototype._refreshScrollbar;

			/**
			 * Draw item
			 * @method draw
			 * @instance
			 * @memberOf ns.widget.micro.VirtualGrid
			 */
			prototype.draw = function () {
				var self = this,
					element = self.element,
					ui = self.ui,
					newDiv = null,
					newDivStyle = null;

				if (self.options.orientation === HORIZONTAL) {
					newDiv = document.createElement('div');
					newDivStyle = newDiv.style;
					element.parentNode.appendChild(newDiv);
					newDiv.appendChild(element);
					newDiv.appendChild(ui.spacer);
					newDivStyle.width = '10000px';
					newDivStyle.height = '100%';
					ui.container = newDiv;
				}
				self._initListItem();
				parent_draw.call(self);
			};

			/**
			 * Sets proper scrollbar size: width (horizontal)
			 * @method _refreshScrollbar
			 * @protected
			 * @memberOf ns.widget.micro.VirtualGrid
			 * @instance
			 */
			prototype._refreshScrollbar = function () {
				var width = 0,
					ui = this.ui;
				parent_refreshScrollbar.call(this);
				if (ui.container) {
					width = this.element.clientWidth + ui.spacer.clientWidth;
					ui.container.style.width = width + 'px';
				}
			};

			/**
			 * Initializes list item
			 * @method _initListItem
			 * @protected
			 * @memberOf ns.widget.micro.VirtualGrid
			 * @instance
			 */
			prototype._initListItem = function () {
				var self = this,
					thisElement = self.element,
					element = document.createElement('div'),
					rowElement = document.createElement('div'),
					elementStyle = element.style,
					orientation = self.options.orientation,
					thisElementStyle = thisElement.style,
					rowElementStyle = rowElement.style;

				elementStyle.overflow = 'hidden';
				rowElement.style.overflow = 'hidden';
				thisElement.appendChild(rowElement);
				rowElement.appendChild(element);
				self.options.listItemUpdater(element, 0);

				if (orientation === VERTICAL) {
					thisElementStyle.overflowY = 'auto';
					thisElementStyle.overflowX = 'hidden';
					rowElementStyle.overflow = 'hidden';
					element.style.float = 'left';
					self._cellSize = DOM.getElementWidth(element);
					self._columnsCount = Math.floor(DOM.getElementWidth(thisElement) / self._cellSize);
				} else {
					thisElementStyle.overflowX = 'auto';
					thisElementStyle.overflowY = 'hidden';
					rowElementStyle.overflow = 'hidden';
					rowElementStyle.float = 'left';
					thisElementStyle.height = '100%';
					rowElementStyle.height = '100%';
					self._cellSize = DOM.getElementHeight(element);
					self._columnsCount = Math.floor(DOM.getElementHeight(thisElement) / self._cellSize);
				}
				thisElement.removeChild(rowElement);
				self.options.originalDataLength = self.options.dataLength;
				self.options.dataLength /= self._columnsCount;
			};

			/**
			 * Updates list item with data using defined template
			 * @method _updateListItem
			 * @param {HTMLElement} element List element to update
			 * @param {number} index Data row index
			 * @protected
			 * @instance
			 * @memberOf ns.widget.micro.VirtualGrid
			 */
			prototype._updateListItem = function (element, index) {
				var elementI,
					i,
					count,
					elementStyle = element.style,
					options = this.options,
					elementIStyle,
					size;
				element.innerHTML = '';
				elementStyle.overflow = 'hidden';
				elementStyle.position = 'relative';
				if (options.orientation === HORIZONTAL) {
					elementStyle.height = "100%";
				}
				count = this._columnsCount;
				size = (100 / count);
				for (i = 0; i < count; i++) {
					elementI = document.createElement('div');
					elementIStyle = elementI.style;
					elementIStyle.overflow = 'hidden';

					if (options.orientation === VERTICAL) {
						elementI.style.float = 'left';
						elementI.style.width = size + '%';
					} else {
						elementI.style.height = size + '%';
					}

					this.options.listItemUpdater(elementI, count * index + i);
					element.appendChild(elementI);
				}
			};

            utilsObject.inherit(VirtualGrid, VirtualList, prototype);

			ns.widget.micro.VirtualGrid = VirtualGrid;

			engine.defineWidget(
				"VirtualGrid",
				"",
				".ui-virtualgrid",
				[],
				VirtualGrid
			);

			}(window, window.document, ns));

/*global window, define, ns */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	
				/** @namespace ns.widget.micro */
			ns.widget.micro.scroller.scrollbar = ns.widget.micro.scroller.scrollbar || {};
			}(window, ns));

/*global window, define, ns */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	
				/** @namespace ns.widget.micro */
			ns.widget.micro.scroller.scrollbar.type = ns.widget.micro.scroller.scrollbar.type || {};
			}(window, ns));

/*global window, define, Event, console, ns */
/*jslint nomen: true, plusplus: true */
/**
 * section Changer widget
 * @class ns.widget.SectionChanger
 * @extends ej.widget.BaseWidget
 */
(function (document, ns) {
	
				// scroller.start event trigger when user try to move scroller

			ns.widget.micro.scroller.scrollbar.type.interface = {
				insertAndDecorate: function (/* options */) {
				},
				start: function (/* scrollbarElement, barElement */) {
				},
				end: function (/* scrollbarElement, barElement */) {
				},
				offset: function (/* orientation, offset  */) {
				}
			};
			}(window.document, ns));
/*global window, define, Event, console, ns */
/*jslint nomen: true, plusplus: true */
/**
 * section Changer widget
 * @class ns.widget.SectionChanger
 * @extends ej.widget.BaseWidget
 */
(function (document, ns) {
	
				// scroller.start event trigger when user try to move scroller
			var utilsObject = ns.utils.object,
				type = ns.widget.micro.scroller.scrollbar.type,
				typeInterface = type.interface,
				Scroller = ns.widget.micro.scroller.Scroller;

			type.bar = utilsObject.multiMerge({}, typeInterface, {
				options: {
					wrapperClass: "ui-scrollbar-bar-type",
					barClass: "ui-scrollbar-indicator",
					orientationClass: "ui-scrollbar-",
					margin: 2,
					animationDuration: 500
				},

				insertAndDecorate: function (data) {
					var scrollbarElement = data.wrapper,
						barElement = data.bar,
						container = data.container,
						clip = data.clip,
						orientation = data.orientation,
						margin = this.options.margin,
						clipSize = orientation === Scroller.Orientation.VERTICAL ? clip.offsetHeight : clip.offsetWidth,
						containerSize = orientation === Scroller.Orientation.VERTICAL ? container.offsetHeight : container.offsetWidth,
						orientationClass = this.options.orientationClass + (orientation === Scroller.Orientation.VERTICAL ? "vertical" : "horizontal"),
						barStyle = barElement.style;

					this.containerSize = containerSize;
					this.maxScrollOffset = clipSize - containerSize;
					this.scrollZoomRate = containerSize / clipSize;
					this.barSize = window.parseInt(containerSize / (clipSize / containerSize)) - ( margin * 2 );

					scrollbarElement.className = this.options.wrapperClass + " " + orientationClass;
					barElement.className = this.options.barClass;

					if (orientation === Scroller.Orientation.VERTICAL) {
						barStyle.height = this.barSize + "px";
						barStyle.top = "0px";
					} else {
						barStyle.width = this.barSize + "px";
						barStyle.left = "0px";
					}

					container.appendChild(scrollbarElement);
				},

				offset: function (orientation, offset) {
					var x, y;

					offset = offset === this.maxScrollOffset ? this.containerSize - this.barSize - this.options.margin * 2 : offset * this.scrollZoomRate;

					if (orientation === Scroller.Orientation.VERTICAL) {
						x = 0;
						y = offset;
					} else {
						x = offset;
						y = 0;
					}

					return {
						x: x,
						y: y
					};
				},

				start: function (scrollbarElement/*, barElement */) {
					var style = scrollbarElement.style,
						duration = this.options.animationDuration;
					style["-webkit-transition"] = "opacity " + duration / 1000 + "s ease";
					style.opacity = 1;
				},

				end: function (scrollbarElement/*, barElement */) {
					var style = scrollbarElement.style,
						duration = this.options.animationDuration;
					style["-webkit-transition"] = "opacity " + duration / 1000 + "s ease";
					style.opacity = 0;
				}
			});

			}(window.document, ns));
/*global window, define, Event, console, ns */
/*jslint nomen: true, plusplus: true */
/**
 * section Changer widget
 * @class ns.widget.SectionChanger
 * @extends ej.widget.BaseWidget
 */
(function (document, ns) {
	
				// scroller.start event trigger when user try to move scroller
			var utilsObject = ns.utils.object,
				type = ns.widget.micro.scroller.scrollbar.type,
				typeInterface = type.interface,
				Scroller = ns.widget.micro.scroller.Scroller;

			type.tab = utilsObject.multiMerge({}, typeInterface, {
				options: {
					wrapperClass: "ui-scrollbar-tab-type",
					barClass: "ui-scrollbar-indicator",
					margin: 1
				},

				insertAndDecorate: function (data) {
					var scrollbarElement = data.wrapper,
						barElement = data.bar,
						container = data.container,
						clip = data.clip,
						sections = data.sections,
						orientation = data.orientation,
						margin = this.options.margin,
						clipWidth = clip.offsetWidth,
						clipHeight = clip.offsetHeight,
						containerWidth = container.offsetWidth,
						containerHeight = container.offsetHeight,
						clipSize = orientation === Scroller.Orientation.VERTICAL ? clipHeight : clipWidth,
						containerSize = orientation === Scroller.Orientation.VERTICAL ? containerHeight : containerWidth,
						sectionSize = clipSize / containerSize,
						height, barHeight, i, len;

					this.containerSize = containerWidth;
					this.maxScrollOffset = clipSize - containerSize;
					this.scrollZoomRate = containerWidth / clipSize;
					this.barSize = window.parseInt((containerWidth - margin * 2 * (sectionSize - 1)) / sectionSize);

					scrollbarElement.className = this.options.wrapperClass;
					barElement.className = this.options.barClass;

					barElement.style.width = this.barSize + "px";
					barElement.style.left = "0px";

					container.insertBefore(scrollbarElement, clip);

					// reset page container and section layout.
					barHeight = barElement.offsetHeight;
					height = clipHeight - barHeight;
					clip.style.height = height + "px";
					if (sections && sections.length) {
						for (i = 0, len = sections.length; i < len; i++) {
							sections[i].style.height = height + "px";
						}
					}
				},

				offset: function (orientation, offset) {
					return {
						x: offset === 0 ? -1 :
							offset === this.maxScrollOffset ? this.containerSize - this.barSize - this.options.margin : offset * this.scrollZoomRate,
						y: 0
					};
				}

			});
			}(window.document, ns));
/*global window, define, Event, console, ns */
/*jslint nomen: true, plusplus: true */
/**
 * section Changer widget
 * @class ns.widget.SectionChanger
 * @extends ej.widget.BaseWidget
 */
(function (document, ns) {
	
				// scroller.start event trigger when user try to move scroller
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				prototype = new BaseWidget(),
				utilsObject = ns.utils.object,
				scrollbarType = ns.widget.micro.scroller.scrollbar.type,

				Scroller = ns.widget.micro.scroller.Scroller,
				ScrollerScrollBar = function () {

					this.wrapper = null;
					this.barElement = null;

					this.container = null;
					this.clip = null;

					this.options = {};
					this.type = null;

					this.maxScroll = null;
					this.started = false;
					this.displayDelayTimeoutId = null;

				};

			prototype._build = function (template, scrollElement) {
				this.container = scrollElement;
				this.clip = scrollElement.children[0];
				return scrollElement;
			};

			prototype._configure = function () {
				this.options = utilsObject.multiMerge({}, this.options, {
					type: false,
					displayDelay: 700,
					sections: null,
					orientation: Scroller.Orientation.VERTICAL
				});
			};

			prototype._init = function () {
				var type = this.options.type;

				if (!type) {
					return;
				}

				this.type = scrollbarType[type];
				if (!this.type) {
					throw "Bad options. [type : " + this.options.type + "]";
				}

				this._createScrollbar();
			};

			prototype._createScrollbar = function () {
				var sections = this.options.sections,
					orientation = this.options.orientation,
					wrapper = document.createElement("DIV"),
					bar = document.createElement("span");

				wrapper.appendChild(bar);

				this.type.insertAndDecorate({
					orientation: orientation,
					wrapper: wrapper,
					bar: bar,
					container: this.container,
					clip: this.clip,
					sections: sections
				});

				this.wrapper = wrapper;
				this.barElement = bar;
			};

			prototype._removeScrollbar = function () {
				if (this.wrapper) {
					this.wrapper.parentNode.removeChild(this.wrapper);
				}

				this.wrapper = null;
				this.barElement = null;
			};

			prototype._refresh = function () {
				this.clear();
				this.init();
			};

			prototype.translate = function (offset, duration) {
				var orientation = this.options.orientation,
					translate, transition, barStyle, endDelay;

				if (!this.wrapper || !this.type) {
					return;
				}

				offset = this.type.offset(orientation, offset);

				barStyle = this.barElement.style;
				if (duration) {
					transition = "-webkit-transform " + duration / 1000 + "s ease-out";
				} else {
					transition = "none";
				}

				translate = "translate3d(" + offset.x + "px," + offset.y + "px, 0)";

				barStyle["-webkit-transform"] = translate;
				barStyle["-webkit-transition"] = transition;

				if (!this.started) {
					this._start();
				}

				endDelay = ( duration || 0 ) + this.options.displayDelay;
				if (this.displayDelayTimeoutId !== null) {
					window.clearTimeout(this.displayDelayTimeoutId);
				}
				this.displayDelayTimeoutId = window.setTimeout(this._end.bind(this), endDelay);
			};

			prototype._start = function () {
				this.type.start(this.wrapper, this.barElement);
				this.started = true;
			};

			prototype._end = function () {
				this.started = false;
				this.displayDelayTimeoutId = null;

				if (this.type) {
					this.type.end(this.wrapper, this.barElement);
				}
			};

			prototype._clear = function () {
				this._removeScrollbar();

				this.started = false;
				this.type = null;
				this.wrapper = null;
				this.barElement = null;
				this.displayDelayTimeoutId = null;
			};

			prototype._destroy = function () {
				this._clear();

				this.options = null;
				this.container = null;
				this.clip = null;
			};

			ScrollerScrollBar.prototype = prototype;

			ns.widget.micro.ScrollerScrollBar = ScrollerScrollBar;

			engine.defineWidget(
				"Scrollbar",
				"",
				"",
				[],
				ScrollerScrollBar
			);
			}(window.document, ns));
/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Router
 * Main class to navigate between pages and popups.
 * @class ns.router.micro.Router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns) {
	
					/**
				* Local alias for ns.utils
				* @property {Object} utils Alias for {@link ns.utils}
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
			var utils = ns.utils,
				/**
				* Local alias for ns.utils.events
				* @property {Object} eventUtils Alias for {@link ns.utils.events}
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
				eventUtils = utils.events,
				/**
				* @property {Object} DOM Alias for {@link ns.utils.DOM}
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
				DOM = utils.DOM,
				/**
				* Local alias for ns.utils.path
				* @property {Object} path Alias for {@link ns.utils.path}
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
				path = utils.path,
				/**
				* Local alias for ns.utils.selectors
				* @property {Object} selectors Alias for {@link ns.utils.selectors}
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
				selectors = utils.selectors,
				/**
				* Local alias for ns.utils.object
				* @property {Object} object Alias for {@link ns.utils.object}
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
				object = utils.object,
				/**
				* Local alias for ns.engine
				* @property {Object} engine Alias for {@link ns.engine}
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
				engine = ns.engine,
				/**
				* Local alias for ns.router.micro
				* @property {Object} routerMicro Alias for namespace ns.router.micro
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
				routerMicro = ns.router.micro,
				/**
				* Local alias for ns.micro.selectors
				* @property {Object} microSelectors Alias for {@link ns.micro.selectors}
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
				microSelectors = ns.micro.selectors,
				/**
				* Local alias for ns.router.micro.history
				* @property {Object} history Alias for {@link ns.router.micro.history}
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
				history = routerMicro.history,
				/**
				* Local alias for ns.router.micro.route
				* @property {Object} route Alias for namespace ns.router.micro.route
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
				route = routerMicro.route,
				/**
				* Local alias for document body element
				* @property {HTMLElement} body
				* @memberOf ns.router.micro.Router
				* @static
				* @private
				*/
				body = document.body,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @memberOf ns.router.micro.Router
				 * @private
				 * @static
				 */
				slice = [].slice,

				Router = function () {
					var self = this;
					self.activePage = null;
					/**
					 * @property {?HTMLElement} [firstPage] First page lement
					 * @instance
					 * @memberOf ns.router.micro.Router
					 */
					self.firstPage = null;
					/**
					 * @property {?ns.widget.micro.PageContainer} [container] Container widget
					 * @instance
					 * @memberOf ns.router.micro.Router
					 */
					self.container = null;
					/**
					 * @property {Object} [settings] Settings for last open method
					 * @instance
					 * @memberOf ns.router.micro.Router
					 */
					self.settings = {};
					/**
					 * @property {Object} [rule] rulses for widget navigation
					 * @instance
					 * @memberOf ns.router.micro.Router
					 */
					self.rule = {};
				};

			/**
			* @property {Object} defaults Default values for router
			* @property {boolean} [defaults.fromHashChange = false]
			* @property {boolean} [defaults.reverse = false]
			* @property {boolean} [defaults.showLoadMsg = true]
			* @property {number} [defaults.loadMsgDelay = 0]
			* @property {boolean} [defaults.volatileRecord = false]
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.defaults = {
				fromHashChange: false,
				reverse: false,
				showLoadMsg: true,
				loadMsgDelay: 0,
				volatileRecord: false
			};

			/**
			 * Find the closest link for element
			 * @method findClosestLink
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @private
			 * @static
			 * @memberOf ns.router.micro.Router
			 */
			function findClosestLink(element) {
				while (element) {
					if ((typeof element.nodeName === "string") && element.nodeName.toLowerCase() === "a") {
						break;
					}
					element = element.parentNode;
				}
				return element;
			}

			/**
			 * Handle event link click
			 * @method linkClickHandler
			 * @param {ns.router.micro.Router} router
			 * @param {Event} event
			 * @private
			 * @static
			 * @memberOf ns.router.micro.Router
			 */
			function linkClickHandler(router, event) {
				var link = findClosestLink(event.target),
					href,
					useDefaultUrlHandling,
					options;

				if (link && event.which === 1) {
					href = link.getAttribute("href");
					useDefaultUrlHandling = (link.getAttribute('rel') === 'external') || link.hasAttribute('target');
					if (!useDefaultUrlHandling) {
						options = DOM.getData(link);
						router.open(href, options);
						event.preventDefault();
					}
				}
			}

			/**
			 * Handle event for pop state
			 * @method popStateHandler
			 * @param {ns.router.micro.Router} router
			 * @param {Event} event
			 * @private
			 * @static
			 * @memberOf ns.router.micro.Router
			 */
			function popStateHandler(router, event) {
				var state = event.state,
					prevState = history.activeState,
					rules = routerMicro.route,
					ruleKey,
					options,
					to,
					url,
					isContinue = true,
					reverse,
					transition;

				if (state) {
					to = state.url;
					reverse = history.getDirection(state) === "back";
					transition = reverse ? ((prevState && prevState.transition) || "none") : state.transition;
					options = object.multiMerge({}, state, {
						reverse: reverse,
						transition: transition,
						fromHashChange: true
					});

					url = path.getLocation();

					for (ruleKey in rules) {
						if (rules.hasOwnProperty(ruleKey) && rules[ruleKey].onHashChange(url, options)) {
							isContinue = false;
						}
					}

					history.setActive(state);

					if (isContinue) {
						router.open(to, options);
					}
				}
			}

			/**
			* Change page to page given in parameter to.
			* @method open
			* @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			* @param {Object} [options]
			* @param {string} [options.rel = 'page'] represents kind of link as 'page' or 'popup' or 'external' for linking to another domain
			* @param {string} [options.transition = 'none'] the animation used during change of page
			* @param {boolean} [options.reverse = false] the direction of change
			* @param {boolean} [options.fromHashChange = false] the change route after hashchange
			* @param {boolean} [options.showLoadMsg = true] show message during loading
			* @param {number} [options.loadMsgDelay = 0] delay time for the show message during loading
			* @param {boolean} [options.volatileRecord = false]
			* @param {boolean} [options.dataUrl] page has url attribute
			* @param {string} [options.container = null] uses in RoutePopup as container selector
			 * @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.open = function (to, options) {
				var rel = ((options && options.rel) || "page"),
					rule = route[rel],
					deferred = {},
					filter,
					self = this;

				if (rule) {
					options = object.multiMerge(
						{
							rel: rel
						},
						this.defaults,
						rule.option(),
						options
					);
					filter = rule.filter;
					deferred.resolve = function (options, content) {
						rule.open(content, options);
					};
					deferred.reject = function (options) {
						eventUtils.trigger(self.container.element, "changefailed", options);
					};
					if (typeof to === "string") {
						if (to.replace(/[#|\s]/g, "")) {
							this._loadUrl(to, options, rule, deferred);
						}
					} else {
						if (to && selectors.matchesSelector(to, filter)) {
							deferred.resolve(options, to);
						} else {
							deferred.reject(options);
						}
					}
				} else {
					throw new Error("Not defined router rule [" + rel + "]");
				}
			};

			/**
			* Method initialize page container and build first page is is set flag autoInitializePage
			* @method init
			* @param {boolean} justBuild
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.init = function (justBuild) {
				var page,
					containerElement,
					container,
					firstPage,
					pages,
					activePages,
					location = window.location;

				body = document.body;
				containerElement = ns.get('pageContainer') || body;
				pages = slice.call(containerElement.querySelectorAll(microSelectors.page));
				this.justBuild = justBuild;

				if (ns.get('autoInitializePage', true)) {
					firstPage = containerElement.querySelector(microSelectors.activePage);
					if (!firstPage) {
						firstPage = pages[0];
					}

					if (firstPage) {
						activePages = containerElement.querySelectorAll(microSelectors.activePage);
						slice.call(activePages).forEach(function (page) {
							page.classList.remove(microSelectors.activePage);
						});
						containerElement = firstPage.parentNode;
					}

					if (justBuild) {
												//engine.createWidgets(containerElement, true);
						container = engine.instanceWidget(containerElement, 'pagecontainer');
						if (firstPage) {
							this.register(container, firstPage);
						}
						return;
					}

					if (location.hash) {
						//simple check to determine if we should show firstPage or other
						page = document.getElementById(location.hash.replace('#', ''));
						if (page && selectors.matchesSelector(page, microSelectors.page)) {
							firstPage = page;
						}
					}
				}

				pages.forEach(function(page) {
					if (!DOM.getNSData(page, 'url')) {
						DOM.setNSData(page, 'url', page.id || location.pathname + location.search);
					}
				});

				container = engine.instanceWidget(containerElement, 'pagecontainer');
				this.register(container, firstPage);
			};

			/**
			* Remove all events listners set by router
			* @method destroy
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.destroy = function () {
				window.removeEventListener('popstate', this.popStateHandler, false);
				if (body) {
					body.removeEventListener('pagebeforechange', this.pagebeforechangeHandler, false);
					body.removeEventListener('click', this.linkClickHandler, false);
				}
			};

			/**
			* Set container
			* @method setContainer
			* @param {ns.widget.micro.PageContainer} container
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.setContainer = function (container) {
				this.container = container;
			};

			/**
			* Get container
			* @method getContainer
			* @return {ns.widget.micro.PageContainer} container
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.getContainer = function () {
				return this.container;
			};

			/**
			* Get first page
			* @method getFirstPage
			* @return {HTMLElement} page
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.getFirstPage = function () {
				return this.firstPage;
			};

			/**
			* Register page container and first page
			* @method register
			* @param {ns.widget.micro.PageContainer} container
			* @param {HTMLElement} firstPage
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.register = function (container, firstPage) {
				this.container = container;
				this.firstPage = firstPage;

				this.linkClickHandler = linkClickHandler.bind(null, this);
				this.popStateHandler = popStateHandler.bind(null, this);

				document.addEventListener('click', this.linkClickHandler, false);
				window.addEventListener('popstate', this.popStateHandler, false);

				history.enableVolatileRecord();
				if (firstPage) {
					this.open(firstPage, { transition: 'none' });
				}
			};

			/**
			 * Open popup
			 * @method openPopup
			 * @param {HTMLElement|string} to
			 * @param {Object} [options]
			 * @param {string} [options.rel = 'page'] represents kind of link as 'page' or 'popup' or 'external' for linking to another domain
			 * @param {string} [options.transition = 'none'] the animation used during change of page
			 * @param {boolean} [options.reverse = false] the direction of change
			 * @param {boolean} [options.fromHashChange = false] the change route after hashchange
			 * @param {boolean} [options.showLoadMsg = true] show message during loading
			 * @param {number} [options.loadMsgDelay = 0] delay time for the show message during loading
			 * @param {boolean} [options.volatileRecord = false]
			 * @param {boolean} [options.dataUrl] page has url attribute
			 * @param {string} [options.container = null] uses in RoutePopup as container selector
			 * @instance
			 * @memberOf ns.router.micro.Router
			 */
			Router.prototype.openPopup = function (to, options) {
				this.open(to, object.merge({rel: "popup"}, options));
			};

			/**
			 * Close popup
			 * @method closePopup
			 * @instance
			 * @memberOf ns.router.micro.Router
			 */
			Router.prototype.closePopup = function () {
				// @TODO add checking is popup active
				history.back();
			};

			/**
			 * Load content from url
			 * @method _loadUrl
			 * @param {string} url
			 * @param {Object} options
			 * @param {string} [options.rel = 'page'] represents kind of link as 'page' or 'popup' or 'external' for linking to another domain
			 * @param {string} [options.transition = 'none'] the animation used during change of page
			 * @param {boolean} [options.reverse = false] the direction of change
			 * @param {boolean} [options.fromHashChange = false] the change route after hashchange
			 * @param {boolean} [options.showLoadMsg = true] show message during loading
			 * @param {number} [options.loadMsgDelay = 0] delay time for the show message during loading
			 * @param {boolean} [options.volatileRecord = false]
			 * @param {boolean} [options.dataUrl] page has url attribute
			 * @param {string} [options.container = null] uses in RoutePopup as container selector
			 * @param {string} [options.absUrl] absolute Url for content used by deferred object
			 * @param {Object} rule
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @param {Function} deferred.resolve
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._loadUrl = function (url, options, rule, deferred) {
				var absUrl = path.makeUrlAbsolute(url, path.getLocation()),
					content,
					request,
					detail = {},
					self = this;

				content = rule.find(absUrl);

				if ( !content && path.isEmbedded( absUrl ) ) {
					deferred.reject( detail );
					return;
				}
				// If the content we are interested in is already in the DOM,
				// and the caller did not indicate that we should force a
				// reload of the file, we are done. Resolve the deferrred so that
				// users can bind to .done on the promise
				if (content) {
					detail = object.merge({absUrl: absUrl}, options);
					deferred.resolve(detail, content);
					return;
				}

				if (options.showLoadMsg) {
					this._showLoading(options.loadMsgDelay);
				}

				// Load the new content.
				try {
					request = new XMLHttpRequest();
					request.open('GET', absUrl, false);
					request.send('');
					if (request.readyState === 4) {
						if (request.status === 200 || request.status === 0) {
							self._loadSuccess(absUrl, options, rule, deferred, request.responseText);
						} else {
							self._loadError(absUrl, options, deferred);
						}
					}
				} catch (e) {
					self._loadError(absUrl, options, deferred);
				}
			};

			/**
			 * Error handler for loading content by AJAX
			 * @method _loadError
			 * @param {string} absUrl
			 * @param {Object} options
			 * @param {string} [options.rel = 'page'] represents kind of link as 'page' or 'popup' or 'external' for linking to another domain
			 * @param {string} [options.transition = 'none'] the animation used during change of page
			 * @param {boolean} [options.reverse = false] the direction of change
			 * @param {boolean} [options.fromHashChange = false] the change route after hashchange
			 * @param {boolean} [options.showLoadMsg = true] show message during loading
			 * @param {number} [options.loadMsgDelay = 0] delay time for the show message during loading
			 * @param {boolean} [options.volatileRecord = false]
			 * @param {boolean} [options.dataUrl] page has url attribute
			 * @param {string} [options.container = null] uses in RoutePopup as container selector
			 * @param {string} [options.absUrl] absolute Url for content used by deferred object
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._loadError = function (absUrl, options, deferred) {
				var detail = object.merge({url: absUrl}, options);
				// Remove loading message.
				if (options.showLoadMsg) {
					this._showError(absUrl);
				}

				eventUtils.trigger(this.container.element, "loadfailed", detail);
				deferred.reject(detail);
			};

			// TODO it would be nice to split this up more but everything appears to be "one off"
			//	or require ordering such that other bits are sprinkled in between parts that
			//	could be abstracted out as a group
			/**
			 * Success handler for loading content by AJAX
			 * @method _loadSuccess
			 * @param {string} absUrl
			 * @param {Object} options
			 * @param {string} [options.rel = 'page'] represents kind of link as 'page' or 'popup' or 'external' for linking to another domain
			 * @param {string} [options.transition = 'none'] the animation used during change of page
			 * @param {boolean} [options.reverse = false] the direction of change
			 * @param {boolean} [options.fromHashChange = false] the change route after hashchange
			 * @param {boolean} [options.showLoadMsg = true] show message during loading
			 * @param {number} [options.loadMsgDelay = 0] delay time for the show message during loading
			 * @param {boolean} [options.volatileRecord = false]
			 * @param {boolean} [options.dataUrl] page has url attribute
			 * @param {string} [options.container = null] uses in RoutePopup as container selector
			 * @param {string} [options.absUrl] absolute Url for content used by deferred object
			 * @param {Object} rule
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @param {Function} deferred.resolve
			 * @param {string} html
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._loadSuccess = function (absUrl, options, rule, deferred, html) {
				var detail = object.merge({url: absUrl}, options),
					content = rule.parse(html, absUrl);

				// Remove loading message.
				if (options.showLoadMsg) {
					this._hideLoading();
				}

				if (content) {
					deferred.resolve(detail, content);
				} else {
					deferred.reject(detail);
				}
			};

			// TODO the first page should be a property set during _create using the logic
			//	that currently resides in init
			/**
			 * Get initial content
			 * @method _getInitialContent
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @return {HTMLElement} first page
			 * @protected
			 */
			Router.prototype._getInitialContent = function () {
				return this.firstPage;
			};

			/**
			 * Show the loading indicator
			 * @method _showLoading
			 * @param {number} delay
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._showLoading = function (delay) {
				this.container.showLoading(delay);
			};

			/**
			 * Report an error loading
			 * @method _showError
			 * @param {string} absUrl
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._showError = function (absUrl) {
				ns.error("load error, file: ", absUrl);
			};

			/**
			 * Hide the loading indicator
			 * @method _hideLoading
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._hideLoading = function () {
				this.container.hideLoading();
			};

			/**
			 * Return true if popup is active
			 * @method hasActivePopup
			 * @return {boolean}
			 * @instance
			 * @memberOf ns.router.micro.Router
			 */
			Router.prototype.hasActivePopup = function () {
				return this.rule.popup && this.rule.popup._hasActivePopup();
			};

			routerMicro.Router = Router;

			engine.initRouter(Router);
			}(window, window.document, ns));

/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Support class for router to control change pages.
 * @class ns.router.micro.route.page
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document, ns) {
	
				var utils = ns.utils,
				path = utils.path,
				DOM = utils.DOM,
				object = utils.object,
				utilSelector = utils.selectors,
				history = ns.router.micro.history,
				engine = ns.engine,
				baseElement,
				slice = [].slice,
				routePage = {},
				head;

			/**
			* Tries to find a page element matching id and filter (selector).
			* Adds data url attribute to found page, sets page = null when nothing found
			* @method findPageAndSetDataUrl
			* @private
			* @param {string} id Id of searching element
			* @param {string} filter Query selector for searching page
			* @static
			* @memberOf ns.router.micro.route.page
			*/
			function findPageAndSetDataUrl(id, filter) {
				var page = document.getElementById(id);

				if (page && utilSelector.matchesSelector(page, filter)) {
					DOM.setNSData(page, 'url', id);
				} else {
					// if we matched any element, but it doesn't match our filter
					// reset page to null
					page = null;
				}
				// @TODO ... else
				// probably there is a need for running onHashChange while going back to a history entry
				// without state, eg. manually entered #fragment. This may not be a problem on target device
				return page;
			}

			/**
			 * Property containing default properties
			 * @property {Object} defaults
			 * @property {string} defaults.transition='none'
			 * @static
			 * @memberOf ns.router.micro.route.page
			 */
			routePage.defaults = {
				transition: 'none'
			};

			/**
			 * Property defining selector for filtering only page elements
			 * @property {string} filter
			 * @memberOf ns.router.micro.route.page
			 * @inheritdoc ns.micro.selectors#page
			 * @static
			 */
			routePage.filter = ns.micro.selectors.page;

			/**
			 * Returns default route options used inside Router
			 * @method option
			 * @static
			 * @memberOf ns.router.micro.route.page
			 * @return {Object}
			 */
			routePage.option = function () {
				return routePage.defaults;
			};

			/**
			* Change page
			* @method open
			* @param {HTMLElement|string} toPage
			* @param {Object} [options]
			* @param {boolean} [options.fromHashChange] call was made when on hash change
			* @param {string} [options.dataUrl]
			* @static
			* @memberOf ns.router.micro.route.page
			*/
			routePage.open = function (toPage, options) {
				var pageTitle = document.title,
					url,
					state = {},
					router = engine.getRouter();

				if (toPage === router.firstPage && !options.dataUrl) {
					url = path.documentUrl.hrefNoHash;
				} else {
					url = DOM.getNSData(toPage, "url");
				}

				pageTitle = DOM.getNSData(toPage, "title") || utilSelector.getChildrenBySelector(toPage, ".ui-header > .ui-title").textContent || pageTitle;
				if (!DOM.getNSData(toPage, "title")) {
					DOM.setNSData(toPage, "title", pageTitle);
				}

				if (url && !options.fromHashChange) {
					if (!path.isPath(url) && url.indexOf("#") < 0) {
						url = path.makeUrlAbsolute( "#" + url, path.documentUrl.hrefNoHash );
					}

					state = object.multiMerge(
						{},
						options,
						{
							url: url
						}
					);

					history.replace(state, pageTitle, url);
				}

				// write base element
				this._setBase( url );

				//set page title
				document.title = pageTitle;
				router.container.change(toPage, options);
			};

			/**
			 * Determines target page to open
			 * @method find
			 * @param {string} absUrl absolute path to opened page
			 * @static
			 * @memberOf ns.router.micro.route.page
			 * @return {?HTMLElement}
			 */
			routePage.find = function( absUrl ) {
				var router = engine.getRouter(),
					dataUrl = this._createDataUrl( absUrl ),
					initialContent = router.getFirstPage(),
					pageContainer = router.getContainer(),
					page;

				if ( /#/.test( absUrl ) && path.isPath(dataUrl) ) {
					return null;
				}

				// Check to see if the page already exists in the DOM.
				// NOTE do _not_ use the :jqmData pseudo selector because parenthesis
				//      are a valid url char and it breaks on the first occurence
				page = pageContainer.element.querySelector("[data-url='" + dataUrl + "']" + this.filter);

				// If we failed to find the page, check to see if the url is a
				// reference to an embedded page. If so, it may have been dynamically
				// injected by a developer, in which case it would be lacking a
				// data-url attribute and in need of enhancement.
				if ( !page && dataUrl && !path.isPath( dataUrl ) ) {
					page = findPageAndSetDataUrl(dataUrl, this.filter);
				}

				// If we failed to find a page in the DOM, check the URL to see if it
				// refers to the first page in the application. Also check to make sure
				// our cached-first-page is actually in the DOM. Some user deployed
				// apps are pruning the first page from the DOM for various reasons.
				// We check for this case here because we don't want a first-page with
				// an id falling through to the non-existent embedded page error case.
				if ( !page &&
					path.isFirstPageUrl( dataUrl ) &&
					initialContent &&
					initialContent.parentNode ) {
					page = initialContent;
				}

				return page;
			};

			/**
			 * Parses HTML and runs scripts from parsed code. 
			 * Fetched external scripts if required.
			 * Sets document base to parsed document absolute path.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed page
			 * @static
			 * @memberOf ns.router.micro.route.page
			 * @return {?HTMLElement}
			 */
			routePage.parse = function( html, absUrl ) {
				var page,
					dataUrl = this._createDataUrl( absUrl ),
					scripts,
					all = document.createElement('div');

				// write base element
				// @TODO shouldn't base be set if a page was found?
				this._setBase( absUrl );

				//workaround to allow scripts to execute when included in page divs
				all.innerHTML = html;

				// Finding matching page inside created element
				page = all.querySelector(this.filter);

				// If a page exists...
				if (page) {
					// TODO tagging a page with external to make sure that embedded pages aren't
					// removed by the various page handling code is bad. Having page handling code
					// in many places is bad. Solutions post 1.0
					DOM.setNSData(page, 'url', dataUrl);
					DOM.setNSData(page, 'external', true);

					// Check if parsed page contains scripts
					scripts = page.querySelectorAll('script');
					slice.call(scripts).forEach(function (baseUrl, script) {
						var newscript = document.createElement('script'),
							i,
							scriptAttributes = script.attributes,
							count = script.childNodes.length,
							src = script.getAttribute("src"),
							xhrObj,
							attribute;

						// 'src' may become null when none src attribute is set
						if (src !== null) {
							src = path.makeUrlAbsolute(src, baseUrl);
						}

						//Copy script tag attributes
						for (i = scriptAttributes.length - 1; i >= 0; i -= 1) {
							attribute = scriptAttributes[i];
							if (attribute.name !== 'src') {
								newscript.setAttribute(attribute.name, attribute.value);
							}
						}

						// If external script exists, fetch and insert it inline
						if (src) {
							try {
								// get some kind of XMLHttpRequest
								xhrObj = new XMLHttpRequest();
								// open and send a synchronous request
								xhrObj.open('GET', src, false);
								xhrObj.send('');
								// add the returned content to a newly created script tag
								newscript.type = "text/javascript";
								newscript.text = xhrObj.responseText;
							} catch (ignore) {
							}
						} else {
							for (i = 0; i < count; i++) {
								newscript.appendChild(script.childNodes[i]);
							}
						}
						script.parentNode.replaceChild(newscript, script);
					}.bind(null, dataUrl));
				}
				return page;
			};

			/**
			 * Handles hash change, **currently does nothing**.
			 * @method onHashChange
			 * @static
			 * @memberOf ns.router.micro.route.page
			 * @return {null}
			 */
			routePage.onHashChange = function () {
				return null;
			};

			/**
			 * Created data url from absolute url given as argument
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @protected
			 * @static
			 * @memberOf ns.router.micro.route.page
			 * @return {string}
			 */
			routePage._createDataUrl = function( absoluteUrl ) {
				return path.convertUrlToDataUrl( absoluteUrl, true );
			};

			/**
			 * On open fail, currently never used
			 * @method onOpenFailed 
			 * @static
			 * @memberOf ns.router.micro.route.page
			 */
			routePage.onOpenFailed = function(/* options */) {
				this._setBase( path.parseLocation().hrefNoSearch );
			};

			/**
			 * Returns base element from document head.
			 * If no base element is found, one is created based on current location
			 * @method _getBaseElement
			 * @protected
			 * @static
			 * @memberOf ns.router.micro.route.page
			 * @return {HTMLElement}
			 */
			routePage._getBaseElement = function() {
				// Fetch document head if never cached before
				if (!head) {
					head = document.querySelector("head");
				}
				// Find base element
				if ( !baseElement ) {
					baseElement = document.querySelector("base");
					if (!baseElement) {
						baseElement = document.createElement('base');
						baseElement.href = path.documentBase.hrefNoHash;
						head.appendChild(baseElement);
					}
				}
				return baseElement;
			};

			/**
			 * Sets document base to url given as argument
			 * @method _setBase
			 * @param {string} url
			 * @protected
			 * @static
			 * @memberOf ns.router.micro.route.page
			 */
			routePage._setBase = function( url ) {
				var base = this._getBaseElement(),
					baseHref = base.href;

				if ( path.isPath( url ) ) {
					url = path.makeUrlAbsolute( url, path.documentBase );
					if ( path.parseUrl(baseHref).hrefNoSearch !== path.parseUrl(url).hrefNoSearch ) {
						base.href = url;
						path.documentBase = path.parseUrl(path.makeUrlAbsolute(url, path.documentUrl.href));
					}
				}
			};

			ns.router.micro.route.page = routePage;

			}(window, window.document, ns));

/*global window, define */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * Support class for router to control change pupups.
 * @class ns.router.micro.route.popup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (window, document, ns) {
	
				var routePopup = {
					/**
					 * @property {Object} defaults Object with default options
					 * @property {string} [defaults.transition='none']
					 * @property {?HTMLElement} [defaults.container=null]
					 * @property {boolean} [defaults.volatileRecord=true]
					 * @memberOf ns.router.micro.route.popup
					 * @static
					 */
					defaults: {
						transition: 'none',
						container: null,
						volatileRecord: true
					},
					/**
					 * @property {string} filter Alias for {@link ns.micro.selectors#popup}
					 * @memberOf ns.router.micro.route.popup
					 * @static
					 */
					filter: ns.micro.selectors.popup,
					/**
					 * @property {?HTMLElement} activePopup Storage variable for active popup
					 * @memberOf ns.router.micro.route.popup
					 * @static
					 */
					activePopup: null,
					/**
					 * @property {Object} events Dictionary for popup related event types
					 * @property {string} [events.popup_hide='popuphide']
					 * @memberOf ns.router.micro.route.popup
					 * @static
					 */
					events: {
						popup_hide: 'popuphide'
					}
				},
				/**
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} path Alias for {@link ns.utils.path}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				path = ns.utils.path,
				/**
				 * @property {Object} utilSelector Alias for {@link ns.utils.selectors}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				utilSelector = ns.utils.selectors,
				/**
				 * @property {Object} history Alias for {@link ns.router.micro.history}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				history = ns.router.micro.history,
				/**
				 * @property {Object} pathUtils Alias for {@link ns.utils.path}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				pathUtils = ns.utils.path,
				/**
				 * @property {Object} DOM Alias for {@link ns.utils.DOM}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				DOM = ns.utils.DOM,
				/**
				 * @method slice Alias for array slice method
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				slice = [].slice,
				/**
				 * @property {string} popupHashKey
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				popupHashKey = "popup=true",
				/**
				 * @property {RegExp} popupHashKeyReg
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				popupHashKeyReg = /([&|\?]popup=true)/;

			/**
			 * Tries to find a popup element matching id and filter (selector).
			 * Adds data url attribute to found page, sets page = null when nothing found
			 * @method findPopupAndSetDataUrl
			 * @param {string} id
			 * @param {string} filter
			 * @return {HTMLElement}
			 * @memberOf ns.router.micro.route.popup
			 * @private
			 * @static
			 */
			function findPopupAndSetDataUrl(id, filter) {
				var popup = document.getElementById(path.hashToSelector(id));

				if (popup && utilSelector.matchesSelector(popup, filter)) {
					DOM.setNSData(popup, 'url', id);
				} else {
					// if we matched any element, but it doesn't match our filter
					// reset page to null
					popup = null;
				}
				// @TODO ... else
				// probably there is a need for running onHashChange while going back to a history entry
				// without state, eg. manually entered #fragment. This may not be a problem on target device
				return popup;
			}

			/**
			 * Returns default options
			 * @method option
			 * @return {Object}
			 * @memberOf ns.router.micro.route.popup
			 * @static
			 */
			routePopup.option = function () {
				return routePopup.defaults;
			};

			/**
			 * Change page
			 * @method open
			 * @param {HTMLElement|string} toPopup
			 * @param {Object} options
			 * @memberOf ns.router.micro.route.popup
			 * @static
			 */
			routePopup.open = function (toPopup, options) {
				var popup,
					popupKey,
					router = engine.getRouter(),
					url = pathUtils.getLocation(),
					removePopup = function () {
						document.removeEventListener(routePopup.events.popup_hide, removePopup, false);
						toPopup.parentNode.removeChild(toPopup);
						routePopup.activePopup = null;
					},
					openPopup = function () {
						document.removeEventListener(routePopup.events.popup_hide, openPopup, false);
						popup = engine.instanceWidget(toPopup, 'popup', options);
						popup.open();
						routePopup.activePopup = popup;
					},
					documentUrl = path.getLocation().replace(popupHashKeyReg, ""),
					activePage = router.container.getActivePage(),
					container;

				popupKey = popupHashKey;

				if (!options.fromHashChange) {
					url = path.addHashSearchParams(documentUrl, popupKey);
					history.replace(options, "", url);
				}

				if (DOM.getNSData(toPopup, "external") === true) {
					container = options.container ? activePage.element.querySelector(options.container) : activePage.element;
					container.appendChild(toPopup);
					document.addEventListener(routePopup.events.popup_hide, removePopup, false);
				}

				if (routePopup._hasActivePopup()) {
					document.addEventListener(routePopup.events.popup_hide, openPopup, false);
					routePopup._closeActivePopup();
				} else {
					openPopup();
				}
			};

			/**
			 * Close active popup
			 * @method _closeActivePopup
			 * @param {HTMLElement} activePopup
			 * @memberOf ns.router.micro.route.popup
			 * @protected
			 * @static
			 */
			routePopup._closeActivePopup = function (activePopup) {
				activePopup = activePopup || routePopup.activePopup;

				if (activePopup) {
					// Close and clean up
					activePopup.close();
					routePopup.activePopup = null;
				}
			};

			/**
			 * Close active popup
			 * @method onHashChange
			 * @return {boolean}
			 * @memberOf ns.router.micro.route.popup
			 * @static
			 */
			routePopup.onHashChange = function () {
				var activePopup = routePopup.activePopup;

				if (activePopup) {
					routePopup._closeActivePopup(activePopup);
					// Default routing setting cause to rewrite further window history
					// even if popup has been closed
					// To prevent this onHashChange after closing popup we need to change
					// disable volatile mode to allow pushing new history elements
					return true;
				}
				return false;
			};

			/**
			 * On open fail, currently never used
			 * @method onOpenFailed
			 * @memberOf ns.router.micro.route.popup
			 * @return {null}
			 * @static
			 */
			routePopup.onOpenFailed = function(/* options */) {
				return null;
			};

			/**
			 * Find popup by data-url
			 * @method find
			 * @param {string} absUrl
			 * @return {HTMLElement}
			 * @memberOf ns.router.micro.route.popup
			 * @static
			 */
			routePopup.find = function( absUrl ) {
				var dataUrl = this._createDataUrl( absUrl ),
					activePage = engine.getRouter().getContainer().getActivePage(),
					popup;

				popup = activePage.element.querySelector("[data-url='" + dataUrl + "']" + this.filter);

				if ( !popup && dataUrl && !path.isPath( dataUrl ) ) {
					popup = findPopupAndSetDataUrl(dataUrl, this.filter);
				}

				return popup;
			};

			/**
			 * Parses HTML and runs scripts from parsed code.
			 * Fetched external scripts if required.
			 * @method parse
			 * @param {string} html
			 * @param {string} absUrl
			 * @return {HTMLElement}
			 * @memberOf ns.router.micro.route.popup
			 * @static
			 */
			routePopup.parse = function( html, absUrl ) {
				var popup,
					dataUrl = this._createDataUrl( absUrl ),
					scripts,
					all = document.createElement('div');

				//workaround to allow scripts to execute when included in popup divs
				all.innerHTML = html;

				popup = all.querySelector(this.filter);

				// TODO tagging a popup with external to make sure that embedded popups aren't
				// removed by the various popup handling code is bad. Having popup handling code
				// in many places is bad. Solutions post 1.0
				DOM.setNSData(popup, 'url', dataUrl);
				DOM.setNSData(popup, 'external', true);

				scripts = popup.querySelectorAll('script');
				slice.call(scripts).forEach(function (baseUrl, script) {
					var newscript = document.createElement('script'),
						i,
						scriptAttributes = script.attributes,
						count = script.childNodes.length,
						src = script.getAttribute("src"),
						xhrObj,
						attribute;

					// 'src' may become null when none src attribute is set
					if (src !== null) {
						src = path.makeUrlAbsolute(src, baseUrl);
					}

					//Copy script tag attributes
					for (i = scriptAttributes.length - 1; i >= 0; i -= 1) {
						attribute = scriptAttributes[i];
						if (attribute.name !== 'src') {
							newscript.setAttribute(attribute.name, attribute.value);
						}
					}

					if (src) {
						try {
							// get some kind of XMLHttpRequest
							xhrObj = new XMLHttpRequest();
							// open and send a synchronous request
							xhrObj.open('GET', src, false);
							xhrObj.send('');
							// add the returned content to a newly created script tag
							newscript.type = "text/javascript";
							newscript.text = xhrObj.responseText;
						} catch (ignore) {
						}
					} else {
						for (i = 0; i < count; i++) {
							newscript.appendChild(script.childNodes[i]);
						}
					}
					script.parentNode.replaceChild(newscript, script);
				}.bind(null, dataUrl));

				return popup;
			};

			/**
			 * Convert url to data-url
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @return {string}
			 * @memberOf ns.router.micro.route.popup
			 * @protected
			 * @static
			 */
			routePopup._createDataUrl = function( absoluteUrl ) {
				return path.convertUrlToDataUrl( absoluteUrl );
			};

			/**
			 * Return true if active popup exists.
			 * @method _hasActivePopup
			 * @return {boolean}
			 * @memberOf ns.router.micro.route.popup
			 * @protected
			 * @static
			 */
			routePopup._hasActivePopup = function () {
				var popup = document.querySelector('.ui-popup-active');
				routePopup.activePopup = popup && engine.instanceWidget(popup, 'popup');
				return !!routePopup.activePopup;
			};

			ns.router.micro.route.popup = routePopup;

			}(window, window.document, ns));

/*global define, window */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (ej) {
	
				if (ej.get("autorun", true) === true) {
				ej.engine.run();
			}
			}(ns));

/*global define */

}(window, window.document));
