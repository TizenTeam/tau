/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
(function (document, frameworkNamespace, namespace) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../ui",
			"../../ej/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			document.addEventListener("widgetdefined", function (evt) {
				var definition = evt.detail,
					name = definition.name,
					engine = frameworkNamespace.engine;

				namespace[name] = (function (definitionName) {
					return function (element, options) {
						return engine.instanceWidget(element, definitionName, options);
					};
				}(name));
			}, false);

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej, window.gear.ui));
