/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping class
 * @class ns.jqm.support
 */
(function (window, document, ns, $) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./jqm",
			"../core/engine",
			"../core/util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var support = ns.support,
				object = ns.util.object;

			ns.jqm.support = {
				/**
				* @performance test http://jsperf.com/check-document-property;
				*/
				touch: document.ontouchend !== undefined,
				/**
				* bind router to jqm
				* @method init
				* @param {ns.router.Page} router
				* @member ns.jqm
				*/
				init: function () {
					var router = ns.engine.getRouter();
					if ($) {
						object.merge($.support, support);
						ns.support = $.support;
						$.mobile = $.mobile || {};
						$.mobile.support = $.mobile.support || {};
						$.mobile.support.touch = support.touch;
						$.mobile.base = support.dynamicBaseTag ? {
							element: router.resetBase === undefined ? ns.error.bind(null, 'router PageExternal is not loaded') : router.resetBase(),
							set: router.setBase === undefined ? ns.error.bind(null, 'router PageExternal is not loaded') : router.setBase.bind(router),
							reset: router.resetBase === undefined ? ns.error.bind(null, 'router PageExternal is not loaded') : router.resetBase.bind(router)
						} : undefined;
						$.mobile.gradeA = ns.support.gradeA.bind(ns.support);
						$.mobile.browser = ns.support.browser;
					}
				}
			};

			// Listen when framework is ready
			document.addEventListener(ns.engine.eventType.INIT, function () {
				ns.jqm.support.init();
			}, false);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm.support;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns, ns.jqm.jQuery));
