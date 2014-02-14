/*global window, define */
(function (window) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[],
		function () {
			//>>excludeEnd("ejBuildExclude");
			/** @namespace gear.ui */
			var orgGear = window.gear,
				ui = {
					noConflict: function () {
						var newGear = window.gear;
						window.gear = orgGear;
						return newGear;
					}
				},
				gear = {
					ui: ui
				};
			window.gear = gear;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ui;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window));
