/* global document, tau, define, module, test, equal */

function runTests(tau) {
	module("profile/wearable/config");

	test("config (wearable)", function () {
		equal(tau.getConfig("enablePopupScroll"), false, "enablePopupScroll is set correct");
		equal(tau.getConfig("popupTransition"), "slideup", "popupTransition is set correct");
		equal(tau.getConfig("enablePageScroll"), false, "enablePageScroll is set correct");
	});
}

if (typeof define === "function") {
	define(function () {
		return runTests;
	});
} else {
	runTests(tau);
}
