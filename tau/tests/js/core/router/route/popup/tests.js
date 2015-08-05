/*global document, window, module, equal, ok, asyncTest, start, define */

function testFunction (tau, prefix, setupFunction) {
	var engine = tau.engine,
		router = engine.getRouter();
	module("ns.router.route.popup", {
		teardown: function () {
			engine._clearBindings();
			engine.stop();
		},
		setup: function () {
			if (setupFunction) {
				setupFunction();
			}
			tau.setConfig("autorun", false);
			tau.setConfig("pageContainer", document.getElementById("qunit-fixture"));
			engine.run();
			router = engine.getRouter();
		}
	});

	prefix = prefix || "./";

	if (!window.navigator.userAgent.match("PhantomJS")) {

		asyncTest("test loading scripts in external files", 6, function () {
			var testExternalPopup = function () {
				document.removeEventListener("popupshow", testExternalPopup, false);
				equal(window.testVariableFromExternalFile, true, "variable from inline script is set");
				equal(window.testVariableFromExternalFileSrc, true, "variable from js file is set");
				ok(document.querySelector("[data-script]"), "proper move attribute for script");
				equal(router.getRoute("popup").getActiveElement(), document.getElementById("externalPopup"), "getActiveElement return correct value");
				equal(router.getRoute("popup").getActive(), tau.engine.getBinding(document.getElementById("externalPopup"), "Popup"), "getActive return correct value");
				equal(router.hasActivePopup(), true, "hasActivePopup return correct value");
				router.back();
				start();
			};
			document.addEventListener("popupshow", testExternalPopup, false);
			router.open(prefix + "test-data/external.html", {rel: "popup"});
		});

	}

	asyncTest("test not open popup without correct class", 1, function () {
		var popupElement = document.getElementById("popup");
		router.open("#popup", {rel: "popup"});
		setTimeout(function () {
			ok(!popupElement.classList.contains("ui-popup-active"), "popup not open");
			start();
		}, 100);
	});
}

if (window.define !== undefined) {
	define(function () {
		return testFunction;
	});
} else {
	document.addEventListener("DOMContentLoaded", function () {
		testFunction(window.tau);
	});
}
