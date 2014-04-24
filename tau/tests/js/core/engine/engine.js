/*global test, ok, equal, module, ej */
(function (document) {
	"use strict";
	var widget1,
		engine  = ej.engine;

	module("ej.engine functionality");

	asyncTest("Generating widgets", 9, function () {
		document.addEventListener("tauinit", function test1() {
			// @NOTE: ACTUAL TESTS HERE!
			document.removeEventListener("tauinit", test1, false);
			var engine = ej.engine,
				eventUtils = ej.utils.events,
				el1 = document.getElementById("test1-test-widget"),
				el3 = document.body.querySelector(".test-widget-built"),
				widget1 = engine.instanceWidget(el1, 'Test1', {
					create: function () {
						ok(true, 'create was called');
					}
				}),
				e1 = widget1.element;
			ok(widget1, "binding for widget1 with def created");
			equal(widget1.id, el1.id, "DOM and binding ids are the same for widget1");
			ok(e1.children.length, "widget1 child created");
			ok(e1.classList.contains("test"), "Widget1 classes moved");
			equal(widget1.apiCall(2), 4, "Widget1 api call");
			e1.addEventListener("test-event-bounce", function (evt1) {
				var data = evt1.detail.testData;
				equal(data, 4, "Widget1 event returning data");
				start();
				test('getBinding after change structure', function () {
					var page1 = document.getElementById('page1'),
						el1 = document.getElementById("test1-test-widget"),
						widget2 = ej.engine.instanceWidget(el1, 'Test1');
					ok(widget2 !== widget1, 'get binding return new widget');
					equal(ej.engine.getBinding(el1), widget2, 'get binding return new widget at second time');
					equal(ej.engine.getBinding(el1.id), widget2, 'get binding return new widget third time');
					equal(ej.engine.removeBinding(el1.id), true, 'remove binding return true');
					equal(ej.engine.removeBinding(el1.id), false, 'remove binding return false at second time');
					widget2 = ej.engine.instanceWidget(el1, 'Test1');
					equal(ej.engine.getBinding(el1), widget2, 'get binding return new widget after instanceWidget');
					ej.engine._clearBindings();
					equal(ej.engine.getBinding(el1), null, 'get binding return null after _clearBindings');
				});
			}, false);

			eventUtils.trigger(e1, "test-event", {"testData": 2});
			
			equal(ej.engine.getBinding(el1), widget1, 'getBinding return proper widget');
			equal(ej.engine.instanceWidget(el1, 'Test1'), widget1, 'instanceWidget return proper widget');
		}, false);
		ej.engine.run();
	});

	test('Define widgets without method array', function (){
		var testWidget = function () {},
			def;
		testWidget.prototype = new ej.widget.BaseWidget();
		
		ej.engine.defineWidget(
			"Test2",
			"div.just-to-run-with-empty-methods",
			null,
			testWidget
		);

		def = ej.engine.getWidgetDefinition('Test2');
		ok(def, "Definition exists");
		ok(def.methods, "Definition methods exists");
		equal(def.methods && def.methods.length, 6, "Definition has 6 basic methods");
	});

	test('Redefine widget', function () {
		var NewWidget = function () { return this; };
		NewWidget.prototype = new ej.widget.BaseWidget();
		equal(ej.engine.defineWidget(
				"Test1",
				"div.test-widget-by-definition",
				[],
				NewWidget
			), false, 'define widget return false');
		equal(typeof ej.engine.getWidgetDefinition("Test1"), 'object', 'get definition return object');
		ok(typeof ej.engine.getDefinitions(), 'object', 'getDefinitions return object');
		equal(ej.engine.defineWidget(
				"Test1",
				"div.test-widget-by-definition",
				[],
				NewWidget,
				'namespace',
				true
			), true, 'define widget with redefine parameter return true');
	});

	test('Create/destroy widgets', function() {
		var engine = ej.engine,
			widget = engine.getBinding("test1-test-widget"),
			buildChild;

		ok(!widget, 'widget not created');
		ej.utils.events.trigger(document.body, 'create');
		widget = engine.getBinding("test1-test-widget");
		ok(widget, 'widget Test1 created');
		//widget = engine.getBinding("page1");
		//ok(widget, 'widget page created');

		engine.destroyWidget("test1-test-widget");
		ok(!engine.getBinding("test1-test-widget"), 'widget Test1 destroyed');

		widget = engine.getBinding("test3-test-widget");
		ok(widget, 'widget Test3 created');
		buildChild = widget.element.querySelector('[data-tau-built]');
		ok(buildChild, "One build child inside");

		engine.destroyAllWidgets("test3-test-widget");
		ok(!engine.getBinding("test3-test-widget"), 'widget Test3 destroyed');

		ok(!buildChild.getAttribute('data-tau-built'), "Widget has no property 'data-tau-built' (is destroyed)");
	});

	test('Creating widgets with "justBuild"', function() {
		var element, widget,
			boundAttr = ej.engine.dataTau.bound;

			// Set justBuild
			ej.engine.setJustBuild(true);

			element = document.getElementById("test2-test-widget");
			widget = ej.engine.instanceWidget(element, "Test1");

			ok(widget, 'Widget Test2 created');
			equal(element.getAttribute(boundAttr), null, "Widget not bound");

			// Unset justBuild
			ej.engine.setJustBuild(false);
	});

	test("Create many widgets on one element - attributes", function () {
		var widget = document.getElementById("test4-test-widget"),
			test1Instance = engine.instanceWidget(widget, "Test1"),
			test2Instance = engine.instanceWidget(widget, "Test2");

		equal(widget.getAttribute("data-tau-built"), "Test1,Test2", "Widget gets proper data-tau-built value");
		equal(widget.getAttribute("data-tau-name"), "Test1,Test2", "Widget gets proper data-tau-name value");
		equal(widget.getAttribute("data-tau-bound"), "Test1,Test2", "Widget gets proper data-tau-bound value");

		engine.destroyAllWidgets(widget);
	});

	test("Create many widgets on one element - bindings", function () {
		var widget = document.getElementById("test4-test-widget"),
			test1Instance = engine.instanceWidget(widget, "Test1"),
			test2Instance = engine.instanceWidget(widget, "Test2"),
			tempBinding1 = engine.getBinding(widget, "Test1"),
			tempBinding2 = engine.getBinding(widget, "Test2"),
			multiBinding = engine.getAllBindings(widget);

		ok(test1Instance === tempBinding1, "getBinding returns reference to that same Test1 object");
		ok(test2Instance === tempBinding2, "getBinding returns reference to that same Test2 object");

		ok(test1Instance === multiBinding.Test1, "getAllBindings.Test1 returs reference to that same Test1 object");
		ok(test2Instance === multiBinding.Test2, "getAllBindings.Test2 returs reference to that same Test2 object");

		engine.destroyAllWidgets(widget);
	});

}(window.document));