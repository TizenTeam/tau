/*global window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/**
 * # Listview Widget
 * The list widget is used to display, for example, navigation data, results,
 * and data entries.
 **
 * @class ns.widget.mobile.Listview
 * @extends ns.widget.core.Listview
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/widget/core/Listview",
			"../mobile",
			"./BaseWidgetMobile",
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreListview = ns.widget.core.Listview,
				Listview = function () {
					CoreListview.call(this);
				},
				engine = ns.engine;

			Listview.prototype = new CoreListview();

			ns.widget.mobile.Listview = Listview;
			engine.defineWidget(
				"Listview",
				"[data-role='listview'], .ui-listview",
				[],
				Listview,
				"mobile",
				true,
				true,
				HTMLUListElement
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Listview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
