/*global window, define*/
/*jslint bitwise: true */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
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
			var isTizen = !(typeof tizen === "undefined");

			function isCircleShape() {
				var testDiv = document.createElement("div"),
					fakeBody = document.createElement("body"),
					html = document.getElementsByTagName('html')[0],
					style = getComputedStyle(testDiv),
					isCircle;

				testDiv.classList.add("is-circle-test");
				fakeBody.appendChild(testDiv);
				html.insertBefore(fakeBody, html.firstChild);
				isCircle = style.width === "1px";
				html.removeChild(fakeBody);

				return isCircle;
			}

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
					ie: false,
					tizen: isTizen
				},
				shape: {
					circle: isTizen ? window.matchMedia("(-tizen-geometric-shape: circle)").matches : isCircleShape(),
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
