(function (document, console, ns) {
	"use strict";
	var engine = ns.engine,
		testElement;

	module("tau.widget", {
		setup: function () {
			testElement = document.getElementById("first");
		},
		teardown: function () {
			engine.removeBinding("first");
		}
	});

	test ( "API tau.widget" , function () {
		equal(typeof tau, 'object', 'Class tau exists');
		equal(typeof tau.widget, 'object', 'Class tau.widget exists');
		equal(typeof tau.widget.getInstance, 'function', 'Method tau.widget.getInstance exists');
		equal(typeof tau.widget.getAllInstances, 'function', 'Method tau.widget.getAllInstances exists');
	});

	test("Checking .getInstance method", function () {
		var tempBinding = tau.widget.getInstance(ns);

		equal(tempBinding, null, "Passing bad reference returns 'null'");

		tempBinding = tau.widget.getInstance(document.documentElement);
		equal(tempBinding, null, "Passing element reference to a non-widget element returns 'null'");

		tempBinding = tau.widget.getInstance("non-widget");
		equal(tempBinding, null, "Passing string as ID to a non-widget element returns 'null'");

		//initialize widget
		engine.instanceWidget(testElement, 'page');

		//getting the instance of the widget with alias of getBinding method - getInstance
		tempBinding = tau.widget.getInstance(testElement);
		ok(tempBinding, "Widget exists");
		ok(tempBinding instanceof ns.widget.wearable.Page, "Widget is a instanceof Page when use getInstance");

		equal(tau.widget.getInstance(testElement), engine.getBinding(testElement, "page"), "Same instance is return from the getInstance and getBinding method");
	});


	test("Checking .getAllInstances method", function (){
		var tempBindings = tau.widget.getAllInstances(ns),
			temp1Bindings,
			temp2Bindings;

		equal(tempBindings, null, "Passing bad reference returns 'null'");

		tempBindings = tau.widget.getAllInstances(document.documentElement);
		equal(tempBindings, null, "Passing HTMLElement reference to a non-widget element returns 'null'");

		//initialize widget
		engine.instanceWidget(testElement, 'page');
		//initialize second widget on this same element
		engine.instanceWidget(testElement, 'popup');

		//getting all the instances attached to the testElement
		tempBindings = tau.widget.getAllInstances(testElement);
		equal(typeof tempBindings, "object", "Passing a proper reference gives a object when getAllInstances is used");
		ok(tempBindings.page instanceof ns.widget.wearable.Page, "Returned object contains page widget instance when getAllInstances is used");
		ok(tempBindings.popup instanceof ns.widget.wearable.Popup, "This same object contains popup widget instance when getAllInstances is used");

		equal(tau.widget.getAllInstances(testElement), engine.getAllBindings(testElement), "Same instance is return from the getInstance and getBinding method");
	});

} (window.document, window.console, tau._export));