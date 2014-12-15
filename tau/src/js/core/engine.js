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
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"require",
			"./core",
			"./event",
			"./util/selectors",
			"./util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
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
						//>>excludeStart("tauDebug", pragmas.tauDebug);
						ns.log("defining widget:", name);
						//>>excludeEnd("tauDebug");
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
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.warn("Widget already defined:", name);
					//>>excludeEnd("tauDebug");
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
			 * @param {string} [type] widget name
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
						//>>excludeStart("tauDebug", pragmas.tauDebug);
						// NOTE: element can exists outside document
						bindingElement = widgetInstance.element;
						if (bindingElement && !bindingElement.ownerDocument.getElementById(bindingElement.id)) {
							ns.warn("Element ", bindingElement.id, " is outside DOM!");
						}
						//>>excludeEnd("tauDebug");

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

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				if (getBinding(id, type)) {
					ns.error("Duplicated, binding. Binding on id " + id + " was overwritten.");
				}
				//>>excludeEnd("tauDebug");

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
									//>>excludeStart("tauDebug", pragmas.tauDebug);
									if (!partialSuccess) {
										ns.error("Not every widget binding has been removed. Failed for: " + widgetName);
									}
									//>>excludeEnd("tauDebug");

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
			 * If element not exist create base element for widget.
			 * @method ensureElement
			 * @param {HTMLElement} element
			 * @param {ns.widget.BaseWidget} Widget
			 * @return {HTMLElement}
			 * @static
			 * @private
			 * @member ns.engine
			 */
			function ensureElement(element, Widget) {
				if (!element || !element instanceof HTMLElement) {
					if (typeof Widget.createEmptyElement === TYPE_FUNCTION) {
						element = Widget.createEmptyElement();
					} else {
						element = document.createElement("div");
					}
				}
				return element;
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
					widgetInstance,
					buildAttribute,
					parentEnhance,
					existingBinding;

				element = ensureElement(element, Widget);
				widgetInstance = Widget ? new Widget(element) : false;
				// if any parent has attribute data-enhance=false then stop building widgets
				parentEnhance = selectors.getParentsBySelectorNS(element, 'enhance=false');

				// While processing widgets queue other widget may built this one before
				// it reaches it's turn
				existingBinding = getBinding(element, definition.name);
				if (existingBinding && existingBinding.element === element) {
					return existingBinding.element;
				}

				if (widgetInstance && !parentEnhance.length) {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("Processing widget:", definition.name, "on element:", element.tagName + "#" + (element.id || "--no--id--"));
					//>>excludeEnd("tauDebug");
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
						//>>excludeStart("tauDebug", pragmas.tauDebug);
						ns.error("There was problem with building widget " + widgetInstance.widgetName + " on element with id " + widgetInstance.id + ".");
						//>>excludeEnd("tauDebug");
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

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Removing all widgets for element:", element);
				//>>excludeEnd("tauDebug");

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

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Removing all widgets for element:", element);
				//>>excludeEnd("tauDebug");

				if (!childOnly) {
					// If type is not defined all widgets should be removed
					// this is for backward compatibility
					widgetGroup = getAllBindings(element);
					for (widgetName in widgetGroup) {
						if (widgetGroup.hasOwnProperty(widgetName)) {
							widgetInstance = widgetGroup[widgetName];

							//Destroy widget
							if (widgetInstance) {
								widgetInstance.destroy();
								widgetInstance.trigger("widgetdestroyed");
							}
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
				var name = (element && element.getAttribute(DATA_NAME)) ||
						(definition && definition.name);
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				if (!name) {
					ns.error("Processing hollow widget without name on element:", element);
				}
				//>>excludeEnd("tauDebug");
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

				if (nodeA.element === nodeB.element) {
					return 0;
				}

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

				//>>excludeStart("tauPerformance", pragmas.tauPerformance);
				window.tauPerf.start("engine/createWidgets");
				//>>excludeEnd("tauPerformance");

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Start creating widgets on:", (context.tagName || (context.documentElement && "document")) + "#" + (context.id || "--no-id--"));
				//>>excludeEnd("tauDebug");

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

				//>>excludeStart("tauPerformance", pragmas.tauPerformance);
				document.addEventListener(eventType.BOUND, function _boundPerfListener() {
					document.removeEventListener(eventType.BOUND, _boundPerfListener);
					window.tauPerf.get("engine/createWidgets", "event: " + eventType.BOUND);
				});
				document.addEventListener("built", function _builtPerfListener() {
					document.removeEventListener("built", _builtPerfListener);
					window.tauPerf.get("engine/createWidgets", "event: built");
				});
				//>>excludeEnd("tauPerformance");

				eventUtils.trigger(document, "built");
				eventUtils.trigger(document, eventType.BOUND);
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Finish creating widgets on:", context.tagName || (context.documentElement && "document") + "#" + (context.id || "--no-id--"));
				//>>excludeEnd("tauDebug");
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

			/**
			 * Add to object value at index equal to type of arg.
			 * @method getType
			 * @param {Object} result
			 * @param {*} arg
			 * @return {Object}
			 * @static
			 * @private
			 * @member ns.engine
			 */
			function getType(result, arg) {
				var type = arg instanceof HTMLElement ? "HTMLElement" : typeof arg;
				result[type] = arg;
				return result;
			}

			/**
			 * Convert args array to object with keys being types and arguments mapped by values
			 * @method getArgumentsTypes
			 * @param {Arguments[]} args
			 * @return {Object}
			 * @static
			 * @private
			 * @member ns.engine
			 */
			function getArgumentsTypes(args) {
				return tau.util.array.reduce(args, getType, {});
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
					//>>excludeStart("tauPerformance", pragmas.tauPerformance);
					window.tauPerf.start("framework");
					window.tauPerf.get("framework", "run()");
					//>>excludeEnd("tauPerformance");
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
				 * @param {HTMLElement} [element]
				 * @param {string} name
				 * @param {Object} [options]
				 * @return {?Object}
				 * @static
				 * @member ns.engine
				 */
				instanceWidget: function (element, name, options) {
					var binding,
						definition,
						argumentsTypes = getArgumentsTypes(arguments);

					// Map arguments with specific types to correct variables
					// Only name is required argument
					element = argumentsTypes.HTMLElement;
					name = argumentsTypes.string;
					options = argumentsTypes.object;
					// If element exists try to find existing binding
					if (element) {
						binding = getBinding(element, name);
					}
					// If didn't found binding build new widget
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
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.engine;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
