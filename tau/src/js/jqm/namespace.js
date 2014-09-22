/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #jQuery Mobile mapping namespace
 * Object maps all methods enabling jQuery Mobile API.
 * @class ns.jqm
 */
(function (ns, window) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core/core",
			"../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.jqm = {
				/**
				 * jQuery object
				 * @property {Object} jQuery
				 * @member ns.jqm
				 */
				jQuery: ns.getConfig('jQuery') || window.jQuery
			};
			document.addEventListener(ns.engine.eventType.INIT, function () {
				// Tell the world that JQM is ready to serve Tau
				ns.event.trigger(document, 'mobileinit');
			}, false);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns, window));
