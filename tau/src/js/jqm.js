/*global window, define */
(function (ns, window) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core",
			"./core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/** @namespace ns.jqm */
			ns.jqm = {
				jQuery: ns.get('jQuery') || window.jQuery
			};
			document.addEventListener(ns.engine.eventType.INIT, function () {
				// Tell the world that JQM is ready to serve Tau
				ns.utils.events.trigger(document, 'mobileinit');
			}, false);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns, window));
