/*global window, define */
/*jslint nomen: true */
/**
 * @class ej.widget.BaseWidget
 *
 * # Prototype class of widget
 * ## How to invoke creation of widget from JavaScript
 *
 * To build and initialize widget in JavaScript you have to use method {@link ej.engine#method-instanceWidget} . First argument for method
 * is HTMLElement and is base element of widget. Second parameter is name of widget to create.
 *
 * If you have loaded jQuery before initialize ej library you can use standard jQuery UI Widget notation.
 *
 * ### Examples
 * #### Build widget from JavaScript
 *
 *	@example
 *	var element = document.getElementById('id'),
 *		ej.engine.instanceWidget(element, 'Button');
 *
 * #### Build widget from jQuery
 *
 *	@example
 *	var element = $('#id').button();
 * ## How to create new widget
 *
 *	@example
 *	(function (ej) {
 *	"use strict";
 *		//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
 *		define(
 *			[
 *				"../ej.core", always necessary
 *				"../widget", // fetch namespace, always necessary
 *				"../utils/selectors" // all other necessary modules
 *			],
 *			function () {
 *				//>>excludeEnd("ejBuildExclude");
 *				var BaseWidget = ej.widget.BaseWidget, // create alias to main objects
 *					...
 *					arrayOfElements, // example of private property
 *					Button = function () { // create local object with widget
 *					...
 *					};
 *
 *				function closestEnabledButton(element) { // example of private method
 *					...
 *				}
 *				...
 *
 *				Button.prototype = new BaseWidget(); // add ej.widget as prototype to widget's object
 *
 *				Button.prototype.options = { //add default options read from data- attributes
 *					theme: 's',
 *					...
 *				};
 *
 *				Button.prototype._build = function (template, element) { // method call on build of widget, should contains all HTML manipulation actions
 *					...
 *					return element;
 *				};
 *
 *				Button.prototype._init = function (element) { // method call on initialize of widget, should contains all action necessary on application start
 *					...
 *					return element;
 *				};
 *
 *				Button.prototype._bindEvents = function (element) { // method to bind all events, should contains all event bindings
 *					...
 *				};
 *
 *				Button.prototype._buildBindEvents = function (element) { // method to bind all events, should contains all event bindings necessary on build
 *					...
 *				};
 *
 *				Button.prototype._enable = function (element) { // method call on disable method invoke
 *					...
 *				};
 *
 *				Button.prototype._disable = function (element) { // method call on enable method invoke
 *					...
 *				};
 *
 *				Button.prototype.refresh = function (element) { // example of public method
 *					...
 *				};
 *
 *				Button.prototype._refresh = function () { // example of protected method
 *					...
 *				};
 *
 *				engine.defineWidget({ // define widget
 *					"name": "Button", //name of widget
 *					"binding": "./widget/ej.widget.Button", // name of widget's module (name of file)
 *					"selector": "[data-role='button'],button,[type='button'],[type='submit'],[type='reset']",  //widget's selector
 *					"methods": [ // public methods
 *						"enable",
 *						"disable",
 *						"refresh"
 *					]
 *				});
 *				ej.widget.Button = Button;
 *				//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
 *				return ej.widget.Button;
 *			}
 *		);
 *		//>>excludeEnd("ejBuildExclude");
 *	}(window.ej));
 */
/**
 * Triggered before the widget will be created.
 * @event beforecreate
 * @memberOf ej.widget.BaseWidget
 */
/**
 * Triggered when the widget is created.
 * @event create
 * @memberOf ej.widget.BaseWidget
 */
