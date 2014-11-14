module("profile/wearable/defaults", {});

test("tau.defaults", function () {
	equal(typeof tau.defaults, "object", 'tau.defaults is object');
	equal(tau.defaults.autoInitializePage, true, 'tau.defaults.autoInitializePage');
	equal(tau.defaults.dynamicBaseEnabled, true, 'tau.defaults.dynamicBaseEnabled');

	tau.defaults.autoInitializePage = false;
	equal(tau.defaults.autoInitializePage, false, 'tau.defaults.autoInitializePage');

	tau.defaults.dynamicBaseEnabled = false;
	equal(tau.defaults.dynamicBaseEnabled, false, 'tau.defaults.dynamicBaseEnabled');

	tau.defaults.pageTransition = "slidedown";
	equal(tau.defaults.pageTransition, "slidedown", 'tau.defaults.pageTransition');

	tau.defaults.popupTransition = "slidedown";
	equal(tau.defaults.popupTransition, "slidedown", 'tau.defaults.popupTransition');
});
