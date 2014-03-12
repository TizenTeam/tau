/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping class
 * @class ej.jqm
 */
(function (window, document, ej, tau) {
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
				tauUtils = {
					/**
					*
					* @method init
					* @param {Object} engine engine object
					* @memberOf ej.jqm
					*/
					init: function () {
						tau.path = ej.utils.path;
						tau.fireEvent = events.trigger.bind(events.trigger);
						tau.getData = DOM.getData.bind(DOM);
					}
				};

			document.addEventListener("initjqm", function (evt) {
				tauUtils.init(evt.detail);
			}, false);

			tau.utils = tauUtils;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return tau.utils;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej, window.tau));
