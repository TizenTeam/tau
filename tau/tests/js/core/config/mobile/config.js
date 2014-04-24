/*global test, ok, equal, module, strictEqual*/
/**
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ej){
	"use strict";

	module("[mobile] tauConfig / nsConfig values");

	test("Test default config values", function() {
		strictEqual(ej.get("autoBuildOnPageChange"), true, "'autoBuildOnPageChange' - Auto building widgets on page change is set to: true");
	});
}(window.ej));