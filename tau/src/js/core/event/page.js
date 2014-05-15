/*global window, define */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../event", // fetch namespace
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

			ns.event.page = {
				pagebeforechange: pagebeforechange
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.page;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
