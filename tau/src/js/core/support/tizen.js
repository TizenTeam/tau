/*global window, define*/
/*jslint bitwise: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class ns.support
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			ns.support = {
				cssTransitions: true,
				mediaquery: true,
				cssPseudoElement: true,
				touchOverflow: true,
				cssTransform3d: true,
				boxShadow: true,
				scrollTop: 0,
				dynamicBaseTag: true,
				cssPointerEvents: false,
				boundingRect: true,
				browser: {
					ie: false
				},
				gradeA : function () {
					return true;
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.support;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