(function (document, ej) {
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
			* @memberOf ej.widget.BaseWidget
			* @private
			* @static
			*/
			var slice = [].slice,
				/**
				* @property {ej.engine} engine Alias to ej.engine
				* @memberOf ej.widget.BaseWidget
				* @private
				* @static
				*/
				engine = ej.engine,
				/**
				* @property {ej.utils.events} eventUtils Alias to ej.utils.events
				* @memberOf ej.widget.BaseWidget
				* @private
				* @static
				*/
				eventUtils = ej.utils.events,
				/**
				* @property {ej.utils.DOM} domUtils Alias to ej.utils.DOM
				* @private
				* @static
				*/
				domUtils = ej.utils.DOM,
				/**
				* @property {Object} BaseWidget Alias to ej.widget
				* @memberOf ej.widget.BaseWidget
				* @private
				* @static
				*/
				BaseWidget = function () {
					this.options = {};
					return this;
				};

			/*
			* @TODO
			* jquery.widget properies:
			*
			* document: The document that the widget's element is within. Useful if you need to interact with widgets within iframes.
			* element: A jQuery object containing the element used to instantiate the widget. If you select multiple elements and call .myWidget(), a separate widget instance will be created for each element. Therefore, this property will always contain one element.
			* namespace: The location on the global jQuery object that the widget's prototype is stored on. For example a namespace of "ui" indicates that the widget's prototype is stored on $.ui.
			* options: An object containing the options currently being used by the widget. On instantiation, any options provided by the user will automatically be merged with any default values defined in $.myNamespace.myWidget.prototype.options. User specified options override the defaults.
			* uuid: A unique integer identifier for the widget.
			* version: The string version of the widget. For jQuery UI widgets this will be set to the version of jQuery UI the widget is using. Widget developers have to set this property in their prototype explicitly.
			* widgetEventPrefix: The prefix prepended to the name of events fired from this widget. For example the widgetEventPrefix of the draggable widget is "drag", therefore when a draggable is created, the name of the event fired is "dragcreate". By default the widgetEventPrefix of a widget is its name. Note: This property is deprecated and will be removed in a later release. Event names will be changed to widgetName:eventName (e.g. "draggable:create".
			* widgetName: The name of the widget. For $.widget( "myNamespace.myWidget", {} ), widgetName will be "myWidget".
			* window: The window that the widget's element is within. Useful if you need to interact with widgets within iframes.
			*/

			/*
			* @todo default options
			* disabled: false
			* hide
			* show
			*/

			/*
			@todo methods:
			widget

			more information at:
			http://api.jqueryui.com/jQuery.widget/
			*/

			/**
			* configure widget object from definition
			* @method configure
			* @param {Object} definition
			* @param {string} definition.name Name of widget
			* @param {string} definition.selector Selector of widget
			* @param {string} definition.binding Path to file with widget (without extension)
			* @param {Object} options Configure options
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.configure = function (definition, element, options) {
				var widgetOptions = this.options || {};
				this.options = widgetOptions;
				if (definition) {
					/**
					* @property {string} name Name of widget
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.name = definition.name;

					/**
					* @property {string} widgetName Name of widget (in lower case)
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.widgetName = definition.name.toLowerCase();

					/**
					* @property {number} uuid Number id of widget instance
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.uuid = ej.getNumberUniqueId();

					/**
					* @property {string} eventNamespace Namespace of widget events (suffix for events)
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.eventNamespace = '.' + this.widgetName + this.uuid;

					/**
					* @property {string} widgetEventPrefix Namespace of widget events
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.widgetEventPrefix = this.widgetName;

					/**
					* @property {string} namespace Namespace of widget
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.namespace = definition.namespace;

					/**
					* @property {string} widgetBaseClass Widget base class
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.widgetBaseClass = this.namespace + '-' + this.widgetName;

					/**
					* @property {string} widgetFullName Full name of widget
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.widgetFullName = ((definition.namespace ? definition.namespace + '-' : "") + this.name).toLowerCase();
					/**
					* @property {string} id Id of widget instance
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.id = ej.getUniqueId();

					/**
					* @property {string} selector widget's selector
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.selector = definition.selector;
					/**
					* @property {string} binding Path to file with widget (without extension)
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.binding = definition.binding;
					/**
					* @property {HTMLElement} element Base element of widget
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.element = null;

					/**
					* @property {string} [defaultElement='<div>'] Default element for widget
					* @memberOf ej.widget.BaseWidget
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
			* @property {Object} options Default options for widget
			* @memberOf ej.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Read data-* attributes and save to #options object
			* @method _getCreateOptions
			* @param {HTMLElement} element Base element of widget
			* @return {Object}
			* @memberOf ej.widget.BaseWidget
			* @protected
			* @instance
			*/
			BaseWidget.prototype._getCreateOptions = function (element) {
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
			* Protected method to build widget
			* @method _build
			* @param template
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @memberOf ej.widget.BaseWidget
			* @protected
			* @template
			* @instance
			*/
			/**
			* Build widget. Call #\_getCreateOptions, #\_build
			* @method build
			* @param template
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			BaseWidget.prototype.build = function (template, element) {
				var id,
					node,
					name = this.widgetName,
					elementContainer;
				if (!element) {
					elementContainer = document.createElement('div');
					elementContainer.innerHTML = this.defaultElement;
					element = elementContainer.firstChild;
				}
				eventUtils.trigger(element, name + "beforecreate");
				element.setAttribute("data-ej-built", true);
				element.setAttribute("data-ej-binding", this.binding);
				element.setAttribute("data-ej-name", this.name);
				element.setAttribute("data-ej-selector", this.selector);
				id = element.getAttribute('id');
				if (!id) {
					element.setAttribute("id", this.id);
				} else {
					this.id = id;
				}

				if (typeof this._build === "function") {
					node = this._build(template, element);
					if (node) {
						this.element = node;
					}
					return node;
				}
				return node;
			};

			/**
			* Protected method to init widget
			* @method _init
			* @param {HTMLElement} element
			* @memberOf ej.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Init widget, call: #\_getCreateOptions, #\_init
			* @method init
			* @param {HTMLElement} element
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.init = function (element) {
				var id = element.getAttribute("id");
				if (!id) {
					id = this.id;
				} else {
					this.id = id;
				}

				if (!this.element) {
					this.element = element;
				}

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
			* @memberOf ej.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Bind widget events attached in init mode
			* @method _bindEvents
			* @param {HTMLElement} element Base element of widget
			* @memberOf ej.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Bind widget events, call: #\_buildBindEvents, #\_bindEvents
			* @method bindEvents
			* @param {HTMLElement} element Base element of widget
			* @param {Boolean} onlyBuild Inform about type of bindings: build/init
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.bindEvents = function (element, onlyBuild) {
				if (!onlyBuild) {
					element.setAttribute("data-ej-bound", "true");
				}
				engine.setBinding(element, this);
				if (typeof this._buildBindEvents === "function") {
					this._buildBindEvents(element);
				}
				if (!onlyBuild && typeof this._bindEvents === "function") {
					this._bindEvents(element);
				}

				eventUtils.trigger(element, this.widgetName + "create", this);

				return this;
			};

			/**
			* Protected method to destroy widget
			* @method _destroy
			* @template
			* @protected
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			/**
			* Destroy widget, call #\_destroy
			* @method destroy
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			BaseWidget.prototype.destroy = function () {
				if (typeof this._destroy === "function") {
					this._destroy();
				}
				// TODO: clean html markup
				this.element.removeAttribute("data-ej-bound");
				engine.removeBinding(this.element);
			};

			/**
			* Protected method to enable widget
			* @method _disable
			* @protected
			* @memberOf ej.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Disable widget, call: #\_disable
			* @method disable
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.disable = function () {
				var element = this.element,
					elementClasses = element.classList;

				if (typeof this._disable === "function") {
					this._disable(element);
				}
				elementClasses.add(this.widgetFullName + "-disabled");
				elementClasses.add("ui-state-disabled");
				element.setAttribute("aria-disabled", true);
				// @TODO
				//this.hoverable.removeClass( "ui-state-hover" );
				//this.focusable.removeClass( "ui-state-focus" );

				return this;
			};

			/**
			* Protected method to enable widget
			* @method _enable
			* @protected
			* @memberOf ej.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Enable widget, call: #\_enable
			* @method enable
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.enable = function () {
				var element = this.element,
					elementClasses = element.classList;

				if (typeof this._enable === "function") {
					this._enable(element);
				}
				elementClasses.remove(this.widgetFullName + "-disabled");
				elementClasses.remove("ui-state-disabled");
				element.setAttribute("aria-disabled", false);
				// @TODO
				//this.hoverable.removeClass( "ui-state-hover" );
				//this.focusable.removeClass( "ui-state-focus" );

				return this;
			};

			/**
			* Protected method to refresh widget
			* @method _refresh
			* @protected
			* @memberOf ej.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Refresh widget, call: #\_refresh
			* @method refresh
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.refresh = function () {
				if (typeof this._refresh === "function") {
					this._refresh();
				}
				return this;
			};


			/**
			* Get/Set options of widget
			* @method option
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			BaseWidget.prototype.option = function () {
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

			BaseWidget.prototype.isBound = function () {
				var element = this.element;
				return element && element.getAttribute('data-ej-bound') ? true : false;
			};

			BaseWidget.prototype.isBuilt = function () {
				var element = this.element;
				return element && element.getAttribute('data-ej-built') ? true : false;
			};

			/**
			* Protected method to get value of widget
			* @method _getValue
			* @return {Mixed}
			* @memberOf ej.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Protected method to set value of widget
			* @method _setValue
			* @param {Mixed} value
			* @return {Mixed}
			* @memberOf ej.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Get/Set value of widget
			* @method value
			* @param {Mixed} [value]
			* @memberOf ej.widget.BaseWidget
			* @return {Mixed}
			* @instance
			*/
			BaseWidget.prototype.value = function (value) {
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
			* Return element of widget
			* @method widget
			* @memberOf ej.widget.BaseWidget
			* @return {HTMLElement}
			* @instance
			*/
			BaseWidget.prototype.widget = function () {
				return this.element;
			};

			/**
			* Throw exception
			* @method raise
			* @param {string?} msg Message of throw
			* @memberOf ej.widget.BaseWidget
			* @return {Mixed}
			* @instance
			*/
			BaseWidget.prototype.raise = function (msg) {
				throw "Widget [" + this.widgetName + "]: " + msg;
			};

			/**
			* @method enhanceWithin
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			BaseWidget.prototype.enhanceWithin = function () {
				ej.log('method enhanceWithin is deprecated');
			};

			/**
			* @method enhance
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			BaseWidget.prototype.enhance = function () {
				ej.log('method enhance is deprecated');
			};

			// definition
			ej.widget.BaseWidget = BaseWidget;

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ej.widget.BaseWidget;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej));
