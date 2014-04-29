/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping class
 * @class ns.jqm.widgets
 */
(function (window, document, ns, $) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../jqm",
			"../core/engine",
			"../core/widget/BaseWidget",
			"../core/utils/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			* Alias to Array.slice function
			* @method slice
			* @member ns.jqm
			* @private
			* @static
			*/
			var slice = [].slice,
				/**
				 * Wrap function in closure and wrap first argument in jquery object
				 */
				wrapFn = function (fn) {
					return function (el) {
						return fn($(el));
					};
				},
				/**
				* Alias to ns.engine
				* @member ns.jqm
				* @private
				* @static
				*/
				engine = ns.engine,
				object = ns.utils.object,
				jqmWidget = {
					/**
					* bind widget to jqm
					* @method init
					* @param {Object} engine ns.engine class
					* @param {Object} definition widget definition
					* @member ns.jqm
					* @static
					*/
					init: function (engine, definition) {
						var name = (definition.widgetNameToLowercase) ?
								definition.name.toLowerCase() :
										definition.name;
						if ($) {
							document.addEventListener(name + 'create', function (event) {
								var element = event.target,
									instance = event.detail,
									data = $(element).data(name);
								if (instance) {
									instance.bindings = {};
									instance.hoverable = {};
									instance.focusable = {};
									instance.document = $(element.style ? element.ownerDocument : element.document || element);
									instance.window = $(instance.document[0].defaultView || instance.document[0].parentWindow);
									object.merge(instance, data);
									$(element).data(name, instance);
								}
							}, true);
							this.processDefinition(definition, engine);
						}
					},

					/**
					* bind widget to jqm
					* @method processDefinition
					* @param {Object} definition widget definition
					* @param {Object} engine ns.engine class
					* @member ns.jqm
					* @static
					*/
					processDefinition: function (definition, engine) {
						/*
						* name of widget
						* type string
						*/
						var name = (definition.widgetNameToLowercase) ?
								definition.name.toLowerCase() :
										definition.name,
							/*
							* list of public methods
							* type Array
							*/
							methods = definition.methods;

						$.fn[name] = (function ($, engine, name, bindingNamespace, methods) {
							/*
							* widget instance
							* type Object
							*/
							var instance = null;
							return function () {
								/*
								* function arguments
								* type Array
								*/
								var args = slice.call(arguments),
								/*
									* element of jQuery collection
									* type HTMLElement
									*/
									element,
								/*
									* is built?
									* type Boolean
									*/
									built,
								/*
									* name of method
									* type string
									*/
									method,
								/*
									* result value
									* type mixed
									*/
									resultValue,
									/*
									* first argument of function
									* type mixed
									*/
									firstarg,
									i,
									options = {};

								for (i = 0; i < this.length; i++) {
									element = this.get(i);
									instance = engine.getBinding(element);
									built = instance && instance.isBuilt();
									firstarg = args.shift();
									if (firstarg === undefined || typeof firstarg === 'object') {
										if (typeof firstarg === 'object') {
											options = firstarg;
										}
										if (!instance || !built) {
											engine.instanceWidget(element, definition.name, options);
										} else {
											instance.configure(null, element, options);
										}
									} else {
										if (instance === null) {
											return this;
										}
										method = firstarg;
										if (method === "destroy") {
											instance.destroy();
											return this;
										}
										if (methods.indexOf(method) < 0) {
											throw "Method " + method + " does not exist!";
										}
										if (name === 'listview' &&
											method === 'option' &&
											args[0] === "autodividersSelector" &&
											typeof args[1] === 'function') {
												// wrap first argument of callback method in JQuery object
												args[1] = wrapFn(args[1]);
										}
										resultValue = instance[method].apply(instance, args);
										if (resultValue !== undefined) {
											if (resultValue !== instance) {
												return resultValue;
											}
										}
									}
								}
								return this;
							};
						}($, engine, name, definition.binding, methods));
						if (definition.namespace) {
							$[definition.namespace] = $[definition.namespace] || {};
							$[definition.namespace][definition.name.toLowerCase()] = definition.widgetClass;
						}
					}
				};

			document.addEventListener(engine.eventType.WIDGET_DEFINED, function (evt) {
				jqmWidget.init(engine, evt.detail);
			}, false);

			document.addEventListener(engine.eventType.INIT, function () {
				engine.defineWidget(
					"FixedToolbar",
					"",
					[],
					ns.widget.Page,
					'mobile'
				);
				engine.defineWidget(
					"pagelayout",
					"",
					[],
					ns.widget.Page,
					'mobile'
				);
				engine.defineWidget(
					"popupwindow",
					"",
					[],
					ns.widget.Popup,
					'tizen'
				);
				engine.defineWidget(
					"ctxpopup",
					"",
					[],
					ns.widget.Popup,
					'tizen'
				);

			}, false);

			ns.jqm.widget = jqmWidget;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm.widget;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns, ns.jqm.jQuery));
