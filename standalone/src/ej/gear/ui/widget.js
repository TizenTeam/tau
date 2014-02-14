/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping class
 * @class ej.jqm.widgets
 */
(function (window, document, ej, gear) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../ui",
			"../../widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			/**
			* Alias to ej.engine
			* @memberOf ej.jqm
			* @private
			* @static
			*/
			var engine = null,
				gearWidget = {
					/**
					* bind widget to jqm
					* @method init
					* @param {Object} engine ej.engine class
					* @param {Object} definition widget definition
					* @memberOf ej.jqm
					* @static
					*/
					init: function (engine, definition) {
						this.processDefinition(definition, engine);
					},

					/**
					* bind widget to jqm
					* @method processDefinition
					* @param {Object} definition widget definition
					* @param {Object} engine ej.engine class
					* @memberOf ej.jqm
					* @static
					*/
					processDefinition: function (definition, engine) {
						/*
						* name of widget
						* type string
						*/
						var name = definition.name;

						gear.ui[name] = (function (definitionName) {
							return function (element, options) {
								return engine.instanceWidget(element, definitionName, options);
							};
						}(definition.name));
					}
				};

			document.addEventListener("widgetdefined", function (evt) {
				if (!engine) {
					engine = ej.engine;
				}
				gearWidget.init(engine, evt.detail);
			}, false);

			gear.ui.widget = gearWidget;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return gear.ui.widget;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej, window.gear));
