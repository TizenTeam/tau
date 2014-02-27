/*global window, define */
/*jslint nomen: true, plusplus: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 * @class ns.engine
 * Main class with engine of library
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
			"./core",
			"./utils/events"
		],
		function (require) {
			//>>excludeEnd("ejBuildExclude");
			/**
			 * @method slice {@alias [].slice}
			 * @private
			 * @static
			 * @memberOf ns.engine
			 */
			var slice = [].slice,
				/**
				 * @property {Object} eventUtils {@alias ns.utils.events}
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
				/**
				 * @property {HTMLBodyElement} body local alias to document.body
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				body = document.body,
				location = window.location,
				/**
				 * @property {boolean} justBuild engine mode, if true then engine only builds widgets
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				justBuild = window.location.hash === "#build",
				/**
				* Returns trimmed value
				* @method trim
				* @param {string} value
				* @return {string} trimmed string
				* @static
				* @private
				*/
				trim = function (value) {
					return value.trim();
				},
				/**
				 * @property {string} [typeString="string"] local cache of string type name
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				typeString = "string",
				/**
				 * @property {string} [dataEjBuilt="data-ej-built"] attribute informs that widget id build
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				dataEjBuilt = "data-ej-built",
				/**
				 * @property {string} [dataEjName="data-ej-name"] attribute contains widget name
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				dataEjName = "data-ej-name",
				/**
				 * @property {string} [dataEjBound="data-ej-bound"] attribute informs that widget id bound
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				dataEjBound = "data-ej-bound",
				/**
				 * @property {string} [dataEjSelector="data-ej-selector"] attribute contains widget selector
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				dataEjSelector = "data-ej-selector",
				/**
				 * @property {string} [dataEjBinding="data-ej-binding"] attribute contains widget binding
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				dataEjBinding = "data-ej-binding",
				/**
				 * @property {string} [querySelectorWidgets="*[' + dataEjBuilt + '=true][' + dataEjBinding + '][' + dataEjSelector + '][' + dataEjName + ']:not([' + dataEjBound + '])"] query selector for all widgets which are built but not bound
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				querySelectorWidgets = '*[' + dataEjBuilt + '=true][' + dataEjBinding + '][' + dataEjSelector + '][' + dataEjName + ']:not([' + dataEjBound + '])',
				/**
				 * @property {string} [excludeBuiltAndBound=":not([" + dataEjBuilt + "]):not([" + dataEjBound + "])"] attribute contains widget binding
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				excludeBuiltAndBound = ":not([" + dataEjBuilt + "]):not([" + dataEjBound + "])",
				/**
				 * @property {string} [eventBound="bound"] name of bound event
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */				
				eventBound = "bound",
				/**
				 * @property {string} [eventWidgetBuilt="widgetbuilt"] name of widget built event
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				eventWidgetBuilt = "widgetbuilt",
				/**
				 * @property {string} [eventWidgetBuilt="widgetbound"] name of widget bound event
				 * @private
				 * @static
				 * @memberOf ns.engine
				 */
				eventWidgetBound = "widgetbound",
				engine;

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
			* @return {boolean}
			* @memberOf ns.engine
			* @static
			*/
			function defineWidget(name, binding, selector, methods, widgetClass, namespace, redefine) {
				var definition;
				if (!widgetDefs[name] || redefine) {
					//>>excludeStart("ejDebug", pragmas.ejDebug);
					ns.log('defining widget:', name);
					//>>excludeEnd("ejDebug");
					if (!methods) {
						methods = [];
					}
					methods.push('destroy', 'disable', 'enable', 'option', 'refresh', 'value');
					definition = {
						name: name,
						methods: methods,
						selector: selector || "",
						selectors: selector ? selector.split(',').map(trim) : [],
						binding: binding || "",
						widgetClass: widgetClass || null,
						namespace: namespace || ""
					};

					widgetDefs[name] = definition;
					eventUtils.trigger(document, "widgetdefined", definition, false);
					return true;
				}
				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.warn('widget already defined:', name);
				//>>excludeEnd("ejDebug");
				return false;
			}

			/**
			* Load widget
			* @method processWidget
			* @param {Object} definition definition of widget
			* @param {Object} definition.binding
			* @param {Object} definition.widgetClass
			* @param {string} definition.name
			* @param {string} template
			* @param {HTMLElement} element base element of widget
			* @param {Object} [options] options for widget
			* @private
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
						ns.log("processing widget:", definition.name, "on element:", element.tagName + "#" + (element.id || "--no--id--"));
						//>>excludeEnd("ejDebug");
						widgetInstance.configure(definition, element, options);

						if (typeof createFunction === "function") {
							element.addEventListener(definition.name.toLowerCase() + 'create', createFunction, false);
						}

						if (element.id) {
							widgetInstance.id = element.id;
						}

						if (element.getAttribute(dataEjBuilt) !== "true") {
							element = widgetInstance.build(template, element);
						}

						if (element) {
							widgetInstance.element = element;

							setBinding(element, widgetInstance);

							postBuildCallback = function (element) {
								element.removeEventListener(eventWidgetBuilt, postBuildCallback, true);
								if (!engine.justBuild) {
									widgetInstance.init(element);
									widgetInstance.bindEvents(element);
								} else {
									widgetInstance.bindEvents(element, true);
								}
								eventUtils.trigger(element, eventWidgetBound, widgetInstance, false);
								eventUtils.trigger(body, eventWidgetBound, widgetInstance);
							}.bind(null, element);

							element.addEventListener(eventWidgetBuilt, postBuildCallback, true);
							eventUtils.trigger(element, eventWidgetBuilt, widgetInstance, false);
						} else {
							//>>excludeStart("ejDebug", pragmas.ejDebug);
							ns.error('There was problem with building widget ' + widgetInstance.widgetName + ' on element with id ' + widgetInstance.id + '.');
							//>>excludeEnd("ejDebug");
						}
					}
					//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
				});
				//>>excludeEnd("ejBuildExclude");
			}

			/**
			* @method destroyWidget Call destroy method of widget and it's child. Remove bindings.
			* @param {string} widgetId
			* @param {boolean} [childOnly=false] destroy only widget on children elements
			* @static
			* @memberOf ns.engine
			*/
			function destroyWidget(widgetId, childOnly) {
				var widgetInstance = getBinding(widgetId),
					childWidgets,
					elementCache,
					i;

				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.log('removing widget:', widgetId);
				//>>excludeEnd("ejDebug");

				// getBinding returns .instance directly in return statement
				// no need to access .instance property manually
				if (widgetInstance) {
					//cache widgets HTML Element
					elementCache = widgetInstance.element;

					if (!childOnly) {
						//Destroy widget
						widgetInstance.destroy();
					}

					//Destroy child widgets, if there something left.
					childWidgets = slice.call(elementCache.querySelectorAll("[" + dataEjBound + "='true']"));
					for (i = childWidgets.length - 1; i >= 0; i -= 1) {
						if (childWidgets[i]) {
							destroyWidget(childWidgets[i].id);
						}
					}

					removeBinding(widgetId);
				}
			}

			/**
			* Load widgets from data-* definition
			* @method processHollowWidget
			* @param {Object} _definition widget definition
			* @param {HTMLElement} element base element of widget
			* @param {Object} [options] options for create widget
			* @private
			* @static
			* @memberOf ns.engine
			*/
			function processHollowWidget(_definition, element, options) {
				var name = element.getAttribute(dataEjName),
					definition = _definition || (name && widgetDefs[name] ?
							widgetDefs[name] : {
						"name": name,
						"selector": element.getAttribute(dataEjSelector),
						"binding": element.getAttribute(dataEjBinding)
					});
				processWidget(definition, null, element, options);
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
					j,
					len = selectorKeys.length,
					lenNormal = 0,
					definition,
					selectors,
					buildQueue = [];

				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.log("start creating widgets on:", context.tagName + '#' + (context.id || '--no-id--'));
				//>>excludeEnd("ejDebug");

				// @TODO EXPERIMENTAL WIDGETS WITHOUT TEMPLATE DEFINITION
				builtWithoutTemplates.forEach(processHollowWidget.bind(null, null));

				/* NORMAL */
				for (i = 0; i < len; ++i) {
					definition = widgetDefs[selectorKeys[i]];
					selectors = definition.selectors;
					if (selectors.length) {
						normal = context.querySelectorAll(selectors.join(excludeBuiltAndBound + ",") + excludeBuiltAndBound);
						for (j = 0, lenNormal = normal.length; j < lenNormal; ++j) {
							//>>excludeStart("ejDebug", pragmas.ejDebug);
							ns.log("Found widget to build " + definition.name + " on:", normal[j].tagName + '#' + (normal[j].id || '--no-id--'));
							//>>excludeEnd("ejDebug");
							buildQueue.push(processHollowWidget.bind(null, definition, normal[j]));
						}
					}
				}

				for (i = 0, len = buildQueue.length; i < len; ++i) {
					buildQueue[i]();
				}

				eventUtils.trigger(body, "built");
				eventUtils.trigger(body, eventBound);
				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.log("finish creating widgets on:", context.tagName + '#' + (context.id || '--no-id--'));
				//>>excludeEnd("ejDebug");
			}

			/**
			* Get binding for element
			* @method getBinding
			* @param {HTMLElement} element
			* @return {?Object}
			* @memberOf ns.engine
			*/
			function getBinding(element) {
				var id = !element || typeof element === typeString ? element : element.id,
						binding,
						bindingInstance,
						bindingElement;

				if (typeof element === 'string') {
					element = document.getElementById(id);
				}

				binding = widgetBindingMap[id];

				if (typeof binding === 'object') {
					bindingInstance = binding.instance;
					//>>excludeStart("ejDebug", pragmas.ejDebug);
					// NOTE: element can exists outside document
					bindingElement = bindingInstance.element;
					if (bindingElement && !bindingElement.ownerDocument.getElementById(bindingElement.id)) {
						ns.warn('Element', bindingElement.id, 'is outside DOM!');
					}
					//>>excludeEnd("ejDebug");

					if (bindingInstance.element === element && bindingInstance.element.getAttribute(dataEjBinding) === 'true') {
						return bindingInstance;
					}
					// Remove garbage
					if (element) {
						bindingInstance.destroy(element);
					}
					bindingInstance.destroy();
				}

				return null;
			}

			/**
			* Set binding of widget
			* @method setBinding
			* @param {HTMLElement} element
			* @param {Object} widgetInstance
			* @static
			* @memberOf ns.engine
			*/
			function setBinding(element, widgetInstance) {
				var id = (typeof element === typeString) ? element : (element && element.id) || widgetInstance.id;

				//>>excludeStart("ejDebug", pragmas.ejDebug);
				if (getBinding(id)) {
					ns.error('Duplicated, binding. Binding on id ' + id + ' was overwritten.');
				}
				//>>excludeEnd("ejDebug");

				widgetBindingMap[id] = {
					'elementId': id,
					'element': widgetInstance.element,
					'binding': widgetInstance.binding,
					'instance': widgetInstance
				};
				if (element) {
					element.setAttribute(dataEjBinding, 'true');
				}
			}

			/**
			* remove binding
			* @method removeBinding
			* @param {HTMLElement} element
			* @memberOf ns.engine
			*/
			function removeBindingAttributes(element) {
				element.removeAttribute(dataEjBuilt);
				element.removeAttribute(dataEjBound);
				element.removeAttribute(dataEjBinding);
				element.removeAttribute(dataEjName);
				element.removeAttribute(dataEjSelector);
			}

			/**
			* Remove binding for widget based on element.
			* @method removeBinding
			* @param {HTMLElement} element
			* @return {boolean}
			* @memberOf ns.engine
			*/
			function removeBinding(element) {
				var id = typeof element === typeString ? element : element.id;

				if (typeof element === 'string') {
					element = document.getElementById(id);
				}

				if (element) {
					removeBindingAttributes(element);
				}
				if (widgetBindingMap[id]) {
					if (widgetBindingMap[id].element && typeof widgetBindingMap[id].element.setAttribute === 'function') {
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
			* @memberOf ns.engine
			*/
			function createEventHandler(event) {
				createWidgets(event.target, false);
			}
/*
			document.addEventListener(eventBound, function () {
				//@TODO dump it to file for faster binding by ids
				window.ejWidgetBindingMap = widgetBindingMap;
			}, false);
*/
			ns.widgetDefinitions = {};
			engine = {
				justBuild: location.hash === "#build",
				/**
				* @property {Object} dataEj
				* @static
				* @memberOf ns.engine
				*/
				dataEj: {
					/**
					 * @property {string} [dataEj.built="data-ej-built"] attribute inform that widget id build
					 * @private
					 * @static
					 * @memberOf ns.engine
					 */
					built: dataEjBuilt,
					/**
					 * @property {string} [dataEj.name="data-ej-name"] attribute contains widget name
					 * @private
					 * @static
					 * @memberOf ns.engine
					 */
					name: dataEjName,
					/**
					 * @property {string} [dataEj.bound="data-ej-bound"] attribute inform that widget id bound
					 * @private
					 * @static
					 * @memberOf ns.engine
					 */
					bound: dataEjBound,
					/**
					 * @property {string} [dataEj.selector="data-ej-selector"] attribute contains widget selector
					 * @private
					 * @static
					 * @memberOf ns.engine
					 */
					selector: dataEjSelector,
					/**
					 * @property {string} [dataEj.binding="data-ej-binding"] attribute contains widget binding
					 * @private
					 * @static
					 * @memberOf ns.engine
					 */
					binding: dataEjBinding
				},
				destroyWidget: destroyWidget,
				createWidgets: createWidgets,

				/**
				* Method to get all definitions of widgets
				* @method getDefinitions
				* @return {Array}
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
				// @TODO either rename or fix functionaly because
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
					widgetBindingMap = window.ejWidgetBindingMap = {};
				},

				/**
				* Build first page
				* @method build
				* @static
				* @memberOf ns.engine
				*/
				build: function () {
					var router = engine.router;
					body = document.body;

					if (router) {
						router.init(engine.justBuild);
					}
					eventUtils.trigger(document, "initrouter", router, false);
				},

				/**
				* Run engine
				* @method run
				* @static
				* @memberOf ns.engine
				*/
				run: function () {
					var router = engine.getRouter();
					engine.stop();
					body = document.body;
					document.addEventListener('create', createEventHandler, false);

					eventUtils.trigger(document, "initengine", engine, false);
					eventUtils.trigger(document, "initevents", ns.events, false);
					eventUtils.trigger(document, "initjqm");
					eventUtils.trigger(document, 'mobileinit');
					eventUtils.trigger(document, "beforeinitrouter", router, false);
					if (document.readyState === 'complete') {
						engine.build();
					} else {
						document.addEventListener('DOMContentLoaded', engine.build.bind(engine));
					}
				},

				/**
				* Return router
				* @method getRouter
				* @static
				* @memberOf ns.engine
				*/
				getRouter: function () {
					return engine.router;
				},

				/**
				* Initialize router. This method should be call in file with router class definition.
				* @method initRouter
				* @param {Object} RouterClass Router class
				* @static
				* @memberOf ns.engine
				*/
				initRouter: function (RouterClass) {
					engine.router = new RouterClass();
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
				* @memberOf {ns.engine}
				*/
				instanceWidget: function (element, name, options) {
					var binding = getBinding(element),
						definition;

					if (!element) {
						ns.error("'element' cannot be empty");
						return;
					}

					if (!binding && widgetDefs[name]) {
						definition = widgetDefs[name];
						processHollowWidget(definition, element, options);
						binding = getBinding(element);
					}
					return binding;
				},

				/**
				* Method to remove all listeners binded in run
				* @method stop
				* @static
				* @memberOf ns.engine
				*/
				stop: function () {
					var router = engine.getRouter();
					if (router) {
						router.destroy();
					}
				},

				/**
				 * Method to change build mode
				 * @method setJustBuild
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

					engine.justBuild = newJustBuild;
				},
				_createEventHandler : createEventHandler
			};
			window.ejWidgetBindingMap = widgetBindingMap;
			ns.engine = engine;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ns.engine;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, ns));
