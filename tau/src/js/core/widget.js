/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Namespace For Widgets
 * Namespace For Widgets
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @class ns.widget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core",
			"./engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				widget = {
					/**
					 * Get bound widget for element
					 * @method getInstance
					 * @static
					 * @param {HTMLElement|string} element
					 * @param {string} type widget name
					 * @return {?Object}
					 * @member ns.widget
					 */
					getInstance: engine.getBinding,
					/**
					 * Returns Get all bound widget for element or id gives as parameter
					 * @method getAllInstances
					 * @param {HTMLElement|string} element
					 * @return {?Object}
					 * @static
					 * @member ns.widget
					 */
					getAllInstances: engine.getAllBindings
				};

			document.addEventListener(engine.eventType.WIDGET_DEFINED, function (evt) {
				var definition = evt.detail,
					name = definition.name;

				 ns.widget[name] = function (element, options) {
					 return engine.instanceWidget(element, name, options);
				 };

			}, true);

			/** @namespace ns.widget */
			ns.widget = widget;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
