(function(window, document){
	var fixture = document.getElementById('qunit-fixture'),
		head = document.head,
		el1 = document.getElementById("test1-test-widget"),
		el2 = document.getElementById("test2-test-widget"),
		ulWithoutId = document.getElementById('odiv').children[0]; //get ul from div#odiv

	asyncTest("jqm bridge tests", function () {
		expect(20);
		document.addEventListener("bound", function () {
			var engine = ej.engine,
				b1 = engine.getBinding(el1),
				e1 = b1.element,
				$el1 = $(el1).test1(),
				$el2 = $(el2),
				$listview = $('#listview1'),
				e2,
				b2;

			equal($el1.test1("apiCall", 2), 4, "basic api call on widget1");
			equal(b1.getId(), $el1.test1("getId"), "compare identifiers on widget1");
			equal(e1, $el1.test1("getElement"), "compare elements on widget1");
			equal($el1, $el1.test1("getInstance"), "compare instances on widget1");
			equal(typeof $el1._veryPrivateMethod, "undefined", "check private methods jqm typeof on widget1");
			throws(function () {
				$el1.test1("_veryPrivateMethod");
			}, "check private method jqm access exception on widget1");
			equal(typeof b1._veryPrivateMethod, "function", "check private methods direct access on widget1");
			$el1.test1("destroy");
			equal( $el1.test1("apiCall", 2), $el1, "method call after widget1 was destroyed");
			equal(engine.getBinding(el1), null, "widget1 binding test after widget was destroyed");


			equal(typeof b2, "undefined", "check binding before widget2 initialization");
			equal($el2, $el2.test1(), "check constructor return instance");
			b2 = engine.getBinding(el2);
			ok(b2, "check binding after widget2 initialization");
			e2 = b2.element;
			equal(b2.getId(), $el2.test1("getId"), "compare identifiers on widget2");
			equal(e2, $el2.test1("getElement"), "compare elements on widget2");
			equal($el2, $el2.test1("getInstance"), "compare instances on widget2");
			equal(typeof $el2._veryPrivateMethod, "undefined", "check private methods jqm typeof on widget2");
			throws(function () {
				$el2.test1("_veryPrivateMethod");
			}, "check private method jqm access exception on widget2");
			equal(typeof b2._veryPrivateMethod, "function", "check private methods direct access on widget2");
			$el2.test1("destroy");
			equal($el2.test1("apiCall", 2), $el2, "method call after widget2 was destroyed");
			equal(engine.getBinding(el2), null, "widget2 binding test after widget was destroyed");

			start();
		}, false);
		ej.engine.run();
	});
}(window, document));