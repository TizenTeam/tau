/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Listview Widget
 * Shows a list view.
 *
 * @class ns.widget.tv.Listview
 * @class ns.widget.core.Listview
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/widget/core/Listview",
			"../../../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreListview = ns.widget.core.Listview,
				engine = ns.engine,
				Listview = function () {
					CoreListview.call(this);
				},
				prototype = new CoreListview();

			Listview.events = CoreListview.events;
			Listview.classes = CoreListview.classes;

			Listview.prototype = prototype;
			ns.widget.tv.Listview = Listview;

			engine.defineWidget(
				"Listview",
				".ui-listview, [data-role=listview]",
				[],
				Listview,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Listview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
