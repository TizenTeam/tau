/*global window, ns, define */
/*jslint nomen: true */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #SelectMenu Alias for DropdownMenu Widget
 *
 * @class ns.widget.mobile.SelectMenu
 * @author Hagun Kim <hagun.kim@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../profile/mobile/widget/mobile/DropdownMenu"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var SelectMenu = ns.widget.mobile.DropdownMenu,
				engine = ns.engine;
			ns.widget.mobile.SelectMenu = SelectMenu;
			engine.defineWidget(
				"SelectMenu",
				"",
				["open", "close"],
				SelectMenu,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.SelectMenu;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
