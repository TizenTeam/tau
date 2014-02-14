/*global window, define*/
/*jslint bitwise: true */
(function (window, document, ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			ej.set('rootDir', ej.getFrameworkPath());
			ej.set('version', '');
			ej.set('allowCrossDomainPages', false);
			ej.set('domCache', false);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return window.ejConfig;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
