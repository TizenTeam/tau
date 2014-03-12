/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping class
 * @class ej.jqm.widgets
 */
(function (window, document, ej, tau) {
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
				tauWidget = {
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

						tau[name] = (function (definitionName) {
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
				tauWidget.init(engine, evt.detail);
			}, false);

			tau.widget = tauWidget;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return tau.widget;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej, window.tau));
