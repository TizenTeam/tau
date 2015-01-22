/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/*
 *
 * @class ns.widget.wearable.IndexScrollbar
 * @extends ns.widget.core.IndexScrollbar
 * @since 2.0
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/widget/core/indexscrollbar/IndexScrollbar",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var engine = ns.engine,
				CoreIndexScrollbar = ns.widget.core.IndexScrollbar,
				prototype = new CoreIndexScrollbar(),
				IndexScrollbar = function () {
					CoreIndexScrollbar.call(this);
				};

			// definition
			IndexScrollbar.prototype = prototype;
			ns.widget.wearable.IndexScrollbar = IndexScrollbar;

			engine.defineWidget(
				"IndexScrollbar",
				".ui-indexscrollbar",
				[],
				IndexScrollbar,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.IndexScrollbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
