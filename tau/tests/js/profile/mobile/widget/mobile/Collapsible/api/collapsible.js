(function (ns) {
	"use strict";

	module("profile/mobile/widget/mobile/Collapsible", {});

	test("Check the existence of objects/functions", function () {
		equal(typeof ns, "object", "ns exists");
		equal(typeof ns.widget, "object", "ns.widget exists");
		equal(typeof ns.widget.mobile, "object", "ns.widget.mobile exists");
		equal(typeof ns.widget.mobile.Collapsible, "function", "ns.widget.mobile.Collapsible exists");
	});

	test("Check widget options existance and default values", function () {
		var widget = new ns.widget.mobile.Collapsible(),
			options = widget.options;

		equal(typeof options, "object", "Options object exists");

		strictEqual(options.collapsed, true, "options.collapsed has proper default value");

		equal(options.heading, "h1,h2,h3,h4,h5,h6,legend,li", "options.heading has proper default value");

		// --- 
		equal(typeof widget._destroy, 'function', 'Protected method ._destroy exists (.destroy() can be called)');
	});
}(ej));