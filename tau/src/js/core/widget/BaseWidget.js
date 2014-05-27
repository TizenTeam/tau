/*global window, define */
/*jslint nomen: true */
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
/*jslint nomen: true */
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
 * If you load jQuery before initializing tau library, you can use standard jQuery UI Widget notation.
 *
 * ### Examples
 * #### Build widget from JavaScript
 *
 *	 @example
 *	 var element = document.getElementById('id'),
 *		 ns.engine.instanceWidget(element, 'Button');
 *
 * #### Build widget from jQuery
 *
 *	 @example
 *	 var element = $('#id').button();
 *
 * ## How to create new widget
 *
 *	 @example
 *	 (function (ns) {
 *		 "use strict";
 *		 //>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
 *		 define(
 *			 [
 *				 "../ns.core", always necessary
 *				 "../widget", // fetch namespace, always necessary
 *				 "../util/selectors" // all other necessary modules
 *			 ],
 *			 function () {
 *				 //>>excludeEnd("tauBuildExclude");
 *				 var BaseWidget = ns.widget.BaseWidget, // create alias to main objects
 *					 ...
 *					 arrayOfElements, // example of private property, common for all instances of widget
 *					 Button = function () { // create local object with widget
 *						 ...
 *					 },
 *					 prototype = new BaseWidget(); // add ns.widget.BaseWidget as prototype to widget's object, for better minification this should be assign to local variable and next variable should be assign to prototype of object
 *
 *				 function closestEnabledButton(element) { // example of private method
 *					 ...
 *				 }
 *				 ...
 *
 *				 prototype.options = { //add default options to be read from data- attributes
 *					 theme: 's',
 *					 ...
 *				 };
 *
 *				 prototype._build = function (template, element) { // method called when the widget is being built, should contain all HTML manipulation actions
 *					 ...
 *					 return element;
 *				 };
 *
 *				 prototype._init = function (element) { // method called during initialization of widget, should contain all actions necessary fastOn application start
 *					 ...
 *					 return element;
 *				 };
 *
 *				 prototype._bindEvents = function (element) { // method to bind all events, should contain all event bindings
 *					 ...
 *				 };
 *
 *				 prototype._enable = function (element) { // method called during invocation of enable() method
 *					 ...
 *				 };
 *
 *				 prototype._disable = function (element) { // method called during invocation of disable() method
 *					 ...
 *				 };
 *
 *				 prototype.refresh = function (element) { // example of public method
 *					 ...
 *				 };
 *
 *				 prototype._refresh = function () { // example of protected method
 *					 ...
 *				 };
 *
 *				 Button.prototype = prototype;
 *
 *				 engine.defineWidget( // define widget
 *					 "Button", //name of widget
 *					 "[data-role='button'],button,[type='button'],[type='submit'],[type='reset']",  //widget's selector
 *					 [ // public methods, here should be list all public method, without that method will not be available
 *						 "enable",
 *						 "disable",
 *						 "refresh"
 *					 ],
 *					 Button, // widget's object
 *					 "mobile" // widget's namespace
 *				 );
 *				 ns.widget.Button = Button;
 *				 //>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
 *				 return ns.widget.Button;
 *			 }
 *		 );
 *		 //>>excludeEnd("tauBuildExclude");
 *	 }(ns));
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @class ns.widget.BaseWidget
 * @alias BaseWidget
 * @internal
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
				* @property {ns.engine} engine Alias to ns.engine
				* @member ns.widget.BaseWidget
				* @private
				* @static
				*/
				engine = ns.engine,
				engineDataTau = engine.dataTau,
				util = ns.util,
				/**
				* @property {Object} eventUtils Alias to {@link ns.event}
				* @member ns.widget.BaseWidget
				* @private
				* @static
				*/
				eventUtils = ns.event,
				/**
				* @property {Object} domUtils Alias to {@link ns.util.DOM}
				* @private
				* @static
				*/
				domUtils = util.DOM,
				/**
				 * @property {Object} objectUtils Alias to {@link ns.util.object}
				 * @private
				 * @static
				 */
				objectUtils = util.object,
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
			 * @member ns.widget.BaseWidget
			 * @chainable
			 * @instance
			 * @internal
			 */
			/**
			 * Protected method configuring the widget
			 * @method _configure
			 * @member ns.widget.BaseWidget
			 * @protected
			 * @template
			 * @instance
			 * @internal
			 */
			prototype.configure = function (definition, element, options) {
				var self = this,
					definitionName,
					definitionNamespace;
				/**
				 * @property {Object} [options={}] Object with options for widget
				 * @member ns.widget.BaseWidget
				 * @instance
				 */
				self.options = self.options || {};
				/**
				 * @property {?HTMLElement} [element=null] Base element of widget
				 * @member ns.widget.BaseWidget
				 * @instance
				 */
				self.element = self.element || null;
				if (definition) {
					definitionName = definition.name;
					definitionNamespace = definition.namespace;
					/**
					* @property {string} name Name of the widget
					* @member ns.widget.BaseWidget
					* @instance
					*/
					self.name = definitionName;

					/**
					* @property {string} widgetName Name of the widget (in lower case)
					* @member ns.widget.BaseWidget
					* @instance
					*/
					self.widgetName = definitionName;

					/**
					* @property {string} widgetEventPrefix Namespace of widget events
					* @member ns.widget.BaseWidget
					* @instance
					*/
					self.widgetEventPrefix = definitionName.toLowerCase();

					/**
					* @property {string} namespace Namespace of the widget
					* @member ns.widget.BaseWidget
					* @instance
					*/
					self.namespace = definitionNamespace;

					/**
					* @property {string} widgetFullName Full name of the widget
					* @member ns.widget.BaseWidget
					* @instance
					*/
					self.widgetFullName = ((definitionNamespace ? definitionNamespace + '-' : "") + definitionName).toLowerCase();
					/**
					* @property {string} id Id of widget instance
					* @member ns.widget.BaseWidget
					* @instance
					*/
					self.id = ns.getUniqueId();

					/**
					* @property {string} selector widget's selector
					* @member ns.widget.BaseWidget
					* @instance
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
			* Read data-* attributes and save to #options object
			* @method _getCreateOptions
			* @param {HTMLElement} element Base element of the widget
			* @return {Object}
			* @member ns.widget.BaseWidget
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
			* @param {HTMLElement} element
			* @return {HTMLElement} widget's element
			* @member ns.widget.BaseWidget
			* @protected
			* @template
			* @instance
			*/
			/**
			* Build widget. Call #\_getCreateOptions, #\_build
			* @method build
			* @param {HTMLElement} element
			* @return {HTMLElement} widget's element
			* @member ns.widget.BaseWidget
			* @instance
			 * @internal
			*/
			prototype.build = function (element) {
				var self = this,
					id,
					node,
					dataBuilt = element.getAttribute(engineDataTau.built),
					dataName = element.getAttribute(engineDataTau.name);

				eventUtils.trigger(element, self.widgetEventPrefix + "beforecreate");

				// Append current widget name to data-tau-built and data-tau-name attributes
				dataBuilt = !dataBuilt ? self.name : dataBuilt + engineDataTau.separator + self.name;
				dataName = !dataName ? self.name : dataName + engineDataTau.separator + self.name;

				element.setAttribute(engineDataTau.built, dataBuilt);
				element.setAttribute(engineDataTau.name, dataName);

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
				return node;
			};

			/**
			* Protected method initializing the widget
			* @method _init
			* @param {HTMLElement} element
			* @member ns.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Init widget, call: #\_getCreateOptions, #\_init
			* @method init
			* @param {HTMLElement} element
			* @member ns.widget.BaseWidget
			* @chainable
			* @instance
			 * @internal
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
			* Bind widget events attached in init mode
			* @method _bindEvents
			* @param {HTMLElement} element Base element of widget
			* @member ns.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Bind widget events, call: #\_buildBindEvents, #\_bindEvents
			* @method bindEvents
			* @param {HTMLElement} element Base element of the widget
			* @param {boolean} onlyBuild Inform about the type of bindings: build/init
			* @member ns.widget.BaseWidget
			* @chainable
			* @instance
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
			* @instance
			*/
			/**
			* Destroy widget, call #\_destroy
			* @method destroy
			* @member ns.widget.BaseWidget
			* @instance
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
			* @instance
			*/
			/**
			* Disable widget
			* @method disable
			* @member ns.widget.BaseWidget
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
			* @member ns.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Enable widget, call: #\_enable
			* @method enable
			* @member ns.widget.BaseWidget
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
			* @member ns.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Refresh widget, call: #\_refresh
			* @method refresh
			* @member ns.widget.BaseWidget
			* @chainable
			* @instance
			*/
			prototype.refresh = function () {
				var self = this;
				if (typeof self._refresh === TYPE_FUNCTION) {
					self._refresh.apply(self, arguments);
				}
				return self;
			};


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
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} value value to set
			 * @member ns.widget.BaseWidget
			 * @return {*} return value of option or undefined if method is called in setter context
			 * @instance
			 */
			prototype.option = function () {
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
							partResult = partResult || self._oneOption(key, firstArgument[key]);
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
			 * Get/Set option of the widget
			 * @method _oneOption
			 * @param {string} field
			 * @param {*} value
			 * @member ns.widget.BaseWidget
			 * @return {*}
			 * @instance
			 * @protected
			 */
			prototype._oneOption = function (field, value) {
				var self = this,
					methodName,
					refresh = false;
				if (value === undefined) {
					methodName = '_get' + (field[0].toUpperCase() + field.slice(1));
					if (typeof self[methodName] === TYPE_FUNCTION) {
						return self[methodName]();
					}
					return self.options[field];
				}
				methodName = '_set' + (field[0].toUpperCase() + field.slice(1));
				if (typeof self[methodName] === TYPE_FUNCTION) {
					self[methodName](self.element, value);
				} else {
					self.options[field] = value;
					if (self.element) {
						self.element.setAttribute('data-' + (field.replace(/[A-Z]/g, function (c) {
							return "-" + c.toLowerCase();
						})), value);
						refresh = true;
					}
				}
				return refresh;
			};

			/**
			 * Checks if the widget has bounded events through the {@link ns.widget.BaseWidget#bindEvents} method.
			 * @method isBound
			 * @param {string} [type]
			 * @member ns.widget.BaseWidget
			 * @instance
			 * @internal
			 * @return {boolean} true if events are bounded
			 */
			prototype.isBound = function (type) {
				var element = this.element;
				type = type || this.name;
				return element && element.hasAttribute(engineDataTau.bound) && element.getAttribute(engineDataTau.bound).indexOf(type) > -1;
			};

			/**
			 * Checks if the widget was built through the {@link ns.widget.BaseWidget#build} method.
			 * @method isBuilt
			 * @param {string} [type]
			 * @member ns.widget.BaseWidget
			 * @instance
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
			* @instance
			*/
			/**
			* Protected method setting the value of widget
			* @method _setValue
			* @param {*} value
			* @return {*}
			* @member ns.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Get/Set value of the widget
			* @method value
			* @param {*} [value]
			* @member ns.widget.BaseWidget
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
			 * @param {boolean} [bubbles=true] indicating whether the event bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] indicating whether the event is cancelable
			 * @member ns.widget.BaseWidget
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
			 * @member ns.widget.BaseWidget
			 * @instance
			 */
			prototype.on = function (eventName, listener, useCapture) {
				eventUtils.fastOn(this.element, eventName, listener, useCapture);
			};

			/**
			 * Remove event listener to this.element.
			 * @method off
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param tu addEventListener
			 * @member ns.widget.BaseWidget
			 * @instance
			 */
			prototype.off = function (eventName, listener, useCapture) {
				eventUtils.fastOff(this.element, eventName, listener, useCapture);
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
