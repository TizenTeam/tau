/*global window, define, console */
/*jslint nomen: true, plusplus: true */
/**
 * @class ej.engine
 * Main class with engine of library
 */
(function (window, document, ej) {
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
				eventUtils = ej.utils.events,
				globalBindings = {},
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
				querySelectorWidgets = '*['+dataEjBuilt+'=true]['+dataEjBinding+']['+dataEjSelector+']['+dataEjName+']:not(['+dataEjBound+'])',
				excludeBuiltAndBound = ":not(["+dataEjBuilt+"]):not(["+dataEjBound+"])",
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
			* @memberOf ej.engine
			* @static
			*/
			function defineWidget(name, binding, selector, methods, widgetClass, namespace, redefine) {
				var definition;
				if (!widgetDefs[name] || redefine) {
					//>>excludeStart("ejDebug", pragmas.ejDebug);
					ej.log('defining widget:', name);
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
				ej.warn('widget already defined:', name);
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
			* @memberOf ej.engine
			*/
			function processWidget(definition, template, element, options) {
				//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
				require([definition.binding], function () {
					//>>excludeEnd("ejBuildExclude");
					var widgetOptions = options || {},
						createFunction = widgetOptions.create,
						Widget = definition.widgetClass,
						widgetInstance = Widget ? new Widget(element) : false,
						id = widgetInstance.id,
						postBuildCallback;

					if (widgetInstance) {
						//>>excludeStart("ejDebug", pragmas.ejDebug);
						ej.log("processing widget:", definition.name);
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
						}
						postBuildCallback = function (element) {
							element.removeEventListener(eventWidgetBuilt, postBuildCallback, true);
							if (!justBuild) {
								widgetInstance.init(element);
								widgetInstance.bindEvents(element);
							} else {
								widgetInstance.bindEvents(element, true);
							}

							if (widgetBindingMap[id] === undefined) {
								widgetBindingMap[id] = {
									'elementId': id,
									'binding': widgetInstance.binding,
									'instance': widgetInstance
								};
							} else {
								//>>excludeStart("ejDebug", pragmas.ejDebug);
								ej.log('Duplicate widget binding for element:', element);
								//>>excludeEnd("ejDebug");
							}

							eventUtils.trigger(element, eventWidgetBound, widgetInstance, false);
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
			* Call destroy method of widget and it's child. Remove bindings.
			* @param {type} widgetId
			*/
			function destroyWidget(widgetId) {
				var widgetMap = widgetBindingMap[widgetId],
					widgetInstance,
					childWidgets,
					elementCache,
					i;

				//>>excludeStart("ejDebug", pragmas.ejDebug);
				ej.log('removing widget:', widgetId);
				//>>excludeEnd("ejDebug");
				if (widgetMap) {
					widgetInstance = widgetMap.instance;
					if (typeof widgetInstance === 'object') {
						//cache widgets HTML Element
						elementCache = widgetInstance.element;

						//Destroy widget
						widgetInstance.destroy();

						//Destroy child widgets, if there something left.
						childWidgets = slice.call(elementCache.querySelectorAll('['+dataEjBound+'="true"]'));
						for (i = childWidgets.length - 1; i >= 0; i -= 1) {
							if (childWidgets[i]) {
								destroyWidget(childWidgets[i].id);
							}
						}
					}

					delete widgetBindingMap[widgetId];
				}
			}

			/**
			* Load widgets from data-* definition
			* @method processHollowWidget
			* @param _definition
			* @param element
			* @param {Object} [options]
			* @private
			* @memberOf ej.engine
			*/
			function processHollowWidget(_definition, element, options) {
				var name = element.getAttribute(),
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
			* @memberOf ej.engine
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
				ej.log("start creating widgets on:", context.tagName + '#' + (context.id || '--no-id--'));
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
							ej.log("Found widget to build " + definition.name + " on:", normal[j].tagName + '#' + (normal[j].id || '--no-id--'));
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
				ej.log("finish creating widgets on:", context.tagName + '#' + (context.id || '--no-id--'));
				//>>excludeEnd("ejDebug");
			}

			/**
			* Get biding of widget
			* @method getBinding
			* @param element
			* @return {?Object}
			* @memberOf ej.engine
			*/
			function getBinding(element) {
				var id = !element || typeof element === typeString ? element : element.id;
				return (globalBindings[id] || null);
			}

			/**
			* Set binding of widget
			* @method setBinding
			* @param element
			* @param binding
			* @memberOf ej.engine
			*/
			function setBinding(element, binding) {
				var id = typeof element === typeString ? element : element.id || binding.id;
				if (globalBindings[id]) {
					//>>excludeStart("ejDebug", pragmas.ejDebug);
					console.error('Fail set binding, binding on id ' + id + ' exists.');
					//>>excludeEnd("ejDebug");
				} else {
					globalBindings[id] = binding;
				}
			}

			/**
			* remove binding
			* @method removeBinding
			* @param element
			* @return {boolean}
			* @memberOf ej.engine
			*/
			function removeBinding(element) {
				var id = typeof element === typeString ? element : element.id;
				if (globalBindings[id]) {
					delete globalBindings[id];
					return true;
				}
				return false;
			}

			function createEventHandler(event) {
				createWidgets(event.target, false);
			}

			document.addEventListener(eventBound, function () {
				window.ejWidgetBindingMap = widgetBindingMap;
			}, false);

			ej.globalBindings = {};
			ej.widgetDefinitions = {};
			engine = {
				destroyWidget: destroyWidget,
				createWidgets: createWidgets,

				/**
				* Method to get all definitions of widgets
				* @method getDefinitions
				* @return {Array}
				* @memberOf ej.engine
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
					globalBindings = window.ej.globalBindings = {};
				},

				build: function () {
					var router = engine.router;
					body = document.body;
					if (router && ej.get('autoInitializePage', true)) {
						router.init(justBuild);
					}
					eventUtils.trigger(document, "initrouter", router, false);
				},

				/**
				* Run engine
				* @method run
				* @memberOf ej.engine
				*/
				run: function () {
					var router = engine.getRouter();
					engine.stop();
					body = document.body;
					document.addEventListener('create', createEventHandler, false);

					eventUtils.trigger(document, "initengine", engine, false);
					eventUtils.trigger(document, "initevents", ej.events, false);
					eventUtils.trigger(document, "initjqm");
					eventUtils.trigger(document, 'mobileinit');
					eventUtils.trigger(document, "beforeinitrouter", router, false);
					if (document.readyState === 'complete') {
						engine.build();
					} else {
						document.addEventListener('DOMContentLoaded', engine.build.bind(engine));
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
				* @memberOf {ej.engine}
				* @param {HTMLElement} element
				* @param {String} name
				* @param {Object} options
				* @return {Object}
				*/
				instanceWidget: function (element, name, options) {
					var binding = getBinding(element),
						built = element.getAttribute(dataEjBuilt) === "true",
						definition;

					if ((!binding || !built) && widgetDefs[name]) {
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
				* @memberOf ej.engine
				*/
				stop: function () {
					var router = engine.getRouter();
					if (router) {
						router.destroy();
					}
				},
				_createEventHandler : createEventHandler
			};
			ej.engine = engine;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ej.engine;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
