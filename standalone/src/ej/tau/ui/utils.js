/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
(function (document, frameworkNamespace, namespace) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../ui",
			"../../ej/utils/path",
			"../../ej/utils/DOM/attributes",
			"../../ej/utils/events"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			document.addEventListener("initjqm", function () {
				var utils = frameworkNamespace.utils,
					DOM = utils.DOM,
					events = utils.events;

				namespace.path = utils.path;
				namespace.fireEvent = events.trigger.bind(events.trigger);
				namespace.getData = DOM.getData.bind(DOM);
			}, false);

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej, window.gear.ui));
