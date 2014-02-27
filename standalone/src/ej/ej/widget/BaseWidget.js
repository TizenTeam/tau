/*global window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 */
/**
 * @class ns.widget.BaseWidget
 *
 * # Prototype class of widget
 * ## How to invoke creation of widget from JavaScript
 *
 * To build and initialize widget in JavaScript you have to use method {@link ns.engine#method-instanceWidget} . First argument for method
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
 *     (function (ej) {
 *         "use strict";
 *         //>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
 *         define(
 *             [
 *                 "../ns.core", always necessary
 *                 "../widget", // fetch namespace, always necessary
 *                 "../utils/selectors" // all other necessary modules
 *             ],
 *             function () {
 *                 //>>excludeEnd("ejBuildExclude");
 *                 var BaseWidget = ns.widget.BaseWidget, // create alias to main objects
 *                     ...
 *                     arrayOfElements, // example of private property
 *                     Button = function () { // create local object with widget
 *                         ...
 *                     };
 *
 *                 function closestEnabledButton(element) { // example of private method
 *                     ...
 *                 }
 *                 ...
 *
 *                 Button.prototype = new BaseWidget(); // add ns.widget as prototype to widget's object
 *
 *                 Button.prototype.options = { //add default options to be read from data- attributes
 *                     theme: 's',
 *                     ...
 *                 };
 *
 *                 Button.prototype._build = function (template, element) { // method called when the widget is being built, should contain all HTML manipulation actions
 *                     ...
 *                     return element;
 *                 };
 *
 *                 Button.prototype._init = function (element) { // method called during initialization of widget, should contain all actions necessary on application start
 *                     ...
 *                     return element;
 *                 };
 *
 *                 Button.prototype._bindEvents = function (element) { // method to bind all events, should contain all event bindings
 *                     ...
 *                 };
 *
 *                 Button.prototype._buildBindEvents = function (element) { // method to bind all events, should contain all event bindings necessary during build
 *                     ...
 *                 };
 *
 *                 Button.prototype._enable = function (element) { // method called during invocation of enable() method
 *                     ...
 *                 };
 *
 *                 Button.prototype._disable = function (element) { // method called during invocation of disable() method
 *                     ...
 *                 };
 *
 *                 Button.prototype.refresh = function (element) { // example of public method
 *                     ...
 *                 };
 *
 *                 Button.prototype._refresh = function () { // example of protected method
 *                     ...
 *                 };
 *
 *                 engine.defineWidget( // define widget
 *                     "Button", //name of widget
 *                     "./widget/ns.widget.Button", // name of widget's module (name of file)
 *                     "[data-role='button'],button,[type='button'],[type='submit'],[type='reset']",  //widget's selector
 *                     [ // public methods
 *                         "enable",
 *                         "disable",
 *                         "refresh"
 *                     ],
 *                     Button, // widget's object
 *                     "mobile" // widget's namespace
 *                 );
 *                 ns.widget.Button = Button;
 *                 //>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
 *                 return ns.widget.Button;
 *             }
 *         );
 *         //>>excludeEnd("ejBuildExclude");
 *     }(window.ej));
 */
/**
 * Triggered before the widget will be created.
 * @event beforecreate
 * @memberOf ns.widget.BaseWidget
 */
