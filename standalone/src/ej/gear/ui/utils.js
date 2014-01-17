/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping class
 * @class ej.jqm
 */
(function (window, document, ej, gear) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../ui",
			"../../utils/path",
			"../../utils/DOM/attributes",
			"../../utils/events"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			var DOM = ej.utils.DOM,
				events = ej.utils.events,
				gearUtils = {
					/**
					*
					* @method init
					* @param {Object} engine engine object
					* @memberOf ej.jqm
					*/
					init: function () {
						gear.ui.path = ej.utils.path;
						gear.ui.fireEvent = events.trigger.bind(events.trigger);
						gear.ui.getData = DOM.getData.bind(DOM);
					}
				};

			document.addEventListener("initjqm", function (evt) {
				gearUtils.init(evt.detail);
			}, false);

			gear.ui.utils = gearUtils;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return gear.ui.utils;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej, window.gear));
