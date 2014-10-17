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
 *			"use strict";
 *			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
 *			define(
 *				[
 *					"../ns.core", always necessary
 *					"../widget", // fetch namespace, always necessary
 *					"../util/selectors" // all other necessary modules
 *					],
 *				function () {
 *					//>>excludeEnd("tauBuildExclude");
 *					var BaseWidget = ns.widget.BaseWidget, // create alias to main objects
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
 *					//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
 *					return ns.widget.Button;
 *				}
 *			);
 *			//>>excludeEnd("tauBuildExclude");
 *		}(ns));
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
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../engine",
			"../event",
			"../util/object",
			"../util/DOM/attributes",
			"../widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
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
				classes = {
					focusPrefix: "ui-focus-",
					blurPrefix: "ui-blur-",
					up: "up",
					down: "down",
					left: "left",
					right: "right"
				},
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

			function removeAnimationClasses(element, prefix) {
				var elementClasses = element.classList;
				elementClasses.remove(prefix + classes.left);
				elementClasses.remove(prefix + classes.up);
				elementClasses.remove(prefix + classes.right);
				elementClasses.remove(prefix + classes.down);
			}

			prototype._prepareAnimation = function(eventType, direction) {
				var element = this.element;

				switch(eventType) {
					case "focus":
						removeAnimationClasses(element, classes.blurPrefix);
						removeAnimationClasses(element, classes.focusPrefix);
						element.classList.add(classes.focusPrefix + direction);
						break;
					case "blur":
						removeAnimationClasses(element, classes.focusPrefix);
						removeAnimationClasses(element, classes.blurPrefix);
						element.classList.add(classes.blurPrefix + direction);
						break;
				}
			};
			/**
			 * Focus widget's element.
			 *
			 * This function calls function focus on element and if it is known
			 * the direction of event, the proper css classes are added/removed.
			 * @method _focus
			 * @param {"up"|"down"|"left"|"right} positionFrom The direction of event.
			 * For example, if this parameter has value "down", it means that the movement
			 * comes from the top (eg. down arrow was pressed on keyboard).
			 * @member ns.widget.BaseWidget
			 */
			prototype._focus = function (positionFrom) {
				var element = this.element;

				if (typeof this._prepareAnimation === TYPE_FUNCTION) {
					this._prepareAnimation("focus", positionFrom);
				}
				this.element.focus();
			};

			/**
			 * Blur widget's element.
			 *
			 * This function calls function blur on element and if it is known
			 * the direction of event, the proper css classes are added/removed.
			 * @method _blur
			 * @param {"up"|"down"|"left"|"right} positionFrom
			 * @member ns.widget.BaseWidget
			 */
			prototype._blur = function (positionFrom) {
				var element = this.element;

				if (typeof this._prepareAnimation === TYPE_FUNCTION) {
					this._prepareAnimation("blur", positionFrom);
				}
				element.blur();
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

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.BaseWidget;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
