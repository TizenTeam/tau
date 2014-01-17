/*global window, define */
(function (ej, window) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[],
		function () {
			//>>excludeEnd("ejBuildExclude");
			/** @namespace gear.ui */
			var orgGear = window.gear,
				gear = {};
			window.gear = gear;

			gear.ui = {};
			gear.ui.noConflict = function () {
				var newGear = window.gear;
				window.gear = orgGear;
				return newGear;
			};
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return gear.ui;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.ej, window));
