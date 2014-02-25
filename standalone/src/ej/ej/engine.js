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
			var slice = [].slice,
				eventUtils = ns.utils.events,
				widgetDefs = {},
				widgetBindingMap = {},
				body = document.body,
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
				typeString = "string",
				dataEjBuilt = "data-ej-built",
				dataEjName = "data-ej-name",
				dataEjBound = "data-ej-bound",
				dataEjSelector = "data-ej-selector",
				dataEjBinding = "data-ej-binding",
				querySelectorWidgets = '*[' + dataEjBuilt + '=true][' + dataEjBinding + '][' + dataEjSelector + '][' + dataEjName + ']:not([' + dataEjBound + '])',
				excludeBuiltAndBound = ":not([" + dataEjBuilt + "]):not([" + dataEjBound + "])",
				eventBound = "bound",
				eventWidgetBuilt = "widgetbuilt",
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
					methods.push('destroy', 'disable', 'enable', 'option', 'refresh', 'value');
					definition = {
						name: name,
						methods: methods || [],
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
			* @param definition
			* @param template
			* @param element
			* @param {Object} [options]
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
						ns.log("processing widget:", definition.name);
						//>>excludeEnd("ejDebug");
						widgetInstance.configure(definition, element, options);
						if (typeof createFunction === "function") {
							element.addEventListener(definition.name.toLowerCase() + 'create', createFunction, false);
						}
						if (element) {
							if (element.id) {
								widgetInstance.id = element.id;
							}
							if (element.getAttribute(dataEjBuilt) !== "true") {
								element = widgetInstance.build(template, element);
							}
							setBinding(element, widgetInstance);
						}
						postBuildCallback = function (element) {
							if (element) {
								element.removeEventListener(eventWidgetBuilt, postBuildCallback, true);
								if (!justBuild) {
									widgetInstance.init(element);
									widgetInstance.bindEvents(element);
								} else {
									widgetInstance.bindEvents(element, true);
								}
								eventUtils.trigger(element, eventWidgetBound, widgetInstance, false);
							} else {
								body.removeEventListener(eventWidgetBuilt, postBuildCallback, true);
							}
							eventUtils.trigger(body, eventWidgetBound, widgetInstance);
						}.bind(null, element);
						if (element) {
							element.addEventListener(eventWidgetBuilt, postBuildCallback, true);
							eventUtils.trigger(element, eventWidgetBuilt, widgetInstance, false);
						} else {
							body.addEventListener(eventWidgetBuilt, postBuildCallback, true);
							eventUtils.trigger(body, eventWidgetBuilt, widgetInstance, false);
						}
					}
					//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
				});
				//>>excludeEnd("ejBuildExclude");
			}

			/**
			* @method Call destroy method of widget and it's child. Remove bindings.
			* @param {string} widgetId
			* @memberOf ns.engine
			*/
			function destroyWidget(widgetId) {
				var widgetMap = getBinding(widgetId),
					widgetInstance,
					childWidgets,
					elementCache,
					i;

				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ns.log('removing widget:', widgetId);
				//>>excludeEnd("ejDebug");
				if (widgetMap) {
					widgetInstance = widgetMap.instance;
					if (typeof widgetInstance === 'object') {
						//cache widgets HTML Element
						elementCache = widgetInstance.element;

						//Destroy widget
						widgetInstance.destroy();

						//Destroy child widgets, if there something left.
						childWidgets = slice.call(elementCache.querySelectorAll('[' + dataEjBound + '="true"]'));
						for (i = childWidgets.length - 1; i >= 0; i -= 1) {
							if (childWidgets[i]) {
								destroyWidget(childWidgets[i].id);
							}
						}
					}

					removeBinding(widgetId);
				}
			}

			/**
			* Load widgets from data-* definition
			* @method processHollowWidget
			* @param _definition
			* @param element
			* @param {Object} [options]
			* @private
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
			* Build page
			* @method createWidgets
			* @param context
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
			* Get biding of widget
			* @method getBinding
			* @param element
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
			* @param element
			* @param widgetInstance
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

			function removeBindingAttributes(element) {
				element.removeAttribute(dataEjBuilt);
				element.removeAttribute(dataEjBound);
				element.removeAttribute(dataEjBinding);
				element.removeAttribute(dataEjName);
				element.removeAttribute(dataEjSelector);
			}
			/**
			* remove binding
			* @method removeBinding
			* @param element
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
				removeBinding: removeBinding,

				//INTERNAL: only for tests:
				_clearBindings: function () {
					//clear and set references to the same object
					widgetBindingMap = window.ejWidgetBindingMap = {};
				},

				build: function () {
					var router = engine.router;
					body = document.body;
					if (router) {
						router.init(justBuild);
					}
					eventUtils.trigger(document, "initrouter", router, false);
				},

				/**
				* Run engine
				* @method run
				* @memberOf ns.engine
				*/
				run: function () {
					var router = engine.getRouter();
					if (!ns.get('enginestarted', false)) {
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
						ns.set('enginestarted', true);
					}
				},

				getRouter: function () {
					return engine.router;
				},

				initRouter: function (RouterClass) {
					engine.router = new RouterClass();
				},

				/**
				* Build instance of widget and binding events
				* @method instanceWidget
				* @memberOf {ns.engine}
				* @param {HTMLElement} element
				* @param {String} name
				* @param {Object} options
				* @return {Object}
				*/
				instanceWidget: function (element, name, options) {
					var binding = getBinding(element),
						definition;

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
				_createEventHandler : createEventHandler
			};
			window.ejWidgetBindingMap = widgetBindingMap;
			ns.engine = engine;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ns.engine;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
