/*global test, ok, equal, module, ej */
(function (document, console, ns) {
	"use strict";
	var engine = ns.engine,
		BaseWidget = ns.widget.BaseWidget,
		WidgetPage = (ns.widget.mobile && ns.widget.mobile.Page) || ns.widget.wearable.Page,
		isWearable = (!ns.widget.mobile),
		testElement;

	function _manualClean(elementId) {
		var possibleWidget,
			newElement;

		engine.removeBinding(elementId);

		possibleWidget = document.getElementById(elementId);
		newElement = document.createElement("div");

		newElement.innerHTML = possibleWidget.innerHTML;

		possibleWidget.parentElement.replaceChild(newElement, possibleWidget);
		newElement.id = elementId;
	}

	module("ej.engine methods", {
		setup: function () {
			testElement = document.getElementById("page1");
			engine.run();
		},
		teardown: function () {
			_manualClean("non-widget");
			_manualClean("future-widget");

			engine.stop();
		}
	});

	test('Checking engine.justBuild method', function () {
		equal(engine.getJustBuild(), false, "Default justBuild value is 'false'");

		engine.setJustBuild(true);
		equal(engine.getJustBuild(), true, "Value changed to 'true'");
		equal(window.location.hash, "#build", "Hash changed to '#build'");

		engine.setJustBuild(false);
		equal(engine.getJustBuild(), false, "Value changed to 'false'");
		equal(window.location.hash, "", "Hash changed to ''");
	});

	test("Checking .instanceWidget method", function () {
		var tempElement = document.getElementById("future-widget"),
			tempBinding,
			tempBinding2;

		tempBinding = engine.instanceWidget(tempElement, "NonExistingWidget");
		ok(tempBinding === null, "Creating a instance of non-existing widget returns 'null'");

		tempBinding = engine.instanceWidget(tempElement, "Test1");
		ok(tempBinding instanceof BaseWidget, "Widget is an instance of Base Widget");
		ok(tempBinding instanceof ns.test.widget1, "Widget is an instance of Test1");

		tempBinding2 = engine.instanceWidget(tempElement, "Test1");
		ok(tempBinding === tempBinding2, "Creating same widget on that same element returns that same reference");

		tempBinding2 = engine.instanceWidget(tempElement, "Test2");
		ok(tempBinding2 instanceof BaseWidget, "New widget on that same HTMLElement is an instance of BaseWidget");
		ok(tempBinding2 instanceof ns.test.widget2, "New widget on that same HTMLElement is an instance of Test2");
	});

	test('Checking .instanceWidget method with empty element', function() {
		var oldErrorLog = console.error,
			logSpy = function() {
				ok(true, "Error was thrown");
			};

		// Change internal method (used inside instanceWidget) into spy function
		console.error = logSpy;

		engine.instanceWidget(null, 'Button');

		// Restore real method
		console.error = oldErrorLog;
	});

	test("Checking .getBinding method - one parameter", function () {
		var tempBinding,
			tempBinding2;

		tempBinding = engine.getBinding(window.ej);
		ok(tempBinding === null, "Passing bad reference returns 'null'");

		tempBinding = engine.getBinding(document.documentElement);
		ok(tempBinding === null, "Passing element reference to a non-widget element returns 'null'");

		tempBinding = engine.getBinding("non-widget");
		ok(tempBinding === null, "Passing string as ID to a non-widget element returns 'null'");

		tempBinding = engine.getBinding(testElement);
		ok(!!tempBinding, "Widget exists");
		ok(tempBinding instanceof BaseWidget, "Widget is a instanceof BaseWidget");
		ok(tempBinding instanceof WidgetPage, "Widget is a instanceof Page");

		tempBinding2 = engine.getBinding("page1");
		ok(tempBinding === tempBinding2, "Passing HTMLElement reference and string ID returns that same object reference");
	});

	test("Checking .getBinding method - two parameters", function () {
		var tempBinding,
			tempBinding2;

		tempBinding = engine.getBinding(window.ej, "Test1");
		ok(tempBinding === null, "Passing bad reference returns 'null'");

		tempBinding = engine.getBinding(document.documentElement, "Test1");
		ok(tempBinding === null, "Passing HTMLElement reference to a non-widget element returns 'null'");

		tempBinding = engine.getBinding("non-widget", "Test1");
		ok(tempBinding === null, "Passing string as ID to a non-widget element returns 'null'");

		// A binding should be returned only when HTMLElement contains a widget of the a proper type
		tempBinding = engine.getBinding(testElement, "Test2");
		ok(tempBinding === null, "'null' should be returned when a HTMLElement (that is bound) does not have a widget binding of a proper type");

		tempBinding = engine.getBinding(testElement, (isWearable && "page") || "Page");
		ok(!!tempBinding, "Widget reference was returned");
		ok(tempBinding instanceof BaseWidget, "Widget is a instanceof BaseWidget");
		ok(tempBinding instanceof WidgetPage, "Widget is a instanceof Page");

		tempBinding2 = engine.getBinding("page1", (isWearable && "page") || "Page");
		ok(tempBinding === tempBinding2, "Passing HTMLElement reference and string ID returns that same object reference");
	});

	test("Checking .getAllBindings method", function (){
		var tempBindings,
			tempBindings2;

		tempBindings = engine.getAllBindings(window.ej);
		ok(tempBindings === null, "Passing bad reference returns 'null'");

		tempBindings = engine.getAllBindings(document.documentElement);
		ok(tempBindings === null, "Passing HTMLElement reference to a non-widget element returns 'null'");

		tempBindings = engine.getAllBindings(testElement);
		equal(typeof tempBindings, "object", "Passing a proper reference gives a object");
		if (!isWearable) {
			ok(!!tempBindings.Page, "Returned object contains proper widget property");
			ok(tempBindings.Page instanceof WidgetPage, "Widget property is a proper reference to a widget object");

			tempBindings2 = engine.getAllBindings("page1");
			ok(tempBindings.Page === tempBindings2.Page, "Same widget references are returned while calling method with ID as parameter");
		} else {
			ok(!!tempBindings.page, "Returned object contains proper widget property");
			ok(tempBindings.page instanceof WidgetPage, "Widget property is a proper reference to a widget object");

			tempBindings2 = engine.getAllBindings("page1");
			ok(tempBindings.page === tempBindings2.page, "Same widget references are returned while calling method with ID as parameter");
		}
	});

	test("Checking .getAllBindings method - after manually adding instances", function () {
		var tempElement = document.getElementById("future-widget"),
			tempBindings,
			widgetInstanceTest1,
			widgetInstanceTest2;

		tempBindings = engine.getAllBindings(tempElement);
		ok(tempBindings === null, "Before calling instanceWidget element does is not bound to any widgets.");

		// Instance first widget
		widgetInstanceTest1 = engine.instanceWidget(tempElement, "Test1");

		tempBindings = engine.getAllBindings(tempElement);
		ok(!!tempBindings.Test1, "Method returned an object with .Test1 property");
		ok(tempBindings.Test1 instanceof ns.test.widget1, "Object property is a instanceof ej.test.widget1");
		ok(tempBindings.Test1 === widgetInstanceTest1, "Returned reference targets that same widget instance");

		// Instance second widget
		widgetInstanceTest2 = engine.instanceWidget(tempElement, "Test2");

		tempBindings = engine.getAllBindings(tempElement);
		ok(!!tempBindings.Test2, "Method returned an object with .Test2 property");
		ok(tempBindings.Test2 instanceof ns.test.widget2, "Object property is a proper instance of widget");
		ok(tempBindings.Test2 === widgetInstanceTest2, "Returned reference targets that same widget instance");

		ok(!!tempBindings.Test2 && !!tempBindings.Test1, "Returned object still contains references to both widget instances");
	});

	test("Checking .setBinding method", function () {
		var tempElement = document.getElementById("future-widget"),
			tempBinding,
			tempBinding2,
			widgetInstance,
			widgetInstance2;

		tempBinding = engine.getBinding(tempElement, "Test1");
		ok(tempBinding === null, "getBinding returns null");
		//ok(!window.ejWidgetBindingMap["future-widget"], "Widget map has no Element entry");

		widgetInstance = engine.instanceWidget(tempElement, "Test1");
		//tempBinding = window.ejWidgetBindingMap["future-widget"];
		//equal(typeof tempBinding, "object", "Calling instanceWidget internally fills ejWidgetBindingMap with setBinding");
		//ok(tempBinding.instances.Test1 === widgetInstance, "setBinding creates Test1 reference inside binding map to newly created widget");
		ok(widgetInstance === engine.getBinding(tempElement, "Test1"), "getBinding properly returns the instance");

		widgetInstance2 = engine.instanceWidget(tempElement, "Test2");
		//tempBinding2 = window.ejWidgetBindingMap["future-widget"];
		//ok(tempBinding === tempBinding2, "Internal setBinding calls doesn't rebuild the object for holding widget instance references");
		//ok(tempBinding2.instances.Test2 === widgetInstance2, "setBinding creates Button reference inside binding map to newly created widget");
		ok(widgetInstance2 === engine.getBinding(tempElement, "Test2"), "getBinding properly returns the instance");

	});

//	test("Checking .removeBinding method", function () {
//		ok(true, "@TODO!");
//
//		// 1. Add widget instances (many)
//		// 2. remove widget instance of a given type
//		// Check if attributes are parts are removed
//		// check if full attributes are removed if last widget is removed
//	});

//	test("Checking .removeAllBindings method", function () {
//		ok(true, "@TODO!");
//
//		// 1. Add widget instances
//		// 2. Remove all
//		// 3. Check if all references were cleared
//	});

} (window.document, window.console, window.ej));