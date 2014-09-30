/*
 * TAU (Tizen Advanced UI)
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */

(function(window, document, undefined) {

var ns = window.tau = {},
nsConfig = window.tauConfig = window.tauConfig || {};
nsConfig.rootNamespace = 'tau';
nsConfig.fileName = 'tau';
ns.version = '0.9.26';
/*global window, console, define, ns, nsConfig */
/*jslint plusplus:true */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Core namespace
 * Object contains main framework methods.
 * @class ns
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, ns, nsConfig) {
	
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
		* @member ns
		*/
		ns.getUniqueId = function () {
			return rootNamespace + "-" + ns.getNumberUniqueId() + "-" + currentDate;
		};

		/**
		* Return unique id
		* @method getNumberUniqueId
		* @static
		* @return {number}
		* @member ns
		*/
		ns.getNumberUniqueId = function () {
			return idNumberCounter++;
		};

		/**
		* logs supplied messages/arguments
		* @method log
		* @static
		* @param {...*} argument
		* @member ns
		*/
		ns.log = function () {
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
		* @member ns
		*/
		ns.warn = function () {
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
		* @member ns
		*/
		ns.error = function () {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.error.apply(console, args);
			}
		};

		/**
		* get from nsConfig
		* @method getConfig
		* @param {string} key
		* @param {*} defaultValue
		* @return {*}
		* @static
		* @member ns
		*/
		ns.getConfig = function (key, defaultValue) {
			return nsConfig[key] === undefined ? defaultValue : nsConfig[key];
		};

		/**
		 * set in nsConfig
		 * @method setConfig
		 * @param {string} key
		 * @param {*} value
		 * @param {boolean} [asDefault=false] value should be treated as default (doesn't overwrites the config[key] if it already exists)
		 * @static
		 * @member ns
		*/
		ns.setConfig = function (key, value, asDefault) {
			if (!asDefault || (asDefault && nsConfig[key] === undefined)) {
				nsConfig[key] = value;
			}
		};

		/**
		 * Return path for framework script file.
		 * @method getFrameworkPath
		 * @returns {?string}
		 * @member ns
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

		}(window.document, ns, nsConfig));

/*global window, define*/
/*jslint bitwise: true */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ns) {
	
	
			// Default configuration properties
			ns.setConfig('rootDir', ns.getFrameworkPath(), true);
			ns.setConfig('version', '');
			ns.setConfig('allowCrossDomainPages', false, true);
			ns.setConfig('domCache', false, true);
			// .. other possible options
			// ns.setConfig('autoBuildOnPageChange', true);
			// ns.setConfig('autoInitializePage', true);
			// ns.setConfig('container', document.body); // for defining application container
			// ns.setConfig('pageContainer', document.body); // same as above, but for wearable version

			}(ns));

/*global ns, define*/
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
(function (ns) {
	
	
			// Default configuration properties for tv
			ns.setConfig("autoBuildOnPageChange", true, true);

			}(ns));

/*global window, define, ns*/
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint bitwise: true */
/**
 * #Selectors
 * Object contains selectors used in widgets.
 *
 * @class ns.wearable.selectors
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (ns) {
	
			var wearable = ns.wearable || {};
			wearable.selectors = {};
			ns.wearable = wearable;
			}(ns));

/*global window, define, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/*
 * Defaults settings object
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @class ns.defaults
 */
(function (ns) {
	
	
			ns.defaults = {};

			Object.defineProperty(ns.defaults, "autoInitializePage", {
				 get: function(){
					 return ns.getConfig("autoInitializePage", true);
				 },
				 set: function(value){
					 return ns.setConfig("autoInitializePage", value);
				 }
			});

			Object.defineProperty(ns.defaults, "dynamicBaseEnabled", {
				 get: function(){
					 return ns.getConfig("dynamicBaseEnabled", true);
				 },
				 set: function(value){
					 return ns.setConfig("dynamicBaseEnabled", value);
				 }
			});

			Object.defineProperty(ns.defaults, "pageTransition", {
				 get: function(){
					 return ns.getConfig("pageTransition", "none");
				 },
				 set: function(value){
					 return ns.setConfig("pageTransition", value);
				 }
			});

			Object.defineProperty(ns.defaults, "popupTransition", {
				 get: function(){
					 return ns.getConfig("popupTransition", "none");
				 },
				 set: function(value){
					 return ns.setConfig("popupTransition", value);
				 }
			});

			}(ns));

/*global window, define, XMLHttpRequest, console, Blob */
/*jslint nomen: true, browser: true, plusplus: true */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Utilities
 *
 * The Tizen Advanced UI (TAU) framework provides utilities for easy-developing
 * and fully replaceable with jQuery method. When user using these DOM and
 * selector methods, it provide more light logic and it proves performance
 * of web app. The following table displays the utilities provided by the
 * TAU framework.
 *
 * @class ns.util
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (window, document, ns) {
	
				var currentFrame = null,
				/**
				 * requestAnimationFrame function
				 * @method requestAnimationFrame
				 * @static
				 * @member ns.util
				*/
				requestAnimationFrame = (window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					function (callback) {
						currentFrame = window.setTimeout(callback.bind(callback, +new Date()), 1000 / 60);
					}).bind(window),
				util = ns.util || {},
				slice = [].slice;

			/**
			 * fetchSync retrieves a text document synchronously, returns null on error
			 * @param {string} url
			 * @param {=string} [mime=""] Mime type of the resource
			 * @return {string|null}
			 * @static
			 * @member ns.util
			 */
			function fetchSync(url, mime) {
				var xhr = new XMLHttpRequest(),
					status;
				xhr.open("get", url, false);
				if (mime) {
					xhr.overrideMimeType(mime);
				}
				xhr.send();
				if (xhr.readyState === 4) {
					status = xhr.status;
					if (status === 200 || (status === 0 && xhr.responseText)) {
						return xhr.responseText;
					}
				}

				return null;
			}
			util.fetchSync = fetchSync;

			/**
			 * Removes all script tags with src attribute from document and returns them
			 * @param {HTMLElement} container
			 * @return {Array.<HTMLElement>}
			 * @private
			 * @static
			 * @member ns.util
			 */
			function removeExternalScripts(container) {
				var scripts = slice.call(container.querySelectorAll("script[src]")),
					i = scripts.length,
					script;

				while (--i >= 0) {
					script = scripts[i];
					script.parentNode.removeChild(script);
				}

				return scripts;
			}

			/**
			 * Evaluates code, reason for a function is for an atomic call to evaluate code
			 * since most browsers fail to optimize functions with try-catch blocks, so this
			 * minimizes the effect, returns the function to run
			 * @param {string} code
			 * @return {Function}
			 * @static
			 * @member ns.util
			 */
			function safeEvalWrap(code) {
				return function () {
					try {
						window.eval(code);
					} catch (e) {
						if (typeof console !== "undefined") {
							if (e.stack) {
								console.error(e.stack);
							} else if (e.name && e.message) {
								console.error(e.name, e.message);
							} else {
								console.error(e);
							}
						}
					}
				};
			}
			util.safeEvalWrap = safeEvalWrap;

			/**
			 * Calls functions in supplied queue (array)
			 * @param {Array.<Function>} functionQueue
			 * @static
			 * @member ns.util
			 */
			function batchCall(functionQueue) {
				var i,
					length = functionQueue.length;
				for (i = 0; i < length; ++i) {
					functionQueue[i].call(window);
				}
			}
			util.batchCall = batchCall;

			/**
			 * Creates new script elements for scripts gathered from a differnt document
			 * instance, blocks asynchronous evaluation (by renaming src attribute) and
			 * returns an array of functions to run to evalate those scripts
			 * @param {Array.<HTMLElement>} scripts
			 * @param {HTMLElement} container
			 * @return {Array.<Function>}
			 * @private
			 * @static
			 * @member ns.util
			 */
			function createScriptsSync(scripts, container) {
				var scriptElement,
					scriptBody,
					i,
					length,
					queue = [];

				// proper order of execution
				for (i = 0, length = scripts.length; i < length; ++i) {
					scriptBody = fetchSync(scripts[i].src, "text/plain");
					if (scriptBody) {
						scriptElement = document.adoptNode(scripts[i]);
						scriptElement.setAttribute("data-src", scripts[i].src);
						scriptElement.removeAttribute("src"); // block evaluation
						queue.push(safeEvalWrap(scriptBody));
						if (container) {
							container.appendChild(scriptElement);
						}
					}
				}

				return queue;
			}

			util.requestAnimationFrame = requestAnimationFrame;

			/**
			* cancelAnimationFrame function
			* @method cancelAnimationFrame
			* @return {Function}
			* @member ns.util
			* @static
			*/
			util.cancelAnimationFrame = (window.cancelAnimationFrame ||
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
			 * @member ns.util
			 * @static
			 */
			util.async = requestAnimationFrame;

			/**
			 * Appends element from different document instance to current document in the
			 * container element and evaluates scripts (synchronously)
			 * @param {HTMLElement} element
			 * @param {HTMLElement} container
			 * @method importEvaluateAndAppendElement
			 * @member ns.util
			 * @static
			 */
			util.importEvaluateAndAppendElement = function (element, container) {
				var externalScriptsQueue = createScriptsSync(removeExternalScripts(element), element),
					newNode = document.importNode(element, true);

				container.appendChild(newNode); // append and eval inline
				batchCall(externalScriptsQueue);

				return newNode;
			};

			/**
			* Checks if specified string is a number or not
			* @method isNumber
			* @return {boolean}
			* @member ns.util
			* @static
			*/
			util.isNumber = function (query) {
				var parsed = parseFloat(query);
				return !isNaN(parsed) && isFinite(parsed);
			};

			/**
			 * Reappend script tags to DOM structure to correct run script
			 * @method runScript
			 * @param {string} baseUrl
			 * @param {HTMLScriptElement} script
			 * @member ns.util
			 * @deprecated 2.3
			 */
			util.runScript = function (baseUrl, script) {
				var newScript = document.createElement("script"),
					scriptData = null,
					i,
					scriptAttributes = slice.call(script.attributes),
					src = script.getAttribute("src"),
					path = util.path,
					request,
					attribute,
					status;

				// 'src' may become null when none src attribute is set
				if (src !== null) {
					src = path.makeUrlAbsolute(src, baseUrl);
				}

				//Copy script tag attributes
				i = scriptAttributes.length;
				while (--i >= 0) {
					attribute = scriptAttributes[i];
					if (attribute.name !== "src") {
						newScript.setAttribute(attribute.name, attribute.value);
					} else {
						newScript.setAttribute("data-src", attribute.value);
					}
				}

				if (src) {
					scriptData = fetchSync(src, "text/plain");
									} else {
					scriptData = script.textContent;
				}

				if (scriptData) {
					// add the returned content to a newly created script tag
					newScript.src = URL.createObjectURL(new Blob([scriptData], {type: "text/javascript"}));
					newScript.textContent = scriptData; // for compatibility with some libs ex. templating systems
				}
				script.parentNode.replaceChild(newScript, script);
			};

			ns.util = util;
			}(window, window.document, ns));

/*global window, define */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Array Utility
 * Utility helps work with arrays.
 * @class ns.util.array
 */
(function (window, document, ns) {
	
				/**
			 * Create an array containing the range of integers or characters
			 * from low to high (inclusive)
			 * @method range
			 * @param {number|string} low
			 * @param {number|string} high
			 * @param {number} step
			 * @static
			 * @return {Array} array containing continous elements
			 * @member ns.util.array
			 */
			function range(low, high, step) {
				// Create an array containing the range of integers or characters
				// from low to high (inclusive)
				//
				// version: 1107.2516
				// discuss at: http://phpjs.org/functions/range
				// +   original by: Waldo Malqui Silva
				// *	example 1: range ( 0, 12 );
				// *	returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
				// *	example 2: range( 0, 100, 10 );
				// *	returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
				// *	example 3: range( 'a', 'i' );
				// *	returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
				// *	example 4: range( 'c', 'a' );
				// *	returns 4: ['c', 'b', 'a']
				var matrix = [],
					inival,
					endval,
					plus,
					walker = step || 1,
					chars = false;

				if (!isNaN(low) && !isNaN(high)) {
					inival = low;
					endval = high;
				} else if (isNaN(low) && isNaN(high)) {
					chars = true;
					inival = low.charCodeAt(0);
					endval = high.charCodeAt(0);
				} else {
					inival = (isNaN(low) ? 0 : low);
					endval = (isNaN(high) ? 0 : high);
				}

				plus = inival <= endval;
				if (plus) {
					while (inival <= endval) {
						matrix.push((chars ? String.fromCharCode(inival) : inival));
						inival += walker;
					}
				} else {
					while (inival >= endval) {
						matrix.push((chars ? String.fromCharCode(inival) : inival));
						inival -= walker;
					}
				}

				return matrix;
			}

			/**
			 * Check object is arraylike (arraylike include array and
			 * collection)
			 * @method isArrayLike
			 * @param {Object} object
			 * @return {boolean} Whether arraylike object or not
			 * @member ns.util.array
			 * @static
			 */
			function isArrayLike(object) {
				var type = typeof object,
					length = object && object.length;

				// if object exists and is different from window
				// window object has length property
				if (object && object !== object.window) {
					// If length value is not number, object is not array and collection.
					// Collection type is not array but has length value.
					// e.g) Array.isArray(document.childNodes) ==> false
					return Array.isArray(object) || object instanceof NodeList || type === "function" &&
						(length === 0 || typeof length === "number" && length > 0 && (length - 1) in object);
				}
				return false;
			}

			ns.util.array = {
				range: range,
				isArrayLike: isArrayLike
			};
			}(window, window.document, ns));

/*global window, ns, define, CustomEvent */
/*jslint nomen: true */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Events
 *
 * The Tizen Advanced UI (TAU) framework provides events optimized for the Tizen
 * Web application. The following table displays the events provided by the TAU
 * framework.
 * @class ns.event
 */
(function (window, ns) {
	
	
			/**
			* Checks if specified variable is a array or not
			* @method isArray
			* @return {boolean}
			* @member ns.event
			* @private
			* @static
			*/
		var isArray = Array.isArray,
			isArrayLike = ns.util.array.isArrayLike,
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
			 * @member ns.event
			 */
			trim = function (value) {
				return value.trim();
			},

			/**
			 * Split string to array
			 * @method getEventsListeners
			 * @param {string|Array|Object} names string with one name of event, many names of events divided by spaces, array with names of widgets or object in which keys are names of events and values are callbacks
			 * @param {Function} globalListener
			 * @return {Array}
			 * @static
			 * @private
			 * @member ns.event
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
			};

			ns.event = {

				/**
				* Triggers custom event fastOn element
				* The return value is false, if at least one of the event
				* handlers which handled this event, called preventDefault.
				* Otherwise it returns true.
				* @method trigger
				* @param {HTMLElement} element
				* @param {string} type
				* @param {?*} [data=null]
				* @param {boolean=} [bubbles=true]
				* @param {boolean=} [cancelable=true]
				* @return {boolean=}
				* @member ns.event
				* @static
				*/
				trigger: function (element, type, data, bubbles, cancelable) {
					var evt = new CustomEvent(type, {
							"detail": data,
							//allow event to bubble up, required if we want to allow to listen fastOn document etc
							bubbles: typeof bubbles === "boolean" ? bubbles : true,
							cancelable: typeof cancelable === "boolean" ? cancelable : true
						});
										return element.dispatchEvent(evt);
				},

				/**
				 * Prevent default on original event
				 * @method preventDefault
				 * @param {CustomEvent} event
				 * @member ns.event
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
				* @member ns.event
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
				* @member ns.event
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
				 * @member ns.event
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
							touch0 = _event.targetTouches[0] || _event.originalEvent.targetTouches[0];
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
				 * @member ns.event
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
						cords = ns.event.documentRelativeCoordsFromEvent(event);
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
				 * @member ns.event
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
				 * @member ns.event
				 * @static
				 */
				fastOff: function(element, type, listener, useCapture) {
					element.removeEventListener(type, listener, useCapture || false);
				},

				/**
				 * Add event listener to element that can be added addEventListner
				 * @method on
				 * @param {HTMLElement|HTMLDocument|Window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				on: function(element, type, listener, useCapture) {
					var i,
						j,
						elementsLength,
						typesLength,
						elements,
						listeners;

					if (isArrayLike(element)) {
						elements = element;
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					for (i = 0; i < elementsLength; i++) {
						if (typeof elements[i].addEventListener === "function") {
							for (j = 0; j < typesLength; j++) {
								ns.event.fastOn(elements[i], listeners[j].type, listeners[j].callback, useCapture);
							}
						}
					}
				},

				/**
				 * Remove event listener to element
				 * @method off
				 * @param {HTMLElement|HTMLDocument|Window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				off: function(element, type, listener, useCapture) {
					var i,
						j,
						elementsLength,
						typesLength,
						elements,
						listeners;
					if (isArrayLike(element)) {
						elements = element;
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					for (i = 0; i < elementsLength; i++) {
						if (typeof elements[i].addEventListener === "function") {
							for (j = 0; j < typesLength; j++) {
								ns.event.fastOff(elements[i], listeners[j].type, listeners[j].callback, useCapture);
							}
						}
					}
				},

				/**
				 * Add event listener to element only for one trigger
				 * @method one
				 * @param {HTMLElement|HTMLDocument|window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				one: function(element, type, listener, useCapture) {
					var arraySlice = [].slice,
						i,
						j,
						elementsLength,
						typesLength,
						elements,
						types,
						listeners,
						callbacks = [];
					if (isArrayLike(element)) {
						elements = arraySlice.call(element);
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					for (i = 0; i < elementsLength; i++) {
						if (typeof elements[i].addEventListener === "function") {
							callbacks[i] = [];
							for (j = 0; j < typesLength; j++) {
								callbacks[i][j] = (function(i, j) {
									var args = arraySlice.call(arguments);
									ns.event.fastOff(elements[i], listeners[j].type, callbacks[i][j], useCapture);
									args.shift(); // remove the first argument of binding function
									args.shift(); // remove the second argument of binding function
									listeners[j].callback.apply(this, args);
								}).bind(null, i, j);
								ns.event.fastOn(elements[i], listeners[j].type, callbacks[i][j], useCapture);
							}
						}
					}
				}

			};

			}(window, ns));

/*global define: true, window: true */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Selectors Utility
 * Object contains functions to get HTML elements by different selectors.
 * @class ns.util.selectors
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, ns) {
	
				/**
			 * @method slice Alias for array slice method
			 * @member ns.util.selectors
			 * @private
			 * @static
			 */
			var slice = [].slice,
				/**
				 * @method matchesSelectorType
				 * @return {string|boolean}
				 * @member ns.util.selectors
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
			 * @member ns.util.selectors
			 * @private
			 * @static
			 */
			function getDataSelector(selector) {
				var namespace = ns.getConfig('namespace');
				return '[data-' + (namespace ? namespace + '-' : '') + selector + ']';
			}

			/**
			 * Runs matches implementation of matchesSelector
			 * method on specified element
			 * @method matchesSelector
			 * @param {HTMLElement} element
			 * @param {string} selector
			 * @return {boolean}
			 * @static
			 * @member ns.util.selectors
			 */
			function matchesSelector(element, selector) {
				if (matchesSelectorType && element[matchesSelectorType]) {
					return element[matchesSelectorType](selector);
				}
				return false;
			}

			/**
			 * Return array with all parents of element.
			 * @method parents
			 * @param {HTMLElement} element
			 * @return {Array}
			 * @member ns.util.selectors
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
			 * @member ns.util.selectors
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
			 * @member ns.util.selectors
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
			 * @member ns.util.selectors
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
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function testTag(tagName, node) {
				return node.tagName.toLowerCase() === tagName;
			}

			/**
			 * @class ns.util.selectors
			 */
			ns.util.selectors = {
				matchesSelector: matchesSelector,

				/**
				* Return array with children pass by given selector.
				* @method getChildrenBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @member ns.util.selectors
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
				* @member ns.util.selectors
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
				* @member ns.util.selectors
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
				* @member ns.util.selectors
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
				* @member ns.util.selectors
				*/
				getParents: parents,

				/**
				* Return array with all parents of element pass by given selector.
				* @method getParentsBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @member ns.util.selectors
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
				* @member ns.util.selectors
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
				* @member ns.util.selectors
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
				* @member ns.util.selectors
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
				* @member ns.util.selectors
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
				* @member ns.util.selectors
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
				* @member ns.util.selectors
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
				* @member ns.util.selectors
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
				* @member ns.util.selectors
				*/
				getAllByDataNS: function (context, dataSelector) {
					return slice.call(context.querySelectorAll(getDataSelector(dataSelector)));
				}
			};
			}(window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Object Utility
 * Object contains functions help work with objects.
 * @class ns.util.object
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
				* @member ns.util.object
				*/
				copy: function (orgObject) {
					return object.merge({}, orgObject);
				},

				/**
				* Attach fields from second object to first object.
				* @method fastMerge
				* @param {Object} newObject
				* @param {Object} orgObject
				* @return {Object}
				* @static
				* @member ns.util.object
				*/
				fastMerge: function (newObject, orgObject) {
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
				* @method merge
				* @param {Object} newObject
				* @param {...Object} orgObject
				* @param {?boolean} [override=true]
				* @return {Object}
				* @static
				* @member ns.util.object
				*/
				merge: function ( /* newObject, orgObject, override */ ) {
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
				 * @member ns.util.object
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
				},

				/**
				 * Returns true if every property value corresponds value from 'value' argument
				 * @method hasPropertiesOfValue
				 * @param {Object} obj
				 * @param {*} [value=undefined]
				 * @return {boolean}
				 */
				hasPropertiesOfValue: function (obj, value) {
					var keys = Object.keys(obj),
						i = keys.length;

					// Empty array should return false
					if (i === 0) {
						return false;
					}

					while (--i >= 0) {
						if (obj[keys[i]] !== value) {
							return false;
						}
					}

					return true;
				}
			};
			ns.util.object = object;
			}(ns));

/*global window, define, ns, Node, HTMLElement */
/*jslint nomen: true, plusplus: true, bitwise: false */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Engine
 * Main class with engine of library which control communication
 * between parts of framework.
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
			 * @member ns.engine
			 */
			var slice = [].slice,
				/**
				 * @property {Object} eventUtils {@link ns.event}
				 * @private
				 * @static
				 * @member ns.engine
				 */
				eventUtils = ns.event,
				objectUtils = ns.util.object,
				selectors = ns.util.selectors,
				/**
				 * @property {Object} widgetDefs Object with widgets definitions
				 * @private
				 * @static
				 * @member ns.engine
				 */
				widgetDefs = {},
				/**
				 * @property {Object} widgetBindingMap Object with widgets bindings
				 * @private
				 * @static
				 * @member ns.engine
				 */
				widgetBindingMap = {},
				location = window.location,
				/**
				 * engine mode, if true then engine only builds widgets
				 * @property {boolean} justBuild
				 * @private
				 * @static
				 * @member ns.engine
				 */
				justBuild = location.hash === "#build",
				/**
				 * @property {string} [TYPE_STRING="string"] local cache of string type name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				TYPE_STRING = "string",
				/**
				 * @property {string} [TYPE_FUNCTION="function"] local cache of function type name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				TYPE_FUNCTION = "function",
				/**
				 * @property {string} [DATA_BUILT="data-tau-built"] attribute informs that widget id build
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_BUILT = "data-tau-built",
				/**
				 * @property {string} [DATA_NAME="data-tau-name"] attribute contains widget name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_NAME = "data-tau-name",
				/**
				 * @property {string} [DATA_BOUND="data-tau-bound"] attribute informs that widget id bound
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_BOUND = "data-tau-bound",
				/**
				 * @property {string} NAMES_SEPARATOR
				 * @private
				 * @static
				 * @readonly
				 */
				NAMES_SEPARATOR = ",",
				/**
				 * @property {string} [querySelectorWidgets="*[data-tau-built][data-tau-name]:not([data-tau-bound])"] query selector for all widgets which are built but not bound
				 * @private
				 * @static
				 * @member ns.engine
				 */
					// @TODO this selector is not valid ...
				querySelectorWidgets = "*[" + DATA_BUILT + "][" + DATA_NAME + "]:not([" + DATA_BOUND + "])",
				/**
				 * @method excludeBuildAndBound
				 * @private
				 * @static
				 * @member ns.engine
				 * @return {string} :not([data-tau-built*='widgetName']):not([data-tau-bound*='widgetName'])
				 */
				excludeBuiltAndBound = function (widgetType) {
					return ":not([" + DATA_BUILT + "*='" + widgetType +"']):not([" + DATA_BOUND + "*='" + widgetType +"'])";
				},

				/**
				 * Engine event types
				 * @property {Object} eventType
				 * @property {string} eventType.INIT="tauinit" INIT of framework init event
				 * @property {string} eventType.WIDGET_BOUND="widgetbound" WIDGET_BOUND of widget bound event
				 * @property {string} eventType.WIDGET_DEFINED="widgetdefined" WIDGET_DEFINED of widget built event
				 * @property {string} eventType.WIDGET_BUILT="widgetbuilt" WIDGET_BUILT of widget built event
				 * @property {string} eventType.BOUND="bound" BOUND of bound event
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				eventType = {
					INIT: "tauinit",
					WIDGET_BOUND: "widgetbound",
					WIDGET_DEFINED: "widgetdefined",
					WIDGET_BUILT: "widgetbuilt",
					BOUND: "bound"
				},
				engine,
				/**
				 * @property {Object} router Router object
				 * @private
				 * @static
				 * @member ns.engine
				 */
				router;

			/**
			 * This function prepares selector for widget' definition
			 * @method selectorChange
			 * @param {string} selectorName
			 * @return {string} new selector
			 * @member ns.engine
			 * @static
			 */
			function selectorChange (selectorName) {
				if (selectorName.match(/\[data-role=/) && !selectorName.match(/:not\(\[data-role=/)) {
					return selectorName.trim();
				}
				return selectorName.trim() + ":not([data-role='none'])";
			}

			/**
			 * Function to define widget
			 * @method defineWidget
			 * @param {string} name
			 * @param {string} selector
			 * @param {Array} methods
			 * @param {Object} widgetClass
			 * @param {string} [namespace]
			 * @param {boolean} [redefine]
			 * @param {boolean} [widgetNameToLowercase = true]
			 * @return {boolean}
			 * @member ns.engine
			 * @static
			 */
			function defineWidget(name, selector, methods, widgetClass, namespace, redefine, widgetNameToLowercase) {
				var definition;
				// Widget name is absolutely required
				if (name) {
					if (!widgetDefs[name] || redefine) {
												methods = methods || [];
						methods.push("destroy", "disable", "enable", "option", "refresh", "value");
						definition = {
							name: name,
							methods: methods,
							selector: selector || "",
							selectors: selector ? selector.split(",").map(selectorChange) : [],
							widgetClass: widgetClass || null,
							namespace: namespace || "",
							widgetNameToLowercase: widgetNameToLowercase === undefined ? true : !!widgetNameToLowercase
						};

						widgetDefs[name] = definition;
						eventUtils.trigger(document, "widgetdefined", definition, false);
						return true;
					}
									} else {
					ns.error("Widget with selector [" + selector + "] defined without a name, aborting!");
				}
				return false;
			}

			/**
			 * Get binding for element
			 * @method getBinding
			 * @static
			 * @param {HTMLElement|string} element
			 * @param {string} type widget name
			 * @return {?Object}
			 * @member ns.engine
			 */
			function getBinding(element, type) {
				var id = !element || typeof element === TYPE_STRING ? element : element.id,
					binding,
					widgetInstance,
					bindingElement,
					storedWidgetNames;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(id);
				}

				// Fetch group of widget defined for this element
				binding = widgetBindingMap[id];

				if (binding && typeof binding === "object") {
					// If name is defined it's possible to fetch it instantly
					if (type) {
						widgetInstance = binding.instances[type];
					} else {
						storedWidgetNames = Object.keys(binding.instances);
						widgetInstance = binding.instances[storedWidgetNames[0]];
					}

					// Return only it instance of the proper widget exists
					if (widgetInstance) {
						
						// Check if widget instance has that same object referenced
						if (widgetInstance.element === element) {
							return widgetInstance;
						}
					}
				}

				return null;
			}

			/**
			 * Set binding of widget
			 * @method setBinding
			 * @param {ns.widget.BaseWidget} widgetInstance
			 * @static
			 * @member ns.engine
			 */
			function setBinding(widgetInstance) {
				var id = widgetInstance.element.id,
					type = widgetInstance.name,
					widgetBinding = widgetBindingMap[id];

				
				// If the HTMLElement never had a widget declared create an empty object
				if(!widgetBinding) {
					widgetBinding = {
						elementId: id,
						element: widgetInstance.element,
						instances: {}
					};
				}

				widgetBinding.instances[type] = widgetInstance;
				widgetBindingMap[id] = widgetBinding;
			}

			/**
			 * Returns all bindings for element or id gives as parameter
			 * @method getAllBindings
			 * @param {HTMLElement|string} element
			 * @return {?Object}
			 * @static
			 * @member ns.engine
			 */
			function getAllBindings(element) {
				var id = !element || typeof element === TYPE_STRING ? element : element.id;

				return (widgetBindingMap[id] && widgetBindingMap[id].instances) || null;
			}

			/**
			 * Removes given name from attributeValue string.
			 * Names should be separated with a NAMES_SEPARATOR
			 * @param {string} name
			 * @param {string} attributeValue
			 * @private
			 * @static
			 * @return {string}
			 */
			function _removeWidgetNameFromAttribute(name, attributeValue) {
				var widgetNames,
					searchResultIndex;

				// Split attribute value by separator
				widgetNames = attributeValue.split(NAMES_SEPARATOR);
				searchResultIndex = widgetNames.indexOf(name);

				if (searchResultIndex > -1) {
					widgetNames.splice(searchResultIndex, 1);
					attributeValue = widgetNames.join(NAMES_SEPARATOR);
				}

				return attributeValue;
			}

			function _removeAllBindingAttributes(element) {
				element.removeAttribute(DATA_BUILT);
				element.removeAttribute(DATA_BOUND);
				element.removeAttribute(DATA_NAME);
			}
			/**
			 * Remove binding data attributes for element.
			 * @method _removeBindingAttributes
			 * @param {HTMLElement} element
			 * @param {string} type widget type (name)
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function _removeWidgetFromAttributes(element, type) {
				var dataBuilt,
					dataBound,
					dataName;

				// Most often case is that name is not defined
				if (!type) {
					_removeAllBindingAttributes(element);
				} else {
					dataBuilt = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_BUILT) || "");
					dataBound = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_BOUND) || "");
					dataName = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_NAME) || "");

					// Check if all attributes have at least one widget
					if (dataBuilt && dataBound && dataName) {
						element.setAttribute(DATA_BUILT, dataBuilt);
						element.setAttribute(DATA_BOUND, dataBound);
						element.setAttribute(DATA_NAME, dataName);
					} else {
						// If something is missing remove everything
						_removeAllBindingAttributes(element);
					}
				}
			}

			/**
			 * Method removes binding for single widget.
			 * @method _removeSingleBinding
			 * @param {Object} bindingGroup
			 * @param {string} type
			 * @return {boolean}
			 * @private
			 * @static
			 */
			function _removeSingleBinding(bindingGroup, type) {
				var widgetInstance = bindingGroup[type];

				if (widgetInstance){
					if (widgetInstance.element && typeof widgetInstance.element.setAttribute === TYPE_FUNCTION) {
						_removeWidgetFromAttributes(widgetInstance.element, type);
					}

					bindingGroup[type] = null;

					return true;
				}

				return false;
			}

			/**
			 * Remove binding for widget based on element.
			 * @method removeBinding
			 * @param {HTMLElement|string} element
			 * @param {string} type widget name
			 * @return {boolean}
			 * @static
			 * @member ns.engine
			 */
			function removeBinding(element, type) {
				var id = (typeof element === TYPE_STRING) ? element : element.id,
					binding = widgetBindingMap[id],
					bindingGroup,
					widgetName,
					partialSuccess,
					fullSuccess = false;

				// [NOTICE] Due to backward compatibility calling removeBinding
				// with one parameter should remove all bindings

				if (binding) {
					if (typeof element === TYPE_STRING) {
						// Search based on current document may return bad results,
						// use previously defined element if it exists
						element = binding.element;
					}

					if (element) {
						_removeWidgetFromAttributes(element, type);
					}

					bindingGroup = widgetBindingMap[id] && widgetBindingMap[id].instances;

					if (bindingGroup) {
						if (!type) {
							fullSuccess = true;

							// Iterate over group of created widgets
							for (widgetName in bindingGroup) {
								if (bindingGroup.hasOwnProperty(widgetName)) {
									partialSuccess = _removeSingleBinding(bindingGroup, widgetName);
									
									// As we iterate over keys we are sure we want to remove this element
									// NOTE: Removing property by delete is slower than assigning null value
									bindingGroup[widgetName] = null;

									fullSuccess = (fullSuccess && partialSuccess);
								}
							}

							// If the object bindingGroup is empty or every key has a null value
							if (objectUtils.hasPropertiesOfValue(bindingGroup, null)) {
								// NOTE: Removing property by delete is slower than assigning null value
								widgetBindingMap[id] = null;
							}

							return fullSuccess;
						}

						partialSuccess = _removeSingleBinding(bindingGroup, type);

						if (objectUtils.hasPropertiesOfValue(bindingGroup, null)) {
							widgetBindingMap[id] = null;
						}

						return partialSuccess;
					}
				}

				return false;
			}

			/**
			 * Removes all bindings of widgets.
			 * @method removeAllBindings
			 * @param {HTMLElement|string} element
			 * @return {boolean}
			 * @static
			 * @member ns.engine
			 */
			function removeAllBindings(element) {
				// @TODO this should be coded in the other way around, removeAll should loop through all bindings and inside call removeBinding
				// but due to backward compatibility that code should be more readable
				return removeBinding(element);
			}

			/**
			 * Load widget
			 * @method processWidget
			 * @param {HTMLElement} element base element of widget
			 * @param {Object} definition definition of widget
			 * @param {ns.widget.BaseWidget} definition.widgetClass
			 * @param {string} definition.name
			 * @param {Object} [options] options for widget
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function processWidget(element, definition, options) {
				var widgetOptions = options || {},
					createFunction = widgetOptions.create,
					Widget = definition.widgetClass,
					/**
					 * @type {ns.widget.BaseWidget} widgetInstance
					 */
					widgetInstance = Widget ? new Widget(element) : false,
					buildAttribute,
					parentEnhance = selectors.getParentsBySelectorNS(element, 'enhance=false'),
					existingBinding;

				// While processing widgets queue other widget may built this one before
				// it reaches it's turn
				existingBinding = getBinding(element, definition.name);
				if (existingBinding && existingBinding.element === element) {
					return existingBinding.element;
				}

				if (widgetInstance && !parentEnhance.length) {
										widgetInstance.configure(definition, element, options);

					// Run .create method from widget options when a [widgetName]create event is triggered
					if (typeof createFunction === TYPE_FUNCTION) {
						eventUtils.one(element, definition.name.toLowerCase() + "create", createFunction);
					}

					if (element.id) {
						widgetInstance.id = element.id;
					}

					// Check if this type of widget was build for this element before
					buildAttribute = element.getAttribute(DATA_BUILT);
					if (!buildAttribute || (buildAttribute && buildAttribute.split(NAMES_SEPARATOR).indexOf(widgetInstance.name) === -1)) {
						element = widgetInstance.build(element);
					}

					if (element) {
						widgetInstance.element = element;

						setBinding(widgetInstance);

						widgetInstance.trigger(eventType.WIDGET_BUILT, widgetInstance, false);

						if (!justBuild) {
							widgetInstance.init(element);
						}

						widgetInstance.bindEvents(element, justBuild);

						eventUtils.trigger(element, eventType.WIDGET_BOUND, widgetInstance, false);
						eventUtils.trigger(document, eventType.WIDGET_BOUND, widgetInstance);
					} else {
											}
				}
				return widgetInstance.element;
			}

			/**
			 * Destroys widget of given 'type' for given HTMLElement.
			 * [NOTICE] This method won't destroy any children widgets.
			 * @method destroyWidget
			 * @param {HTMLElement|string} element
			 * @param {string} type
			 * @static
			 * @member ns.engine
			 */
			function destroyWidget(element, type) {
				var widgetInstance;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(element);
				}

				
				// If type is not defined all widgets should be removed
				// this is for backward compatibility
				widgetInstance = getBinding(element, type);

				if (widgetInstance) {
					//Destroy widget
					widgetInstance.destroy();
					widgetInstance.trigger("widgetdestroyed");

					removeBinding(element, type);
				}
			}

			/**
			 * Calls destroy on widget (or widgets) connected with given HTMLElement
			 * Removes child widgets as well.
			 * @method destroyAllWidgets
			 * @param {HTMLElement|string} element
			 * @param {boolean} [childOnly=false] destroy only widgets on children elements
			 * @static
			 * @member ns.engine
			 */
			function destroyAllWidgets(element, childOnly) {
				var widgetName,
					widgetInstance,
					widgetGroup,
					childWidgets,
					i;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(element);
				}

				
				if (!childOnly) {
					// If type is not defined all widgets should be removed
					// this is for backward compatibility
					widgetGroup = getAllBindings(element);
					for (widgetName in widgetGroup) {
						if (widgetGroup.hasOwnProperty(widgetName)) {
							widgetInstance = widgetGroup[widgetName];

							//Destroy widget
							widgetInstance.destroy();
							widgetInstance.trigger("widgetdestroyed");
						}
					}
				}

				//Destroy child widgets, if something left.
				childWidgets = slice.call(element.querySelectorAll("[" + DATA_BOUND + "]"));
				for (i = childWidgets.length - 1; i >= 0; i -= 1) {
					if (childWidgets[i]) {
						destroyAllWidgets(childWidgets[i], false);
					}
				}

				removeAllBindings(element);
			}

			/**
			 * Load widgets from data-* definition
			 * @method processHollowWidget
			 * @param {HTMLElement} element base element of widget
			 * @param {Object} definition widget definition
			 * @param {Object} [options] options for create widget
			 * @return {HTMLElement} base element of widget
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function processHollowWidget(element, definition, options) {
				var name = element.getAttribute(DATA_NAME) || (definition && definition.name);
								definition = definition || (name && widgetDefs[name]) || {
					"name": name
				};
				return processWidget(element, definition, options);
			}

			/**
			 * Compare function for nodes on build queue
			 * @param {Object} nodeA
			 * @param {Object} nodeB
			 * @return {number}
			 * @private
			 * @static
			 */
			function compareByDepth(nodeA, nodeB) {
				var mask = Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING;

				if (nodeA.element.compareDocumentPosition(nodeB.element) & mask) {
					return 1;
				}

				return -1;
			}

			/**
			 * Processes one build queue item. Runs processHollowWidget
			 * underneath
			 * @method processBuildQueueItem
			 * @param {Object|HTMLElement} queueItem
			 * @private
			 * @static
			 */
			function processBuildQueueItem(queueItem) {
				// HTMLElement doesn't have .element property
				// widgetDefs will return undefined when called widgetDefs[undefined]
				processHollowWidget(queueItem.element || queueItem, widgetDefs[queueItem.widgetName]);
			}

			/**
			 * Build widgets on all children of context element
			 * @method createWidgets
			 * @static
			 * @param {HTMLElement} context base html for create children
			 * @member ns.engine
			 */
			function createWidgets(context) {
				var builtWithoutTemplates = slice.call(context.querySelectorAll(querySelectorWidgets)),
					normal = [],
					buildQueue = [],
					selectorKeys = Object.keys(widgetDefs),
					excludeSelector,
					i,
					j,
					len = selectorKeys.length,
					definition,
					widgetName,
					definitionSelectors;

				
				// @TODO EXPERIMENTAL WIDGETS WITHOUT TEMPLATE DEFINITION
				builtWithoutTemplates.forEach(processBuildQueueItem);

				/* NORMAL */
				for (i = 0; i < len; ++i) {
					widgetName = selectorKeys[i];
					definition = widgetDefs[widgetName];
					definitionSelectors = definition.selectors;
					if (definitionSelectors.length) {
						excludeSelector = excludeBuiltAndBound(widgetName);

						normal = slice.call(context.querySelectorAll(definitionSelectors.join(excludeSelector + ",") + excludeSelector));
						j = normal.length;

						while (--j >= 0) {
							buildQueue.push({
								element: normal[j],
								widgetName: widgetName
							});
						}
					}
				}

				// Sort queue by depth, on every DOM branch outer most element go first
				buildQueue.sort(compareByDepth);

				// Build all widgets from queue
				buildQueue.forEach(processBuildQueueItem);

				eventUtils.trigger(document, "built");
				eventUtils.trigger(document, eventType.BOUND);
							}

			/**
			 * Handler for event create
			 * @method createEventHandler
			 * @param {Event} event
			 * @static
			 * @member ns.engine
			 */
			function createEventHandler(event) {
				createWidgets(event.target);
			}

			function setViewport() {
				/**
				 * Sets viewport tag if not exists
				 */
				var documentHead = document.head,
					metaTagListLength,
					metaTagList,
					metaTag,
					i;

				metaTagList = documentHead.querySelectorAll('[name="viewport"]');
				metaTagListLength = metaTagList.length;

				if (metaTagListLength > 0) {
					// Leave the last viewport tag
					--metaTagListLength;

					// Remove duplicated tags
					for (i = 0; i < metaTagListLength; ++i) {
						// Remove meta tag from DOM
						documentHead.removeChild(metaTagList[i]);
					}
				} else {
					// Create new HTML Element
					metaTag = document.createElement('meta');

					// Set required attributes
					metaTag.setAttribute('name', 'viewport');
					metaTag.setAttribute('content', 'width=device-width, user-scalable=no');

					// Force that viewport tag will be first child of head
					if (documentHead.firstChild) {
						documentHead.insertBefore(metaTag, documentHead.firstChild);
					} else {
						documentHead.appendChild(metaTag);
					}
				}
			}

			/**
			 * Build first page
			 * @method build
			 * @static
			 * @member ns.engine
			 */
			function build() {
				if (router) {
					// @TODO: Consider passing viewport options via script tag arguments (web-ui-fw style).
					setViewport();

					eventUtils.trigger(document, "beforerouterinit", router, false);
					router.init(justBuild);
					eventUtils.trigger(document, "routerinit", router, false);
				}
			}

			/**
			 * Method to remove all listeners bound in run
			 * @method stop
			 * @static
			 * @member ns.engine
			 */
			function stop() {
				if (router) {
					router.destroy();
				}
			}
			/*
			 document.addEventListener(eventType.BOUND, function () {
			 //@TODO dump it to file for faster binding by ids
			 nsWidgetBindingMap = widgetBindingMap;
			 }, false);
			 */
			ns.widgetDefinitions = {};
			engine = {
				justBuild: location.hash === "#build",
				/**
				 * object with names of engine attributes
				 * @property {Object} dataTau
				 * @property {string} [dataTau.built="data-tau-built"] attribute inform that widget id build
				 * @property {string} [dataTau.name="data-tau-name"] attribute contains widget name
				 * @property {string} [dataTau.bound="data-tau-bound"] attribute inform that widget id bound
				 * @property {string} [dataTau.separator=","] separation string for widget names
				 * @static
				 * @member ns.engine
				 */
				dataTau: {
					built: DATA_BUILT,
					name: DATA_NAME,
					bound: DATA_BOUND,
					separator: NAMES_SEPARATOR
				},
				destroyWidget: destroyWidget,
				destroyAllWidgets: destroyAllWidgets,
				createWidgets: createWidgets,

				/**
				 * Method to get all definitions of widgets
				 * @method getDefinitions
				 * @return {Object}
				 * @static
				 * @member ns.engine
				 */
				getDefinitions: function () {
					return widgetDefs;
				},
				/**
				 * Returns definition of widget
				 * @method getWidgetDefinition
				 * @param {string} name
				 * @static
				 * @member ns.engine
				 * @returns {Object}
				 */
				getWidgetDefinition: function (name) {
					return widgetDefs[name];
				},
				defineWidget: defineWidget,
				getBinding: getBinding,
				getAllBindings: getAllBindings,
				setBinding: setBinding,
				// @TODO either rename or fix functionally because
				// this method does not only remove binding but
				// actually destroys widget
				removeBinding: removeBinding,
				removeAllBindings: removeAllBindings,

				/**
				 * Clear bindings of widgets
				 * @method _clearBindings
				 * @static
				 * @member ns.engine
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
				 * @member ns.engine
				 */
				run: function () {
					stop();

					eventUtils.fastOn(document, "create", createEventHandler);

					eventUtils.trigger(document, eventType.INIT, {tau: ns});

					switch (document.readyState) {
					case "interactive":
					case "complete":
						build();
						break;
					default:
						eventUtils.fastOn(document, "DOMContentLoaded", build.bind(engine));
						break;
					}
				},

				/**
				 * Return router
				 * @method getRouter
				 * @return {Object}
				 * @static
				 * @member ns.engine
				 */
				getRouter: function () {
					return router;
				},

				/**
				 * Initialize router. This method should be call in file with router class definition.
				 * @method initRouter
				 * @param {Function} RouterClass Router class
				 * @static
				 * @member ns.engine
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
				 * @member ns.engine
				 */
				instanceWidget: function (element, name, options) {
					var binding = getBinding(element, name),
						definition;

					if (!element) {
						ns.error("'element' cannot be empty");
						return null;
					}

					if (!binding && widgetDefs[name]) {
						definition = widgetDefs[name];
						element = processHollowWidget(element, definition, options);
						binding = getBinding(element, name);
					}
					return binding;
				},

				stop: stop,

				/**
				 * Method to change build mode
				 * @method setJustBuild
				 * @param {boolean} newJustBuild
				 * @static
				 * @member ns.engine
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
				 * @member ns.engine
				 */
				getJustBuild: function () {
					return justBuild;
				},
				_createEventHandler : createEventHandler
			};

			engine.eventType = eventType;
			ns.engine = engine;
			}(window, window.document, ns));

/*global window, define, ns */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Anchor Highlight Utility
 * Utility enables highlight links.
 * @class ns.util.anchorHighlight
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 * @author Konrad Lipner <k.lipner@samsung.com>
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
			 * Touch start x
			 * @property {number} startX
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			var startX,
				/**
				 * Touch start y
				 * @property {number} startY
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				startY,
				/**
				 * Did page scrolled
				 * @property {boolean} didScroll
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				didScroll,
				/**
				 * Touch target element
				 * @property {HTMLElement} target
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				target,
				/**
				 * Timer id of adding activeClass delay
				 * @property {number} addActiveClassTimerID
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				addActiveClassTimerID,
				/**
				 * Object with default options
				 * @property {Object} options
				 * Treshold after which didScroll will be set
				 * @property {number} [options.scrollThreshold=5]
				 * Time to wait before adding activeClass
				 * @property {number} [options.addActiveClassDelay=10]
				 * Time to stay activeClass after touch end
				 * @property {number} [options.keepActiveClassDelay=100]
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				options = {
					scrollThreshold: 5,
					addActiveClassDelay: 10,
					keepActiveClassDelay: 100
				},
				/**
				 * Class used to mark element as active
				 * @property {string} [activeClassLI="ui-li-active"] activeClassLI
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				activeClassLI = "ui-li-active",
				/**
				 * Function invoked after touch move ends
				 * @method removeTouchMove
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				removeTouchMove,
				/**
				 * Alias for class {@link ns.util.selectors}
				 * @property {Object} selectors
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors;


			/**
			 * Get closest highlightable element
			 * @method detectHighlightTarget
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @member ns.util.anchorHighlight
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
			 * @member ns.util.anchorHighlight
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
			 * @member ns.util.anchorHighlight
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
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function getActiveElements() {
				return document.getElementsByClassName(activeClassLI);
			}

			/**
			 * Remove active class from active elements
			 * @method removeActiveClass
			 * @member ns.util.anchorHighlight
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
			 * @member ns.util.anchorHighlight
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
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function touchstartHandler(event) {
				var touches = event.touches,
					touch = touches[0];

				if (touches.length === 1) {
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
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function touchendHandler(event) {
				if (event.touches.length === 0) {
					clearTimeout(addActiveClassTimerID);
					addActiveClassTimerID = null;
					if (!didScroll) {
						setTimeout(removeActiveClass, options.keepActiveClassDelay);
					}
					didScroll = false;
				}
			}

			/**
			 * Function invoked after visibilitychange event
			 * @method checkPageVisibility
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function checkPageVisibility() {
				if (document.visibilityState === "hidden") {
					removeActiveClass();
				}
			}

			/**
			 * Bind events to document
			 * @method enable
			 * @member ns.util.anchorHighlight
			 * @static
			 */
			function enable() {
				document.addEventListener("touchstart", touchstartHandler, false);
				document.addEventListener("touchend", touchendHandler, false);
				document.addEventListener("visibilitychange", checkPageVisibility, false);
				window.addEventListener("pagehide", removeActiveClass, false);
			}

			/**
			 * Unbinds events from document.
			 * @method disable
			 * @member ns.util.anchorHighlight
			 * @static
			 */
			function disable() {
				document.removeEventListener("touchstart", touchstartHandler, false);
				document.removeEventListener("touchend", touchendHandler, false);
				window.removeEventListener("pagehide", removeActiveClass, false);
			}

			enable();

			ns.util.anchorHighlight = {
				enable: enable,
				disable: disable
			};

			}(document, window, ns));

/*global window, define */
/*jslint plusplus: true */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Utility DOM
 * Utility object with function to DOM manipulation, CSS properties support
 * and DOM attributes support.
 *
 * # How to replace jQuery methods  by ns methods
 * ## append vs appendNodes
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
 *     ns.util.DOM.appendNodes(context, element);
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
 * ## replaceWith vs replaceWithNodes
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
 *     ns.util.DOM.replaceWithNodes(context, element);
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
 * ## before vs insertNodesBefore
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
 *     ns.util.DOM.insertNodesBefore(context, element);
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
 * ## wrapInner vs wrapInHTML
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
 *     ns.util.DOM.wrapInHTML(element, "<span class="new"></span>");
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
 * @class ns.util.DOM
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ns) {
	
				ns.util.DOM = ns.util.DOM || {};
			}(ns));

/*global window, define, NodeList, HTMLCollection */
/*jslint plusplus: true */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	
	
			/**
			 * @property {DocumentFragment} fragment
			 * @member ns.util.DOM
			 * @private
			 * @static
			 */
			/*
			 * @todo maybe can be moved to function scope?
			 */
			var fragment = document.createDocumentFragment(),
				/**
				 * @property {DocumentFragment} fragment2
				 * @member ns.util.DOM
				 * @private
				 * @static
				 */
				/*
				 * @todo maybe can be moved to function scope?
				 */
				fragment2 = document.createDocumentFragment(),
				/**
				 * @property {number} [containerCounter=0]
				 * @member ns.util.DOM
				 * @private
				 * @static
				 */
				/*
				 * @todo maybe can be moved to function scope?
				 */
				containerCounter = 0,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @member ns.util.DOM
				 * @private
				 * @static
				 */
				slice = [].slice,
				DOM = ns.util.DOM;

			/**
			 * Appends node or array-like node list array to context
			 * @method appendNodes
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 * @throws {string}
			 */
			DOM.appendNodes = function (context, elements) {
				var i,
					len;
				if (context) {
					if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
						elements = slice.call(elements);
						for (i = 0, len = elements.length; i < len; ++i) {
							context.appendChild(elements[i]);
						}
					} else {
						context.appendChild(elements);
					}
					return elements;
				}

				throw "Context empty!";
			};

			/**
			 * Replaces context with node or array-like node list
			 * @method replaceWithNodes
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 */
			DOM.replaceWithNodes = function (context, elements) {
				if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
					elements = this.insertNodesBefore(context, elements);
					context.parentNode.removeChild(context);
				} else {
					context.parentNode.replaceChild(elements, context);
				}
				return elements;
			};

			/**
			 * Remove all children
			 * @method removeAllChildren
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @static
			 */
			DOM.removeAllChildren = function (context) {
				context.innerHTML = "";
			};

			/**
			 * Inserts node or array-like node list before context
			 * @method insertNodesBefore
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 * @throws {string}
			 */
			DOM.insertNodesBefore = function (context, elements) {
				var i,
					len,
					parent;
				if (context) {
					parent = context.parentNode;
					if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
						elements = slice.call(elements);
						for (i = 0, len = elements.length; i < len; ++i) {
							parent.insertBefore(elements[i], context);
						}
					} else {
						parent.insertBefore(elements, context);
					}
					return elements;
				}

				throw "Context empty!";

			};

			/**
			 * Inserts node after context
			 * @method insertNodeAfter
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @static
			 * @throws {string}
			 */
			DOM.insertNodeAfter = function (context, element) {
				if (context) {
					context.parentNode.insertBefore(element, context.nextSibling);
					return element;
				}
				throw "Context empty!";
			};

			/**
			 * Wraps element or array-like node list in html markup
			 * @method wrapInHTML
			 * @param {HTMLElement|NodeList|HTMLCollection|Array} elements
			 * @param {string} html
			 * @return {HTMLElement|NodeList|Array} wrapped element
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.wrapInHTML = function (elements, html) {
				var container = document.createElement("div"),
					contentFlag = false,
					elementsLen = elements.length,
					//if elements is nodeList, retrieve parentNode of first node
					originalParentNode = elementsLen ? elements[0].parentNode : elements.parentNode,
					next = elementsLen ? elements[elementsLen - 1].nextSibling : elements.nextSibling,
					innerContainer;

				fragment.appendChild(container);
				html = html.replace(/(\$\{content\})/gi, function () {
					contentFlag = true;
					return "<span id='temp-container-" + (++containerCounter) + "'></span>";
				});
				container.innerHTML = html;

				if (contentFlag === true) {
					innerContainer = container.querySelector("span#temp-container-" + containerCounter);
					elements = this.replaceWithNodes(innerContainer, elements);
				} else {
					innerContainer = container.children[0];
					elements = this.appendNodes(innerContainer || container, elements);
				}

				// move the nodes
				while (fragment.firstChild.firstChild) {
					fragment2.appendChild(fragment.firstChild.firstChild);
				}

				// clean up
				while (fragment.firstChild) {
					fragment.removeChild(fragment.firstChild);
				}

				if (originalParentNode) {
					if (next) {
						originalParentNode.insertBefore(fragment2, next);
					} else {
						originalParentNode.appendChild(fragment2);
					}
				} else {
					// clean up
					while (fragment2.firstChild) {
						fragment2.removeChild(fragment2.firstChild);
					}
				}
				return elements;
			};
			}(window, window.document, ns));

/*global CustomEvent, define, window, ns */
/*jslint plusplus: true, nomen: true, bitwise: true */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Virtual Mouse Events
 * Reimplementation of jQuery Mobile virtual mouse events.
 *
 * ##Purpose
 * It will let for users to register callbacks to the standard events like bellow,
 * without knowing if device support touch or mouse events
 * @class ns.event.vmouse
 */
/**
 * Triggered after mouse-down or touch-started.
 * @event vmousedown
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-click or touch-end when touch-move didn't occur
 * @event vclick
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-up or touch-end
 * @event vmouseup
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-move or touch-move
 * @event vmousemove
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-over or touch-start if went over coordinates
 * @event vmouseover
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-out or touch-end
 * @event vmouseout
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-cancel or touch-cancel and when scroll occur during touchmove
 * @event vmousecancel
 * @member ns.event.vmouse
 */
(function (window, document, ns) {
	
					/**
				 * Object with default options
				 * @property {Object} vmouse
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
			var vmouse,
				/**
				 * @property {Object} eventProps Contains the properties which are copied from the original event to custom v-events
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				eventProps,
				/**
				 * Indicates if the browser support touch events
				 * @property {boolean} touchSupport
				 * @member ns.event.vmouse
				 * @static
				 **/
				touchSupport = window.hasOwnProperty("ontouchstart"),
				/**
				 * @property {boolean} didScroll The flag tell us if the scroll event was triggered
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				didScroll,
				/**
				 * @property {Number} [startX=0] Initial data for touchstart event
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				startX = 0,
				/**
				 * @property {Number} [startY=0] Initial data for touchstart event
				 * @member ns.event.vmouse
				 * @private
				 * @static
				**/
				startY = 0,
				touchEventProps = ["clientX", "clientY", "pageX", "pageY", "screenX", "screenY"],
				KEY_CODES = {
					enter: 13
				};

			/**
			 * Extends objects with other objects
			 * @method copyProps
			 * @param {Object} from Sets the original event
			 * @param {Object} to Sets the new event
			 * @param {Object} properties Sets the special properties for position
			 * @param {Object} propertiesNames Describe parameters which will be copied from Original to To event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function copyProps(from, to, properties, propertiesNames) {
				var i,
					length,
					descriptor,
					property;

				for (i = 0, length = propertiesNames.length; i < length; ++i) {
					property = propertiesNames[i];
					if (isNaN(properties[property]) === false || isNaN(from[property]) === false) {
						descriptor = Object.getOwnPropertyDescriptor(to, property);
						if (!descriptor || descriptor.writable) {
							to[property] = properties[property] || from[property];
						}
					}
				}
			}

			/**
			 * Create custom event
			 * @method createEvent
			 * @param {string} newType gives a name for the new Type of event
			 * @param {Event} original Event which trigger the new event
			 * @param {Object} properties Sets the special properties for position
			 * @return {Event}
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function createEvent(newType, original, properties) {
				var evt = new CustomEvent(newType, {
						"bubbles": original.bubbles,
						"cancelable": original.cancelable,
						"detail": original.detail
					}),
					orginalType = original.type,
					changeTouches,
					touch,
					j = 0,
					len,
					prop;

				copyProps(original, evt, properties, eventProps);
				evt._originalEvent = original;

				if (orginalType.indexOf("touch") !== -1) {
					orginalType = original.touches;
					changeTouches = original.changedTouches;

					if (orginalType && orginalType.length) {
						touch = orginalType[0];
					} else {
						touch = (changeTouches && changeTouches.length) ? changeTouches[0] : null;
					}

					if (touch) {
						for (len = touchEventProps.length; j < len; j++) {
							prop = touchEventProps[j];
							evt[prop] = touch[prop];
						}
					}
				}

				return evt;
			}

			/**
			 * Dispatch Events
			 * @method fireEvent
			 * @param {string} eventName event name
			 * @param {Event} evt original event
			 * @param {Object} properties Sets the special properties for position
			 * @return {boolean}
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function fireEvent(eventName, evt, properties) {
				return evt.target.dispatchEvent(createEvent(eventName, evt, properties || {}));
			}

			eventProps = [
				"currentTarget",
				"detail",
				"button",
				"buttons",
				"clientX",
				"clientY",
				"offsetX",
				"offsetY",
				"pageX",
				"pageY",
				"screenX",
				"screenY",
				"toElement",
				"which"
			];

			vmouse = {
				/**
				 * Sets the distance of pixels after which the scroll event will be successful
				 * @property {number} [eventDistanceThreshold=10]
				 * @member ns.event.vmouse
				 * @static
				 */
				eventDistanceThreshold: 10,

				touchSupport: touchSupport
			};

			/**
			 * Handle click down
			 * @method handleDown
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleDown(evt) {
				fireEvent("vmousedown", evt);
			}

			/**
			 * Prepare position of event for keyboard events.
			 * @method preparePositionForClick
			 * @param {Event} event
			 * @return {?Object} options
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function preparePositionForClick(event) {
				var x = event.clientX,
					y = event.clientY;
				// event comes from keyboard
				if (!x && !y) {
					return preparePositionForEvent(event);
				}
			}

			/**
			 * Handle click
			 * @method handleClick
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleClick(evt) {
				fireEvent("vclick", evt, preparePositionForClick(evt));
			}

			/**
			 * Handle click up
			 * @method handleUp
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleUp(evt) {
				fireEvent("vmouseup", evt);
			}

			/**
			 * Handle click move
			 * @method handleMove
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleMove(evt) {
				fireEvent("vmousemove", evt);
			}

			/**
			 * Handle click over
			 * @method handleOver
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleOver(evt) {
				fireEvent("vmouseover", evt);
			}

			/**
			 * Handle click out
			 * @method handleOut
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleOut(evt) {
				fireEvent("vmouseout", evt);
			}

			/**
			 * Handle touch start
			 * @method handleTouchStart
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchStart(evt) {
				var touches = evt.touches,
					firstTouch;
				//if touches are registered and we have only one touch
				if (touches && touches.length === 1) {
					didScroll = false;
					firstTouch = touches[0];
					startX = firstTouch.pageX;
					startY = firstTouch.pageY;
					fireEvent("vmouseover", evt);
					fireEvent("vmousedown", evt);
				}

			}

			/**
			 * Handle touch end
			 * @method handleTouchEnd
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchEnd(evt) {
				var touches = evt.touches;
				if (touches && touches.length === 0) {
					fireEvent("vmouseup", evt);
					fireEvent("vmouseout", evt);
				}
			}

			/**
			 * Handle touch move
			 * @method handleTouchMove
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchMove(evt) {
				var over,
					firstTouch = evt.touches && evt.touches[0],
					didCancel = didScroll,
					//sets the threshold, based on which we consider if it was the touch-move event
					moveThreshold = vmouse.eventDistanceThreshold;

				/**
				 * Ignore the touch which has identifier other than 0.
				 * Only first touch has control others are ignored.
				 * Patch for webkit behaviour where touchmove event
				 * is triggered between touchend events
				 * if there is multi touch.
				 */
				if (firstTouch.identifier > 0) {
					evt.preventDefault();
					evt.stopPropagation();
					return;
				}

				didScroll = didScroll ||
				//check in both axes X,Y if the touch-move event occur
					(Math.abs(firstTouch.pageX - startX) > moveThreshold ||
					Math.abs(firstTouch.pageY - startY) > moveThreshold);

				// detect over event
				// for compatibility with mouseover because "touchenter" fires only once
				over = document.elementFromPoint(evt.pageX, evt.pageY);
				if (over) {
					fireEvent("_touchover", evt);
				}

				//if didscroll occur and wasn't canceled then trigger touchend otherwise just touchmove
				if (didScroll && !didCancel) {
					fireEvent("vmousecancel", evt);
				}
				fireEvent("vmousemove", evt);
			}

			/**
			 * Handle Scroll
			 * @method handleScroll
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleScroll(evt) {
				if (!didScroll) {
					fireEvent("vmousecancel", evt);
				}
				didScroll = true;
			}

			/**
			 * Handle touch cancel
			 * @method handleTouchCancel
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchCancel(evt) {
				fireEvent("vmousecancel", evt);
			}

			/**
			 * Handle touch cancel
			 * @method handleTouchOver
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchOver() {
				return false;
				// @TODO add callback with handleTouchOver,
			}

			/**
			 * Prepare position of event for keyboard events.
			 * @method preparePositionForEvent
			 * @param {Event} event
			 * @return {Object} properties
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function preparePositionForEvent(event) {
				var targetRect = event.target && event.target.getBoundingClientRect(),
					properties = {};
				if (targetRect) {
					properties = {
						"clientX": targetRect.left + targetRect.width / 2,
						"clientY": targetRect.top + targetRect.height / 2,
						"which": 1
					};
				}
				return properties;
			}

			/**
			 * Handle key up
			 * @method handleKeyUp
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleKeyUp(event) {
				var properties;
				if (event.keyCode === KEY_CODES.enter) {
					properties = preparePositionForEvent(event);
					fireEvent("vmouseup", event, properties);
					fireEvent("vclick", event, properties);
				}
			}

			/**
			 * Handle key down
			 * @method handleKeyDown
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleKeyDown(event) {
				if (event.keyCode === KEY_CODES.enter) {
					fireEvent("vmousedown", event, preparePositionForEvent(event));
				}
			}

			// @TODO delete touchSupport flag and attach touch and mouse listeners,
			// @TODO check if v-events are not duplicated if so then called only once

			/**
			 * Binds touch events to support virtual mouse.
			 * @method bindTouch
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.bindTouch = function () {
				document.addEventListener("touchstart", handleTouchStart, true);
				document.addEventListener("touchend", handleTouchEnd, true);
				document.addEventListener("touchmove", handleTouchMove, true);

				// @TODO add callback with handleTouchOver,
				document.addEventListener("touchenter", handleTouchOver, true);
				// for compatibility with mouseover because "touchenter" fires only once
				// @TODO add callback with handleTouchOver,
				document.addEventListener("_touchover", handleTouchOver, true);
				// document.addEventListener("touchleave", callbacks.out, true);
				document.addEventListener("touchcancel", handleTouchCancel, true);

				document.addEventListener("click", handleClick, true);
			};

			/**
			 * Binds mouse events to support virtual mouse.
			 * @method bindMouse
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.bindMouse = function () {
				document.addEventListener("mousedown", handleDown, true);

				document.addEventListener("mouseup", handleUp, true);
				document.addEventListener("mousemove", handleMove, true);
				document.addEventListener("mouseover", handleOver, true);
				document.addEventListener("mouseout", handleOut, true);

				document.addEventListener("keyup", handleKeyUp, true);
				document.addEventListener("keydown", handleKeyDown, true);
				document.addEventListener("scroll", handleScroll, true);
				document.addEventListener("click", handleClick, true);
			};

			ns.event.vmouse = vmouse;

			if (touchSupport) {
				vmouse.bindTouch();
			} else {
				vmouse.bindMouse();
			}

			}(window, window.document, ns));

/*global window, define */
/*jslint plusplus: true */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	
	

			var selectors = ns.util.selectors,
				DOM = ns.util.DOM,
				namespace = "namespace";

			/**
			 * Returns given attribute from element or the closest parent,
			 * which matches the selector.
			 * @method inheritAttr
			 * @member ns.util.DOM
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
			 * @member ns.util.DOM
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
				var namespace = ns.getConfig(namespace);
				return "data-" + (namespace ? namespace + "-" : "") + name;
			}

			/**
			 * This function sets value of attribute data-{namespace}-{name} for element.
			 * If the namespace is empty, the attribute data-{name} is used.
			 * @method setNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @param {string|number|boolean} value New value
			 * @member ns.util.DOM
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
			 * @member ns.util.DOM
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
			 * @member ns.util.DOM
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
			 * @member ns.util.DOM
			 */
			DOM.nsData = function (element, name, value) {
				// @TODO add support for object in value
				if (value === undefined) {
					return DOM.getNSData(element, name);
				} else {
					return DOM.setNSData(element, name, value);
				}
			};

			/**
			 * This function removes attribute data-{namespace}-{name} from element.
			 * If the namespace is empty, attribute data-{name} is used.
			 * @method removeNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.removeNSData = function (element, name) {
				element.removeAttribute(getDataName(name));
			};

			/**
			 * Returns object with all data-* attributes of element
			 * @method getData
			 * @param {HTMLElement} element Base element
			 * @member ns.util.DOM
			 * @return {Object}
			 * @static
			 */
			DOM.getData = function (element) {
				var dataPrefix = "data-",
					data = {},
					attrs = element.attributes,
					attr,
					nodeName,
					value,
					i,
					length = attrs.length;

				for (i = 0; i < length; i++) {
					attr = attrs.item(i);
					nodeName = attr.nodeName;
					if (nodeName.indexOf(dataPrefix) > -1) {
						value = attr.value;
						data[nodeName.replace(dataPrefix, "")] = value.toLowerCase() === "true" ? true : value.toLowerCase() === "false" ? false : value;
					}
				}

				return data;
			};

			/**
			 * Special function to remove attribute and property in the same time
			 * @method removeAttribute
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @member ns.util.DOM
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
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.setAttribute = function (element, name, value) {
				element[name] = value;
				element.setAttribute(name, value);
			};
			}(window, window.document, ns));

/*global window, define, XMLHttpRequest */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Load Utility
 * Object contains function to load external resources.
 * @class ns.util.load
 */
(function (document, ns) {
	
	
			/**
			 * Local alias for document HEAD element
			 * @property {HTMLHeadElement} head
			 * @static
			 * @private
			 * @member ns.util.load
			 */
			var head = document.head,
				/**
				 * Local alias for document styleSheets element
				 * @property {HTMLStyleElement} styleSheets
				 * @static
				 * @private
				 * @member ns.util.load
				 */
				styleSheets = document.styleSheets,
				/**
				 * Local alias for ns.util.DOM
				 * @property {Object} utilsDOM Alias for {@link ns.util.DOM}
				 * @member ns.util.load
				 * @static
				 * @private
				 */
				utilDOM = ns.util.DOM,
				getNSData = utilDOM.getNSData,
				setNSData = utilDOM.setNSData,
				load = ns.util.load || {},
				/**
				 * Regular expression for extracting path to the image
				 * @property {RegExp} IMAGE_PATH_REGEXP
				 * @static
				 * @private
				 * @member ns.util.load
				 */
				IMAGE_PATH_REGEXP = /url\((\.\/)?images/gm,
				/**
				 * Regular expression for extracting path to the css
				 * @property {RegExp} CSS_FILE_REGEXP
				 * @static
				 * @private
				 * @member ns.util.load
				 */
				CSS_FILE_REGEXP = /[^/]+\.css$/;

			/**
			 * Load file
			 * (synchronous loading)
			 * @method loadFileSync
			 * @param {string} scriptPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @private
			 * @member ns.util.load
			 */
			 function loadFileSync(scriptPath, successCB, errorCB) {
				var xhrObj = new XMLHttpRequest();

				// open and send a synchronous request
				xhrObj.open('GET', scriptPath, false);
				xhrObj.send();
				// add the returned content to a newly created script tag
				if (xhrObj.status === 200 || xhrObj.status === 0) {
					if (typeof successCB === 'function') {
						successCB(xhrObj, xhrObj.status);
					}
				} else {
					if (typeof errorCB === 'function') {
						errorCB(xhrObj, xhrObj.status, new Error(xhrObj.statusText));
					}
				}
			}

			/**
			 * Callback function on javascript load success
			 * @method scriptSyncSuccess
			 * @private
			 * @static
			 * @param {?Function} successCB
			 * @param {?Function} xhrObj
			 * @param {?string} status
			 * @member ns.util.load
			 */
			function scriptSyncSuccess(successCB, xhrObj, status) {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.text = xhrObj.responseText;
				document.body.appendChild(script);
				if (typeof successCB === 'function') {
					successCB(xhrObj, status);
				}
			}


			/**
			 * Add script to document
			 * (synchronous loading)
			 * @method scriptSync
			 * @param {string} scriptPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @member ns.util.load
			 */
			function scriptSync(scriptPath, successCB, errorCB) {
				loadFileSync(scriptPath, scriptSyncSuccess.bind(null, successCB), errorCB);
			}

			/**
			 * Callback function on css load success
			 * @method cssSyncSuccess
			 * @param {string} cssPath
			 * @param {?Function} successCB
			 * @param {?Function} xhrObj
			 * @member ns.util.load
			 * @static
			 * @private
			 */
			function cssSyncSuccess(cssPath, successCB, xhrObj) {
				var css = document.createElement('style');
				css.type = 'text/css';
				css.textContent = xhrObj.responseText.replace(
					IMAGE_PATH_REGEXP,
					'url(' + cssPath.replace(CSS_FILE_REGEXP, 'images')
				);
				if (typeof successCB === 'function') {
					successCB(css);
				}
			}

			/**
			 * Add css to document
			 * (synchronous loading)
			 * @method cssSync
			 * @param {string} cssPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @private
			 * @member ns.util.load
			 */
			function cssSync(cssPath, successCB, errorCB) {
				loadFileSync(cssPath, cssSyncSuccess.bind(null, cssPath, successCB), errorCB);
			}

			/**
			 * Add element to head tag
			 * @method addElementToHead
			 * @param {HTMLElement} element
			 * @param {boolean} [asFirstChildElement=false]
			 * @member ns.util.load
			 * @static
			 */
			function addElementToHead(element, asFirstChildElement) {
				var firstElement;
				if (head) {
					if (asFirstChildElement) {
						firstElement = head.firstElementChild;
						if (firstElement) {
							head.insertBefore(element, firstElement);
							return;
						}
					}
					head.appendChild(element);
				}
			}

			/**
			 * Create HTML link element with href
			 * @method makeLink
			 * @param {string} href
			 * @returns {HTMLLinkElement}
			 * @member ns.util.load
			 * @static
			 */
			function makeLink(href) {
				var cssLink = document.createElement('link');
				cssLink.setAttribute('rel', 'stylesheet');
				cssLink.setAttribute('href', href);
				cssLink.setAttribute('name', 'tizen-theme');
				return cssLink;
			}

			/**
			 * Adds the given node to document head or replaces given 'replaceElement'.
			 * Additionally adds 'name' and 'theme-name' attribute
			 * @param {HTMLElement} node Element to be placed as theme link
			 * @param {string} themeName Theme name passed to the element
			 * @param {HTMLElement} [replaceElement=null] If replaceElement is given it gets replaced by node
			 */
			function addNodeAsTheme(node, themeName, replaceElement) {
				setNSData(node, 'name', 'tizen-theme');
				setNSData(node, 'theme-name', themeName);

				if (replaceElement) {
					replaceElement.parentNode.replaceChild(node, replaceElement);
				} else {
					addElementToHead(node, true);
				}
			}

			/**
			 * Add css link element to head if not exists
			 * @method themeCSS
			 * @param {string} path
			 * @param {string} themeName
			 * @param {boolean} [embed=false] Embeds the CSS content to the document
			 * @member ns.util.load
			 * @static
			 */
			function themeCSS(path, themeName, embed) {
				var i,
					styleSheetsLength = styleSheets.length,
					ownerNode,
					previousElement = null,
					linkElement;
				// Find css link or style elements
				for (i = 0; i < styleSheetsLength; i++) {
					ownerNode = styleSheets[i].ownerNode;

					// We try to find a style / link node that matches current style or is linked to
					// the proper theme. We cannot use ownerNode.href because this returns the absolute path
					if (getNSData(ownerNode, 'name') === 'tizen-theme' || ownerNode.getAttribute("href") === path) {
						if (getNSData(ownerNode, 'theme-name') === themeName) {
							// Nothing to change
							return;
						}
						previousElement = ownerNode;
						break;
					}
				}

				if (embed){
					// Load and replace old styles or append new styles
					cssSync(path, function onSuccess(styleElement) {
						addNodeAsTheme(styleElement, themeName, previousElement);
					}, function onFailure(xhrObj, xhrStatus, errorObj) {
						ns.warn("There was a problem when loading '" + themeName + "', status: " + xhrStatus);
					});
				} else {
					linkElement = makeLink(path);
					addNodeAsTheme(linkElement, themeName, previousElement);
				}
			}

			/**
			 * In debug mode add time to url to disable cache
			 * @property {string} cacheBust
			 * @member ns.util.load
			 * @static
			 */
			load.cacheBust = (document.location.href.match(/debug=true/)) ? '?cacheBust=' + (new Date()).getTime() : '';
			// the binding a local methods with the namespace
			load.scriptSync = scriptSync;
			load.addElementToHead = addElementToHead;
			load.makeLink = makeLink;
			load.themeCSS = themeCSS;

			ns.util.load = load;
			}(window.document, ns));

/*global window, define, Math, ns*/
/*jslint bitwise: true */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Theme object
 * Class with functions to set theme of application.
 * @class ns.theme
 */
(function (window, document, ns) {
	
			/**
			 * Local alias for document HEAD element
			 * @property {HTMLHeadElement} head
			 * @static
			 * @private
			 * @member ns.theme
			 */
			var head = document.head,
				documentElement = document.documentElement,
				frameworkData = ns.frameworkData,
				util = ns.util,
				DOM = util.DOM,
				load = util.load,
				support = ns.support,

				stopEvent = function (event) {
					var element = event.target,
						tag = element.tagName.toLowerCase(),
						type = element.type;
					if ((tag !== "input" ||
							(type !== "text" && type !== "email" && type !== "url" && type !== "search" && type !== "tel")) &&
							tag !== "textarea") {
						event.stopPropagation();
						event.preventDefault();
					}
				},

				THEME_JS_FILE_NAME = "theme.js",
				THEME_CSS_FILE_NAME = "tau",

				themeRegex =  /ui-(bar|body|overlay)-([a-z])\b/,
				deviceWidthRegex = /.*width=(device-width|\d+)\s*,?.*$/gi;

			ns.theme = {
				/**
				 * Standard theme
				 * @property {string} theme="s"
				 * @member ns.theme
				 */
				theme: "s",

				_activeTheme: null,

				/**
				 * This function inits theme.
				 * @method init
				 * @param {HTMLElement} container
				 * @member ns.theme
				 */
				init: function (container) {
					var self = this,
						containerClassList = container.classList;

					frameworkData.getParams();

					if (support.gradeA()) {
						documentElement.classList.add("ui-mobile");
						containerClassList.add("ui-mobile-viewport");
					}

					self.loadTheme(frameworkData.theme);
				},

				/**
				 * This function scales font size.
				 * @method scaleBaseFontSize
				 * @param {number} themeDefaultFontSize Default font size
				 * @param {number} ratio Scaling ration
				 * @member ns.theme
				 */
				scaleBaseFontSize : function (themeDefaultFontSize, ratio) {
					var scaledFontSize = Math.max(themeDefaultFontSize * ratio | 0, 4);
					documentElement.style.fontSize = scaledFontSize + "px";
					document.body.style.fontSize = scaledFontSize + "px";
				},

				/**
				 * This function searches theme, which is inherited
				 * from parents by element.
				 * @method getInheritedTheme
				 * @param {HTMLElement} element Element for which theme is looking for.
				 * @param {string} defaultTheme Default theme.
				 * It is used if no theme, which can be inherited, is found.
				 * @return {string} Inherited theme
				 * @member ns.theme
				 */
				getInheritedTheme: function (element, defaultTheme) {
					var theme,
						parentElement = element.parentNode,
						parentClasses,
						parentTheme;

					theme = DOM.getNSData(element, "theme");

					if (!theme) {
						while (parentElement) {
							parentClasses = parentElement.className || "";
							parentTheme = themeRegex.exec(parentClasses);
							if (parentClasses && parentTheme && parentTheme.length > 2) {
								theme = parentTheme[2];
								break;
							}
							parentElement = parentElement.parentNode;
						}
					}
					return theme || defaultTheme;
				},

				/**
				 * This function sets selection behavior for the element.
				 * @method enableSelection
				 * @param {HTMLElement} element Element for which selection behavior is set.
				 * @param {"text"|"auto"|"none"} value="auto" Selection behavior.
				 * @return {HTMLElement} Element with set styles.
				 * @member ns.theme
				 */
				enableSelection: function (element, value) {
					var val,
						elementStyle;

					switch (value) {
					case "text":
					case "auto":
					case "none":
						val = value;
						break;
					default:
						val = "auto";
						break;
					}

					if (element === document) {
						element = document.body;
					}

					elementStyle = element.style;
					elementStyle.MozUserSelect = elementStyle.webkitUserSelect = elementStyle.userSelect = val;

					return element;
				},

				/**
				 * This function disables event "contextmenu".
				 * @method disableContextMenu
				 * @param {HTMLElement} element Element for which event "contextmenu"
				 * is disabled.
				 * @member ns.theme
				 */
				disableContextMenu: function (element) {
					element.addEventListener("contextmenu", stopEvent, true);
				},

				/**
				 * This function enables event "contextmenu".
				 * @method enableContextMenu
				 * @param {HTMLElement} element Element for which event "contextmenu"
				 * is enabled.
				 * @member ns.theme
				 */
				enableContextMenu: function (element) {
					element.removeEventListener("contextmenu", stopEvent, true);
				},

				/**
				 * This function loads files with proper theme.
				 * @method loadTheme
				 * @param {string} theme Choosen theme.
				 * @member ns.theme
				 */
				loadTheme: function(theme) {
					var self = this,
						themePath = frameworkData.themePath,
						themeName = THEME_CSS_FILE_NAME,
						cssPath,
						isMinified = frameworkData.minified,
						jsPath;

					// If the theme has been loaded do not repeat that process
					if (frameworkData.themeLoaded) {
												return;
					}

					if (frameworkData.frameworkName !== "tau") {
						themeName = "tizen-web-ui-fw-theme";
					}
					if (isMinified) {
						cssPath = themePath + "/" + themeName + ".min.css";
					} else {
						cssPath = themePath + "/" + themeName + ".css";
					}

					
					load.themeCSS(cssPath, theme);
					jsPath = themePath + "/" + THEME_JS_FILE_NAME;
										load.scriptSync(jsPath);

					if (support.gradeA()) {
						self.setScaling();
					}

					frameworkData.themeLoaded = true;
				},

				/**
				 * This function sets viewport.
				 * If custom viewport is found, its width will be returned.
				 * Otherwise, the new viewport will be created.
				 * @method setViewport
				 * @param {number|string} viewportWidth Width of the new viewport.
				 * If no viewport is found, the new viewport with this
				 * width is created.
				 * @return {string} Width of custom viewport.
				 * @member ns.theme
				 */
				setViewport: function(viewportWidth) {
					var metaViewport = document.querySelector("meta[name=viewport]"),
						content;

					if (metaViewport) {
						// Found custom viewport!
						content = metaViewport.getAttribute("content");
						viewportWidth = content.replace(deviceWidthRegex, "$1");
					} else {
						// Create a meta tag
						metaViewport = document.createElement("meta");
						metaViewport.name = "viewport";
						content = "width=" + viewportWidth + ", user-scalable=no";
						metaViewport.content = content;
						head.insertBefore(metaViewport, head.firstChild);
					}
					return viewportWidth;
				},

				/**
				 * This function checks if application is run
				 * in the mobile browser.
				 * @method isMobileBrowser
				 * @return {boolean} Returns true, if application
				 * is run in mobile browser. Otherwise, false is returned.
				 * @member ns.theme
				 */
				isMobileBrowser: function() {
					return window.navigator.appVersion.indexOf("Mobile") > -1;
				},

				/**
				 * This function sets scaling of viewport.
				 * @method setScaling
				 * @member ns.theme
				 */
				setScaling: function () {
					var self = this,
						viewportWidth = frameworkData.viewportWidth,
						themeDefaultFontSize = frameworkData.defaultFontSize, // comes from theme.js
						ratio = 1;

					// Keep original font size
					document.body.setAttribute("data-tizen-theme-default-font-size", themeDefaultFontSize);

					if (ns.theme.isMobileBrowser()) {
						// Legacy support: tizen.frameworkData.viewportScale
						if (frameworkData.viewportScale === true) {
							viewportWidth = "screen-width";
						}

						// screen-width support
						if ("screen-width" === viewportWidth) {
							if (window.self === window.top) {
								// Top frame: for target. Use window.outerWidth.
								viewportWidth = window.outerWidth;
							} else {
								// iframe: for web simulator. Use clientWidth.
								viewportWidth = document.documentElement.clientWidth;
							}
						}

						// set viewport meta tag
						// If custom viewport setting exists, get viewport width
						viewportWidth = self.setViewport(viewportWidth);

						if (viewportWidth !== "device-width") {
							ratio = parseFloat(viewportWidth / ns.frameworkData.defaultViewportWidth);
							self.scaleBaseFontSize(themeDefaultFontSize, ratio);
						}
					}
				}
			};

			document.addEventListener("themeinit", function (evt) {
				var router = evt.detail;
				if (router && ns.getConfig("autoInitializePage", true)) {
					ns.theme.init(router.getContainer());
				}
			}, false);

			}(window, window.document, ns));

/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Namespace For Widgets
 * Namespace For Widgets
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @class ns.widget
 */
(function (document, ns) {
	
				var engine = ns.engine,
				widget = {
					/**
					 * Get bound widget for element
					 * @method getInstance
					 * @static
					 * @param {HTMLElement|string} element
					 * @param {string} type widget name
					 * @return {?Object}
					 * @member ns.widget
					 */
					getInstance: engine.getBinding,
					/**
					 * Returns Get all bound widget for element or id gives as parameter
					 * @method getAllInstances
					 * @param {HTMLElement|string} element
					 * @return {?Object}
					 * @static
					 * @member ns.widget
					 */
					getAllInstances: engine.getAllBindings
				};

			document.addEventListener(engine.eventType.WIDGET_DEFINED, function (evt) {
				var definition = evt.detail,
					name = definition.name;

				 ns.widget[name] = function (element, options) {
					 return engine.instanceWidget(element, name, options);
				 };

			}, true);

			/** @namespace ns.widget */
			ns.widget = widget;
			}(window.document, ns));

/*global window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Mobile Widget Reference
 *
 * The Tizen Web UI service provides rich Tizen widgets that are optimized for the Tizen Web browser. You can use the widgets for:
 *
 * - CSS animation
 * - Rendering
 *
 * The following table displays the widgets provided by the Tizen Web UI service.
 *
 * @class ns.widget.mobile
 * @seeMore https://developer.tizen.org/dev-guide/2.2.1/org.tizen.web.uiwidget.apireference/html/web_ui_framework.htm "Web UI Framework Reference"
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	
				ns.widget.mobile = ns.widget.mobile || {};
			}(window, ns));

/*global window, define */
/*jslint nomen: true */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/*
 */
/**
 * #BaseWidget
 * Prototype class of widget
 *
 * ## How to invoke creation of widget from JavaScript
 *
 * To build and initialize widget in JavaScript you have to use method {@link ns.engine#instanceWidget} . First argument for method
 * is HTMLElement, which specifies the element of widget. Second parameter is name of widget to create.
 *
 * If you load jQuery before initializing tau library, you can use standard jQuery UI Widget notation.
 *
 * ### Examples
 * #### Build widget from JavaScript
 *
 *		@example
 *		var element = document.getElementById("id"),
 *			ns.engine.instanceWidget(element, "Button");
 *
 * #### Build widget from jQuery
 *
 *		@example
 *		var element = $("#id").button();
 *
 * ## How to create new widget
 *
 *		@example
 *		(function (ns) {
 *			
 *			 *					var BaseWidget = ns.widget.BaseWidget, // create alias to main objects
 *						...
 *						arrayOfElements, // example of private property, common for all instances of widget
 *						Button = function () { // create local object with widget
 *							...
 *						},
 *						prototype = new BaseWidget(); // add ns.widget.BaseWidget as prototype to widget's object, for better minification this should be assign to local variable and next variable should be assign to prototype of object
 *
 *					function closestEnabledButton(element) { // example of private method
 *						...
 *					}
 *					...
 *
 *					prototype.options = { //add default options to be read from data- attributes
 *						theme: "s",
 *						...
 *					};
 *
 *					prototype._build = function (template, element) { // method called when the widget is being built, should contain all HTML manipulation actions
 *						...
 *						return element;
 *					};
 *
 *					prototype._init = function (element) { // method called during initialization of widget, should contain all actions necessary fastOn application start
 *						...
 *						return element;
 *					};
 *
 *					prototype._bindEvents = function (element) { // method to bind all events, should contain all event bindings
 *						...
 *					};
 *
 *					prototype._enable = function (element) { // method called during invocation of enable() method
 *						...
 *					};
 *
 *					prototype._disable = function (element) { // method called during invocation of disable() method
 *						...
 *					};
 *
 *					prototype.refresh = function (element) { // example of public method
 *						...
 *					};
 *
 *					prototype._refresh = function () { // example of protected method
 *						...
 *					};
 *
 *					Button.prototype = prototype;
 *
 *					engine.defineWidget( // define widget
 *						"Button", //name of widget
 *						"[data-role='button'],button,[type='button'],[type='submit'],[type='reset']",  //widget's selector
 *						[ // public methods, here should be list all public method, without that method will not be available
 *							"enable",
 *							"disable",
 *							"refresh"
 *						],
 *						Button, // widget's object
 *						"mobile" // widget's namespace
 *					);
 *					ns.widget.Button = Button;
 *					 *		}(ns));
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @class ns.widget.BaseWidget
 */
(function (document, ns, undefined) {
	
				/**
			 * Alias to Array.slice function
			 * @method slice
			 * @member ns.widget.BaseWidget
			 * @private
			 * @static
			 */
			var slice = [].slice,
				/**
				 * Alias to ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.BaseWidget
				 * @private
				 * @static
				 */
				engine = ns.engine,
				engineDataTau = engine.dataTau,
				util = ns.util,
				/**
				 * Alias to {@link ns.event}
				 * @property {Object} eventUtils
				 * @member ns.widget.BaseWidget
				 * @private
				 * @static
				 */
				eventUtils = ns.event,
				/**
				 * Alias to {@link ns.util.DOM}
				 * @property {Object} domUtils
				 * @private
				 * @static
				 */
				domUtils = util.DOM,
				/**
				 * Alias to {@link ns.util.object}
				 * @property {Object} objectUtils
				 * @private
				 * @static
				 */
				objectUtils = util.object,
				BaseWidget = function () {
					return this;
				},
				prototype = {},
				/**
				 * Property with string represent function type 
				 * (for better minification)
				 * @property {string} [TYPE_FUNCTION="function"]
				 * @private
				 * @static
				 * @readonly
				 */
				TYPE_FUNCTION = "function";

			/**
			 * Protected method configuring the widget
			 * @method _configure
			 * @member ns.widget.BaseWidget
			 * @protected
			 * @template
			 * @internal
			 */
			/**
			 * Configures widget object from definition.
			 *
			 * It calls such methods as #\_getCreateOptions and #\_configure.
			 * @method configure
			 * @param {Object} definition
			 * @param {string} definition.name Name of the widget
			 * @param {string} definition.selector Selector of the widget
			 * @param {HTMLElement} element Element of widget
			 * @param {Object} options Configure options
			 * @member ns.widget.BaseWidget
			 * @chainable
			 * @internal
			 */
			prototype.configure = function (definition, element, options) {
				var self = this,
					definitionName,
					definitionNamespace;
				/**
				 * Object with options for widget
				 * @property {Object} [options={}]
				 * @member ns.widget.BaseWidget
				 */
				self.options = self.options || {};
				/**
				 * Base element of widget
				 * @property {?HTMLElement} [element=null]
				 * @member ns.widget.BaseWidget
				 */
				self.element = self.element || null;
				if (definition) {
					definitionName = definition.name;
					definitionNamespace = definition.namespace;
					/**
					 * Name of the widget
					 * @property {string} name
					 * @member ns.widget.BaseWidget
					 */
					self.name = definitionName;

					/**
					 * Name of the widget (in lower case)
					 * @property {string} widgetName
					 * @member ns.widget.BaseWidget
					 */
					self.widgetName = definitionName;

					/**
					 * Namespace of widget events
					 * @property {string} widgetEventPrefix
					 * @member ns.widget.BaseWidget
					 */
					self.widgetEventPrefix = definitionName.toLowerCase();

					/**
					 * Namespace of the widget
					 * @property {string} namespace 
					 * @member ns.widget.BaseWidget
					 */
					self.namespace = definitionNamespace;

					/**
					 * Full name of the widget
					 * @property {string} widgetFullName
					 * @member ns.widget.BaseWidget
					 */
					self.widgetFullName = ((definitionNamespace ? definitionNamespace + "-" : "") + definitionName).toLowerCase();
					/**
					 * Id of widget instance
					 * @property {string} id
					 * @member ns.widget.BaseWidget
					 */
					self.id = ns.getUniqueId();

					/**
					 * Widget's selector
					 * @property {string} selector
					 * @member ns.widget.BaseWidget
					 */
					self.selector = definition.selector;
				}

				if (typeof self._configure === TYPE_FUNCTION) {
					self._configure(element);
				}

				self._getCreateOptions(element);

				objectUtils.fastMerge(self.options, options);
			};

			/**
			 * Reads data-* attributes and save to options object.
			 * @method _getCreateOptions
			 * @param {HTMLElement} element Base element of the widget
			 * @return {Object}
			 * @member ns.widget.BaseWidget
			 * @protected
			 */
			prototype._getCreateOptions = function (element) {
				var options = this.options,
					bigRegexp = /[A-Z]/g;
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
			 * @param {HTMLElement} element
			 * @return {HTMLElement} widget's element
			 * @member ns.widget.BaseWidget
			 * @protected
			 * @template
			 */
			/**
			 * Builds widget.
			 *
			 * It calls method #\_build.
			 *
			 * Before starting building process, the event beforecreate with
			 * proper prefix defined in variable widgetEventPrefix is triggered.
			 * @method build
			 * @param {HTMLElement} element Element of widget before building process
			 * @return {HTMLElement} Element of widget after building process
			 * @member ns.widget.BaseWidget
			 * @internal
			 */
			prototype.build = function (element) {
				var self = this,
					id,
					node,
					dataBuilt = element.getAttribute(engineDataTau.built),
					dataName = element.getAttribute(engineDataTau.name);

				eventUtils.trigger(element, self.widgetEventPrefix + "beforecreate");

				id = element.id;
				if (id) {
					self.id = id;
				} else {
					element.id = self.id;
				}

				if (typeof self._build === TYPE_FUNCTION) {
					node = self._build(element);
				} else {
					node = element;
				}

				// Append current widget name to data-tau-built and data-tau-name attributes
				dataBuilt = !dataBuilt ? self.name : dataBuilt + engineDataTau.separator + self.name;
				dataName = !dataName ? self.name : dataName + engineDataTau.separator + self.name;

				element.setAttribute(engineDataTau.built, dataBuilt);
				element.setAttribute(engineDataTau.name, dataName);

				return node;
			};

			/**
			 * Protected method initializing the widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Initializes widget.
			 *
			 * It calls method #\_init.
			 * @method init
			 * @param {HTMLElement} element Element of widget before initialization
			 * @member ns.widget.BaseWidget
			 * @chainable
			 * @internal
			 */
			prototype.init = function (element) {
				var self = this;
				self.id = element.id;

				if (typeof self._init === TYPE_FUNCTION) {
					self._init(element);
				}

				if (element.getAttribute("disabled") || self.options.disabled === true) {
					self.disable();
				} else {
					self.enable();
				}

				return self;
			};

			/**
			 * Bind widget events attached in init mode
			 * @method _bindEvents
			 * @param {HTMLElement} element Base element of widget
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Binds widget events.
			 *
			 * It calls such methods as #\_buildBindEvents and #\_bindEvents.
			 * At the end of binding process, the event "create" with proper
			 * prefix defined in variable widgetEventPrefix is triggered.
			 * @method bindEvents
			 * @param {HTMLElement} element Base element of the widget
			 * @param {boolean} onlyBuild Inform about the type of bindings: build/init
			 * @member ns.widget.BaseWidget
			 * @chainable
			 * @internal
			 */
			prototype.bindEvents = function (element, onlyBuild) {
				var self = this,
					dataBound = element.getAttribute(engineDataTau.bound);

				if (!onlyBuild) {
					dataBound = !dataBound ? self.name : dataBound + engineDataTau.separator + self.name;
					element.setAttribute(engineDataTau.bound, dataBound);
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
			 * @member ns.widget.BaseWidget
			 */
			/**
			 * Destroys widget.
			 *
			 * It calls method #\_destroy.
			 *
			 * At the end of destroying process, the event "destroy" with proper
			 * prefix defined in variable widgetEventPrefix is triggered and
			 * the binding set in engine is removed.
			 * @method destroy
			 * @param {HTMLElement} element Base element of the widget
			 * @member ns.widget.BaseWidget
			 */
			prototype.destroy = function (element) {
				var self = this;
				element = element || self.element;
				if (typeof self._destroy === TYPE_FUNCTION) {
					self._destroy(element);
				}
				if (self.element) {
					self.trigger(self.widgetEventPrefix + "destroy");
				}
				if (element) {
					engine.removeBinding(element, self.name);
				}
			};

			/**
			 * Protected method disabling the widget
			 * @method _disable
			 * @protected
			 * @member ns.widget.BaseWidget
			 * @template
			 */
			/**
			 * Disables widget.
			 *
			 * It calls method #\_disable.
			 * @method disable
			 * @member ns.widget.BaseWidget
			 * @chainable
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
			 * @member ns.widget.BaseWidget
			 * @template
			 */
			/**
			 * Enables widget.
			 *
			 * It calls method #\_enable.
			 * @method enable
			 * @member ns.widget.BaseWidget
			 * @chainable
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
			 * @member ns.widget.BaseWidget
			 * @template
			 */
			/**
			 * Refreshes widget.
			 *
			 * It calls method #\_refresh.
			 * @method refresh
			 * @member ns.widget.BaseWidget
			 * @chainable
			 */
			prototype.refresh = function () {
				var self = this;
				if (typeof self._refresh === TYPE_FUNCTION) {
					self._refresh.apply(self, arguments);
				}
				return self;
			};


			/**
			 * Gets or sets options of the widget.
			 *
			 * This method can work in many context.
			 *
			 * If first argument is type of object them, method set values for options given in object. Keys of object are names of options and values from object are values to set.
			 *
			 * If you give only one string argument then method return value for given option.
			 *
			 * If you give two arguments and first argument will be a string then second argument will be intemperate as value to set.
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} [value] value to set
			 * @member ns.widget.BaseWidget
			 * @return {*} return value of option or undefined if method is called in setter context
			 */
			prototype.option = function (/*name, value*/) {
				var self = this,
					args = slice.call(arguments),
					firstArgument = args.shift(),
					secondArgument = args.shift(),
					key,
					result,
					partResult,
					refresh = false;
				if (typeof firstArgument === "string") {
					result = self._oneOption(firstArgument, secondArgument);
					if (firstArgument !== undefined && secondArgument !== undefined) {
						refresh = result;
						result = undefined;
					}
				} else if (typeof firstArgument === "object") {
					for (key in firstArgument) {
						if (firstArgument.hasOwnProperty(key)) {
							partResult = self._oneOption(key, firstArgument[key]);
							if (key !== undefined && firstArgument[key] !== undefined) {
								refresh = refresh || partResult;
							}
						}
					}
				}
				if (refresh) {
					self.refresh();
				}
				return result;
			};

			/**
			 * Gets or sets one option of the widget.
			 *
			 * @method _oneOption
			 * @param {string} field
			 * @param {*} value
			 * @member ns.widget.BaseWidget
			 * @return {*}
			 * @protected
			 */
			prototype._oneOption = function (field, value) {
				var self = this,
					methodName,
					refresh = false;
				if (value === undefined) {
					methodName = "_get" + (field[0].toUpperCase() + field.slice(1));
					if (typeof self[methodName] === TYPE_FUNCTION) {
						return self[methodName]();
					}
					return self.options[field];
				}
				methodName = "_set" + (field[0].toUpperCase() + field.slice(1));
				if (typeof self[methodName] === TYPE_FUNCTION) {
					self[methodName](self.element, value);
				} else {
					self.options[field] = value;
					if (self.element) {
						self.element.setAttribute("data-" + (field.replace(/[A-Z]/g, function (c) {
							return "-" + c.toLowerCase();
						})), value);
						refresh = true;
					}
				}
				return refresh;
			};

			/**
			 * Returns true if widget has bounded events.
			 *
			 * This methods enables to check if the widget has bounded 
			 * events through the {@link ns.widget.BaseWidget#bindEvents} method.
			 * @method isBound
			 * @param {string} [type] Type of widget
			 * @member ns.widget.BaseWidget
			 * @internal
			 * @return {boolean} true if events are bounded
			 */
			prototype.isBound = function (type) {
				var element = this.element;
				type = type || this.name;
				return element && element.hasAttribute(engineDataTau.bound) && element.getAttribute(engineDataTau.bound).indexOf(type) > -1;
			};

			/**
			 * Returns true if widget is built.
			 *
			 * This methods enables to check if the widget was built 
			 * through the {@link ns.widget.BaseWidget#build} method.
			 * @method isBuilt
			 * @param {string} [type] Type of widget
			 * @member ns.widget.BaseWidget
			 * @internal
			 * @return {boolean} true if the widget was built
			 */
			prototype.isBuilt = function (type) {
				var element = this.element;
				type = type || this.name;
				return element && element.hasAttribute(engineDataTau.built) && element.getAttribute(engineDataTau.built).indexOf(type) > -1;
			};

			/**
			 * Protected method getting the value of widget
			 * @method _getValue
			 * @return {*}
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Protected method setting the value of widget
			 * @method _setValue
			 * @param {*} value
			 * @return {*}
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Gets or sets value of the widget.
			 *
			 * @method value
			 * @param {*} [value] New value of widget
			 * @member ns.widget.BaseWidget
			 * @return {*}
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
			 * Triggers an event on widget's element.
			 *
			 * @method trigger
			 * @param {string} eventName The name of event to trigger
			 * @param {?*} [data] additional Object to be carried with the event
			 * @param {boolean} [bubbles=true] Indicating whether the event
			 * bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] Indicating whether
			 * the event is cancelable
			 * @member ns.widget.BaseWidget
			 * @return {boolean} False, if any callback invoked preventDefault on event object
			 */
			prototype.trigger = function (eventName, data, bubbles, cancelable) {
				return eventUtils.trigger(this.element, eventName, data, bubbles, cancelable);
			};

			/**
			 * Adds event listener to widget's element.
			 * @method on
			 * @param {string} eventName The name of event
			 * @param {Function} listener Function called after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture Parameter of addEventListener
			 * @member ns.widget.BaseWidget
			 */
			prototype.on = function (eventName, listener, useCapture) {
				eventUtils.on(this.element, eventName, listener, useCapture);
			};

			/**
			 * Removes event listener from  widget's element.
			 * @method off
			 * @param {string} eventName The name of event
			 * @param {Function} listener Function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture Parameter of addEventListener
			 * @member ns.widget.BaseWidget
			 */
			prototype.off = function (eventName, listener, useCapture) {
				eventUtils.off(this.element, eventName, listener, useCapture);
			};

			BaseWidget.prototype = prototype;

			// definition
			ns.widget.BaseWidget = BaseWidget;

			}(window.document, ns));

/*global window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true */
/**
 * #BaseWidgetMobile
 * Extenstion of class BaseWidget for mobile profile.
 * This class has compability properties and methods with jQuery Mobile Widget.
 * @class ns.widget.mobile.BaseWidgetMobile
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	
	
			var BaseWidgetMobile = function () {
					this.options = {};
				},
				BaseWidget = ns.widget.BaseWidget,
				basePrototype = BaseWidget.prototype,
				parent_configure = basePrototype.configure,
				parent_disable = basePrototype.disable,
				parent_enable = basePrototype.enable,
				prototype = new BaseWidget(),
				disableClass = "ui-state-disabled",
				ariaDisabled = "aria-disabled",
				slice = [].slice;

			BaseWidgetMobile.classes = {
				disable: disableClass
			};

			/**
			 * Configures widget object from definition.
			 * @method configure
			 * @param {Object} definition
			 * @param {string} definition.name Name of widget
			 * @param {string} definition.selector Selector of widget
			 * @param {string} definition.binding Path to file with widget (without extension)
			 * @param {HTMLElement} element
			 * @param {Object} options Configure options
			 * @member ns.widget.mobile.BaseWidgetMobile
			 * @chainable
			 * @instance
			 */
			prototype.configure = function (definition, element, options) {
				var self = this,
					definitionName,
					widgetName;
				parent_configure.call(self, definition, element, options);
				if (definition) {
					definitionName = definition.name;
					widgetName = definitionName && definitionName.toLowerCase();
					/**
					 * @property {string} widgetName Widget base class
					 * @member ns.widget.mobile.BaseWidgetMobile
					 * @instance
					 */
					self.widgetName = widgetName;
					/**
					* @property {string} widgetBaseClass Widget base class
					* @member ns.widget.mobile.BaseWidgetMobile
					* @instance
					*/
					self.widgetBaseClass = self.namespace + '-' + widgetName;
					/**
					* @property {number} uuid Number id of widget instance
					* @member ns.widget.mobile.BaseWidgetMobile
					* @instance
					*/
					self.uuid = ns.getNumberUniqueId();

					/**
					 * @property {string} eventNamespace Namespace of widget events (suffix for events)
					 * @member ns.widget.mobile.BaseWidgetMobile
					 * @instance
					 */
					self.eventNamespace = '.' + widgetName + (self.uuid || '');

					/**
					 * @property {string} [defaultElement='<div>'] Default element for the widget
					 * @member ns.widget.mobile.BaseWidgetMobile
					 * @instance
					 */
					self.defaultElement = '<div>';
				}

				return this;
			};

			/**
			* Disables widget.
			* @method disable
			* @member ns.widget.mobile.BaseWidgetMobile
			* @instance
			*/
			prototype.disable = function () {
				var self = this,
					element = self.element,
					elementClasses = element.classList,
					args = slice.call(arguments);

				parent_disable.apply(self, args);
				elementClasses.add(self.widgetFullName + "-disabled");
				elementClasses.add(disableClass);
				element.setAttribute(ariaDisabled, true);
				// @TODO
				//this.hoverable.removeClass( "ui-state-hover" );
				//this.focusable.removeClass( "ui-state-focus" );
			};

			/**
			* Enables widget.
			* @method enable
			* @member ns.widget.mobile.BaseWidgetMobile
			* @instance
			*/
			prototype.enable = function () {
				var self = this,
					element = self.element,
					elementClasses = element.classList,
					args = slice.call(arguments);

				parent_enable.apply(self, args);
				elementClasses.remove(self.widgetFullName + "-disabled");
				elementClasses.remove(disableClass);
				element.setAttribute(ariaDisabled, false);
				// @TODO
				//this.hoverable.removeClass( "ui-state-hover" );
				//this.focusable.removeClass( "ui-state-focus" );
			};

			/**
			* Throws exception.
			* @method raise
			* @param {?string} msg Message of throw
			* @member ns.widget.mobile.BaseWidgetMobile
			* @instance
			*/
			prototype.raise = function (msg) {
				throw "Widget [" + this.widgetName + "]: " + msg;
			};

			/**
			 * Enhances all the children of all elements in the set of matched elements.
			 * @method enhanceWithin
			 * @member ns.widget.mobile.BaseWidgetMobile
			 * @instance
			 * @removed 2.3
			 */
			prototype.enhanceWithin = function () {
				ns.log('method enhanceWithin is deprecated');
			};

			/**
			 * Enhances all the children of all elements in the set of matched elements.
			 * @method enhance
			 * @member ns.widget.mobile.BaseWidgetMobile
			 * @instance
			 * @removed 2.3
			 */
			prototype.enhance = function () {
				ns.log('method enhance is deprecated');
			};
			

			/**
			* Returns element of widget.
			* @method widget
			* @member ns.widget.mobile.BaseWidgetMobile
			* @return {HTMLElement}
			* @instance
			*/
			prototype.widget = function () {
				return this.element;
			};

			BaseWidgetMobile.prototype = prototype;

			// definition
			ns.widget.mobile.BaseWidgetMobile = BaseWidgetMobile;

			}(window.document, ns));

/*global window, define, ns, setTimeout, clearTimeout */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/**
 * # Button Widget
 * Button widget changes default browser buttons to special buttons with additional opportunities like icon, corners, shadow.
 *
 * ## Default selectors
 * In default all **BUTTON** tags and all **INPUT** tags with type equals _button_, _submit_ or _reset_ are change to Tizen WebUI buttons.
 * In addition all elements with _data-role=button_ and class _ui-btn_ are changed to Tizen Web UI buttons.
 * To prevent auto enhance element to Tizen Web UI buttons you can use _data-role=none_ attribute on **BUTTON** or **INPUT** element.
 *
 * ###HTML Examples
 *
 * ####Create simple button from link using data-role
 *
 *		@example
 *		<a href="#page2" data-role="button">Link button</a>
 *
 * ####Create simple button from link using class selector
 *
 *		@example
 *		<a href="#page2" class="ui-btn">Link button</a>
 *
 * ####Create simple button using button's tag
 *
 *		@example
 *		<button>Button element</button>
 *
 * ####Create simple button from input using type
 *
 *		@example
 *		<input type="button" value="Button" />
 *		<input type="submit" value="Submit Button" />
 *		<input type="reset" value="Reset Button" />
 *
 * ## Manual constructor
 * For manual creation of button widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		<div id="button"></div>
 *		<script>
 *			var buttonElement = document.getElementById('button'),
 *				button = tau.widget.Button(buttonElement, {mini: true});
 *		</script>
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend to get this element by method *document.getElementById*. Second parameter is **options** and it is a object with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<div id="button"></div>
 *		<script>
 *			$('#button').button({mini: true});
 *		</script>
 *
 * jQuery Mobile constructor has one optional parameter is **options** and it is a object with options for widget.
 *
 * ##Options for Button Widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ###Mini version
 * For a more compact version that is useful in toolbars and tight spaces, add the data-mini="true" attribute to the button to create a mini version. This will produce a button that is not as tall as the standard version and has a smaller text size.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-mini="true">Link button</a>
 *
 *
 * ###Inline buttons
 * By default, all buttons in the body content are styled as block-level elements so they fill the width of the screen. However, if you want a more compact button that is only as wide as the text and icons inside, add the data-inline="true" attribute to the button.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-inline="true">Cancel</a>
 *
 * If you have multiple buttons that should sit side-by-side on the same line, add the data-inline="true" attribute to each button. This will style the buttons to be the width of their content and float the buttons so they sit on the same line.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-inline="true">Cancel</a>
 *		<a href="index.html" data-role="button" data-inline="true" data-theme="b">Save</a>
 *
 * ###Icon positioning
 * By default, all icons in buttons are placed to the left of the button text. This default may be overridden using the data-iconpos attribute.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-icon="delete" data-iconpos="right">Delete</a>
 *
 * Possible values of data-iconpos:<br>
 *
 *  - "left"  - creates the button with left-aligned icon<br>
 *  - "right"  - creates the button with right-aligned icon<br>
 *  - "top"  - creates the button with icon positioned above the text<br>
 *  - "bottom"  - creates the button with icon positioned below the text
 *
 * You can also create an icon-only button, by setting the data-iconpos attribute to notext. The button plugin will hide the text on-screen, but add it as a title attribute on the link to provide context for screen readers and devices that support tooltips.
 *
 *		@example
 *		<a href="index.html" data-role="button" data-icon="delete" data-iconpos="notext">Delete</a>
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<div id="button" data-role="button"></div>
 *		<script>
 *			var buttonElement = document.getElementById('button'),
 *				button = tau.widget.Button(buttonElement);
 *
 *			// button.methodName(methodArgument1, methodArgument2, ...);
 *			// for example:
 *
 *			button.value("text");
 *		</script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *	    <div id="button"></div>
 *		<script>
 *			// $("#button").button('methodName', argument1, argument2, ...);
 *			// for example:
 *		</script>
 *
 * @class ns.widget.mobile.Button
 * @extends ns.widget.BaseWidget
 * @author Grzegorz Osimowicz <g.osimowicz@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Marcin Jakuszko <m.jakuszko@samsung.com>
 * @author Piotr Gorny <p.gorny2@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 * @author Sergiusz Struminski <s.struminski@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function(document, ns) {
	
				var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				selectorsUtils = ns.util.selectors,
				themes = ns.theme,
				Button = function Button() {
					var self = this;

					self.action = "";
					self.label = null;
					self.options = {};
					self.ui = {};
				},
				classes = {
					uiDisabled: "ui-disabled",
					uiBtn: "ui-btn",
					uiBtnUpThemePrefix: "ui-btn-up-",
					uiBtnHoverThemePrefix: "ui-btn-hover-",
					uiBtnDownThemePrefix: "ui-btn-down-",
					uiShadow: "ui-shadow",
					uiBtnCornerAll: "ui-btn-corner-all",
					uiBtnHidden: "ui-btn-hidden",
					uiBtnBoxThemePrefix: "ui-btn-box-",
					uiBtnTextPaddingPrefix: "ui-btn-text-padding-",
					uiBtnCornerCircle: "ui-btn-corner-circle",
					uiBtnHastxt: "ui-btn-hastxt",
					uiBtnIconNobg: "ui-btn-icon-nobg",
					uiBtnIconOnly: "ui-btn-icon_only",
					uiBtnIconOnlyInner: "ui-btn-icon-only",
					uiBtnRound: "ui-btn-round",
					uiMini: "ui-mini",
					uiBtnInline: "ui-btn-inline",
					uiBtnBlock: "ui-btn-block",
					uiIcon: "ui-icon",
					uiBtnIconPrefix: "ui-btn-icon-",
					uiIconPrefix: "ui-icon-",
					uiIconShadow: "ui-icon-shadow",
					uiBtnIconPositionPrefix: "ui-btn-icon-",
					uiLink: "ui-link",
					uiBtnInner: "ui-btn-inner",
					uiBtnText: "ui-btn-text",
					uiFocus: "ui-focus",
					uiBlur: "ui-blur",
					uiBtnEdit: "ui-btn-edit",
					uiBtnLeft: "ui-btn-left",
					uiBtnRight: "ui-btn-right",
					uiSubmit: "ui-submit",
					uiBtnActive: "ui-btn-active",
					uiBtnIconNotext: "ui-btn-icon-notext",
					uiBtnIconRight: 'ui-btn-icon-right'
				},
				eventsAdded = false,
				prototype = new BaseWidget();

			prototype.options = {
				theme: null,
				icon: null,
				iconpos: null,
				inline: null,
				shadow: true,
				iconshadow: true,
				corners: false,
				mini: null,
				bar: false,
				style: null,
				wrapperEls: "span"
			};

				Button.prototype = prototype;

			/**
			 * Dictionary for button related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.Button
			 * @static
			 * @readonly
			 */
			Button.classes = classes;

			/**
			 * Delay of highlight on hover
			 * @property {number} [hoverDelay=0]
			 * @member ns.widget.mobile.Button
			 * @static
			 */
			Button.hoverDelay = 0;

			// Return not disabled button element which is the closest to element and has div container
			// @method closestEnabledButtonInDiv
			// @param {HTMLElement} element
			// @return {HTMLElement}
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function closestEnabledButtonInDiv(element) {
				var div = selectorsUtils.getClosestBySelector(element, "." + classes.uiBtn + ":not(." + classes.uiDisabled + ")"),
					button;
				if (div) {
					button = selectorsUtils.getChildrenByClass(div, classes.uiBtnHidden);
					if (button.length) {
						div = button[0];
					}
				}
				return div;
			}

			// Return not disabled button element which is the closest to element
			// @method closestEnabledButton
			// @param {HTMLElement} element
			// @return {HTMLElement}
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function closestEnabledButton(element) {
				return selectorsUtils.getClosestBySelector(element, "." + classes.uiBtn + ":not(." + classes.uiDisabled + ")");
			}

			/**
			 * Return instance of Button widget
			 * @method getInstance
			 * @param {Event} event
			 * @return {?ns.widget.mobile.Button}
			 * @private
			 * @static
			 * @member ns.widget.mobile.Button
			 */
			function getInstance(event) {
				var button = closestEnabledButtonInDiv(event.target),
					instance;
				if (button) {
					instance = engine.getBinding(button, "Button") || engine.getBinding(button, "buttonMarkup");
				}
				return instance;
			}

			/**
			 * Function removes button up theme class and adds button up
			 * @method changeClasses
			 * @param {ns.widget.mobile.Button} instance
			 * @param {string} addedClassPrefix
			 * @param {string} removedClassPrefix
			 * @private
			 * @static
			 * @member ns.widget.mobile.Button
			 */
			function changeClasses(instance, addedClassPrefix, removedClassPrefix) {
				var theme = instance.options.theme,
					buttonClassList = instance.ui.container.classList;
				buttonClassList.remove(removedClassPrefix + theme);
				buttonClassList.add(addedClassPrefix + theme);
			}

			// Add class ui-focus to target element of event
			// @method onFocus
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onFocus(event) {
				var button = closestEnabledButton(event.target);
				if (button) {
					button.classList.add(classes.uiFocus);
					button.classList.remove(classes.uiBlur);
				}
			}

			// Remove class ui-focus from target element of event
			// @method onBlur
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onBlur(event) {
				var button = closestEnabledButton(event.target);
				if (button) {
					button.classList.add(classes.uiBlur);
					button.classList.remove(classes.uiFocus);
				}
			}

			// Function fires on mouse down event
			// @method onMouseDown
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onMouseDown(event) {
				var instance = getInstance(event);

				if (instance) {
					if (Button.hoverDelay) {
						instance.timeout = setTimeout(changeClasses.bind(null, instance,
							classes.uiBtnDownThemePrefix, classes.uiBtnUpThemePrefix), Button.hoverDelay);
					} else {
						changeClasses(instance, classes.uiBtnDownThemePrefix, classes.uiBtnUpThemePrefix);
					}
				}
			}

			// Function fires on mouse up event
			// @method onMouseUp
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onMouseUp(event) {
				var instance = getInstance(event);

				if (instance) {
					if (instance.timeout) {
						clearTimeout(instance.timeout);
					}
					changeClasses(instance, classes.uiBtnUpThemePrefix, classes.uiBtnDownThemePrefix);
				}
			}

			// Function fires on mouse over event
			// @method onMouseOver
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onMouseOver(event) {
				var instance = getInstance(event);

				if (instance) {
					changeClasses(instance, classes.uiBtnHoverThemePrefix, classes.uiBtnUpThemePrefix);
				}
			}

			// Function fires on mouse out event
			// @method onMouseOut
			// @param {Event} event
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function onMouseOut(event) {
				var instance = getInstance(event);

				if (instance) {
					changeClasses(instance, classes.uiBtnUpThemePrefix, classes.uiBtnHoverThemePrefix);
				}
			}

			// Add events to all buttons
			// @method addGlobalEvents
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function addGlobalEvents() {
				if (!eventsAdded) {
					document.addEventListener("focus", onFocus, true);
					document.addEventListener("focusin", onFocus, true);
					document.addEventListener("blur", onBlur, true);
					document.addEventListener("focusout", onBlur, true);
					document.addEventListener("vmousedown", onMouseDown, true);
					document.addEventListener("vmouseup", onMouseUp, true);
					document.addEventListener("vmousecancel", onMouseUp, true);
					document.addEventListener("vmouseup", onMouseUp, true);
					document.addEventListener("touchend", onMouseUp, true);
					document.addEventListener("touchcancel", onMouseUp, true);
					document.addEventListener("vmouseover", onMouseOver, true);
					document.addEventListener("focus", onMouseOver, true);
					document.addEventListener("vmouseout", onMouseOut, true);
					document.addEventListener("blur", onMouseOut, true);
					document.addEventListener("scrollstart", onMouseOut, true);
					eventsAdded = true;
				}
			}

			// Removes disabled attributes and removes uiDisabled class
			// @method enableElement
			// @param {HTMLElement} element html element to enable
			// @param {HTMLElement} divElement html container of element to enable
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function enableElement(element, divElement) {
				if (element) {
					divElement.removeAttribute("disabled");
					element.setAttribute("aria-disabled", false);
					element.classList.remove(classes.uiDisabled);
				}
			}

			// Adds disabled attributes and uiDisabled class
			// @method disableElement
			// @param {HTMLElement} element html element to disable
			// @param {HTMLElement} divElement html container of element to disable
			// @private
			// @static
			// @member ns.widget.mobile.Button
			function disableElement(element, divElement) {
				if (element) {
					divElement.setAttribute("disabled", "disabled");
					element.setAttribute("aria-disabled", true);
					element.classList.add(classes.uiDisabled);
				}
			}

			/**
			 * Configure button widget
			 * @method _configure
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._configure = function (element) {
				var prototypeOptions = prototype.options,
					options;
				/**
				 * All possible widget options
				 * @property {Object} options
				 * @property {?string} [options.theme=null] theme of widget
				 * @property {?string} [options.icon=null] icon type
				 * @property {"left"|"right"|"top"|"bottom"|null} [options.iconpos=null] position of icon
				 * @property {?string} [options.inline=null] if value is "true" then button has css property display = "inline"
				 * @property {boolean} [options.shadow=true] shadow of button
				 * @property {boolean} [options.iconshadow=true] shadow of button's icon
				 * @property {boolean} [options.corners=false] corners of button
				 * @property {?boolean} [options.mini=null] size of button
				 * @property {boolean} [options.bar=false] if button is part of bar then you should set true
				 * @property {"circle"|"nobg"|null} [options.style=null] style of button
				 * @property {"span"|"div"} [options.wrapperEls="span"] wrapper tag name of button
				 * @member ns.widget.mobile.Button
				 */
				ns.util.object.merge(this.options, prototypeOptions);

				options = this.options;

				// Set theme
				options.theme = themes.getInheritedTheme(element, (prototypeOptions && prototypeOptions.theme) || "s");

			};

			/**
			 * Remove all classes started from given prefix
			 * @method removePrefixesClasses
			 * @param {DOMTokenList} classList
			 * @param {string} prefix
			 * @private
			 * @static
			 * @member ns.widget.mobile.Button
			 */
			function removePrefixesClasses(classList, prefix) {
				var classListLength = classList.length,
					className;
				while (classListLength-- > 0) {
					className = classList.item(classListLength);
					if (className.indexOf(prefix) === 0) {
						classList.remove(className);
					}
				}
			}

			/**
			 * Method clear all classes depends from options before set new options
			 * @method _clearClasses
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._clearClasses = function (element) {
				var ui = this.ui,
					textClassList = ui.buttonText.classList,
					innerClassList = ui.inner.classList,
					elementClassList = element.classList;

				removePrefixesClasses(textClassList, classes.uiBtnTextPaddingPrefix);

				innerClassList.remove(classes.uiBtnIconOnlyInner);

				elementClassList.remove(classes.uiBtnIconOnly);
				removePrefixesClasses(elementClassList, classes.uiIconPositionPrefix);
			};

			/**
			 * Method to reset icon from button
			 * @method _resetIcon
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._resetIcon = function () {
				var ui = this.ui,
					iconElement = ui.icon;
				if (iconElement) {
					iconElement.parentElement.removeChild(iconElement);
					ui.icon = null;
				}
			};

			/**
			 * Set icon shadow classes
			 * @method _setIconShadow
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setIconShadow = function () {
				if (this.options.iconshadow) {
					this.ui.icon.classList.add(classes.uiIconShadow);
				}
			};

			/**
			 * Set icon position classes
			 * @method _setIconPos
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setIconPos = function (element) {
				var self = this,
					ui = self.ui,
					optionIconpos = self.options.iconpos || "left",
					innerText = element.value || element.textContent,
					innerTextLength = innerText.length;

				element.classList.add(classes.uiBtnIconPositionPrefix + optionIconpos);

				if (innerTextLength > 0) {
					ui.buttonText.classList.add(classes.uiBtnTextPaddingPrefix + optionIconpos);
				}
			};

			/**
			 * Set title for button without showing text
			 * @method _setTitleForIcon
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setTitleForIcon = function (element) {
				var self = this,
					elementTagName = element.tagName.toLowerCase(),
					options = self.options,
					buttonText = self.ui.buttonText;
				// Add title to element if button not has text.
				if (options.iconpos === "notext" && !element.getAttribute("title")) {
					element.setAttribute("title", element.textContent);
				}
				if (!buttonText.innerHTML.length && elementTagName !== "label") {
					self._setValue(options.icon.replace("naviframe-", ""));
				}
			};

			/**
			 * Create icon element and set correct classes
			 * @method _createIcon
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._createIcon = function mobileButtonCreateIcon(element) {
				var iconElement = document.createElement("span"),
					iconElementClassList = iconElement.classList,
					ui = this.ui;

				// Due to visibility non-breaking space on button cancel
				// in SearchBar widget
				if (this.options.icon !== "cancel") {
					iconElement.innerHTML = "&#160;";
				}
				// Set icon classes
				iconElementClassList.add(classes.uiIcon);
				iconElementClassList.add(classes.uiIconPrefix + this.options.icon);

				//set icon information on container
				if (element) {
					element.classList.add(classes.uiBtnIconPrefix + this.options.icon);
				}

				// Add icon element to DOM
				ui.inner.appendChild(iconElement);
				ui.icon = iconElement;
			};

			/**
			 * Set text classes connected with icon
			 * @method _setIconTextOnly
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setIconTextOnly = function (element) {
				var innerText = element.value || element.textContent,
					innerTextLength = innerText.length,
					elementClassList = element.classList,
					innerClassList = this.ui.inner.classList;

				if (!innerTextLength) {
					elementClassList.add(classes.uiBtnIconOnly);
					innerClassList.add(classes.uiBtnIconOnlyInner);
				}
			};

			/**
			 * Set class has text if is any text to show in button
			 * @method _setHasText
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setHasText = function (element) {
				var innerText = element.value || element.textContent,
					innerTextLength = innerText.length,
					innerClassList = this.ui.inner.classList;
				if (innerTextLength > 0) {
					innerClassList.add(classes.uiBtnHastxt);
				}
			};

			/**
			 * Method to create/rebuild icon element in button
			 * @method _buildIcon
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._buildIcon = function (element) {
				var self = this;

				//Set icon options
				if (self.options.icon) {
					self._setIconPos(element);
					self._setIconTextOnly(element);
					self._createIcon(element);
					self._setIconShadow();
					self._setTitleForIcon(element);
				}
			};

			/**
			* Build structure of button widget
			* @method _build
			* @param {HTMLElement|HTMLInputElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._build = function (element) {
				var self = this,
					ui = self.ui,
					attributes = {
						"disabled": element.getAttribute("disabled")
					},
					buttonInner,
					buttonText,
					buttonIcon,
					buttonStyle,
					buttonClassList,
					buttonClassArray = [],
					elementTagName,
					elementTypeName,
					innerClass = classes.uiBtnInner,
					textClass = classes.uiBtnText,
					options = this.options,
					buttonValue,
					buttonInnerHTML,
					container,
					innerTextLength,
					label,
					prototypeOptions = prototype.options,
					i;

				// Create default structure of button
				buttonInner = document.createElement(options.wrapperEls);
				buttonInner.id = element.id + "-div-inner";
				buttonText = document.createElement(options.wrapperEls);
				buttonText.id = element.id + "-div-text";

				this.ui.buttonText = buttonText;

				elementTagName = element.tagName.toLowerCase();
				elementTypeName = element.type;
				buttonClassList = element.classList;

				if (elementTagName === "input" && elementTypeName === "button") {
					options.corners = true;
				}
				buttonClassArray.push(classes.uiBtn, classes.uiBtnUpThemePrefix + options.theme);
				if (options.shadow) {
					buttonClassArray.push(classes.uiShadow);
				}
				if (options.corners) {
					buttonClassArray.push(classes.uiBtnCornerAll);
				}

				buttonInnerHTML = element.innerHTML;
				buttonValue = element.value;

				buttonStyle = options.style;

				if (elementTagName === "a") {
					container = element;
				} else {
					if (elementTagName === "button" || elementTagName === "input") {
						buttonClassList.add(classes.uiBtnHidden);
						container = document.createElement("div");
						container.setAttribute("id", element.id + "-div-container");

						if (buttonClassList.contains(classes.uiBtnRight)) {
							container.classList.add(classes.uiBtnRight);
						} else if (buttonClassList.contains(classes.uiBtnLeft)) {
							container.classList.add(classes.uiBtnLeft);
						}
						if (elementTypeName === "submit" || elementTypeName === "reset") {
							container.classList.add(classes.uiSubmit);
						}
					} else {
						container = element;
					}

					label = document.querySelector("label[for='" + element.id + "']");
					if (label) {
						label.classList.add(classes.uiSubmit);
					}
				}

				container.setAttribute("tabindex", 0);
				if ( (element.getAttribute("data-role") === "button" && !options.bar) ||
					(elementTagName === "input" && ((elementTypeName === "submit") || (elementTypeName === "reset") || (elementTypeName === "button")) ) ||
					(elementTagName === "button") ) {
					buttonClassArray.push(classes.uiBtnBoxThemePrefix + options.theme);
				}

				innerTextLength = element.textContent.length || (element.value ? element.value.length : 0);

				switch (buttonStyle) {
				case "circle":
					if (innerTextLength > 0) {
						buttonClassArray.push(classes.uiBtnRound);
					} else {
						buttonClassArray.push(classes.uiBtnCornerCircle, classes.uiBtnIconOnly);
						if (options.icon) {
							// Style: no text, Icon only
							innerClass += " " + classes.uiBtnCornerCircle;
						} else {
							buttonClassArray.push(classes.uiBtnRound);
						}
					}
					break;
				case "nobg":
					buttonClassArray.push(classes.uiBtnIconNobg, classes.uiBtnIconOnly);
					if (options.icon && innerTextLength <= 0) {
						// Style: no text, Icon only, no background
						innerClass += " " + classes.uiBtnIconNobg;
					}
					break;
				case "edit":
					buttonClassArray.push(classes.uiBtnEdit);
					break;
				case "round":
					buttonClassArray.push(classes.uiBtnRound);
					break;
					default:
				}

				// Used to control styling in headers/footers, where buttons default to `mini` style.
				if (options.mini) {
					buttonClassArray.push(classes.uiMini);
				}

				// Used to control styling in headers/footers, where buttons default to `inline` style.
				if (options.inline !== null) {
					buttonClassArray.push(options.inline ? classes.uiBtnInline : classes.uiBtnBlock);
				}

				// Default disable element
				if (attributes.disabled) {
					disableElement(element, container);
				} else {
					enableElement(element, container);
				}

				innerClass += options.corners ? " "  + classes.uiBtnCornerAll : "";

				// Copy classes of structure
				buttonClassList = container.classList;
				buttonClassList.remove(classes.uiLink);

				// Copy all classes from buttonClassArray to buttonClassList
				i = buttonClassArray.length;
				while (--i >= 0) {
					buttonClassList.add(buttonClassArray[i]);
				}

				buttonInner.className = innerClass;
				buttonText.className = textClass;
				buttonInner.appendChild(buttonText);

				// copy inner structure of button to new tag
				while (element.firstChild) {
					buttonText.appendChild(element.firstChild);
				}

				if (elementTagName === "button" || elementTagName === "input") {
					ns.util.DOM.replaceWithNodes(element, container);
					container.appendChild(buttonInner);
					container.appendChild(element);
					if (buttonInnerHTML) {
						container.firstChild.firstChild.innerHTML = buttonInnerHTML;
						element.innerHTML = buttonInnerHTML;
					} else {
						container.firstChild.firstChild.textContent = buttonValue;
						element.value = buttonValue;
					}
				} else {
					element.appendChild(buttonInner);
				}

				ui.container = container;
				ui.inner = buttonInner;

				self._setHasText(element);
				self._buildIcon(element);

				element.setAttribute("tabindex", 0);

				return element;
			};

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._init = function (element) {
				var container = document.getElementById(element.id + "-div-container");
				if (!container) {
					container = element;
				}
				this.ui.container = container;
				this.ui.buttonText = document.getElementById(element.id + "-div-text");
				this.ui.inner = document.getElementById(element.id + "-div-inner");
			};

			/**
			* Bind events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._bindEvents = function () {
				addGlobalEvents();
			};

			/**
			 * Enable the button
			 *
			 * Method removes disabled attribute on button and changes look of button to enabled state.
			 *
			 *	@example
			 *	<div data-role="button" id="button"></div>
			 *	<script>
			 *		var element = document.getElementById("button"),
			 *			buttonWidget = tau.widget.Button(element);
			 *		buttonWidget.enable();
			 *
			 *	</script>
			 *
			 *	@example
			 *	<div data-role="button" id="button"></div>
			 *	<script>
			 *		$( "#button" ).button( "enable" );
			 *	</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.Button
			 */

			/**
			* Enable button
			* @method _enable
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._enable = function (element) {
				if (element) {
					enableElement(element, this.ui.container);
				}
			};

			/**
			 * Get or set value
			 *
			 * Return inner text of button or set text on button
			 *
			 *	@example
			 *	<div data-role="button" id="button"></div>
			 *	<script>
			 *		var element = document.getElementById("button"),
			 *			buttonWidget = tau.widget.Button(element),
			 *			// value contains inner text of button
			 *			value = buttonWidget.value();
			 *
			 *		buttonWidget.value( "New text" ); // "New text" will be text of button
			 *	</script>
			 *
			 *	@example
			 *	<div data-role="button" id="button"></div>
			 *	<script>
			 *		// value contains inner text of button
			 *		$( "#button" ).button( "value" );
			 *
			 * 		// "New text" will be text of button
			 *		$( "#button" ).button( "value", "New text" );
			 *	</script>
			 *
			 * @method value
			 * @param {string} [value] Value to set on button
			 * @return {string} In get mode return inner text of button.
			 * @since 2.3
			 * @member ns.widget.mobile.Button
			 */

			/**
			 * Get value of button
			 * @method _getValue
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._getValue = function () {
				return this.ui.buttonText.textContent;
			};

			/**
			 * Set value of button
			 * @method _setValue
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @member ns.widget.mobile.Button
			 */
			prototype._setValue = function (value) {
				var elementTagName,
					ui = this.ui,
					element = this.element || ui.container;

				elementTagName = element.tagName.toLowerCase();

				ui.buttonText.textContent = value;

				if (elementTagName === "button" || elementTagName === "input") {
					element.textContent = value;
					element.value = value;
				}
			};

			/**
			 * Disable the button
			 *
			 * Method sets disabled attribute on button and changes look of button to disabled state.
			 *
			 *	@example
			 *	<div data-role="button" id="button"></div>
			 *	<script>
			 *		var element = document.getElementById("button"),
			 *			buttonWidget = tau.widget.Button(element);
			 *		buttonWidget.disable();
			 *
			 *	</script>
			 *
			 *	@example
			 *	<div data-role="button" id="button"></div>
			 *	<script>
			 *		$( "#button" ).button( "disable" );
			 *	</script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.Button
			 */

			/**
			* Disable button
			* @method _disable
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._disable = function (element) {
				if (element) {
					disableElement(element, this.ui.container);
				}
			};

			/**
			 * Refresh a button markup.
			 *
			 * This method will rebuild while DOM structure of widget.
			 *
			 * This method should be called after are manually change in HTML attributes of widget DOM structure.
			 *
			 * This method is called automatically after change any option of widget.
			 *
			 *	@example
			 *	<div data-role="button" id="button"></div>
			 *	<script>
			 *		var element = document.getElementById("button"),
			 *			buttonWidget = tau.widget.Button(element);
			 *		buttonWidget.refresh();
			 *
			 *		// also will be called after
			 *
			 *		buttonWidget.option("mini", true);
			 *	</script>
			 *
			 *	@example
			 *	<div data-role="button" id="button"></div>
			 *	<script>
			 *		$( "#button" ).button( "refresh" );
			 *	</script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.Button
			 */

			/**
			* Refresh button
			* @method _refresh
			* @protected
			* @member ns.widget.mobile.Button
			*/
			prototype._refresh = function () {
				var self = this,
					element = self.element,
					container = self.ui.container,
					tagName = element.tagName.toLowerCase();
				if (element) {
					if (element.getAttribute("disabled")) {
						self.disable(element);
					} else {
						self.enable(element);
					}
					if (tagName === "button" || tagName === "input") {
						if (element.innerHTML) {
							container.firstChild.firstChild.innerHTML = element.innerHTML;
						} else {
							container.firstChild.firstChild.textContent = element.value;
						}
					}
					self._clearClasses(element);
					self._resetIcon();
					self._setHasText(element);
					self._buildIcon(element);
				}
			};

			/**
			 * Removes the button functionality completely.
			 *
			 * This will return the element back to its pre-init state.
			 *
			 *	@example
			 *	<script>
			 *		var buttonWidget = tau.widget.Button(document.getElementById("button"));
			 *		buttonWidget.destroy();
			 *	</script>
			 *
			 *	@example
			 *	<script>
			 *		$( "#button" ).button( "destroy" );
			 *	</script>
			 *
			 * @method destroy
			 * @member ns.widget.mobile.Button
			 */

			// definition
			//@todo bring back ui-btn selector and refactor _build method to make it more intelligent for checking if structure is build
			ns.widget.mobile.Button = Button;
			engine.defineWidget(
				"Button",
				"[data-role='button'], button, [type='button'], [type='submit'], [type='reset']",
				[],
				Button,
				"mobile"
			);
			// ButtonMarkup is alias for Button widget
			// required for backward compatibility with jQM
			engine.defineWidget(
				"buttonMarkup",
				"",
				[],
				Button,
				"mobile",
				false, // redefine: false
				false // change name of widget to lowercase: false
			);
			}(window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * # TV Widget Reference
 * Tizen Web UI service provides rich Tizen widgets that are optimized for the
 * Tizen Web browser. You can use the widgets for:
 *
 * - CSS animation
 * - Rendering
 *
 * The following table displays the widgets provided by the Tizen Web UI service.
 * @page ns.widget.tv
 * @title Widget Reference
 * @seeMore https://developer.tizen.org/dev-guide/2.2.1/org.tizen.web.uiwidget.apireference/html/web_ui_framework.htm "Web UI Framework Reference"
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Czajka <p.czajka@samsung.com>
 */
(function (window, ns) {
	
				/** @namespace ns.widget.tv */
			ns.widget.tv = ns.widget.tv || {};
			}(window, ns));

/*global window, define */
/*jslint plusplus: true */
/*jshint -W069 */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	
	
			var DOM = ns.util.DOM;

			/**
			 * Returns css property for element
			 * @method getCSSProperty
			 * @param {HTMLElement} element
			 * @param {string} property
			 * @param {string|number|null} [def=null] default returned value
			 * @param {"integer"|"float"|null} [type=null] auto type casting
			 * @return {string|number|null}
			 * @member ns.util.DOM
			 * @static
			 */
			function getCSSProperty(element, property, def, type) {
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
			}

			/**
			 * Extracts css properties from computed css for an element.
			 * The properties values are applied to the specified
			 * properties list (dictionary)
			 * @method extractCSSProperties
			 * @param {HTMLElement} element
			 * @param {Object} properties
			 * @param {?string} [pseudoSelector=null]
			 * @param {boolean} [noConversion=false]
			 * @member ns.util.DOM
			 * @static
			 */
			function extractCSSProperties (element, properties, pseudoSelector, noConversion) {
				var style = window.getComputedStyle(element, pseudoSelector),
					property,
					value = null,
					utils = ns.util;

				// @TODO extractCSSProperties should rather return raw values (with units)
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
			}

			/**
			 * Returns elements height from computed style
			 * @method getElementHeight
			 * @param {HTMLElement} element
			 * if null then the "inner" value is assigned
			 * @param {"outer"|null} [type=null]
			 * @param {boolean} [includeOffset=false]
			 * @param {boolean} [includeMargin=false]
			 * @param {?string} [pseudoSelector=null]
			 * @param {boolean} [force=false] check even if element is hidden
			 * @return {number}
			 * @member ns.util.DOM
			 * @static
			 */
			function getElementHeight(element, type, includeOffset, includeMargin, pseudoSelector, force) {
				var height = 0,
					style,
					value,
					originalDisplay = null,
					originalVisibility = null,
					originalPosition = null,
					outer = (type && type === "outer") || false,
					offsetHeight = 0,
					property,
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
						extractCSSProperties(element, props, pseudoSelector, true);
						offsetHeight = element.offsetHeight;
					} else if (force) {
						originalDisplay = style.display;
						originalVisibility = style.visibility;
						originalPosition = style.position;

						style.display = "block";
						style.visibility = "hidden";
						style.position = "relative";

						extractCSSProperties(element, props, pseudoSelector, true);
						offsetHeight = element.offsetHeight;

						style.display = originalDisplay;
						style.visibility = originalVisibility;
						style.position = originalPosition;
					}

					// We are extracting raw values to be able to check the units
					if(typeof props["height"] === "string" && props["height"].indexOf("px") === -1){
						//ignore non px values such as auto or %
						props["height"] = 0;
					}

					for (property in props) {
						if (props.hasOwnProperty(property) && property !== "box-sizing"){
							value = parseFloat(props[property]);
							if (isNaN(value)) {
								value = 0;
							}
							props[property] = value;
						}
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
			}

			/**
			 * Returns elements width from computed style
			 * @method getElementWidth
			 * @param {HTMLElement} element
			 * if null then the "inner" value is assigned
			 * @param {"outer"|null} [type=null]
			 * @param {boolean} [includeOffset=false]
			 * @param {boolean} [includeMargin=false]
			 * @param {?string} [pseudoSelector=null]
			 * @param {boolean} [force=false] check even if element is hidden
			 * @return {number}
			 * @member ns.util.DOM
			 * @static
			 */
			function getElementWidth(element, type, includeOffset, includeMargin, pseudoSelector, force) {
				var width = 0,
					style,
					value,
					originalDisplay = null,
					originalVisibility = null,
					originalPosition = null,
					offsetWidth = 0,
					property,
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
						extractCSSProperties(element, props, pseudoSelector, true);
						offsetWidth = element.offsetWidth;
					} else if (force) {
						originalDisplay = style.display;
						originalVisibility = style.visibility;
						originalPosition = style.position;

						style.display = "block";
						style.visibility = "hidden";
						style.position = "relative";

						extractCSSProperties(element, props, pseudoSelector, true);

						style.display = originalDisplay;
						style.visibility = originalVisibility;
						style.position = originalPosition;
					}

					if(typeof props["width"] === 'string' && props["width"].indexOf("px") === -1) {
						//ignore non px values such as auto or %
						props["width"] = 0;
					}
					for (property in props) {
						if (props.hasOwnProperty(property) && property !== "box-sizing"){
							value = parseFloat(props[property]);
							if (isNaN(value)) {
								value = 0;
							}
							props[property] = value;
						}
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
			}

			/**
			 * Returns offset of element
			 * @method getElementOffset
			 * @param {HTMLElement} element
			 * @return {Object}
			 * @member ns.util.DOM
			 * @static
			 */
			function getElementOffset(element) {
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
			}

			/**
			 * Check if element occupies place at view
			 * @method isOccupiedPlace
			 * @param {HTMLElement} element
			 * @return {boolean}
			 * @member ns.util.DOM
			 * @static
			 */
			function isOccupiedPlace(element) {
				return !(element.offsetWidth <= 0 && element.offsetHeight <= 0);
			}

			// assign methods to namespace
			DOM.getCSSProperty = getCSSProperty;
			DOM.extractCSSProperties = extractCSSProperties;
			DOM.getElementHeight = getElementHeight;
			DOM.getElementWidth = getElementWidth;
			DOM.getElementOffset = getElementOffset;
			DOM.isOccupiedPlace = isOccupiedPlace;

			}(window, window.document, ns));

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
					focusEnabled: "ui-focus-enabled",
					focusPrefix: "ui-focus-",
					blurPrefix: "ui-blur-",
					up: "up",
					down: "down",
					left: "left",
					right: "right"
				},
				KEY_CODES = {
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
					return element.offsetWidth && window.getComputedStyle(element).visibility !== "hidden";
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

			function removeAnimationClasses(element, prefix) {
				var elementClasses = element.classList;
				elementClasses.remove(prefix + classes.left);
				elementClasses.remove(prefix + classes.up);
				elementClasses.remove(prefix + classes.right);
				elementClasses.remove(prefix + classes.down);
			}

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
					currentLink = self._getFocusesLink(),
					positionClass,
					cssClass,
					nextElement;

				if (self._supportKeyboard) {
					neighborhoodLinks = self._getNeighborhoodLinks();
					switch (keyCode) {
						case KEY_CODES.left:
							nextElement = neighborhoodLinks.left;
							positionClass = classes.left;
							break;
						case KEY_CODES.up:
							nextElement = neighborhoodLinks.top;
							positionClass = classes.up;
							break;
						case KEY_CODES.right:
							nextElement = neighborhoodLinks.right;
							positionClass = classes.right;
							break;
						case KEY_CODES.down:
							nextElement = neighborhoodLinks.bottom;
							positionClass = classes.down;
							break;
					}
					if (nextElement) {
						removeAnimationClasses(nextElement, classes.blurPrefix);
						removeAnimationClasses(nextElement, classes.focusPrefix);
						nextElement.classList.add(classes.focusPrefix + positionClass);
						if (currentLink) {
							removeAnimationClasses(currentLink, classes.focusPrefix);
							removeAnimationClasses(nextElement, classes.blurPrefix);
							currentLink.classList.add(classes.blurPrefix + positionClass);
						}
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
				if (index !== -1) {
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

			}(window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Button Widget
 * Shows a control that can be used to generate an action event.
 *
 * @class ns.widget.tv.Button
 * @extends ns.widget.mobile.Button
 * @author Piotr Czajka <p.czajka@samsung.com>
 */
(function (document, ns) {
	
				var BaseButton = ns.widget.mobile.Button,
				BaseButtonPrototype = BaseButton.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				objectUtils = ns.util.object,
				FUNCTION_TYPE = "function",
				Button = function () {
					BaseButton.call(this);
					BaseKeyboardSupport.call(this);
				},
				engine = ns.engine,
				classes = objectUtils.merge({}, BaseButton.classes, {
					background: "ui-background"
				}),
				prototype = new BaseButton();

			Button.events = BaseButton.events;
			Button.classes = classes;
			Button.options = prototype.options;
			Button.prototype = prototype;
			Button.hoverDelay = 0;
			// definition
			ns.widget.tv.Button = Button;

			prototype._build = function (element) {
				var backgroundElement;

				element = BaseButtonPrototype._build.call(this, element);

				backgroundElement = document.createElement("div");
				backgroundElement.classList.add(classes.background);
				backgroundElement.id = element.id + "-background";
				element.insertBefore(backgroundElement, element.firstChild);

				return element;
			};

			/**
			 * Initializes widget
			 * @method _init
			 * @protected
			 * @member ns.widget.tv.Button
			 */
			prototype._init = function (element) {
				var self = this;

				BaseButtonPrototype._init.call(self, element);

				self.ui.background = document.getElementById(element.id + "-background");
				return element;
			};

			engine.defineWidget(
				"Button",
				"[data-role='button'], button, [type='button'], [type='submit'], [type='reset']",
				[],
				Button,
				"tv",
				true
			);

			BaseKeyboardSupport.registerActiveSelector("[data-role='button'], button, [type='button'], [type='submit'], [type='reset']");

			}(window.document, ns));

/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*
 * #Namespace For Widgets
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @class ns.widget
 */
(function (document, ns) {
	
				ns.widget.core = ns.widget.core || {};
			}(window.document, ns));

/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Listview Widget
 * Shows a list view.
 *
 * The list widget is used to display, for example, navigation data, results, and data entries. The following table describes the supported list classes.
 *
 * ## Default selectors
 *
 * Default selector for listview widget is class *ui-listview*.
 *
 * To add a list widget to the application, use the following code:
 *
 * ### List with basic items
 *
 * You can add a basic list widget as follows:
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li>1line</li>
 *             <li>2line</li>
 *             <li>3line</li>
 *             <li>4line</li>
 *             <li>5line</li>
 *         </ul>
 *
 * ### List with link items
 *
 * You can add a list widget with a link and press effect that allows the user to click each list item as follows:
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li>
 *                 <a href="#">1line</a>
 *             </li>
 *             <li>
 *                 <a href="#">2line</a>
 *             </li>
 *             <li>
 *                 <a href="#">3line</a>
 *             </li>
 *             <li>
 *                 <a href="#">4line</a>
 *             </li>
 *             <li>
 *                 <a href="#">5line</a>
 *             </li>
 *         </ul>
 *
 * ## JavaScript API
 *
 * Listview widget hasn't JavaScript API.
 *
 * @class ns.widget.wearable.Listview
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	
				var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Listview = function () {
					return this;
				},
				prototype = new BaseWidget();

			Listview.events = {};

			prototype._changeLinksToButton = function(item) {
				engine.instanceWidget(
					item,
					"Button"
				);
			};

			/**
			* build Listview
			* @method _build
			* @private
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.wearable.Listview
			*/
			prototype._build = function (element) {
				var self = this,
					items = element.children,
					itemsLength = items.length,
					item,
					i;

				for (i=0; i<itemsLength; i++) {
					item = items[i];
					if (item.firstElementChild && item.firstElementChild.tagName === "A") {
						self._changeLinksToButton(item.firstElementChild);
					}
				}

				return element;
			};

			prototype._init = function (element) {
				return element;
			};

			prototype._bindEvents = function (element) {
				return element;
			};

			/**
			* refresh structure
			* @method _refresh
			* @new
			* @member ns.widget.wearable.Listview
			*/
			prototype._refresh = function () {
				return null;
			};

			/**
			* @method _destroy
			* @private
			* @member ns.widget.wearable.Listview
			*/
			prototype._destroy = function () {
				return null;
			};

			Listview.prototype = prototype;
			ns.widget.core.Listview = Listview;

			}(window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Listview Widget
 * Shows a list view.
 *
 * @class ns.widget.tv.Listview
 * @class ns.widget.core.Listview
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	
				var CoreListview = ns.widget.core.Listview,
				engine = ns.engine,
				Listview = function () {
				},
				prototype = new CoreListview();

			Listview.events = CoreListview.events;
			Listview.classes = CoreListview.classes;

			Listview.prototype = prototype;
			ns.widget.tv.Listview = Listview;

			engine.defineWidget(
				"Listview",
				".ui-listview,[data-role=listview]",
				[],
				Listview,
				"tv"
			);
			}(window.document, ns));

/*global window, define, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */

/**
 * #Wearable Widget Reference
 * The Tizen Web UI service provides rich Tizen widgets that are optimized for the Tizen Web browser. You can use the widgets for:
 *
 * - CSS animation
 * - Rendering
 *
 * The following table displays the widgets provided by the Tizen Web UI service.
 * @class ns.widget.wearable
 * @seeMore https://developer.tizen.org/dev-guide/2.2.1/org.tizen.web.uiwidget.apireference/html/web_ui_framework.htm "Web UI Framework Reference"
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	
				ns.widget.wearable = ns.widget.wearable || {};
			}(window, ns));

/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Page Widget
 * Page is main element of application's structure.
 *
 * ## Default selectors
 * In the Tizen Wearable Web UI framework the application page structure is based on a header, content and footer elements:
 *
 * - **The header** is placed at the top, and displays the page title and optionally buttons.
 * - **The content** is the section below the header, showing the main content of the page.
 * - **The footer** is abottom part of page which can display for example buttons
 *
 * The following table describes the specific information for each section.
 *
 * <table>
 *     <tr>
 *         <th>Section</th>
 *         <th>Class</th>
 *         <th>Mandatory</th>
 *         <th>Description</th>
 *     </tr>
 *     <tr>
 *         <td rowspan="2">Page</td>
 *         <td>ui-page</td>
 *         <td>Yes</td>
 *         <td>Defines the element as a page.
 *
 * The page widget is used to manage a single item in a page-based architecture.
 *
 * A page is composed of header (optional), content (mandatory), and footer (optional) elements.</td>
 *      </tr>
 *      <tr>
 *          <td>ui-page-active</td>
 *          <td>No</td>
 *          <td>If an application has a static start page, insert the ui-page-active class in the page element to speed up the application launch. The start page with the ui-page-active class can be displayed before the framework is fully loaded.
 *
 *If this class is not used, the framework inserts the class automatically to the first page of the application. However, this has a slowing effect on the application launch, because the page is displayed only after the framework is fully loaded.</td>
 *      </tr>
 *      <tr>
 *          <td>Header</td>
 *          <td>ui-header</td>
 *          <td>No</td>
 *          <td>Defines the element as a header.
 *
 * As the Tizen Wearable device screen size is small, avoid using the header element.</td>
 *      </tr>
 *      <tr>
 *          <td>Content</td>
 *          <td>ui-content</td>
 *          <td>Yes</td>
 *          <td>Defines the element as content.</td>
 *      </tr>
 *      <tr>
 *          <td>Footer</td>
 *          <td>ui-footer</td>
 *          <td>No</td>
 *          <td>Defines the element as a footer.
 *
 * The footer section is mostly used to include option buttons.</td>
 *      </tr>
 *  </table>
 *
 * All elements with class=ui-page will be become page widgets
 *
 *      @example
 *         <!--Page layout-->
 *         <div class="ui-page ui-page-active">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 *         <!--Page layout with more button in header-->
 *         <div class="ui-page ui-page-active">
 *             <header class="ui-header ui-has-more">
 *                 <h2 class="ui-title">Call menu</h2>
 *                 <button type="button" class="ui-more ui-icon-overflow">More Options</button>
 *             </header>
 *             <div class="ui-content">Content message</div>
 *             <footer class="ui-footer">
 *                 <button type="button" class="ui-btn">Footer Button</button>
 *             </footer>
 *         </div>
 *
 * ## Manual constructor
 * For manual creation of page widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		var pageElement = document.getElementById("page"),
 *			page = tau.widget.page(buttonElement);
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*.
 *
 * ## Multi-page Layout
 *
 * You can implement a template containing multiple page containers in the application index.html file.
 *
 * In the multi-page layout, the main page is defined with the ui-page-active class. If no page has the ui-page-active class, the framework automatically sets up the first page in the source order as the main page. You can improve the launch performance by explicitly defining the main page to be displayed first. If the application has to wait for the framework to set up the main page, the page is displayed with some delay only after the framework is fully loaded.
 *
 * You can link to internal pages by referring to the ID of the page. For example, to link to the page with an ID of two, the link element needs the href="#two" attribute in the code, as in the following example.
 *
 *      @example
 *         <!--Main page-->
 *         <div id="one" class="ui-page ui-page-active">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 *         <!--Secondary page-->
 *         <div id="two" class="ui-page">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 * To find the currently active page, use the ui-page-active class.
 *
 * ## Changing Pages
 * ### Go to page in JavaScript
 * To change page use method *tau.changePage*
 *
 *      @example
 *      tau.changePage("page-two");
 *
 * ### Back in JavaScript
 * To back to previous page use method *tau.back*
 *
 *      @example
 *      tau.back();
 *
 * ## Transitions
 *
 * When changing the active page, you can use a page transition.
 *
 * Tizen Wearable Web UI framework does not apply transitions by default. To set a custom transition effect, you must add the data-transition attribute to a link:
 *
 *      @example
 *      <a href="index.html" data-transition="slideup">I'll slide up</a>
 *
 * To set a default custom transition effect for all pages, use the pageTransition property:
 *
 *      @example
 *      tau.defaults.pageTransition = "slideup";
 *
 * ### Transitions list
 *
 *  - **none** no transition.
 *  - **slideup** Makes the content of the next page slide up, appearing to conceal the content of the previous page.
 *
 * ## Handling Page Events
 *
 * With page widget we have connected many of events.
 *
 * To handle page events, use the following code:
 *
 *      @example
 *        <div id="page" class="ui-page">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *         </div>
 *
 *         <script>
 *             var page = document.getElementById("page");
 *             page.addEventListener("Event", function(event) {
 *                 // Your code
 *             });
 *         </script>
 *
 * To bind an event callback on the Back key, use the following code:
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * To bind an event callback on the Back key, use the following code:
 *
 *      @example
 *         <script>
 *             window.addEventListener("tizenhwkey", function (event) {
 *                 if (event.keyName == "back") {
 *                     // Call window.history.back() to go to previous browser window
 *                     // Call tizen.application.getCurrentApplication().exit() to exit application
 *                     // Add script to add another behavior
 *                 }
 *             });
 *         </script>
 *
 * ## Options for Page Widget
 *
 * Page widget hasn't any options.
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		var pageElement = document.getElementById("page"),
 *			page = tau.widget.page(buttonElement);
 *
 *		page.methodName(methodArgument1, methodArgument2, ...);
 *
 * @class ns.widget.wearable.Page
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, ns) {
	
				/**
			 * Alias for {@link ns.widget.BaseWidget}
			 * @property {Object} BaseWidget
			 * @member ns.widget.wearable.Page
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for {@link ns.wearable.selectors}
				 * @property {Object} selectors
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				selectors = ns.wearable.selectors,
				/**
				 * Alias for {@link ns.util}
				 * @property {Object} util
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				util = ns.util,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} doms
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				doms = util.DOM,
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				engine = ns.engine,

				Page = function () {
					var self = this;
					/**
					 * Callback on resize
					 * @property {?Function} contentFillAfterResizeCallback
					 * @private
					 * @member ns.widget.wearable.Page
					 */
					self.contentFillAfterResizeCallback = null;
					/**
					 * Options for widget.
					 * It is empty object, because widget Page does not have any options.
					 * @property {Object} options
					 * @member ns.widget.wearable.Page
					 */
					self.options = {};
				},
				/**
				 * Dictionary for page related event types
				 * @property {Object} EventType
				 * @member ns.widget.wearable.Page
				 * @static
				 */
				EventType = {
					/**
					 * Triggered on the page we are transitioning to,
					 * after the transition animation has completed.
					 * @event pageshow
					 * @member ns.widget.wearable.Page
					 */
					SHOW: "pageshow",
					/**
					 * Triggered on the page we are transitioning away from,
					 * after the transition animation has completed.
					 * @event pagehide
					 * @member ns.widget.wearable.Page
					 */
					HIDE: "pagehide",
					/**
					 * Triggered when the page has been created in the DOM
					 * (for example, through Ajax) but before all widgets
					 * have had an opportunity to enhance the contained markup.
					 * @event pagecreate
					 * @member ns.widget.wearable.Page
					 */
					CREATE: "pagecreate",
					/**
					 * Triggered when the page is being initialized,
					 * before most plugin auto-initialization occurs.
					 * @event pagebeforecreate
					 * @member ns.widget.wearable.Page
					 */
					BEFORE_CREATE: "pagebeforecreate",
					/**
					 * Triggered on the page we are transitioning to,
					 * before the actual transition animation is kicked off.
					 * @event pagebeforeshow
					 * @member ns.widget.wearable.Page
					 */
					BEFORE_SHOW: "pagebeforeshow",
					/**
					 * Triggered on the page we are transitioning away from,
					 * before the actual transition animation is kicked off.
					 * @event pagebeforehide
					 * @member ns.widget.wearable.Page
					 */
					BEFORE_HIDE: "pagebeforehide"
				},
				/**
				 * Dictionary for page related css class names
				 * @property {Object} classes
				 * @member ns.widget.wearable.Page
				 * @static
				 * @readonly
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
				prototype = new BaseWidget();

			Page.classes = classes;
			Page.events = EventType;

			/**
			 * Selector for page element
			 * @property {string} [page=".ui-page"]
			 * @member ns.wearable.selectors
			 */
			selectors.page = "." + classes.uiPage;
			/**
			 * Selector for active page element
			 * @property {string} [activePage=".ui-page-active"]
			 * @member ns.wearable.selectors
			 */
			selectors.activePage = "." + classes.uiPageActive;
			/**
			 * Selector for section element
			 * @property {string} [section=".ui-section"]
			 * @member ns.wearable.selectors
			 */
			selectors.section = "." + classes.uiSection;
			/**
			 * Selector for header element
			 * @property {string} [header=".ui-header"]
			 * @member ns.wearable.selectors
			 */
			selectors.header = "." + classes.uiHeader;
			/**
			 * Selector for footer element
			 * @property {string} [footer=".ui-footer"]
			 * @member ns.wearable.selectors
			 */
			selectors.footer = "." + classes.uiFooter;
			/**
			 * Selector for content element
			 * @property {string} [content=".ui-content"]
			 * @member ns.wearable.selectors
			 */
			selectors.content = "." + classes.uiContent;
			/**
			 * Selector for page scroll element
			 * @property {string} [pageScroll=".ui-page-scroll"]
			 * @member ns.wearable.selectors
			 */
			selectors.pageScroll = "." + classes.uiPageScroll;

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method _contentFill
			 * @member ns.widget.wearable.Page
			 */
			prototype._contentFill = function () {
				var self = this,
					element = self.element,
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
			};

			/**
			 * Build page
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.Page
			 */
			prototype._build = function (element) {
				element.classList.add(classes.uiPage);
				return element;
			};

			/**
			 * This method sets page active or inactive.
			 * It sets ui-overlay-... class on `body` depending on current theme.
			 * @method setActive
			 * @param {boolean} value If true, then page will be active.
			 * Otherwise, page will be inactive.
			 * @member ns.widget.wearable.Page
			 */
			prototype.setActive = function (value) {
				var elementClassList = this.element.classList;
				if (value) {
					elementClassList.add(classes.uiPageActive);
				} else {
					elementClassList.remove(classes.uiPageActive);
				}
			};

			/**
			 * Return current status of page.
			 * @method isActive
			 * @member ns.widget.wearable.Page
			 * @instance
			 */
			prototype.isActive = function () {
				return this.element.classList.contains(classes.uiPageActive);
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.Page
			 */
			prototype._bindEvents = function (element) {
				var self = this;
				self.contentFillAfterResizeCallback = self._contentFill.bind(self);
				window.addEventListener("resize", self.contentFillAfterResizeCallback, false);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.Page
			 */
			prototype._refresh = function () {
				this._contentFill();
			};

			/**
			 * Layouting page structure
			 * @method layout
			 * @member ns.widget.wearable.Page
			 */
			prototype.layout = function () {
				this._contentFill();
			};

			/**
			 * This method triggers BEFORE_SHOW event.
			 * @method onBeforeShow
			 * @member ns.widget.wearable.Page
			 */
			prototype.onBeforeShow = function () {
				this.trigger(EventType.BEFORE_SHOW);
			};

			/**
			 * This method triggers SHOW event.
			 * @method onShow
			 * @member ns.widget.wearable.Page
			 */
			prototype.onShow = function () {
				this.trigger(EventType.SHOW);
			};

			/**
			 * This method triggers BEFORE_HIDE event.
			 * @method onBeforeHide
			 * @member ns.widget.wearable.Page
			 */
			prototype.onBeforeHide = function () {
				this.trigger(EventType.BEFORE_HIDE);
			};

			/**
			 * This method triggers HIDE event.
			 * @method onHide
			 * @member ns.widget.wearable.Page
			 */
			prototype.onHide = function () {
				this.trigger(EventType.HIDE);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.Page
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element;

				element = element || self.element;
				
				window.removeEventListener("resize", self.contentFillAfterResizeCallback, false);

				// destroy widgets on children
				engine.destroyAllWidgets(element, true);
			};

			Page.prototype = prototype;

			// definition
			ns.widget.wearable.Page = Page;
			engine.defineWidget(
				"page",
				"[data-role=page],.ui-page",
				["onBeforeShow", "onShow", "onBeforeHide", "onHide", "setActive", "layout"],
				Page,
				"wearable"
			);
			}(window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Page Widget
 * Page is main element of application's structure.
 *
 * ## Default selectors
 * In the Tizen TV Web UI framework the application page structure is based on a header, content and footer elements:
 *
 * - **The header** is placed at the top, and displays the page title and optionally buttons.
 * - **The content** is the section below the header, showing the main content of the page.
 * - **The footer** is abottom part of page which can display for example buttons
 *
 * ## Examples
 *
 * ### Empty header & footer
 * This is the standard page which can be fully arranged as one wishes. It is the basic version for all
 * pages.
 * 	@example
 * 		<div id="normal-page" class="ui-page" data-size="mini">
 * 			<div class="ui-content content-padding">
 * 				For create normal page create tag with class <i>ui-page</i>
 * 			</div>
 * 		</div>
 *
 * ### Title in header
 * A standard page can me enchanced with header containing title.
 * 	@example
 * 		<div id="normal-page" class="ui-page" data-size="mini">
 * 			<header class="ui-header">
 * 				<h2 class="ui-title">Title in header</h2>
 * 			</header>
 * 			<div class="ui-content content-padding">
 * 				For create normal page create tag with class <i>ui-page</i>
 * 			</div>
 * 		</div>
 *
 * ### Buttons in header
 * You can add buttons to header in case of need. By default text will appear on the left
 * side of the header and buttons on the right side.
 * 	@example
 * 		<div id="normal-page" class="ui-page" data-size="mini">
 * 			<header class="ui-header">
 * 				<a href="#" data-role="button">button 1</a>
 * 				<a href="#" data-role="button">button 2</a>
 * 				<h2 class="ui-title">Title in header</h2>
 * 			</header>
 * 			<div class="ui-content content-padding">
 * 				For create normal page create tag with class <i>ui-page</i>
 * 			</div>
 * 		</div>
 *
 * ### Structure with header and footer tag
 * 	@example
 * 		<div id="normal-page" class="ui-page" data-size="mini">
 * 			<header class="ui-header">
 * 				<h2 class="ui-title">Title in header</h2>
 * 			</header>
 * 			<div class="ui-content content-padding"></div>
 * 			<footer>
 * 				<div data-role="controlgroup" data-type="horizontal">
 * 					<a href="#" data-role="button">Button in footer</a>
 * 				</div>
 * 			</footer>
 * 		</div>
 *
 * ## Focus
 * Focus on page is working straightforward. Using diectional keys will make focus move in the
 * respective direction. Also using OK[remote control]/Enter[keyboard] while widget is focused
 * will send activation signal to it (response will differ between widgets).
 *
 * @class ns.widget.tv.Page
 * @extends ns.widget.wearable.Page
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	
				/**
			 * Alias for {@link ns.widget.wearable.Page}
			 * @property {Object} Page
			 * @member ns.widget.tv.Page
			 * @private
			 * @static
			 */
			var WearablePage = ns.widget.wearable.Page,
				WearablePagePrototype = WearablePage.prototype,
				/**
				 * Alias for {@link ns.widget.tv.BaseKeyboardSupport}
				 * @property {Object} BaseKeyboardSupport
				 * @member ns.widget.tv.Page
				 * @private
				 * @static
				 */
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				/**
				 * Dictionary for page related css class names.
				 * It bases on {@link ns.widget.wearable.Page.classes}
				 * @property {Object} classes
				 * @member ns.widget.tv.Page
				 * @static
				 */
				classes = WearablePage.classes,
				/**
				 * Alias for {@link ns.wearable.selectors}
				 * @property {Object} selectors
				 * @member ns.widget.tv.Page
				 * @private
				 * @static
				 */
				selectors = ns.wearable.selectors,
				/**
				 * Alias for {@link ns.util}
				 * @property {Object} util
				 * @member ns.widget.tv.Page
				 * @private
				 * @static
				 */
				util = ns.util,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.widget.tv.Page
				 * @private
				 * @static
				 */
				DOM = util.DOM,
				/**
				 * Alias for {@link ns.util.selectors}
				 * @property {Object} utilSelectors
				 * @member ns.widget.tv.Page
				 * @private
				 * @static
				 */
				utilSelectors = util.selectors,
				Page = function () {
					var self = this;
					BaseKeyboardSupport.call(self);
					self._ui = self._ui || {};
				},
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.tv.Page
				 * @private
				 * @static
				 */
				engine = ns.engine,
				FUNCTION_TYPE = "function",
				prototype = new WearablePage();

			classes.uiHeaderEmpty = "ui-header-empty";
			classes.uiFooterEmpty = "ui-footer-empty";
			classes.uiTitle = "ui-title";

			Page.events = WearablePage.events;
			Page.classes = classes;

			/**
			 * This method triggers SHOW event and turns keyboard support on.
			 * @method onShow
			 * @member ns.widget.tv.Page
			 */
			prototype.onShow = function() {
				WearablePagePrototype.onShow.call(this);
				this._supportKeyboard = true;
			};

			/**
			 * This method triggers HIDE event and turns keyboard support on.
			 * @method onHide
			 * @member ns.widget.tv.Page
			 */
			prototype.onHide = function() {
				WearablePagePrototype.onHide.call(this);
				this._supportKeyboard = false;
			};

			/**
			 * Method creates buttons defined in page header.
			 * @method _buildButtonsInHeader
			 * @param {HTMLElement} header
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._buildButtonsInHeader = function (header) {
				var headerButtons = [].slice.call(header.querySelectorAll("[data-role='button']")),
					headerButtonsLength = headerButtons.length,
					i;
				for (i = 0; i < headerButtonsLength; i++) {
					DOM.setNSData(headerButtons[i], "inline", "true");
				}
			};

			/**
			 * Method creates title defined in page header.
			 * @method _buildTitleInHeader
			 * @param {HTMLElement} header
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._buildTitleInHeader = function(header) {
				var title = header.querySelector("h1,h2,h3,h4,h5,h6,h7,h8");
				if (title) {
					title.classList.add(classes.uiTitle);
				}
			};

			/**
			 * Method creates empty page header. It also checks for additional
			 * content to be added in header.
			 * @method _buildHeader
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._buildHeader = function(element) {
				var self = this,
					header = utilSelectors.getChildrenBySelector(element, "header,." + classes.uiHeader)[0];
				// add class if header does not exist
				if (!header) {
					element.classList.add(classes.uiHeaderEmpty);
				} else {
					header.classList.add(classes.uiHeader);
					self._buildButtonsInHeader(header);
					self._buildTitleInHeader(header);
				}
				self._ui.header = header;
			};

			/**
			 * Method creates empty page footer.
			 * @method _buildFooter
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._buildFooter = function(element) {
				var footer = utilSelectors.getChildrenBySelector(element, "footer,." + classes.uiFooter)[0];
				// add class if footer does not exist
				if (!footer) {
					element.classList.add(classes.uiFooterEmpty);
				} else {
					footer.classList.add(classes.uiFooter);
				}
				this._ui.footer = footer;
			};

			/**
			 * Method creates empty page footer.
			 * @method _buildContent
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._buildContent = function(element) {
				var content = utilSelectors.getChildrenByClass(element, classes.uiContent)[0],
					next,
					child = element.firstChild,
					ui = this._ui;
				if (!content) {
					content = document.createElement("div");
					while (child) {
						next = child.nextSibling;
						if (child !== ui.footer && child !== ui.header) {
							content.appendChild(child);
						}
						child = next;
					}
				}

				element.insertBefore(content, ui.footer);
				content.classList.add(classes.uiContent);
				ui.content = content;
			};

			/**
			 * Build page
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._build = function(element) {
				var self = this;

				if (typeof WearablePagePrototype._build === FUNCTION_TYPE) {
					WearablePagePrototype._build.call(self, element);
				}

				self._buildHeader(element);
				self._buildFooter(element);
				self._buildContent(element);

				return element;
			};

			/**
			 * Clears header and footer class lists.
			 * @method _clearHeaderFooterInfo
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._clearHeaderFooterInfo = function(element) {
				var elementClassList = element.classList;
				elementClassList.remove(classes.uiHeaderEmpty);
				elementClassList.remove(classes.uiFooterEmpty);
			};

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method _contentFill
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._contentFill = function () {
				var self = this,
					element = self.element,
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
					nodeClasses,
					contentStyle,
					marginTop,
					marginBottom,
					marginLeft,
					marginRight,
					nodeStyle;

				elementStyle.width = screenWidth + "px";
				elementStyle.height = screenHeight + "px";

				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					nodeClasses = node.classList;
					if (nodeClasses.contains(headerSelector) ||
						nodeClasses.contains(footerSelector)) {
						extraHeight += DOM.getElementHeight(node, "outer", false, true);
					}
				}
				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					nodeStyle = node.style;
					if (node.classList.contains(contentSelector)) {
						contentStyle = window.getComputedStyle(node);
						marginTop = parseFloat(contentStyle.marginTop);
						marginBottom = parseFloat(contentStyle.marginBottom);
						marginLeft = parseFloat(contentStyle.marginLeft);
						marginRight = parseFloat(contentStyle.marginRight);
						// @todo always create (if it does not exist) footer and header
						nodeStyle.height = (screenHeight - extraHeight - marginTop - marginBottom) + "px";
						nodeStyle.width = (screenWidth - marginLeft - marginRight) + "px";
					}
				}
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._bindEvents = function(element) {
				WearablePagePrototype._bindEvents.call(this, element);
				this._bindEventKey();
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._destroy = function() {
				this._destroyEventKey();
				WearablePagePrototype._destroy.call(this);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.tv.Page
			 */
			prototype._refresh = function() {
				var self = this,
					element = self.element;
				WearablePagePrototype._refresh.call(self);
				self._clearHeaderFooterInfo(element);
				self._build(element);
				self._contentFill();
			};

			Page.prototype = prototype;

			// definition
			ns.widget.tv.Page = Page;

			selectors.page = "[data-role=page],.ui-page";

			engine.defineWidget(
				"page",
				"[data-role=page],.ui-page",
				["onBeforeShow", "onShow", "onBeforeHide", "onHide", "setActive"],
				Page,
				"tv",
				true
			);
			}(window.document, ns));

/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Callback Utility
 * Class creates a callback list
 *
 * Create a callback list using the following parameters:
 *  options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 * @class ns.util.callbacks
 */
(function (window, document, ns) {
	
				ns.util.callbacks = function (orgOptions) {

				var object = ns.util.object,
					options = object.copy(orgOptions),
					/**
					 * Alias to Array.slice function
					 * @method slice
					 * @member ns.util.callbacks
					 * @private
					 */
					slice = [].slice,
					/**
					 * Last fire value (for non-forgettable lists)
					 * @property {Object} memory
					 * @member ns.util.callbacks
					 * @private
					 */
					memory,
					/**
					 * Flag to know if list was already fired
					 * @property {boolean} fired
					 * @member ns.util.callbacks
					 * @private
					 */
					fired,
					/**
					 * Flag to know if list is currently firing
					 * @property {boolean} firing
					 * @member ns.util.callbacks
					 * @private
					 */
					firing,
					/**
					 * First callback to fire (used internally by add and fireWith)
					 * @property {number} [firingStart=0]
					 * @member ns.util.callbacks
					 * @private
					 */
					firingStart,
					/**
					 * End of the loop when firing
					 * @property {number} firingLength
					 * @member ns.util.callbacks
					 * @private
					 */
					firingLength,
					/**
					 * Index of currently firing callback (modified by remove if needed)
					 * @property {number} firingIndex
					 * @member ns.util.callbacks
					 * @private
					 */
					firingIndex,
					/**
					 * Actual callback list
					 * @property {Array} list
					 * @member ns.util.callbacks
					 * @private
					 */
					list = [],
					/**
					 * Stack of fire calls for repeatable lists
					 * @property {Array} stack
					 * @member ns.util.callbacks
					 * @private
					 */
					stack = !options.once && [],
					fire,
					add,
					self = {
						/**
						 * Add a callback or a collection of callbacks to the list
						 * @method add
						 * @param {..Function} list
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						add: function () {
							if (list) {
								// First, we save the current length
								var start = list.length;
								add(arguments);
								// Do we need to add the callbacks to the
								// current firing batch?
								if (firing) {
									firingLength = list.length;
								// With memory, if we're not firing then
								// we should call right away
								} else if (memory) {
									firingStart = start;
									fire(memory);
								}
							}
							return this;
						},
						/**
						 * Remove a callback from the list
						 * @method remove
						 * @param {..Function} list
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						remove: function () {
							if (list) {
								slice.call(arguments).forEach(function (arg) {
									var index = list.indexOf(arg);
									while (index > -1) {
										list.splice(index, 1);
										// Handle firing indexes
										if (firing) {
											if (index <= firingLength) {
												firingLength--;
											}
											if (index <= firingIndex) {
												firingIndex--;
											}
										}
										index = list.indexOf(arg, index);
									}
								});
							}
							return this;
						},
						/**
						 * Check if a given callback is in the list. 
						 * If no argument is given,
						 * return whether or not list has callbacks attached.
						 * @method has
						 * @param {Funciton} fn
						 * @return {boolean}
						 * @member ns.util.callbacks
						 */
						has: function (fn) {
							return fn ? !!list && list.indexOf(fn) > -1 : !!(list && list.length);
						},
						/**
						 * Remove all callbacks from the list
						 * @method empty
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						empty: function () {
							list = [];
							firingLength = 0;
							return this;
						},
						/**
						 * Have the list do nothing anymore
						 * @method disable
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						disable: function () {
							list = stack = memory = undefined;
							return this;
						},
						/**
						 * Is it disabled?
						 * @method disabled
						 * @return {boolean}
						 * @member ns.util.callbacks
						 */
						disabled: function () {
							return !list;
						},
						/**
						 * Lock the list in its current state
						 * @method lock
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						lock: function () {
							stack = undefined;
							if (!memory) {
								self.disable();
							}
							return this;
						},
						/**
						 * Is it locked?
						 * @method locked
						 * @return {boolean} stack
						 * @member ns.util.callbacks
						 */
						locked: function () {
							return !stack;
						},
						/**
						 * Call all callbacks with the given context and
						 * arguments
						 * @method fireWith
						 * @param {Object} context
						 * @param {Array} args
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						fireWith: function (context, args) {
							if (list && (!fired || stack)) {
								args = args || [];
								args = [context, args.slice ? args.slice() : args];
								if (firing) {
									stack.push(args);
								} else {
									fire(args);
								}
							}
							return this;
						},
						/**
						 * Call all the callbacks with the given arguments
						 * @method fire
						 * @param {...*} argument
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						fire: function () {
							self.fireWith(this, arguments);
							return this;
						},
						/**
						 * To know if the callbacks have already been called at
						 * least once
						 * @method fired
						 * @return {booblean}
						 * @chainable
						 * @member ns.util.callbacks
						 */
						fired: function () {
							return !!fired;
						}
					};
				/**
				 * Adds functions to the callback list
				 * @method add
				 * @param {...*} argument
				 * @member ns.util.bezierCurve
				 * @private
				 */
				add = function (args) {
					slice.call(args).forEach(function (arg) {
						var type = typeof arg;
						if (type === "function") {
							if (!options.unique || !self.has(arg)) {
								list.push(arg);
							}
						} else if (arg && arg.length && type !== "string") {
							// Inspect recursively
							add(arg);
						}
					});
				};
				/**
				 * Fire callbacks
				 * @method fire
				 * @param {Array} data
				 * @member ns.util.bezierCurve
				 * @private
				 */
				fire = function (data) {
					memory = options.memory && data;
					fired = true;
					firingIndex = firingStart || 0;
					firingStart = 0;
					firingLength = list.length;
					firing = true;
					while (list && firingIndex < firingLength) {
						if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
							memory = false; // To prevent further calls using add
							break;
						}
						firingIndex++;
					}
					firing = false;
					if (list) {
						if (stack) {
							if (stack.length) {
								fire(stack.shift());
							}
						} else if (memory) {
							list = [];
						} else {
							self.disable();
						}
					}
				};

				return self;
			};

			}(window, window.document, ns));

/*global window, define, RegExp */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Deferred Utility
 * Class creates object which can call registered callback depend from
 * state of object..
 * @class ns.util.deferred
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */(function (window, document, ns) {
	
	
			var Deferred = function (callback) {
				var callbacks = ns.util.callbacks,
					object = ns.util.object,
					/**
					 * Register additional action for deferred object
					 * @property {Array} tuples
					 * @member ns.util.deferred
					 * @private
					 */
					tuples = [
						// action, add listener, listener list, final state
						["resolve", "done", callbacks({once: true, memory: true}), "resolved"],
						["reject", "fail", callbacks({once: true, memory: true}), "rejected"],
						["notify", "progress", callbacks({memory: true})]
					],
					state = "pending",
					deferred = {},
					promise = {
						/**
						 * Determine the current state of a Deferred object.
						 * @method state
						 * @return {"pending" | "resolved" | "rejected"} representing the current state
						 * @member ns.util.deferred
						 */
						state: function () {
							return state;
						},
						/**
						 * Add handlers to be called when the Deferred object
						 * is either resolved or rejected.
						 * @method always
						 * @param {...Function}
						 * @return {ns.util.deferred} self
						 * @member ns.util.deferred
						 */
						always: function () {
							deferred.done(arguments).fail(arguments);
							return this;
						},
						/**
						 * Add handlers to be called when the Deferred object
						 * is resolved, rejected, or still in progress.
						 * @method then
						 * @param {?Function} callback assign when done
						 * @param {?Function} callback assign when fail
						 * @param {?Function} callback assign when progress
						 * @return {Object} returns a new promise
						 * @member ns.util.deferred
						 */
						then: function () {/* fnDone, fnFail, fnProgress */
							var functions = arguments;
							return new Deferred(function (newDefer) {
								tuples.forEach(function (tuple, i) {
									var fn = (typeof functions[i] === 'function') && functions[i];
									// deferred[ done | fail | progress ] for forwarding actions to newDefer
									deferred[tuple[1]](function () {
										var returned = fn && fn.apply(this, arguments);
										if (returned && (typeof returned.promise === 'function')) {
											returned.promise()
												.done(newDefer.resolve)
												.fail(newDefer.reject)
												.progress(newDefer.notify);
										} else {
											newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
										}
									});
								});
								functions = null;
							}).promise();
						},
						/**
						 * Get a promise for this deferred. If obj is provided,
						 * the promise aspect is added to the object
						 * @method promise
						 * @param {Object} obj
						 * @return {Object} return a Promise object
						 * @member ns.util.deferred
						 */
						promise: function (obj) {
							if (obj) {
								return object.merge(obj, promise);
							}
							return promise;
						}
					};

				/**
				 * alias for promise.then, Keep pipe for back-compat
				 * @method pipe
				 * @member ns.util.deferred
				 */
				promise.pipe = promise.then;

				// Add list-specific methods

				tuples.forEach(function (tuple, i) {
					var list = tuple[2],
						stateString = tuple[3];

					// promise[ done | fail | progress ] = list.add
					promise[tuple[1]] = list.add;

					// Handle state
					if (stateString) {
						list.add(function () {
							// state = [ resolved | rejected ]
							state = stateString;

						// [ reject_list | resolve_list ].disable; progress_list.lock
						}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
					}

					// deferred[ resolve | reject | notify ]
					deferred[tuple[0]] = function () {
						deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
						return this;
					};
					deferred[tuple[0] + "With"] = list.fireWith;
				});

				// Make the deferred a promise
				promise.promise(deferred);

				// Call given func if any
				if (callback) {
					callback.call(deferred, deferred);
				}

				// All done!
				return deferred;
			};
			ns.util.deferred = Deferred;
			}(window, window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Popup Widget
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @class ns.widget.core.Popup
 * @extends ns.widget.Popup
 */
(function (ns) {
	
					/**
				 * Alias for {@link ns.widget.BaseWidget}
				 * @property {Function} BaseWidget
				 * @member ns.widget.core.Popup
				 * @private
				 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for class ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.core.Popup
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Alias for class ns.util.object
				 * @property {Object} objectUtils
				 * @member ns.widget.core.Popup
				 * @private
				 */
				objectUtils = ns.util.object,
				/**
				 * Alias for class ns.util.deferred
				 * @property {Object} UtilDeferred
				 * @member ns.widget.core.Popup
				 * @private
				 */
				UtilDeferred = ns.util.deferred,
				/**
				 * Alias for class ns.util.selectors
				 * @property {Object} utilSelector
				 * @member ns.widget.core.Popup
				 * @private
				 */
				utilSelector = ns.util.selectors,

				Popup = function () {
					var self = this,
						ui = {};

					self.selectors = selectors;
					self.options = objectUtils.merge({}, Popup.defaults);
					/**
					 * Popup state flag
					 * @property {0|1|2|3} [state=null]
					 * @member ns.widget.core.Popup
					 * @private
					 */
					self.state = states.CLOSED;

					ui.overlay = null;
					ui.header = null;
					ui.footer = null;
					ui.content = null;
					ui.container = null;
					self._ui = ui;

					// event callbacks
					self._callbacks = {};
				},
				/**
				 * Object with default options
				 * @property {Object} defaults
				 * @property {string} [options.transition="none"] Sets the default transition for the popup.
				 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
				 * @property {boolean} [options.dismissible=true] Sets whether to close popup when a popup is open to support the back button.
				 * @property {boolean} [options.overlay=true] Sets whether to show overlay when a popup is open.
				 * @property {boolean|string} [options.header=false] Sets content of header.
				 * @property {boolean|string} [options.footer=false] Sets content of footer.
				 * @property {string} [overlayClass=""] Sets the custom class for the popup background, which covers the entire window.
				 * @property {boolean} [options.history=true] Sets whether to alter the url when a popup is open to support the back button.
				 * @member ns.widget.core.Popup
				 * @static
				 */
				defaults = {
					transition: "none",
					dismissible: true,
					overlay: true,
					header: false,
					footer: false,
					overlayClass: "",
					history: true
				},
				states = {
					DURING_OPENING: 0,
					OPENED: 1,
					DURING_CLOSING: 2,
					CLOSED: 3
				},
				CLASSES_PREFIX = "ui-popup",
				/**
				 * Dictionary for popup related css class names
				 * @property {Object} classes
				 * @member ns.widget.core.Popup
				 * @static
				 */
				classes = {
					popup: CLASSES_PREFIX,
					active: CLASSES_PREFIX + "-active",
					overlay: CLASSES_PREFIX + "-overlay",
					header: CLASSES_PREFIX + "-header",
					footer: CLASSES_PREFIX + "-footer",
					content: CLASSES_PREFIX + "-content"
				},
				selectors = {
					header: "." + classes.header,
					content: "." + classes.content,
					footer: "." + classes.footer
				},
				EVENTS_PREFIX = "popup",
				/**
				 * Dictionary for popup related selectors
				 * @property {Object} selectors
				 * @member ns.widget.core.Popup
				 * @static
				 */
				selectors = {
					header: "." + classes.header,
					content: "." + classes.content,
					footer: "." + classes.footer
				},
				/**
				 * Dictionary for popup related events
				 * @property {Object} events
				 * @member ns.widget.core.Popup
				 * @static
				 */
				events = {
					/**
					 * Triggered when the popup has been created in the DOM (via ajax or other) but before all widgets have had an opportunity to enhance the contained markup.
					 * @event popupshow
					 * @member ns.widget.core.Popup
					 */
					show: EVENTS_PREFIX + "show",
					/**
					 * Triggered on the popup after the transition animation has completed.
					 * @event popuphide
					 * @member ns.widget.core.Popup
					 */
					hide: EVENTS_PREFIX + "hide",
					/**
					 * Triggered on the popup we are transitioning to, before the actual transition animation is kicked off.
					 * @event popupbeforeshow
					 * @member ns.widget.core.Popup
					 */
					before_show: EVENTS_PREFIX + "beforeshow",
					/**
					 * Triggered on the popup we are transitioning away from, before the actual transition animation is kicked off.
					 * @event popupbeforehide
					 * @member ns.widget.core.Popup
					 */
					before_hide: EVENTS_PREFIX + "beforehide"
				},

				prototype = new BaseWidget();

			Popup.classes = classes;
			Popup.events = events;
			Popup.defaults = defaults;

			/**
			 * Build the content of popup
			 * @method _buildContent
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._buildContent = function (element) {
				var self = this,
					ui = self._ui,
					selectors = self.selectors,
					content = ui.content || element.querySelector(selectors.content),
					footer = ui.footer || element.querySelector(selectors.footer),
					elementChildren = [].slice.call(element.childNodes),
					elementChildrenLength = elementChildren.length,
					i,
					node;

				if (!content) {
					content = document.createElement("div");
					content.className = classes.content;
					for (i = 0; i < elementChildrenLength; ++i) {
						node = elementChildren[i];
						if (node !== ui.footer && node !== ui.header) {
							content.appendChild(node);
						}
					}
					element.insertBefore(content, footer);
				}
				content.classList.add(classes.content);
				ui.content = content;
			};

			/**
			 * Build the header of popup
			 * @method _buildHeader
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._buildHeader = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					selectors = self.selectors,
					content = ui.content || element.querySelector(selectors.content),
					header = ui.header || element.querySelector(selectors.header);
				if (!header && options.header !== false) {
					header = document.createElement("div");
					header.className = classes.header;
					if (typeof options.header !== "boolean") {
						header.innerHTML = options.header;
					}
					element.insertBefore(header, content);
				}
				if (header) {
					header.classList.add(classes.header);
				}
				ui.header = header;
			};

			/**
			 * Set the header of popup.
			 * This function is called by function "option" when the option "header" is set.
			 * @method _setHeader
			 * @param {HTMLElement} element
			 * @param {boolean|string} value
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._setHeader = function (element, value) {
				var self = this,
					ui = self._ui,
					header = ui.header;
				if (header) {
					header.parentNode.removeChild(header);
					ui.header = null;
				}
				self.options.header = value;
				self._buildHeader(ui.container);
			};

			/**
			 * Build the footer of popup
			 * @method _buildFooter
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._buildFooter = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					footer = ui.footer || element.querySelector(self.selectors.footer);
				if (!footer && options.footer !== false) {
					footer = document.createElement("div");
					footer.className = classes.footer;
					if (typeof options.footer !== "boolean") {
						footer.innerHTML = options.footer;
					}
					element.appendChild(footer);
				}
				if (footer) {
					footer.classList.add(classes.footer);
				}
				ui.footer = footer;
			};

			/**
			 * Set the footer of popup.
			 * This function is called by function "option" when the option "footer" is set.
			 * @method _setFooter
			 * @param {HTMLElement} element
			 * @param {boolean|string} value
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._setFooter = function (element, value) {
				var self = this,
					ui = self._ui,
					footer = ui.footer;
				if (footer) {
					footer.parentNode.removeChild(footer);
					ui.footer = null;
				}
				self.options.footer = value;
				self._buildFooter(ui.container);
			};

			/**
			 * Build structure of Popup widget
			 * @method _build
			 * @param {HTMLElement} element of popup
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.Popup
			 */
			prototype._build = function (element) {
				var self = this,
					container = self._ui.container || element;

				// build header, footer and content
				this._buildHeader(container);
				this._buildFooter(container);
				this._buildContent(container);

				// set overlay
				this._setOverlay(element, this.options.overlay);

				return element;
			};

			/**
			 * Set overlay
			 * @method _setOverlay
			 * @param {HTMLElement} element
			 * @param {boolean} enable
			 * @protected
			 * @member ns.widget.Popup
			 */
			prototype._setOverlay = function(element, enable) {
				var self = this,
					overlayClass = self.options.overlayClass,
					ui = self._ui,
					overlay = ui.overlay;

				// create overlay
				if (enable) {
					if (!overlay) {
						overlay = document.createElement("div");
						element.parentNode.insertBefore(overlay, element);
						ui.overlay = overlay;
					}
					overlay.className = classes.overlay + (overlayClass ? " " + overlayClass : "");
				} else if (overlay) {
					overlay.parentNode.removeChild(overlay);
					ui.overlay = null;
				}
			};

			/**
			 * Returns the state of the popup
			 * @method _isActive
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._isActive = function () {
				var state = this.state;
				return state === states.DURING_OPENING || state === states.OPENED;
			};

			/**
			 * Returns true if popup is already opened and visible
			 * @method _isActive
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._isOpened = function () {
				return this.state === states.OPENED;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._init = function(element) {
				var self = this,
					selectors = self.selectors,
					ui = self._ui;

				ui.header = ui.header || element.querySelector(selectors.header);
				ui.footer = ui.footer || element.querySelector(selectors.footer);
				ui.content = ui.content || element.querySelector(selectors.content);
				ui.container = element;
				// @todo - use selector from page's definition in engine
				ui.page = utilSelector.getClosestByClass(element, "ui-page") || window;
			};

			/**
			 * Set the state of the popup
			 * @method _setActive
			 * @param {boolean} active
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._setActive = function (active) {
				var self = this,
					activeClass = classes.active,
					elementClassList = self.element.classList,
					route = engine.getRouter().getRoute("popup"),
					options = self.options;

				// NOTE: popup's options object is stored in window.history at the router module,
				// and this window.history can't store DOM element object.
				if (typeof options.positionTo !== "string") {
					options.positionTo = null;
				}

				// set state of popup and add proper class
				if (active) {
					// set global variable
					route.setActive(self, options);
					// add proper class
					elementClassList.add(activeClass);
					// set state of popup 	358
					self.state = states.OPENED;
				} else {
					// no popup is opened, so set global variable on "null"
					route.setActive(null, options);
					// remove proper class
					elementClassList.remove(activeClass);
					// set state of popup
					self.state = states.CLOSED;
				}
			};

			/**
			 * Bind events
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._bindEvents = function (element) {
				var self = this;

				self._ui.page.addEventListener("pagebeforehide", self, false);
				window.addEventListener("resize", self, false);
				self._bindOverlayEvents();
			};

			/**
			 * Bind "click" event for overlay
			 * @method _bindOverlayEvents
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._bindOverlayEvents = function () {
				var overlay = this._ui.overlay;
				if (overlay) {
					overlay.addEventListener("click", this, false);
				}
			};

			/**
			 * Unbind "click" event for overlay
			 * @method _bindOverlayEvents
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._unbindOverlayEvents = function () {
				var overlay = this._ui.overlay;
				if (overlay) {
					overlay.removeEventListener("click", this, false);
				}
			};

			/**
			 * Unbind events
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._unbindEvents = function (element) {
				var self = this;
				self._ui.page.removeEventListener("pagebeforehide", self, false);
				window.removeEventListener("resize", self, false);
				self._unbindOverlayEvents();
			};

			/**
			 * Open the popup
			 * @method open
			 * @param {Object=} [options]
			 * @param {string=} [options.transition] options.transition
			 * @member ns.widget.core.Popup
			 */
			prototype.open = function (options) {
				var self = this,
					newOptions = objectUtils.merge(self.options, options);
				if (!self._isActive()) {
					if (!newOptions.dismissible) {
						engine.getRouter().lock();
					}
					self._show(newOptions);
				}
			};

			/**
			 * Close the popup
			 * @method close
			 * @param {Object=} [options]
			 * @param {string=} [options.transition]
			 * @member ns.widget.core.Popup
			 */
			prototype.close = function (options) {
				var self = this,
					newOptions = objectUtils.merge(self.options, options);

				if (self._isActive()) {
					if (!newOptions.dismissible) {
						engine.getRouter().unlock();
					}
					self._hide(newOptions);
				}
			};

			/**
			 * Show popup.
			 * @method _show
			 * @param {object} options
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._show = function (options) {
				var self = this,
					transitionOptions = objectUtils.merge({}, options),
					deferred;

				// change state of popup
				self.state = states.DURING_OPENING;
				// set transiton
				transitionOptions.ext = " in ";

				self.trigger(events.before_show);
				// start opening animation
				self._transition(transitionOptions, self._onShow.bind(self));
			};

			/**
			 * Show popup
			 * @method _onShow
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onShow = function() {
				var self = this,
					overlay = self._ui.overlay;
				if (overlay) {
					overlay.style.display = "block";
				}
				self._setActive(true);
				self.trigger(events.show);
			};

			/**
			 * Hide popup
			 * @method _hide
			 * @param {object} options
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._hide = function (options) {
				var self = this,
					isOpened = self._isOpened();

				// change state of popup
				self.state = states.DURING_CLOSING;

				self.trigger(events.before_hide);

				if (isOpened) {
					// popup is opened, so we start closing animation
					options.ext = " out ";
					self._transition(options, self._onHide.bind(self));
				} else {
					// popup is active, but not opened yet (DURING_OPENING), so
					// we stop opening animation
					self._callbacks.transitionDeferred.reject();
					self._callbacks.animationEnd();
					// and set popup as inactive
					self._onHide();
				}
			};

			/**
			 * Hide popup
			 * @method _onHide
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onHide = function() {
				var self = this,
					overlay = self._ui.overlay;
				if (overlay) {
					overlay.style.display = "";
				}
				self._setActive(false);
				self.trigger(events.hide);
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.Popup
			 */
			prototype.handleEvent = function(event) {
				var self = this;
				switch(event.type) {
					case "pagebeforehide":
						self.close({transition: "none"});
						break;
					case "resize":
						self._onResize(event);
						break;
					case "click":
						if ( event.target === self._ui.overlay ) {
							self._onClickOverlay(event);
						}
						break;
				}
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._refresh = function() {
				var self = this;
				self._unbindOverlayEvents();
				self._setOverlay(self.element, self.options.overlay);
				self._bindOverlayEvents();
			};

			/**
			 * Callback function fires after clicking on overlay.
			 * @method _onClickOverlay
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onClickOverlay = function(event) {
				var options = this.options;

				event.preventDefault();
				event.stopPropagation();

				if (options.dismissible) {
					this.close();
				}
			};

			/**
			 * Callback function fires on resizing
			 * @method _onResize
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onResize = function() {
				if (this._isOpened()) {
					this._refresh();
				}
			};

			function clearAnimation(self, transitionClass, deferred) {
				var element = self.element,
					elementClassList = element.classList,
					overlay = self._ui.overlay,
					animationEndCallback = self._callbacks.animationEnd;

				// remove callbacks on animation events
				element.removeEventListener("animationend", animationEndCallback, false);
				element.removeEventListener("webkitAnimationEnd", animationEndCallback, false);

				// clear classes
				transitionClass.split(" ").forEach(function (currentClass) {
					currentClass = currentClass.trim();
					if (currentClass.length > 0) {
						elementClassList.remove(currentClass);
						if (overlay) {
							overlay.classList.remove(currentClass);
						}
					}
				});
				if (deferred.state() === "pending") {
					// we resolve only pending (not rejected) deferred
					deferred.resolve();
				}
			}

			function setTransitionDeferred(self, resolve) {
				var deferred = new UtilDeferred();

				deferred.then(function() {
					if (deferred === self._callbacks.transitionDeferred) {
						resolve();
					}
				});

				self._callbacks.transitionDeferred = deferred;
				return deferred;
			}
			/**
			 * Animate popup opening/closing
			 * @method _transition
			 * @protected
			 * @param {Object} [options]
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext]
			 * @param {?Function} [resolve]
			 * @member ns.widget.core.Popup
			 */
			prototype._transition = function (options, resolve) {
				var self = this,
					transition = options.transition || self.options.transition || "none",
					transitionClass = transition + options.ext,
					element = self.element,
					overlay = self._ui.overlay,
					elementClassList = element.classList,
					deferred,
					animationEndCallback;

				deferred = setTransitionDeferred(self, resolve);

				if (transition !== "none") {
					// set animationEnd callback
					animationEndCallback = clearAnimation.bind(null, self, transitionClass, deferred);
					self._callbacks.animationEnd = animationEndCallback;

					// add animation callbacks
					element.addEventListener("animationend", animationEndCallback, false);
					element.addEventListener("webkitAnimationEnd", animationEndCallback, false);
					// add transition classes
					transitionClass.split(" ").forEach(function (currentClass) {
						currentClass = currentClass.trim();
						if (currentClass.length > 0) {
							elementClassList.add(currentClass);
							if (overlay) {
								overlay.classList.add(currentClass);
							}
						}
					});
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
				return deferred;
			};

			/**
			 * Destroy popup
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._destroy = function() {
				var self = this,
					element = self.element;

				self._unbindEvents(element);
				self._setOverlay(element, false);
			};

			Popup.prototype = prototype;

			ns.widget.core.Popup = Popup;

			engine.defineWidget(
				"Popup",
				"[data-role='popup'], .ui-popup",
				[
					"open",
					"close",
					"reposition"
				],
				Popup,
				"core"
			);
			}(ns));

/*global window, define */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
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
/*jslint nomen: true, plusplus: true */

/**
 * # Popup Widget
 * Shows a pop-up window.
 *
 * The popup widget shows in the middle of the screen a list of items in a pop-up window. It automatically optimizes the pop-up window size within the screen. The following table describes the supported popup classes.
 *
 * ## Default selectors
 * All elements with class *ui-popup* will be become popup widgets.
 *
 * The pop-up window can contain a header, content, and footer area like the page element.
 *
 * To open a pop-up window from a link, use the data-rel attribute in HTML markup as in the following code:
 *
 *      @example
 *      <a href="#popup" class="ui-btn" data-rel="popup">Open popup when clicking this element.</a>
 *
 * The following table shows examples of various types of popups.
 *
 * The popup contains header, content and footer area
 *
 * ###HTML Examples
 *
 * #### Basic popup with header, content, footer
 *
 *		@example
 *		<div class="ui-page">
 *		    <div class="ui-popup">
 *		        <div class="ui-popup-header">Power saving mode</div>
 *		        <div class="ui-popup-content">
 *		            Turning on Power
 *		            saving mode will
 *		            limit the maximum
 *		            per
 *		        </div>
 *		        <div class="ui-popup-footer">
 *		            <button id="cancel" class="ui-btn">Cancel</button>
 *		        </div>
 *		    </div>
 *		</div>
 *
 * #### Popup with 2 buttons in the footer
 *
 *      @example
 *         <div id="2btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Delete</div>
 *             <div class="ui-popup-content">
 *                 Delete the image?
 *             </div>
 *             <div class="ui-popup-footer ui-grid-col-2">
 *                 <button id="2btnPopup-cancel" class="ui-btn">Cancel</button>
 *                 <button id="2btnPopup-ok" class="ui-btn">OK</button>
 *             </div>
 *         </div>
 *
 * #### Popup with checkbox/radio
 *
 * If you want make popup with list checkbox(or radio) just include checkbox (radio) to popup and add class *ui-popup-checkbox-label* to popup element.
 *
 *		@example
 *         <div id="listBoxPopup" class="ui-popup">
 *             <div class="ui-popup-header">When?</div>
 *             <div class="ui-popup-content" style="height:243px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="check-1" class="ui-popup-checkbox-label">Yesterday</label>
 *                         <input type="checkbox" name="checkset" id="check-1" />
 *                     </li>
 *                     <li>
 *                         <label for="check-2" class="ui-popup-checkbox-label">Today</label>
 *                         <input type="checkbox" name="checkset" id="check-2" />
 *                     </li>
 *                     <li>
 *                         <label for="check-3" class="ui-popup-checkbox-label">Tomorrow</label>
 *                         <input type="checkbox" name="checkset" id="check-3" />
 *                     </li>
 *                 </ul>
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="radio-1" class="ui-popup-radio-label">Mandatory</label>
 *                         <input type="radio" name="radioset" id="radio-1" />
 *                     </li>
 *                     <li>
 *                         <label for="radio-2" class="ui-popup-radio-label">Optional</label>
 *                         <input type="radio" name="radioset" id="radio-2" />
 *                     </li>
 *                 </ul>
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="listBoxPopup-close" class="ui-btn">Close</button>
 *             </div>
 *         </div>
 *     </div>
 *
 * #### Popup with no header and footer
 *
 *      @example
 *         <div id="listNoTitleNoBtnPopup" class="ui-popup">
 *             <div class="ui-popup-content" style="height:294px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li><a href="">Ringtones 1</a></li>
 *                     <li><a href="">Ringtones 2</a></li>
 *                     <li><a href="">Ringtones 3</a></li>
 *                 </ul>
 *             </div>
 *         </div>
 *
 * #### Toast popup
 *
 *      @example
 *         <div id="PopupToast" class="ui-popup ui-popup-toast">
 *             <div class="ui-popup-content">Saving contacts to sim on Samsung</div>
 *         </div>
 *
 * ### Create Option popup
 *
 * Popup inherits value of option positionTo from property data-position-to set in link.
 *
 *		@example
 *		<!--definition of link, which opens popup and sets its position-->
 *		<a href="#popupOptionText" data-rel="popup"  data-position-to="origin">Text</a>
 *		<!--definition of popup, which inherites property position from link-->
 *		<div id="popupOptionText" class="ui-popup">
 *			<div class="ui-popup-content">
 *				<ul class="ui-listview">
 *				<li><a href="#">Option 1</a></li>
 *				<li><a href="#">Option 2</a></li>
 *				<li><a href="#">Option 3</a></li>
 *				<li><a href="#">Option 4</a></li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * ### Opening and closing popup
 *
 * To open popup from "a" link using html markup, use the following code:
 *
 *		@example
 *      <div class="ui-page">
 *          <header class="ui-header">
 *              <h2 class="ui-title">Call menu</h2>
 *          </header>
 *          <div class="ui-content">
 *              <a href="#popup" class="ui-btn" data-rel="popup" >Open Popup</a>
 *          </div>
 *
 *          <div id="popup" class="ui-popup">
 *               <div class="ui-popup-header">Power saving mode</div>
 *                   <div class="ui-popup-content">
 *                       Turning on Power
 *                       saving mode will
 *                       limit the maximum
 *                       per
 *                   </div>
 *               <div class="ui-popup-footer">
 *               <button id="cancel" class="ui-btn">Cancel</button>
 *           </div>
 *       </div>
 *
 *  To open the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.openPopup("popup")
 *
 *  To close the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.closePopup("popup")
 *
 * To find the currently active popup, use the ui-popup-active class.
 *
 * To bind the popup to a button, use the following code:
 *
 *      @example
 *         <!--HTML code-->
 *         <div id="1btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Power saving mode</div>
 *             <div class="ui-popup-content">
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="1btnPopup-cancel" class="ui-btn">Cancel</button>
 *             </div>
 *         </div>
 *         <script>
 *             // Popup opens with button click
 *             var button = document.getElementById("button");
 *             button.addEventListener("click", function() {
 *                 tau.openPopup("#1btnPopup");
 *             });
 *
 *             // Popup closes with Cancel button click
 *             document.getElementById("1btnPopup-cancel").addEventListener("click", function() {
 *                 tau.closePopup();
 *             });
 *         </script>
 *
 * ## Manual constructor
 * For manual creation of popup widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.popup(buttonElement);
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*.
 *
 * ## Options for Popup Widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.popup(buttonElement);
 *
 *		popup.methodName(methodArgument1, methodArgument2, ...);
 *
 * ## Transitions
 *
 * By default, the framework doesn't apply transition. To set a custom transition effect, add the data-transition attribute to the link.
 *
 *		@example
 *		<a href="index.html" data-rel="popup" data-transition="slideup">I'll slide up</a>
 *
 * Global configuration:
 *
 *		@example
 *		gear.ui.defaults.popupTransition = "slideup";
 *
 * ### Transitions list
 *
 * - **none** Default value, no transition.
 * - **slideup** Makes the content of the pop-up slide up.
 *
 * ## Handling Popup Events
 *
 * To use popup events, use the following code:
 *
 *      @example
 *         <!--Popup html code-->
 *         <div id="popup" class="ui-popup">
 *             <div class="ui-popup-header"></div>
 *             <div class="ui-popup-content"></div>
 *         </div>
 *         </div>
 *         <script>
 *             // Use popup events
 *             var popup = document.getElementById("popup");
 *             popup.addEventListener("popupbeforecreate", function() {
 *                 // Implement code for popupbeforecreate event
 *             });
 *         </script>
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @class ns.widget.core.Popup
 * @extends ns.widget.core.BasePopup
 */
(function (window, document, ns) {
	
	
			var Popup = ns.widget.core.Popup,

				PopupPrototype = Popup.prototype,

				engine = ns.engine,

				objectUtils = ns.util.object,

				domUtils = ns.util.DOM,

				/**
				 * Object with default options
				 * @property {Object} defaults
				 * @property {string} [options.transition="none"] Sets the default transition for the popup.
				 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
				 * @property {boolean} [options.dismissible=true] Sets whether to close popup when a popup is open to support the back button.
				 * @property {boolean} [options.overlay=true] Sets whether to show overlay when a popup is open.
				 * @property {string} [overlayClass=""] Sets the custom class for the popup background, which covers the entire window.
				 * @property {boolean} [options.history=true] Sets whether to alter the url when a popup is open to support the back button.
				 * @property {string} [options.arrow="l,t,r,b"] Sets directions of popup's arrow by priority ("l" for left, "t" for top,
				 * "r" for right, and "b" for bottom). The first one has the highest priority, the last one - the lowest. If you set arrow="t",
				 * then arrow will be placed at the top of popup container and the whole popup will be placed under cliced element.
				 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
				 * @property {number} [options.distance=0] Sets the extra distance in px from clicked element.
				 * @member ns.widget.core.ContextPopup
				 * @static
				 * @private
				 */
				defaults = objectUtils.merge({}, Popup.defaults, {
					arrow: "l,b,r,t",
					positionTo: "window",
					distance: 0
				}),

				ContextPopup = function () {
					var self = this,
						ui;

					Popup.call(self);

					// set options
					self.options = objectUtils.merge(self.options, defaults);

					// set ui
					ui = self._ui || {};
					ui.wrapper = null;
					ui.arrow = null;
					self._ui = ui;
				},

				/**
				 * @property {Object} classes Dictionary for popup related css class names
				 * @member ns.widget.core.Popup
				 * @static
				 */
				CLASSES_PREFIX = "ui-popup",
				classes = objectUtils.merge({}, Popup.classes, {
					wrapper: CLASSES_PREFIX + "-wrapper",
					context: "ui-ctxpopup",
					arrow: "ui-arrow",
					arrowDir: CLASSES_PREFIX + "-arrow-",
					build: "ui-build"
				}),

				/**
				 * @property {Object} events Dictionary for popup related events
				 * @member ns.widget.core.Popup
				 * @static
				 */
				events = objectUtils.merge({}, Popup.events, {
					before_position: "beforeposition"
				}),

				positionType = {
					WINDOW: "window",
					ORIGIN: "origin"
				},

				prototype = new Popup();

			ContextPopup.defaults = defaults;
			ContextPopup.classes = classes;
			ContextPopup.events = events;

			/**
			 * Build structure of Popup widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					wrapper,
					arrow,
					child = element.firstChild;

				// set class for element
				element.classList.add(classes.popup);

				// create wrapper
				wrapper = document.createElement("div");
				wrapper.classList.add(classes.wrapper);
				ui.wrapper = wrapper;
				ui.container = wrapper;

				// move all children to wrapper
				while (child) {
					wrapper.appendChild(child);
					child = element.firstChild;
				}

				// create arrow
				arrow = document.createElement("div");
				arrow.appendChild(document.createElement("span"));
				arrow.classList.add(classes.arrow);
				ui.arrow = arrow;

				// add wrapper and arrow to popup element
				element.appendChild(wrapper);
				element.appendChild(arrow);

				// build elements of popup
				PopupPrototype._build.call(self, element);

				return element;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._init = function(element) {
				var self = this,
					ui = self._ui;

				PopupPrototype._init.call(this, element);

				ui.wrapper = ui.wrapper || element.querySelector("." + classes.wrapper);
				ui.arrow = ui.arrow || element.querySelector("." + classes.arrow);

				// set container of popup elements
				ui.container = ui.wrapper;
			};

			/**
			 * Set positon and size of popup.
			 * @method _reposition
			 * @param {object} options
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._reposition = function(options) {
				var self = this,
					element = self.element,
					elementClassList = element.classList;

				options = objectUtils.merge({}, self.options, options);

				self.trigger(events.before_position, null, false);

				elementClassList.add(classes.build);

				// set height of content
				self._setContentHeight();
				// set position of popup
				self._placementCoords(options);

				elementClassList.remove(classes.build);

			};

			/**
			 * Find the best positon of context popup.
			 * @method findBestPosition
			 * @param {ns.widget.core.ContextPopup} self
			 * @param {HTMLElement} clickedElement
			 * @private
			 * @member ns.widget.core.ContextPopup
			 */
			function findBestPosition(self, clickedElement) {
				var options = self.options,
					arrowsPriority = options.arrow.split(","),
					element = self.element,
					windowWidth = window.innerWidth,
					windowHeight = window.innerHeight,
					popupWidth = element.offsetWidth,
					popupHeight = element.offsetHeight,
					// offset coordinates of clicked element
					clickElementRect = clickedElement.getBoundingClientRect(),
					clickElementOffsetX = clickElementRect.left,
					clickElementOffsetY = clickElementRect.top,
					// width of visible part of clicked element
					clickElementOffsetWidth = Math.min(clickElementRect.width,
							windowWidth - clickElementOffsetX),
					// height of visible part of clicked element
					clickElementOffsetHeight = Math.min(clickElementRect.height,
							windowHeight - clickElementOffsetY),
					// params for all types of popup
					// "l" - popup with arrow on the left side, "r" - right, "b" - bottom, "t" - top
					// dir - this letter is added as a suffix of class to popup's element
					// fixedPositionField - specifies which coordinate is changed for this type of popup
					// fixedPositionFactor - factor, which specifies if size should be added or subtracted
					// size - available size, which is needed for this type of popup (width or height)
					// max - maximum size of available place
					params = {
						"l": {dir: "l", fixedPositionField: "x", fixedPositionFactor: 1,
							size: popupWidth, max: clickElementOffsetX},
						"r": {dir: "r", fixedPositionField: "x", fixedPositionFactor: -1,
							size: popupWidth, max: windowWidth - clickElementOffsetX - clickElementOffsetWidth},
						"b": {dir: "b", fixedPositionField: "y", fixedPositionFactor: -1,
							size: popupHeight, max: clickElementOffsetY},
						"t": {dir: "t", fixedPositionField: "y", fixedPositionFactor: 1,
							size: popupHeight, max: windowHeight - clickElementOffsetY - clickElementOffsetHeight}
					},
					bestDirection,
					direction,
					bestOffsetInfo;

				// set value of bestDirection on the first possible type or top
				bestDirection = params[arrowsPriority[0]] || params.t;

				arrowsPriority.forEach(function(key){
					var param = params[key],
						paramMax = param.max;
					if (!direction) {
						if (param.size < paramMax) {
							direction = param;
						} else if (paramMax > bestDirection.max) {
							bestDirection = param;
						}
					}
				});

				if (!direction) {
					direction = bestDirection;
					if (direction.fixedPositionField === "x") {
						popupWidth = direction.max;
					} else {
						popupHeight = direction.max;
					}
				}

				// info about the best position without taking into account type of popup
				bestOffsetInfo = {
					x: clickElementOffsetX + clickElementOffsetWidth / 2 - popupWidth / 2,
					y: clickElementOffsetY + clickElementOffsetHeight / 2 - popupHeight / 2,
					w: popupWidth,
					h: popupHeight,
					dir: direction.dir
				};

				// check type of popup and correct value for "fixedPositionField" coordinate
				bestOffsetInfo[direction.fixedPositionField] +=
					(direction.fixedPositionField === "x" ?
						(popupWidth + clickElementOffsetWidth) * direction.fixedPositionFactor :
						(popupHeight + clickElementOffsetHeight) * direction.fixedPositionFactor)
						/ 2 + options.distance * direction.fixedPositionFactor;

				return bestOffsetInfo;
			}

			/**
			 * Find the best positon of arrow.
			 * @method adjustedPositionAndPlacementArrow
			 * @param {ns.widget.core.ContextPopup} self
			 * @param {Object} bestRectangle
			 * @param {number} x
			 * @param {number} y
			 * @private
			 * @member ns.widget.core.ContextPopup
			 */
			function adjustedPositionAndPlacementArrow(self, bestRectangle, x, y) {
				var ui = self._ui,
					wrapper = ui.wrapper,
					arrow = ui.arrow,
					popupElement = self.element,
					arrowStyle = arrow.style,
					windowWidth = window.innerWidth,
					windowHeight = window.innerHeight,
					wrapperRect = wrapper.getBoundingClientRect(),
					arrowHalfWidth = arrow.offsetWidth / 2,
					popupProperties = {
						"padding-top": 0,
						"padding-bottom": 0,
						"padding-left": 0,
						"padding-right": 0
					},
					wrapperProperties = {
						"margin-top": 0,
						"margin-bottom": 0,
						"margin-left": 0,
						"margin-right": 0,
						"padding-top": 0,
						"padding-bottom": 0,
						"padding-left": 0,
						"padding-right": 0
					},
					margins,
					params = {
						"t": {pos: x, min: "left", max: "right", posField: "x", valField: "w", styleField: "left"},
						"b": {pos: x, min: "left", max: "right", posField: "x", valField: "w", styleField: "left"},
						"l": {pos: y, min: "top", max: "bottom", posField: "y", valField: "h", styleField: "top"},
						"r": {pos: y, min: "top", max: "bottom", posField: "y", valField: "h", styleField: "top"}
					},
					param = params[bestRectangle.dir],
					surplus;

				domUtils.extractCSSProperties(popupElement, popupProperties);
				domUtils.extractCSSProperties(wrapper, wrapperProperties);
				margins	= {
					"t": popupProperties["padding-top"] + wrapperProperties["margin-top"] + wrapperProperties["padding-top"],
					"b": popupProperties["padding-bottom"] + wrapperProperties["margin-bottom"] + wrapperProperties["padding-bottom"],
					"l": popupProperties["padding-left"] + wrapperProperties["margin-left"] + wrapperProperties["padding-left"],
					"r": popupProperties["padding-right"] + wrapperProperties["margin-right"] + wrapperProperties["padding-right"]
				};

				// value of coordinates of proper edge of wrapper
				wrapperRect = {
					// x-coordinate of left edge
					left: margins.l + bestRectangle.x,
					// x-coordinate of right edge
					right: margins.l + wrapperRect.width + bestRectangle.x,
					// y-coordinate of top edge
					top: margins.t + bestRectangle.y,
					// y-coordinate of bottom edge
					bottom: wrapperRect.height + margins.t + bestRectangle.y
				};

				if (wrapperRect[param.min] > param.pos - arrowHalfWidth) {
					surplus = bestRectangle[param.posField];
					if (surplus > 0) {
						bestRectangle[param.posField] = Math.max(param.pos - arrowHalfWidth, 0);
						param.pos = bestRectangle[param.posField] + arrowHalfWidth;
					} else {
						param.pos = wrapperRect[param.min] + arrowHalfWidth;
					}
				} else if (wrapperRect[param.max] < param.pos + arrowHalfWidth) {
					surplus = (param.valField === "w" ? windowWidth : windowHeight)
						- (bestRectangle[param.posField] + bestRectangle[param.valField]);
					if (surplus > 0) {
						bestRectangle[param.posField] += Math.min(surplus, (param.pos + arrowHalfWidth) - wrapperRect[param.max]);
						param.pos = bestRectangle[param.posField] + bestRectangle[param.valField] - arrowHalfWidth;
					} else {
						param.pos = wrapperRect[param.max] - arrowHalfWidth;
					}
				}

				arrowStyle[param.styleField] = (param.pos - arrowHalfWidth - bestRectangle[param.posField]) + "px";

				return bestRectangle;
			}

			/**
			 * Set top, left and margin for popup's container.
			 * @method _placementCoordsWindow
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._placementCoordsWindow = function(element) {
				var elementStyle = element.style,
					elementWidth = element.offsetWidth,
					elementHeight = element.offsetHeight;

				elementStyle.top = (window.innerHeight - elementHeight) + "px";
				elementStyle.left = "50%";
				elementStyle.marginLeft = -(elementWidth / 2) + "px";
			};

			/**
			 * Find clicked element.
			 * @method _findClickedElement
			 * @param {number} x
			 * @param {number} y
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._findClickedElement = function(x, y) {
				return document.elementFromPoint(x, y);
			};

			/**
			 * Emulate position of event for clicked element.
			 * @method emulatePositionOfClick
			 * @param {string} bestDirection direction of arrow
			 * @param {HTMLElement} clickedElement
			 * @private
			 * @member ns.widget.core.ContextPopup
			 */
			function emulatePositionOfClick(bestDirection, clickedElement) {
				var clickedElementRect = clickedElement.getBoundingClientRect(),
					position = {};

				switch(bestDirection) {
					case "l":
						// the arrow will be on the left edge of container, so x-coordinate
						// should have value equals to the position of right edge of clicked element
						position.x = clickedElementRect.right;
						// y-coordinate should have value equals to the position of top edge of clicked
						// element plus half of its height
						position.y = clickedElementRect.top + clickedElementRect.height / 2;
						break;
					case "r":
						// the arrow will be on the right edge of container
						position.x = clickedElementRect.left;
						position.y =  clickedElementRect.top + clickedElementRect.height / 2;
						break;
					case "t":
						// the arrow will be on the top edge of container
						position.x = clickedElementRect.left + clickedElementRect.width / 2;
						position.y = clickedElementRect.bottom;
						break;
					case "b":
						// the arrow will be on the bottom edge of container
						position.x = clickedElementRect.left + clickedElementRect.width / 2;
						position.y = clickedElementRect.top;
						break;
				}
				return position;
			}

			/**
			 * Find and set the best position for popup.
			 * @method _placementCoords
			 * @param {object} options
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._placementCoords = function(options) {
				var self = this,
					positionTo = options.positionTo,
					x = options.x,
					y = options.y,
					element = self.element,
					elementStyle = element.style,
					elementClassList = element.classList,
					emulatedPosition,
					elementHeight,
					clickedElement,
					bestRectangle;

				if (typeof positionTo === "string") {
					if (positionTo === positionType.ORIGIN && typeof x === "number" && typeof y === "number") {
						clickedElement = self._findClickedElement(x, y);
					} else if (positionTo !== positionType.WINDOW) {
						try {
							clickedElement = document.querySelector(options.positionTo);
						} catch(e) {}
					}
				} else {
					clickedElement = positionTo;
				}

				if (clickedElement) {

					elementClassList.add(classes.context);

					elementHeight = element.offsetHeight;
					bestRectangle = findBestPosition(self, clickedElement);

					elementClassList.add(classes.arrowDir + bestRectangle.dir);

					if (typeof x !== "number" && typeof y !== "number") {
						// if we found element, which was clicked, but the coordinates of event
						// was not available, we have to count these coordinates to the center of proper edge of element.
						emulatedPosition = emulatePositionOfClick(bestRectangle.dir, clickedElement);
						x = emulatedPosition.x;
						y = emulatedPosition.y;
					}
					bestRectangle = adjustedPositionAndPlacementArrow(self, bestRectangle, x, y);

					if (elementHeight > bestRectangle.h) {
						self._setContentHeight(bestRectangle.h);
					}

					elementStyle.left = bestRectangle.x + "px";
					elementStyle.top = bestRectangle.y + "px";

				} else {
					self._placementCoordsWindow(element);
				}

			};

			/**
			 * Set height for popup's container.
			 * @method _setContentHeight
			 * @param {number} maxHeight
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._setContentHeight = function(maxHeight) {
				var self = this,
					element = self.element,
					content = self._ui.content,
					contentStyle,
					contentHeight,
					elementOffsetHeight;

				if (content) {
					contentStyle = content.style;

					if (contentStyle.height || contentStyle.minHeight) {
						contentStyle.height = "";
						contentStyle.minHeight = "";
					}

					maxHeight = maxHeight || window.innerHeight;

					contentHeight = content.offsetHeight;
					elementOffsetHeight = element.offsetHeight;

					if (elementOffsetHeight > maxHeight) {
						contentHeight -= (elementOffsetHeight - maxHeight);
						contentStyle.height = contentHeight + "px";
						contentStyle.minHeight = contentHeight + "px";
					}
				}

			};

			/**
			 * Hide popup.
			 * @method _onHide
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._onHide = function() {
				var self = this,
					ui = self._ui,
					element = self.element,
					elementClassList = element.classList,
					content = ui.content,
					arrow = ui.arrow;

				PopupPrototype._onHide.call(self);

				elementClassList.remove(classes.context);
				["l", "r", "b", "t"].forEach(function(key) {
					elementClassList.remove(classes.arrowDir + key);
				});

				element.removeAttribute("style");
				content.removeAttribute("style");
				arrow.removeAttribute("style");
			};

			/**
			 * Destroy popup.
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._destroy = function() {
				var self = this,
					element = self.element,
					ui = self._ui,
					wrapper = ui.wrapper;

				PopupPrototype._destroy.call(self);

				[].forEach.call(wrapper.children, function(child) {
					element.appendChild(child);
				});

				wrapper.parentNode.removeChild(wrapper);

				ui.wrapper = null;
				ui.arrow = null;
			};

			/**
			 * Show popup.
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._show = function(options) {
				this._reposition(options);
				PopupPrototype._show.call(this, options);
			};

			/**
			 * Set new position for popup.
			 * @method reposition
			 * @param options
			 * @param options.x
			 * @param options.y
			 * @param options.positionTo
			 * @member ns.widget.core.ContextPopup
			 */
			prototype.reposition = function(options) {
				if (this._isActive()) {
					this._reposition(options);
				}
			};

			ContextPopup.prototype = prototype;
			ns.widget.core.ContextPopup = ContextPopup;

			engine.defineWidget(
				"popup",
				"[data-role='popup'], .ui-popup",
				[
					"open",
					"close",
					"reposition"
				],
				ContextPopup,
				"core"
			);

			engine.defineWidget(
				"Popup",
				"",
				[
					"open",
					"close",
					"reposition"
				],
				ContextPopup,
				"core",
				true
			);

			}(window, window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Popup Widget
 * Shows a pop-up window.
 *
 * @class ns.widget.tv.Popup
 * @extends ns.widget.core.ContextPopup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 */
(function (document, ns) {
	
				var engine = ns.engine,
				utilSelectors = ns.util.selectors,
				objectUtils = ns.util.object,
				CorePopup = ns.widget.core.ContextPopup,
				CorePopupPrototype = CorePopup.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				Popup = function () {
					var self = this;

					CorePopup.call(self);
					BaseKeyboardSupport.call(self);

					self.options = objectUtils.merge(self.options, defaults);
					self.selectors = selectors;
				},
				defaults = objectUtils.merge({}, CorePopup.defaults, {
					arrow: "t,b,l,r",
					distance: 10
				}),
				classes = objectUtils.merge({}, CorePopup.classes, {
					toast: "ui-popup-toast",
					headerEmpty: "ui-header-empty",
					footerEmpty: "ui-footer-empty",
					content: "ui-popup-content"
				}),
				selectors = {
					header: "header",
					content: "div",
					footer: "footer"
				},
				prototype = new CorePopup(),
				FUNCTION_TYPE = "function",
				KEY_CODES = {
					enter: 13
				};

			Popup.events = CorePopup.events;

			Popup.classes = classes;

			Popup.prototype = prototype;

			/**
			 * Build the popup DOM tree
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.tv.Popup
			 */
			prototype._build = function (element) {
				var ui = this._ui;

				if (typeof CorePopupPrototype._build === FUNCTION_TYPE) {
					CorePopupPrototype._build.apply(this, arguments);
				}

				if (!ui.header) {
					element.classList.add(classes.headerEmpty);
				}

				if (!ui.footer) {
					element.classList.add(classes.footerEmpty);
				}

				return element;
			};

			prototype._init = function(element) {
				var page;

				if (typeof CorePopupPrototype._init === FUNCTION_TYPE) {
					CorePopupPrototype._init.call(this, element);
				}
				if (element.classList.contains(classes.toast)) {
					this._ui.container.classList.add(classes.toast);
				}
				page = utilSelectors.getClosestByClass(element, ns.widget.tv.Page.classes.uiPage);
				this._pageWidget = engine.getBinding(page, "page");
			};

			function onKeydownClosing(self, event) {
				var keyCode = event.keyCode;

				if (keyCode === KEY_CODES.enter) {
					event.preventDefault();
					event.stopPropagation();
					setTimeout(self.close.bind(self), 10);
				}
			}

			function closingOnKeydown(self, added) {
				if (self.element.classList.contains(classes.toast)) {
					if (added) {
						self._onKeydownClosing = onKeydownClosing.bind(null, self);
						document.addEventListener("keydown", self._onKeydownClosing, false);
					} else {
						document.removeEventListener("keydown", self._onKeydownClosing, false);
					}
				}
			}

			prototype._setKeyboardSupport = function (options) {
				var self = this,
					autoFocus = options.autofocus,
					page = self._pageWidget,
					toastPopup = self.element.classList.contains(classes.toast);

				if (self._getActiveLinks().length || toastPopup) {
					// if there are links inside popup, we enable keyboard support on page
					// and enable in popup
					self.enableKeyboardSupport();
					page.blur();
					page.disableKeyboardSupport();

					if (autoFocus || autoFocus === 0) {
						self.focus(autoFocus);
					}
				}

				closingOnKeydown(self, true);
			};

			prototype._placementCoordsWindow = function(element) {
				// if popup is not a toast popup, we set position to the center
				if (!element.classList.contains(classes.toast) &&
					typeof CorePopupPrototype._placementCoordsWindow === FUNCTION_TYPE) {
					CorePopupPrototype._placementCoordsWindow.call(this, element);
					element.style.top = parseInt(element.style.top) / 2 + "px";
				}
			};

			prototype._findClickedElement = function(x, y) {
				var clickedElement =  document.elementFromPoint(x, y),
					button = utilSelectors.getClosestBySelector(clickedElement, engine.getWidgetDefinition("Button").selector);

				return button || clickedElement;
			};

			prototype.open = function(options) {
				var self = this;

				if (!self._isActive()) {

					if (typeof CorePopupPrototype.open === FUNCTION_TYPE) {
						CorePopupPrototype.open.apply(self, arguments);
					}

					self._setKeyboardSupport(options);
				}
			};

			prototype.close = function() {
				if (this._isOpened()) {
					if (typeof CorePopupPrototype.close === FUNCTION_TYPE) {
						CorePopupPrototype.close.apply(this, arguments);
					}

					this.disableKeyboardSupport();
					this._pageWidget.enableKeyboardSupport();

					closingOnKeydown(this, false);
				}
			};

			prototype._bindEvents = function(element) {
				if (typeof CorePopupPrototype._bindEvents === FUNCTION_TYPE) {
					CorePopupPrototype._bindEvents.call(this, element);
				}
				this._bindEventKey();
			};

			prototype._destroy = function() {
				this._destroyEventKey();
				if (typeof CorePopupPrototype._destroy === FUNCTION_TYPE) {
					CorePopupPrototype._destroy.call(this);
				}
			};

			// definition
			ns.widget.tv.Popup = Popup;

			engine.defineWidget(
				"popup",
				"[data-role='popup'], .ui-popup",
				["open", "close", "reposition"],
				Popup,
				"tv",
				true
			);
			}(window.document, ns));

/*global window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/**
 * #Text Input Widget
 * Decorator for inputs elements.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - INPUT with type "text" or "number" or "password" or "email" or "url" or
 *    "tel" or "month" or "week" or "datetime-local" or "color" or without any
 *    type
 *  - TEXTAREA
 *  - HTML elements with class ui-TextInput
 *
 * ###HTML Examples
 *
 * ####Create simple text input on INPUT element
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input type="text" name="text-1" id="text-1" value="">
 *		</form>
 *
 * ####Create simple text input on TEXTAREA element
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<textarea name="text-1" id="text-1"></textarea>
 *		</form>
 *
 * ####Create simple text input on INPUT element with class ui-textinput
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input name="text-1" id="text-1" class="ui-textinput">
 *		</form>
 *
 * ## Manual constructor
 * For manual creation of TextInput widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input type="search" name="text-1" id="text-1" value="">
 *		</form>
 *		<script>
 *			var inputElement = document.getElementById("text-1"),
 *				textInput = tau.widget.TextInput(inputElement);
 *		</script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter is **options** and it is a object
 * with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input type="text" name="text-1" id="text-1" value="">
 *		</form>
 *		<script>
 *			$("#text-1").textinput();
 *		</script>
 *
 * jQuery Mobile constructor has one optional parameter is **options** and it is
 * a object with options for widget.
 *
 * ##Options for widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<input id="text-1" />
 *		<script>
 *			var inputElement = document.getElementById('text-1'),
 *				textInput = tau.widget.TextInput(inputElement);
 *		 	// textInput.methodName(argument1, argument2, ...);
 *			// for example:
 *			textInput.value("text");
 *		</script>
 *
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		<input id="text-1" />
 *		<script>
 *			// $("#text-1").textinput('methodName', argument1, argument2, ...);
 *			// for example
 *			$("#text-1").value("text");
 *		</script>
 *
 * @class ns.widget.mobile.TextInput
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Piotr Kusztal <p.kusztal@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 */
(function (document, ns) {
	
			var TextInput = function () {
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {string} [options.clearSearchButtonText="clear text"] Default text for search field clear text button
					 * @property {boolean} [options.disabled=false] disable widget
					 * @property {?boolean} [options.mini=null] set mini version
					 * @property {string} [options.theme='s'] theme of widget
					 * @property {string} [options.clearBtn=false] option indicates that the clear button will be shown
					 * @member ns.widget.mobile.TextInput
					 */
					this.options = {
						clearSearchButtonText: "clear text",
						disabled: false,
						mini: null,
						theme: 's',
						clearBtn: false
					};

					this._ui = {};
					this._handlers = {};
				},
				/**
				 * Alias for {ns.widget.BaseWidget}
				 * @property {Object} BaseWidget
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 */
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * Alias for {ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Alias for {ns.theme}
				 * @property {Object} theme
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 */
				themes = ns.theme,
				/**
				 * Flag with informations about events
				 * @property {boolean} eventsAdded
				 * @private
				 * @static
				 * @member ns.widget.mobile.TextInput
				 */
				eventsAdded = false,

				domUtils = ns.util.DOM,

				/**
				 * Dictionary for textinput related css class names
				 * @property {Object} classes
				 * @member ns.widget.mobile.TextInput
				 * @static
				 */
				classes = {
					uiBodyTheme: "ui-body-",
					uiMini: "ui-mini",
					uiInputText: "ui-input-text",
					clear: "ui-input-clear",
					clearHidden: "ui-input-clear-hidden",
					clearActive: "ui-input-clear-active",
					textLine: "ui-text-line",
					focus: "ui-focus"
				},
				/**
				 * Selector for clear button appended to textinput
				 * @property {string} CLEAR_BUTTON_SELECTOR
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 * @readonly
				 */
				CLEAR_BUTTON_SELECTOR = '.' + classes.clear,
				/**
				 * Alias for {ns.widget.mobile.Button.classes.uiDisabled}
				 * @property {string} CLASS_DISABLED
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 * @readonly
				 */
				CLASS_DISABLED = ns.widget.mobile.Button.classes.uiDisabled;

			TextInput.prototype = new BaseWidget();

			TextInput.classes = classes;

			/**
			 * Enables the textinput
			 *
			 * Method removes disabled attribute on input and changes look of
			 * input to enabled state.
			 *
			 *	@example
			 *	<input id="input" />
			 *	<script>
			 *		var inputElement = document.getElementById("input"),
			 *			textInputWidget = tau.widget.TextInput();
			 *
			 *		textInputWidget.enable();
			 *	</script>
			 *
			 *	@example
			 *	<input id="input" />
			 *	<script>
			 *		$( "#input" ).textinput( "enable" );
			 *	</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.TextInput
			 */

			/**
			 * Method enables TextInput.
			 * @method _enable
			 * @member ns.widget.mobile.TextInput
			 * @protected
			 */
			TextInput.prototype._enable = function () {
				var element = this.element;
				if (element) {
					element.classList.remove(CLASS_DISABLED);
				}
			};

			/**
			 * Disables the textinput
			 *
			 * Method adds disabled attribute on input and changes look of
			 * input to disable state.
			 *
			 *	@example
			 *	<input id="input" />
			 *	<script>
			 *		var inputElement = document.getElementById("input"),
			 *			textInputWidget = tau.widget.TextInput();
			 *
			 *		textInputWidget.disable();
			 *	</script>
			 *
			 *	@example
			 *	<input id="input" />
			 *	<script>
			 *		$( "#input" ).textinput( "disable" );
			 *	</script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.TextInput
			 */

			/**
			 * Method disables TextInput
			 * @method _disable
			 * @member ns.widget.mobile.TextInput
			 * @protected
			 */
			TextInput.prototype._disable = function () {
				var element = this.element;
				if (element) {
					element.classList.add(CLASS_DISABLED);
				}
			};

			/**
			 * Resize textarea, called after text input
			 * @method _resize
			 * @private
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.TextInput
			 */
			function _resize(element){
				if (element.nodeName.toLowerCase() === "textarea") {
					if(element.clientHeight < element.scrollHeight){
						element.style.height = element.scrollHeight + "px";
					}
				}
			}

			/**
			 * Toggle visibility of the clear button
			 * @method toggleClearButton
			 * @param {HTMLElement} clearBtn
			 * @param {HTMLInputElement} inputElement
			 * @member ns.widget.mobile.TextInput
			 * @static
			 * @private
			 */
			function toggleClearButton(clearBtn, inputElement) {
				if (clearBtn) {
					// @TODO change to two-parameter toggle after it's implemenation is fixed on the platform
					if (inputElement.value === "") {
						clearBtn.classList.add(classes.clearHidden);
						inputElement.classList.remove(classes.clearActive);
					} else {
						clearBtn.classList.remove(classes.clearHidden);
						inputElement.classList.add(classes.clearActive);
					}
				}
			}

			/**
			 * Method finds label tag for element.
			 * @method findLabel
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.TextInput
			 * @return {HTMLElement}
			 * @static
			 * @private
			 */
			function findLabel(element) {
				return element.parentNode.querySelector('label[for="' + element.id + '"]');
			}

			/**
			 * Method returns not disabled TextInput element which is the closest
			 * to element.
			 * @method isEnabledTextInput
			 * @param {HTMLInputElement} element
			 * @return {boolean}
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function isEnabledTextInput(element) {
				return element && element.classList.contains(classes.uiInputText) &&
					!element.classList.contains(CLASS_DISABLED) && !element.disabled;
			}

			/**
			* The check whether the element is the enable "clear" button
			* @method isEnabledClearButton
			* @param {HTMLElement} buttonElement
			* @return {boolean}
			* @private
			* @static
			* @member ns.widget.mobile.TextInput
			*/
			function isEnabledClearButton(buttonElement) {
				var input;

				if (buttonElement && buttonElement.classList.contains(classes.clear)) {
					//input = element.previousElementSibling;
					input = buttonElement.parentElement.querySelector("." + classes.uiInputText);

					return isEnabledTextInput(input);
				}
				return false;
			}

			/**
			 * Method adds class ui-focus to target element of event.
			 * @method onFocus
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function onFocus(event) {
				var element = event.target;
				if (isEnabledTextInput(element)) {
					element.classList.add(classes.focus);
				}
			}

			/**
			 * Method adds event for showing clear button and optional resizing textarea.
			 * @method onInput
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function onInput(event) {
				var element = event.target,
					self;
				if (isEnabledTextInput(element)) {
					self = engine.getBinding(element, "TextInput");
					if (self) {
						toggleClearButton(self._ui.clearButton, element);
					}
					_resize(element);
				}
			}
			/**
			 * Method removes class ui-focus from target element of event.
			 * @method onBlur
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function onBlur(event) {
				var element = event.target,
					self;
				if (isEnabledTextInput(element)) {
					element.classList.remove(classes.focus);
					self = engine.getBinding(element, "TextInput");
					if (self) {
						toggleClearButton(self._ui.clearButton, element);
					}
				}
			}
			/**
			* Handler for vclick events in clearButton
			* @method onCancel
			* @param {Event} event
			* @private
			* @static
			* @member ns.widget.mobile.TextInput
			*/
			function onCancel(event) {
				var clearButton = event.target,
					input;

				if (isEnabledClearButton(clearButton)) {
					input = clearButton.parentElement.querySelector("." + classes.uiInputText);
					input.value = "";
					toggleClearButton(clearButton, input);
					input.focus();
				}
			}

			/**
			 * add events to all TextInputs
			 * @method addGlobalEvents
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function addGlobalEvents() {
				if (!eventsAdded) {
					document.addEventListener('focus', onFocus, true);
					document.addEventListener('blur', onBlur, true);
					document.addEventListener('vclick', onCancel, true);
					eventsAdded = true;
				}
			}

			/**
			 * Removes global events related to checkboxes
			 * @method removeGlobalEvents
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function removeGlobalEvents() {
				document.removeEventListener('focus', onFocus, true);
				document.removeEventListener('blur', onBlur, true);
				document.removeEventListener('vclick', onCancel, true);
				eventsAdded = false;
			}

			/**
			* Configure TextInput Widget
			* @method _configure
			* @member ns.widget.mobile.TextInput
			* @protected
			*/
			TextInput.prototype._configure = function () {
				var self = this;

				self._ui = self._ui || {};
			};

			function setAria(element) {
				element.setAttribute("role", "textbox");
				element.setAttribute("aria-label", "Keyboard opened");
			}

			function createDecorationLine(element) {
				var decorationLine = element.nextElementSibling;

				if (!decorationLine || (decorationLine && !decorationLine.classList.contains(classes.textLine))) {

					decorationLine = document.createElement("span");
					decorationLine.classList.add(classes.textLine);

					domUtils.insertNodeAfter(element, decorationLine);
				}

				return decorationLine;
			}

			/**
			* build TextInput Widget
			* @method _build
			* @param {HTMLElement} element
			* @member ns.widget.mobile.TextInput
			* @return {HTMLElement}
			* @protected
			*/
			TextInput.prototype._build = function (element) {
				var self= this,
					elementClassList = element.classList,
					options = self.options,
					themeClass,
					labelFor = findLabel(element),
					clearButton,
					type = element.type,
					ui;

				ui = self._ui;

				options.theme = themes.getInheritedTheme(element) || options.theme;
				themeClass = classes.uiBodyTheme + options.theme;

				if (labelFor) {
					labelFor.classList.add(classes.uiInputText);
				}

				elementClassList.add(classes.uiInputText);
				elementClassList.add(themeClass);

				switch (type) {
				case "text":
				case "password":
				case "number":
				case "email":
				case "url":
				case "tel":
					setAria(element);
					// Adds decoration line for textbox-like elements and textarea
					// this is required only to match the UX Guides, no other
					// functionality is related to that element
					ui.textLine = createDecorationLine(element);
					break;
				default:
					if (element.tagName.toLowerCase() === "textarea") {
						setAria(element);
						ui.textLine = createDecorationLine(element);
					}
				}

				element.tabindex = 0;

				if (options.clearBtn) {
					clearButton = document.createElement("span");
					clearButton.classList.add(classes.clear);
					clearButton.tabindex = 0;

					element.parentNode.appendChild(clearButton);

					ui.clearButton = clearButton;
				}

				//Auto grow
				_resize(element);

				return element;
			};

			/**
			* Init TextInput Widget
			* @method _init
			* @param {HTMLElement} element
			* @member ns.widget.mobile.TextInput
			* @return {HTMLElement}
			* @protected
			*/
			TextInput.prototype._init = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options;
				if (options.clearBtn) {
					ui.clearButton = element.parentNode.querySelector(CLEAR_BUTTON_SELECTOR);

					if (ui.clearButton) {
						toggleClearButton(ui.clearButton, element);
					}
				}

				switch (element.type) {
					case "text":
					case "password":
					case "number":
					case "email":
					case "url":
					case "tel":
						ui.textLine = element.nextElementSibling;
						break;
				}

				return element;
			};


			/**
			* Bind events to widget
			* @method _bindEvents
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.TextInput
			*/
			TextInput.prototype._bindEvents = function (element) {
				element.addEventListener('input', onInput , false);
				addGlobalEvents();
				// One time resize after page show
				document.addEventListener("pageshow", function _resizeWidgetsOnPageLoad() {
					document.removeEventListener("pageshow", _resizeWidgetsOnPageLoad);

					_resize(element);
				});
			};

			/**
			 * Destroys additional elements created by the widget,
			 * removes classes and event listeners
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.TextInput
			 */
			TextInput.prototype._destroy = function (element) {
				var ui = this._ui,
					textLine = ui.textLine,
					clearButton = ui.clearButton,
					elementClassList = element.classList;

				if (textLine) {
					textLine.parentElement.removeChild(ui.textLine);
				}

				if (clearButton) {
					clearButton.parentElement.removeChild(ui.clearButton);
				}

				// Remove events
				element.removeEventListener('input', onInput , false);

				removeGlobalEvents();

				// Remove classes
				elementClassList.remove(classes.clearActive);
				elementClassList.remove(classes.uiInputText);
				elementClassList.remove(classes.uiBodyTheme + this.options.theme);
			};

			ns.widget.mobile.TextInput = TextInput;
			engine.defineWidget(
				"TextInput",
				"input[type='text'], input[type='number'], input[type='password'], input[type='email']," +
					"input[type='url'], input[type='tel'], textarea, input[type='month'], input[type='week']," +
					"input[type='datetime-local'], input[type='color'], input:not([type]), .ui-textinput",
				[],
				TextInput,
				"mobile"
			);
}(window.document, ns));

/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/**
 * #Flip Toggle Switch Widget
 * Toggle Switch widget is a common UI element on mobile devices that is used
 * for binary on/off or true/false data input. You can either drag the flip
 * handle like a slider or tap one side of the switch.
 *
 * ## Default selectors
 * all **SELECT** tags with _data-role=slider_ or with _data-type=range_ are
 * changed to toggle switch
 *
 * ###HTML Examples
 *
 * ####Create simple toggle switch from select using data-role
 *
 *		@example
 *		<select name="flip-11" id="flip-11" data-role="slider">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *
 * ## Manual constructor
 * For manual creation of toggle switch widget you can use constructor of
 * widget from **tau** namespace:
 *
 *		@example
 *		<select id="toggle" name="flip-11" id="flip-11" data-role="slider"
 *		data-mini="true">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *		<script>
 *			var toggleElement = document.getElementById("toggle"),
 *				toggle = tau.widget.Slider(toggleElement, {mini: true});
 *		</script>
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter is **options** and it is
 * a object with options for widget.
 *
 * ####If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<select id="toggle" name="flip-11" id="flip-11" data-role="slider"
 *		data-mini="true">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *		<script>
 *			var toggle = $("#toggle").slider({mini: true});
 *		</script>
 * jQuery Mobile constructor has one optional parameter is **options** and it
 * is a object with options for widget.
 *
 * ##Options for toggle switch Widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ###Mini version
 * For a more compact version that is useful in toolbars and tight spaces,
 * add the data-mini="true" attribute to the toggle switch to create
 * a mini version. This will produce a slider that is not as tall
 * as the standard version and has a smaller text size.
 *
 *		@example
 *		<select name="flip-11" id="flip-11" data-role="slider"
 *		data-mini="true">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *
 * ###Inline Slider
 * By default, all toggle switches in the body content are styled
 * as block-level elements so they fill the width of the screen. However,
 * if you want a more compact toggle switch that is only as wide as the text
 * and icons inside, add the data-inline="true" attribute to the slider.
 *
 *		@example
 *		<select name="flip-11" id="flip-11" data-role="slider"
 *		data-inline="true">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<select name="flip-11" id="toggle" data-role="slider"
 *		data-mini="true">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *		<script>
 *			var toggleElement = document.getElementById("toggle"),
 *				toggle = tau.widget.Slider(toggleElement, "Slider");
 *
 *			// toggle.methodName(methodArgument1, methodArgument2, ...);
 *			// for example:
 *			toggle.value("on");
 *		</script>
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		<select name="flip-11" id="toggle" data-role="slider"
 *		data-mini="true">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *		<script>
 *			// $("#toggle").slider("methodName", argument1, argument2, ...);
 *			// for example:
 *
 *			$("#toggle").slider("value", "on");
 *		</script>
 *
 * @class ns.widget.mobile.Slider
 * @extends ns.widget.BaseWidget
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (document, ns) {
	
				var Slider = function () {
				var self = this;
					/**
					 * All possible widget options
					 * @property {Object} options
					 * @property {?string} [options.trackTheme=null] sets
					 * the color scheme (swatch) for the slider's track
					 * @property {boolean} [options.disabled=false] start
					 * widget as enabled / disabled
					 * @property {?boolean} [options.mini=false] size
					 * of toggle switch
					 * @property {boolean} [options.highlight=true] if set
					 * then toggle switch can be highligted
					 * @property {?boolean} [options.inline=false] if value is
					 * "true" then toggle switch has css property
					 * display = "inline"
					 * @property {string} [options.theme=null] theme of widget
					 * @member ns.widget.mobile.Slider
					 */
					self.options = {
						trackTheme: null,
						disabled: false,
						mini: null,
						highlight: true,
						inline: null,
						theme: null
					};
					self._ui = {};
					//container background
					self.valueBackGround = null;
					self.dragging = false;
					self.beforeStart = null;
					self.userModified = false;
					self.mouseMoved = false;
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				TextInput = ns.widget.mobile.TextInput,
				Button = ns.widget.mobile.Button,
				engine = ns.engine,
				events = ns.event,
				themes = ns.theme,
				selectors = ns.util.selectors,
				DOMutils = ns.util.DOM,
				classes = {
					theme: "ui-body-",
					mini: "ui-mini",
					sliderSnapping : "ui-slider-handle-snapping",
					sliderSwitch: "ui-slider-switch",
					sliderInline: "ui-slider-inline",
					sliderMini: "ui-slider-mini",
					slider: "ui-slider",
					sliderHandle: "ui-slider-handle",
					sliderBg: "ui-slider-bg",
					sliderToggle: "ui-toggle-switch",
					sliderToggleOn: "ui-toggle-on",
					sliderToggleOff: "ui-toggle-off",
					sliderInneroffset: "ui-slider-inneroffset",
					sliderInput: "ui-slider-input",
					sliderLabel: "ui-slider-label",
					sliderLabelTheme: "ui-slider-label-",
					sliderContainer: "ui-slider-container",
					sliderLabelA: "ui-slider-label-a",
					sliderStateActive: "ui-state-active"
				},
				keyCode = {
					HOME: 36,
					END: 35,
					PAGE_UP : 33,
					PAGE_DOWN: 34,
					UP: 38,
					RIGHT: 39,
					DOWN: 40,
					LEFT: 37
				};

			Slider.prototype = new BaseWidget();

			/**
			* Dictionary for slider related css class names
			* @property {Object} classes
			* @member ns.widget.mobile.Slider
			* @static
			* @readonly
			*/
			Slider.classes = classes;

			/**
			* Dictionary for keyboard codes
			* @property {Object} keyCode
			* @member ns.widget.mobile.Slider
			* @static
			* @readonly
			*/
			Slider.keyCode = keyCode;

			/**
			 * disable any action when TouchMove event appear
			 * @method onTouchMove
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.Slider
			 */
			function onTouchMove(event) {
				event.stopPropagation();
				event.preventDefault();
			}

			/**
			 * Finds the label tag for sended element
			 * @method findLabel
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.mobile.Slider
			 */
			function findLabel(element) {
				return element.parentNode.querySelector('label[for="' +
						element.id + '"]');
			}

			/**
			 * sets the width for labels which represents a value of widget
			 * @method refreshLabels
			 * @param {ns.widget.mobile.Slider} self
			 * @param {number} percent
			 * @private
			 * @static
			 * @member ns.widget.mobile.Slider
			 */
			function refreshLabels(self, percent) {
				var ui = self._ui,
					shandle = ui.handle,
					getElementWidth = DOMutils.getElementWidth.bind(DOMutils),
					handlePercent = getElementWidth(shandle, "outer") /
							getElementWidth(ui.slider, "outer") * 100,
					aPercent = percent && handlePercent + (100 - handlePercent)
							* percent / 100,
					bPercent = percent === 100 ? 0 : Math.min(handlePercent +
							100 - aPercent, 100),
					labels = ui.labels,
					i = labels.length,
					label;

				while (i--) {
					label = labels[i];
					label.style.width = 
							(label.classList.contains(classes.sliderLabelA)
									? aPercent : bPercent) + "%";
				}
			}

			/**
			 * returns default position of the slider, if the element is input
			 * @method getInitialValue
			 * @param {string} tag
			 * @param {HTMLElement} element
			 * @return {number}
			 * @private
			 * @static
			 * @member ns.widget.mobile.Slider
			 */
			function getInitialValue(tag, element) {
				return tag === "input" ? parseFloat(element.value) :
						element.selectedIndex;
			}

			/**
			 * creates background for Slider element
			 * @method createBackground
			 * @param {HTMLElement} domSlider
			 * @return {HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.mobile.Slider
			 */
			function createBackground(domSlider) {
				var background = document.createElement("div"),
					cList = background.classList,
					btnClasses = Button.classes;

				cList.add(classes.sliderBg);
				cList.add(btnClasses.uiBtnActive);
				cList.add(btnClasses.uiBtnCornerAll);

				return domSlider.insertBefore(background,
						domSlider.firstChild);
			}

			/**
			 * refresh all the elements of Slider widget
			 * @method refresh
			 * @param {ns.widget.mobile.Slider} self
			 * @param {Object|number|null} val
			 * @param {boolean} isfromControl
			 * @param {boolean} preventInputUpdate
			 * @private
			 * @static
			 * @member ns.widget.mobile.Slider
			 */
			function refresh(self, val, isfromControl, preventInputUpdate) {
				var ui = self._ui,
					control = self.element,
					percent,
					centerPercent,
					halfPercent = 50,
					shandle = ui.handle,
					sliderBackground = ui.background,
					sliderBackgroundStyle,
					cType = control.nodeName.toLowerCase(),
					min = 0,
					max = control.querySelectorAll("option").length - 1,
					stepValue = DOMutils.getNumberFromAttribute(control,
							"step", "float", 0),
					step = (cType === "input" && stepValue > 0) ?
							stepValue : 1,
					data,
					touchThreshold,
					localClasses = shandle.classList,
					slider = ui.slider,
					newval,
					valModStep,
					alignValue,
					valueChanged,
					newValueOption,
					sliderOffsetLeft;

				if (cType === "input") {
					min = DOMutils.getNumberFromAttribute(control,
							"min",  "float", min);
					max = DOMutils.getNumberFromAttribute(control,
							"max", "float", max);
				}

				if (isNaN(step)) {
					step = 0;
				}

				if (self.options.disabled) {
					self._disable();
				}

				// If changes came from event
				if (typeof val === "object") {
					data = val;
					// @TODO take parameter out to config
					touchThreshold = 8;
					sliderOffsetLeft =
							DOMutils.getElementOffset(slider).left;

					// If refreshing while not dragging
					// or movement was within threshold
					if (!self.dragging ||
							data.pageX < sliderOffsetLeft - touchThreshold ||
							data.pageX > sliderOffsetLeft + 
							slider.offsetWidth + touchThreshold) {
						return;
					}

					// Calculate new left side percent
					percent = ((data.pageX - sliderOffsetLeft) /
							slider.offsetWidth) * 100;

				// If changes came from input value change
				} else {
					if (val === null) {
						val = (cType === "input") ? parseFloat(control.value) :
								control.selectedIndex;
					}
					if (isNaN(val)) {
						return;
					}
					// While dragging prevent jumping by assigning
					// last percentage value
					if(self.dragging && self._lastPercent) {
						percent = self._lastPercent;
					} else {
						percent = (parseFloat(val) - min) / (max - min) * 100;
					}
				}

				// Make sure percent is a value between 0 - 100;
				percent = Math.max(0, Math.min(percent, 100));
				self._lastPercent = percent;
				centerPercent = halfPercent - percent;

				newval = (percent / 100) * (max - min) + min;

				//from jQuery UI slider, the following source will round
				// to the nearest step
				valModStep = (newval - min) % step;
				alignValue = newval - valModStep;

				if (Math.abs(valModStep) * 2 >= step) {
					alignValue += (valModStep > 0) ? step : (-step);
				}
				// Since JavaScript has problems with large floats, round
				// the final value to 5 digits after the decimal point
				// (see jQueryUI: #4124)
				newval = parseFloat(alignValue.toFixed(5));

				newval = Math.max(min, Math.min(newval, max));

				shandle.style.left = percent + "%";
				newValueOption = control.querySelectorAll("option")[newval];
				shandle.setAttribute("aria-valuenow", cType === "input" ?
						newval : newValueOption && newValueOption.value);
				shandle.setAttribute("aria-valuetext", cType === "input" ?
						newval : newValueOption && newValueOption.innerText);
				shandle.setAttribute("title", cType === "input" ?
						newval : newValueOption && newValueOption.innerText);

				if (percent === 100 &&
						localClasses.contains("ui-slider-handle-snapping")) {
					localClasses.remove("ui-toggle-off");
					localClasses.add("ui-toggle-on");
				} else if (percent === 0 &&
						localClasses.contains("ui-slider-handle-snapping")) {
					localClasses.remove("ui-toggle-on");
					localClasses.add("ui-toggle-off");
				}

				if (sliderBackground) {
					sliderBackgroundStyle = sliderBackground.style;
					if (self.options.center) {
						if (centerPercent >= 0) {
							sliderBackgroundStyle.right = "50%";
							sliderBackgroundStyle.left = "initial";
							sliderBackgroundStyle.width = centerPercent + "%";
						} else {
							sliderBackgroundStyle.right = "initial";
							sliderBackgroundStyle.left = "50%";
							sliderBackgroundStyle.width =
									Math.abs(centerPercent) + "%";
						}
					} else {
						sliderBackgroundStyle.width = percent + "%";
					}
				}

				// drag the label widths
				if (ui.labels) {
					refreshLabels(self, percent);
				}

				if (!preventInputUpdate) {
					valueChanged = false;
					// update control"s value
					if (cType === "input") {
						valueChanged = control.value !== newval;
						control.value = newval;
					} else {
						valueChanged = control.selectedIndex !== newval;
						control.selectedIndex = newval;
					}
					if (!isfromControl && valueChanged) {
						// Trigger change event on the control element
						events.trigger(control, "change");
					}
				}
			}

			/**
			 * Function fires on mouse move event
			 * @method onVmouseMove
			 * @param {ns.widget.mobile.Slider} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.Slider
			 */
			function onVmouseMove(self, event) {
				var tagName = self.element.nodeName.toLowerCase(),
					handle = self._ui.handle;
				// NOTE: we don't do this in refresh because we still want to
				//	support programmatic alteration of disabled inputs
				if (self.dragging && !self.options.disabled) {

					// self.mouseMoved must be updated before refresh() 
					// because it will be used in the control "change" event
					self.mouseMoved = true;

					if (tagName === "select") {
						// make the handle move in sync with the mouse
						handle.classList.remove(classes.sliderSnapping);
					}

					refresh(self, event);
					// only after refresh() you can calculate self.userModified
					self.userModified = self.beforeStart !==
							self.element.selectedIndex;
					event.preventDefault();
				}
			}

			/**
			 * Function fires on mouse move event
			 * @method sliderMouseUp
			 * @param {ns.widget.mobile.Slider} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.Slider
			 */
			function sliderMouseUp(self) {
				if (self.dragging) {
					self.dragging = false;

					if (self.element.nodeName.toLowerCase() === "select") {
						// make the handle move with a smooth transition
						self._ui.handle.classList.add(classes.sliderSnapping);

						if (self.mouseMoved) {
							// this is a drag, change the value only
							// if user dragged enough
							if (self.userModified) {
								refresh(self, self.beforeStart === 0 ? 1 : 0);
							} else {
								refresh(self, self.beforeStart);
							}
						} else {
							refresh(self, self.beforeStart === 0 ? 1 : 0);
						}
					}
					self.mouseMoved = false;
				}
			}

			/**
			 * Build structure of slider widget
			 * @method _build
			 * @param {HTMLElement|HTMLSelectElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Slider
			 */
			Slider.prototype._build = function (element) {
				var options = this.options,
					protoOptions = Slider.prototype.options,
					/*TODO - add support disabled */
					parentTheme = themes.getInheritedTheme(element,
							(protoOptions && protoOptions.theme) || "s"),
					theme = options.theme = options.theme || parentTheme,
					trackTheme = options.trackTheme = options.trackTheme ||
							parentTheme,
					/*
					* tagName containing lowered tagname
					* type String
					*/
					tagName = element.nodeName.toLowerCase(),
					selectClass =
							tagName === "select" ? classes.sliderSwitch : "",
					/*
					* elementId get the id attribute
					* type String
					*/
					elementId = element.getAttribute("id"),
					labelFor = findLabel(element),
					labelID,

					/*TODO - assign in callbacks*/
					min = tagName === "input" ?
							parseFloat(element.getAttribute("min")) : 0,
					/*TODO - assign in callbacks*/
					max = tagName === "input" ?
							parseFloat(element.getAttribute("max")) :
									element.querySelectorAll("option").length -
											1,
					/*TODO - will be used in long sliders*/
					step = parseFloat(element.getAttribute("step")),

					domHandle = document.createElement("a"),
					domSlider = document.createElement("div"),
					sliderContainer,
					domSliderClassList = domSlider.classList,
					i,
					wrapper = null,
					j,
					side,
					sliderTheme,
					sliderImg,
					length,
					optionsCount,
					domSliderChildNod = domSlider.childNodes,
					sliderImgClassL = null,
					elementClassList = null,
					initValue,
					sliderBtnDownTheme,
					elementsOption = element.querySelector("option"),
					btnClasses = Button.classes;

				if (options.highlight && tagName !== "select") {
					this._ui.background = createBackground(domSlider);
				}
				if (isNaN(min)) {
					min = 0;
				}
				if (isNaN(max)) {
					max = 0;
				}
				if (isNaN(step)) {
					step = 1;
				}
				sliderBtnDownTheme = btnClasses.uiBtnDownThemePrefix +
						trackTheme;
				if (labelFor) {
					labelID = labelFor.getAttribute("id") || elementId +
							"-label";
					labelFor.setAttribute("id", labelID);

					labelFor.classList.add(classes.slider);
				}

				domSlider.setAttribute("role", "application");
				domSlider.setAttribute("id", elementId + "-slider");
				domSliderClassList.add(classes.slider);
				if (selectClass) {
					domSliderClassList.add(selectClass);
				}
				domSliderClassList.add(sliderBtnDownTheme);
				domSliderClassList.add(btnClasses.uiBtnCornerAll);
				if (options.inline) {
					domSliderClassList.add(classes.sliderInline);
				}
				if (options.mini) {
					domSliderClassList.add(classes.sliderMini);
				}

				domHandle.className = classes.sliderHandle;

				if (elementsOption && elementsOption.innerText === "") {
					domSlider.classList.add(classes.sliderToggle);
				}

				initValue = getInitialValue(tagName, element);
				if (initValue !== 1) {
					domHandle.classList.add(classes.sliderToggleOff);
					domHandle.style.left = "0px";
				}

				domSlider.appendChild(domHandle);

				//temporary way to send initial parameters
				//to the instanceWidget method
				domHandle.setAttribute("data-corners", "true");
				domHandle.setAttribute("data-theme", theme);
				domHandle.setAttribute("data-shadow", "true");

				domHandle.setAttribute("role", "slider");
				domHandle.setAttribute("aria-valuemin", min);
				domHandle.setAttribute("aria-valuemax", max);
				domHandle.setAttribute("aria-valuenow", initValue);
				domHandle.setAttribute("aria-valuetext", initValue);
				domHandle.setAttribute("title", initValue);
				domHandle.setAttribute("aria-labelledby", "labelID");
				domHandle.setAttribute("data-role", "button");
				domHandle.setAttribute("inline", "false");
				domHandle.setAttribute("data-bar", "true");
				domHandle.setAttribute("id", elementId + "-handle");
				engine.instanceWidget(domHandle, "Button");

				if (tagName === "select") {
					wrapper = document.createElement("div");
					wrapper.className = classes.sliderInneroffset;

					for (j = 0, length = domSliderChildNod.length;
							j < length; j++) {
						wrapper.appendChild(domSliderChildNod[j]);
					}

					domSlider.appendChild(wrapper);

					// make the handle move with a smooth transition
					domHandle.classList.add("ui-slider-handle-snapping");

					for (i = 0, optionsCount = element.length;
							i < optionsCount; i++) {
						side = i ? "a" : "b";
						sliderTheme = i ? btnClasses.uiBtnActive :
								sliderBtnDownTheme;
						/* TODO - check sliderlabel */
						sliderImg = document.createElement("span");
						sliderImgClassL = sliderImg.classList;
						sliderImgClassL.add(classes.sliderLabel);
						sliderImgClassL.add(classes.sliderLabelTheme + side);
						sliderImgClassL.add(sliderTheme);
						sliderImgClassL.add(btnClasses.uiBtnCornerAll);

						sliderImg.setAttribute("role", "img");
						sliderImg.appendChild(document.createTextNode(
								element[i].innerHTML));
						domSlider.insertBefore(
								sliderImg, domSlider.firstChild);
					}
					sliderContainer = domSlider;
				}

				if (tagName === "input") {
					sliderContainer = document.createElement("div");
					sliderContainer.classList.add(classes.sliderContainer);
					sliderContainer.appendChild(domSlider);
					sliderContainer.id = elementId + "-container";
					elementClassList = element.classList;
					elementClassList.add(TextInput.classes.uiInputText);
					elementClassList.add(classes.theme + theme);
					elementClassList.add(classes.sliderInput);
					element.style.display = "none";
				} else {
					element.classList.add(classes.sliderSwitch);
				}

				//before it was used in refresh which was called during init,
				//needs duplication in build in order to pass tests
				if (initValue === 1) {
					domHandle.classList.add(classes.sliderToggleOn);
					domHandle.style.left = "27px";
				}

				domHandle.style.right = "auto";

				element.parentNode.insertBefore(sliderContainer,
						element.nextSibling);

				return element;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Slider
			 */
			Slider.prototype._init = function (element) {
				var elementId = element.id,
					self = this,
					ui = self._ui;

				self.element = element;
				ui.slider = document.getElementById(elementId + "-slider");
				ui.handle = document.getElementById(elementId + "-handle");
				ui.container = document.getElementById(elementId +
						"-container") || element;
				ui.background = ui.slider.querySelector("." +
						Slider.classes.sliderBg);
				self._type = element.tagName.toLowerCase();
				ui.labels = selectors.getChildrenByClass(ui.slider,
						Slider.classes.sliderLabel);
				if ( self.options.center && ui.background )
					ui.background.classList.add(
							Slider.classes.sliderBgHasCenter);
				refresh(self, self._getValue());
			};

			/**
			 * Get or Set value of the widget
			 *
			 * Return element value or set the value
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			var slider = document.getElementById("slider"),
			 *				sliderWidget = tau.widget.Slider(slider),
			 *			// value contains index of select tag
			 *			value = sliderWidget.value();
			 *			//sets the index for the toggle
			 *			sliderWidget.value("1");
			 *		</script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			// value contains index of select tag
			 *			$( "#slider" ).slider( "value" );
			 *			// sets the index for the toggle
			 *			$( "#slider" ).slider( "value", "1" );
			 *		</script>
			 *
			 * @method value
			 * @return {string} In get mode return element value or element
			 * selected index based on tag name.
			 * @since 2.3
			 * @member ns.widget.mobile.Slider
			 */

			/**
			 * Get value of toggle switch. If widget is based on input type
			 * tag otherwise it return index of the element
			 * @method _getValue
			 * @protected
			 * @member ns.widget.mobile.Slider
			 */
			Slider.prototype._getValue = function () {
				return this._type === "input" ?
						parseFloat(this.element.value) :
								this.element.selectedIndex;
			};

			/**
			 * Set value of toggle switch
			 * @method _setValue
			 * @param {string} value
			 * @protected
			 * @member ns.widget.mobile.Slider
			 */
			Slider.prototype._setValue = function (value) {
				var self = this,
					element;

				element = self.element;

				if (element.tagName.toLowerCase() === "input") {
					element.value = value;
				} else {
					element.selectedIndex = value;
				}
			};

			/**
			 * Refresh a slider markup.
			 *
			 * This method will rebuild while DOM structure of widget.
			 *
			 * This method should be called after are manually change in HTML
			 * attributes of widget DOM structure.
			 *
			 * This method is called automatically after change any option
			 * of widget.
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			var slider = document.getElementById("slider"),
			 *				  sliderWidget = tau.widget.Slider(slider),
			 *			sliderWidget.refresh();
			 *		</script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			$( "#slider" ).slider( "refresh" );
			 *		</script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.Slider
			 */

			/**
			 * Refresh slider
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.Slider
			 */
			Slider.prototype._refresh = function () {
				var self = this;
				if (self.value !== self._getValue()) {
					refresh(self, self._getValue());
				}
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.Slider
			 */
			Slider.prototype._bindEvents = function (element) {
				var self = this,
					ui = self._ui,
					handle = ui.handle,
					tagName = element.nodeName.toLowerCase(),
					slider = ui.slider,
					step = parseFloat( self.element.getAttribute( "step" ) ||
							1 ),
					min = tagName === "input" ?
							parseFloat(element.getAttribute("min")) : 0,
					max = tagName === "input"
							? parseFloat(element.getAttribute("max")) :
									element.getElementsByTagName(
											"option").length - 1;

				element.addEventListener("change", function () {
					if (!self.mouseMoved) {
						refresh(self, self._getValue(), true);
					}
				}, false);

				element.addEventListener("keyup", function () {
					refresh(self, self._getValue(), true, true);
				}, false);

				element.addEventListener("blur", function () {
					refresh(self, self._getValue(), true);
				}, false);

				handle.addEventListener("vmousedown", function (event) {
					events.trigger(event.target, "focus");
				}, false);
				handle.addEventListener("vclick", function (event) {
					event.stopPropagation();
					event.preventDefault();
				}, false);
				handle.addEventListener("keydown", function (event) {
					var index = getInitialValue(tagName, element),
						keyCode = Slider.keyCode,
						classList = event.target.classList;

					if (self.options.disabled) {
						return;
					}

					// In all cases prevent the default and mark the handle
					// as active
					switch (event.keyCode) {
						case keyCode.HOME:
						case keyCode.END:
						case keyCode.PAGE_UP:
						case keyCode.PAGE_DOWN:
						case keyCode.UP:
						case keyCode.RIGHT:
						case keyCode.DOWN:
						case keyCode.LEFT:
							event.preventDefault();

							if (!self._keySliding) {
								self._keySliding = true;
								classList.add(classes.sliderStateActive);
							}
							break;
					}
					// move the slider according to the keypress
					switch (event.keyCode) {
						case keyCode.HOME:
							refresh(self, min);
							break;
						case keyCode.END:
							refresh(self, max);
							break;
						case keyCode.PAGE_UP:
						case keyCode.UP:
						case keyCode.RIGHT:
							refresh(self, index + step);
							break;
						case keyCode.PAGE_DOWN:
						case keyCode.DOWN:
						case keyCode.LEFT:
							//self.refresh(index - step);
							refresh(self, index - step);
							break;
					}


				}, false);
				handle.addEventListener("keyup", function () {
					if (self._keySliding) {
						self._keySliding = false;
						handle.classList.remove(classes.sliderStateActive);
					}
				}, false);
				slider.addEventListener("touchend", function () {
					self.dragging = false;
					handle.classList.add("ui-slider-handle-snapping");
					refresh(self, getInitialValue(tagName, element),
							true, true);
				}, false);

				slider.addEventListener("vmousedown", function (event) {
					if (self.options.disabled) {
						return false;
					}

					self.dragging = true;
					self.userModified = false;
					self.mouseMoved = false;

					if (tagName === "select") {
						self.beforeStart = element.selectedIndex;
					}
					refresh(self, event);
					return false;
				}, false);
				/*TODO - add vmousemove support*/

				this._onVmouseMove = onVmouseMove.bind(null, this);
				slider.addEventListener("vmousemove", this._onVmouseMove,
						false);

				slider.addEventListener("vclick", function (event) {
					event.stopPropagation();
					event.preventDefault();
				}, false);
				//prevent scrolling when slider is in use
				slider.addEventListener("touchmove", onTouchMove, false);

				this._sliderMouseUp = sliderMouseUp.bind(null, this);
				slider.addEventListener("vmouseup", this._sliderMouseUp,
						false);

			};

			/**
			 * Enable the slider
			 *
			 * Method removes disabled attribute on slider and changes look
			 * of slider to enabled state.
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			var slider = document.getElementById("slider"),
			 *				  sliderWidget = tau.widget.Slider(slider),
			 *			sliderWidget.enable();
			 *		</script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			$( "#slider" ).slider( "enable" );
			 *		</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.Slider
			 */

			/**
			 * Enable slider
			 * @method _enable
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Slider
			 */
			Slider.prototype._enable = function (element) {
				var btnClasses = Button.classes,
					slider = this._ui.slider;

				element.removeAttribute("disabled");
				slider.classList.remove( btnClasses.uiDisabled );
				slider.setAttribute("aria-disabled", false);
				this.options.disabled = false;
			};

			/**
			 * Disable the slider
			 *
			 * Method sets disabled attribute on slider and changes look
			 * of slider to disabled state.
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			var slider = document.getElementById("slider"),
			 *				sliderWidget = tau.widget.Slider(slider),
			 *			sliderWidget.disable();
			 *		</script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			$( "#slider" ).slider( "disable" );
			 *		</script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.Slider
			 */

			/**
			 * Disable slider
			 * @method _disable
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Slider
			 */
			Slider.prototype._disable = function (element) {
				var btnClasses = Button.classes,
					slider = this._ui.slider;

				element.setAttribute("disabled", "disabled");
				slider.classList.add( btnClasses.uiDisabled );
				slider.setAttribute( "aria-disabled", true );
				this.options.disabled = true;
			};

			// @TODO add destroy() method

			ns.widget.mobile.Slider = Slider;
			engine.defineWidget(
				"Slider",
				"select[data-type='range']",
				[],
				Slider,
				"mobile"
			);
			}(window.document, ns));

/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Deferred When Utility
 * Class groups many deferred object to one.
 * @class ns.util.deferredWhen
 */
(function (window, document, ns) {
	
				var when = function( subordinate /* , ..., subordinateN */ ) {
				var i = 0,
					resolveValues = [].slice.call( arguments ),
					length = resolveValues.length,

					/**
					 * The count of uncompleted subordinates
					 * @property {number} remaining
					 * @member ns.util.deferredWhen
					 * @private
					 */
					remaining = length !== 1 || (subordinate && (typeof subordinate.promise === "function")) ? length : 0,

					/**
					 * The master Deferred. If resolveValues consist of only
					 * a single Deferred, just use that.
					 * @property {ns.util.deferred} deferred
					 * @member ns.util.deferredWhen
					 * @private
					 */
					deferred = remaining === 1 ? subordinate : new ns.util.deferred(),

					/**
					 * Update function for both resolve and progress values
					 * @method updateFunc
					 * @param {number} i
					 * @param {Array} contexts
					 * @param {Array} values
					 * @return {Function} representing the current state
					 * "pending" | "resolved" | "rejected"
					 * @member ns.util.deferredWhen
					 * @private
					 */
					updateFunc = function( i, contexts, values ) {
						return function( value ) {
							contexts[ i ] = this;
							values[ i ] = arguments.length > 1 ? [].slice.call( arguments ) : value;
							if ( values === progressValues ) {
								deferred.notifyWith( contexts, values );

							} else if ( !(--remaining) ) {
								deferred.resolveWith( contexts, values );
							}
						};
					},

					progressValues,
					progressContexts,
					resolveContexts;

				// add listeners to Deferred subordinates; treat others as resolved
				if (length > 1) {
					progressValues = [];
					progressValues.length =  length;
					progressContexts = [];
					progressContexts.length = length;
					resolveContexts = [];
					resolveContexts.length = length;
					for ( ; i < length; i++ ) {
						if (resolveValues[i] && (typeof resolveValues[i].promise === "function")) {
							resolveValues[i].promise()
								.done(updateFunc(i, resolveContexts, resolveValues))
								.fail(deferred.reject)
								.progress(updateFunc(i, progressContexts, progressValues));
						} else {
							--remaining;
						}
					}
				}

				// if we're not waiting on anything, resolve the master
				if (!remaining) {
					deferred.resolveWith(resolveContexts, resolveValues);
				}

				return deferred.promise();
			};

			ns.util.deferredWhen = when;

			}(window, window.document, ns));

/*global window, define */
/*jslint nomen: true, plusplus: true */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Easing Utility
 * Utility calculates time function for animations.
 * @class ns.util.easing
 */

(function (ns) {
	
				ns.util.easing = {
				/**
				* Performs cubit out easing calcuclations based on time
				* @method cubicOut
				* @member ns.util.easing
				* @param {number} currentTime
				* @param {number} startValue
				* @param {number} changeInValue
				* @param {number} duration
				* @return {number}
				* @static
				*/
				cubicOut: function (currentTime, startValue, changeInValue, duration) {
					currentTime /= duration;
					currentTime--;
					return changeInValue * (currentTime * currentTime * currentTime + 1) + startValue;
				},

				/**
				 * Performs quad easing out calcuclations based on time
				 * @method easeOutQuad
				 * @member ns.util.easing
				 * @param {number} currentTime
				 * @param {number} startValue
				 * @param {number} changeInValue
				 * @param {number} duration
				 * @return {number}
				 * @static
				 */
				easeOutQuad: function (currentTime, startValue, changeInValue, duration) {
					return -changeInValue * (currentTime /= duration) * (currentTime - 2) + startValue;
				},

				/**
				* Performs out expo easing calcuclations based on time
				* @method easeOutExpo
				* @member ns.util.easing
				* @param {number} currentTime
				* @param {number} startValue
				* @param {number} changeInValue
				* @param {number} duration
				* @return {number}
				* @static
				*/
				easeOutExpo: function (currentTime, startValue, changeInValue, duration) {
					return (currentTime === duration) ?
							startValue + changeInValue :
								changeInValue * (-Math.pow(2, -10 * currentTime / duration) + 1) +
								startValue;
				},
				/**
				* Performs out linear calcuclations based on time
				* @method linear
				* @member ns.util.easing
				* @param {number} currentTime
				* @param {number} startValue
				* @param {number} changeInValue
				* @param {number} duration
				* @return {number}
				* @static
				*/
				linear: function (currentTime, startValue, changeInValue, duration) {
					return startValue + duration * currentTime;
				}
			};
			}(ns));

/*global window, define */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Event orientationchange
 * Namespace to support orientationchange event
 * @class ns.event.orientationchange
 */
/**
 * Event orientationchange
 * @event orientationchange
 * @member ns.event.orientationchange
 */
(function (window, document, ns) {
	
				var body = document.body,
				orientation = null,
				eventUtils = ns.event,
				orientationchange = {
					/**
					 * Informs about support orientation change event.
					 * @property {boolean} supported
					 * @member ns.event.orientationchange
					 */
					supported: (window.orientation !== undefined) && (window.onorientationchange !== undefined),
					/**
					 * Returns current orientation.
					 * @method getOrientation
					 * @return {"landscape"|"portrait"}
					 * @member ns.event.orientationchange
					 * @static
					 */
					getOrientation: function () {
						return orientation;
					},
					/**
					 * Triggers event orientationchange on element
					 * @method trigger
					 * @param {HTMLElement} element
					 * @member ns.event.orientationchange
					 * @static
					 */
					trigger: function (element) {
						eventUtils.trigger(element, "orientationchange", {'orientation': orientation});
					},
					/**
					 * List of properties copied to event details object
					 * @property {Array} properties
					 * @member ns.event.orientationchange
					 * @static
					 */
					properties: ['orientation']
				},
				detectOrientationByDimensions = function (omitCustomEvent) {
					var width = window.innerWidth,
						height = window.innerHeight;
					if (window.screen) {
						width = window.screen.availWidth;
						height = window.screen.availHeight;
					}

					if (width > height) {
						orientation = "landscape";
					} else {
						orientation = "portrait";
					}

					if (!omitCustomEvent) {
						eventUtils.trigger(window, "orientationchange", {'orientation': orientation});
					}
				},
				checkReportedOrientation = function () {
					if (window.orientation) {
						switch (window.orientation) {
						case 90:
						case -90:
							orientation = "portrait";
							break;
						default:
							orientation = "landscape";
							break;
						}
					} else {
						detectOrientationByDimensions(true);
					}
				},
				matchMediaHandler = function (mediaQueryList) {
					if (mediaQueryList.matches) {
						orientation = "portrait";
					} else {
						orientation = "landscape";
					}
					eventUtils.trigger(window, "orientationchange", {'orientation': orientation});
				},
				portraitMatchMediaQueryList;

			if (orientationchange.supported) {
				window.addEventListener("orientationchange", checkReportedOrientation, false);
				checkReportedOrientation();
				// try media queries
			} else {
				if (window.matchMedia) {
					portraitMatchMediaQueryList = window.matchMedia("(orientation: portrait)");
					if (portraitMatchMediaQueryList.matches) {
						orientation = "portrait";
					} else {
						orientation = "landscape";
					}
					portraitMatchMediaQueryList.addListener(matchMediaHandler);
				} else {
					body.addEventListener("throttledresize", detectOrientationByDimensions);
					detectOrientationByDimensions();
				}
			}

			ns.event.orientationchange = orientationchange;

			}(window, window.document, ns));


/*jslint nomen: true, plusplus: true */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Page Widget
 * Page widget represents the screen of an application
 *
 * ## Default selectors
 * All elements which have a class _.ui-page or a _data-role=page
 * will become Page widgets
 *
 * ### HTML examples
 *
 * #### Create a page widget using the data-role attribute
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content">
 *				page content
 *			</div>
 *		</div>
 *
 * #### Create page widget using data-role attribute with header and footer
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="header">
 *				My Page
 *			</div>
 *			<div data-role="content">
 *				page contents
 *			</div>
 *			<div data-role="footer">
 *				Status: OK
 *			</div>
 *		</div>
 *
 * #### Create a page widget using css classes
 *
 *		@example
 *		<div class="ui-page">
 *			<div class="ui-content">
 *				page content
 *			</div>
 *		</div>
 *
 * #### Create a page widget using css classes with header and footer
 *
 *		@example
 *		<div class="ui-page">
 *			<div class="ui-header">
 *				My Page
 *			</div>
 *			<div class="ui-content">
 *				page contents
 *			</div>
 *			<div class="ui-footer">
 *				Status: OK
 *			</div>
 *		</div>
 *
 * ### Manual constructor
 *
 * Thease examples show how to create a Page widget by hand using
 * JavaScript code
 *
 * #### Created using TAU api
 *
 *		@example
 *		<div id="myPage"></div>
 *		<script type="text/javascript">
 *			var page = tau.widget.Page(document.getElementById("myPage"));
 *		</script>
 *
 * #### Created using jQuery api
 *
 *		@example
 *		<div id="myPage"></div>
 *		<script type="text/javascript">
 *			var page = $("#myPage").page();
 *		</script>
 *
 * ## Options for Page widget
 *
 * Options can be set by using data-* attributes or by passing them
 * to the constructor.
 *
 * There is also a method **option** for changing them after widget
 * creation.
 *
 * jQuery mobile format is also supported.
 *
 * ### Fullscreen
 *
 * Determines if the page is shown fullscreen. The default value is
 * *false*.
 *
 * You can change this by all available methods for options setting.
 *
 * #### By data-fullscreen attribute
 *
 *		@example
 *		<div data-role="page" data-fullscreen="true"></div>
 *
 * #### By config object passed to constructor
 *
 *		@example
 *		<div id="myPage"></div>
 *		<script type="text/javascript">
 *			var page = tau.widget.Page(document.getElementById("myPage"), {"fullscreen": true});
 *		</script>
 *
 * #### By setting the option after widget creation
 *
 *		@example
 *		<div data-role="page"></div>
 *		<script type="text/javascript">
 *			var page = tau.widget.Page(document.getElementById("myPage"));
 *			page.option("fullscreen", true);
 *		</script>
 *
 * #### By using jQuery API
 *
 *		@example
 *		<div data-role="page"></div>
 *		<script type="text/javascript">
 *			$("#myPage").page({"fullscreen": true});
 *		</script>
 *
 * ### Themes
 *
 * By using theme options we can change the default theme of a Page
 *
 * Possible theme options are: *theme*, *contentTheme*, *footerTheme*
 * and *headerTheme*. The default value for all of them is *"a"*.
 *
 * #### Using data-* attributes
 *		@example
 *		<div data-role="page" data-theme="s" data-content-theme="s" data-footer-theme="s"></div>
 *
 * #### Using config object passed to constructor
 *
 *		@example
 *		<div id="myPage"></div>
 *		<script type="text/javascript">
 *			var page = tau.widget.Page(document.getElementById("myPage"), {
 *				"theme": "s",
 *				"footerTheme": "s",
 *				"contentTheme": "s"
 *			});
 *		</script>
 *
 * #### Using jQuery API
 *
 *		@example
 *		<div id="myPage"></div>
 *		<script type="text/javascript">
 *			var page = $("#myPage").page({
 *				"theme": "s",
 *				"footerTheme": "s",
 *				"contentTheme": "s"
 *			});
 *		</script>
 *
 * ## Methods
 *
 * Page methods can be can be accessed trough 2 APIs: TAU API and jQuery
 * API (jQuery Mobile-like API)
 *
 * **WARNING** Some methods are not accessible through jQuery API
 * since jQuery already supplies functionalities for them (ex. focus).
 *
 * @class ns.widget.mobile.Page
 * @extends ns.widget.mobile.BaseWidgetMobile
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Krzysztof Głodowski <k.glodowski@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */

/**
 * Triggered before switching current page
 * @event pagebeforchange
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before the widget is created and initialized
 * @event pagebeforecreate
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before current page is about to be closed
 * @event pagebeforehide
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before external page will be loaded
 * @event pagebeforeload
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before page will be displayed
 * @event pagebeforeshow
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after switching current page
 * @event pagechange
 * @member ns.widget.mobile.Page
 *
 */

/**
 * Triggered when page switching failed
 * @event pagechangefailed
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after widget creation
 * @event pagecreate
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after the page is hidden
 * @event pagehide
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after widget initialization occurs
 * @event pageinit
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after an external page is loaded
 * @event pageload
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after the external page is removed from the DOM
 * @event pagremove
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after the page is displayed
 * @event pageshow
 * @member ns.widget.mobile.Page
 */

(function (ns) {
	
				var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				selectors = ns.util.selectors,
				object = ns.util.object,
				utilsDOM = ns.util.DOM,
				slice = [].slice,
				Page = function () {
					/**
					 * @property {boolean} [pageSetHeight=false] The flag is indicates that height of the page  was set by framework
					 * @member ns.widget.mobile.Page
					 */
					this.pageSetHeight = false;
					this.contentFillCallback = null;
					this.contentFillAfterResizeCallback = null;
					this.destroyCallback = null;
					this.options = object.copy(Page.prototype.options);
				};

			/**
			 * Dictionary for page related css class names
			 * @property {Object} classes
			 * @property {string} [classes.uiPrefix='ui-'] Main ui prefix
			 * @property {string} [classes.uiBarPrefix='ui-bar-'] Ui bar prefix
			 * @property {string} [classes.uiBodyPrefix='ui-body-'] Ui body prefix
			 * @property {string} [classes.uiBtnBack='ui-btn-back'] Button class
			 * @property {string} [classes.uiTabbarMargin-back='ui-tabbar-margin-back'] Tabbar margin class
			 * @property {string} [classes.uiTitle='ui-title'] Title class
			 * @property {string} [classes.uiTitleTextStub='ui-title-text-stub'] Title stub class
			 * @property {string} [classes.uiTitleMultiline='ui-title-multiline'] Title multiline class
			 * @property {string} [classes.uiPage='ui-page'] Main page class
			 * @property {string} [classes.uiPageActive='ui-page-active'] Page active class
			 * @property {string} [classes.uiPageHeaderFullscreen='ui-page-header-fullscreen'] Page header fullscreen class
			 * @property {string} [classes.uiPageFooterFullscreen='ui-page-footer-fullscreen'] Page footer fullscreen class
			 * @property {string} [classes.uiPageHeaderFixed='ui-page-header-fixed'] Page header fixed class
			 * @property {string} [classes.uiPageFooterFixed='ui-page-footer-fixed'] Page footer fixed class
			 * @property {string} [classes.uiOverlayPrefix='ui-overlay-'] Ui overlay prefix
			 * @property {string} [classes.uBtnLeft='ui-btn-left'] Left button class
			 * @property {string} [classes.uiBtnRight='ui-btn-right'] Right button class
			 * @property {string} [classes.uiBtnRightPrefix='ui-btn-right-'] Right button prefix
			 * @property {string} [classes.fixedSuffix='-fixed'] Class fixed suffix
			 * @property {string} [classes.fullscreenSuffix='-fullscreen'] class fullscreen suffix
			 * @member ns.widget.mobile.Page
			 * @static
			 * @readonly
			 */
			Page.classes = {
				uiPrefix: "ui-",
				uiBarPrefix: "ui-bar-",
				uiBodyPrefix: "ui-body-",
				uiBtnBack: "ui-btn-back",
				uiTabbarMarginBack: "ui-tabbar-margin-back",
				uiTitle: "ui-title",
				uiTitleTextSub: "ui-title-text-sub",
				uiTitleMultiline: "ui-title-multiline",
				uiFooterBtn: "ui-footer-btn-",
				uiPage: "ui-page",
				uiPageActive: "ui-page-active",
				uiPageContent: "ui-content",
				uiPageHeader: "ui-header",
				uiPageFooter: "ui-footer",
				uiPageHeaderFullscreen: "ui-page-header-fullscreen",
				uiPageFooterFullscreen: "ui-page-footer-fullscreen",
				uiPageHeaderFixed: "ui-page-header-fixed",
				uiPageFooterFixed: "ui-page-footer-fixed",
				uiOverlayPrefix: "ui-overlay-",
				uiBtnLeft: "ui-btn-left",
				uiBtnRight: "ui-btn-right",
				uiBtnRightPrefix: "ui-btn-right-",
				fixedSuffix: "-fixed",
				fullscreenSuffix: "-fullscreen"
				// @todo put all used classes here
			};

			Page.prototype = new BaseWidget();

			/**
			 * Object with default options
			 * @property {Object} options
			 * @property {boolean} [options.fullscreen=false] Fullscreen page flag
			 * @property {string} [options.theme='a'] Page theme
			 * @property {boolean} [options.domCache=false] Use DOM cache
			 * @property {?string} [options.contentTheme=null] Page content theme
			 * @property {string} [options.headerTheme='a'] Page header theme. If headerTheme is empty `theme` will be used
			 * @property {string} [options.footerTheme='a'] Page footer theme. If footerTheme is empty `theme` will be used
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.options = {
				fullscreen: false,
				theme: "a",
				domCache: false,
				keepNativeDefault: ns.getConfig("keepNative"),
				contentTheme: null,
				headerTheme: "a",
				footerTheme: "a",
				// @removed
				addBackBtn: false,
				enhanced: false
			};

			/**
			 * Text of back button
			 * @property {string} [backBtnText='Back']
			 * @member ns.widget.mobile.Page
			 * @protected
			 * @deprecated 2.3
			 */
			Page.prototype.backBtnText = "Back";

			/**
			 * Theme of back button
			 * @property {string} [backBtnTheme=null]
			 * @member ns.widget.mobile.Page
			 * @deprecated 2.3
			 */
			Page.prototype.backBtnTheme = null;

			// Sets top-bottom css attributes for content element
			// to allow it to fill the page dynamically
			// @method contentFill
			// @param {ns.widget.mobile.Page} self
			function contentFill(self) {
				var content,
					contentStyle,
					element = self.element,
					header,
					headerDivider,
					headerBtn,
					headerBtnWidth = 0,
					pageClasses = Page.classes,
					top = 0,
					bottom = 0,
					i,
					footer,
					len;

				if (element && !self.pageSetHeight && element.classList.contains(Page.classes.uiPageActive)) {
					content = element.querySelector("[data-role=content],." + pageClasses.uiPageContent);
					if (content) {
												contentStyle = content.style;
						header = element.querySelector("[data-role=header],." + pageClasses.uiPageHeader);

						if (header) {
							headerDivider = header.getElementsByClassName("ui-header-divider");
							len = headerDivider.length;
							if (len) {
								headerBtn = header.getElementsByClassName("ui-btn");
								// Header divider exist
								for (i = 0; i < len; i++) {
									headerBtnWidth += headerBtn[i].offsetWidth;
									headerDivider[i].style.right = headerBtnWidth + "px";
								}
							}
							top = utilsDOM.getElementHeight(header);
						}

						footer = element.querySelector("[data-role=footer],." + pageClasses.uiPageFooter);
						bottom = utilsDOM.getElementHeight(footer);

						contentStyle.top = top + "px";
						contentStyle.bottom = bottom + "px";
						contentStyle.height = utilsDOM.getElementHeight(content.parentNode) - top - bottom + "px";
						self.pageSetHeight = true;
					}
				}
			}

			// Build header/footer/content
			// @method buildSections
			// @param {Object} options Object with options for widget
			// @param {HTMLElement} pageElement main element of widget
			// @param {string} pageTheme page theme name
			function buildSections(options, pageElement, pageTheme) {
				var pageClassList = pageElement.classList,
					pageClasses = Page.classes,
					fullscreen = options.fullscreen;

				if (fullscreen) {
					// "fullscreen" overlay positioning
					pageClassList.add(pageClasses.uiPageHeaderFullscreen);
					pageClassList.add(pageClasses.uiPageFooterFullscreen);
				} else {
					// If not fullscreen, add class to page to set top or bottom padding
					pageClassList.add(pageClasses.uiPageHeaderFixed);
					pageClassList.add(pageClasses.uiPageFooterFixed);
				}

				[].slice.call(pageElement.querySelectorAll("[data-role='header'],[data-role='content'],[data-role='footer'],." +
						pageClasses.uiPageHeader +
						",." + pageClasses.uiPageContent +
						",." + pageClasses.uiPageFooter))
					.forEach(function (section) {
						var role = section.getAttribute("data-role"),
							sectionTheme = section.getAttribute("data-theme"),
							currentTheme,
							sectionClassList = section.classList,
							transition,
							headerButtons,
							headerButtonsWidth = 0,
							headerAnchors,
							headerDivider,
							footerButtons,
							footerWidth,
							moreButton,
							leftButton,
							rightButton,
							previousElementOfHeaderButton;

						if (!role) {
							if (sectionClassList.contains(pageClasses.uiPageHeader)) {
								role = "header";
							} else if (sectionClassList.contains(pageClasses.uiPageContent)) {
								role = "content";
							} else {
								role = "footer";
							}

							section.setAttribute("data-role", role);
						}

						sectionClassList.add(pageClasses.uiPrefix + role);

						// Adding transition classes for all matched elements
						// @todo support transition form config
						transition = section.getAttribute("data-transition") || "";

						if (transition && transition !== "none") {
							if (transition === "slide") {
								transition = role === "header" ? "slidedown" : "slideup";
							}
							sectionClassList.add(transition);
						}

						if (role === "content") {
							section.setAttribute("role", "main");
							currentTheme = sectionTheme || options.contentTheme;
							if (currentTheme) {
								sectionClassList.add(pageClasses.uiBodyPrefix + currentTheme);
							}
						} else {
							currentTheme = sectionTheme || (role === "header" ? options.headerTheme : options.footerTheme) || pageTheme;
							sectionClassList.add(pageClasses.uiBarPrefix + currentTheme);

							// We always set the ui-[header|footer]-fixed class to match Tizen design needs
							sectionClassList.add(pageClasses.uiPrefix + role + pageClasses.fixedSuffix);

							if (fullscreen) {
								sectionClassList.add(pageClasses.uiPrefix + role + pageClasses.fullscreenSuffix);
							}

							section.setAttribute("role", role === "header" ? "banner" : "contentinfo");

							if (role === "header") {
								headerAnchors = selectors.getChildrenBySelector(section, "a, div.naviframe-button, button, [data-role=button]");
								headerAnchors.forEach(function (anchor) {
									var anchorClassList = anchor.classList;
									leftButton = anchorClassList.contains(pageClasses.uiBtnLeft);
									rightButton = anchorClassList.contains(pageClasses.uiBtnRight);
								});

								if (!leftButton && headerAnchors[0] && !headerAnchors[0].classList.contains(pageClasses.uiBtnRight)) {
									leftButton = headerAnchors[0];
									utilsDOM.setNSData(leftButton, "role", "button");
									leftButton.classList.add(pageClasses.uiBtnLeft);
								}

								if (!rightButton && headerAnchors[1]) {
									rightButton = headerAnchors[1];
									utilsDOM.setNSData(rightButton, "role", "button");
									rightButton.classList.add(pageClasses.uiBtnRight);
								}

								headerButtons = selectors.getChildrenBySelector(section, "a,[data-role='button']");
								if (headerButtons.length) {
									headerButtons.forEach(function (button) {
										engine.instanceWidget(button, "Button");
										previousElementOfHeaderButton = button.previousElementSibling;
										// @TODO move this calculation after page show
										headerButtonsWidth += 90;//utilsDOM.getElementWidth(button, true) + 2;

									});
								}
								if (section.querySelector("." + pageClasses.uiTitleTextSub)) {
									sectionClassList.add(pageClasses.uiTitleMultiline);
								}
							} else if (role === "footer") {
								footerButtons = selectors.getChildrenBySelector(section, "a,div.naviframe-button,[data-role='button'],button,[type='button'],[type='submit'],[type='reset']");
								if (footerButtons.length) {
									//TODO rethink this solution
									footerWidth = section.offsetWidth || window.innerWidth;
									moreButton = selectors.getChildrenBySelector(section, "[data-icon='naviframe-more']");
									if (moreButton.length) {
										footerWidth -= utilsDOM.getElementWidth(moreButton[0]);
									}
									footerButtons.forEach(function (button) {
										var buttonStyle = button.style;
										engine.instanceWidget(button, "Button", {
											role: "button"
										});
									});
									section.classList.add(pageClasses.uiFooterBtn + footerButtons.length);
								}
							}

							selectors.getChildrenBySelector(section, "h1, h2, h3, h4, h5, h6").forEach(function (title) {
								var headerImgsWidth = 0,
									headerSrcNum = 0,
									width,
									titleStyle = title.style;

								title.classList.add(pageClasses.uiTitle);
								title.setAttribute("role", "heading");
								title.setAttribute("aria-level", 1);
								title.setAttribute("aria-label", "title");
								width = window.innerWidth - headerButtonsWidth - headerImgsWidth * headerSrcNum * 4;

								titleStyle.width = width + "px";
							});
						}
					});
			}

			// Method builds widget.
			// @method buildStructure
			// @param {Object} options object with options for create page
			// @param {HTMLElement} element base element of page
			function buildStructure(options, element) {
				var pageTheme = options.theme,
					dataPageTitle = utilsDOM.getNSData(element, "title"),
					pageTitle = dataPageTitle,
					titleElement,
					classes = Page.classes;

				element.classList.add(classes.uiPage);
				element.classList.add(classes.uiBodyPrefix + pageTheme);

				if (!pageTitle) {
					titleElement = selectors.getChildrenByDataNS(element, "role=header")[0];
					if (titleElement) {
						titleElement = titleElement.getElementsByClassName(classes.uiTitle)[0];
						if (titleElement) {
							pageTitle = titleElement.innerText;
						}
					}
				}

				if (!dataPageTitle && pageTitle) {
					utilsDOM.setNSData(element, "title", pageTitle);
				}
				buildSections(options, element, pageTheme);
			}

			/**
			 * Build page
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._build = function (element) {
				buildStructure(this.options, element);
				return element;
			};

			/*Page.prototype._updatePadding = function (page) {
				var pageStyle = page.style;
				Array.prototype.slice.call(page.querySelectorAll("[data-role='header'],[data-role='content'],[data-role='footer']")).forEach(function (section) {
					var role = section.getAttribute("data-role"),
						dataposition = section.getAttribute("data-position"),
						sectionStyle = section.style;
					if (dataposition === "fixed") {
						sectionStyle.position = "fixed";
						if (role === "header") {
							pageStyle.paddingTop = section.offsetHeight + "px";
							sectionStyle.top = 0;
						} else if (role === "footer") {
							pageStyle.paddingBottom = section.offsetHeight + "px";
							sectionStyle.bottom = 0;
						}
					}
				});
			};*/

			/**
			 * Set page active / unactive
			 * Sets ui-overlay-... class on `body` depending on current theme
			 *
			 * !!!This method is only available through TAU API!!!
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.setActive(true, document.body);
			 *		</script>
			 *
			 * @TODO make params optional (default action should be make page active if
			 * its not in its own container)
			 * @method setActive
			 * @param {boolean} value if true then page will be active if false page will be unactive
			 * @param {HTMLElement} pageContainer
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.setActive = function (value, pageContainer) {
				var theme = this.options.theme,
					classes = Page.classes,
					themeClass = classes.uiOverlayPrefix + theme,
					bodyClassList = pageContainer.classList;

				if (value) {
					this.element.classList.add(classes.uiPageActive);
					this.focus();
					bodyClassList.add(themeClass);
				} else {
					this.element.classList.remove(classes.uiPageActive);
					this.blur();
					bodyClassList.remove(themeClass);
				}
			};

			/**
			 * GUI Builder only : redesign page when user drag&drop header, footer
			 *
			 * !!!This method is only available through TAU API!!!
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.setToolbar();
			 *		</script>
			 *
			 * @method setToolbar
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.setToolbar = function () {
				this.trigger("pagebeforeshow");
			};

			/**
			 * Removes background from the page containing element
			 *
			 * #### TAU API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.removeContainerBackground();
			 *		</script>
			 *
			 *#### jQuery API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			$("#myPage").page("removeContainerBackground");
			 *		</script>
			 *
			 * @method removeContainerBackground
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.removeContainerBackground = function () {
				engine.getRouter().getContainer().classList.remove("ui-overlay-" + engine.getTheme().getInheritedTheme(this.element.parentNode));
			};

			/**
			 *  Sets background for page containing element
			 *
			 * #### TAU API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.setContainerBackground("s");
			 *		</script>
			 *
			 * #### jQuery API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			$("#myPage").page("setContainerBackground", "s");
			 *		</script>
			 *
			 * @method setContainerBackground
			 * @param {string} [theme]
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.setContainerBackground = function (theme) {
				theme = theme || this.options.theme;
				engine.getRouter().getContainer().classList.add("ui-overlay-" + theme);
			};

			/**
			 * Add back button
			 * @method addBackBtn
			 * @deprecated 2.3
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.addBackBtn = function () {
				return null;
			};

			/**
			 * Returns native selector
			 *
			 * #### TAU API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage")),
			 *				s = page.keepNativeSelector();
			 *		</script>
			 *
			 * #### jQuery API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var s = $("#myPage").page("keepNativeSelector");
			 *		</script>
			 *
			 * @method keepNativeSelector
			 * @return {string}
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.keepNativeSelector = function () {
				var options = this.options,
					optionsKeepNative = options.keepNative,
					optionsKeepNativeDefault = options.keepNativeDefault,
					keepNativeDefined = optionsKeepNative && optionsKeepNative.trim();

				if (keepNativeDefined && optionsKeepNative !== optionsKeepNativeDefault) {
					return [optionsKeepNative, optionsKeepNativeDefault].join(", ");
				}

				return optionsKeepNativeDefault;
			};


			/**
			 * This will set the content element's top or bottom padding equal to the toolbar's height
			 *
			 * !!!This method is only available through TAU API!!!
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.updatePagePadding();
			 *		</script>
			 *
			 * @method updatePagePadding
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.updatePagePadding = function () {
				contentFill(this);
			};

			/**
			 * Calculate and update content height
			 *
			 * !!!This method is only available through TAU API!!!
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.updatePageLayout();
			 *		</script>
			 *
			 * @method updatePageLayout
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.updatePageLayout = function () {
				contentFill(this);
			};


			/**
			 * Sets the focus to page
			 *
			 * !!!This method is only available through TAU API!!
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.focus();
			 *		</script>
			 * @method focus
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.focus = function () {
				var autofocus = this.element.querySelector("[autofocus]");
				if (autofocus) {
					autofocus.focus();
					return;
				}
				this.element.focus();
			};

			/**
			 * Removes focus from page and all descendants
			 *
			 * !!!This method is only available through TAU API!!!
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.blur();
			 *		</script>
			 *
			 * @method blur
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.blur = function () {
				slice.call(this.element.querySelectorAll(":focus")).forEach(function (element) {
					element.blur();
				});
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._bindEvents = function (element) {
				var self = this;
				self.contentFillCallback = contentFill.bind(null, self);
				self.contentFillAfterResizeCallback = function () {
					self.pageSetHeight = false;
					contentFill(self);
				};
				self.destroyCallback = self.destroy.bind(self, element);
				/*
				* @TODO
				* mobile zoom and persistant toolbar
				element.addEventListener("pagebeforehide", function (e, ui) {
					var _updatePadding = this.getAttribute("data-update-page-padding") || true,
						disablePageZoom = this.getAttribute("data-disable-page-zoom") || true;
					if (disablePageZoom === true) {
						// @TODO $.mobile.zoom.enable( true );
					}
					var thisFooter = $( ".ui-footer-fixed:jqmData(id)", this ),
						thisHeader = $( ".ui-header-fixed:jqmData(id)", this ),
						nextFooter = thisFooter.length && ui.nextPage && $( ".ui-footer-fixed:jqmData(id='" + thisFooter.jqmData( "id" ) + "')", ui.nextPage ) || $(),
						nextHeader = thisHeader.length && ui.nextPage && $( ".ui-header-fixed:jqmData(id='" + thisHeader.jqmData( "id" ) + "')", ui.nextPage ) || $();
					if ( nextFooter.length || nextHeader.length ) {
						nextFooter.add( nextHeader ).appendTo( $.mobile.pageContainer );
						ui.nextPage.one( "pageshow", function () {
							nextFooter.add( nextHeader ).appendTo( this );
						});
					}
				}, false);
				*/
				window.addEventListener("throttledresize", self.contentFillAfterResizeCallback, false);
				element.addEventListener("updatelayout", self.contentFillAfterResizeCallback, false);
				element.addEventListener("pageshow", self.contentFillCallback, true);
				self.on("pageremove", self.destroyCallback);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._refresh = function () {
				buildStructure(this.options, this.element);
				this.pageSetHeight = false;
				contentFill(this);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._destroy = function () {
				var element = this.element;
				window.removeEventListener("throttledresize", this.contentFillAfterResizeCallback, false);
				this.off("pageremove", this.destroyCallback);
				if (element) {
					element.removeEventListener("pageshow", this.contentFillCallback, true);
				}
			};

			// definition
			ns.widget.mobile.Page = Page;
			engine.defineWidget(
				"Page",
				"[data-role='page'], .ui-page",
				[
					"keepNativeSelector",
					"setContainerBackground",
					"removeContainerBackground"
				],
				Page,
				"mobile"
			);
			}(ns));

/*global window, define, ns*/
/*jslint nomen: true */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * # ScrollView Widget
 * Widgets allows for creating scrollable panes, lists, etc.
 *
 * ## Default selectors
 * All elements with _data-role=content attribute or _.ui-scrollview
 * css class will be changed to ScrollView widgets, unless they specify
 * _data-scroll=none attribute.
 *
 * ### HTML Examples
 *
 * #### Data attribute
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content"><!-- this will become scrollview //-->
 *				content data
 *			</div>
 *		</div>
 *
 * #### CSS Class
 *
 *		@example
 *		<div data-role="page">
 *			<div class="ui-content"><!-- this will become scrollview //-->
 *				content data
 *			</div>
 *		</div>
 *
 * ## Manual constructor
 *
 * To create the widget manually you can use 2 different APIs, the TAU
 * API or jQuery API.
 *
 * ### Create scrollview by TAU API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				page content
 *			</div>
 *		</div>
 *		<script>
 *			var page = tau.widget.Page(document.getElementById("myPage")),
 *				scrollview = tau.widget.Scrollview(page.ui.content);
 *		</script>
 *
 * ### Create scrollview using jQuery API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				page content
 *			</div>
 *		</div>
 *		<script>
 *			$("#myPage > div[data-role='content']").scrollview();
 *		</script>
 *
 * ## Options for Scrollview widget
 *
 * Options can be set using data-* attributes or by passing them to
 * the constructor.
 *
 * There is also a method **option** for changing them after widget
 * creation.
 *
 * jQuery mobile format is also supported.
 *
 * ## Scroll
 *
 * This options specifies of a content element should become Scrollview
 * widget.
 *
 * You can change this by all available methods for changing options.
 *
 * ### By data-scroll attribute
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content" data-scroll="none">
 *				content
 *			</div>
 *		</div>
 *
 * ### By config passed to constructor
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			var contentElement = document.querySelector(".myPageClass > div[data-role=content]");
 *			tau.widget.Scrollview(contentElement, {
 *				"scroll": false
 *			});
 *		</script>
 *
 * ### By using jQuery API
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			$(".myPageClass > div[data-role='content']").scrollview({
 *				"scroll": false
 *			});
 *		</script>
 *
 * ## ScrollJumps
 *
 * Scroll jumps are small buttons which allow the user to quickly
 * scroll to top or left
 *
 * You can change this by all available methods for changing options.
 *
 * ### By data-scroll-jump
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content" data-scroll-jump="true">
 *				content
 *			</div>
 *		</div>
 *
 * ### By config passed to constructor
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			var contentElement = document.querySelector(".myPageClass > div[data-role=content]");
 *			tau.widget.Scrollview(contentElement, {
 *				"scrollJump": true
 *			});
 *		</script>
 *
 * ### By using jQuery API
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			$(".myPageClass > div[data-role='content']").scrollview({
 *				"scrollJump": true
 *			});
 *		</script>
 *
 * ## Methods
 *
 * Page methods can be called trough 2 APIs: TAU API and jQuery API
 * (jQuery mobile-like API)
 *
 * @class ns.widget.mobile.Scrollview
 * @extends ns.widget.BaseWidget
 *
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Grzegorz Osimowicz <g.osimowicz@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 */
/**
 * Triggered when scrolling operation starts
 * @event scrollstart
 * @member ns.widget.mobile.Scrollview
 */
/**
 * Triggered when scroll is being updated
 * @event scrollupdate
 * @member ns.widget.mobile.Scrollview
 */
/**
 * Triggered when scrolling stops
 * @event scrollstop
 * @member ns.widget.mobile.Scrollview
 */
(function (window, document, ns) {
	
				var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				util = ns.util,
				easingUtils = ns.util.easing,
				eventUtils = ns.event,
				DOMUtils = ns.util.DOM,
				selectors = ns.util.selectors,
				currentTransition = null,
				Page = ns.widget.mobile.Page,
				pageClass = Page.classes.uiPage,
				pageActiveClass = Page.classes.uiPageActive,
				Scrollview = function () {
					var self = this,
						ui;
					/**
					 * @property {Object} state Scrollview internal state object
					 * @property {Function} state.currentTransition Instance transition function
					 * @readonly
					 */
					self.state = {
						currentTransition: null
					};
					/**
					 * @property {number} scrollDuration The time length of the scroll animation
					 * @member ns.widget.mobile.Scrollview
					 */
					self.scrollDuration = 300;
					self.scrollviewSetHeight = false;
					/**
					 * Scrollview options
					 * @property {Object} options
					 * @property {string} [options.scroll='y'] Scroll direction
					 * @property {boolean} [options.scrollJump=false] Scroll jump buttons flag
					 * @member ns.widget.mobile.Scrollview
					 */
					self.options = {
						scroll: "y",
						scrollJump: false
					};
					/**
					 * Dictionary for holding internal DOM elements
					 * @property {Object} ui
					 * @property {HTMLElement} ui.view The main view element
					 * @property {HTMLElement} ui.page The main page element
					 * @property {HTMLElement} ui.jumpHorizontalButton Jump left button
					 * @property {HTMLElement} ui.jumpVerticalButton Jump top button
					 * @member ns.widget.mobile.Scrollview
					 * @readonly
					 */
					ui = self._ui || {};
					ui.view = null;
					ui.page = null;
					ui.jumpHorizontalButton = null;
					ui.jumpVerticalButton = null;
					self._ui = ui;
					/**
					 * Dictionary for holding internal listeners
					 * @property {Object} _callbacks
					 * @property {Function} _callbacks.repositionJumps Refresh jumps listener
					 * @property {Function} _callbacks.jumpTop Top jump button click callback
					 * @property {Function} _callbacks.jumpLeft Left jump button click callback
					 * @member ns.widget.mobile.Scrollview
					 * @protected
					 * @readonly
					 */
					self._callbacks = {
						repositionJumps: null,
						jumpTop: null,
						jumpBottom: null
					};
				},
				/**
				 * Dictionary for scrollview css classes
				 * @property {Object} classes
				 * @property {string} [classes.view='ui-scrollview-view'] View main class
				 * @property {string} [classes.clip='ui-scrollview-clip'] Clip main class
				 * @property {string} [classes.jumpTop='ui-scroll-jump-top-bg'] Jump top button background
				 * @property {string} [classes.jumpLeft='ui-scroll-jump-left-bg'] Jump bottom button background
				 * @member ns.widget.mobile.Scrollview
				 * @static
				 * @readonly
				 */
				classes =  {
					view: "ui-scrollview-view",
					clip: "ui-scrollview-clip",
					jumpTop: "ui-scroll-jump-top-bg",
					jumpLeft: "ui-scroll-jump-left-bg"
				};

			// Changes static position to relative
			// @param {HTMLElement} view
			function makePositioned(view) {
				if (DOMUtils.getCSSProperty(view, "position") === "static") {
					view.style.position = "relative";
				} else {
					view.style.position = "absolute";
				}
			}

			// Translation animation loop
			// @param {Object} state Scrollview instance state
			// @param {HTMLElement} element
			// @param {number} startTime
			// @param {number} startX
			// @param {number} startY
			// @param {number} translateX
			// @param {number} translateY
			// @param {number} endX
			// @param {number} endY
			// @param {number} duration
			function translateTransition(state, element, startTime, startX, startY, translateX, translateY, endX, endY, duration) {
				var timestamp = (new Date()).getTime() - startTime,
					newX = parseInt(easingUtils.cubicOut(timestamp, startX, translateX, duration), 10),
					newY = parseInt(easingUtils.cubicOut(timestamp, startY, translateY, duration), 10);
				if (element.scrollLeft !== endX) {
					element.scrollLeft = newX;
				}
				if (element.scrollTop !== endY) {
					element.scrollTop = newY;
				}

				if ((newX !== endX || newY !== endY) &&
						(newX >= 0 && newY >= 0) &&
						state.currentTransition) {
					util.requestAnimationFrame(state.currentTransition);
				} else {
					state.currentTransition = null;
				}
			}

			// Translates scroll posotion directly or with an animation
			// if duration is specified
			// @param {Object} state Scrollview instance state
			// @param {HTMLElement} element
			// @param {number} x
			// @param {number} y
			// @param {number=} [duration]
			function translate(state, element, x, y, duration) {
				if (duration) {
					state.currentTransition = translateTransition.bind(
						null,
						state,
						element,
						(new Date()).getTime(),
						element.scrollLeft,
						element.scrollTop,
						x,
						y,
						element.scrollLeft + x,
						element.scrollTop + y,
						duration
					);
					util.requestAnimationFrame(state.currentTransition);
				} else {
					if (x) {
						element.scrollLeft = element.scrollLeft + x;
					}
					if (y) {
						element.scrollTop = element.scrollTop + y;
					}
				}
			}

			// Refresh jumpTop jumpLeft buttons
			// @param {ns.widget.mobile.Scrollview} self
			function repositionJumps(self) {
				var ui = self._ui,
					horizontalJumpButton = ui.jumpHorizontalButton,
					verticalJumpButton = ui.jumpVerticalButton,
					offsets = horizontalJumpButton || verticalJumpButton ? DOMUtils.getElementOffset(self.element) : null; // dont calc when not used

				if (horizontalJumpButton) {
					horizontalJumpButton.style.left = offsets.left + "px";
				}

				if (verticalJumpButton) {
					verticalJumpButton.style.top = offsets.top + "px";
				}
			}

			Scrollview.classes = classes;

			Scrollview.prototype = new BaseWidget();

			/**
			 * Builds the widget
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @method _build
			 * @protected
			 * @member ns.widget.mobile.Scrollview
			 */
			Scrollview.prototype._build = function (element) {
				//@TODO wrap element's content with external function
				var self = this,
					ui = self._ui,
					view = selectors.getChildrenByClass(element, classes.view)[0] || document.createElement("div"),
					clipStyle = element.style,
					node = null,
					child = element.firstChild,
					options = self.options,
					direction = options.scroll,
					jumpButton,
					jumpBackground;
				view.className = classes.view;

				while (child) {
					node = child;
					child = child.nextSibling;
					if (view !== node) {
						view.appendChild(node);
					}
				}

				if (view.parentNode !== element) {
					element.appendChild(view);
				}

				// setting view style
				makePositioned(view);

				element.classList.add(classes.clip);

				switch (direction) {
					case "x":
						clipStyle.overflowX = "scroll";
						break;
					case "xy":
						clipStyle.overflow = "scroll";
						break;
					default:
						clipStyle.overflowY = "scroll";
						break;
				}

				if (options.scrollJump) {
					if (direction.indexOf("x") > -1) {
						jumpBackground = document.createElement("div");
						jumpBackground.className = classes.jumpLeft;
						jumpButton = document.createElement("div");

						jumpBackground.appendChild(jumpButton);
						element.appendChild(jumpBackground);
						engine.instanceWidget(
							jumpButton,
							"Button",
							{
								"icon": "scrollleft",
								"style": "box"
							}
						);
						ui.jumpHorizontalButton = jumpBackground;
					}

					if (direction.indexOf("y") > -1) {
						jumpBackground = document.createElement("div");
						jumpBackground.className = classes.jumpTop;
						jumpButton = document.createElement("div");

						jumpBackground.appendChild(jumpButton);
						element.appendChild(jumpBackground);
						engine.instanceWidget(
							jumpButton,
							"Button",
							{
								"icon": "scrolltop",
								"style": "box"
							}
						);
						ui.jumpVerticalButton = jumpBackground;
					}
				}

				ui.view = view;
				// @TODO
				//this._addOverflowIndicator(element);
				return element;
			};

			/**
			 * Inits widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Scrollview
			 */
			Scrollview.prototype._init = function (element) {
				var ui = this._ui,
					page = ui.page;

				if (!ui.view) {
					ui.view = selectors.getChildrenByClass(element, classes.view)[0];
				}

				if (!page) {
					page = selectors.getClosestByClass(element, pageClass);
					if (page) {
						ui.page = page;
						if (page.classList.contains(pageActiveClass) && this.options.scrollJump) {
							repositionJumps(this);
						}
					}
				}
			};

			/**
			 * Adds overflow indicators
			 * @param {HTMLElement} clip
			 * @method _addOverflowIndicator
			 * @protected
			 * @member ns.widget.mobile.Scrollview
			 */
			Scrollview.prototype._addOverflowIndicator = function (clip) {
				if ((clip.getAttribute("data-overflow-enable") || "true") === "false") {
					return;
				}
				clip.insertAdjacentHTML("beforeend", '<div class="ui-overflow-indicator-top"></div><div class="ui-overflow-indicator-bottom"></div>');
			};

			/**
			 * Scrolls to specified position
			 *
			 * ### Example usage with TAU API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]"));
			 *			scrollview.scrollTo(0, 200, 1000); // scroll to 200px vertical with 1s animation
			 *		</script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = $(".myPageClass > div[data-role=content]"));
			 *			element.scrollview();
			 *			element.scrollview("scrollTo", 0, 200, 1000); // scroll to 200px vertical with 1s animation
			 *		</script>
			 *
			 * @param {number} x
			 * @param {number} y
			 * @param {number=} [duration]
			 * @method scrollTo
			 * @protected
			 * @member ns.widget.mobile.Scrollview
			 */
			Scrollview.prototype.scrollTo = function (x, y, duration) {
				var element = this.element;
				this.translateTo(x - element.scrollLeft, y - element.scrollTop, duration);
			};

			/**
			 * Translates the scroll to specified position
			 *
			 * ### Example usage with TAU API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]"));
			 *			scrollview.translateTo(0, 200, 1000); // scroll forward 200px in vertical direction with 1s animation
			 *		</script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = $(".myPageClass > div[data-role=content]"));
			 *			element.scrollview();
			 *			element.scrollview("translateTo", 0, 200, 1000); // scroll forward 200px in vertical direction with 1s animation
			 *		</script>
			 *
			 * @param {number} x
			 * @param {number} y
			 * @param {number=} [duration]
			 * @method translateTo
			 * @member ns.widget.mobile.Scrollview
			 */
			Scrollview.prototype.translateTo = function (x, y, duration) {
				translate(this.state, this.element, x, y, duration);
			};

			/**
			 * Ensures that specified element is visible in the
			 * clip area
			 *
			 * ### Example usage with TAU API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *				<div class="testElementClass">somedata</div>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]")),
			 *				testElement = document.querySelector(".testElementClass");
			 *			scrollview.ensureElementIsVisible(testelement);
			 *		</script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *				<div class="testElementClass">somedata</div>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = $(".myPageClass > div[data-role=content]")),
			 *				testElement = $(".testElementClass");
			 *			element.scrollview();
			 *			element.scrollview("ensureElementIsVisible", testElement);
			 *		</script>
			 *
			 * @param {HTMLElement} element
			 * @method ensureElementIsVisible
			 * @member ns.widget.mobile.Scrollview
			 */
			Scrollview.prototype.ensureElementIsVisible = function (element) {
				var clip = this.element,
					clipHeight = DOMUtils.getElementHeight(clip),
					clipWidth = DOMUtils.getElementWidth(clip),
					clipTop = 0,
					clipBottom = clipHeight,
					elementHeight = DOMUtils.getElementHeight(element),
					elementWidth = DOMUtils.getElementWidth(element),
					elementTop = 0,
					elementBottom,
					elementFits = clipHeight >= elementHeight && clipWidth >= elementWidth,
					anchor,
					anchorPositionX,
					anchorPositionY,
					parent,
					findPositionAnchor = function (input) {
						var id = input.getAttribute("id"),
							tagName = input.tagName.toLowerCase();
						if (id && ["input", "textarea", "button"].indexOf(tagName) > -1) {
							return input.parentNode.querySelector("label[for=" + id + "]");
						}
					},
					_true = true;

				parent = element.parentNode;
				while (parent && parent.node !== clip) {
					elementTop += parent.offsetTop;
					//elementLeft += parent.offsetLeft;
					parent = parent.parentNode;
				}
				elementBottom = elementTop + elementHeight;
				//elementRight = elementLeft + elementWidth;

				switch (_true) {
					case elementFits && clipTop < elementTop && clipBottom > elementBottom: // element fits in view is inside clip area
						// pass, element position is ok
						break;
					case elementFits && clipTop < elementTop && clipBottom < elementBottom: // element fits in view but its visible only at top
					case elementFits && clipTop > elementTop && clipBottom > elementBottom: // element fits in view but its visible only at bottom
					case elementFits: // element fits in view but is not visible
						this.centerToElement(element);
						break;
					case clipTop < elementTop && clipBottom < elementBottom: // element visible only at top
					case clipTop > elementTop && clipBottom > elementBottom: // element visible only at bottom
						// pass, we cant do anything, if we move the scroll
						// the user could lost view of something he scrolled to
						break;
					default: // element is not visible
						anchor = findPositionAnchor(element);
						if (!anchor) {
							anchor = element;
						}
						anchorPositionX = anchor.offsetLeft + DOMUtils.getCSSProperty(anchor, "margin-left", 0, "integer");
						anchorPositionY = anchor.offsetTop + DOMUtils.getCSSProperty(anchor, "margin-top", 0, "integer");
						parent = anchor.parentNode;
						while (parent && parent !== clip) {
							anchorPositionX = parent.offsetLeft + DOMUtils.getCSSProperty(parent, "margin-left", 0, "integer");
							anchorPositionY = parent.offsetTop + DOMUtils.getCSSProperty(parent, "margin-top", 0, "integer");
							parent = parent.parentNode;
						}
						this.scrollTo(anchorPositionX, anchorPositionY, this.scrollDuration);
						break;
				}
			};

			/**
			 * Centers specified element in the clip area
			 *
			 * ### Example usage with TAU API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *				<div class="testElementClass">somedata</div>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]")),
			 *				testElement = document.querySelector(".testElementClass");
			 *			scrollview.centerToElement(testelement);
			 *		</script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *				<div class="testElementClass">somedata</div>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = $(".myPageClass > div[data-role=content]")),
			 *				testElement = $(".testElementClass");
			 *			element.scrollview();
			 *			element.scrollview("centerToElement", testElement);
			 *		</script>
			 *
			 * @param {HTMLElement} element
			 * @method centerToElement
			 * @member ns.widget.mobile.Scrollview
			 */
			Scrollview.prototype.centerToElement = function (element) {
				var clip = this.element,
					deltaX = parseInt(DOMUtils.getElementWidth(clip) / 2 - DOMUtils.getElementWidth(element) / 2, 10),
					deltaY = parseInt(DOMUtils.getElementHeight(clip) / 2 - DOMUtils.getElementHeight(element) / 2, 10),
					elementPositionX = element.offsetLeft,
					elementPositionY = element.offsetTop,
					parent = element.parentNode;

				while (parent && parent !== clip) {
					elementPositionX += parent.offsetLeft + DOMUtils.getCSSProperty(parent, "margin-left", 0, "integer");
					elementPositionY += parent.offsetTop + DOMUtils.getCSSProperty(parent, "margin-top", 0, "integer");
					parent = parent.parentNode;
				}
				this.scrollTo(elementPositionX - deltaX, elementPositionY - deltaY, this.scrollDuration);
			};

			/**
			 * This is just for compatibility
			 * @method skipDragging
			 * @member ns.widget.mobile.Scrollview
			 * @deprecated 2.3
			 */
			Scrollview.prototype.skipDragging = function () {
				if (ns.warn) {
					ns.warn("ns.widget.mobile.Scrollview: skipDragging is deprecated");
				}
			}; // just for TWEBUIFW compat

			/**
			 * Returns scroll current position
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]")),
			 *				currentPosition = scrollview.getScrollPosition();
			 *		</script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = $(".myPageClass > div[data-role=content]")),
			 *				position;
			 *			element.scrollview();
			 *			position = element.scrollview("getScrollPosition");
			 *		</script>
			 *
			 * @return {Object}
			 * @method getScrollPosition
			 * @member ns.widget.mobile.Scrollview
			 */
			Scrollview.prototype.getScrollPosition = function () {
				var element = this.element;
				return {
					"x": element.scrollLeft,
					"y": element.scrollTop
				};
			};

			/**
			 * Binds scrollview events
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Scrollview
			 */
			Scrollview.prototype._bindEvents = function (element) {
				var scrollTimer = null,
					view = element.children[0],
					lastClipHeight = DOMUtils.getElementHeight(element),
					lastClipWidth = DOMUtils.getElementWidth(element),
					notifyScrolled = function () {
						eventUtils.trigger(element, "scrollstop");
						window.clearTimeout(scrollTimer);
						scrollTimer = null;
					},
					self = this,
					//FIXME there should be some other way to get parent container
					ui = self._ui,
					page = ui.page,
					jumpTop = ui.jumpVerticalButton,
					jumpLeft = ui.jumpHorizontalButton,
					repositionJumpsCallback,
					jumpTopCallback,
					jumpLeftCallback,
					callbacks = self._callbacks;

				if (page) {
					if (this.options.scrollJump) {
						repositionJumpsCallback = repositionJumps.bind(null, this);
						jumpTopCallback = function () {
							self.scrollTo(element.scrollLeft, 0, 250);
						};
						jumpLeftCallback = function () {
							self.scrollTo(0, element.scrollTop, 250);
						};
						page.addEventListener("pageshow", repositionJumpsCallback, false);
						if (jumpTop) {
							jumpTop.firstChild.addEventListener("vclick", jumpTopCallback, false);
						}
						if (jumpLeft) {
							jumpLeft.firstChild.addEventListener("vclick", jumpLeftCallback, false);
						}

						callbacks.repositionJumps = repositionJumpsCallback;
						callbacks.jumpTop = jumpTopCallback;
						callbacks.jumpLeft = jumpLeftCallback;
					}

					element.addEventListener("scroll", function () {
						if (scrollTimer) {
							window.clearTimeout(scrollTimer);
						} else {
							eventUtils.trigger(element, "scrollstart");
						}
						scrollTimer = window.setTimeout(notifyScrolled, 100);
						eventUtils.trigger(element, "scrollupdate");
					}, false);


					window.addEventListener("throttledresize", function () {
						var focusedElement = view.querySelector(".ui-focus"),
							clipWidth,
							clipHeight;
						if (focusedElement) {
							self.ensureElementIsVisible(focusedElement);
						} else {
							clipHeight = DOMUtils.getElementHeight(element);
							clipWidth = DOMUtils.getElementWidth(element);
							self.translateTo(
								lastClipWidth - clipWidth,
								lastClipHeight - clipHeight,
								self.scrollDuration
							);
							lastClipHeight = clipHeight;
							lastClipWidth = clipWidth;
						}
					}, false);

					document.addEventListener("vmousedown", function () {
						if (currentTransition) {
							currentTransition = null;
						}
					}, false);

				}
			};

			Scrollview.prototype._destroy = function () {
				var ui = this._ui,
					page = ui.page,
					scrollJump = this.options.scrollJump,
					jumpTop = ui.jumpVerticalButton,
					jumpLeft = ui.jumpHorizontalButton,
					callbacks = this._callbacks,
					repositionJumpsCallback = callbacks.repositionJumps,
					jumpTopCallback = callbacks.jumpTop,
					jumpLeftCallback = callbacks.jumpLeft;

				if (scrollJump) {
					if (page && repositionJumpsCallback) {
						page.removeEventListener("pageshow", repositionJumpsCallback, false);
					}
					if (jumpTop && jumpTopCallback) {
						jumpTop.firstChild.removeEventListener("vclick", jumpTopCallback, false);
					}
					if (jumpLeft && jumpLeftCallback) {
						jumpLeft.firstChild.removeEventListener("vclick", jumpLeftCallback, false);
					}
				}

			};

			ns.widget.mobile.Scrollview = Scrollview;
			engine.defineWidget(
				"Scrollview",
				"[data-role='content']:not([data-scroll='none']):not([data-handler='true']):not(.ui-scrollview-clip):not(.ui-scrolllistview), [data-scroll]:not([data-scroll='none']):not([data-handler='true']), .ui-scrollview:not([data-scroll='none']):not([data-handler='true'])",
				[
					"scrollTo",
					"ensureElementIsVisible",
					"centerToElement",
					"getScrollPosition",
					"skipDragging",
					"translateTo"
				],
				Scrollview,
				"tizen"
			);
			}(window, window.document, ns));

/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/**
 * #Popup Widget
 * Widget handles creating and managing popup windows.
 *
 * ##Default selectors
 * In default all elements with _data-role=popup_ or CSS class _.ui-popup_ are changed to Tizen WebUI popups.
 *
 * ##HTML Examples
 *
 * ###Create simple popup from div
 *
 *		@example
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *		<!-- link related with popup-->
 *		<a href="#popup">Click to open popup</a>
 *
 * ###Create simple popup positioned to window
 *
 * Popup inherits value of option _positionTo_ from property _data-position-to_ set in link.
 *
 *		@example
 *		<!--definition of link, which opens popup and sets its position-->
 *		<a href="#center_info" data-position-to="window">Click to open popup</a>
 *		<!--definition of popup, which inherites property position from link-->
 *		<div id="center_info" data-role="popup" class="center_info">
 *			<div class="ui-popup-text">
 *				<p>Pop-up dialog box, a child window that blocks user interaction to the parent windows</p>
 *			</div>
 *		</div>
 *
 * ###Create popup with title and button
 *
 *		@example
 *		<a href="#center_title_1btn">Click to open popup</a>
 *		<!--definition of popup with a title and button-->
 *		<div id="center_title_1btn" data-role="popup" class="center_title_1btn">
 *			<div class="ui-popup-title">
 *				<h1>Popup title</h1>
 *			</div>
 *			<div class="ui-popup-text">
 *				Pop-up dialog box, a child window that blocks user interaction to the parent windows
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" data-rel="back" data-inline="true">Button</a>
 *			</div>
 *		</div>
 *
 * ###Create popup with menu
 *
 * A menu can be created by placing listview inside a popup.
 *
 *		@example
 *		<a href="#center_liststyle_1btn">Click to open popup</a>
 *		<div id="center_liststyle_1btn" data-role="popup" class="center_liststyle_1btn">
 *			<div class="ui-popup-title">
 *				<h1>Popup title</h1>
 *			</div>
 *			<div class="ui-popup-scroller-bg" data-scroll="y">
 *				<ul data-role="listview" data-icon="1line-textonly">
 *					<li><a href="#">List item 1</a></li>
 *					<li><a href="#">List item 2</a></li>
 *				</ul>
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" data-rel="back" data-inline="true">Cancel</a>
 *			</div>
 *		</div>
 *
 * ###Create popup with nested menu
 *
 * A nested menu can be created by placing collapsible-set widget with listview elements.
 *
 *		@example
 *		<a href="#popupNested">Click to open popup</a>
 *		<div id="popupNested" data-role="popup">
 *			<div data-role="collapsible-set" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d">
 *				<div data-role="collapsible">
 *					<h2>First menu</h2>
 *					<ul data-role="listview">
 *						<li><a href="#" >Item 1</a></li>
 *						<li><a href="#" >Item 2</a></li>
 *					</ul>
 *				</div>
 *				<div data-role="collapsible">
 *					<h2>Second menu</h2>
 *					<ul data-role="listview">
 *						<li><a href="#" >Item 1</a></li>
 *						<li><a href="#" >Item 2</a></li>
 *					</ul>
 *				</div>
 *			</div>
 *		</div>
 *
 * ###Create popup with form
 *
 * A form can be created by placing inputs elements inside popup.
 *
 *		@example
 *		<a href="#textbox_popup">Click to open popup</a>
 *		<div id="textbox_popup" data-role="popup" class="center_title_2btn">
 *			<div class="ui-popup-title">
 *				<h1>PopupTest<h1>
 *			</div>
 *			<div class="ui-popup-text">
 *				<input type="text" size="20" />
 *				<input type="text" size="20" />
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" id="btn_textbox_popup_cancel" data-inline="true">Cancel</a>
 *				<a data-role="button" data-rel="back" data-inline="true">OK</a>
 *			</div>
 *		</div>
 *
 * ##Manual constructor
 * For manual creation of popup widget you can use constructor of widget:
 *
 *		@example
 *		<div id="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popupElement = document.getElementById("popup"),
 *				popup = tau.widget.Popup(popupElement);
 *			popup.open();
 *		</script>
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<div id="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popup = $("#popup").popup();
 *			popup.popup("open");
 *		</script>
 *
 * ##Context popup with arrow
 *
 * If property _id_ is set in link and option _positionTo="origin"_ in popup, the context popup will be opened after clicking.
 *
 *		@example
 *		<!-- definition of link, which opens popup with id popup in context style with arrow -->
 *		<a href="#popup" id="linkId" data-position-to="origin" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic context popup, no options set.</p>
 *		</div>
 *
 * Be award that option _positionTo_ has value "origin" in popup by default. However, the property _positionTo_ is inherited from related link and this inherited value has higher priority during opening process and overwrites the previous value. So, if we do not change it in popup and do not set value of _data-position-to_ other than "origin" in link, popup connected with link will be always opened in context style.
 *
 * To be sure that popup will be opened in context style with arrow, we can set properties _data-position-to="origin"_ as well as _id_ in the related with popup link as in the example above.
 *
 * Moreover, the same resulte can be achieve by setting only _id_ and not setting _positionTo_ in link because popup has value "origin" for option _positionTo_ by default.
 *
 *		@example
 *		<!-- in link id is set -->
 *		<a href="#popup" id="linkId" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *
 * After building, the value of option _positionTo_ can be changed by using method _option_.
 *
 *		@example
 *		<a href="#popup" id="linkId" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// changing value of option positionTo by method option
 *			var popupWidget = tau.widget.Popup(document.getElementById("popup"));
 *			popupWidget.option("positionTo", "origin");
 *		</script>
 *
 * If jQuery is loaded:
 *
 *		@example
 *		<a href="#popup" id="linkId" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// changing value of option positionTo by method option
 *			$("#popup").popup("option", "positionTo", "origin");
 *		</script>
 *
 *
 * Context popup can be created also manually for elements different than link by pushing options such as _positionTo_ and _link to method _open_.
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Click to open context popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set opening popup on click event
 *			document.getElementById("linkId").addEventListener("click", function () {
 *				// open context popup
 *				var popupWidget = tau.widget.Popup(document.getElementById("popup"));
 *				// opening with options
 *				popupWidget.open({link: "linkId", positionTo: "origin"});
 *			});
 *		</script>
 *
 * If jQuery is loaded:
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Click to open context popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set opening popup on click event
 *			$("#linkId").on("click", function () {
 *				// opening with options
 *				$("#popup").popup("open", {link: "linkId", positionTo: "origin"});
 *			});
 *		</script>
 *
 * These options can be also set globally and then method _open_ can be called without options. However, this solution can be used only for TAU API.
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Link for popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set options
 *			var popupWidget = tau.widget.Popup(document.getElementById("popup"));
 *			popupWidget.option({positionTo: "origin", link: "linkId"}); // here we set positionTo and id of link, which sets placement of popup
 *
 *			// set opening popup on click event
 *			document.getElementById("linkId").addEventListener("click", function () {
 *				//if options are set, we can call method open without options
 *				popupWidget.open();
 *			});
 *		</script>
 *
 * For jQuery API, id of link has to be always added as a option:
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Link for popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set option positionTo
 *			$("#popup").popup("option", "positionTo", "origin");
 *
 *			// set opening popup on click event
 *			$("#linkId").on("click", function () {
 *				// for jQuery API, link has to be added as a option
 *				$("#popup").popup("open", {link: "linkId"});
 *			});
 *		</script>
 *
 *
 * ##Special classes
 *
 * There are some special CSS classes, which changes the style of popup:
 *
 *  - _center_info_ - basic pop-up message<br>
 *  - _center_title_ - pop-up message with a title<br>
 *  - _center_basic_1btn_ - pop-up message with 1 button<br>
 *  - _center_basic_2btn_ - pop-up message with 2 horizontal buttons<br>
 *  - _center_title_1btn_ - pop-up message with a title and 1 button<br>
 *  - _center_title_2btn_ - pop-up message with a title and 2 horizontal buttons<br>
 *  - _center_title_3btn_ - pop-up message with a title and 3 horizontal buttons<br>
 *  - _center_button_vertical_ - pop-up message with vertical buttons<br>
 *  - _center_checkbox_ - pop-up message with a check box<br>
 *  - _center_liststyle_1btn_ - pop-up message with a list and 1 button<br>
 *  - _center_liststyle_2btn_ - pop-up message with a list and 2 horizontal buttons<br>
 *  - _center_liststyle_3btn_ - pop-up message with a list and 3 horizontal buttons<br>
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.Popup(popupElement);
 *
 *		popup.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		$(".selector").popup("methodName", methodArgument1, methodArgument2, ...);
 *
 * ##Opening popup
 * There are two ways to open popup.
 *
 * ###Opening by clicking on link
 *
 * If link has _id_ of popup set as value of property _href_, then this popup will be opened after clicking on it.
 *
 *		@example
 *		<!--definition of link, which opens popup with id popup-->
 *		<a href="#popup">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 * Be award that context popup with arrow will be opened if link has _id_ property set and _data-position-to="origin"_  as in this example:
 *
 *		@example
 *		<!--definition of link, which opens context popup with id popup-->
 *		<a href="#popup" id="linkId" data-position-to="origin" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 * To open window popup, property _data-position-to="window"_ must be set in link or popup.
 *
 *		@example
 *		<!--definition of link, which opens window popup with id popup-->
 *		<a href="#popup" id="linkId" data-position-to="window">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 * ###Opening manually
 *
 * To open popup with _id_ "popup", tau namespace can be used:
 *
 *		@example
 *		<div id="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popupElement = document.getElementById("popup"),
 *				popup = tau.widget.Popup(popupElement);
 *			popup.open();
 *		</script>
 *
 * If jQuery library is loaded, this method can be used:
 *
 *		@example
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popup = $("#popup").popup();
 *			popup.popup("open");
 *		</script>
 *
 *
 * ## Closing popup
 *
 * ###Closing by clicking on button inside
 *
 * If link inside popup has property _data-rel="back"_, then popup will be closed after clicking on it as in this example:
 *
 *		@example
 *		<a href="#center_title_1btn" data-position-to="window">Click to open popup</a>
 *		<!--definition of popup with a title and button-->
 *		<div id="center_title_1btn" data-role="popup" class="center_title_1btn">
 *			<div class="ui-popup-title">
 *				<h1>Popup title</h1>
 *			</div>
 *			<div class="ui-popup-text">
 *				Pop-up dialog box, a child window that blocks user interaction to the parent windows
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" data-rel="back" data-inline="true">Button</a>
 *			</div>
 *		</div>
 *
 *
 * The selector, which causes closing on click, can be changed by setting option _closeLinkSelector_ in popup.
 *
 * ###Closing manually
 *
 * To close popup with _id_ "popup", tau namespace can be used:
 *
 *		@example
 *		<a href="#popup" data-position-to="window">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popupElement = document.getElementById("popup"),
 *				popup = tau.widget.Popup(popupElement);
 *			// close popup after opening
 *			popupElement.addEventListener("popupafteropen", function () {
 *				popup.close();
 *			});
 *		</script>
 *
 * If jQuery library is loaded, this method can be used:
 *
 *		@example
 *		<a href="#popup" data-position-to="window">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			$("#popup").on("popupafteropen", function () {
 *				$("#popup").popup("close");
 *			});
 *		</script>
 *
 * ## Handling Popup Events
 *
 * To use popup events, use the following code:
 *
 *		@example
 *		<!-- Popup html code -->
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// Use popup events
 *			var popup = document.getElementById("popup");
 *			popup.addEventListener("popupafteropen", function() {
 *				// Implement code for popupafteropen event
 *			});
 *		</script>
 *
 * Full list of available events is in [events list section](#events-list).

 *
 * @class ns.widget.mobile.Popup
 * @extends ns.widget.BaseWidget
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 */

/**
 * Triggered when process of opening popup is completed.
 * The "popupafteropen" event is triggered when the popup has completely appeared on the screen and all associated animations have completed.
 * @event popupafteropen
 * @member ns.widget.mobile.Popup
 */
/**
 * Triggered when process of opening popup is completed.
 * The "popupshow" event is triggered when the popup has completely appeared on
 * the screen and all associated animations have completed. This event is
 * triggered in the same time as event "popupafteropen".
 * @event popupshow
 * @member ns.widget.mobile.Popup
 */
/**
 * Triggered before a popup computes the coordinates where it will appear.
 * The "beforeposition" event is triggered before the popup starts the opening animations and calculates the coordinates where it will appear on the screen. Handling this event gives an opportunity to modify the content of the popup before it appears on the screen.
 * @event beforeposition
 * @member ns.widget.mobile.Popup
 */

/**
 * Triggered when the process of closing popup is completed.
 * The "popupafterclose" event is triggered when the popup has completely disappeared from the screen and all associated animations have completed.
 * @event popupafterclose
 * @member ns.widget.mobile.Popup
 */
/**
 * Triggered when the process of closing popup is completed.
 * The "popuphide" event is triggered when the popup has completely disappeared
 * from the screen and all associated animations have completed. This event is
 * triggered at the same time as event "popupafterclose".
 * @event popuphide
 * @member ns.widget.mobile.Popup
 */
(function (window, document, ns) {
	
				var Popup = function () {
				var self = this;
					/**
					* @property {Object} options Object with default options
					* @property {string} [options.theme="s"] Sets the color scheme (swatch) for the popup contents.
					* @property {?string} [options.overlayTheme=""] Sets the color scheme (swatch) for the popup background, which covers the entire window.
					* @property {boolean} [options.shadow=true] Sets whether to draw a shadow around the popup.
					* @property {boolean} [options.corners=true] Sets whether to draw the popup with rounded corners.
					* @property {boolean} [options.noScreen=false] Set screen to be always hidden.
					* @property {string} [options.transition="none"] Sets the default transition for the popup.
					* @property {string} [options.positionTo="origin"] Sets the element relative to which the popup will be centered.
					* @property {Object} [options.tolerance={t: 10, r: 10, b: 10, l: 10}] Sets the minimum distance from the edge of the window for the corresponding edge of the popup.
					* @property {Array} [options.directionPriority=["bottom", "top", "right", "left"]] Sets directions of popup's placement by priority. First one has the highest priority, last the lowest.
					* @property {string} [options.closeLinkSelector="a[data-rel="back"]"] Sets selector for buttons in popup
					* @property {?string} [options.link=null] Sets id of element used as reference for relative popup placement
					* @property {boolean} [options.isHardwarePopup=false] Sets whether the popup is hardware one.
					* @property {?number} [options.positionX=null] Sets desired horizontal coordinate of the center point in popup in pixels.
					* @property {?number} [options.positionY=null] Sets desired vertical coordinate of the center point in popup in pixels.
					* @property {boolean} [options.history=false] Sets whether to alter the url when a popup is open to support the back button.
					* @property {string} [options.specialContainerClass=""] Sets CSS class which is added for popup's container.
					* @member ns.widget.mobile.Popup
					*/
					self.options = {
						theme: null,
						overlayTheme: null,
						shadow: true,
						corners: true,
						noScreen: false,
						transition: "pop",
						positionTo: "origin",
						tolerance: { t: 10, r: 10, b: 10, l: 10 },
						directionPriority: ["bottom", "top", "right", "left"],
						closeLinkSelector: "a[data-rel='back']",
						link: null,
						isHardwarePopup: false,
						positionX: null,
						positionY: null,
						history: false,
						specialContainerClass: ""
					};
					self.defaultOptions = {
						theme: "s"
					};
					// @property {Object} _ui Object with html elements connected with popup
					// @member ns.widget.mobile.Popup
					self._ui = {
						screen: null,
						placeholder: null,
						container: null,
						arrow: null
					};
					// @property {HTMLElement} _page Page element
					// @member ns.widget.mobile.Popup
					self._page = null;
					// @property {boolean} _isPreOpen Status of popup before animation
					// @member ns.widget.mobile.Popup
					self._isPreOpen = false;
					// @property {boolean} _isOpen Status of popup after animation
					// @member ns.widget.mobile.Popup
					self._isOpen = false;
					// @property {boolean} _isPreClose Status of popup before animation (popup starts to close)
					// @member ns.widget.mobile.Popup
					self._isPreClose = false;
					// animations
					self._prereqs = null;
					self._fallbackTransition = "";
					self._currentTransition = "none";
					// callbacks
					self._onClickBound = null;
					self._onResizeBound = null;
					self._onButtonClickBound = null;
					// @property {Function} _callback Callback for "resize" event, which sets position of widget.
					// This callback must return object with properties "x" and "y".
					// @member ns.widget.mobile.Popup
					self._callback = null;
				},
				/**
				* @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
				* @member ns.widget.mobile.Popup
				* @private
				*/
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* @property {Object} engine Alias for class ns.engine
				* @member ns.widget.mobile.Popup
				* @private
				*/
				engine = ns.engine,
				/**
				* @property {Object} selectors Alias for class ns.selectors
				* @member ns.widget.mobile.Popup
				* @private
				*/
				selectors = ns.util.selectors,
				/**
				* @property {Object} doms Alias for class ns.util.DOM
				* @member ns.widget.mobile.Popup
				* @private
				*/
				doms = ns.util.DOM,
				/**
				* @property {Object} themes Alias for class ns.theme
				* @member ns.widget.mobile.Popup
				* @private
				*/
				themes = ns.theme,
				/**
				* @property {Object} events Alias for class ns.event
				* @member ns.widget.mobile.Popup
				* @private
				*/
				events = ns.event,
				scrollviewClipClass = ns.widget.mobile.Scrollview.classes.clip,
				pageActiveClass = ns.widget.mobile.Page.classes.uiPageActive,
				/**
				* @property {ns.util.deferred} UtilsDeferred Alias for class ns.util.deferred
				* @member ns.widget.mobile.Popup
				* @private
				*/
				UtilsDeferred = ns.util.deferred;

			// Return window coordinates
			// @method windowCoords
			// @return {Object}
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function windowCoords() {
				var body = window.body;

				return {
					x: body ? (body.scrollLeft || 0) : 0,
					y: body ? (body.scrollTop || 0) : 0,
					elementWidth: (window.innerWidth || window.width),
					elementHeight: (window.innerHeight || window.height)
				};
			}

			// Return size of segment
			// @method fitSegmentInsideSegment
			// @param {Number} winSize
			// @param {Number} segSize
			// @param {Number} offset
			// @param {Number} desired
			// @return {Number}
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function fitSegmentInsideSegment(winSize, segSize, offset, desired) {
				var ret = desired;

				if (winSize < segSize) {
					// Center segment if it's bigger than the window
					ret = offset + (winSize - segSize) / 2;
				} else {
					// Otherwise center it at the desired coordinate while keeping it completely inside the window
					ret = Math.min(Math.max(offset, desired - segSize / 2), offset + winSize - segSize);
				}

				return ret;
			}


			// Return element relative to which popup must be positioned
			// @method findPositionToElement
			// @param {string} elementSelector
			// @return {HTMLElement}
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function findPositionToElement(elementSelector) {
				var positionToElement = null;

				if (elementSelector) {
					if (elementSelector[0] === "#") {
						positionToElement = document.getElementById(elementSelector.slice(1));
					} else {
						positionToElement = document.querySelector(elementSelector);
					}
					// :visible - in jq (>=1.3.2) an element is visible if its browser-reported offsetWidth or offsetHeight is greater than 0
					if (positionToElement && positionToElement.offsetWidth <= 0 && positionToElement.offsetHeight <= 0) {
						positionToElement = null;
					}
				}

				return positionToElement;
			}

			// Return offset of element
			// @method getOffsetOfElement
			// @param {HTMLElement} element
			// @param {?string} link
			// @return {Object}
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function getOffsetOfElement(element, link) {
				var top = element.offsetTop,
					left = element.offsetLeft,
					scrollview;
				while (element.offsetParent) {
					top += element.offsetParent.offsetTop;
					left += element.offsetParent.offsetLeft;
					if (element.getAttribute("data-role") === "page") {
						break;
					}

					element = element.offsetParent;
				}
				if (link) {
					scrollview = selectors.getClosestByClass(document.getElementById(link), scrollviewClipClass);
					top -= scrollview ? scrollview.scrollTop : 0;
				}

				return {top: top, left: left};
			}

			// Function fires on window resizing
			// @method onResize
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function onResize(self) {
				var callback,
					options;
				if (!self._isOpen) {
					return;
				}
				if (self._callback) {
					callback = self._callback();
					self._setPosition(callback.x, callback.y);
				} else {
					options = self.options;
					self._setPosition(options.positionX, options.positionY);
				}
			}

			// Function fires on click
			// @method _eatEventAndClose
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function _eatEventAndClose(self, event) {
				event.preventDefault();
				events.stopPropagation(event);
				setTimeout(self.close.bind(self), 10);
				return false;
			}

			function removeProperties() {
				var page = document.getElementsByClassName(pageActiveClass)[0],
					tabindexElements = page ? page.querySelectorAll("[tabindex]") : null,
					hrefElements = page ? page.querySelectorAll("[href]") : null,
					value;

				if (tabindexElements) {
					tabindexElements = [].slice.call(tabindexElements);
					tabindexElements.forEach(function (tabindexElement) {
						if (selectors.getClosestBySelector(tabindexElement, "[data-role='popup']") === null) {
							value = tabindexElement.getAttribute("tabindex");
							doms.setNSData(tabindexElement, "tabindex", value);
							tabindexElement.removeAttribute("tabindex");
						}
					});
				}
				if (hrefElements) {
					hrefElements = [].slice.call(hrefElements);
					hrefElements.forEach(function (hrefElement) {
						if (selectors.getClosestBySelector(hrefElement, "[data-role='popup']") === null) {
							value = hrefElement.getAttribute("href");
							doms.setNSData(hrefElement, "href", value);
							hrefElement.removeAttribute("href");
						}
					});
				}
			}

			function restoreProperties() {
				var page = document.getElementsByClassName(ns.widget.mobile.Page.classes.uiPageActive)[0],
					tabindexElements = page ? selectors.getAllByDataNS(page, "tabindex") : null,
					hrefElements = page ? page.querySelectorAll("[href]") : null,
					value;

				if (tabindexElements) {
					selectors.getAllByDataNS(page, "tabindex").forEach(function (tabindexElement) {
						value = doms.getNSData(tabindexElement, "tabindex");
						tabindexElement.setAttribute("tabindex", value);
						doms.removeNSData(tabindexElement, "tabindex");
					});
				}
				if (hrefElements) {
					selectors.getAllByDataNS(page, "href").forEach(function (hrefElement) {
						value = doms.getNSData(hrefElement, "href");
						hrefElement.setAttribute("href", value);
						doms.removeNSData(hrefElement, "href");
					});
				}
			}

			function applyTheme(element, theme, prefix) {
				var classes = element.classList,
					classesLength = classes.length,
					currentTheme = null,
					matches,
					i,
					regex = new RegExp("^ui-" + prefix + "-([a-z]+)$");

				for (i = 0; i < classesLength; i++) {
					matches = regex.exec(classes[i]);
					if (matches && matches.length > 1) {
						currentTheme = matches[1];
						break;
					}
				}

				if (theme !== currentTheme) {
					element.classList.remove("ui-" + prefix + "-" + currentTheme);
					if (theme !== null && theme !== "none") {
						element.classList.add("ui-" + prefix + "-" + theme);
					}
				}
			}

			 // @method chooseDirectionByPriority
			 // @param {Array} directionPriority
			 // @param {Object} positionOffsets
			 // @param {Object} elementDimensions
			 // @param {Object} arrowBorderWidths
			 // @private
			 // @static
			 // @return {string}
			function chooseDirectionByPriority(directionPriority, positionOffsets, elementDimensions, arrowBorderWidths) {
				var direction,
					bestMatchingDirection,
					spaceOccupied,
					priorityQueue;

				if (typeof directionPriority === "string") {
					directionPriority = directionPriority.split(",");
				}
				// Copy array to queue
				priorityQueue = directionPriority.slice();
				do {
					// Get get first element
					direction = priorityQueue.shift();
					if (direction) {
						if (direction === "top" || direction === "bottom") {
							spaceOccupied = elementDimensions.height;
						} else {
							spaceOccupied = elementDimensions.width;
						}

						spaceOccupied += arrowBorderWidths[direction];

						// Check if popup fits into free space
						if (spaceOccupied <= positionOffsets[direction]) {
							bestMatchingDirection = direction;
						}
					}
				// Repeat until space is found or queue is empty
				} while (!bestMatchingDirection && priorityQueue.length > 0);

				// Last matching direction has the highest priority
				return bestMatchingDirection || "bottom";
			}

			// Set events connected with animation
			// @method animationComplete
			// @param {HTMLElement} element
			// @param {Function} callback
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function animationComplete(element, callback) {
				events.one(element, "webkitAnimationEnd", callback);
				events.one(element, "animationend", callback);
			}

			// This function starts opening popup by seting global property "activePopup"
			// and calling "_open" method
			// @method startOpeningPopup
			// @param {ns.widget.mobile.Popup} instance
			// @param {Object} options opening options
			// @param {Event} event
			// @private
			// @static
			// @memberOf ns.widget.Popup
			function startOpeningPopup(instance, options, event) {
				ns.activePopup = instance;
				events.trigger(document, "activePopup", instance);
				instance._open(options, event);
			}

			Popup.prototype = new BaseWidget();

			/**
			 * Dictionary for popup related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.Popup
			 * @static
			 */
			Popup.classes = {
				IN: "in",
				OUT: "out",
				REVERSE: "reverse",
				SCREEN_HIDDEN: "ui-screen-hidden",
				uiPopupScreen: "ui-popup-screen",
				uiPopupContainer: "ui-popup-container",
				uiPopupWindow: "ui-popup-window",
				uiPopupWindowPadding: "ui-popupwindow-padding",
				uiCtxpopupScreen: "ui-ctxpopup-screen",
				uiCtxpopupContainer: "ui-ctxpopup-container",
				uiSelectmenuHidden: "ui-selectmenu-hidden",
				uiArrow: "ui-arrow",
				uiPopup: "ui-popup",
				top: "top",
				bottom: "bottom",
				right: "right",
				left: "left",
				uiPopupActive: "ui-popup-active",
				uiPopupOpen: "ui-popup-open",
				uiCtxpopup: "ui-ctxpopup",
				uiCornerAll: "ui-corner-all",
				uiOverlaryShadow: "ui-overlay-shadow",
				uiCtxpopupOptionmenu: "ui-ctxpopup-optionmenu",
				uiBodyPrefix: "ui-body-"
			};

			/**
			* Build structure of popup widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._build = function (element) {
				var classes = Popup.classes,
					options = this.options,
					page = selectors.getParentsByClass(element, "ui-page")[0] || document.body,
					uiScreen = document.createElement("div"),
					uiScreenClasses = uiScreen.classList,
					uiPlaceholder = document.createElement("div"),
					uiContainer = document.createElement("div"),
					uiContainerClasses = uiContainer.classList,
					uiArrow = document.createElement("div"),
					myId = element.id,
					fragment = document.createDocumentFragment();

				// init ui elements
				uiScreenClasses.add(classes.SCREEN_HIDDEN);
				uiScreenClasses.add(classes.uiPopupScreen);
				uiPlaceholder.style.display = "none";
				uiContainerClasses.add(classes.uiPopupContainer);
				uiContainerClasses.add(classes.uiSelectmenuHidden);

				// this option specifies what CSS class is added for container of popup
				// it is used by Tizen Slider widget to distinguish popup related with
				// slider, because it has to have different style than a normal popup
				if (options.specialContainerClass) {
					uiContainerClasses.add(options.specialContainerClass);
				}
				uiArrow.classList.add(classes.uiArrow);

				// define the container for navigation event bindings
				// TODO this would be nice at the the mobile widget level
				//this.options.container = this.options.container || $.mobile.pageContainer;

				uiScreen.setAttribute("id", myId + "-screen");
				uiContainer.setAttribute("id", myId + "-popup");
				uiPlaceholder.setAttribute("id", myId + "-placeholder");
				uiPlaceholder.innerHTML = "<!-- placeholder for " + myId + " -->";
				uiArrow.setAttribute("id", myId + "-arrow");
				element.classList.add(classes.uiPopup);

				doms.insertNodeAfter(element, uiPlaceholder);
				uiContainer.appendChild(element);
				uiContainer.appendChild(uiArrow);
				fragment.appendChild(uiScreen);
				fragment.appendChild(uiContainer);
				page.appendChild(fragment);

				return element;
			};

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._init = function (element) {
				var id = element.id,
					options = this.options,
					ui;

				// set options
				options.theme = options.theme || themes.getInheritedTheme(element, this.defaultOptions.theme);
				this._setTolerance(element, options.tolerance);

				// @todo define instance variables
				ui = {
					screen: document.getElementById(id + "-screen"),
					placeholder: document.getElementById(id + "-placeholder"),
					container: element.parentNode,
					arrow: document.getElementById(id + "-arrow")
				};
				// if page isn't built, we choose body as page
				this._page = selectors.getParentsByClass(element, "ui-page")[0] || document.body;
				this._ui = ui;
				this._isPreOpen = false;
				this._isOpen = false;
				this._isPreClose = false;
			};

			/**
			* Set tolerance for widget's position
			* @method _setTolerance
			* @param {HTMLElement} element
			* @param {string|Array} value
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._setTolerance = function (element, value) {
				var options = this.options,
					tolerance = {};

				if (value && typeof value === "string") {
					value = value.split(",");
					value.forEach(function(val, index){
						value[index] = parseInt(val, 10);
					});
					switch (value.length) {
						// All values are to be the same
						case 1:
							if (!isNaN(value[0])) {
								tolerance.t = tolerance.r = tolerance.b = tolerance.l = value[0];
							}
							break;

						// The first value denotes top/bottom tolerance, and the second value denotes left/right tolerance
						case 2:
							if (!isNaN(value[0])) {
								tolerance.t = tolerance.b = value[0];
							}
							if (!isNaN(value[1])) {
								tolerance.l = tolerance.r = value[1];
							}
							break;

						// The array contains values in the order top, right, bottom, left
						case 4:
							if (!isNaN(value[0])) {
								tolerance.t = value[0];
							}
							if (!isNaN(value[1])) {
								tolerance.r = value[1];
							}
							if (!isNaN(value[2])) {
								tolerance.b = value[2];
							}
							if (!isNaN(value[3])) {
								tolerance.l = value[3];
							}
							break;

						default:
							break;
					}
					options.tolerance = tolerance;
				}
			};

			/**
			* Return desired coordinates of popup
			* @method _desiredCoords
			* @param {string|HTMLElement} positionTo
			* @param {Number} x
			* @param {Number} y
			* @return {Object}
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._desiredCoords = function (positionTo, x, y) {
				var winCoords = windowCoords(),
					offset;

				if (positionTo === "window") {
					x = winCoords.elementWidth / 2 + winCoords.x;
					y = winCoords.elementHeight / 2 + winCoords.y;
				} else if (positionTo) {
					// In this case, positionTo is HTML element, to which popup is positioned
					offset = getOffsetOfElement(positionTo, this.options.link);
					x = offset.left + positionTo.offsetWidth / 2;
					y = offset.top + positionTo.offsetHeight / 2;
				}

				// Make sure x and y are valid numbers - center over the window
				if (typeof x !== "number" || isNaN(x)) {
					x = winCoords.elementWidth / 2 + winCoords.x;
				}
				if (typeof y !== "number" || isNaN(y)) {
					y = winCoords.elementHeight / 2 + winCoords.y;
				}

				return {x : x,
						y : y};
			};

			/**
			* Return placement of popup
			* @method _placementCoords
			* @param {Object} desired
			* @return {Object}
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._placementCoords = function (desired) {
				// rectangle within which the popup must fit
				var uiContainer = this._ui.container,
					winCoords = windowCoords(),
					tolerance = this.options.tolerance,
					maxCoords = {
						x: tolerance.l,
						y: winCoords.y + tolerance.t,
						elementWidth: winCoords.elementWidth - tolerance.l - tolerance.r,
						elementHeight: winCoords.elementHeight - tolerance.t - tolerance.b
					},
					menuSize,
					finalCoords,
					docElement = document.documentElement,
					docBody = document.body,
					docHeight = Math.max(docElement.clientHeight, docBody.scrollHeight, docBody.offsetHeight, docElement.scrollHeight, docElement.offsetHeight);

				// Clamp the width of the menu before grabbing its size
				uiContainer.style.maxWidth = maxCoords.elementWidth;

				menuSize = {
					elementWidth: uiContainer.clientWidth,
					elementHeight: uiContainer.clientHeight
				};

				// Center the menu over the desired coordinates, while not going outside
				// the window tolerances. This will center wrt. the window if the popup is too large.
				finalCoords = {
					x: fitSegmentInsideSegment(maxCoords.elementWidth, menuSize.elementWidth, maxCoords.x, desired.x),
					y: fitSegmentInsideSegment(maxCoords.elementHeight, menuSize.elementHeight, maxCoords.y, desired.y)
				};

				// Make sure the top of the menu is visible
				finalCoords.y = Math.max(0, finalCoords.y);

				// If the height of the menu is smaller than the height of the document
				// align the bottom with the bottom of the document

				finalCoords.y -= Math.min(finalCoords.y, Math.max(0, finalCoords.y + menuSize.elementHeight - docHeight));

				if (this.options.isHardwarePopup) {
					return {
						left: tolerance.l,
						top: maxCoords.elementHeight - menuSize.elementHeight - tolerance.b,
						arrowleft: 0,
						arrowtop: 0
					};
				}
				return {left: finalCoords.x, top: finalCoords.y};
			};


			/**
			 * Set placement of arrow
			 * @method _setArrowPosition
			 * @param {number} type
			 * @param {HTMLElement} positionToElement
			 * @param {number} containerLeft container's left position
			 * @param {number} containerTop container's top position
			 * @param {Object} positionToElementOffset contains toElement offsets
			 * @return {Object}
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			Popup.prototype._setArrowPosition = function (type, positionToElement, containerLeft, containerTop, positionToElementOffset) {
				var classes = Popup.classes,
					options = this.options,
					tolerance = options.tolerance,
					uiContainer = this._ui.container,
					uiContainerHeight = uiContainer.clientHeight,
					uiContainerWidth = uiContainer.clientWidth,
					popupMargin,
					arrow = this._ui.arrow,
					arrowClasses = arrow.classList,
					arrowStyle = arrow.style,
					// @TODO this will fail when not all arrow borders are the same
					arrowBorderWidth = parseFloat(doms.getCSSProperty(arrow, "border-" + type + "-width")) || 0,
					left = positionToElement ? getOffsetOfElement(positionToElement, options.link).left + positionToElement.clientWidth / 2 - arrowBorderWidth : 0,
					positionToElementHeight = positionToElement ? positionToElement.clientHeight : 0,
					positionToElementWidth = positionToElement ? positionToElement.clientWidth : 0,
					correctionValue = [0, 0],
					usedTolerance,
					arrowLeft;

				arrow.removeAttribute("class");
				arrowClasses.add(classes.uiArrow);
				arrowClasses.add(classes[type]);

				arrowLeft = left - containerLeft;

				uiContainer.classList.add(classes[type]);

				switch (type) {
				case "bottom":
					popupMargin = parseInt(doms.getCSSProperty(this.element, "margin-top"), 10) || 0;
					arrowClasses.add(classes.bottom);
					arrowStyle.top = -arrowBorderWidth + popupMargin + "px";
					// Developer can try to change position of popup using method *refresh*.
					// However, in case of context popup, arrow should be always placed
					// in the middle of element related with popup.
					// So we have to check if arrow is still in range of popup's container
					// and correct value of left position of popup if it is necessary.
					if (arrowLeft < 0) {
						// popup container is positioned too far to the right
						usedTolerance = tolerance.l;
						arrowStyle.left = usedTolerance + "px";
						correctionValue[0] = arrowLeft - usedTolerance;
					} else if (arrowLeft > uiContainerWidth) {
						// popup container is positioned too far to the left
						usedTolerance = tolerance.r;
						arrowStyle.left = uiContainerWidth - usedTolerance - arrowBorderWidth * 2 + "px";
						correctionValue[0] = arrowLeft - uiContainerWidth + usedTolerance + arrowBorderWidth * 2;
					} else {
						// popup container is positioned properly,
						// so correction value of left position remains zero
						arrowStyle.left = arrowLeft + "px";
					}
					// correction value of top position is always the same
					correctionValue[1] = positionToElementHeight + positionToElementOffset.top - containerTop
					break;
				case "right":
					// @todo
					arrowStyle.left = -arrowBorderWidth * 2 + 1 + "px";
					arrowStyle.top = uiContainerHeight / 2 - arrowBorderWidth + "px";
					correctionValue = [positionToElementWidth + positionToElementOffset.left - arrowBorderWidth, 0];
					break;
				case "top":
					popupMargin = parseInt(doms.getCSSProperty(this.element, "margin-bottom"), 10) || 0;
					arrowClasses.add(classes.top);
					arrowStyle.top = uiContainerHeight - popupMargin - arrowBorderWidth + "px";
					// @todo make one correction for *top* and *bottom* arrows
					if (arrowLeft < 0) {
						// popup container is set too far to the right
						usedTolerance = tolerance.l;
						arrowStyle.left = usedTolerance + "px";
						correctionValue[0] = arrowLeft - usedTolerance;
					} else if (arrowLeft > uiContainerWidth) {
						// popup container is set too far to the left
						usedTolerance = tolerance.r;
						arrowStyle.left = uiContainerWidth - usedTolerance - arrowBorderWidth * 2 + "px";
						correctionValue[0] = arrowLeft - uiContainerWidth + usedTolerance + arrowBorderWidth * 2;
					} else {
						arrowStyle.left = arrowLeft + "px";
					}
					correctionValue[1] = -(containerTop + uiContainerHeight - positionToElementOffset.top);
					break;
				case "left":
					// @todo
					arrowStyle.left = uiContainer.clientWidth + 3 + "px";
					arrowStyle.top = uiContainerHeight / 2 - arrowBorderWidth + "px";
					correctionValue = [positionToElementOffset.left - uiContainerWidth, 0];
					break;
				}

				return correctionValue;

				// @todo arrow's positions (in original file, it was in _placementCoords)
				// correctionValue = [0, (positionToElement.offsetTop + positionToElement.style.height - y)];
			};

			/**
			 * Set callback, which is called on "resize" event. This callback should return desired position of popup after resizing.
			 *
			 * This function is deprecated and function setPositionCallback should be used to set this callback.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *
			 *          popupWidget.setPositionCB(function() {
			 *                return {x: 10, y: 20};
			 *          });
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("setPositionCB", function() {
			 *                return {x: 10, y: 20};
			 *          });
			 *      </script>
			 *
			 * @method setPositionCB
			 * @param {Function} callback Function called on resizing. It should return desired position of popup as object with "x" and "y" properties.
			 * @member ns.widget.mobile.Popup
			 * @deprecated 2.3
			 */
			Popup.prototype.setPositionCB = function (callback) {
				this.setPositionCallback(callback);
			};

			/**
			 * Set callback, which is called on "resize" event. This callback should return desired position of popup after resizing.
			 *
			 * This function should be used instead of "setPositionCB".
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *
			 *          popupWidget.setPositionCallback(function() {
			 *                return {x: 10, y: 20};
			 *         });
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("setPositionCallback", function() {
			 *                return {x: 10, y: 20};
			 *          });
			 *      </script>
			 *
			 * @method setPositionCallback
			 * @param {Function} callback Function called on resizing. It should return desired position of popup as object with "x" and "y" properties.
			 * @member ns.widget.mobile.Popup
			 * @new 2.3
			 */
			Popup.prototype.setPositionCallback = function (callback) {
				this._callback = callback;
			};

			/**
			* Set position of popup
			* @method _setPosition
			* @param {number} [left]
			* @param {number} [top]
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._setPosition = function (left, top) {
				var ui = this._ui,
					uiArrow = ui.arrow,
					uiContainer = ui.container,
					uiContainerStyle = uiContainer.style,
					uiContainerWidth = uiContainer.offsetWidth,
					uiContainerHeight = uiContainer.offsetHeight,
					options = this.options,
					positionToOption = options.positionTo.toLowerCase(),
					positionToElement,
					positionToElementOffset,
					docElement = document.documentElement,
					desired,
					arrowType = "top",
					positionOffsets,
					correctionValue = [0, 0],
					arrowDimensions,
					arrowBorders = {
						"border-top-width": 0,
						"border-right-width": 0,
						"border-bottom-width": 0,
						"border-left-width": 0
					},
					elementDimensions;

				doms.extractCSSProperties(uiArrow, arrowBorders);

				if (typeof top === "number" && typeof left === "number") {
					desired = {
						x: left,
						y: top
					};
				}

				if (positionToOption === "window") {
					top = null;
					uiContainerStyle.bottom = "0";
				} else if (positionToOption === "origin") {
					// popup with arrow
					if (options.link) {
						positionToElement = findPositionToElement("#" + options.link);
					} else {
						positionToElement = null;
					}
					desired = this._placementCoords(desired || this._desiredCoords(positionToElement));
					top = desired.top;
					left = desired.left;

					if (positionToElement) {
						positionToElementOffset = getOffsetOfElement(positionToElement, options.link);
						positionOffsets = {
							"top": positionToElementOffset.top,
							"right": docElement.clientWidth - (positionToElementOffset.left + doms.getElementWidth(positionToElement)),
							"bottom": docElement.clientHeight - (positionToElementOffset.top + doms.getElementHeight(positionToElement)),
							"left": positionToElementOffset.left
						};
						elementDimensions = {
							width: uiContainerWidth,
							height: uiContainerHeight
						};
						arrowDimensions = {
							// For proper results arrow width and height are assumed to be "0"
							"top": arrowBorders["border-top-width"],
							"right": arrowBorders["border-right-width"],
							"bottom": arrowBorders["border-bottom-width"],
							"left": arrowBorders["border-left-width"]
						};
						arrowType = chooseDirectionByPriority(options.directionPriority, positionOffsets, elementDimensions, arrowDimensions);

						if (uiArrow.style.display !== "none") {
							correctionValue = this._setArrowPosition(arrowType, positionToElement, left, top, positionToElementOffset);
						}
					}
				} else {
					// position to element which matches to options.positionTo selector
					positionToElement = findPositionToElement(options.positionTo);
					desired = this._placementCoords(desired || this._desiredCoords(positionToElement));
					top = desired.top;
					left = desired.left;
				}

				if (top) {
					uiContainerStyle.left = left + correctionValue[0] + "px";
					uiContainerStyle.top = top + correctionValue[1] + "px";
				}
			};

			/**
			* Set context style of widget
			* @method _setContextStyle
			* @param {boolean} popupwindow
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._setContextStyle = function (popupwindow) {
				var classes = Popup.classes,
					options = this.options,
					ui = this._ui,
					linkElement = options.link ? document.getElementById(options.link) : null,
					position = options.positionTo.toLowerCase(),
					containerList = ui.container.classList;

				if ((position !== "window" && linkElement && linkElement.getAttribute("data-position-to") !== "window") || options.isHardwarePopup) {
					this.element.classList.add(classes.uiCtxpopup);
					if (popupwindow) {
						containerList.add(classes.uiPopupWindow);
						this.element.classList.add(classes.uiPopupWindowPadding);
					} else {
						containerList.remove(classes.uiPopupContainer);
						containerList.add(classes.uiCtxpopupContainer);
					}
					if (position === "origin") {
						ui.arrow.style.display = "initial";
						ui.screen.classList.add(classes.uiCtxpopupScreen);
					} else {
						ui.arrow.style.display = "none";
					}
				} else {
					this._setOverlayTheme(this.element, "dim");
					ui.arrow.style.display = "none";
				}

				if (options.isHardwarePopup) {
					ui.arrow.style.display = "none";
				}
			};

			/**
			* Set overlay theme for screen
			* @method _setOverlayTheme
			* @param {HTMLElement} element
			* @param {string} value
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._setOverlayTheme = function (element, value) {
				var classes = Popup.classes,
					screen = this._ui.screen;

				applyTheme(screen, value, "overlay");
				if (this._isOpen) {
					screen.classList.add(classes.IN);
				}
			};

			/**
			* Set type of corners
			* @method _setCorners
			* @param {boolean} value
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._setCorners = function (value) {
				var classes = Popup.classes;
				if (value) {
					this.element.classList.add(classes.uiCornerAll);
				} else {
					this.element.classList.remove(classes.uiCornerAll);
				}
			};

			/**
			* Set transition
			* @method _applyTransition
			* @param {string} value
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._applyTransition = function (value) {
				var self = this;

				if (self._fallbackTransition) {
					self._ui.container.classList.remove(self._fallbackTransition);
				}
				if (value && value !== "none") {
					// @todo
					// this._fallbackTransition = $.mobile._maybeDegradeTransition( value );
					self._fallbackTransition = value;
					self._ui.container.classList.add(self._fallbackTransition);
				}
			};

			/**
			* Prepare deferred objects for animation
			* @method _createPrereqs
			* @param {Function} screenPrereq
			* @param {Function} containerPrereq
			* @param {Function} whenDone
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._createPrereqs = function (screenPrereq, containerPrereq, whenDone) {
				var self = this,
					prereqs;

				// It is important to maintain both the local variable prereqs and self._prereqs. The local variable remains in
				// the closure of the functions which call the callbacks passed in. The comparison between the local variable and
				// self._prereqs is necessary, because once a function has been passed to .animationComplete() it will be called
				// next time an animation completes, even if that's not the animation whose end the function was supposed to catch
				// (for example, if an abort happens during the opening animation, the .animationComplete handler is not called for
				// that animation anymore, but the handler remains attached, so it is called the next time the popup is opened
				// - making it stale. Comparing the local variable prereqs to the widget-level variable self._prereqs ensures that
				// callbacks triggered by a stale .animationComplete will be ignored.
				prereqs = {
					screen: new UtilsDeferred(),
					container: new UtilsDeferred()
				};

				prereqs.screen.then(function () {
					if (prereqs === self._prereqs) {
						screenPrereq();
					}
				});

				prereqs.container.then(function() {
					if (prereqs === self._prereqs) {
						containerPrereq();
					}
				});

				ns.util.deferredWhen(prereqs.screen, prereqs.container).done(function() {
					if ( prereqs === self._prereqs ) {
						self._prereqs = null;
						whenDone();
					}
				});

				self._prereqs = prereqs;
			};

			/**
			* Set animation
			* @method _animate
			* @param {Object} options
			* @param {boolean} [options.additionalCondition]
			* @param {string} [options.transition]
			* @param {Array|string} [options.classToRemove]
			* @param {Array|string} [options.screenClassToAdd]
			* @param {Array|string} [options.containerClassToAdd]
			* @param {boolean} [options.applyTransition]
			* @param {Object} [options.prereqs]
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._animate = function (options) {
				var ui = this._ui,
					screenClasses = ui.screen.classList,
					container = ui.container,
					containerClasses = container.classList,
					transition = options.transition,
					classesToRemove = typeof options.classToRemove === "string" ? options.classToRemove.split(" ") : options.classToRemove,
					classesToRemoveLen = classesToRemove.length,
					classes,
					classesLen,
					i;

				for (i = 0; i < classesToRemoveLen; i++) {
					if (classesToRemove[i]) {
						screenClasses.remove(classesToRemove[i]);
					}
				}

				classes = typeof options.screenClassToAdd === "string" ? options.screenClassToAdd.split(" ") : options.screenClassToAdd;
				classesLen = classes.length;
				for (i = 0; i < classesLen; i++) {
					if (classes[i]) {
						screenClasses.add(classes[i]);
					}
				}

				options.prereqs.screen.resolve();

				if (transition && transition !== "none") {
					if (options.applyTransition) {
						this._applyTransition(transition);
					}
					animationComplete(container, options.prereqs.container.resolve);
					classes = typeof options.containerClassToAdd === "string" ? options.containerClassToAdd.split(" ") : options.containerClassToAdd;
					classesLen = classes.length;
					for (i = 0; i < classesLen; i++) {
						containerClasses.add(classes[i]);
					}
					for (i = 0; i < classesToRemoveLen; i++) {
						if (classesToRemove[i]) {
							containerClasses.remove(classesToRemove[i]);
						}
					}
				} else {
					for (i = 0; i < classesToRemoveLen; i++) {
						if (classesToRemove[i]) {
							containerClasses.remove(classesToRemove[i]);
						}
					}
					options.prereqs.container.resolve();
				}
			};

			/**
			* Animation's callback on completed opening
			* @method _openPrereqsComplete
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._openPrereqsComplete = function() {
				var self = this,
					container = self._ui.container;

				container.classList.add(Popup.classes.uiPopupActive);
				self._isOpen = true;
				self._isPreOpen = false;

				// Android appears to trigger the animation complete before the popup
				// is visible. Allowing the stack to unwind before applying focus prevents
				// the "blue flash" of element focus in android 4.0
				setTimeout(function(){
					container.setAttribute("tabindex", "0");
					container.focus();
					events.trigger(self.element, "popupafteropen");
					events.trigger(self.element, "popupshow");
				});
			};

			/**
			* Set popup, which will be opened
			* @method _open
			* @param {Object} options
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._open = function (options, event) {
				var element = this.element,
					position = doms.getNSData(element, "position-to"),
					classes = Popup.classes,
					savedOptions = this.options,
					elementTheme = savedOptions.theme,
					ui = this._ui,
					uiContainer = ui.container,
					uiContainerClasses = uiContainer.classList,
					linkElement,
					transition,
					top,
					left;

				this._isPreOpen = true;

				options = options || {};
				top = savedOptions.positionY = options.positionY;
				left = savedOptions.positionX = options.positionX;
				transition = options.transition || savedOptions.transition;
				options.noScreen = options.noScreen || savedOptions.noScreen;

				this._setTolerance(element, options.tolerance);

				// Give applications a chance to modify the contents of the container before it appears
				events.trigger(this.element, "beforeposition");

				if (options.link) {
					savedOptions.link = options.link;
					savedOptions.positionTo = options.positionTo || position || "origin";
				} else {
					if (event) {
						linkElement = selectors.getClosestBySelector(event.target, "[data-role='button'],input[type='button']");
						savedOptions.link =  linkElement ? linkElement.getAttribute("id") : null;
						savedOptions.positionTo = options.positionTo || position || "origin";
					}
				}

				if (element.classList.contains(classes.uiCtxpopupOptionmenu)) {
					savedOptions.isHardwarePopup = true;
				}

				this._setContextStyle(options.popupwindow || savedOptions.popupwindow);
				this._setPosition(left, top);
				this._setCorners(options.corners || savedOptions.corners);


				this._createPrereqs(function(){}, function(){}, this._openPrereqsComplete.bind(this));

				if (transition) {
					this._currentTransition = transition;
					this._applyTransition(transition);
				}

				if (elementTheme) {
					element.classList.add(classes.uiBodyPrefix + elementTheme);
				}

				if (!options.noScreen) {
					ui.screen.classList.remove(classes.SCREEN_HIDDEN);
				}
				uiContainerClasses.remove(classes.uiSelectmenuHidden);
				this._page.classList.add(classes.uiPopupOpen);

				this._animate({
					additionalCondition: true,
					transition: transition,
					classToRemove: "",
					screenClassToAdd: (options.noScreen) ? "" :  classes.IN,
					containerClassToAdd: classes.IN,
					applyTransition: false,
					prereqs: this._prereqs
				});

				// FIX: for tv profile
				if (typeof this._supportKeyboard !== "boolean") {
					// This fix problem with host keyboard
					// @todo keyboard support for mobile
					removeProperties();
				}
			};

			/**
			* Animation's callback on scren closing
			* @method _closePrereqScreen
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._closePrereqScreen = function() {
				var classes = Popup.classes,
					screenClasses = this._ui.screen.classList;

				screenClasses.remove(classes.OUT);
				screenClasses.add(classes.SCREEN_HIDDEN);
			};

			/**
			* Animation's callback on container closing
			* @method _closePrereqContainer
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._closePrereqContainer = function() {
				var classes = Popup.classes,
					container = this._ui.container,
					containerClasses = container.classList;

				containerClasses.remove(classes.REVERSE);
				containerClasses.remove(classes.OUT);
				containerClasses.add(classes.uiSelectmenuHidden);
				container.removeAttribute("style");
			};

			/**
			* Animation's callbacl on completed closing
			* @method _closePrereqsDone
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._closePrereqsDone = function() {
				var self = this;

				self._ui.container.removeAttribute("tabindex");

				// @todo?
				// remove nav bindings if they are still present
				// var opts = self.options;
				//opts.container.unbind( opts.closeEvents );

				// @todo?
				// unbind click handlers added when history is disabled
				//self.element.undelegate( opts.closeLinkSelector, opts.closeLinkEvents );

				ns.activePopup = null;
				// Popup's closing phase is finished
				this._isPreClose = false;
				events.trigger(document, "activePopup", null);
				events.trigger(this.element, "popupafterclose");		// this event must be triggered after setting mobile.popup.active
				events.trigger(this.element, "popuphide");
			};

			/**
			* Set popup, which will be closed
			* @method _close
			* @return {void}
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._close = function (immediate) {
				var classes = Popup.classes,
					ui = this._ui,
					uiContainer = ui.container,
					uiContainerClass = uiContainer.classList,
					element = this.element,
					inputs = [].slice.call(element.querySelectorAll("input"));

				uiContainerClass.remove(classes.uiPopupActive);
				this._page.classList.remove(classes.uiPopupOpen);

				this._isOpen = false;
				this._isPreOpen = false;
				// Popup is starting to close
				this._isPreClose = true;

				inputs.forEach(function(input){
					input.blur();
				});

				// Count down to triggering "popupafterclose" - we have two prerequisites:
				// 1. The popup window reverse animation completes (container())
				// 2. The screen opacity animation completes (screen())
				this._createPrereqs(
					this._closePrereqScreen.bind(this),
					this._closePrereqContainer.bind(this),
					this._closePrereqsDone.bind(this));

				this._animate( {
					additionalCondition: this._ui.screen.classList.contains("in"),
					transition: (immediate ? "none" : (this._currentTransition || this.options.transition)),
					classToRemove: classes.IN,
					screenClassToAdd: classes.OUT,
					containerClassToAdd: [classes.REVERSE, classes.OUT],
					applyTransition: true,
					prereqs: this._prereqs
				});

				// FIX: for tv profile
				if (typeof this._supportKeyboard !== "boolean") {
					// @todo keyboard support for mobile
					restoreProperties();
				}
			};

			/**
			 * This method opens popup.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *
			 *          popupWidget.open();
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *     @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *     <script>
			 *       $("#popup").open("open", {"noScreen" : true, "positionX" : 10});
			 *     </script>
			 *
			 * @method open
			 * @param {Object} [options]
			 * @param {boolean} [options.corners] Sets whether to draw the popup with rounded corners.
			 * @param {string} [options.positionTo="origin"] Sets the element relative to which the popup will be centered.
			 * @param {?string} [options.link=null] Sets id of element used as reference for relative popup placement.
			 * @param {Object} [options.tolerance] Sets the minimum distance from the edge of the window for the corresponding edge of the popup.
			 * @param {boolean} [options.noScreen] Set screen to be always hidden
			 * @param {string} [options.transition] Sets the default transition for the popup.
			 * @param {boolean} [options.popupwindow] Sets whether the popup has context style.
			 * @param {boolean} [options.isHardwarePopup] Sets whether the popup is hardware one.
			 * @param {?number} [options.positionX] Sets desired horizontal coordinate of the center point in popup in pixels.
			 * @param {?number} [options.positionY] Sets desired vertical coordinate of the center point in popup in pixels.
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			Popup.prototype.open = function (options) {
				var activePopup = ns.activePopup,
					closePopup,
					event = arguments[1],
					startOpeningCallback = startOpeningPopup.bind(null, this, options, event);

				if (activePopup === this) {
					return;
				}
				// If there is an active popup, wait until active popup will close
				if (activePopup) {
					events.one(activePopup.element, "popupafterclose", startOpeningCallback);
					if (activePopup._isOpen) {
						activePopup.close();
					} else if (!activePopup._isPreClose) {
						// If popup is opening or is promised to be opened
						// close it just after opening
						closePopup = activePopup.close.bind(activePopup);
						events.one(activePopup.element, "popupafteropen", closePopup);
					}
				} else {
					startOpeningCallback();
				}
				ns.activePopup = this;
			};

			/**
			 * Close popup
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *
			 *          popupWidget.close(true); // popup will be closed without animation
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("close");
			 *      </script>
			 *
			 * @method close
			 * @param {boolean} [immediate=false] defined if popup should be closed without animation
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			Popup.prototype.close = function (immediate) {
				// @todo define mutex $.mobile.popup.active
				if (!ns.activePopup || !this._isOpen) {
					return;
				}

				this._close(immediate);
			};

			/**
			* Bind events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._bindEvents = function () {
				var self = this,
					buttons = self.element.querySelectorAll(self.options.closeLinkSelector),
					i,
					buttonsLen = buttons.length;
				self._onClickBound = _eatEventAndClose.bind(null, self);
				self._onResizeBound = onResize.bind(null, self);
				self._closeOnEvent = self.close.bind(self, true);
				self._destroyOnEvent = self.destroy.bind(self, self.element);

				self._ui.screen.addEventListener("vclick", self._onClickBound, true);
				window.addEventListener("throttledresize", self._onResizeBound, true);
				if (buttonsLen) {
					for (i = 0; i < buttonsLen; i++) {
						buttons[i].addEventListener("click", self._closeOnEvent, true);
					}
				}
				self._page.addEventListener("pagebeforehide", self._closeOnEvent, true);
				self._page.addEventListener("pagedestroy", self._destroyOnEvent, true);
				// @todo
				// - orientationchange
				// - resize
				// - keyup
			};

			/**
			 * Removes the popup functionality completely.
			 *
			 * This will return the element back to its pre-init state.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *          popupWidget.destroy();
			 *      <script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("destroy");
			 *      </script>
			 *
			 * @method destroy
			 * @member ns.widget.mobile.Popup
			 */

			/**
			* Destroy popup
			* @method _destroy
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._destroy = function () {
				var self = this,
					classes = Popup.classes,
					ui = self._ui,
					uiScreen = ui.screen,
					uiPlaceholder = ui.placeholder,
					page = self._page,
					element = self.element,
					elementClasses = element.classList,
					buttons = element.querySelectorAll(self.options.closeLinkSelector),
					i,
					buttonsLen = buttons.length;

				// When we destroy widget, we close it without animation
				self.close(true);

				uiScreen.removeEventListener("vclick", self._onClickBound, true);
				window.removeEventListener("throttledresize", self._onResizeBound, true);
				if (buttonsLen) {
					for (i = 0; i < buttonsLen; i++) {
						buttons[i].removeEventListener("click", self._closeOnEvent, true);
					}
				}

				page.removeEventListener("pagebeforehide", self._closeOnEvent, true);
				page.removeEventListener("pagedestroy", self._destroyOnEvent, true);

				doms.insertNodesBefore(uiPlaceholder, element);
				elementClasses.remove(classes.uiPopup);
				elementClasses.remove(classes.uiOverlaryShadow);
				elementClasses.remove(classes.uiCornerAll);
				uiPlaceholder.parentNode.removeChild(uiPlaceholder);
				ui.arrow.parentNode.removeChild(ui.arrow);
				ui.container.parentNode.removeChild(ui.container);
				uiScreen.parentNode.removeChild(uiScreen);
			};

			/**
			 * This method refreshes position of opened popup.
			 *
			 * In case of context popup, position of arrow is not changed after calling this method.
			 * If the new position of popup's content causes disconnection from the arrow, the position of popup will be corrected automatically. Content of popup is always set so that the arrow is placed between left and right side of the popup's container with proper margin set in option.tolerance.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *
			 *          popupWidget.refresh(); // only refresh original position
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("refresh", {top: 10, left: 10}); // try to set new position for the center point of popup
			 *      </script>
			 *
			 * @method refresh
			 * @param {Object} [options] options
			 * @param {number} [options.positionX] desired horizontal coordinate of the center point in popup in pixels (it only works if both coordinates are set - top and left)
			 * @param {number} [options.positionY] desired vertical coordinate of the center point in popup in pixels (it only works if both coordinates are set - top and left)
			 * @chainable
			 * @member ns.widget.mobile.Popup
			 */

			/**
			* Refresh popup
			* @method _refresh
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._refresh = function (options) {
				options = options || {};
				this._setPosition(options.positionX, options.positionY);
			};

			/**
			 * This method changes state of popup on enabled and removes CSS classes connected with state.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *          popupWidget.enable();
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("enable");
			 *      </script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.Popup
			 */

			/**
			 * This method changes state of popup on disabled and adds CSS classes connected with state.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *          popupWidget.disable();
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("disable");
			 *      </script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.Popup
			 */

			/**
			 * The function "value" is not supported in this widget.
			 *
			 * @method value
			 * @chainable
			 * @member ns.widget.mobile.Popup
			 */

			/**
			 * Get/Set options of the widget.
			 *
			 * This method can work in many context.
			 *
			 * If first argument is type of object them, method set values for options given in object. Keys of object are names of options and values from object are values to set.
			 *
			 * If you give only one string argument then method return value for given option.
			 *
			 * If you give two arguments and first argument will be a string then second argument will be intemperate as value to set.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup")),
			 *              optionValue;
			 *
			 *          optionValue = popupWidget.option("positionTo"); // read value of option positionTo
			 *          popupWidget.option("positionTo", "window") // set value
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          optionValue = $("#popup").popup("option", "positionTo");
			 *          $("#popup").popup("option", "positionTo", "window");
			 *      </script>
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} value value to set
			 * @member ns.widget.mobile.Popup
			 * @return {*} return value of option or undefined if method is called in setter context
			 */

			/**
			 * Trigger an event on widget's element.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *          popupWidget.trigger("eventName");
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("trigger", "eventName");
			 *      </script>
			 *
			 * @method trigger
			 * @param {string} eventName the name of event to trigger
			 * @param {?*} [data] additional object to be carried with the event
			 * @param {boolean} [bubbles=true] indicating whether the event bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] indicating whether the event is cancelable
			 * @return {boolean} false, if any callback invoked preventDefault on event object
			 * @member ns.widget.mobile.Popup
			*/

			/**
			 * Add event listener to widget's element.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup")),
			 *              callback = function () {
			 *                  console.log("event fires");
			 *              });
			 *
			 *          popupWidget.on("eventName", callback);
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("on", "eventName", callback);
			 *      </script>
			 *
			 * @method on
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param to addEventListener
			 * @member ns.widget.mobile.Popup
			 */

			/**
			 * Remove event listener to widget's element.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup")),
			 *              callback = function () {
			 *                  console.log("event fires");
			 *              });
			 *
			 *          // add callback on event "eventName"
			 *          popupWidget.on("eventName", callback);
			 *          // ...
			 *          // remove callback on event "eventName"
			 *          popupWidget.off("eventName", callback);
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          // add callback on event "eventName"
			 *          $("#popup").popup("on", "eventName", callback);
			 *          // ...
			 *          // remove callback on event "eventName"
			 *          $("#popup").popup("off", "eventName", callback);
			 *      </script>
			 *
			 * @method off
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param to addEventListener
			 * @member ns.widget.mobile.Popup
			 */

			ns.widget.mobile.Popup = Popup;
			engine.defineWidget(
				"Popup",
				"[data-role='popup'], .ui-popup",
				[
					"open",
					"close",
					"setPositionCallback",
					"setPositionCB"
				],
				Popup,
				"mobile"
			);
			}(window, window.document, ns));

/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true */
/**
 * # Slider Widget
 * Slider widget changes browser input with type range to sliders
 *
 * ## Default selectors
 * In default all **INPUT** tags with type equals _range_ are changed
 * to Tizen WebUI sliders.
 * In addition all elements with _data-role=range_ and _data-role=slider_
 * and class _ui-tizenslider_ are changed to Tizen Web UI sliders.
 *
 * ###HTML Examples
 *
 * ####Create slider input
 *
 *		@example
 *		<input type="range" name="slider-1" id="slider" value="60" min="0" max="100">
 *
 * ## Manual constructor
 * For manual creation of slider widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<input id="slider" type="range" name="slider-1"
 *		 value="60" min="0" max="100">
 *		<script>
 *			var sliderElement = document.getElementById("slider"),
 *				slider = tau.widget.TizenSlider(sliderElement);
 *		</script>
 *
 * Constructor has one required parameter **element** which
 * is base **HTMLElement** to create widget. We recommend get this element
 * by method *document.getElementById*. Second parameter is **options**
 * and it is a object with options for widget.
 *
 *		@example
 *		<input id="slider" type="range" name="slider-1"
 *		 value="60" min="0" max="100">
 *		<script>
 *			var sliderElement = document.getElementById("slider"),
 *				slider = tau.widget.TizenSlider(sliderElement, {mini: true});
 *		</script>
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<input id="slider" type="range" name="slider-1"
 *		 value="60" min="0" max="100">
 *		<script>
 *			$("#slider").tizenslider({mini: true});
 *		</script>
 * jQuery Mobile constructor has one optional parameter **options**
 * and it is a object with options for widget.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<input id="slider" type="range" name="slider"
 *		 value="60" min="0" max="100">
 *		<script>
 *		var slider = document.getElementById("slider"),
 *			slider = tau.widget.TizenSlider(slider);
 *
 *		// slider.methodName(methodArgument1, methodArgument2, ...);
 *		// for example
 *		var value = slider.value("5");
 *		</script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		<input id="slider" type="range" name="slider"
 *		 value="60" min="0" max="100">
 *		<script>
 *		//$("#slider").tizenslider("methodName", argument1, argument2, ...);
 *		//for example
 *		$("#slider").tizenslider("value", "5");
 *		</script>
 *
 * @class ns.widget.mobile.TizenSlider
 * @extends ns.widget.mobile.Slider
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	
				var Slider = ns.widget.mobile.Slider,
				Button = ns.widget.mobile.Button,
				engine = ns.engine,
				events = ns.event,
				objectUtils = ns.util.object,
				DOM = ns.util.DOM,
				POPUP_WIDTH = {
					"SMALL": "2.3rem",
					"MEDIUM": "2.8rem",
					"LARGE": "3.0rem"
				},
				FONT_SIZE = {
					"SMALL": "0.95rem",
					"MEDIUM": "0.85rem",
					"LARGE": "0.65rem",
					"DEFAULT": "0.45rem"
				},
				FONT_TOP = {
					"SMALL": "0",
					"MEDIUM": "-0.01rem",
					"LARGE": "-0.1rem",
					"DEFAULT": "-0.15rem"
				},
				TizenSlider = function () {
					Slider.call(this);
					// Some properties for example .popup must be defined once per slider
					// we need to make a copy of base options, because simple assigment
					// would create references to a single object
					this.options = this.options ? objectUtils.copy(this.options) : {};
					// Redefine this._ui use instance property not prototype property
					// in further operations
					this._ui = this._ui || {};
					// @TODO recheck other properties for potential issues
					// like this._ui
					this._popup = null;
				},
				sliderBuild,
				sliderInit,
				sliderConfigure,
				sliderBindEvents,
				slider_refresh,
				slider_setValue,
				slider_getValue;

			/**
			 * Dictionary for TizenSlider related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.TizenSlider
			 * @static
			 * @readonly
			 */
			TizenSlider.classes = {
				uiSliderPopup: "ui-slider-popup",
				uiSliderPopupContainer: "ui-slider-popup-container",
				uiSliderLeftPrefix: "ui-slider-left-",
				uiSliderRightPrefix: "ui-slider-right-",
				uiSliderLeftText: "ui-slider-left-text",
				uiSliderRightText: "ui-slider-right-text",
				uiSliderHandlePress: "ui-slider-handle-press",
				uiSliderCenter: "ui-slider-center"
			};

			TizenSlider.prototype = new Slider();
			sliderConfigure = TizenSlider.prototype._configure;
			sliderBuild = TizenSlider.prototype._build;
			sliderInit = TizenSlider.prototype._init;
			sliderBindEvents = TizenSlider.prototype._bindEvents;
			slider_refresh = TizenSlider.prototype._refresh,
			slider_setValue = TizenSlider.prototype._setValue
			slider_getValue = TizenSlider.prototype._getValue;

			/**
			 * Configure TizenSlider widget
			 * @method _configure
			 * @protected
			 * @member ns.widget.mobile.TizenSlider
			 */
			TizenSlider.prototype._configure = function () {
				/**
				 * All possible widget options
				 * @property {Object} options
				 * @property {boolean} [options.popup=true] enables popup
				 * @property {boolean} [options.center=false] creates additional markup to pointing center of the slider
				 * @property {string} [options.icon=""] icon type
				 * @property {string} [options.innerLabel=false] Displays the value inside the handler
				 * @property {string} [options.textLeft=""] text attached to left
				 * @property {string} [options.textRight=""] text attached to right
				 * @member ns.widget.mobile.TizenSlider
				 */
				var options = this.options;

				if (typeof sliderConfigure === "function") {
					sliderConfigure.call(this);
				}
				options.popup = false;
				options.center = false;
				options.innerLabel = false;
				options.icon = "";
				options.textLeft = "";
				options.textRight = "";
			};

			/**
			 * Check if value is not empty
			 * @method getValueLength
			 * @param {number} value
			 * @return {number}
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function getValueLength(value) {
				return (new String(value)).length;
			}

			/**
			 * Creates popup element and appends it container passed as argument
			 * @method _createPopup
			 * @param {HTMLElement} container
			 * @return {ns.widget.Popup} reference to new widget instance
			 * @protected
			 * @member ns.widget.mobile.TizenSlider
			 */
			TizenSlider.prototype._createPopup = function (container) {
				var classes = TizenSlider.classes,
					popup,
					popupInstance;

				// Create element and append it to slider
				popup = document.createElement("div");
				container.appendChild(popup);
				// Create widget instance out of popup element
				popupInstance = engine.instanceWidget(popup, "Popup", {
					positionTo: "origin", // popup with arrow
					link: this._ui.handle.id, // positioned to slider's element
					transition: "none",
					noScreen: true,
					directionPriority: [
						"top",
						"bottom"
					],
					tolerance: "10,0,10,0",
					specialContainerClass: classes.uiSliderPopupContainer
				});
				popup.classList.add(classes.uiSliderPopup);

				return popupInstance;
			};

			/**
			 * Creates slider with the marked center element
			 * @method _createCenter
			 * @param {HTMLElement} slider
			 * @return {HTMLElement} returns the inserted element
			 * @protected
			 * @member ns.widget.mobile.TizenSlider
			 */
			TizenSlider.prototype._createCenter = function (slider) {
				var centerElement = document.createElement("div");
				centerElement.className = TizenSlider.classes.uiSliderCenter;

				return slider.insertBefore(centerElement, slider.childNodes[0]);
			};

			/**
			 * Updates popup state
			 * @method _updateSlider
			 * @member ns.widget.mobile.TizenSlider
			 * @protected
			 */
			TizenSlider.prototype._updateSlider = function () {
				var self = this,
					newValue,
					options = self.options,
					element = self.element,
					popupElement;

				// As the options.popup could change
				// it may be required to create popup
				if (self.options.popup){
					if (!self._popup) {
						self._popup = self._createPopup(self._ui.container);
					}

					popupElement = self._popup.element;
				}

				self._ui.handle.removeAttribute("title");

				newValue = parseInt(element.value, 10);

				if (newValue !== self.currentValue) {
					self.currentValue = newValue;

					// Set same value for popup element if it exists
					if (popupElement) {
						popupElement.innerHTML = newValue;
					}

					self._refresh();

					events.trigger(element, "update", newValue);
				} else {
					// If text doesn't change reposition only popup
					// no need to run full refresh
					if (self._popup) {
						self._popup.refresh();
					}
				}
			};

			/**
			 * Show popup for tizenslider
			 * @method _showPopup
			 * @member ns.widget.mobile.TizenSlider
			 * @protected
			 */
			TizenSlider.prototype._showPopup = function () {
				var self = this;

				if (self.options.popup && !self.popupVisible) {
					self._popup.open();
					self.popupVisible = true;
				}
			};

			/**
			 * Hide popup for tizenslider
			 * @method _hidePopup
			 * @member ns.widget.mobile.TizenSlider
			 * @protected
			 */
			TizenSlider.prototype._hidePopup = function () {
				var self = this;

				if (self.options.popup && self.popupVisible) {
					self._popup.close();
					self.popupVisible = false;
				}
			};

			/**
			 * Set options for popup in tizenslider
			 * @method _setOption
			 * @param {string} key
			 * @param {number} value
			 * @member ns.widget.mobile.TizenSlider
			 * @protected
			 */
			TizenSlider.prototype._setOption = function (key, value) {
				var needToChange = (value !== this.options[key]);

				if (needToChange) {
					switch (key) {
					case "popup":
						this.options.popup = value;
						if (value) {
							this._updateSlider();
						} else {
							this._hidePopup();
						}
						break;
					case "center":
						this.options.center = value;
					}
				}
			};

			/**
			 * Close popup by triggering vmouseup event
			 * @method _closePopup
			 * @member ns.widget.mobile.TizenSlider
			 * @protected
			 */
			TizenSlider.prototype._closePopup = function () {
				this._hidePopup();
			};

			/**
			 * Build TizenSlider
			 * @method _build
			 * @private
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.TizenSlider
			 */
			TizenSlider.prototype._build = function (element) {
				var self = this,
					options = self.options,
					slider,
					icon = options.icon,
					textRight = options.textRight,
					textLeft = options.textLeft,
					textLength,
					elemLeft,
					elemRight,
					marginLeft,
					marginRight,
					sliderContainer,
					inner,
					minValue,
					maxValue,
					classes = TizenSlider.classes,
					btnClasses = Button.classes,
					sliderContainerStyle,
					ui = self._ui;

				self.currentValue = null;

				sliderBuild.call(self, element);
				sliderInit.call(self, element);

				slider = ui.slider;
				sliderContainer = ui.container;
				sliderContainerStyle = sliderContainer.style;

				// Create popup for element
				if (options.popup) {
					self._popup = self._createPopup(sliderContainer);
				}

				if (options.center) {
					ui.centerElement = self._createCenter(slider);
				}

				maxValue = parseInt(element.getAttribute("max"), 10);
				minValue = parseInt(element.getAttribute("min"), 10);

				// Set default visibility for popup
				// @TODO  consider removing this property and use popup widget instance
				// to determine current popup status
				self.popupVisible = false;

				slider.classList.remove(btnClasses.uiBtnCornerAll);
				if (ui && ui.background) {
					ui.background.classList.remove(btnClasses.uiBtnCornerAll);
				}
				self._ui.handle.classList.remove(btnClasses.uiBtnCornerAll);
				slider.querySelector('.' + btnClasses.uiBtnInner).classList.remove(btnClasses.uiBtnCornerAll);

				switch (icon) {
				case "bright":
				case "volume":
					elemLeft = document.createElement("div");
					elemLeft.classList.add(classes.uiSliderLeftPrefix + icon);

					slider.parentNode.insertBefore(elemLeft, slider);

					marginLeft = (DOM.getElementWidth(elemLeft) + 16) + "px";
					marginRight = "";
					break;

				case "text":
					textLeft = (textLeft && textLeft.substring(0, 3)) || "";
					textRight = (textRight && textRight.substring(0, 3)) || "";

					elemLeft = document.createElement("div");
					elemLeft.classList.add(classes.uiSliderLeftText);

					elemRight = document.createElement("div");
					elemRight.classList.add(classes.uiSliderRightText);

					textLength = Math.max(textLeft.length, textRight.length) + 1;

					marginLeft = textLength + "rem";
					marginRight = textLength + "rem";

					// Properties set before appending to element in DOM
					elemLeft.style.left = "-" + marginLeft;
					elemLeft.style.width = marginLeft;

					elemRight.style.right = "-" + marginRight;
					elemRight.style.width = marginRight;

					inner = document.createElement("span");
					inner.style.position = "relative";
					inner.style.top = "0.4em";
					inner.innerHTML = textLeft;

					// Second element is same as first one
					elemLeft.appendChild(inner.cloneNode(true));

					inner.innerHTML = textRight;

					elemRight.appendChild(inner);

					slider.parentNode.insertBefore(elemLeft, slider);
					slider.parentNode.appendChild(elemRight);

					break;
				}

				if (icon) {
					sliderContainerStyle.marginLeft = marginLeft;
					sliderContainerStyle.marginRight = marginRight;
				}

				self.handleText = slider.querySelector("." + btnClasses.uiBtnText);

				self.element = element;
				self._updateSlider(element);

				return element;
			};

			/**
			 * Callback responsible for opening popup, fires on change event
			 * @method onChangeHandler
			 * @param {ns.widget.mobile.TizenSlider} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function onChangeHandler(self) {
				if (self.popupVisible) {
					self._updateSlider();
					self._showPopup();
					document.addEventListener("vmouseup", self.onVmouseUpHandleHandler, false);
				} else {
					self.popupVisible = true;
					self._updateSlider();
					self.popupVisible = false;
				}
			}

			/**
			 * Callback responsible for refreshing the slider and showing the popup
			 * @method onSlideStartHandler
			 * @param {ns.widget.mobile.TizenSlider} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function onSlideStartHandler(self) {
				self._updateSlider();
				self._showPopup();
				document.addEventListener("vmouseup", self.onVmouseUpHandleHandler, false);
			}

			/**
			 * Callback shows popup and assign another callback, fires on mouse down event
			 * @method onVmouseDownHandler
			 * @param {ns.widget.mobile.TizenSlider} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function onVmouseDownHandler(self) {
				self.handle.classList.add(TizenSlider.classes.uiSliderHandlePress);
				self._showPopup();
				document.addEventListener("vmouseup", self.onVmouseUpHandleHandler, false);
			}

			/**
			 * Callback responsible for refreshing the slider and showing popup.
			 * @method onVmouseDownHandleHandler
			 * @param {ns.widget.mobile.TizenSlider} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function onVmouseDownHandleHandler(self) {
				self._updateSlider();
				self._ui.handle.classList.add(TizenSlider.classes.uiSliderHandlePress);
				self._showPopup();
				document.addEventListener("vmouseup", self.onVmouseUpHandleHandler, false);
			}

			/**
			 * Callback hides popup and stops the event
			 * @method onVmouseUpHandleHandler
			 * @param {ns.widget.mobile.TizenSlider} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function onVmouseUpHandleHandler(self, event) {
				event.preventDefault();
				event.stopPropagation();
				self._hidePopup();
				self._ui.handle.classList.remove(TizenSlider.classes.uiSliderHandlePress);
				document.removeEventListener("vmouseup", self.onVmouseUpHandleHandler, false);
			}

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.TizenSlider
			 * @return {HTMLElement}
			 */
			TizenSlider.prototype._bindEvents = function (element) {
				sliderBindEvents.call(this, element);
				this.onChangeHandler = onChangeHandler.bind(null, this);
				this.onSlideStartHandler = onSlideStartHandler.bind(null, this);
				this.onVmouseDownHandler = onVmouseDownHandler.bind(null, this);
				this.onVmouseDownHandleHandler = onVmouseDownHandleHandler.bind(null, this);
				this.onVmouseUpHandleHandler = onVmouseUpHandleHandler.bind(null, this);
				this.onOrientationChangeHandler = this._closePopup.bind(this);

				element.addEventListener("change", this.onChangeHandler, false);
				element.addEventListener("slidestart", this.onSlideStartHandler, false);
				element.addEventListener("vmousedown", this.onVmouseDownHandler, false);
				this._ui.handle.addEventListener("vmousedown", this.onVmouseDownHandleHandler, false);
				window.addEventListener("orientationchange", this.onOrientationChangeHandler, false);

				return element;
			};

			/**
			 * @method _refresh
			 * @inheritdoc ns.widget.mobile.Slider#_refresh
			 * @protected
			 * @member ns.widget.mobile.TizenSlider
			 */
			TizenSlider.prototype._refresh = function () {
				var self = this,
					popup = self._popup;
				// Call parent refresh method with all passed arguments
				slider_refresh.apply(self, arguments);
				if (popup && self.popupVisible) {
					popup.refresh();
				}
			};

			ns.widget.mobile.TizenSlider = TizenSlider;
			engine.defineWidget(
				"TizenSlider",
				"input[type='range'], :not(select)[data-role='slider'], :not(select)[data-type='range'], .ui-tizenslider",
				[],
				TizenSlider,
				"tizen"
			);
			}(window, window.document, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/*
 * # Slider Widget
 * Creates horizontal axis with a draggable handle. It can be used to set singular value from within
 * lower and upper boundries.
 *
 * ## Using
 * User can drag the handle using touch capabilities. The other way, using remote control, is focusing
 * Slider using arrows and selecting it with OK [Enter if using keyboard]. Now you can adjust Slider
 * value using left/down right/up arrows. To apply new value use OK [Enter] button.
 *
 * ## Default selectors
 * All **INPUT** tags with _type="range"_ are changed into slider.
 *
 * ### HTML Examples
 *
 * #### Create slider input
 *
 *		@example
 *		<input id="slider-1" name="slider-1" type="range" value="5" min="0" max="10"/>
 *
 * ## Manual constructor
 * For manual creation of slider widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<input id="slider-1" name="slider-1" type="range" value="5" min="0" max="10"/>
 *		<script>
 *			var sliderElement = document.getElementById("slider-1"),
 *				slider = tau.widget.TizenSlider(sliderElement);
 *		</script>
 *
 * Constructor has one required parameter **element** which
 * is base **HTMLElement** to create widget. We recommend get this element
 * by method *document.getElementById*. Second parameter is **options**
 * and it is a object with options for widget.
 *
 *		@example
 *		<input id="slider-1" name="slider-1" type="range" value="5" min="0" max="10"/>
 *		<script>
 *			var sliderElement = document.getElementById("slider-1"),
 *				slider = tau.widget.TizenSlider(sliderElement, {data-popup: true});
 *		</script>
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<input id="slider-1" name="slider-1" type="range" value="5" min="0" max="10"/>
 *		<script>
 *		var slider = document.getElementById("slider"),
 *			slider = tau.widget.TizenSlider(slider);
 *
 *		// slider.methodName(methodArgument1, methodArgument2, ...);
 *		// for example
 *		var value = slider.value("5");
 *		</script>
 *
 * @class ns.widget.tv.Slider
 * @extends ns.widget.mobile.TizenSlider
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 */
(function (document, ns) {
	
				var BaseSlider = ns.widget.mobile.TizenSlider,
				BaseSliderPrototype = BaseSlider.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				Slider = function () {
					var self = this;
					BaseSlider.call(self);
					BaseKeyboardSupport.call(self);
					self._pageWidget = null;
					self._callbacks = {};
					self.status = false;
				},
				engine = ns.engine,
				selectors = ns.util.selectors,
				objectUtils = ns.util.object,
				// Slider inherits TizenSlider classes with additional
				// "ui-focus".
				classes = objectUtils.merge({}, BaseSlider.classes, {
					focus: "ui-focus"
				}),
				FUNCTION_TYPE = "function",
				prototype = new BaseSlider(),
				KEY_CODES = BaseKeyboardSupport.KEY_CODES;

			Slider.classes = classes;
			Slider.prototype = prototype;

			/**
			 * Shows popup with current Slider value
			 * @method showPopup
			 * @param {ns.widget.tv.Slider} self
			 * @private
			 * @static
			 * @member ns.widget.tv.Slider
			 */
			function showPopup(self) {
				if (self.options.popup) {
					self._updateSlider();
					self._showPopup();
				}
			}

			/**
			 * Keyup event-handling method.
			 * @method onKeyup
			 * @param {ns.widget.tv.Slider} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.Slider
			 */
			function onKeyup(self, event) {
				var status = self.status;

				if (event.keyCode === KEY_CODES.enter) {
					if (status) {
						self._ui.container.focus();
						self._pageWidget.enableKeyboardSupport();
					} else {
						self._ui.handle.focus();
						showPopup(self);
						self._pageWidget.disableKeyboardSupport();
					}
					self.status = !status;
				}
			}

			/**
			 * Keydown event-handling method.
			 * @method onKeydown
			 * @param {ns.widget.tv.Slider} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.Slider
			 */
			function onKeydown(self, event) {
				if (event.keyCode !== KEY_CODES.enter && !self.status) {
					event.preventDefault();
					event.stopPropagation();
				}
			}

			/**
			 * Focus event-handling method.
			 * @method onFocus
			 * @param {ns.widget.tv.Slider} self
			 * @private
			 * @static
			 * @member ns.widget.tv.Slider
			 */
			function onFocus(self) {
				self._ui.container.classList.add("ui-focus");
			}

			/**
			 * Blur event-handling method.
			 * @method onBlur
			 * @param {ns.widget.tv.Slider} self
			 * @private
			 * @static
			 * @member ns.widget.tv.Slider
			 */
			function onBlur(self) {
				self._ui.container.classList.remove("ui-focus");
			}

			/**
			 * Build structure of slider widget
			 * @method _build
			 * @param {HTMLInputElement|HTMLSelectElement} element
			 * @return {HTMLInputElement|HTMLSelectElement}
			 * @protected
			 * @member ns.widget.tv.Slider
			 */
			prototype._build = function(element) {
				var ui = this._ui,
					pageElement = selectors.getClosestByClass(element, "ui-page"),
					container,
					containerStyle,
					handler;
				this._pageWidget = engine.getBinding(pageElement, "page");

				element = BaseSliderPrototype._build.call(this, element);
				// focus is enabled only on container
				container = ui.container;
				container.classList.add(BaseKeyboardSupport.classes.focusEnabled);
				container.setAttribute("tabindex", 0);
				// focus is disabled on handler
				handler =  ui.handle;
				handler.classList.add(BaseKeyboardSupport.classes.focusDisabled);

				// change margin on paddings
				if (this.options.icon) {
					containerStyle = container.style;
					if (containerStyle.marginLeft) {
						containerStyle.paddingLeft = containerStyle.marginLeft;
						containerStyle.marginLeft = 0;
					}
					if (containerStyle.marginRight) {
						containerStyle.paddingRight = containerStyle.marginRight;
						containerStyle.marginRight = 0;
					}
				}
				return element;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLInputElement|HTMLSelectElement} element
			 * @protected
			 * @member ns.widget.tv.Slider
			 */
			prototype._init = function(element) {
				var pageElement = selectors.getClosestByClass(element, "ui-page");

				BaseSliderPrototype._init.call(this, element);

				this.enableKeyboardSupport();
				this._pageWidget = this._pageWidget || engine.getBinding(pageElement, "page");
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLInputElement|HTMLSelectElement} element
			 * @protected
			 * @member ns.widget.tv.Slider
			 */
			prototype._bindEvents = function(element) {
				var container = this._ui.container,
					callbacks = this._callbacks;

				BaseSliderPrototype._bindEvents.call(this, element);

				callbacks.onKeyup = onKeyup.bind(null, this);
				callbacks.onKeydown = onKeydown.bind(null, this);
				callbacks.onFocus = onFocus.bind(null, this);
				callbacks.onBlur = onBlur.bind(null, this);

				this._bindEventKey();

				container.addEventListener("keyup", callbacks.onKeyup, false);
				container.addEventListener("keydown", callbacks.onKeydown, true);
				container.addEventListener("focus", callbacks.onFocus, true);
				container.addEventListener("blur", callbacks.onBlur, true);
			};

			/**
			 * Creates popup element and appends it container passed as argument
			 * @method _createPopup
			 * @return {ns.widget.Popup} reference to new widget instance
			 * @protected
			 * @member ns.widget.tv.Slider
			 * TODO: use TizenSlider when Core Popup is used in mobile profile
			 */
			prototype._createPopup = function () {
				var classes = Slider.classes,
					pageElement,
					popup,
					popupInstance;

				// Create element and append it to slider
				popup = document.createElement("div");
				pageElement = (this._pageWidget && this._pageWidget.element) || document.body;
				pageElement.appendChild(popup);
				// Create widget instance out of popup element
				popupInstance = engine.instanceWidget(popup, "Popup", {
					positionTo: "#" + this._ui.handle.id, // positioned to slider's element
					transition: "none",
					overlay: false,
					arrow: "b,t",
					distance: 10,
					specialContainerClass: classes.uiSliderPopupContainer
				});
				popup.classList.add(classes.uiSliderPopup);

				return popupInstance;
			};

			/**
			 * Updates popup state
			 * @method _updateSlider
			 * @protected
			 * @member ns.widget.tv.Slider
			 * TODO: use TizenSlider when Core Popup is used in mobile profile
			 */
			prototype._updateSlider = function () {
				var self = this,
					newValue,
					element = self.element,
					popupElement;

				// As the options.popup could change
				// it may be required to create popup
				if (self.options.popup){
					if (!self._popup) {
						self._popup = self._createPopup(self._ui.container);
					}

					popupElement = self._popup.element;
				}

				self._ui.handle.removeAttribute("title");

				newValue = parseInt(element.value, 10);

				if (newValue !== self.currentValue) {
					self.currentValue = newValue;

					// Set same value for popup element if it exists
					if (popupElement) {
						// @CHANGED now popup has wrapper and arrow, and value is set in container
						self._popup._ui.container.innerHTML = newValue;
					}

					self._refresh();

					self.trigger("update", newValue);
				} else {
					// If text doesn't change reposition only popup
					// no need to run full refresh
					if (self._popup) {
						self._popup.reposition();
					}
				}
			};

			/**
			 * Destroys widget and removes added content.
			 * @method _destroy
			 * @protected
			 * @member ns.widget.tv.Slider
			 */
			prototype._destroy = function() {
				var ui = this._ui,
					container = ui.container,
					callbacks = this._callbacks;

				this._destroyEventKey();
				container.removeEventListener("keyup", callbacks.onKeyup, false);
				container.removeEventListener("keydown", callbacks.onKeydown, false);
				ui.handle.removeEventListener("focus", callbacks.onFocus, true);
				container.removeEventListener("blur", callbacks.onBlur, true);

				if (typeof BaseSliderPrototype._destroy === FUNCTION_TYPE) {
					BaseSliderPrototype._destroy.call(this);
				}
			};


			// definition
			ns.widget.tv.Slider = Slider;

			engine.defineWidget(
				"TizenSlider",
				"input[type='range'], :not(select)[data-role='slider'], :not(select)[data-type='range']",
				[],
				Slider,
				"tv",
				true
			);
			}(window.document, ns));

/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, white: true, plusplus: true*/
/**
 *#Virtual ListView Widget
 * Shows a list view for large amounts of data.
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
	vlist = tau.widget.VirtualListview(elList, vListConfig);
 *
 * More config options can be found in {@link ns.widget.wearable.VirtualListview#options}
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

			vlist = tau.widget.VirtualListview(elList, {
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
 * @class ns.widget.wearable.VirtualListview
 * @since 2.2
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function(document, ns) {
	
					var BaseWidget = ns.widget.BaseWidget,
						/**
						 * Alias for class {@link ns.engine}
						 * @property {Object} engine
						 * @private
						 * @static
						 * @member ns.widget.wearable.VirtualListview
						 */
						engine = ns.engine,
						// Constants definition
						/**
						 * Defines index of scroll `{@link ns.widget.wearable.VirtualListview#_scroll}.direction`
						 * @property {number} SCROLL_UP
						 * to retrive if user is scrolling up
						 * @private
						 * @static
						 * @member ns.widget.wearable.VirtualListview
						 */
						SCROLL_UP = 0,
						/**
						 * Defines index of scroll `{@link ns.widget.wearable.VirtualListview#_scroll}.direction`
						 * @property {number} SCROLL_RIGHT
						 * to retrive if user is scrolling right
						 * @private
						 * @static
						 * @member ns.widget.wearable.VirtualListview
						 */
						SCROLL_RIGHT = 1,
						/**
						 * Defines index of scroll {@link ns.widget.wearable.VirtualListview#_scroll}
						 * @property {number} SCROLL_DOWN
						 * to retrive if user is scrolling down
						 * @private
						 * @static
						 * @member ns.widget.wearable.VirtualListview
						 */
						SCROLL_DOWN = 2,
						/**
						 * Defines index of scroll {@link ns.widget.wearable.VirtualListview#_scroll}
						 * @property {number} SCROLL_LEFT
						 * to retrive if user is scrolling left
						 * @private
						 * @static
						 * @member ns.widget.wearable.VirtualListview
						 */
						SCROLL_LEFT = 3,
						/**
						 * Defines vertical scrolling orientation. It's default orientation.
						 * @property {string} VERTICAL
						 * @private
						 * @static
						 */
						VERTICAL = "y",
						/**
						 * Defines horizontal scrolling orientation.
						 * @property {string} HORIZONTAL
						 * @private
						 * @static
						 */
						HORIZONTAL = "x",
						/**
						 * Determines that scroll event should not be taken into account if scroll event accurs.
						 * @property {boolean} blockEvent
						 * @private
						 * @static
						 */
						blockEvent = false,
						/**
						 * Handle window timeout ID.
						 * @property {number} timeoutHandler
						 * @private
						 * @static
						 */
						timeoutHandler,
						/**
						 * Reference to original target object from touch event.
						 * @property {Object} origTarget
						 * @private
						 * @static
						 */
						origTarget,
						/**
						 * Number of miliseconds to determine if tap event occured.
						 * @property {number} tapholdThreshold
						 * @private
						 * @static
						 */
						tapholdThreshold = 250,
						/**
						 * Handler for touch event listener to examine tap occurance.
						 * @property {Object} tapHandlerBound
						 * @private
						 * @static
						 */
						tapHandlerBound = null,
						/**
						 * Stores last touch position to examine tap occurance.
						 * @property {Object} lastTouchPos
						 * @private
						 * @static
						 */
						lastTouchPos =	{},

						/**
						 * Local constructor function
						 * @method VirtualListview
						 * @private
						 * @member ns.widget.wearable.VirtualListview
						 */
						VirtualListview = function() {
							var self = this;
							/**
							 * VirtualListview widget's properties associated with
							 * @property {Object} ui
							 * User Interface
							 * @property {?HTMLElement} [ui.scrollview=null] Scroll element
							 * @property {?HTMLElement} [ui.spacer=null] HTML element which makes scrollbar proper size
							 * @property {number} [ui.itemSize=0] Size of list element in pixels. If scrolling is
							 * vertically it's item width in other case it"s height of item element
							 * @member ns.widget.wearable.VirtualListview
							 */
							self.ui = {
								scrollview: null,
								spacer: null,
								itemSize: 0
							};

							/**
							 * Holds information about scrolling state
							 * @property {Object} _scroll
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
							 * @member ns.widget.wearable.VirtualListview
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

							/**
							 * Name of widget
							 * @property {string} name
							 * @member ns.widget.wearable.VirtualListview
							 * @static
							 */
							self.name = "VirtualListview";

							/**
							 * Current zero-based index of data set.
							 * @property {number} _currentIndex
							 * @member ns.widget.wearable.VirtualListview
							 * @protected
							 */
							self._currentIndex = 0;

							/**
							 * VirtualListview widget options.
							 * @property {Object} options
							 * @property {number} [options.bufferSize=100] Number of items of result set. The default value is 100.
							 * As the value gets higher, the loading time increases while the system performance
							 * improves. So you need to pick a value that provides the best performance
							 * without excessive loading time. It's recomended to set bufferSize at least 3 times bigger than number
							 * of visible elements.
							 * @property {number} [options.dataLength=0] Total number of items.
							 * @property {string} [options.orientation="y"] Scrolling orientation. Default vertical scrolling enabled.
							 * @property {Object} options.listItemUpdater Holds reference to method which modifies list item, depended
							 * at specified index from database. **Method should be overridden by developer using
							 * {@link ns.widget.wearable.VirtualListview#setListItemUpdater} method.** or defined as a config
							 * object. Method takes two parameters:
							 *  -  element {HTMLElement} List item to be modified
							 *  -  index {number} Index of data set
							 * @member ns.widget.wearable.VirtualListview
							 */
							self.options = {
								bufferSize: 100,
								dataLength: 0,
								orientation: VERTICAL,
								listItemUpdater: null
							};

							/**
							 * Binding for scroll event listener.
							 * @method _scrollEventBound
							 * @member ns.widget.wearable.VirtualListview
							 * @protected
							 */
							self._scrollEventBound = null;
							/**
							 * Binding for touch start event listener.
							 * @method _touchStartEventBound
							 * @member ns.widget.wearable.VirtualListview
							 * @protected
							 */
							self._touchStartEventBound = null;

							return self;
						},
						POINTER_START = 'vmousedown',
						POINTER_MOVE = 'vmousemove',
						POINTER_END = 'vmouseup',

						// Cached prototype for better minification
						prototype = new BaseWidget();

				/**
				 * Dictionary object containing commonly used wiget classes
				 * @property {Object} classes
				 * @static
				 * @readonly
				 * @member ns.widget.wearable.VirtualListview
				 */
				VirtualListview.classes = {
					uiVirtualListContainer: "ui-virtual-list-container",
					uiListviewActive: "ui-listview-active"
				};

				/**
				 * Remove highlight from items.
				 * @method _removeHighlight
				 * @param {ns.widget.wearable.VirtualListview} self Reference to VirtualListview object.
				 * @member ns.widget.wearable.VirtualListview
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
				 * @param {ns.widget.wearable.VirtualListview} self Reference to VirtualListview object.
				 * @param {Event} event Received Touch event
				 * @member ns.widget.wearable.VirtualListview
				 * @private
				 * @static
				 */
				function _tapHandler (self, event) {
					var changedTouches = event.changedTouches ||
							(event._originalEvent &&
								event._originalEvent.changedTouches),
						eventTouch = (changedTouches && changedTouches.length) ?
							changedTouches[0] :
								event;

					if (event.type === POINTER_MOVE) {
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
				 * @param {ns.widget.wearable.VirtualListview} self Reference to VirtualListview object.
				 * @member ns.widget.wearable.VirtualListview
				 * @private
				 * @static
				 */
				function tapholdListener(self) {
					var liElement;

					liElement = origTarget.tagName === "LI" ? origTarget : origTarget.parentNode;

					origTarget.removeEventListener(POINTER_MOVE, tapHandlerBound, false);
					origTarget.removeEventListener(POINTER_END, tapHandlerBound, false);
					tapHandlerBound = null;

					_removeHighlight(self);
					liElement.classList.add(VirtualListview.classes.uiListviewActive);
					lastTouchPos = {};
				}

				/**
				 * Binds touching events to examine tap event.
				 * @method _touchStartHandler
				 * @param {ns.widget.wearable.VirtualListview} self Reference to VirtualListview object.
				 * @member ns.widget.wearable.VirtualListview
				 * @private
				 * @static
				 */
				function _touchStartHandler (self, event) {
					var eventData;

					origTarget = event.target;

					// Clean up
					window.clearTimeout(timeoutHandler);
					origTarget.removeEventListener(POINTER_MOVE, tapHandlerBound, false);
					origTarget.removeEventListener(POINTER_END, tapHandlerBound, false);

					timeoutHandler = window.setTimeout(tapholdListener.bind(null, self), tapholdThreshold);
					eventData = (event.touches && event.touches.length) ? event.touches[0] : event;
					lastTouchPos.clientX = eventData.clientX;
					lastTouchPos.clientY = eventData.clientY;

					//Add touch listeners
					tapHandlerBound = _tapHandler.bind(null, self);
					origTarget.addEventListener(POINTER_MOVE, tapHandlerBound, false);
					origTarget.addEventListener(POINTER_END, tapHandlerBound, false);

				}


				/**
				 * Updates scroll information about position, direction and jump size.
				 * @method _updateScrollInfo
				 * @param {ns.widget.wearable.VirtualListview} self VirtualListview widget reference
				 * @member ns.widget.wearable.VirtualListview
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
				 * @member ns.widget.wearable.VirtualListview
				 * @private
				 * @static
				 */
				function _computeElementSize(element, orientation) {
					// @TODO change to util method if it will work perfectly
					return parseInt(orientation === VERTICAL ? element.clientHeight : element.clientWidth, 10) + 1;
				}

				/**
				 * Scrolls and manipulates DOM element to destination index. Element at destination
				 * index is the first visible element on the screen. Destination index can
				 * be different from Virtual List's current index, because current index points
				 * to first element in the buffer.
				 * @member ns.widget.wearable.VirtualListview
				 * @param {ns.widget.wearable.VirtualListview} self VirtualListview widget reference
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
						index,
						isLastBuffer = false;

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
						isLastBuffer = true;
					}
					indexCorrection = toIndex - index;

					self._loadData(index);
					blockEvent = true;
					offset = index * avgListItemSize;
					if (options.orientation === VERTICAL) {
						if (isLastBuffer) {
							offset = self.ui.spacer.clientHeight;
						}
						element.style.top = offset + "px";
					} else {
						if (isLastBuffer) {
							offset = self.ui.spacer.clientWidth;
						}
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
				 * @param {ns.widget.wearable.VirtualListview} self VirtualListview widget reference
				 * @member ns.widget.wearable.VirtualListview
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
						direction,
						newPosition;

					childrenNodes = element.children;
					for (i = childrenNodes.length - 1; i > 0; i -= 1) {
						if (options.orientation === VERTICAL) {
							resultsetSize += childrenNodes[i].clientHeight;
						} else {
							resultsetSize += childrenNodes[i].clientWidth;
						}
					}

					//Compute average list item size
					avgListItemSize = _computeElementSize(element, options.orientation) / bufferSize;

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
							if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
								direction = 1;
							}

							if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_LEFT]) {
								direction = -1;
							}

							// Load data to buffer according to jumped index
							self._loadData(currentIndex + direction * bufferToLoad * bufferSize);

							// Refresh current index after buffer jump
							currentIndex = self._currentIndex;

							jump += direction * bufferToLoad * bufferSize * avgListItemSize;
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

							if (currentIndex >= (dataLength - 1)) {
								newPosition = self.ui.spacer.clientHeight;
							}

							elementStyle.top = newPosition + "px";
						}

						if (scrollDirection[SCROLL_LEFT] || scrollDirection[SCROLL_RIGHT]) {
							newPosition = elementPositionLeft + jump;

							if (newPosition < 0 || currentIndex <= 0) {
								newPosition = 0;
							}

							if (currentIndex >= (dataLength - 1)) {
								newPosition = self.ui.spacer.clientWidth;
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
				 * @param {ns.widget.wearable.VirtualListview} self VirtualListview widget reference
				 * @member ns.widget.wearable.VirtualListview
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
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 */
				prototype._updateListItem = function (element, index) {
					this.options.listItemUpdater(element, index);
				};

				/**
				 * Build widget structure
				 * @method _build
				 * @param {HTMLElement} element Widget's element
				 * @return {HTMLElement} Element on which built is widget
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 */
				prototype._build = function(element) {
					var classes = VirtualListview.classes;

					element.classList.add(classes.uiVirtualListContainer);
					return element;
				};


				/**
				 * Initialize widget on an element.
				 * @method _init
				 * @param {HTMLElement} element Widget's element
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
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
						spacerStyle.float = "left";
						scrollviewStyle.overflowX = "scroll";
						scrollviewStyle.overflowY = "hidden";
					} else {
						scrollviewStyle.overflowX = "hidden";
						scrollviewStyle.overflowY = "scroll";
					}

					if (options.dataLength < options.bufferSize) {
						options.bufferSize = options.dataLength;
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
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
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
							listItem.style.float = "left";
						}

						this._updateListItem(listItem, i);
						documentFragment.appendChild(listItem);
						listItem.addEventListener(POINTER_START, touchStartEventBound, false);
					}

					list.appendChild(documentFragment);
					this._touchStartEventBound = touchStartEventBound;
					this._refresh();
				};

				/**
				 * Refresh list
				 * @method _refresh
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 */
				prototype._refresh = function() {
					//Set default value of variable create
					this._refreshScrollbar();
				};

				/**
				 * Loads data from specified index to result set.
				 * @method _loadData
				 * @param {number} index Index of first row
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 */
				prototype._loadData = function(index) {
					var self = this,
						children = self.element.firstElementChild;

					if (self._currentIndex !== index) {
						self._currentIndex = index;
						do {
							self._updateListItem(children, index);
							++index;
							children = children.nextElementSibling;
						} while (children);
					}
				};

				/**
				 * Sets proper scrollbar size: height (vertical), width (horizontal)
				 * @method _refreshScrollbar
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
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
						spacerStyle.height = (bufferSizePx / options.bufferSize * options.dataLength - bufferSizePx) + "px";
					} else {
						//Note: element.clientWidth is variable
						bufferSizePx = parseFloat(element.clientWidth) || 0;
						spacerStyle.width = (bufferSizePx / options.bufferSize * (options.dataLength - 1) - 4 / 3 * bufferSizePx) + "px";
					}
				};

				/**
				 * Binds VirtualListview events
				 * @method _bindEvents
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
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
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
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
						listItem.removeEventListener(POINTER_START, self._touchStartEventBound, false);
						element.removeChild(listItem);
					}

				};

				/**
				 * This method scrolls list to defined position in pixels.
				 * @method scrollTo
				 * @param {number} position Scroll position expressed in pixels.
				 * @member ns.widget.wearable.VirtualListview
				 */
				prototype.scrollTo = function(position) {
					this.ui.scrollview.scrollTop = position;
				};

				/**
				 * This method scrolls list to defined index.
				 * @method scrollToIndex
				 * @param {number} index Scroll Destination index.
				 * @member ns.widget.wearable.VirtualListview
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
				 * This method builds widget and trigger event "draw".
				 * @method draw
				 * @member ns.widget.wearable.VirtualListview
				 */
				prototype.draw = function() {
					this._buildList();
					this.trigger("draw");
				};

				/**
				 * This method sets list item updater function.
				 * To learn how to create list item updater function please
				 * visit Virtual List User Guide.
				 * @method setListItemUpdater
				 * @param {Object} updateFunction Function reference.
				 * @member ns.widget.wearable.VirtualListview
				 */
				prototype.setListItemUpdater = function(updateFunction) {
					this.options.listItemUpdater = updateFunction;
				};

				// Assign prototype
				VirtualListview.prototype = prototype;

				// definition
				ns.widget.wearable.VirtualListview = VirtualListview;

				engine.defineWidget(
						"VirtualListview",
						"",
						["draw", "setListItemUpdater", "scrollTo", "scrollToIndex"],
						VirtualListview,
						"wearable"
						);
				}(window.document, ns));

/*global window, define */
/*jslint nomen: true, plusplus: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #VirtualGrid Widget
 * Widget creates special grid which can contain big number of items.
 *
 * @class ns.widget.wearable.VirtualGrid
 * @since 2.3
 * @extends ns.widget.wearable.VirtualListview
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	
				/**
			 * Alias for {@link ns.widget.wearable.VirtualListview}
			 * @property {Object} VirtualList
			 * @member ns.widget.wearable.VirtualGrid
			 * @private
			 * @static
			 */
			var VirtualList = ns.widget.wearable.VirtualListview,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias for class {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				DOM = ns.util.DOM,
				/**
				 * Constans for horizontal virtual grid
				 * @property {string} HORIZONTAL="x"
				 * @private
				 * @member ns.widget.wearable.VirtualGrid
				 * @static
				 */
				HORIZONTAL = "x",
				/**
				 * Constans for vertical virtual grid
				 * @property {string} VERTICAL="y"
				 * @private
				 * @member ns.widget.wearable.VirtualGrid
				 * @static
				 */
				VERTICAL = "y",
				/**
				 * Alias for class VirtualGrid
				 * @method VirtualGrid
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				VirtualGrid = function () {
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {number} [options.bufferSize=100] Element count in buffer
					 * @property {number} [options.dataLength=0] Element count in list
					 * @property {"x"|"y"} [options.orientation="y"] Orientation : horizontal ("x"), vertical ("y")
					 * @member ns.widget.wearable.VirtualGrid
					 */
					this.options = {
						bufferSize: 100,
						dataLength: 0,
						orientation: VERTICAL,
						/**
						 * Method which modifies list item, depended at specified index from database.
						 * @method options.listItemUpdater
						 * @param {HTMLElement} element List item to be modified.
						 * @param {number} index Index of data set.
						 * @member ns.widget.wearable.VirtualGrid
						 */
						listItemUpdater: function () {
							return null;
						}
					};
					return this;
				},

				prototype = new VirtualList(),
				/**
				 * Alias for VirtualList prototype
				 * @property {Object} VirtualListPrototype
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				VirtualListPrototype = VirtualList.prototype,
				/**
				 * Alias for {@link ns.widget.wearable.VirtualListview#draw VirtualList.draw}
				 * @method parent_draw
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				parent_draw = VirtualListPrototype.draw,
				/**
				 * Alias for {@link ns.widget.wearable.VirtualListview#_refreshScrollbar VirtualList.\_refreshScrollbar}
				 * @method parent_refreshScrollbar
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				parent_refreshScrollbar = VirtualListPrototype._refreshScrollbar;

			/**
			 * This method draws item.
			 * @method draw
			 * @member ns.widget.wearable.VirtualGrid
			 */
			prototype.draw = function () {
				var self = this,
					element = self.element,
					ui = self.ui,
					newDiv = null,
					newDivStyle = null;

				if (self.options.orientation === HORIZONTAL) {
					newDiv = document.createElement("div");
					newDivStyle = newDiv.style;
					element.parentNode.appendChild(newDiv);
					newDiv.appendChild(element);
					newDiv.appendChild(ui.spacer);
					newDivStyle.width = "10000px";
					newDivStyle.height = "100%";
					ui.container = newDiv;
				}
				self._initListItem();
				parent_draw.call(self);
			};

			/**
			 * Sets proper scrollbar size: width (horizontal)
			 * @method _refreshScrollbar
			 * @protected
			 * @member ns.widget.wearable.VirtualGrid
			 */
			prototype._refreshScrollbar = function () {
				var width = 0,
					ui = this.ui;
				parent_refreshScrollbar.call(this);
				if (ui.container) {
					width = this.element.clientWidth + ui.spacer.clientWidth;
					ui.container.style.width = width + "px";
				}
			};

			/**
			 * Initializes list item
			 * @method _initListItem
			 * @protected
			 * @member ns.widget.wearable.VirtualGrid
			 */
			prototype._initListItem = function () {
				var self = this,
					thisElement = self.element,
					element = document.createElement("div"),
					rowElement = document.createElement("div"),
					elementStyle = element.style,
					orientation = self.options.orientation,
					thisElementStyle = thisElement.style,
					rowElementStyle = rowElement.style;

				elementStyle.overflow = "hidden";
				rowElement.style.overflow = "hidden";
				thisElement.appendChild(rowElement);
				rowElement.appendChild(element);
				self.options.listItemUpdater(element, 0);

				if (orientation === VERTICAL) {
					thisElementStyle.overflowY = "auto";
					thisElementStyle.overflowX = "hidden";
					rowElementStyle.overflow = "hidden";
					element.style.float = "left";
					self._cellSize = DOM.getElementWidth(element);
					self._columnsCount = Math.floor(DOM.getElementWidth(thisElement) / self._cellSize);
				} else {
					thisElementStyle.overflowX = "auto";
					thisElementStyle.overflowY = "hidden";
					rowElementStyle.overflow = "hidden";
					rowElementStyle.float = "left";
					thisElementStyle.height = "100%";
					rowElementStyle.height = "100%";
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
			 * @member ns.widget.wearable.VirtualGrid
			 */
			prototype._updateListItem = function (element, index) {
				var elementI,
					i,
					count,
					elementStyle = element.style,
					options = this.options,
					elementIStyle,
					size;
				element.innerHTML = "";
				elementStyle.overflow = "hidden";
				elementStyle.position = "relative";
				if (options.orientation === HORIZONTAL) {
					elementStyle.height = "100%";
				}
				count = this._columnsCount;
				size = (100 / count);
				for (i = 0; i < count; i++) {
					elementI = document.createElement("div");
					elementIStyle = elementI.style;
					elementIStyle.overflow = "hidden";

					if (options.orientation === VERTICAL) {
						elementI.style.float = "left";
						elementI.style.width = size + "%";
					} else {
						elementI.style.height = size + "%";
					}

					if (count * index + i < options.originalDataLength) {
						this.options.listItemUpdater(elementI, count * index + i);
					}
					element.appendChild(elementI);
				}
			};

			VirtualGrid.prototype = prototype;

			ns.widget.wearable.VirtualGrid = VirtualGrid;

			engine.defineWidget(
				"VirtualGrid",
				".ui-virtualgrid",
				[],
				VirtualGrid
			);

			}(window, window.document, ns));

/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # PageContainer Widget
 * PageContainer is a widget, which is supposed to have multiple child pages but display only one at a time.
 *
 * It allows for adding new pages, switching between them and displaying progress bars indicating loading process.
 *
 * @class ns.widget.wearable.PageContainer
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Krzysztof Głodowski <k.glodowski@samsung.com>
 */
(function (document, ns) {
	
				var BaseWidget = ns.widget.BaseWidget,
				Page = ns.widget.wearable.Page,
				util = ns.util,
				eventUtils = ns.event,
				DOM = util.DOM,
				engine = ns.engine,
				classes = {
					uiViewportTransitioning: "ui-viewport-transitioning",
					out: "out",
					in: "in",
					uiPreIn: "ui-pre-in",
					uiBuild: "ui-page-build"
				},
				PageContainer = function () {
					/**
					 * Active page.
					 * @property {ns.widget.wearable.Page} [activePage]
					 * @member ns.widget.wearable.PageContainer
					 */
					this.activePage = null;
				},
				EventType = {
					/**
					 * Triggered after the changePage() request
					 * has finished loading the page into the DOM and
					 * all page transition animations have completed.
					 * @event pagechange
					 * @member ns.widget.wearable.PageContainer
					 */
					PAGE_CHANGE: "pagechange"
				},
				animationend = "animationend",
				webkitAnimationEnd = "webkitAnimationEnd",
				prototype = new BaseWidget();

			/**
			 * Dictionary for PageContainer related event types.
			 * @property {Object} events
			 * @property {string} [events.PAGE_CHANGE="pagechange"]
			 * @member ns.router.route.popup
			 * @static
			 */
			PageContainer.events = EventType;

			/**
			 * Dictionary for PageContainer related css class names
			 * @property {Object} classes
			 * @member ns.widget.wearable.Page
			 * @static
			 * @readonly
			 */
			PageContainer.classes = classes;

			/**
			 * This method changes active page to specified element.
			 * @method change
			 * @param {HTMLElement} toPage The element to set
			 * @param {Object} [options] Additional options for the transition
			 * @param {string} [options.transition=none] Specifies the type of transition
			 * @param {boolean} [options.reverse=false] Specifies the direction of transition
			 * @member ns.widget.wearable.PageContainer
			 */
			prototype.change = function (toPage, options) {
				var self = this,
					fromPageWidget = self.getActivePage(),
					toPageWidget;

				options = options || {};

				// The change should be made only if no active page exists
				// or active page is changed to another one.
				if (!fromPageWidget || (fromPageWidget.element !== toPage)) {
					if (toPage.parentNode !== self.element) {
						toPage = self._include(toPage);
					}

					toPage.classList.add(classes.uiBuild);

					toPageWidget = engine.instanceWidget(toPage, "page");

					// set sizes of page for correct display
					toPageWidget.layout();

					if (ns.getConfig("autoBuildOnPageChange", false)) {
						engine.createWidgets(toPage);
					}

					if (fromPageWidget) {
						fromPageWidget.onBeforeHide();
					}
					toPageWidget.onBeforeShow();

					toPage.classList.remove(classes.uiBuild);

					options.deferred = {
						resolve: function () {
							if (fromPageWidget) {
								fromPageWidget.onHide();
								self._removeExternalPage(fromPageWidget, options);
							}
							toPageWidget.onShow();
							self.trigger(EventType.PAGE_CHANGE);
						}
					};
					self._transition(toPageWidget, fromPageWidget, options);
				}
			};

			/**
			 * This method performs transition between the old and a new page.
			 * @method _transition
			 * @param {ns.widget.wearable.Page} toPageWidget The new page
			 * @param {ns.widget.wearable.Page} fromPageWidget The page to be replaced
			 * @param {Object} [options] Additional options for the transition
			 * @param {string} [options.transition=none] The type of transition
			 * @param {boolean} [options.reverse=false] Specifies transition direction
			 * @param {Object} [options.deferred] Deferred object
			 * @member ns.widget.wearable.PageContainer
			 * @protected
			 */
			prototype._transition = function (toPageWidget, fromPageWidget, options) {
				var self = this,
					element = self.element,
					elementClassList = element.classList,
					transition = !fromPageWidget || !options.transition ? "none" : options.transition,
					deferred = options.deferred,
					reverse = "reverse",
					clearClasses = [classes.in, classes.out, classes.uiPreIn, transition],
					oldDeferredResolve,
					classlist,
					classParam,
					oneEvent;

				if (options.reverse) {
					clearClasses.push(reverse);
				}
				elementClassList.add(classes.uiViewportTransitioning);
				oldDeferredResolve = deferred.resolve;
				deferred.resolve = function () {
					var fromPageWidgetClassList = fromPageWidget && fromPageWidget.element.classList,
						toPageWidgetClassList = toPageWidget.element.classList;
					elementClassList.remove(classes.uiViewportTransitioning);
					toPageWidgetClassList.remove.apply(toPageWidgetClassList, clearClasses);
					if (fromPageWidgetClassList) {
						fromPageWidgetClassList.remove.apply(fromPageWidgetClassList, clearClasses);
					}
					self._setActivePage(toPageWidget);
					oldDeferredResolve();
				};

				if (transition !== "none") {
					oneEvent = function () {
						eventUtils.off(toPageWidget.element, [animationend, webkitAnimationEnd], oneEvent, false);
						deferred.resolve();
					};
					eventUtils.one(toPageWidget.element, [animationend, webkitAnimationEnd], oneEvent, false);

					if (fromPageWidget) {
						classParam = [];
						classParam.push(transition, classes.out);
						if (options.reverse) {
							classParam.push(reverse);
						}
						classlist = fromPageWidget.element.classList;
						classlist.add.apply(classlist ,classParam);
					}

					classlist = toPageWidget.element.classList;
					classParam = [];
					classParam.push(transition, classes.in, classes.uiPreIn);
					if (options.reverse) {
						classParam.push(reverse);
					}
					classlist.add.apply(classlist, classParam);
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
			};
			/**
			 * This method adds an element as a page.
			 * @method _include
			 * @param {HTMLElement} page an element to add
			 * @member ns.widget.wearable.PageContainer
			 * @return {HTMLElement}
			 * @protected
			 */
			prototype._include = function (page) {
				var element = this.element;
				if (page.parentNode !== element) {
					page = util.importEvaluateAndAppendElement(page, element);
				}
				return page;
			};
			/**
			 * This method sets currently active page.
			 * @method _setActivePage
			 * @param {ns.widget.wearable.Page} page a widget to set as the active page
			 * @member ns.widget.wearable.PageContainer
			 * @protected
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
			 * This method returns active page widget.
			 * @method getActivePage
			 * @member ns.widget.wearable.PageContainer
			 * @return {ns.widget.wearable.Page} Currently active page
			 */
			prototype.getActivePage = function () {
				return this.activePage;
			};

			/**
			 * This method displays a progress bar indicating loading process.
			 * @method showLoading
			 * @member ns.widget.wearable.PageContainer
			 * @return {null}
			 */
			prototype.showLoading = function () {
								return null;
			};
			/**
			 * This method hides any active progress bar.
			 * @method hideLoading
			 * @member ns.widget.wearable.PageContainer
			 * @return {null}
			 */
			prototype.hideLoading = function () {
								return null;
			};
			/**
			 * This method removes page element from the given widget and destroys it.
			 * @method _removeExternalPage
			 * @param {ns.widget.wearable.Page} fromPageWidget the widget to destroy
			 * @param {Object} [options] transition options
			 * @param {boolean} [options.reverse=false] specifies transition direction
			 * @member ns.widget.wearable.PageContainer
			 * @protected
			 */
			prototype._removeExternalPage = function ( fromPageWidget, options) {
				var fromPage = fromPageWidget.element;
				options = options || {};
				if (options.reverse && DOM.hasNSData(fromPage, "external")) {
					fromPageWidget.destroy();
					if (fromPage.parentNode) {
						fromPage.parentNode.removeChild(fromPage);
					}
				}
			};

			PageContainer.prototype = prototype;

			// definition
			ns.widget.wearable.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"",
				["change", "getActivePage", "showLoading", "hideLoading"],
				PageContainer,
				"wearable"
			);
			}(window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # PageContainer Widget
 * PageContainer is a widget, which is supposed to have multiple child pages but display only one at a time.
 *
 * It allows for adding new pages, switching between them and displaying progress bars indicating loading process.
 *
 * @class ns.widget.tv.PageContainer
 * @extends ns.widget.wearable.PageContainer
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	
				var WearablePageContainer = ns.widget.wearable.PageContainer,
				WearablePageContainerPrototype = WearablePageContainer.prototype,
				PageContainer = function () {
				},
				engine = ns.engine,
				prototype = new WearablePageContainer();

			PageContainer.events = WearablePageContainer.events;

			prototype._build = function ( element ) {
				var optionsBackground = this.options.background;
				if (WearablePageContainerPrototype._build) {
					element = WearablePageContainerPrototype._build(element);
				}

				if (optionsBackground) {
					element.style.background = "url(" + optionsBackground + ") no-repeat center center";
				}

				return element;
			};

			prototype._configure = function ( ) {
				var options = this.options || {};
				options.background = null;
				this.options = options;
			};

			PageContainer.prototype = prototype;

			// definition
			ns.widget.tv.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"body",
				["change", "getActivePage", "showLoading", "hideLoading"],
				PageContainer,
				"tv",
				true
			);
			}(window.document, ns));

/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Drawer Widget
 * Drawer widget provide creating drawer widget and managing drawer operation.
 *
 * ##Default selector
 * You can make the drawer widget as data-role="drawer" with DIV tag.
 *
 * ###  HTML Examples
 *
 * ####  Create drawer using data-role
 *
 * 		@example
 *		<div data-role="drawer" data-position="left" id="leftdrawer">
 *			<ul data-role="listview">
 *				<li class="ui-drawer-main-list"><a href="#">List item 1</a></li>
 *				<li class="ui-drawer-main-list"><a href="#">List item 2</a></li>
 *				<li class="ui-drawer-sub-list"><a href="#">Sub item 1</a></li>
 *			</ul>
 *		</div>
 *
 * ##Drawer positioning
 * You can declare to drawer position manually. (Default is left)
 *
 * If you implement data-position attributes value is 'left', drawer appear from left side.
 *
 * 		@example
 *		<div data-role="drawer" data-position="left" id="leftdrawer">
 *
 * - "left" - drawer appear from left side
 * - "right" - drawer appear from right side
 *
 * ##Drawer inner list
 * Drawer has two list styles, main list style and sub list style.
 * You can implement two providing list styles as implement classes.
 *
 * - "ui-drawer-main-list" : Main list style of drawer
 * - "ui-drawer-sub-list" : Sub list style of drawer
 *
 * ##Drawer methods
 *
 * You can use some methods of drawer widget.
 *
 * - "open" - drawer open
 *
 * 		@example
 * 		$("#leftdrawer").drawer("open");
 *
 * - "close" - drawer close
 *
 * 		@example
 * 		$("#leftdrawer").drawer("isOpen");
 *
 * - "isOpen" - get drawer status, true is opened and false if closed
 *
 * 		@example
 * 		$("#leftdrawer").drawer"(isOpen");
 *
 * ##Drawer Options
 *
 * - position: drawer appeared position. Type is <String> and default is "left".
 * - width: drawer width. Type is <Integer> and default is 290.
 * - duration: drawer appreared duration. <Integer> and default is 100.
 *
 *

 * @class ns.widget.core.Drawer
 * @extends ns.widget.mobile.BaseWidgetMobile
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	
				var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				selectors = ns.util.selectors,
				Drawer = function () {
					var self = this;
					self.options = {
						position : "left",
						width : 240,
						duration : 100,
						closeOnClick: true,
						overlay: true
					};

					self._onOverlayClickBound = null;
					self._onTransitionEndBound = null;
					self._onResizeBound = null;
					self._onPageshowBound = null;

					self._pageSelector = null;

					self._isOpen = false;

					self._ui = {};

					self._drawerOverlay = null;
				},
				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.core.Drawer
				 */
				classes = {
					drawer : "ui-drawer",
					header : "ui-drawer-header",
					left : "ui-drawer-left",
					right : "ui-drawer-right",
					overlay : "ui-drawer-overlay",
					open : "ui-drawer-open",
					close : "ui-drawer-close"
				},
				prototype = new BaseWidget();

			Drawer.prototype = prototype;
			Drawer.classes = classes;

			/**
			 * Click event handler
			 * @method onClick
			 * @private
			 * @static
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 */
			function onClick(self) {
				// vclick event handler
				if (self._isOpen) {
					self.close();
				}
			}

			/**
			 * webkitTransitionEnd event handler
			 * @method onTransitionEnd
			 * @private
			 * @static
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 */
			function onTransitionEnd(self) {
				var drawerOverlay = self._drawerOverlay;
				// webkitTransitionEnd event handler
				if (!self._isOpen) {
					// not open -> transition -> open
					self._isOpen = true;
				} else {
					// open -> transition -> close
					self._isOpen = false;
					if (drawerOverlay) {
						drawerOverlay.style.visibility = "hidden";
					}
				}
			}

			/**
			 * Resize event handler
			 * @method onResize
			 * @private
			 * @static
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 */
			function onResize(self) {
				// resize event handler
				self._refresh();
			}

			/**
			 * Pageshow event handler
			 * @method onPageshow
			 * @private
			 * @static
			 * @param {ns.widget.core.Drawer} self
			 * @member ns.widget.core.Drawer
			 */
			function onPageshow(self) {
				self._refresh();
			}

			/**
			 * Drawer translate function
			 * @method translate
			 * @protected
			 * @param {number} x
			 * @param {number} duration
			 * @member ns.widget.core.Drawer
			 */
			prototype._translate = function (x, duration) {
				var element = this.element,
					elementStyle = element.style,
					transition = "none";

				if (duration) {
					transition =  "-webkit-transform " + duration / 1000 + "s ease-out";
				}

				elementStyle.webkitTransform = "translate3d(" + x + "px, 0px, 0px)";
				elementStyle.webkitTransition = transition;
			};

			/**
			 * Build structure of Drawer widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._build = function (element) {
				var self = this,
					headerElement;
				element.classList.add(classes.drawer);
				self._drawerPage = selectors.getClosestByClass(element, this._pageSelector);
				self._drawerPage.style.overflow = "hidden";

				headerElement = element.nextElementSibling;
				while (headerElement) {
					if (headerElement.classList.contains("ui-header")) {
						break;
					}
					headerElement = headerElement.nextElementSibling;
				}

				if (headerElement) {
					headerElement.classList.add(classes.header);
				}

				self._headerElement = headerElement;

				if (self.options.overlay) {
					self._createOverlay(element);
					self._drawerOverlay.style.visibility = "hidden";
				}

				return element;
			};

			/**
			 * Init of Drawer widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._init = function (element) {
				var self = this,
					options = self.options;

				if (options.position === "right") {
					element.classList.add(classes.right);
					self._translate(window.innerWidth, 0);
				} else {
					// left or default
					element.classList.add(classes.left);
					self._translate(-options.width, 0);
				}
			};

			/**
			 * Do translate if position is set to right
			 * @method _translateRight
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._translateRight = function() {
				var self = this,
					options = self.options;
				if (options.position === "right") {
					// If drawer position is right, drawer should be moved right side
					if (self._isOpen) {
						// drawer opened
						self._translate(window.innerWidth - options.width, 0);
					} else {
						// drawer closed
						self._translate(window.innerWidth, 0);
					}
				}
			};

			/**
			 * Refresh of Drawer widget
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._refresh = function() {
				// Drawer layout has been set by parent element layout
				var self = this,
					options = self.options,
					drawerElementParent = self.element.parentNode,
					drawerHeight = drawerElementParent.clientHeight,
					drawerStyle = self.element.style,
					drawerOverlay = self._drawerOverlay,
					overlayStyle = drawerOverlay && drawerOverlay.style;

				drawerStyle.width = options.width + "px";
				drawerStyle.height = drawerHeight + "px";

				if (overlayStyle) {
					overlayStyle.width = window.innerWidth + "px";
					overlayStyle.height = drawerHeight + "px";
				}

				self._translateRight();
			};

			/**
			 * Create drawer overlay element
			 * @method _createOverlay
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._createOverlay = function(element) {
				var self = this,
					overlayElement = document.createElement("div");

				overlayElement.classList.add(classes.overlay);
				element.parentNode.insertBefore(overlayElement, element);
				self._drawerOverlay = overlayElement;
			};

			/**
			 * Bind events of Drawer widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._bindEvents = function() {
				var self = this,
					options = self.options,
					drawerOverlay = self._drawerOverlay;
				self._onClickBound = onClick.bind(null, self);
				self._onTransitionEndBound = onTransitionEnd.bind(null, self);
				self._onResizeBound = onResize.bind(null, self);
				self._onPageshowBound = onPageshow.bind(null, self);

				if (options.overlay && options.closeOnClick && drawerOverlay) {
					drawerOverlay.addEventListener("vclick", self._onClickBound, false);
				}
				self.element.addEventListener("webkitTransitionEnd", self._onTransitionEndBound, false);
				self.element.addEventListener("transitionEnd", self._onTransitionEndBound, false);
				window.addEventListener("resize", self._onResizeBound, false);
				self._drawerPage.addEventListener("pageshow", self._onPageshowBound, false);
			};

			/**
			 * check drawer status
			 * @method isOpen
			 * @member ns.widget.core.Drawer
			 */
			prototype.isOpen = function() {
				return this._isOpen;
			};

			/**
			 * Open drawer widget
			 * @method open
			 * @member ns.widget.core.Drawer
			 */
			prototype.open = function() {
				var self = this,
					options = self.options,
					drawerClassList = self.element.classList,
					drawerOverlay = self._drawerOverlay;
				if (drawerOverlay) {
					drawerOverlay.style.visibility = "visible";
				}
				drawerClassList.remove(classes.close);
				drawerClassList.add(classes.open);
				if (options.position === "left") {
					self._translate(0, options.duration);
				} else {
					self._translate(window.innerWidth - options.width, options.duration);
				}
			};

			/**
			 * Close drawer widget
			 * @method close
			 * @member ns.widget.core.Drawer
			 */
			prototype.close = function() {
				var self = this,
					options = self.options,
					drawerClassList = self.element.classList;
				drawerClassList.remove(classes.open);
				drawerClassList.add(classes.close);
				if (options.position === "left") {
					self._translate(-options.width, options.duration);
				} else {
					self._translate(window.innerWidth, options.duration);
				}
			};

			/**
			 * Destroy drawer widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._destroy = function() {
				var self = this,
					drawerOverlay = self._drawerOverlay;
				if (drawerOverlay) {
					drawerOverlay.removeEventListener("vclick", self._onClickBound, false);
				}
				self.element.removeEventListener("webkitTransitionEnd", self._onTransitionEndBound, false);
				window.removeEventListener("resize", self._onResizeBound, false);
				self._drawerPage.removeEventListener("pageshow", self._onPageshowBound, false);
			};

			ns.widget.core.Drawer = Drawer;


			}(window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Drawer Widget
 * Drawer widget provides creating drawer widget and managing drawer operations.
 *
 * @class ns.widget.tv.Drawer
 * @extends ns.widget.core.Drawer
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	
				var CoreDrawer = ns.widget.core.Drawer,
				CoreDrawerPrototype = CoreDrawer.prototype,
				Page = ns.widget.wearable.Page,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				engine = ns.engine,
				Drawer = function () {
					var self = this;
					CoreDrawer.call(self);
					BaseKeyboardSupport.call(self);
					self._pageSelector = Page.classes.uiPage;
				},
				prototype = new CoreDrawer(),
				classes = CoreDrawer.classes,
				WIDE_SIZE = 937,
				NARROW_SIZE = 301,
				MAX_WIDTH = 1920;

			//fill classes
			classes.uiBlock = "ui-block";
			classes.uiDynamicBoxActive = "ui-dynamic-box-active";
			Drawer.prototype = prototype;
			Drawer.classes = classes;

			prototype.open = function() {
				var self = this;
				CoreDrawerPrototype.open.call(self);
				self._supportKeyboard = true;
				self._pageWidget._supportKeyboard = false;
			};

			prototype.close = function() {
				var self = this;
				CoreDrawerPrototype.close.call(self);
				self._supportKeyboard = false;
				self._pageWidget._supportKeyboard = true;
			};

			prototype._openActiveElement = function(element) {
				var self = this,
					id = element.href,
					ui = self._ui,
					dynamicListElement;
				if (element.parentElement.classList.contains(classes.uiBlock)) {
					if (ui.currentDynamic) {
						ui.currentDynamic.classList.remove(classes.uiDynamicBoxActive);
					}
					if (id) {
						dynamicListElement = document.getElementById(id.split("#")[1]);
					}
					if (dynamicListElement) {
						self.option("width", WIDE_SIZE);
						ui.currentDynamic = dynamicListElement;
						dynamicListElement.classList.add(classes.uiDynamicBoxActive);
					} else {
						self.option("width", NARROW_SIZE);
					}
				}
			};

			/**
			 * Refresh of Drawer widget
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._refresh = function() {
				// Drawer layout has been set by parent element layout
				var self = this,
					options = self.options,
					windowWidth = window.innerWidth,
					headerHeight = self._headerElement && self._headerElement.offsetHeight,
					drawerStyle = self.element.style,
					overlayStyle = self._drawerOverlay && self._drawerOverlay.style;

				drawerStyle.width = options.width * windowWidth/MAX_WIDTH + "px";
				drawerStyle.top = headerHeight || 0 + "px";

				if (overlayStyle) {
					overlayStyle.width = windowWidth + "px";
					overlayStyle.top = headerHeight + "px";
				}

				self._translateRight();
			};

			prototype._init = function(element) {
				CoreDrawerPrototype._init.call(this, element);
				this._pageWidget = engine.instanceWidget(element.parentElement, "page");
			};

			prototype._bindEvents = function() {
				CoreDrawerPrototype._bindEvents.call(this);
				this._bindEventKey();
			};

			prototype._destroy = function() {
				this._destroyEventKey();
				CoreDrawerPrototype._destroy.call(this);
			};

			ns.widget.tv.Drawer = Drawer;
			engine.defineWidget(
				"Drawer",
				"[data-role='drawer'], ui-drawer",
				[
					"open",
					"close",
					"isOpen"
				],
				Drawer,
				"tv",
				true
			);

			}(window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Router
 * Namespace for routers
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @class ns.router
 */
(function (ns) {
	
				ns.router = ns.router || {};
			}(ns));

/*global window, define, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Route Namespace
 * Object contains rules for router.
 *
 * @class ns.router.route
 */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (ns) {
	
				ns.router.route = ns.router.route || {};
			}(ns));

/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #History
 * Object controls history changes.
 *
 * @class ns.router.history
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	
				var historyVolatileMode,
				object = ns.util.object,
				historyUid = 0,
				historyActiveIndex = 0,
				windowHistory = window.history,
				history = {
					/**
					 * Property contains active state in history.
					 * @property {Object} activeState
					 * @static
					 * @member ns.router.history
					 */
					activeState : null,

					/**
					 * This method replaces or pushes state to history.
					 * @method replace
					 * @param {Object} state The state object
					 * @param {string} stateTitle The title of state
					 * @param {string} url The new history entry's URL
					 * @static
					 * @member ns.router.history
					 */
					replace: function (state, stateTitle, url) {
						var newState = object.merge({}, state, {
								uid: historyVolatileMode ? historyActiveIndex : ++historyUid,
								stateUrl: url,
								stateTitle: stateTitle
							});
						windowHistory[historyVolatileMode ? "replaceState" : "pushState"](newState, stateTitle, url);
						history.setActive(newState);
					},

					/**
					 * This method moves backward through history.
					 * @method back
					 * @static
					 * @member ns.router.history
					 */
					back: function () {
						windowHistory.back();
					},

					/**
					 * This method sets active state.
					 * @method setActive
					 * @param {Object} state Activated state
					 * @static
					 * @member ns.router.history
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
					 * This method returns "back" if state is in history or "forward" if it is new state.
					 * @method getDirection
					 * @param {Object} state Checked state
					 * @return {"back"|"forward"}
					 * @static
					 * @member ns.router.history
					 */
					getDirection: function (state) {
						if (state) {
							return state.uid < historyActiveIndex ? "back" : "forward";
						}
						return "back";
					},

					/**
					 * This method sets volatile mode to true.
					 * @method enableVolatileRecord
					 * @static
					 * @member ns.router.history
					 */
					enableVolatileRecord: function () {
						historyVolatileMode = true;
					},

					/**
					 * This method sets volatile mode to false.
					 * @method disableVolatileMode
					 * @static
					 * @member ns.router.history
					 */
					disableVolatileMode: function () {
						historyVolatileMode = false;
					}
				};
			ns.router.history = history;
			}(window, ns));

/*global window, define, RegExp */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Path Utility
 * Object helps work with paths.
 * @class ns.util.path
 * @static
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	
					/**
				* Local alias for ns.engine
				* @property {Object} engine Alias for {@link ns.engine}
				* @member ns.util.path
				* @static
				* @private
				*/
			var engine = ns.engine,
				/**
				* Local alias for ns.util.object
				* @property {Object} utilsObject Alias for {@link ns.util.object}
				* @member ns.util.path
				* @static
				* @private
				*/
				utilsObject = ns.util.object,
				/**
				* Local alias for ns.util.selectors
				* @property {Object} utilsSelectors Alias for {@link ns.util.selectors}
				* @member ns.util.path
				* @static
				* @private
				*/
				utilsSelectors = ns.util.selectors,
				/**
				* Local alias for ns.util.DOM
				* @property {Object} utilsDOM Alias for {@link ns.util.DOM}
				* @member ns.util.path
				* @static
				* @private
				*/
				utilsDOM = ns.util.DOM,
				/**
				* Cache for document base element
				* @member ns.util.path
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
				 * @member ns.util.path
				 */
				location = {},
				path = {
					/**
					 * href part for mark state
					 * @property {string} [uiStateKey="&ui-state"]
					 * @static
					 * @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					 * @method isAbsoluteUrl
					 * @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					 * @method addHashSearchParams
					 * @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
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
					 * @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
					* @param {string} hash
					* @return {boolean}
					*/
					isPreservableHash: function (hash) {
						return hash.replace("#", "").indexOf(this.uiStateKey) === 0;
					},

					/**
					* Escape weird characters in the hash if it is to be used as a selector
					* @method hashToSelector
					* @member ns.util.path
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
					* @member ns.util.path
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
					* @member ns.util.path
					* @param {Object} docUrl
					* @param {string} reqUrl
					* @return {boolean}
					* @static
					*/
					isPermittedCrossDomainRequest: function (docUrl, reqUrl) {
						return ns.getConfig('allowCrossDomainPages', false) &&
							docUrl.protocol === "file:" &&
							reqUrl.search(/^https?:/) !== -1;
					},

					/**
					* Convert a object data to URI parameters
					* @method getAsURIParameters
					* @member ns.util.path
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
					* @member ns.util.path
					* @property {string|null} documentUrl
					*/
					documentUrl: null,

					/**
					* The document base differs
					* @member ns.util.path
					* @property {boolean} documentBaseDiffers
					*/
					documentBaseDiffers: false,

					/**
					* Set location hash to path
					* @method set
					* @member ns.util.path
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
					* @member ns.util.path
					* @param {string} path
					* @param {string} dialogHashKey
					* @return {string}
					* @static
					*/
					getFilePath: function (path, dialogHashKey) {
						var splitkey = '&' + ns.getConfig('subPageUrlKey', '');
						return path && path.split(splitkey)[0].split(dialogHashKey)[0];
					},

					/**
					* Remove the preceding hash, any query params, and dialog notations
					* @method cleanHash
					* @member ns.util.path
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
					* @member ns.util.path
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
			* @member ns.util.path
			* @property {Object} documentBase uri structure
			* @static
			*/
			path.documentBase = base ? path.parseUrl(path.makeUrlAbsolute(base.getAttribute("href"), path.documentUrl.href)) : path.documentUrl;

			path.documentBaseDiffers = (path.documentUrl.hrefNoHash !== path.documentBase.hrefNoHash);

			/**
			* Get document base
			* @method getDocumentBase
			* @member ns.util.path
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
			* @member ns.util.path
			* @param {HTMLElement} element
			* @param {string} selector
			* @return {string}
			* @static
			*/
			path.getClosestBaseUrl = function (element, selector) {
				// Find the closest page and extract out its url.
				var url = utilsDOM.getNSData(utilsSelectors.getClosestBySelector(element, selector), "url"),
					baseUrl = path.documentBase.hrefNoHash;

				if (!ns.getConfig('dynamicBaseEnabled', true) || !url || !path.isPath(url)) {
					url = baseUrl;
				}

				return path.makeUrlAbsolute(url, baseUrl);
			};

			ns.util.path = path;
			}(window, window.document, ns));

/*global window, define, XMLHttpRequest */
/*jslint nomen: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Router
 * Main class to navigate between pages and popups in profile Wearable.
 *
 * @class ns.router.Router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns) {
	
					/**
				 * Local alias for ns.util
				 * @property {Object} util Alias for {@link ns.util}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
			var util = ns.util,
				/**
				 * Local alias for ns.event
				 * @property {Object} eventUtils Alias for {@link ns.event}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				eventUtils = ns.event,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				DOM = util.DOM,
				/**
				 * Local alias for ns.util.path
				 * @property {Object} path Alias for {@link ns.util.path}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				path = util.path,
				/**
				 * Local alias for ns.util.selectors
				 * @property {Object} selectors Alias for {@link ns.util.selectors}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				selectors = util.selectors,
				/**
				 * Local alias for ns.util.object
				 * @property {Object} object Alias for {@link ns.util.object}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				object = util.object,
				/**
				 * Local alias for ns.engine
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Local alias for ns.router.wearable
				 * @property {Object} routerMicro Alias for namespace ns.router.wearable
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				routerMicro = ns.router,
				/**
				 * Local alias for ns.wearable.selectors
				 * @property {Object} microSelectors Alias for {@link ns.wearable.selectors}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				microSelectors = ns.wearable.selectors,
				/**
				 * Local alias for ns.router.wearable.history
				 * @property {Object} history Alias for {@link ns.router.wearable.history}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				history = routerMicro.history,
				/**
				 * Local alias for ns.router.wearable.route
				 * @property {Object} route Alias for namespace ns.router.wearable.route
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				route = routerMicro.route,
				/**
				 * Local alias for document body element
				 * @property {HTMLElement} body
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				body = document.body,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @member ns.router.Router
				 * @private
				 * @static
				 */
				slice = [].slice,

				/**
				 * Router locking flag
				 * @property {boolean} [_isLock]
				 * @member ns.router.Router
				 * @private
				 */
				_isLock = false,

				Router = function () {
					var self = this;

					/**
					 * Element of the page opened as first.
					 * @property {?HTMLElement} [firstPage]
					 * @member ns.router.Router
					 */
					self.firstPage = null;
					/**
					 * The container of widget.
					 * @property {?ns.widget.wearable.PageContainer} [container]
					 * @member ns.router.Router
					 */
					self.container = null;
					/**
					 * Settings for last open method
					 * @property {Object} [settings]
					 * @member ns.router.Router
					 */
					self.settings = {};
				};

			/**
			 * Default values for router
			 * @property {Object} defaults
			 * @property {boolean} [defaults.fromHashChange = false] Sets if will be changed after hashchange.
			 * @property {boolean} [defaults.reverse = false] Sets the direction of change.
			 * @property {boolean} [defaults.showLoadMsg = true] Sets if message will be shown during loading.
			 * @property {number} [defaults.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @property {boolean} [defaults.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @member ns.router.Router
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
			 * @member ns.router.Router
			 */
			function findClosestLink(element) {
				while (element) {
					if (element.nodeType === Node.ELEMENT_NODE && element.nodeName && element.nodeName === "A") {
						break;
					}
					element = element.parentNode;
				}
				return element;
			}

			/**
			 * Handle event link click
			 * @method linkClickHandler
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.router.Router
			 */
			function linkClickHandler(router, event) {
				var link = findClosestLink(event.target),
					href,
					useDefaultUrlHandling,
					options;

				if (link && event.which === 1) {
					href = link.getAttribute("href");
					useDefaultUrlHandling = (link.getAttribute("rel") === "external") || link.hasAttribute("target");
					if (!useDefaultUrlHandling) {
						options = DOM.getData(link);
						options.link = link.id;
						router.open(href, options, event);
						eventUtils.preventDefault(event);
					}
				}
			}

			/**
			 * Handle event for pop state
			 * @method popStateHandler
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.router.Router
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

				if (_isLock) {
					history.disableVolatileMode();
					history.replace(prevState, prevState.stateTitle, prevState.stateUrl);
					return;
				}

				if (state) {
					to = state.url;
					reverse = history.getDirection(state) === "back";
					transition = reverse ? ((prevState && prevState.transition) || "none") : state.transition;
					options = object.merge({}, state, {
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
			 * Change page to page given in parameter "to".
			 * @method open
			 * @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			 * @param {Object} [options]
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @member ns.router.Router
			 */
			Router.prototype.open = function (to, options, event) {
				var rel = ((options && options.rel) || "page"),
					rule = route[rel],
					deferred = {},
					filter,
					self = this;

				if (_isLock) {
					return;
				}

				if (rel === "back") {
					history.back();
					return;
				}

				if (rule) {
					options = object.merge(
						{
							rel: rel
						},
						this.defaults,
						rule.option(),
						options
					);
					filter = rule.filter;
					deferred.resolve = function (options, content) {
						rule.open(content, options, event);
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
			 * Method initializes page container and builds the first page if flag autoInitializePage is set.
			 * @method init
			 * @param {boolean} justBuild
			 * @member ns.router.Router
			 */
			Router.prototype.init = function (justBuild) {
				var page,
					containerElement,
					container,
					firstPage,
					pages,
					activePages,
					location = window.location,
					self = this;

				body = document.body;
				containerElement = ns.getConfig("pageContainer") || body;
				pages = slice.call(containerElement.querySelectorAll(microSelectors.page));
				self.justBuild = justBuild;

				if (ns.getConfig("autoInitializePage", true)) {
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
						container = engine.instanceWidget(containerElement, "pagecontainer");
						if (firstPage) {
							self.register(container, firstPage);
						}
						return;
					}

					if (location.hash) {
						//simple check to determine if we should show firstPage or other
						page = document.getElementById(location.hash.replace("#", ""));
						if (page && selectors.matchesSelector(page, microSelectors.page)) {
							firstPage = page;
						}
					}
				}

				pages.forEach(function (page) {
					if (!DOM.getNSData(page, "url")) {
						DOM.setNSData(page, "url", page.id || location.pathname + location.search);
					}
				});

				container = engine.instanceWidget(containerElement, "pagecontainer");
				self.register(container, firstPage);
			};

			/**
			 * Method removes all events listners set by router.
			 * @method destroy
			 * @member ns.router.Router
			 */
			Router.prototype.destroy = function () {
				var self = this;
				window.removeEventListener("popstate", self.popStateHandler, false);
				if (body) {
					body.removeEventListener("pagebeforechange", this.pagebeforechangeHandler, false);
					body.removeEventListener("vclick", self.linkClickHandler, false);
				}
			};

			/**
			 * Method sets container.
			 * @method setContainer
			 * @param {ns.widget.wearable.PageContainer} container
			 * @member ns.router.Router
			 */
			Router.prototype.setContainer = function (container) {
				this.container = container;
			};

			/**
			 * Method returns container.
			 * @method getContainer
			 * @return {ns.widget.wearable.PageContainer} container of widget
			 * @member ns.router.Router
			 */
			Router.prototype.getContainer = function () {
				return this.container;
			};

			/**
			 * Method returns ths first page.
			 * @method getFirstPage
			 * @return {HTMLElement} the first page
			 * @member ns.router.Router
			 */
			Router.prototype.getFirstPage = function () {
				return this.firstPage;
			};

			/**
			 * Method registers page container and the first page.
			 * @method register
			 * @param {ns.widget.wearable.PageContainer} container
			 * @param {HTMLElement} firstPage
			 * @member ns.router.Router
			 */
			Router.prototype.register = function (container, firstPage) {
				var self = this;
				self.container = container;
				self.firstPage = firstPage;

				self.linkClickHandler = linkClickHandler.bind(null, self);
				self.popStateHandler = popStateHandler.bind(null, self);

				document.addEventListener("vclick", self.linkClickHandler, false);
				window.addEventListener("popstate", self.popStateHandler, false);

				history.enableVolatileRecord();
				if (firstPage) {
					self.open(firstPage, { transition: "none" });
				}
			};

			/**
			 * Method opens popup.
			 * @method openPopup
			 * @param {HTMLElement|string} to Id or HTMLElement of popup.
			 * @param {Object} [options]
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @member ns.router.Router
			 */
			Router.prototype.openPopup = function (to, options) {
				this.open(to, object.fastMerge({rel: "popup"}, options));
			};

			/**
			 * Method closes popup.
			 * @method closePopup
			 * @param {Object} options
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext= in ui-pre-in] options.ext
			 * @member ns.router.Router
			 */
			Router.prototype.closePopup = function (options) {
				var popupRoute = this.getRoute("popup");

				if (popupRoute) {
					popupRoute.close(null, options);
				}
			};

			Router.prototype.lock = function () {
				_isLock = true;
			};

			Router.prototype.unlock = function () {
				_isLock = false;
			};

			/**
			 * Load content from url
			 * @method _loadUrl
			 * @param {string} url
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @param {string} [options.absUrl] Absolute Url for content used by deferred object.
			 * @param {Object} rule
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @param {Function} deferred.resolve
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadUrl = function (url, options, rule, deferred) {
				var absUrl = path.makeUrlAbsolute(url, path.getLocation()),
					content,
					request,
					detail = {},
					self = this;

				content = rule.find(absUrl);

				if (!content && path.isEmbedded(absUrl)) {
					deferred.reject(detail);
					return;
				}
				// If the content we are interested in is already in the DOM,
				// and the caller did not indicate that we should force a
				// reload of the file, we are done. Resolve the deferrred so that
				// users can bind to .done on the promise
				if (content) {
					detail = object.fastMerge({absUrl: absUrl}, options);
					deferred.resolve(detail, content);
					return;
				}

				if (options.showLoadMsg) {
					self._showLoading(options.loadMsgDelay);
				}

				// Load the new content.
				request = new XMLHttpRequest();
				request.responseType = "document";
				request.overrideMimeType("text/html");
				request.open("GET", absUrl);
				request.addEventListener("error", self._loadError.bind(self, absUrl, options, deferred));
				request.addEventListener("load", function (event) {
					var request = event.target;
					if (request.readyState === 4) {
						if (request.status === 200 || (request.status === 0 && request.responseXML)) {
							self._loadSuccess(absUrl, options, rule, deferred, request.responseXML);
						} else {
							self._loadError(absUrl, options, deferred);
						}
					}
				});
				request.send();
			};

			/**
			 * Error handler for loading content by AJAX
			 * @method _loadError
			 * @param {string} absUrl
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @param {string} [options.absUrl] Absolute Url for content used by deferred object.
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadError = function (absUrl, options, deferred) {
				var detail = object.fastMerge({url: absUrl}, options),
					self = this;
				// Remove loading message.
				if (options.showLoadMsg) {
					self._showError(absUrl);
				}

				eventUtils.trigger(self.container.element, "loadfailed", detail);
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
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @param {string} [options.absUrl] Absolute Url for content used by deferred object.
			 * @param {Object} rule
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @param {Function} deferred.resolve
			 * @param {string} html
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadSuccess = function (absUrl, options, rule, deferred, html) {
				var detail = object.fastMerge({url: absUrl}, options),
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
			 * @member ns.router.Router
			 * @return {HTMLElement} the first page
			 * @protected
			 */
			Router.prototype._getInitialContent = function () {
				return this.firstPage;
			};

			/**
			 * Show the loading indicator
			 * @method _showLoading
			 * @param {number} delay
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._showLoading = function (delay) {
				this.container.showLoading(delay);
			};

			/**
			 * Report an error loading
			 * @method _showError
			 * @param {string} absUrl
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._showError = function (absUrl) {
				ns.error("load error, file: ", absUrl);
			};

			/**
			 * Hide the loading indicator
			 * @method _hideLoading
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._hideLoading = function () {
				this.container.hideLoading();
			};

			/**
			 * Returns true if popup is active.
			 * @method hasActivePopup
			 * @return {boolean}
			 * @member ns.router.Router
			 */
			Router.prototype.hasActivePopup = function () {
				var popup = this.getRoute("popup");
				return popup && popup.hasActive();
			};

			/**
			 * This function returns proper route.
			 * @method getRoute
			 * @param {string} Type of route
			 * @return {?ns.router.route.interface}
			 * @member ns.router.Router
			 */
			Router.prototype.getRoute = function (type) {
				return route[type];
			};

			routerMicro.Router = Router;

			engine.initRouter(Router);
			}(window, window.document, ns));

/*global window, define */
/*jslint nomen: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Route Page
 * Support class for router to control changing pages in profile Wearable.
 * @class ns.router.route.page
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	
				var util = ns.util,
				path = util.path,
				DOM = util.DOM,
				object = util.object,
				utilSelector = util.selectors,
				history = ns.router.history,
				engine = ns.engine,
				baseElement,
				slice = [].slice,
				routePage = {},
				head;

			/**
			 * Tries to find a page element matching id and filter (selector).
			 * Adds data url attribute to found page, sets page = null when nothing found
			 * @method findPageAndSetDataUrl
			 * @param {string} id Id of searching element
			 * @param {string} filter Query selector for searching page
			 * @return {?HTMLElement}
			 * @private
			 * @static
			 * @member ns.router.route.page
			 */
			function findPageAndSetDataUrl(id, filter) {
				var page = document.getElementById(id);

				if (page && utilSelector.matchesSelector(page, filter)) {
					DOM.setNSData(page, "url", id);
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
			 * @property {string} defaults.transition="none"
			 * @static
			 * @member ns.router.route.page
			 */
			routePage.defaults = {
				transition: "none"
			};

			/**
			 * Property defining selector for filtering only page elements
			 * @property {string} filter
			 * @member ns.router.route.page
			 * @inheritdoc ns.wearable.selectors#page
			 * @static
			 */
			routePage.filter = ns.wearable.selectors.page;

			/**
			 * Returns default route options used inside Router.
			 * @method option
			 * @static
			 * @member ns.router.route.page
			 * @return {Object} default route options
			 */
			routePage.option = function () {
				var defaults = object.merge({}, routePage.defaults);
				defaults.transition = ns.getConfig('pageTransition', defaults.transition);
				return defaults;
			};

			/**
			 * This method changes page. It sets history and opens page passed as a parameter.
			 * @method open
			 * @param {HTMLElement|string} toPage The page which will be opened.
			 * @param {Object} [options]
			 * @param {boolean} [options.fromHashChange] Sets if call was made on hash change.
			 * @param {string} [options.dataUrl] Sets if page has url attribute.
			 * @member ns.router.route.page
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
						url = path.makeUrlAbsolute("#" + url, path.documentUrl.hrefNoHash);
					}

					state = object.merge(
						{},
						options,
						{
							url: url
						}
					);

					history.replace(state, pageTitle, url);
				}

				// write base element
				this._setBase(url);

				//set page title
				document.title = pageTitle;
				router.container.change(toPage, options);
			};

			/**
			 * This method determines target page to open.
			 * @method find
			 * @param {string} absUrl Absolute path to opened page
			 * @member ns.router.route.page
			 * @return {?HTMLElement} Element of page to open.
			 */
			routePage.find = function (absUrl) {
				var self = this,
					router = engine.getRouter(),
					dataUrl = self._createDataUrl(absUrl),
					initialContent = router.getFirstPage(),
					pageContainer = router.getContainer(),
					page,
					selector = "[data-url='" + dataUrl + "']",
					filterRegexp = /,/gm;

				if (/#/.test(absUrl) && path.isPath(dataUrl)) {
					return null;
				}

				// Check to see if the page already exists in the DOM.
				// NOTE do _not_ use the :jqmData pseudo selector because parenthesis
				//      are a valid url char and it breaks on the first occurence
				// prepare selector for new page
				selector += self.filter.replace(filterRegexp, ",[data-url='" + dataUrl + "']");
				page = pageContainer.element.querySelector(selector);

				// If we failed to find the page, check to see if the url is a
				// reference to an embedded page. If so, it may have been dynamically
				// injected by a developer, in which case it would be lacking a
				// data-url attribute and in need of enhancement.
				if (!page && dataUrl && !path.isPath(dataUrl)) {
					page = findPageAndSetDataUrl(dataUrl, self.filter);
				}

				// If we failed to find a page in the DOM, check the URL to see if it
				// refers to the first page in the application. Also check to make sure
				// our cached-first-page is actually in the DOM. Some user deployed
				// apps are pruning the first page from the DOM for various reasons.
				// We check for this case here because we don't want a first-page with
				// an id falling through to the non-existent embedded page error case.
				if (!page &&
						path.isFirstPageUrl(dataUrl) &&
						initialContent &&
						initialContent.parentNode) {
					page = initialContent;
				}

				return page;
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * Fetched external scripts if required.
			 * Sets document base to parsed document absolute path.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed page
			 * @member ns.router.route.page
			 * @return {?HTMLElement} Element of page in parsed document.
			 */
			routePage.parse = function (html, absUrl) {
				var self = this,
					page,
					dataUrl = self._createDataUrl(absUrl);

				// write base element
				// @TODO shouldn't base be set if a page was found?
				self._setBase(absUrl);

				// Finding matching page inside created element
				page = html.querySelector(self.filter);

				// If a page exists...
				if (page) {
					// TODO tagging a page with external to make sure that embedded pages aren't
					// removed by the various page handling code is bad. Having page handling code
					// in many places is bad. Solutions post 1.0
					DOM.setNSData(page, "url", dataUrl);
					DOM.setNSData(page, "external", true);
				}
				return page;
			};

			/**
			 * This method handles hash change, **currently does nothing**.
			 * @method onHashChange
			 * @static
			 * @member ns.router.route.page
			 * @return {null}
			 */
			routePage.onHashChange = function (/* url, options */) {
				return null;
			};

			/**
			 * This method creates data url from absolute url given as argument.
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @protected
			 * @static
			 * @member ns.router.route.page
			 * @return {string}
			 */
			routePage._createDataUrl = function (absoluteUrl) {
				return path.convertUrlToDataUrl(absoluteUrl, true);
			};

			/**
			 * On open fail, currently never used
			 * @method onOpenFailed
			 * @member ns.router.route.page
			 */
			routePage.onOpenFailed = function (/* options */) {
				this._setBase(path.parseLocation().hrefNoSearch);
			};

			/**
			 * This method returns base element from document head.
			 * If no base element is found, one is created based on current location.
			 * @method _getBaseElement
			 * @protected
			 * @static
			 * @member ns.router.route.page
			 * @return {HTMLElement}
			 */
			routePage._getBaseElement = function () {
				// Fetch document head if never cached before
				if (!head) {
					head = document.querySelector("head");
				}
				// Find base element
				if (!baseElement) {
					baseElement = document.querySelector("base");
					if (!baseElement) {
						baseElement = document.createElement("base");
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
			 * @member ns.router.route.page
			 */
			routePage._setBase = function (url) {
				var base = this._getBaseElement(),
					baseHref = base.href;

				if (path.isPath(url)) {
					url = path.makeUrlAbsolute(url, path.documentBase);
					if (path.parseUrl(baseHref).hrefNoSearch !== path.parseUrl(url).hrefNoSearch) {
						base.href = url;
						path.documentBase = path.parseUrl(path.makeUrlAbsolute(url, path.documentUrl.href));
					}
				}
			};

			ns.router.route.page = routePage;

			}(window.document, ns));

/*global window, define */
/*jslint nomen: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Route Popup
 * Support class for router to control changing pupups in profile Wearable.
 * @class ns.router.route.popup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (window, document, ns) {
	
				var
			/**
			 * @property {Object} Popup Alias for {@link ns.widget.Popup}
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			Popup = ns.widget.core.Popup,

			routePopup = {
				/**
				 * Object with default options
				 * @property {Object} defaults
				 * @property {string} [defaults.transition='none'] Sets the animation used during change of popup.
				 * @property {?HTMLElement} [defaults.container=null] Sets container of element.
				 * @property {boolean} [defaults.volatileRecord=true] Sets if the current history entry will be modified or a new one will be created.
				 * @member ns.router.route.popup
				 * @static
				 */
				defaults: {
					transition: 'none',
					container: null,
					volatileRecord: true
				},
				/**
				 * Popup Element Selector
				 * @property {string} filter
				 * @member ns.router.route.popup
				 * @static
				 */
				filter: "." + Popup.classes.popup,
				/**
				 * Storage variable for active popup
				 * @property {?HTMLElement} activePopup
				 * @member ns.router.route.popup
				 * @static
				 */
				activePopup: null,
				/**
				 * Dictionary for popup related event types
				 * @property {Object} events
				 * @property {string} [events.POPUP_HIDE='popuphide']
				 * @member ns.router.route.popup
				 * @static
				 */
				events: {
					POPUP_HIDE: "popuphide"
				}
			},
			/**
			 * Alias for {@link ns.engine}
			 * @property {Object} engine
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			engine = ns.engine,
			/**
			 * Alias for {@link ns.util.path}
			 * @property {Object} path
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			path = ns.util.path,
			/**
			 * Alias for {@link ns.util.selectors}
			 * @property {Object} utilSelector
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			utilSelector = ns.util.selectors,
			/**
			 * Alias for {@link ns.router.history}
			 * @property {Object} history
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			history = ns.router.history,
			/**
			 * Alias for {@link ns.util.DOM}
			 * @property {Object} DOM
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			DOM = ns.util.DOM,
			/**
			 * Alias for array slice method
			 * @method slice
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			slice = [].slice,
			/**
			 * Alias for Object utils
			 * @method slice
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			object = ns.util.object,
			/**
			 * Popup's hash added to url
			 * @property {string} popupHashKey
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			popupHashKey = "popup=true",
			/**
			 * Regexp for popup's hash
			 * @property {RegExp} popupHashKeyReg
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			popupHashKeyReg = /([&|\?]popup=true)/;

			/**
			 * Tries to find a popup element matching id and filter (selector).
			 * Adds data url attribute to found page, sets page = null when nothing found.
			 * @method findPopupAndSetDataUrl
			 * @param {string} id
			 * @param {string} filter
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
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
			 * This method returns default options for popup router.
			 * @method option
			 * @return {Object}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.option = function () {
				var defaults = object.merge({}, routePopup.defaults);
				defaults.transition = ns.getConfig('popupTransition', defaults.transition);
				return defaults;
			};

			/**
			 * This method sets active popup and manages history.
			 * @method setActive
			 * @param {?ns.widget.wearable.popup} activePopup
			 * @param {Object} options
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.setActive = function (activePopup, options) {
				var url,
					pathLocation = path.getLocation(),
					documentUrl = pathLocation.replace(popupHashKeyReg, "");

				this.activePopup = activePopup;

				if (activePopup) {
					// If popup is being opened, the new state is added to history.
					if (options && !options.fromHashChange && options.history) {
						url = path.addHashSearchParams(documentUrl, popupHashKey);
						history.replace(options, "", url);
					}
				} else if (pathLocation !== documentUrl) {
					// If popup is being closed, the history.back() is called
					// but only if url has special hash.
					// Url is changed after opening animation and in some cases,
					// the popup is closed before this animation and then the history.back
					// could cause undesirable change of page.
					history.back();
				}
			};

			/**
			 * This method opens popup if no other popup is opened.
			 * It also changes history to show that popup is opened.
			 * If there is already active popup, it will be closed.
			 * @method open
			 * @param {HTMLElement|string} toPopup
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = 'popup'] Represents kind of link as 'page' or 'popup' or 'external' for linking to another domain.
			 * @param {string} [options.transition = 'none'] Sets the animation used during change of popup.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {string} [options.container = null] Selector for container.
			 * @param {boolean} [options.volatileRecord=true] Sets if the current history entry will be modified or a new one will be created.
			 * @param {Event} event
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.open = function (toPopup, options, event) {
				var popup,
					router = engine.getRouter(),
					events = routePopup.events,
					removePopup = function () {
						document.removeEventListener(events.POPUP_HIDE, removePopup, false);
						toPopup.parentNode.removeChild(toPopup);
						routePopup.activePopup = null;
					},
					openPopup = function () {
						var positionTo = options["position-to"];
						// add such option only if it exists
						if (positionTo) {
							options.positionTo = positionTo;
						}
						if (event && event.touches) {
							options.x = event.touches[0].clientX;
							options.y = event.touches[0].clientY;
						} else if (event){
							options.x = event.clientX;
							options.y = event.clientY;
						}

						document.removeEventListener(events.POPUP_HIDE, openPopup, false);
						popup = engine.instanceWidget(toPopup, 'Popup', options);
						popup.open(options);
						routePopup.activePopup = popup;
					},
					activePage = router.container.getActivePage(),
					container;

				if (DOM.getNSData(toPopup, "external") === true) {
					container = options.container ? activePage.element.querySelector(options.container) : activePage.element;
					container.appendChild(toPopup);
					document.addEventListener(routePopup.events.POPUP_HIDE, removePopup, false);
				}

				if (routePopup.hasActive()) {
					document.addEventListener(routePopup.events.POPUP_HIDE, openPopup, false);
					routePopup.close();
				} else {
					openPopup();
				}
			};

			/**
			 * This method closes active popup.
			 * @method close
			 * @param {ns.widget.wearable.Popup} [activePopup]
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext= in ui-pre-in] options.ext
			 * @param {Object} options
			 * @member ns.router.route.popup
			 * @protected
			 * @static
			 */
			routePopup.close = function (activePopup, options) {
				activePopup = activePopup || this.activePopup;

				if (activePopup) {
					// Close and clean up
					activePopup.close(options || {});
				}
			};

			/**
			 * This method handles hash change.
			 * It closes active popup.
			 * @method onHashChange
			 * @param {string} url
			 * @param {object} options
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.onHashChange = function (url, options) {
				var activePopup = this.activePopup;

				if (activePopup) {
					routePopup.close(activePopup, options);
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
			 * @member ns.router.route.popup
			 * @return {null}
			 * @static
			 */
			routePopup.onOpenFailed = function (/* options */) {
				return null;
			};

			/**
			 * This method finds popup by data-url.
			 * @method find
			 * @param {string} absUrl Absolute path to opened popup
			 * @return {HTMLElement} Element of popup
			 * @member ns.router.route.popup
			 */
			routePopup.find = function (absUrl) {
				var self = this,
					dataUrl = self._createDataUrl(absUrl),
					activePage = engine.getRouter().getContainer().getActivePage(),
					popup;

				popup = activePage.element.querySelector("[data-url='" + dataUrl + "']" + self.filter);

				if (!popup && dataUrl && !path.isPath(dataUrl)) {
					popup = findPopupAndSetDataUrl(dataUrl, self.filter);
				}

				return popup;
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * Fetched external scripts if required.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed popup
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
			 */
			routePopup.parse = function (html, absUrl) {
				var self = this,
					popup,
					dataUrl = self._createDataUrl(absUrl);

				popup = html.querySelector(self.filter);

				if (popup) {
					// TODO tagging a popup with external to make sure that embedded popups aren't
					// removed by the various popup handling code is bad. Having popup handling code
					// in many places is bad. Solutions post 1.0
					DOM.setNSData(popup, "url", dataUrl);
					DOM.setNSData(popup, "external", true);
				}

				return popup;
			};

			/**
			 * Convert url to data-url
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @return {string}
			 * @member ns.router.route.popup
			 * @protected
			 * @static
			 */
			routePopup._createDataUrl = function (absoluteUrl) {
				return path.convertUrlToDataUrl(absoluteUrl);
			};

			/**
			 * Return true if active popup exists.
			 * @method hasActive
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.hasActive = function () {
				return !!this.activePopup;
			};

			/**
			 * Returns active popup.
			 * @method getActive
			 * @return {?ns.widget.wearable.Popup}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.getActive = function () {
				return this.activePopup;
			};

			ns.router.route.popup = routePopup;

			}(window, window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Route popup
 * Support class for router to control changing pupups in profile Wearable.
 *
 * @class ns.router.tv.route.popup
 * @extend ns.router.route.popup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (window, document, ns) {
	
				var routePopup = ns.router.route.popup,
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				DOM = ns.util.DOM;


			/**
			 * This method opens popup if no other popup is opened.
			 * It also changes history to show that popup is opened.
			 * If there is already active popup, it will be closed.
			 * @method open
			 * @param {HTMLElement|string} toPopup
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = 'popup'] Represents kind of link as 'page' or 'popup' or 'external' for linking to another domain.
			 * @param {string} [options.transition = 'none'] Sets the animation used during change of popup.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {string} [options.container = null] Selector for container.
			 * @param {boolean} [options.volatileRecord=true] Sets if the current history entry will be modified or a new one will be created.
			 * @param {Event} event
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.open = function (toPopup, options, event) {
				var popup,
					router = engine.getRouter(),
					events = routePopup.events,
					removePopup = function () {
						document.removeEventListener(events.POPUP_HIDE, removePopup, false);
						toPopup.parentNode.removeChild(toPopup);
						routePopup.activePopup = null;
					},
					openPopup = function () {
						var positionTo = options["position-to"];
						// add such option only if it exists
						if (positionTo) {
							options.positionTo = positionTo;
						}
						if (event && event.touches) {
							options.x = event.touches[0].clientX;
							options.y = event.touches[0].clientY;
						} else if (event){
							options.x = event.clientX;
							options.y = event.clientY;
						}

						document.removeEventListener(events.POPUP_HIDE, openPopup, false);
						popup = engine.instanceWidget(toPopup, "popup", options);
						popup.open(options);
						routePopup.activePopup = popup;
					},
					activePage = router.container.getActivePage(),
					container;

				if (DOM.getNSData(toPopup, "external") === true) {
					container = options.container ? activePage.element.querySelector(options.container) : activePage.element;
					container.appendChild(toPopup);
					document.addEventListener(routePopup.events.POPUP_HIDE, removePopup, false);
				}

				if (routePopup.hasActive()) {
					document.addEventListener(routePopup.events.POPUP_HIDE, openPopup, false);
					routePopup.close();
				} else {
					openPopup();
				}
			};

			ns.router.route.popup = routePopup;

			}(window, window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Route dynamic
 * Route for loading dynamic content in page.
 *
 * @class ns.router.route.dynamic
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document, ns) {
	
				var routeDynamic = {
					/**
					 * @property {Object} defaults Object with default options
					 * @property {string} [defaults.transition='none']
					 * @property {?HTMLElement} [defaults.container=null]
					 * @property {boolean} [defaults.volatileRecord=true]
					 * @member ns.router.route.popup
					 * @static
					 */
					defaults: {
						transition: "none",
						container: null,
						volatileRecord: true
					},
					/**
					 * @property {string} filter Alias for {@link ns.wearable.selectors#popup}
					 * @member ns.router.route.popup
					 * @static
					 */
					filter: ".ui-dynamic-box",
					/**
					 * @property {Object} events Dictionary for popup related event types
					 * @property {string} [events.POPUP_HIDE='popuphide']
					 * @member ns.router.route.popup
					 * @static
					 */
					events: {
						POPUP_HIDE: "popuphide"
					}
				},
				/**
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} path Alias for {@link ns.util.path}
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				path = ns.util.path,
				/**
				 * @property {Object} utilSelector Alias for {@link ns.util.selectors}
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				utilSelector = ns.util.selectors,
				/**
				 * @property {Object} DOM Alias for {@link ns.util.DOM}
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				DOM = ns.util.DOM,
				/**
				 * @method slice Alias for array slice method
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				slice = [].slice;

			/**
			 * Tries to find a popup element matching id and filter (selector).
			 * Adds data url attribute to found page, sets page = null when nothing found
			 * @method findPopupAndSetDataUrl
			 * @param {string} id
			 * @param {string} filter
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			function findPopupAndSetDataUrl(id, filter) {
				var popup = document.getElementById(path.hashToSelector(id));

				if (popup && utilSelector.matchesSelector(popup, filter)) {
					DOM.setNSData(popup, "url", id);
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
			 * @member ns.router.route.popup
			 * @static
			 */
			routeDynamic.option = function () {
				return routeDynamic.defaults;
			};

			/**
			 * Change page
			 * @method open
			 * @param {HTMLElement|string} toPopup
			 * @param {Object} options
			 * @member ns.router.route.popup
			 * @static
			 */
			routeDynamic.open = function (toDynamic) {
				var activeDynamic = document.querySelector(".ui-dynamic-box-active");
				if (activeDynamic) {
					activeDynamic.classList.remove("ui-dynamic-box-active");
				}
				toDynamic.classList.add("ui-dynamic-box-active");
			};


			/**
			 * Close active popup
			 * @method onHashChange
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @static
			 */
			routeDynamic.onHashChange = function () {
				var activePopup = routeDynamic.activePopup;

				if (activePopup) {
					routeDynamic._closeActivePopup(activePopup);
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
			 * @member ns.router.route.popup
			 * @return {null}
			 * @static
			 */
			routeDynamic.onOpenFailed = function(/* options */) {
				return null;
			};

			/**
			 * Find popup by data-url
			 * @method find
			 * @param {string} absUrl
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
			 * @static
			 */
			routeDynamic.find = function( absUrl ) {
				var self = this,
					dataUrl = self._createDataUrl( absUrl ),
					activePage = engine.getRouter().getContainer().getActivePage(),
					popup;

				popup = activePage.element.querySelector("[data-url='" + dataUrl + "']" + self.filter);

				if ( !popup && dataUrl && !path.isPath( dataUrl ) ) {
					popup = findPopupAndSetDataUrl(dataUrl, self.filter);
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
			 * @member ns.router.route.popup
			 * @static
			 */
			routeDynamic.parse = function( html, absUrl ) {
				var self = this,
					popup,
					dataUrl = self._createDataUrl( absUrl ),
					scripts,
					all = document.createElement("div"),
					scriptRunner = ns.util.runScript.bind(null, dataUrl);

				//workaround to allow scripts to execute when included in popup divs
				all.innerHTML = html;

				popup = all.querySelector(self.filter);

				// TODO tagging a popup with external to make sure that embedded popups aren't
				// removed by the various popup handling code is bad. Having popup handling code
				// in many places is bad. Solutions post 1.0
				DOM.setNSData(popup, "url", dataUrl);
				DOM.setNSData(popup, "external", true);

				scripts = popup.querySelectorAll("script");
				slice.call(scripts).forEach(scriptRunner);

				return popup;
			};

			/**
			 * Convert url to data-url
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @return {string}
			 * @member ns.router.route.popup
			 * @protected
			 * @static
			 */
			routeDynamic._createDataUrl = function( absoluteUrl ) {
				return path.convertUrlToDataUrl( absoluteUrl );
			};

			ns.router.route.dynamic = routeDynamic;

			}(window, window.document, ns));

/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint plusplus: true, nomen: true */
/**
 * @class tau.navigator
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
(function (document, ns) {
	
	
			document.addEventListener("beforerouterinit", function () {
				ns.setConfig('autoInitializePage', ns.autoInitializePage);
			}, false);

			document.addEventListener("routerinit", function (evt) {
				var router = evt.detail,
					history = ns.router.history,
					navigator,
					back = history.back.bind(router),
					rule = ns.router.route,
					classes = ns.widget.wearable.Page.classes,
					pageActiveClass = classes.uiPageActive;
				/**
				 * @method changePage
				 * @inheritdoc ns.router.Router#open
				 * @member tau
				 */
				ns.changePage = router.open.bind(router);
				document.addEventListener('pageshow', function () {
					/**
					 * Current active page
					 * @property {HTMLElement} activePage
					 * @member tau
					 */
					ns.activePage = document.querySelector('.' + pageActiveClass);
				});
				/**
				 * First page element
				 * @inheritdoc ns.router.Router#firstPage
				 * @property {HTMLElement} firstPage
				 * @member tau
				 */
				ns.firstPage = router.getFirstPage();
				/**
				 * @inheritdoc ns.router.history#back
				 * @method back
				 * @member tau
				 */
				ns.back = back;
				/**
				 * @inheritdoc ns.router.Router#init
				 * @method initializePage
				 * @member tau
				 */
				ns.initializePage = router.init.bind(router);
				/**
				 * Page Container widget
				 * @property {HTMLElement} pageContainer
				 * @inheritdoc ns.router.Router#container
				 * @member tau
				 */
				ns.pageContainer = router.container;
				/**
				 * @method openPopup
				 * @inheritdoc ns.router.Router#openPopup
				 * @member tau
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
				 * @inheritdoc ns.router.Router#closePopup
				 * @member tau
				 */
				ns.closePopup = router.closePopup.bind(router);

			}, false);

			}(window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Text Input Widget
 * Decorator for inputs elements.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - INPUT with type "text" or "number" or "password" or "email" or "url" or
 *    "tel" or "month" or "week" or "datetime-local" or "color" or without any
 *    type
 *  - TEXTAREA
 *  - HTML elements with class ui-textinput
 *
 * ###HTML Examples
 *
 * ####Create simple text input on INPUT element
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input type="text" name="text-1" id="text-1" value="">
 *		</form>
 *
 * ####Create simple text input on TEXTAREA element
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<textarea name="text-1" id="text-1"></textarea>
 *		</form>
 *
 * ####Create simple text input on INPUT element with class ui-textinput
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input name="text-1" id="text-1" class="ui-textinput">
 *		</form>
 *
 * ## Manual constructor
 * For manual creation of TextInput widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input type="search" name="text-1" id="text-1" value="">
 *		</form>
 *		<script>
 *			var inputElement = document.getElementById("text-1"),
 *				textInput = tau.widget.TextInput(inputElement);
 *		</script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*.
 *
 * @class ns.widget.tv.TextInput
 * @extends ns.widget.mobile.TextInput
 * @author Lukasz Zajaczkowski <l.zajaczkows@samsung.com>
 */
(function (document, ns) {
	
				var MobileTextInput = ns.widget.mobile.TextInput,
				MobileTextInputPrototype = MobileTextInput.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				/**
				 * Alias for {ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.tv.TextInput
				 * @static
				 * @private
				 */
				engine = ns.engine,
				FUNCTION_TYPE = "function",
				TextInput = function () {
					MobileTextInput.call(this);
					BaseKeyboardSupport.call(this);

					this._callbacks = {};
					this._lastEventLineNumber = 0;
				},
				/**
				 * Dictionary for textinput related css class names
				 * @property {Object} classes
				 * @member ns.widget.tv.TextInput
				 * @static
				 */
				classes = {
					uiDisabled: ns.widget.mobile.Button.classes.uiDisabled,
					uiNumberInput: "ui-number-input"
				},
				KEY_CODES = BaseKeyboardSupport.KEY_CODES,
				prototype = new MobileTextInput();

			TextInput.events = MobileTextInput.events;
			TextInput.classes = MobileTextInput.classes;
			TextInput.prototype = prototype;

			/**
			* Init TextInput Widget
			* @method _init
			* @param {HTMLElement} element
			* @member ns.widget.tv.TextInput
			* @protected
			*/
			prototype._init = function(element) {
				if (typeof MobileTextInputPrototype._init === FUNCTION_TYPE) {
					MobileTextInputPrototype._init.call(this, element);
				}

				switch (element.type) {
				case "number":
					wrapInputNumber(element);
					break;
				}
			};

			/**
			* Bind events to widget
			* @method _bindEvents
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.tv.TextInput
			*/
			prototype._bindEvents = function(element) {
				var callbacks = this._callbacks;

				if (typeof MobileTextInputPrototype._bindEvents === FUNCTION_TYPE) {
					MobileTextInputPrototype._bindEvents.call(this, element);
				}

				this._bindEventKey();

				callbacks.onKeyupTextarea = onKeyupTextarea.bind(null, this);

				switch (element.type) {
					case "number":
						element.addEventListener("keyup", onKeydownInput, false);
						break;
					case "textarea":
						element.addEventListener("keyup", callbacks.onKeyupTextarea, false);
				}
			};

			/**
			 * Destroys additional elements created by the widget,
			 * removes classes and event listeners
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.TextInput
			 */
			prototype._destroy = function(element) {
				var callbacks = this._callbacks;

				switch (element.type) {
					case "number":
						element.removeEventListener("keyup", onKeydownInput, false);
						break;
					case "textarea":
						element.removeEventListener("keyup", callbacks.onKeyupTextarea, false);
				}

				this._destroyEventKey();

				if (typeof MobileTextInputPrototype._destroy === FUNCTION_TYPE) {
					MobileTextInputPrototype._destroy.call(this, element);
				}
			};

			/**
			 * Method overrides Textarea behavior on keyup event.
			 * @method onKeyupTextarea
			 * @param {TextInput} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.TextInput
			 */
			function onKeyupTextarea(self, event) {
				var textarea = self.element,
					value = textarea.value,
					linesNumber = value.split("\n").length,
					currentLineNumber = value.substr(0, textarea.selectionStart).split("\n").length;

				switch (event.keyCode) {
					case KEY_CODES.up:
						// if cursor is not at the first line
						// or the previous event was not in the first line
						if (currentLineNumber > 1 || self._lastEventLineNumber !== 1) {
							// we do not jump to other element
							event.preventDefault();
							event.stopPropagation();
						}
						break;
					case KEY_CODES.down:
						// if cursor is not at the last line
						// or the previous event was not in the last line
						if (currentLineNumber < linesNumber || self._lastEventLineNumber !== linesNumber) {
							// we do not jump to other element
							event.preventDefault();
							event.stopPropagation();
						}
						break;
					case KEY_CODES.left:
					case KEY_CODES.right:
							// we do not jump to other element
							event.preventDefault();
							event.stopPropagation();
						break;
				}
				self._lastEventLineNumber = currentLineNumber;
			}

			/**
			 * Method adds span to input.
			 * @method wrapInputNumber
			 * @param {EventTarget|HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.tv.TextInput
			 */
			function wrapInputNumber(element) {
				var focusableInputFrame = document.createElement("span"),
				parent = element.parentNode;

				focusableInputFrame.setAttribute("tabindex", 0);
				parent.replaceChild(focusableInputFrame, element);
				focusableInputFrame.appendChild(element);
				focusableInputFrame.classList.add(classes.uiNumberInput);
			}

			/**
			 * Method returns not disabled TextInput element which is the closest
			 * to element.
			 * @method isEnabledTextInput
			 * @param {EventTarget|HTMLElement} element
			 * @return {?HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.tv.TextInput
			 */
			function isEnabledTextInput(element) {
				if (element.classList.contains(TextInput.classes.uiInputText) &&
					!element.classList.contains(classes.uiDisabled)) {
					return element;
				}
				return null;
			}

			/**
			 * Method overrides input behavior on keydown event.
			 * @method onKeydownInput
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.TextInput
			 */
			function onKeydownInput(event) {
				var element = isEnabledTextInput(event.target),
					parent = element.parentNode;

				if(element) {
					event.stopPropagation();
					event.preventDefault();
					if (event.keyCode !== KEY_CODES.up && event.keyCode !== KEY_CODES.down) {
						parent.focus();
					}
				}
			}

			ns.widget.tv.TextInput = TextInput;

			engine.defineWidget(
				"TextInput",
				"input[type='text'], input[type='number'], input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='month'], input[type='week'], input[type='datetime-local'], input[type='color'], input:not([type]), .ui-textinput",
				[],
				TextInput,
				"tv",
				true
			);

			BaseKeyboardSupport.registerActiveSelector(".ui-textinput");

			}(window.document, ns));

/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true */
/**
 * # List Divider Widget
 * List divider widget creates a list separator, which can be used for building grouping lists using.
 *
 *
 * ## Default selectors
 * In all elements with _data-role=listdivider_ are changed to Tizen Web UI ListDivider.
 *
 * In addition all elements with class _ui-listdivider_ are changed to Tizen Web UI ListDivider.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider">Item styles</li>
 *			<li><a href="#">Normal lists</a></li>
 *			<li><a href="#">Normal lists</a></li>
 *			<li><a href="#">Normal lists</a></li>
 *		</ul>
 *
 * ## Manual constructor
 * For manual creation of listdivider widget you can use constructor of widget:
 *
 *		@example
 *		<ul data-role="listview">
 *			<li>Item</li>
 *			<li id="listdivider">Divider</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *		<script>
 *			var listdivider = tau.widget.ListDivider(document.getElementById("listdivider"));
 *		</script>
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<ul data-role="listview">
 *			<li>Item</li>
 *			<li id="listdivider">Divider</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *		<script>
 *			$("#listdivider").listdivider();
 *		</script>
 *
 * ## Options
 *
 * ### Style
 * _data-style_ string ["normal" | "checkbox" | "dialogue"] Option sets the style of the list divider.
 *
 * #### Checkbox
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-style="checkbox">
 *				<form><input type="checkbox">Select All</form>
 *			</li>
 *			<li><form><input type="checkbox">Item</form></li>
 *			<li><form><input type="checkbox">Item</form></li>
 *			<li><form><input type="checkbox">Item</form></li>
 *		</ul>
 *
 * #### Dialogue
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-style="dialogue">Items</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * ### Theme
 * _data-theme_ string Theme for list divider
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-theme="c">Item styles</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * ### Folded
 * _data-folded_ string ["true" | "false"] Decide to show divider press effect or not
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-folded="true">Item styles</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * ### Line
 * _data-line_ string ["true" | "false"] Decide to draw divider line or not
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-line="false">Item styles</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * @class ns.widget.mobile.ListDivider
 * @extends ns.widget.BaseWidget
 */
(function (ns) {
	
				var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.mobile.ListDivider
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias to ns.util.DOM
				 * @property {Object} dom
				 * @private
				 * @member ns.widget.mobile.ListDivider
				 * @static
				 */
				dom = ns.util.DOM,
				/**
				 * Alias to ns.util.selectors
				 * @property {Object} selectors
				 * @member ns.widget.mobile.ListDivider
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				/**
				 * Alias for class ns.widget.mobile.Button
				 * @property {Function} Button
				 * @member ns.widget.mobile.ListDivider
				 * @static
				 * @private
				 */
				Button = ns.widget.mobile.Button,

				ListDivider = function () {
					return this;
				};

			ListDivider.prototype = new BaseWidget();

			/**
			 * Dictionary for listdivider related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.ListDivider
			 * @property {string} uiLiDivider Main calss of divider
			 * @property {string} uiBarThemePrefix Calss prefix of divider bar
			 * @property {string} uiDividerNormalLine Class of divider normal line
			 * @static
			 * @readonly
			 */
			ListDivider.classes = {
				uiBarThemePrefix: "ui-bar-",
				uiLiDivider: "ui-li-divider",
				uiDividerNormalLine: "ui-divider-normal-line"
			};

			/**
			 * Configure widget options
			 * @method _configure
			 * @member ns.widget.mobile.ListDivider
			 * @protected
			 */
			ListDivider.prototype._configure = function () {
				var options = this.options || {};
				/**
				 * Object with default options
				 * @property {Object} options
				 * @property {string} [options.theme="s"] Theme for list divider
				 * @property {"normal"|"checkbox"|"dialogue"} [options.style="normal"] Option sets the style of the list divider
				 * @property {boolean} [options.folded=false] Decide to show divider press effect or not
				 * @property {boolean} [options.line=true] Decide to draw divider line or not
				 * @member ns.widget.mobile.ListDivider
				 */
				this.options = options;
				options.theme = "s";
				options.style = "normal";
				options.folded = false;
				options.line = true;
			};

			/**
			 * Build widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.ListDivider
			 * @protected
			 */
			ListDivider.prototype._build = function (element) {
				var options = this.options,
					classes = ListDivider.classes,
					classList = element.classList,
					buttonClasses = Button.classes,
					elementWithLine;

				classList.add(classes.uiBarThemePrefix + options.theme);
				classList.add(classes.uiLiDivider);
				element.setAttribute("role", "heading");
				element.setAttribute("tabindex", "0");
				//@todo check if ol tag and reset counter

				if (!options.style || options.style === "normal" || options.style === "check") {
					if (options.folded === true) {
						/* buttonMarkup on element */
						engine.instanceWidget(element, "Button");
					} else {
						dom.wrapInHTML(
							element.childNodes,
							"<span class='" + buttonClasses.uiBtnText + "'></span>"
						);
					}

					if (options.line === true) {
						if (options.folded === true) {
							/*append to element.childrenBySelector("ui-btn-inner")*/
							elementWithLine = selectors.getChildrenByClass(element,
								buttonClasses.uiBtnInner)[0];
						} else {
							elementWithLine = element;
						}
						if (elementWithLine) {
							elementWithLine.insertAdjacentHTML(
								"beforeend",
								"<span class='" + classes.uiDividerNormalLine + "'></span>"
							);
						}
					}
				}
				return element;
			};

			// definition
			ns.widget.mobile.ListDivider = ListDivider;
			engine.defineWidget(
				"ListDivider",
				"[data-role='list-divider'], .ui-list-divider",
				[],
				ListDivider,
				"tizen"
			);

			}(ns));

/*global ns, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # List Divider Widget
 * List divider widget creates a list separator, which can be used for building
 * grouped list of items.
 *
 * @class ns.widget.tv.ListDivider
 * @extends ns.widget.mobile.ListDivider
 */
(function (ns) {
	
				var MobileListDivider = ns.widget.mobile.ListDivider,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.tv.ListDivider
				 * @private
				 * @static
				 */
				engine = ns.engine,
				ListDivider = function () {
					MobileListDivider.call(this);
				},
				prototype = new MobileListDivider();

			ListDivider.events = MobileListDivider.events;
			ListDivider.classes = MobileListDivider.classes;
			ListDivider.prototype = prototype;
			// definition
			ns.widget.tv.ListDivider = ListDivider;
			engine.defineWidget(
				"ListDivider",
				"[data-role='list-divider'], .ui-list-divider",
				[],
				ListDivider,
				"tv",
				true
			);

			}(ns));

/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/**
 * #Checkbox-radio Widget
 * Checkboxradio widget changes default browser checkboxes and radios to form more adapted to mobile environment.
 *
 * ##Default selectors
 * In default all inputs with type _checkbox_ or _radio_ are changed to checkboxradio widget.
 *
 * ##HTML Examples
 *
 * ### Create checkboxradio
 *
 *		@example
 *		<input type="checkbox" name="checkbox-yes" id="checkbox-yes" />
 *		<label for="checkbox-yes">Yes</label>
 *
 * @class ns.widget.mobile.Checkboxradio
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	
				var Checkboxradio = function () {
					/**
					* @property {Object} options Object with default options
					* @property {string} [options.theme='s'] Widget's theme
					* @member ns.widget.mobile.Checkboxradio
					* @instance
					*/
					this.options = {
						theme: 's'
					};

					this._onLabelClickBound = null;
					this._onInputClickBound = null;
				},
				/**
				* @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* @property {Object} engine Alias for class ns.engine
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				engine = ns.engine,
				/**
				* @property {Object} selectors Alias for class ns.util.selectors
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				selectors = ns.util.selectors,
				/**
				* @property {Object} dom Alias for class ns.util.DOM
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				dom = ns.util.DOM,
				/**
				* @property {Object} events Alias for class ns.event
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				events = ns.event,
				classes = {
					checkboxradioIconWrapper: "ui-icon-wrapper"
				},
				/**
				* @property {Function} slice Alias for function Array.slice
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				slice = [].slice;

			Checkboxradio.prototype = new BaseWidget();

			/**
			 * Dictionary for slider related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.Checkboxradio
			 * @static
			 * @readonly
			 */
			Checkboxradio.classes = classes;

			/**
			* Finds best matched label for given input: <br>
			* 1. Checks if one of parents is not a label<br>
			* 2. Checks label#for=input.id if input.id is set in parent form, fieldset, page<br>
			* 3. Creates label
			* @method getLabel
			* @param {HTMLElement} input
			* @return {HTMLElement}
			* @private
			* @static
			* @member ns.widget.mobile.Checkboxradio
			*/
			function getLabel(input) {
				var parent = selectors.getClosestByTag(input, "label"),
					label;
				if (parent) { //1
					parent.parentNode.replaceChild(parent.firstElementChild, parent);
					return parent;
				}
				if (input.id) { //2
					parent = selectors.getClosestBySelector(input,
						"form, fieldset, [data-role='page'], [data-role='dialog']");
					if (parent) {
						label = parent.querySelector("label[for='" + input.id + "']");
						if (label) {
							return label;
						}
					}
				}
				//3
				label = document.createElement("label");
				if (input.id) {
					label.setAttribute("for", input.id);
				}
				return label;
			}

			/**
			 * Function fires on label click event
			 * @method onLabelClick
			 * @param {ns.widget.mobile.Checkboxradio} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.Checkboxradio
			 */
			function onLabelClick(self, event) {
				var element = self.element;

				events.preventDefault(event);
				events.stopPropagation(event);
				events.stopImmediatePropagation(event);
				if (element.getAttribute("disabled")) {
					return;
				}

				// Always set checked to true for radios
				// for checkboxes toggle value
				element.checked = (element.type === 'checkbox') ? !element.checked : true;

				if (element.checked) {
					self._getInputSet().forEach(function (el) {
						if (element !== el) {
							el.checked = false;
						}
					});
				}

				self._updateAll();
				event.stopPropagation();
				event.preventDefault();
			}

			/**
			 * Function fires on input click event
			 * @method onInputClick
			 * @param {ns.widget.mobile.Checkboxradio} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.Checkboxradio
			 */
			function onInputClick(self, event) {
				var element = self.element;

				if (element.getAttribute("disabled")) {
					event.preventDefault();
					return;
				}

				element.checked = !element.checked;

				if (element.checked) {
					self._getInputSet().forEach(function (el) {
						if (element !== el) {
							el.checked = false;
						}
					});
				}

				self._updateAll();
			}

			/**
			* Check checkboxradio element
			* @method checkElement
			* @param {ns.widget.mobile.Checkboxradio} instance
			* @private
			* @member ns.widget.mobile.Checkboxradio
			* @new
			*/
			function checkElement(instance) {
				var labelClassList = instance.label.classList,
					iconClassList,
					element = instance.element;
				if (!element.getAttribute("disabled")) {
					if (instance.icon) {
						iconClassList = instance.icon.classList;
						iconClassList.add(instance.checkedicon);
						iconClassList.remove(instance.uncheckedicon);
					}
					labelClassList.add(instance.checkedClass);
					labelClassList.remove(instance.uncheckedClass);
					instance.wrapper.setAttribute(instance.ariaCheckedAttr, true);
				}
			}

			/**
			* Uncheck checkboxradio element
			* @method uncheckElement
			* @param {ns.widget.mobile.Checkboxradio} instance
			* @private
			* @member ns.widget.mobile.Checkboxradio
			* @new
			*/
			function uncheckElement(instance) {
				var labelClassList = instance.label.classList,
					iconClassList,
					element = instance.element;
				if (!element.getAttribute("disabled")) {
					if (instance.icon) {
						iconClassList = instance.icon.classList;
						iconClassList.add(instance.uncheckedicon);
						iconClassList.remove(instance.checkedicon);
					}
					labelClassList.add(instance.uncheckedClass);
					labelClassList.remove(instance.checkedClass);
					instance.wrapper.setAttribute(instance.ariaCheckedAttr, false);
				}
			}

			/**
			* Builds structure of checkboxradio widget
			* @method _build
			* @param {HTMLInputElement} element
			* @return {HTMLInputElement}
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/
			Checkboxradio.prototype._build = function (element) {
				var inputtype = element.getAttribute('type'),
					options = this.options,
					label,
					labelClassList,
					wrapper,
					ariaCheckedAttr,
					icon,
					checkedState,
					checkedClass,
					uncheckedClass,
					uncheckedState,
					checkedicon,
					uncheckedicon,
					activeBtn,
					iconSpan,
					iconClassList,
					iconpos,
					mini,
					iconSpanParent,
					iconWrapper;

				//if created dynamically on wrong element, just return from here
				if (inputtype !== "checkbox" && inputtype !== "radio") {
					//_build should always return element
					return element;
				}
				ariaCheckedAttr = inputtype === 'radio' ? 'aria-selected' : 'aria-checked';
				checkedState = inputtype + "-on";
				uncheckedState = inputtype + "-off";
				icon = selectors.getParentsBySelector(element, "[data-type='horizontal']").length ? false : uncheckedState;
				if (!icon) {
					activeBtn = "ui-btn-active";
				}
				checkedClass = "ui-" + checkedState;
				uncheckedClass = "ui-" + uncheckedState;
				checkedicon = "ui-icon-" + checkedState;
				uncheckedicon = "ui-icon-" + uncheckedState;

				label = getLabel(element);
				labelClassList = label.classList;

				//@todo these options should not be passed via DOM element
				mini = dom.inheritAttr(element, "data-mini", "form,fieldset");
				if (mini) {
					label.setAttribute('data-mini', mini);
				}

				iconpos = dom.inheritAttr(element, "data-iconpos", "form,fieldset");
				if (iconpos) {
					label.setAttribute('data-iconpos', iconpos);
				}

				label.setAttribute('data-theme', options.theme);
				label.setAttribute('data-icon', icon);
				label.setAttribute('data-shadow', false);
				label.setAttribute('data-bar', true);
				engine.instanceWidget(label, "Button");
				iconSpan = label.getElementsByClassName('ui-icon')[0];
				iconSpanParent = iconSpan && iconSpan.parentElement;
				iconWrapper = document.createElement("span");

				if (iconSpan) {
					iconClassList = iconSpan.classList;
					iconWrapper.classList.add(classes.checkboxradioIconWrapper);
					iconWrapper.appendChild(iconSpan);
					iconSpanParent.appendChild(iconWrapper);
				}

				// Wrap the input + label in a div
				wrapper = '<div role="' + inputtype + '" class="ui-' + inputtype;
				if (element.classList.contains("favorite")) {
					wrapper += ' favorite';
				}
				wrapper += '"></div>';

				//make sure label is after input
				if (element.nextElementSibling) {
					element.parentNode.insertBefore(label, element.nextElementSibling);
				} else {
					element.parentNode.appendChild(label);
				}
				dom.wrapInHTML([element, label], wrapper);
				wrapper = element.parentNode;

				if (element.hasAttribute('checked')) {
					// quick fix to resolve problem in tests when sometimes attribute checked isn't proper interpreted to property in object
					element.checked = true;
				}
				if (element.checked) {
					labelClassList.add(checkedClass);
					if (!icon) {
						labelClassList.add(activeBtn);
					}
					labelClassList.remove(uncheckedClass);
					if (iconSpan) {
						iconClassList.add(checkedicon);
						iconClassList.remove(uncheckedicon);
					}
					wrapper.setAttribute(ariaCheckedAttr, true);
				} else {
					labelClassList.remove(checkedClass);
					if (!icon) {
						labelClassList.remove(activeBtn);
					}
					labelClassList.add(uncheckedClass);
					if (iconSpan) {
						iconClassList.add(uncheckedicon);
						iconClassList.remove(checkedicon);
					}
					wrapper.setAttribute(ariaCheckedAttr, false);
				}

				element.checked = element.getAttribute('checked') === 'checked';

				if (element.getAttribute("disabled")) {
					wrapper.classList.add('ui-disabled');
				} else {
					wrapper.classList.remove('ui-disabled');
				}
				return element;
			};

			/**
			* Inits widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/
			Checkboxradio.prototype._init = function (element) {
				this.label = getLabel(element);
				this.icon = this.label.getElementsByClassName('ui-icon')[0];
				this.wrapper = element.parentNode;
				this.inputtype = element.getAttribute('type');
				this.checkedClass = 'ui-' + this.inputtype + '-on';
				this.uncheckedClass = 'ui-' + this.inputtype + '-off';
				this.ariaCheckedAttr = this.inputtype === 'radio' ? 'aria-selected' : 'aria-checked';
				this.checkedicon = "ui-icon-" + this.inputtype + '-on';
				this.uncheckedicon = "ui-icon-" + this.inputtype + '-off';
			};

			/**
			* Binds events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/
			Checkboxradio.prototype._bindEvents = function () {
				this._onLabelClickBound = onLabelClick.bind(null, this);
				this._onInputClickBound = onInputClick.bind(null, this);
				this.label.addEventListener('vclick', this._onLabelClickBound, true);
				this.element.addEventListener('vclick', this._onInputClickBound, false);
			};

			/**
			* Returns either a set of radios with the same name attribute or a single checkbox
			* @method getInputSet
			* @return {Array}
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/
			Checkboxradio.prototype._getInputSet = function () {
				var parent;

				if (this.inputtype === 'checkbox') {
					return [this.element];
				}

				parent = selectors.getClosestBySelector(this.element,
					"form, fieldset, [data-role='page'], [data-role='dialog']");

				if (parent) {
					return slice.call(parent.querySelectorAll(
						"input[name='" + this.element.name + "'][type='" + this.inputtype + "']"
					));
				}

				return [];
			};

			/**
			* Updates all others checkboxradio widgets with the same name attribute (only radios)
			* @method _updateAll
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/
			Checkboxradio.prototype._updateAll = function () {
				this._getInputSet().forEach(function (el) {
					var widget = engine.getBinding(el);

					if (widget) {
						if (widget.element.checked || widget.element.type === "checkbox") {
							events.trigger(widget.element, "change");
						}
						widget.refresh();
					}
				});
			};

			/**
			* Refreshes widget
			* @method refresh
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/

			Checkboxradio.prototype.refresh = function () {
				var element = this.element;

				if (element.checked) {
					checkElement(this);
				} else {
					uncheckElement(this);
				}

				if (element.getAttribute("disabled")) {
					this.disable();
				} else {
					this.enable();
				}
			};

			/**
			* Enables widget
			* @method _enable
			* @member ns.widget.mobile.Checkboxradio
			* @protected
			* @instance
			*/
			Checkboxradio.prototype._enable = function () {
				dom.removeAttribute(this.element, "disabled");
				this.wrapper.classList.remove('ui-disabled');
			};

			/**
			* Disables widget
			* @method _disable
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/
			Checkboxradio.prototype._disable = function () {
				dom.setAttribute(this.element, "disabled", true);
				this.wrapper.classList.add('ui-disabled');
			};

			/**
			* Cleans widget's resources
			* @method _destroy
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/
			Checkboxradio.prototype._destroy = function () {
				this.label.removeEventListener('vclick', this._onLabelClickBound, true);
				this.element.removeEventListener('vclick', this._onInputClickBound, false);
			};

			/**
			* Return checked checkboxradio element
			* @method getCheckedElement
			* @return {?HTMLElement}
			* @member ns.widget.mobile.Checkboxradio
			* @new
			*/
			Checkboxradio.prototype.getCheckedElement = function () {
				var radios = this._getInputSet(),
					i,
					max = radios.length;
				for (i = 0; i < max; i++) {
					if (radios[i].checked) {
						return radios[i];
					}
				}
				return null;
			};

			/**
			* Returns value of checkbox if it is checked or value of radios with the same name
			* @method _getValue
			* @member ns.widget.mobile.Checkboxradio
			* @return {?string}
			 * @protected
			* @instance
			* @new
			*/
			Checkboxradio.prototype._getValue = function () {
				var checkedElement = this.getCheckedElement();

				if (checkedElement) {
					return checkedElement.value;
				}

				return null;
			};

			/**
			* Check element with value
			* @method _setValue
			* @param {string} value
			* @member ns.widget.mobile.Checkboxradio
			* @chainable
			* @instance
			 * @protected
			* @new
			*/
			Checkboxradio.prototype._setValue = function (value) {
				var radios = this._getInputSet(),
					checkedElement,
					i,
					max = radios.length;

				for (i = 0; i < max; i++) {
					if (radios[i].value === value) {
						checkedElement = this.getCheckedElement();
						if (checkedElement) {
							uncheckElement(engine.getBinding(checkedElement));
						}
						checkElement(engine.getBinding(radios[i]));
						return this;
					}
				}
				return this;
			};

			// definition
			ns.widget.mobile.Checkboxradio = Checkboxradio;
			engine.defineWidget(
				"Checkboxradio",
				"input[type='checkbox']:not(.ui-slider-switch-input), input[type='radio'], .ui-checkbox",
				[
					"enable",
					"disable",
					"refresh"
				],
				Checkboxradio,
				'mobile'
			);
			}(window.document, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Checkbox-radio Widget
 * Checkboxradio widget changes default browser checkboxes and radios to form more adapted to TV environment.
 *
 * ##HTML Examples
 *
 * ### Create checkboxradio
 *
 *		@example
 *		<input type="checkbox" name="checkbox-example" id="checkbox-example"/>
 *		<label for="checkbox-example">Example</label>
 *		<!-- Input type='radio' example -->
 *		<input type="radio" name="radio-example" id="radio-example" value="1">
 *		<label for="radio-example">Example</label>
 *
 * @class ns.widget.tv.Checkboxradio
 * @extends ns.widget.mobile.Checkboxradio
 * @author Piotr Ostalski <p.ostalski@samsung.com>
 */
(function (document, ns) {
	
				var MobileCheckboxradio = ns.widget.mobile.Checkboxradio,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				engine = ns.engine,
				classes = {
					focused: "focus"
				},
				Checkboxradio = function () {
					MobileCheckboxradio.call(this);
					BaseKeyboardSupport.call(this);
				},
				KEY_CODES = {
					up: 38,
					down: 40,
					enter: 13
				},
				prototype = new MobileCheckboxradio();

			Checkboxradio.prototype = prototype;

			/**
			* Builds structure of checkboxradio widget
			* @param {HTMLInputElement} element
			* @return {HTMLInputElement} Built element
			*/
			prototype._build = function(element) {
				wrapInput(element);
				return element;
			};

			/**
			* Binds events to widget
			* @param {HTMLInputElement} element Input element
			*/
			prototype._bindEvents = function(element) {
				document.addEventListener("keyup", this, false);

				if (element.type === "radio") {
					var parentNode = element.parentNode;
					parentNode.addEventListener("keyup", onKeydownContainer, false);
					parentNode.addEventListener("focus", onFocusContainer, false);
					parentNode.addEventListener("blur", onBlurContainer, false);
				} else {
					element.addEventListener("keyup", onKeydownCheckbox, false);
				}
			};

			/**
			* Cleans widget's resources
			* @param {HTMLInputElement} element
			*/
			prototype._destroy = function(element) {
				if (element.type === "radio") {
					var parentNode = element.parentNode;
					parentNode.removeEventListener("keyup", onKeydownContainer, false);
					parentNode.removeEventListener("focus", onFocusContainer, false);
					parentNode.removeEventListener("blur", onBlurContainer, false);
				} else {
					element.removeEventListener("keyup", onKeydownCheckbox, false);
				}

				document.removeEventListener("keyup", this, false);

			};

			/**
			* Returns label connected to input by htmlFor tag
			* @param {HTMLElement} parent Input`s parent
			* @param {string} id Input`s id
			* @return {?HTMLElement} Label or null if not found
			*/
			function getLabelForInput(parent, id) {
				var labels = parent.getElementsByTagName("label"),
					length = labels.length,
					i;
				for (i = 0; i < length; i++) {
					if (labels[i].htmlFor === id) {
						return labels[i];
					}
				}
				return null;
			}

			/**
			 * Method adds span to input.
			 * @param {EventTarget|HTMLElement} element Input element
			 */
			function wrapInput(element) {
				var container = document.createElement("span"),
					parent = element.parentNode,
					label = getLabelForInput(parent, element.id);

				parent.replaceChild(container, element);
				container.appendChild(element);

				if (label) {
					label.style.display = "inline-block";
					if (element.disabled) {
						// make label not focusable (remove button class)
						label.className = "";
					}
					container.appendChild(label);
				}

				if ((element.type === "radio") && (!element.disabled)) {
					container.setAttribute("tabindex", 0);
					container.className = "radio-container";
				}
			}

			/**
			 * Method overrides input behavior on keydown event (checkbox).
			 * @param {Event} event
			 */
			function onKeydownCheckbox(event) {
				var element = event.target;
				if (element) {
					if (event.keyCode === KEY_CODES.enter) {
						element.checked = !element.checked;
						event.stopPropagation();
						event.preventDefault();
					}
				}
			}

			/**
			* Returns radio button stored in container or null
			* @param {HTMLElement} container
			* @return {HTMLInputElement} Returns radio button stored in container or null
			*/
			function findRadioInContainer (container) {
				var children = container.getElementsByTagName("input"),
					length = children.length,
					child = null,
					i;
				for (i = 0; i < length; i++) {
					child = children[i];
					if (child.type === "radio") {
						return child;
					}
				}
				return null;
			}

			/**
			 * Method overrides input behavior on keydown event (radiobutton`s container).
			 * @param {Event} event
			 */
			function onKeydownContainer(event) {
				var element = event.target,
					radio = null;
				if (element) {
					if (event.keyCode === KEY_CODES.enter) {
						radio = findRadioInContainer(element);
						if (radio) {
							radio.checked = !radio.checked;
							event.stopPropagation();
							event.preventDefault();
						}
					}
				}
			}

			/**
			 * Method overrides input behavior on focus event (radiobutton`s container).
			 * @param {Event} event
			 */
			function onFocusContainer(event) {
				var element = event.target,
					radio = null;
				if (element) {
					radio = findRadioInContainer(element);
					if (radio) {
						radio.classList.add(classes.focused);
						event.stopPropagation();
						event.preventDefault();
					}
				}
			}

			/**
			 * Method overrides input behavior on blur event (radiobutton`s container).
			 * @param {Event} event
			 */
			function onBlurContainer(event) {
				var element = event.target,
					radio = null;
				if (element) {
					radio = findRadioInContainer(element);
					if (radio) {
						radio.classList.remove(classes.focused);
					}
				}
			}

			ns.widget.tv.Checkboxradio = Checkboxradio;

			engine.defineWidget(
				"Checkboxradio",
				"input[type='checkbox'], input[type='radio']",
				[],
				Checkboxradio,
				"tv",
				true
			);

			BaseKeyboardSupport.registerActiveSelector(".radio-container");

			}(window.document, ns));

/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Progress Widget
 * Shows a control that indicates the progress percentage of an on-going operation.
 *
 * The progress widget shows a control that indicates the progress percentage of an on-going operation. This widget can be scaled to fit inside a parent container.
 *
 * ## Default selectors
 *
 * This widget provide three style progress.
 *
 * ### Simple progress bar
 * If you don't implement any class, you can show default progress style
 * To add a progress widget to the application, use the following code:
 *
 *      @example
 *      <progress max="100" value="90"></progress>
 *
 * ### Infinite progress bar
 * If you implement class (*ui-progress-indeterminate*), you can show image looks like infinite move.
 *
 * To add a progress widget to the application, use the following code:
 *      @example
 *      <progress class="ui-progress-indeterminate" max="100" value="100"></progress>
 *
 * ### Progress bar with additional information
 * If you implement div tag that can choose two classes (*ui-progress-proportion* or *ui-progress-ratio*) at progress tag same level, you can show two information (proportion information is located left below and ratio information is located right below)
 *
 * To add a progress widget to the application, use the following code:
 *
 *      @example
 *      <progress max="100" value="50"></progress>
 *      <div class="ui-progress-proportion">00/20</div>
 *      <div class="ui-progress-ratio">50%</div>
 *
 * ## JavaScript API
 *
 * Progress widget hasn't JavaScript API.
 *
 * @class ns.widget.core.Progress
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	
	
			var BaseWidget = ns.widget.BaseWidget,

				Progress = function () {
					this.options = {};
				},
				CLASSES_PREFIX = "ui-progress",
				classes = {
					INDETERMINATE: CLASSES_PREFIX + "-indeterminate",
					PROCESS: CLASSES_PREFIX + "-processing"
				},
				TYPE = {
					bar: "bar",
					circle: "circle"
				},
				prototype = new BaseWidget();

			Progress.events = {};

			/**
			 * Dictionary for Progress related css class names
			 * @property {Object} classes
			 * @member ns.widget.core.Progress
			 * @static
			 * @readonly
			 */
			Progress.classes = classes;

			/**
			 * Configure widget options
			 * @method _configure
			 * @member ns.widget.core.Progress
			 * @protected
			 */
			prototype._configure = function (element) {
				/**
					 * Options for widget
					 * @property {Object} options
					 * @property {boolean} [options.infinite=false] Decide if progress time period is determinated or indeterminated.
					 * @property {"bar"|"circle"} [options.appeariance="bar"] Set progrss appeariance.
					 * @member ns.widget.core.Progress
				 */
				this.options = {
						infinite : false,
						appeariance : TYPE.bar
				};
			};

			/**
			 * Build Progress
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Progress
			 */
			prototype._build = function (element) {
				var options = this.options,
					classList = element.classList,
					replacement = document.createElement('div'),
					i,
					attributes = element.attributes,
					length,
					nodeName,
					nodeValue;

				if (options.appeariance === TYPE.circle) {
					classList.add(classes.PROCESS);
					length = attributes.length;

					for (i = 0; i < length; ++i){
						nodeName  = attributes.item(i).name,
						nodeValue = attributes.item(i).value;
						replacement.setAttribute(nodeName, nodeValue);
					}

					replacement.innerHTML = element.innerHTML;
					element.parentNode.replaceChild(replacement, element);
				} else if (options.appeariance === TYPE.bar) {

					if (options.infinite === true) {
						classList.add(classes.INDETERMINATE);
					}

				}

				return element;
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Progress
			 */
			prototype._destroy = function () {
				this.options = null;
			};

			Progress.prototype = prototype;
			ns.widget.core.Progress = Progress;

			}(window.document, ns));

/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Progress Widget
 * Shows a control that indicates the progress percentage of an on-going operation.
 *
 * @class ns.widget.tv.Progress
 * @extends ns.widget.core.Progress
 */
(function (document, ns) {
	
	
			var CoreProgress = ns.widget.core.Progress,
				CoreProgressPrototype = CoreProgress.prototype,
				engine = ns.engine,
				classes = {
					disabled: "disabled",
					focused: "ui-focus",
					thumb: "ui-progress-thumb"
				},

				Progress = function () {
					CoreProgress.call(this);
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {number} [options.value=0] value of progress
					 * bar
					 * @property {number} [options.min=0] minimal value of
					 * progress bar
					 * @property {number} [options.max=100] maximal value of
					 * progress bar
					 * @member ns.widget.tv.ProgressBar
					 */
					this.options = {
						value: 0,
						max: 100,
						min: 0
					};
				},
				FUNCTION_TYPE = "function",
				prototype = new CoreProgress();

			Progress.prototype = prototype;

			/**
			 * Initializes progress
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Progress
			 */
			prototype._init = function(element) {
				var self = this,
					min = parseInt(element.getAttribute("min"), 10),
					max = parseInt(element.getAttribute("max"), 10),
					value = parseInt(element.getAttribute("value"), 10),
					options = self.options;
				if (typeof CoreProgressPrototype._init === FUNCTION_TYPE) {
					CoreProgressPrototype._init.call(self, element);
				}

				// remember attributes value
				if (isNaN(min) || min === null) {
					min = options.min || 0;
				}
				options.min = min;

				if (isNaN(max) || max === null) {
					max = options.max || 0;
				}
				options.max = max;

				if (isNaN(value) || (value === null) || (value < min) || (value > max)) {
					value = options.value || 0;
					element.setAttribute("value", value);
				}
				options.value = value;

				// if widget is disabled add proper class
				if (element.getAttribute("disabled") === "disabled") {
					element.classList.add(classes.disabled);
				}
			};

			/**
			 * Method sets ProgressBar value.
			 * @method _setValue
			 * @param {number} value
			 * @return {boolean} True if value changed
			 * @protected
			 * @member ns.widget.tv.Progress
			 */
			prototype._setValue = function (value) {
				var self = this,
					options = self.options;
				if ((typeof value === "number") && (value !== options.value) && (value >= options.min) && (value <= options.max)) {
					self.trigger("change");
					if (value === self.maxValue) {
						self.trigger("complete");
					}
					options.value = value;
					self.element.setAttribute("value", value);
					return true;
				} else {
					return false;
				}
			};

			/**
			 * Method gets ProgressBar value.
			 * @method _getValue
			 * @return {number}
			 * @protected
			 * @member ns.widget.tv.Progress
			 */
			prototype._getValue = function () {
				return this.options.value;
			};

			/**
			 * Method Focuses object
			 * @method focus
			 * @member ns.widget.tv.Progress
			 */
			prototype.focus = function () {
				var classList = this.element.classList,
					focused = classes.focused;
				if (!classList.contains(focused)) {
					classList.add(focused);
				}
			};

			/**
			 * Method unfocuses object
			 * @method blur
			 * @member ns.widget.tv.Progress
			 */
			prototype.blur = function () {
				var classList = this.element.classList,
					focused = classes.focused;
				if (classList.contains(focused)) {
					classList.remove(focused);
				}
			};

			ns.widget.tv.Progress = Progress;

			engine.defineWidget(
				"Progress",
				"progress",
				[],
				Progress,
				"tv"
			);
			}(window.document, ns));

/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Grid Utility
 * Object helps creating grids.
 * @class ns.util.grid
 */
(function (ns) {
	
				/**
			 * Local alias for ns.util.selectors
			 * @property {Object} selectors Alias for {@link ns.util.selectors}
			 * @member ns.util.grid
			 * @static
			 * @private
			 */
			var selectors = ns.util.selectors,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @member ns.util.grid
				 * @private
				 * @static
				 */
				slice = [].slice,
				/**
				 * grid types
				 * @property {Array} gridTypes
				 * @member ns.util.grid
				 * @static
				 * @private
				*/
				gridTypes = [
					null,
					"solo", //1
					"a",	//2
					"b",	//3
					"c",	//4
					"d"	//5
				];

			/**
			 * Add classes on the matched elements
			 * @method setClassOnMatches
			 * @param {HTMLElementCollection} elements
			 * @param {string} selector
			 * @param {string} className
			 * @private
			 * @member ns.util.grid
			 * @static
			 */
			function setClassOnMatches(elements, selector, className) {
				elements.forEach(function (item) {
					if (selectors.matchesSelector(item, selector)) {
						item.classList.add(className);
					}
				});
			}
			ns.util.grid = {
				/**
				* make css grid
				* @method makeGrid
				* @param {HTMLElement} element
				* @param {?string} [gridType="a"]
				* @static
				* @member ns.util.grid
				*/
				makeGrid: function (element, gridType) {
					var gridClassList = element.classList,
						kids = slice.call(element.children),
						iterator;
					if (!gridType) {
						gridType = gridTypes[kids.length];
						if (!gridType) {
							//if gridType is not defined in gritTypes
							//make it grid type "a""
							gridType = "a";
							iterator = 2;
							gridClassList.add("ui-grid-duo");
						}
					}
					if (!iterator) {
						//jquery grid doesn't care if someone gives non-existing gridType
						iterator = gridTypes.indexOf(gridType);
					}

					gridClassList.add("ui-grid-" + gridType);

					setClassOnMatches(kids, ":nth-child(" + iterator + "n+1)", "ui-block-a");

					if (iterator > 1) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+2)", "ui-block-b");
					}
					if (iterator > 2) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+3)", "ui-block-c");
					}
					if (iterator > 3) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+4)", "ui-block-d");
					}
					if (iterator > 4) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+5)", "ui-block-e");
					}
				}
			};
			}(ns));

/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/**
 * #Tab Bar Widget
 * The tabbar widget shows an unordered list of buttons on the screen wrapped
 * together in a single group.
 *
 * This widget can be placed in the header or footer of page.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - HTML elements with data-role="tabbar"
 *  - HTML elements with class ui-tabbar
 *
 * ###HTML Examples
 *
 * ####Create simple tab bar in header
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="header">
 *				<div data-role="tabbar">
 *					<ul>
 *						<li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *						<li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *						<li><a data-icon="naviframe-call">Tabbar3</a></li>
 *					</ul>
 *				</div>
 *			</div>
 *			<div data-role="content">
 *			 	Content
 *			</div>
 *		</div>
 *
 * ####Create simple tab bar in footer
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content">
 *			 	Content
 *			</div>
 *			<div data-role="footer">
 *				<div data-role="tabbar">
 *					<ul>
 *						<li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *						<li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *						<li><a data-icon="naviframe-call">Tabbar3</a></li>
 *					</ul>
 *				</div>
 *			</div>
 *		</div>
 *
 * ## Manual constructor
 * For manual creation of search bar widget you can use constructor of widget from
 * **tau** namespace:
 *
 *		@example
 *		<div data-role="page" id="tab-bar-page">
 *			<div data-role="header">
 *				<div id="ready-for-tab-bar">
 *					<ul>
 *						<li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *						<li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *						<li><a data-icon="naviframe-call">Tabbar3</a></li>
 *					</ul>
 *				</div>
 *			</div>
 *			<div data-role="content">
 *			 	Content
 *			</div>
 *		</div>
 *		<script>
 *			(function (document) {
 *				var pageElement = document.getElementById("tab-bar-page"),
 *					tabBarElement = document.getElementById("ready-for-tab-bar"),
 *					tabBar;
 *
 *				function createPageHandle() {
 *					tabBar = tau.widget.TabBar(tabBarElement);
 *				}
 *
 *				pageElement.addEventListener("pagecreate", createPageHandle);
 *			}(document));
 *		</script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter is **options** and it is a object
 * with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<div data-role="page" id="tab-bar-page">
 *			<div data-role="header">
 *				<div id="ready-for-tab-bar">
 *					<ul>
 *						<li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *						<li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *						<li><a data-icon="naviframe-call">Tabbar3</a></li>
 *					</ul>
 *				</div>
 *			</div>
 *			<div data-role="content">
 *			 	Content
 *			</div>
 *		</div>
 *		<script>
 *			(function (document) {
 *				function createPageHandle() {
 *					$("#ready-for-tab-bar").tabbar();
 *				}
 *
 *				$("#tab-bar-page").on("pagecreate", createPageHandle);
 *			}(document));
 *		</script>
 *
 * jQuery Mobile constructor has one optional parameter is **options** and it is
 * a object with options for widget.
 *
 * ##Options for tab bar widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<script>
 *		var tabBarElement = document.getElementById('tab-bar'),
 *			tabBar = tau.widget.TabBar(TabBarElement);
 *
 *		tabBar.methodName(methodArgument1, methodArgument2, ...);
 *		</script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		<script>
 *		$(".selector").tabbar('methodName', methodArgument1, methodArgument2, ...);
 *		</script>
 *
 * @class ns.widget.mobile.TabBar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	
				var ButtonClasses = ns.widget.mobile.Button.classes,
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				selectors = ns.util.selectors,
				grid = ns.util.grid,
				DOM = ns.util.DOM,
				slice = [].slice,
				TabBar = function () {
					this.vclickCallback = null;
					this._ui = {};
					this.options = {
						active: 0,
						autoChange: true
					};
				},
				/**
				 * Object with class dictionary
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.mobile.TabBar
				 * @readonly
				 */
				classes = {
					tabbarScrollUl: "tabbar-scroll-ul",
					tabbarScrollLi: "tabbar-scroll-li",
					uiTabbarActive: "ui-tabbar-active",
					uiStatePersist: "ui-state-persist",
					uiHeader: "ui-header",
					uiScrollviewView: "ui-scrollview-view",
					uiScrollviewClip: "ui-scrollview-clip",
					uiNavbar: "ui-navbar",
					uiFooter: "ui-footer",
					uiTabBtnStyle: "ui-tab-btn-style",
					uiTitle: "ui-title",
					uiTitleTabbar: "ui-title-tabbar",
					uiTabbarNoicons: "ui-tabbar-noicons",
					uiTabbarNotext: "ui-tabbar-notext",
					uiTitleTabbarMultiline: "ui-title-tabbar-multiline",
					uiTabbarPersist: "ui-tabbar-persist",
					uiTabbar: "ui-tabbar",
					uiPortraitTabbar: "ui-portrait-tabbar",
					uiLandscapeTabbar: "ui-landscape-tabbar"
				};

			TabBar.prototype = new BaseWidget();

			/*
			* @todo move to options object
			*/

			/**
			 * Position of icon
			 * @property {string} [iconpos="top"]
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype.iconpos = 'top';
			/**
			 * Grid type
			 * @property {string} [grid=null]
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype.grid = null;

			TabBar.classes = classes;

			/**
			 * Returns true if one of elements has data-icon set to true
			 * @method hasIcon
			 * @param {Array} elements
			 * @member ns.widget.mobile.TabBar
			 * @static
			 * @private
			 * @return {boolean}
			 */
			function hasIcon(elements) {
				return !elements.every(function (element) {
					return !element.getAttribute('data-icon');
				});
			}

			function setActive(self, index) {
				var element = self.element,
					uls = element.getElementsByTagName("ul"),
					ul = uls[0],
					buttons = element.getElementsByTagName("a"),
					i = 0,
					max,
					hasClass = false,
					buttonClasses,
					btnActiveClass = ButtonClasses.uiBtnActive,
					classes = TabBar.classes,
					activatedButton = buttons.length > index ? buttons[index] : null;

				while (!hasClass && ul) {
					if (ul.classList.contains(classes.tabbarScrollUl)) {
						hasClass = true;
					}
					ul = uls[++i];
				}

				if (hasClass) {
					for (i = 0, max = buttons.length; i < max; i++) {
						buttons[i].classList.remove(classes.uiTabbarActive);
					}
					/*
					* In original file btnActiveClass is always added.
					* Here, if button is disabled, this class will not be added
					*/
					if (activatedButton) {
						activatedButton.classList.add(classes.uiTabbarActive);
						self.options.active = index;
					}
				} else {
					for (i = 0, max = buttons.length; i < max; i++) {
						buttonClasses = buttons[i].classList;
						if (!buttonClasses.contains(classes.uiStatePersist)) {
							buttonClasses.remove(btnActiveClass);
						}
					}
					/*
					* In original file btnActiveClass is always added.
					* Here, if button is disabled, this class will not be added
					*/
					if (activatedButton) {
						activatedButton.classList.add(btnActiveClass);
						self.options.active = index;
					}
				}
			}

			/**
			 * @method vclickEvent
			 * @param {ns.widget.mobile.TabBar} self
			 * @member ns.widget.mobile.TabBar
			 * @static
			 * @private
			 */
			function vclickEvent(self) {
				var element = self.element,
					buttons = element.getElementsByTagName("a"),
					i = 0,
					max,
					activatedButton = selectors.getClosestByTag(event.target, "a"),
					active = 0;

				for (i = 0, max = buttons.length; i < max; i++) {
					if (activatedButton === buttons[i]) {
						active = i;
						break;
					}
				}

				if (self.options.autoChange) {
					setActive(self, active);
				}
			}

			/**
			 * Sets tabbar elements disabled and aria-disabled attributes according
			 * to specified value
			 * @method setDisabled
			 * @private
			 * @static
			 * @param {HTMLElement} element
			 * @param {boolean} value
			 * @param {number} index the element index
			 * @member ns.widget.mobile.TabBar
			 */
			function setDisabled(element, value, index) {
				var liItems = selectors.getChildrenByTag(element.children[0], 'li')[index];

				DOM.setAttribute(liItems, 'disabled', value);
				DOM.setAttribute(liItems, 'aria-disabled', value);
				if (value) {
					liItems.classList.add(ButtonClasses.uiDisabled);
				} else {
					liItems.classList.remove(ButtonClasses.uiDisabled);
				}
			}

			/**
			 * Build method
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._build = function (element) {
				var classes = TabBar.classes,
					tabbarClassList = element.classList,
					links = slice.call(element.getElementsByTagName('a')),
					headers = selectors.getParentsByClass(element, classes.uiHeader),
					scrollview = selectors.getParentsByClass(element, classes.uiScrollviewView)[0],
					li = slice.call(element.getElementsByTagName("li")),
					iconpos,
					i,
					textpos,
					instanceButtonOptions,
					instanceButtonHeaderOptions = {
						shadow: false,
						corners: false,
						inline: false,
						bar: true
					},
					instanceButtonFooterOptions = {
						shadow: true,
						inline: false,
						corners: true,
						bar: false
					};

				if (links.length) {
					iconpos = hasIcon(links) ? this.iconpos : false;
					textpos = links[0].innerHTML.length ? true : false;
				}

				if (headers.length && scrollview) {
					li.forEach(function (item) {
						item.classList.add(classes.tabbarScrollLi);
					});
					slice.call(element.getElementsByTagName("ul")).forEach(function (item) {
						item.classList.add(classes.tabbarScrollUl);
					});

					/* add shadow divider */
					selectors.getParentsByClass(element, classes.uiScrollviewClip).forEach(function (item) {
						item.insertAdjacentHTML('beforeend', '<div class="ui-tabbar-divider ui-tabbar-divider-left" style="display:none"></div><div class="ui-tabbar-divider ui-tabbar-divider-right" style="display:none"></div>');
					});

				} else {
					if (li.length) {
						tabbarClassList.add(classes.uiNavbar);
						slice.call(element.getElementsByTagName("ul")).forEach(function (item) {
							/*
							* @todo delete getAttribute
							*/
							grid.makeGrid(item, element.getAttribute("data-grid") || this.grid);
						});
					}
				}

				if (selectors.getParentsByClass(element, classes.uiFooter).length) {
					li.forEach(function (item) {
						item.classList.add(classes.uiTabBtnStyle);
					});
				}

				/* title tabbar */
				if (selectors.getChildrenByClass(element.parentElement, classes.uiTitle).length) {
					headers.forEach(function (header) {
						header.classList.add(classes.uiTitleTabbar);
					});
				}
				/* scrollable tabbar */
				if (element.parentNode.classList.contains(classes.uiScrollviewView)){
					if (li.length > 4) {
						i = headers.length;
						while (i--) {
							headers[i].classList.add(classes.uiTitleTabbar);
						}

						// scroller was needed when li element has more than forth.
						scrollview.style.width = parseInt(li[0].style.width, 10) * li.length + "px";
						this._ui.scrollview = scrollview;
						this._ui.scrollviewClip = selectors.getParentsByClass(element, classes.uiScrollviewClip)[0];
					}

				}

				if (!iconpos) {
					tabbarClassList.add(classes.uiTabbarNoicons);
				}
				if (!textpos) {
					tabbarClassList.add(classes.uiTabbarNotext);
				}
				if (textpos && iconpos) {
					headers.forEach(function (header) {
						header.classList.add(classes.uiTitleTabbarMultiline);
					});
				}

				if (links.length) {
					if (headers.length) {
						instanceButtonOptions = instanceButtonHeaderOptions;
					} else {
						instanceButtonOptions = instanceButtonFooterOptions;
					}
					if (iconpos) {
						instanceButtonOptions.iconpos = iconpos;
					}
					links.forEach(function (item) {
						DOM.setNSData(item, "role", "button");
						engine.instanceWidget(item, "Button", instanceButtonOptions);
					});
				}

				if (element.getElementsByClassName(classes.uiStatePersist).length) {
					tabbarClassList.add(classes.uiTabbarPersist);
				}

				tabbarClassList.add(classes.uiTabbar);

				return element;
			};

			/**
			 * Init method
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.TabBar
			 * @protected
			 */
			TabBar.prototype._init = function (element) {
				var self = this,
					tabbarClassList = element.classList,
					li = slice.call(element.getElementsByTagName("li")),
					innerWidth = element.offsetWidth ? element.offsetWidth : window.innerWidth,
					innerHeight = element.offsetHeight ? element.offsetHeight : window.innerHeight,
					inHeaders = !!(selectors.getParentsByClass(element, classes.uiHeader).length),
					isLandscape = innerWidth > innerHeight,
					btnActiveClass = ButtonClasses.uiBtnActive,
					uiTabbarActive = classes.uiTabbarActive,
					links = slice.call(element.getElementsByTagName('a'));

				if (li.length > 4) {
					// tabbar elements should be showed maximum forth elements.
					this._setWidth(li, innerWidth / 4, inHeaders);
				} else {
					this._setWidth(li, innerWidth / li.length, inHeaders);
				}

				if (isLandscape) {
					tabbarClassList.remove(classes.uiPortraitTabbar);
					tabbarClassList.add(classes.uiLandscapeTabbar);
				} else {
					tabbarClassList.remove(classes.uiLandscapeTabbar);
					tabbarClassList.add(classes.uiPortraitTabbar);
				}

				[].forEach.call(links, function(element, index) {
					if (element.classList.contains(btnActiveClass) || element.classList.contains(uiTabbarActive)) {
						self.options.active = index;
					}
				});

				setActive(self, self.options.active);
			};

			/**
			 * Bind events for widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._bindEvents = function () {
				this.vclickCallback = vclickEvent.bind(null, this);
				this.element.addEventListener("vclick", this.vclickCallback, false);
				if (this._ui.scrollviewClip) {
					this._ui.scrollviewClip.addEventListener("scrollstop", roundTabBarPositionX);
				}
			};

			/**
			 * Destroy the tab bar
			 *
			 *		@example
			 *		<script>
			 *		var element = document.getElementById("tabbar"),
			 *			tabBarWidget = tau.widget.TabBar(element);
			 *		tabBarWidget.destroy();
			 *
			 *		// or
			 *
			 *		$( "#tabbar" ).tabbar( "destroy" );
			 *		</script>
			 *
			 * @method destroy
			 * @chainable
			 * @member ns.widget.mobile.TabBar
			 */

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._destroy = function () {
				this.element.removeEventListener("vclick", this.vclickCallback, false);
				if (this._ui.scrollviewClip) {
					this._ui.scrollviewClip.removeEventListener("scrollstop", roundTabBarPositionX);
				}
			};

			/**
			 * Set width method
			 * @method _setWidth
			 * @param {Array} elements
			 * @param {number} width
			 * @param {boolean} setOnLink
			 * @member ns.widget.mobile.TabBar
			 * @protected
			 */
			TabBar.prototype._setWidth = function (elements, width, setOnLink) {
				var i,
					length = elements.length,
					element,
					linkElement,
					elementWidth = width + "px",
					linkWidth = width + "px";
				for (i = 0; i < length; i++) {
					element = elements[i];
					element.style.width = elementWidth;
					linkElement = selectors.getChildrenByTag(element, "a")[0];
					if (linkElement && setOnLink) {
						linkElement.style.width = linkWidth;
					}
				}
			};

			/**
			 * Move scroll to position from left border of li element
			 * @method roundTabBarPositionX
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TabBar
			 */
			function roundTabBarPositionX(event) {
				var element = event.target,
					lastX = element.scrollLeft,
					liWidth = parseInt(element.getElementsByTagName("li")[0].style.width),
					interval = lastX % liWidth,
					middle = liWidth / 2,
					scrollViewWidget = engine.instanceWidget(element, "Scrollview");

				if (interval !== 0) {
					if (interval <= middle) {
						scrollViewWidget.scrollTo(lastX - interval, 0, 500);
					} else {
						scrollViewWidget.scrollTo(lastX + (liWidth - interval), 0, 500);
					}
				}
			}

			/**
			 * Disables the tab bar
			 *
			 * Method add disabled attribute on tab bar and changes look
			 * of search bar to enabled state.
			 *
			 *		@example
			 *		<script>
			 *		var element = document.getElementById("tabbar"),
			 *			tabBarWidget = tau.widget.TabBar(element);
			 *		tabBarWidget.disable();
			 *
			 *		// or
			 *
			 *		$( "#tabbar" ).tabbar( "disable" );
			 *		</script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.TabBar
			 */

			/**
			 * Disables specified element in tabbar
			 * @method _disable
			 * @param {HTMLElement} element
			 * @param {number} index the element index
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._disable = function (element, index) {
				if (index !== undefined) {
					setDisabled(element, true, index);
				}
			};

			/**
			 * Enable the tab bar
			 *
			 * Method removes disabled attribute on tab bar and changes look
			 * of tab bar to enabled state.
			 *
			 *		@example
			 *		<script>
			 *		var element = document.getElementById("tabbar"),
			 *			tabBarWidget = tau.widget.TabBar(element);
			 *		tabBarWidget.enable();
			 *
			 *		// or
			 *
			 *		$( "#tabbar" ).tabbar( "enable" );
			 *		</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.TabBar
			 */

			/**
			 * Enables specified element in tabbar
			 * @method _enable
			 * @param {HTMLElement} element
			 * @param {number} index the element index
			 * @protected
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._enable = function (element, index) {
				if (index !== undefined) {
					setDisabled(element, false, index);
				}
			};

			/**
			 * Refresh Tabbar widget.
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.TabBar
			 */
			TabBar.prototype._refresh = function () {
				setActive(this, this.options.active);
			}

			/**
			 * Value method is not supported in this widget.
			 *
			 * @method value
			 * @chainable
			 * @member ns.widget.mobile.TabBar
			 */

			ns.widget.mobile.TabBar = TabBar;
			engine.defineWidget(
				"TabBar",
				"[data-role='tabbar'], .ui-tabbar",
				[],
				TabBar,
				'tizen'
			);
			}(window.document, ns));

/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true */
/**
 * #Control Group Widget
 * Controlgroup widget improves the styling of a group of buttons by grouping them to form a single block.
 *
 * ##Default selectors
 * In default all divs with _data-role=controlgroup_ are changed to Controlgroup widget.
 *
 * ##HTML Examples
 *
 * ### Create Controlgroup
 *
 *		@example
 *		<div data-role="controlgroup">
 *			<a href="#" data-role="button">Yes</a>
 *			<a href="#" data-role="button">No</a>
 *			<a href="#" data-role="button">Cancel</a>
 *		</div>
 *
 * @class ns.widget.mobile.Controlgroup
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	
				/**
			* Alias for class ns.widget.mobile.Controlgroup
			* @method Controlgroup
			* @member ns.widget.mobile.Controlgroup
			* @private
			* @static
			*/
			var Controlgroup = function () {
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {"vertical"|"horizontal"} [options.type="vertical"] Direction of widget
					 * @property {boolean} [options.shadow=false] Shadow of Controlgroup
					 * @property {boolean} [options.excludeInvisible=false] Flag specifying exclusion of invisible elements
					 * @property {boolean} [options.mini=false] Size of Controlgroup
					 * @member ns.widget.mobile.Controlgroup
					 */
					this.options = {
						type: 'vertical',
						shadow: false,
						excludeInvisible: false,
						mini: false
					};
				},
				/**
				* @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
				* @member ns.widget.mobile.Controlgroup
				* @private
				* @static
				*/
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* @property {Object} engine Alias for class ns.engine
				* @member ns.widget.mobile.Controlgroup
				* @private
				* @static
				*/
				engine = ns.engine,
				/**
				* @property {Object} dom Alias for class ns.util.DOM
				* @member ns.widget.mobile.Controlgroup
				* @private
				* @static
				*/
				dom = ns.util.DOM,
				/**
				* @property {Object} selectors Alias for class ns.util.selectors
				* @private
				* @static
				*/
				selectors = ns.util.selectors,
				/**
				* @property {Function} slice Alias for function Array.slice
				* @private
				* @static
				*/
				slice = [].slice;

			Controlgroup.prototype = new BaseWidget();

			/**
			 * Dictionary for Controlgroup related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.Controlgroup
			 * @static
			 */
			Controlgroup.classes = {
				cornerAll: 'ui-btn-corner-all',
				cornerTop: 'ui-corner-top',
				cornerBottom: 'ui-corner-bottom',
				cornerLeft: 'ui-corner-left',
				cornerRight: 'ui-corner-right',
				controlGroupLast: 'ui-controlgroup-last',
				shadow: 'ui-shadow',
				mini: 'ui-mini',
				controlGroup: 'ui-controlgroup',
				typePrefix: 'ui-controlgroup-',
				controlGroupLabel: 'ui-controlgroup-label',
				controlGroupControls: 'ui-controlgroup-controls',
				controlGroupCornerAll: 'ui-corner-all'
			};

			/**
			* Applies css styles to Controlgroup elements
			* @method flipClasses
			* @param {Array} elements Array of Controlgroup elements
			* @param {Array} cornersClasses Array of css styles for first and last element
			* @private
			* @static
			* @member ns.widget.mobile.Controlgroup
			*/
			function flipClasses(elements, cornersClasses) {
				var len = elements.length,
					lastElementClassList,
					classes = Controlgroup.classes;

				if (!len) {
					return;
				}

				elements.forEach(function (element) {
					var classList = element.classList;

					classList.remove(classes.cornerAll);
					classList.remove(classes.cornerTop);
					classList.remove(classes.cornerBottom);
					classList.remove(classes.cornerLeft);
					classList.remove(classes.cornerRight);
					classList.remove(classes.controlgroupLast);
					classList.remove(classes.shadow);
				});

				elements[0].classList.add(cornersClasses[0]);
				lastElementClassList = elements[len - 1].classList;
				lastElementClassList.add(cornersClasses[1]);
				lastElementClassList.add(classes.controlGroupLast);
			}

			/**
			* Builds structure of Controlgroup widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.mobile.Controlgroup
			* @instance
			*/
			Controlgroup.prototype._build = function (element) {
				var classes = Controlgroup.classes,
					elementClassList = element.classList,
					options = this.options,
					groupLegend = selectors.getChildrenByTag(element, 'legend'),
					groupHeading = selectors.getChildrenByClass(element, classes.controlGroupLabel),
					groupControls,
					cornersClasses,
					legend,
					content;

				/*
				* if (groupControls.length) {
				*   //@todo unwrap content
				* }
				*/

				dom.wrapInHTML(element.childNodes, "<div class='" + classes.controlGroupControls + "'></div>");
				groupControls = selectors.getChildrenByClass(element, classes.controlGroupControls)[0];


				if (groupLegend.length) {
					//existing label is replaced with stylable div
					legend = document.createElement('div');
					legend.classList.add(classes.controlGroupLabel);
					legend.innerHTML = groupLegend[0].innerHTML;
					dom.insertNodesBefore(element.childNodes[0], legend);
					groupLegend.forEach(function (item) {
						item.parentNode.removeChild(item);
					});
				} else if (groupHeading.length) {
					dom.insertNodesBefore(element.childNodes[0], groupHeading);
				}

				cornersClasses = options.type === 'horizontal' ?
						[classes.cornerLeft, classes.cornerRight] : [classes.cornerTop, classes.cornerBottom];

				elementClassList.add(classes.controlGroupCornerAll);
				elementClassList.add(classes.controlGroup);
				elementClassList.add(classes.typePrefix + options.type);

				//Make all the control group elements the same width
				if (groupControls) {
					this._setWidthForButtons(groupControls);
				}

				content = slice.call(element.querySelectorAll('.ui-btn')).filter(function (item) {
					//@todo filter visiblity when excludeInvisible option is set
					return !item.classList.contains('ui-slider-handle');
				});

				if (options.shadow) {
					elementClassList.add(classes.shadow);
				}

				if (options.mini) {
					elementClassList.add(classes.mini);
				}

				flipClasses(content, cornersClasses);
				flipClasses(slice.call(element.querySelectorAll('.ui-btn-inner')), cornersClasses);

				return element;
			};

			Controlgroup.prototype._setWidthForButtons = function (groupControls) {
				var controlElements,
					controlElementsLength,
					widthSize,
					i;
				controlElements = selectors.getChildrenByTag(groupControls, 'a');
				controlElementsLength = controlElements.length;
				widthSize = 100 / controlElementsLength;
				for(i = 0; i < controlElementsLength; i++) {
					engine.instanceWidget(controlElements[i], 'Button');
					controlElements[i].style.width = widthSize + '%';
				}
			};

			// definition
			ns.widget.mobile.Controlgroup = Controlgroup;
			engine.defineWidget(
				"Controlgroup",
				"[data-role='controlgroup'], .ui-controlgroup",
				[],
				Controlgroup,
				'mobile'
			);

			}(window.document, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Control Group Widget
 * Controlgroup widget improves the styling of a group of buttons by grouping them to form a single block.
 *
 * @class ns.widget.tv.Controlgroup
 * @extends ns.widget.mobile.Controlgroup
 */
(function (document, ns) {
	
	
			var MobileControlGroup = ns.widget.mobile.Controlgroup,
				engine = ns.engine,
				selectors = ns.util.selectors,

				ControlGroup = function () {
					MobileControlGroup.call(this);
				},
				classes = MobileControlGroup.classes,
				prototype = new MobileControlGroup();

			ControlGroup.prototype = prototype;
			ControlGroup.classes = classes;

			prototype._setWidthForButtons = function (groupControls) {
				var controlElements,
					controlElementsLength,
					widthSize,
					i;
				controlElements = selectors.getChildrenByTag(groupControls, "a");
				controlElementsLength = controlElements.length;
				// because buttons have margin, we have to do correction of size
				widthSize = 100 / controlElementsLength - 3;
				for (i = 0; i < controlElementsLength; i++) {
					engine.instanceWidget(controlElements[i], "Button");
					controlElements[i].style.width = widthSize + "%";
				}
			};

			ns.widget.tv.ControlGroup = ControlGroup;

			engine.defineWidget(
				"Controlgroup",
				"[data-role='controlgroup'], .ui-controlgroup",
				[],
				ControlGroup,
				"tv",
				true
			);
			}(window.document, ns));

/*global define, window */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (ns) {
	
				if (ns.getConfig("autorun", true) === true) {
				ns.engine.run();
			}
			}(ns));

/*global window, define*/
/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Application Page Layout
 *
 * In the mobile Tizen Advanced UI framework (TAU) the page and its elements
 * (header, content, and footer) are all <div> blocks with a specific data-role
 * property. The header is placed at the top, and displays the page title.
 * The content is the area below the header, showing the main content of the
 * page. The footer is at the bottom, and contains the page menu.
 *
 * The following table describes the specific information for each section.
 *
 * <table>
 * <caption>Table: Page sections</caption>
 * <tbody>
 * <tr>
 * <th style="width:10%;">Section</th>
 * <th>data-role</th>
 * <th>Description</th>
 * </tr>
 * <tr>
 * <td>Page</td>
 * <td><span style="font-family: Courier New,Courier,monospace">"page"</span></td>
 * <td><p>Defines the element as a page.</p>
 * <p>The page widget is used to manage a single item in a page-based architecture.</p>
 * <p>A page is composed of header (optional), content (mandatory), and footer (optional) elements.</p></td>
 * </tr>
 * <tr>
 * <td>Header</td>
 * <td><span style="font-family: Courier New,Courier,monospace">"header"</span></td>
 * <td><p>Defines the element as a header.</p>
 * <p>As the Tizen Wearable device screen size is small, avoid using the header element.</p></td>
 * </tr>
 * <tr>
 * <td>Content</td>
 * <td><span style="font-family: Courier New,Courier,monospace">"content"</span></td>
 * <td><p>Defines the element as content.</p></td>
 * </tr>
 * <tr>
 * <td>Footer</td>
 * <td><span style="font-family: Courier New,Courier,monospace">"footer"</span></td>
 * <td><p>Defines the element as a footer.</p>
 * <p>The footer section is mostly used to include option buttons.</p></td>
 * </tr>
 * </tbody>
 * </table>
 *
 * To add a page to the application, use the following code:
 *
 * 		@example
 * 		<div data-role="page">
 *			<!--Page area-->
 *			<div data-role="header"><!--Header area--></div>
 *			<div data-role="content"><!--Content area--></div>
 *			<div data-role="footer"><!--Footer area--></div>
 *		</div>
 *
 * In your application, you can:
 *
 * - [Create multi-page layouts](multipage.htm)
 * - [Change the active page](change.htm)
 * - [Handle page events and method](pageevents.htm)
 *
 * @page ns.page.layout
 * @seeMore ../index.htm Tizen Advanced UI Framework
 */
;
/*global window, define*/
/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Multi-page Layout
 *
 * You can implement a template containing multiple page containers in the application index.html file.
 *
 * In the multi-page layout, we can define multi pages with data-role="page" attribute.
 *
 * You can link to internal pages by referring to the ID of the page. For example, to link to the page with an ID of two, the link element needs the href="#two" attribute in the code, as in the following example.
 *
 * 		@example
 * 		<div data-role="page" id="main">
 *			<div data-role="header" data-position="fixed">
 *				<!--Header-->
 *			</div>
 *			<div data-role="content">
 *				<a href="#two"data-role="button">TWO</a>
 *			</div>
 *		</div>
 *		<div data-role="page" id="two">
 *			<div data-role="header" data-position="fixed">
 *				<!--Header-->
 *			</div>
 *			<div data-role="content">
 *				<!--Content-->
 *			</div>
 *		</div>
 *
 * To find the currently active page, use the ui-page-active class.
 *
 * @page ns.page.multipage
 * @seeMore layout.htm Application Page Layout
 */
;
/*global window, define*/
/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Changing Pages
 *
 * With TAU library, we can change page by method *changePage*.
 *
 * The following table lists the methods you can use to change the active page.
 *
 *!!!When you want to change pages with TAU, *DO NOT USE* _location.href_ or
 * _location.replace. TAU have self-method of managing histories. But when you
 * use above methods, it would lead to confusion. If you want to change pages,
 * you can use _tau.changePage()_ and _tau.back()_.!!!
 * ##Page changing methods
 * ### Summary
 *<table class="informaltable">
 *<thead>
 *<tr>
 *<th>Method</th>
 *<th>Description</th>
 *</tr>
 *</thead>
 *<tbody>
 *
 *
 *<tr>
 *<td>
 *<pre class="intable prettyprint"><a href="#method-changePage">tau.changePage</a> (toPage, options) </pre>
 *</td>
 *<td><p>Programmatically change to another page. The <span style="font-family: Courier New,Courier,monospace">to</span> argument is a page object or string.</p></td>
 *</tr>
 *
 *
 *
 *<tr>
 *<td>
 *<pre class="intable prettyprint"><a href="#method-back">tau.back</a> (  ) </pre>
 *</td>
 *<td><p>Loads the previous page in the history list.</p></td>
 *</tr>
 *</tbody>
 *</table>
 *
 *<dt class="method" id="addidp28072"><code><b><span class="methodName"
 *id="method-changePage">tau.changePage</span></b></code></dt>
 *<dd>
 *<div class="brief">
 *<p>Programmatically change to another page.</p>
 *</div>
 *<div class="synopsis">
 *<pre class="signature prettyprint">tau.changePage (toPage, options) </pre>
 *</div>
 *
 *<div class="description">
 *<p>
 *
 *</p>
 *</div>
 *
 *<div class="parameters">
 *<p><span class="param">Parameters:</span></p>
 *<table>
 *<tbody>
 *<tr>
 *<th>Parameter</th>
 *<th>Type</th>
 *<th>Required / optional</th>
 *<th>Description</th>
 *</tr>
 *
 *
 *<tr>
 *<td><span style="font-family: Courier New,Courier,monospace">toPage</span></td>
 *<td>HTMLElement | string</td>
 *<td>required</td>
 *<td>page to move <br>HTML element or relative url of page.</td>
 *</tr>
 *
 *<tr>
 *<td><span style="font-family: Courier New,Courier,monospace">options</span></td>
 *<td>Object</td>
 *<td>optional</td>
 *<td>options to change pages.</td>
 *</tr>
 *</table></tbody></div>
 *
 *<div class="parameters">
 *<p><span class="param">Options for changePage():</span></p>
 *<table>
 *<tbody>
 *<tr>
 *<th>option</th>
 *<th>Type</th>
 *<th>value</th>
 *<th>Description</th>
 *</tr>
 *
 *
 *<tr>
 *<td><span style="font-family: Courier New,Courier,monospace">transition</span></td>
 *<td>string</td>
 *<td>'sequential' | 'simultaneous' | 'flip' |'depth' | 'pop' | 'slide' |'turn'</td>
 *<td>transition for opening page</td>
 *</tr>
 *
 *<tr>
 *<td><span style="font-family: Courier New,Courier,monospace">reverse</span></td>
 *<td>boolean</td>
 *<td>true | false</td>
 *<td>true, if transition should be reversed</td>
 *</tr>
 *</table></tbody></div>
 *
 *<div class="example">
 *<span class="example"><p>Code
 *example (using HTML Element):</p><p></p></span>
 *<pre name="code" class="examplecode
 *prettyprint">
 *&lt;div data-role=&quot;page&quot; id=&quot;main&quot;&gt;...&lt;/div&gt;
 *&lt;script&gt;
 *var element = document.getElementById("main");
 *tau.changePage(element, {transition:'flip',reverse:false});
 *&lt;/script&gt;
 *</pre>
 *</div>
 *
 *<div class="example">
 *<span class="example"><p>Code
 *example2 (using url string):</p><p></p></span>
 *<pre name="code" class="examplecode
 *prettyprint">
 * // This is "index.html" and if there is "subPage.html" in same directory.
 *&lt;script&gt;
 *tau.changePage("subPage.html");
 *&lt;/script&gt;
 *</pre>
 *</div>
 *
 *
 *</dd>
 *
 *
 *<dt class="method" id="addidp28072"><code><b><span class="methodName"
 *id="method-back">back</span></b></code></dt>
 *<dd>
 *<div class="brief">
 *<p>Loads the previous page in the history list.</p>
 *</div>
 *<div class="synopsis">
 *<pre class="signature prettyprint">back ( ) </pre>
 *</div>
 *
 *<div class="description">
 *<p>
 *<b>Same as:</b> window.history.back()
 *</p>
 *</div>
 *
 *
 *
 *</div>
 *<div class="example">
 *<span class="example"><p>Code
 *example:</p><p></p></span>
 *<pre name="code" class="examplecode
 *prettyprint">
 *&lt;script&gt;
 *tau.back();
 *&lt;/script&gt;
 *</pre>
 *</div>
 *
 *
 *</dd>
 *
 * @page ns.page.change
 * @seeMore layout.htm Application Page Layout
 */
;
/*global window, define*/
/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Handling Page Events and Methods
 *
 * TAU support "Page" as widget. So, when the page is created, it has several
 * events and methods. In this document, we would introduce events and methods in
 * TAU Page Widget.
 *
 * ## Events list
 *
 * The following table lists the events related to pages.
 *
 * <table>
 * <tbody>
 * <tr>
 * <th>Name</th>
 * <th>Description</th>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pagebeforchange</span></td>
 * <td><p>Triggered before switching current page</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pagebeforecreate</span></td>
 * <td><p>Triggered before the widget is created and initialized</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pagebeforehide</span></td>
 * <td><p>Triggered before current page is about to be closed</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pagebeforeload</span></td>
 * <td><p>Triggered before external page will be loaded</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pagebeforeshow</span></td>
 * <td><p>Triggered before page will be displayed</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pagechange</span></td>
 * <td><p>Triggered after switching current page</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pagechangefailed</span></td>
 * <td><p>Triggered when page switching failed</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pagecreate</span></td>
 * <td><p>Triggered after widget creation</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pagehide</span></td>
 * <td><p>Triggered after the page is hidden</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pageinit</span></td>
 * <td><p>Triggered after widget initialization occurs</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pageload</span></td>
 * <td><p>Triggered after an external page is loaded</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pagremove</span></td>
 * <td><p>Triggered after the external page is removed from the DOM</p></td>
 * </tr>
 *
 * <tr>
 * <td class="option"><span style="font-family: Courier New,Courier,monospace">pageshow</span></td>
 * <td><p>Triggered after the page is displayed</p></td>
 * </tr>
 *
 * </tbody>
 * </table>
 *
 * ## Binding H/W Back Key event
 *
 * To bind an event callback on the Back key, use the following code:
 *
 * 		@example
 * 		// JavaScript code
 *		window.addEventListener('tizenhwkey', function(ev)
 *			{
 *				if (ev.originalEvent.keyName == "back")
 *					{
 *					// Call window.history.back() to go to previous browser window
 *					// Call tizen.application.getCurrentApplication().exit() to exit application
 *					// Add script to add another behavior
 *					}
 *			});
 *
 * @page ns.page.pageevents
 * @seeMore layout.htm Application Page Layout
 */
;
/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Design
 *
 * Application for TV have bigger screen in comparison with mobile or wearable
 * application. This indicates special design for good user experience.
 * You have to remember that bigger screen does not mean that you have to add
 * more element because user look for this screen with few metres distance.
 *
 * @page ns.page.designIntroduction
 * @seeMore introduction.htm Design guide
 */
;
/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Pages
 *
 * Page is a one screen view of application and is the base part of application
 * layout.
 *
 * ##Different sizes
 *
 * ##Backgrounds
 *
 * ##Headers and footers
 *
 * ##Two columns layout
 *
 * ##Navigation between pages
 *
 * @page ns.page.designPage
 * @seeMore introduction.htm Design guide
 */
;
/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Elements
 * ...
 *
 * ##Containers of blocks
 *
 * ###Lists
 *
 * ###Grids
 *
 * ##Buttons and icons
 *
 * ##Drawer
 *
 * ## Screen resolution
 *
 * ##Colors
 *
 * ##Typography
 *
 * @page ns.page.designElements
 * @seeMore introduction.htm Design guide
 */
;
/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Navigation
 *
 * In TV profile good navigation design is very important. User utilises remote
 * for navigation and can move only to neighborhood's elements.
 *
 * ##Standard navigation
 *
 * ###Navigation inside page
 *
 * ###Navigation inside popup
 *
 * ##Defining own navigation
 *
 * @page ns.page.designNavigation
 * @seeMore introduction.htm Design guide
 */
;
/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Differences in comparison with wearable or mobile profile
 *
 * TAU for TV based on the same code as TAU for wearable and mobile. But in a
 * few widgets you will find differences in behaviour or look.
 *
 * ##Input differences
 *
 * On mobile or wearable profile you have a touch screen and you use your finger
 * to navigate. In TV profile you use remote with arrow keyboard or remote with
 * mouse cursor for navigation.
 *
 * ###TextInput
 *
 * ###Slider
 *
 * ###Context Popup
 *
 * @page ns.page.differencesIntroduction
 * @seeMore introduction.htm Design guide
 */
;
/*global define */
/**
 * #Tizen Advanced UI Framework
 *
 * Tizen Advanced UI Framework (TAU) is new name of Tizen Web UI framework.
 * It provides tools, such as widgets, events, effects, and animations for Web
 * application development. You can leverage these tools by just selecting the
 * required screen elements and creating applications.
 *
 * TAU service is based on a template and works on a Web browser, which runs on
 * the WebKit engine. You can code Web applications using the TAU, standard
 * HTML5, and Tizen device APIs. You can also use different widgets with CSS
 * animations and rendering optimized for Tizen Web browsers.
 *
 * For more information about the basic structure of a page in the Web
 * application using the TAU, see
 * [Application Page Structure](page/app_page_layout.htm).
 *
 * ##Framework Services
 *
 * The Web UI framework consists of the following services:
 *
 *  - Page navigation
 *
 *    Navigation JavaScript library is provided to allow smooth navigation
 *    between TAU based application [pages](page/layout.htm).
 *  - Web widgets and themes
 *
 *    We support APIs and CSS themes for Tizen web [widgets](widget/widget_reference.htm)
 *  - Element Events
 *
 *    Some special [events](event/event_reference.htm) are available with TAU
 *    that optimized for the Web applications.
 *  - Useful utility
 *
 *    Some special [utility](util/util_reference.htm) are available with TAU
 *    that supporting easy DOM methods for the Web applications.
 *
 * ##Design TV applications
 * If you want create user friendly TV application you should read this part of
 * the guide:
 *
 *  - [introduction](page/designIntroduction.htm)
 *  - [page](page/designPage.htm)
 *  - [navigation](page/designNavigation.htm)
 *  - [elements](page/designElements.htm)
 *
 * If you used mobile or wearable TAU please read about differences between
 * profiles:
 *
 *  - [introduction](page/differencesIntroduction.htm)
 *
 * !!!The framework runs only on browsers supporting the HTML5/CSS standards.
 * The draft version of the W3C specification is not fully supported.!!!
 * @class ns
 * @title Tizen Advanced UI Framework
 */

}(window, window.document));
