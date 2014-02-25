module("engine");

(function () {
	var widget1;

	asyncTest("generating widgets", 9, function () {
		document.addEventListener("mobileinit", function test1() {
			// @NOTE: ACTUAL TESTS HERE!
			document.body.removeEventListener("mobileinit", test1, false);
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
					ok(widget2 != widget1, 'get binding return new widget');
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

	console = {
			log: function (arg1, arg2, arg3) {
				ej.utils.events.trigger(document.body, 'consolelog', arg1+' '+arg2+' '+arg3);
			},
			warn: function (arg1, arg2, arg3) {
				ej.utils.events.trigger(document.body, 'consolewarn', arg1+' '+arg2+' '+arg3);
			},
			error: function (arg1, arg2, arg3) {
				ej.utils.events.trigger(document.body, 'consoleerror', arg1+' '+arg2+' '+arg3);
			}
		};

	test('redefine widget', function () {
		var NewWidget = function () { return this; };
		NewWidget.prototype = new ej.widget.BaseWidget();
		equal(ej.engine.defineWidget(
				"Test1",
				"ej.test.widget1",
				"div.test-widget-by-definition",
				[],
				NewWidget
			), false, 'define widget return false');
		equal(typeof ej.engine.getWidgetDefinition("Test1"), 'object', 'get definition return object');
		ok(typeof ej.engine.getDefinitions(), 'object', 'getDefinitions return object');
		equal(ej.engine.defineWidget(
				"Test1",
				"ej.test.widget1",
				"div.test-widget-by-definition",
				[],
				NewWidget,
				'namespace',
				true
			), true, 'define widget with redefine parameter return true');
	});
	
	test('create/destroy widgets', function() {
		var widget = ej.engine.getBinding("test1-test-widget");
		ok(!widget, 'widget not created');
		ej.utils.events.trigger(document.body, 'create');
		widget = ej.engine.getBinding("test1-test-widget");
		ok(widget, 'widget Test1 created');
		widget = ej.engine.getBinding("page1");
		ok(widget, 'widget page created');
		widget = ej.engine.destroyWidget("test1-test-widget");
		ok(!widget, 'widget Test1 destroyed');
	});
}());