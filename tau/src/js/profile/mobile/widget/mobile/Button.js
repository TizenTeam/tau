/*global window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/**
 * # Button Widget
 **
 * @class ns.widget.mobile.Button
 * @extends ns.widget.core.Button
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/widget/core/Button",
			"../mobile",
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreButton = ns.widget.core.Button,
				Button = function () {
					CoreButton.call(this);
				},
				engine = ns.engine;

			Button.prototype = new CoreButton();

			ns.widget.mobile.Button = Button;
			engine.defineWidget(
				"Button",
				"button, [data-role='button'], .ui-btn, input[type='button']",
				[],
				Button,
				"mobile",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
