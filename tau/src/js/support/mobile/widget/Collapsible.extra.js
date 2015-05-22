/*global window, ns, define */
/*jslint nomen: true */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #GroupIndex Alias for Collapsible Widget
 *
 * @class ns.widget.mobile.Collapsible
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../profile/mobile/widget/mobile/GroupIndex"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var GroupIndex = ns.widget.mobile.GroupIndex,
				engine = ns.engine;
			ns.widget.mobile.Collapsible = GroupIndex;
			engine.defineWidget(
				"Collapsible",
				"[data-role='collapsible'], .ui-collapsible",
				["open", "close"],
				GroupIndex,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Collapsible;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