/**
 * Triggered when the widget is created.
 * @event create
 * @memberOf ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../engine",
			"../utils/events",
			"../utils/DOM/attributes",
			"../widget" // fetch namespace
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
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
				/**
				* @property {ns.utils.events} eventUtils Alias to ns.utils.events
				* @memberOf ns.widget.BaseWidget
				* @private
				* @static
				*/
				eventUtils = ns.utils.events,
				/**
				* @property {ns.utils.DOM} domUtils Alias to ns.utils.DOM
				* @private
				* @static
				*/
				domUtils = ns.utils.DOM,
				/**
				* @property {Object} BaseWidget Alias to ns.widget
				* @memberOf ns.widget.BaseWidget
				* @private
				* @static
				*/
				BaseWidget = function () {
					this.options = {};
					return this;
				},
				prototype = {};

			/**
			* Configure widget object from definition
			* @method configure
			* @param {Object} definition
			* @param {string} definition.name Name of the widget
			* @param {string} definition.selector Selector of the widget
			* @param {string} definition.binding Path to a file with the widget (without extension)
			* @param {Object} options Configure options
			* @memberOf ns.widget.BaseWidget
			* @chainable
			* @instance
			*/
			prototype.configure = function (definition, element, options) {
				var widgetOptions = this.options || {};
				this.options = widgetOptions;
				if (definition) {
					/**
					* @property {string} name Name of the widget
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					this.name = definition.name;

					/**
					* @property {string} widgetName Name of the widget (in lower case)
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					this.widgetName = definition.name;

					/**
					* @property {string} eventNamespace Namespace of widget events (suffix for events)
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					this.eventNamespace = '.' + this.widgetName + (this.uuid || '');

					/**
					* @property {string} widgetEventPrefix Namespace of widget events
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					this.widgetEventPrefix = definition.name.toLowerCase();

					/**
					* @property {string} namespace Namespace of the widget
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					this.namespace = definition.namespace;

					/**
					* @property {string} widgetFullName Full name of the widget
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					this.widgetFullName = ((definition.namespace ? definition.namespace + '-' : "") + this.name).toLowerCase();
					/**
					* @property {string} id Id of widget instance
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					this.id = ns.getUniqueId();

					/**
					* @property {string} selector widget's selector
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					this.selector = definition.selector;
					/**
					* @property {string} binding Path to a file with the widget (without extension)
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					this.binding = definition.binding;
					/**
					* @property {HTMLElement} element Base element of the widget
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					this.element = null;

					/**
					* @property {string} [defaultElement='<div>'] Default element for the widget
					* @memberOf ns.widget.BaseWidget
					* @instance
					*/
					this.defaultElement = '<div>';
				}

				if (typeof this._configure === "function") {
					this._configure();
				}

				this._getCreateOptions(element);

				if (typeof options === 'object') {
					Object.keys(options).forEach(function (key) {
						widgetOptions[key] = options[key];
					});
				}
				this.options = widgetOptions;
				return this;
			};

			/**
			* @property {Object} options Default options for the widget
			* @memberOf ns.widget.BaseWidget
			* @template
			* @instance
			*/
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
				var options = this.options;
				if (options !== undefined) {
					Object.keys(options).forEach(function (option) {
						// Get value from data-{namespace}-{name} element's attribute
						// based on widget.options property keys
						var value = domUtils.getNSData(element, (option.replace(/[A-Z]/g, function (c) {
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
					node,
					elementContainer;
				eventUtils.trigger(element, this.widgetEventPrefix + "beforecreate");
				element.setAttribute(engineDataEj.built, true);
				element.setAttribute(engineDataEj.binding, self.binding);
				element.setAttribute(engineDataEj.name, self.name);
				element.setAttribute(engineDataEj.selector, self.selector);
				id = element.getAttribute('id');
				if (!id) {
					element.setAttribute("id", self.id);
				} else {
					self.id = id;
				}

				if (typeof self._build === "function") {
					node = self._build(template, element);
					if (node) {
						self.element = node;
					}
				} else {
					node = element;
					self.element = element;
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
				this.id = element.getAttribute("id");

				if (typeof this._init === "function") {
					this._init(element);
				}

				if (element.getAttribute("disabled")) {
					this.disable();
				} else {
					this.enable();
				}

				return this;
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
				if (!onlyBuild) {
					element.setAttribute(engineDataEj.bound, "true");
				}
				if (typeof this._buildBindEvents === "function") {
					this._buildBindEvents(element);
				}
				if (!onlyBuild && typeof this._bindEvents === "function") {
					this._bindEvents(element);
				}

				eventUtils.trigger(element, this.widgetEventPrefix + "create", this);

				return this;
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
				if (typeof this._destroy === "function") {
					this._destroy(element);
				}
				element = element || this.element;
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
				var element = this.element,
					args = slice.call(arguments);

				if (typeof this._disable === "function") {
					args.unshift(element);
					this._disable.apply(this, args);
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
				var element = this.element,
					args = slice.call(arguments);

				if (typeof this._enable === "function") {
					args.unshift(element);
					this._enable.apply(this, args);
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
				if (typeof this._refresh === "function") {
					this._refresh();
				}
				return this;
			};


			/**
			* Get/Set options of the widget
			* @method option
			* @memberOf ns.widget.BaseWidget
			* @instance
			*/
			prototype.option = function () {
				var args = slice.call(arguments),
					firstArgument = args.shift(),
					secondArgument = args.shift(),
					methodName;
				/*
				* @TODO fill content of function
				*/
				if (typeof firstArgument === "string") {
					if (secondArgument === undefined) {
						methodName = '_get' + (firstArgument[0].toUpperCase() + firstArgument.slice(1));
						if (typeof this[methodName] === "function") {
							return this[methodName]();
						}
						return this.options[firstArgument];
					}
					methodName = '_set' + (firstArgument[0].toUpperCase() + firstArgument.slice(1));
					if (typeof this[methodName] === "function") {
						this[methodName](this.element, secondArgument);
					} else {
						this.options[firstArgument] = secondArgument;
						if (this.element) {
							this.element.setAttribute('data-' + (firstArgument.replace(/[A-Z]/g, function (c) {
								return "-" + c.toLowerCase();
							})), secondArgument);
							this.refresh();
						}
					}
				}
			};

			/**
			* Checks if the widget has bounded events through the {@link ns.widget.BaseWidget#method-bindEvents} method.
			* @method isBound
			* @memberOf ns.widget.BaseWidget
			* @instance
			* @return {boolean} true if events are bounded
			*/
			prototype.isBound = function () {
				var element = this.element;
				return element && element.getAttribute(engineDataEj.bound) ? true : false;
			};

			/**
			* Checks if the widget was built through the {@link ns.widget.BaseWidget#method-build} method.
			* @method isBuilt
			* @memberOf ns.widget.BaseWidget
			* @instance
			* @return {boolean} true if the widget was built
			*/
			prototype.isBuilt = function () {
				var element = this.element;
				return element && element.getAttribute(engineDataEj.built) ? true : false;
			};

			/**
			* Protected method getting the value of widget
			* @method _getValue
			* @return {Mixed}
			* @memberOf ns.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Protected method setting the value of widget
			* @method _setValue
			* @param {Mixed} value
			* @return {Mixed}
			* @memberOf ns.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Get/Set value of the widget
			* @method value
			* @param {Mixed} [value]
			* @memberOf ns.widget.BaseWidget
			* @return {Mixed}
			* @instance
			*/
			prototype.value = function (value) {
				if (value !== undefined) {
					if (typeof this._setValue === "function") {
						return this._setValue(value);
					}
					return this;
				}
				if (typeof this._getValue === "function") {
					return this._getValue();
				}
				return this;
			};

			/**
			* Trigger an event on widget's element.
			* @method trigger
			* @param {string} eventName the name of event to trigger
			* @param {Object} [data] additional object to be carried with the event
			* @memberOf ns.widget.BaseWidget
			* @return {boolean} false, if any callback invoked preventDefault on event object
			* @instance
			*/
			prototype.trigger = function (eventName, data) {
				return eventUtils.trigger(this.element, eventName, data);
			};

			BaseWidget.prototype = prototype;

			// definition
			ns.widget.BaseWidget = BaseWidget;

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ns.widget.BaseWidget;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej));
