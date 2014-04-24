/*global window, define */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../events", // fetch namespace
			"../utils/events"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var eventUtils = ns.utils.events,
				pagebeforechange = {
					trigger: function (element, options) {
						eventUtils.trigger(element, "orientationchange", {'options': options});
					},
					properties: ['options']
				};

			ns.events.page = {
				pagebeforechange: pagebeforechange
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.events.orientationchange;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
