/*global window, define */
(function (ej, window) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[],
		function () {
			//>>excludeEnd("ejBuildExclude");
			/** @namespace tau */
			var orgTau = window.tau,
				tau = {};
			window.tau = tau;

			tau.noConflict = function () {
				var newTau = window.tau;
				window.tau = orgTau;
				return newTau;
			};
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return tau;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.ej, window));
