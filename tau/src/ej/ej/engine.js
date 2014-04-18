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
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"require",
			"../ej",
			"./utils/events"
		],
		function (require) {
			//>>excludeEnd("ejBuildExclude");
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
					//>>excludeStart("ejDebug", pragmas.ejDebug);
					ns.log("defining widget:", name);
					//>>excludeEnd("ejDebug");
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
				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.warn("widget already defined:", name);
				//>>excludeEnd("ejDebug");
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
				//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
				require([definition.binding], function () {
					//>>excludeEnd("ejBuildExclude");
					var widgetOptions = options || {},
						createFunction = widgetOptions.create,
						Widget = definition.widgetClass,
						widgetInstance = Widget ? new Widget(element) : false,
						postBuildCallback;

					if (widgetInstance) {
						//>>excludeStart("ejDebug", pragmas.ejDebug);
						ns.log("processing widget:", definition.name, "fastOn element:", element.tagName + "#" + (element.id || "--no--id--"));
						//>>excludeEnd("ejDebug");
						widgetInstance.configure(definition, element, options);

						if (typeof createFunction === TYPE_FUNCTION) {
							eventUtils.fastOn(element, definition.name.toLowerCase() + "create", createFunction);
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
							//>>excludeStart("ejDebug", pragmas.ejDebug);
							ns.error("There was problem with building widget " + widgetInstance.widgetName + " fastOn element with id " + widgetInstance.id + ".");
							//>>excludeEnd("ejDebug");
						}
					}
					return widgetInstance.element;
					//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
				});
				//>>excludeEnd("ejBuildExclude");
			}

			/**
			* @method Call destroy method of widget and it's child. Remove bindings.
			* @param {HTMLElement|string} element
			* @param {boolean} [childOnly=false] destroy only widget fastOn children elements
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
				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.log("removing widget:", element);
				//>>excludeEnd("ejDebug");

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
			* Build widgets fastOn all children of context element
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

				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.log("start creating widgets fastOn:", context.tagName + "#" + (context.id || "--no-id--"));
				//>>excludeEnd("ejDebug");

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
				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.log("finish creating widgets fastOn:", context.tagName + "#" + (context.id || "--no-id--"));
				//>>excludeEnd("ejDebug");
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
					//>>excludeStart("ejDebug", pragmas.ejDebug);
					// NOTE: element can exists outside document
					bindingElement = bindingInstance.element;
					if (bindingElement && !bindingElement.ownerDocument.getElementById(bindingElement.id)) {
						ns.warn("Element", bindingElement.id, "is outside DOM!");
					}
					//>>excludeEnd("ejDebug");

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

				//>>excludeStart("ejDebug", pragmas.ejDebug);
				if (getBinding(id)) {
					ns.error("Duplicated, binding. Binding fastOn id " + id + " was overwritten.");
				}
				//>>excludeEnd("ejDebug");

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
			 * Remove binding for widget based fastOn element.
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

					eventUtils.fastOn(document, "create", createEventHandler);

					eventUtils.trigger(document, "mobileinit");

					if (document.readyState === "complete") {
						build();
					} else {
						eventUtils.fastOn(document, "DOMContentLoaded", build.bind(engine));
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
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ns.engine;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, ns));
