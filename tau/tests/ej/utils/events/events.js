	//module('ej.utils.events');
	module("ej.utils.events", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	function mouseEvent(el, type){
		var ev = document.createEvent("MouseEvent");
		ev.initMouseEvent(
			type,
			true /* bubble */, true /* cancelable */,
			window, null,
			0, 0, 0, 0, /* coordinates */
			false, false, false, false, /* modifier keys */
			0 /*left*/, null
		);
		el.dispatchEvent(ev);
	}

	function createEvent(newType, original) {
		var evt = new CustomEvent(newType, {
			"bubbles": original.bubbles,
			"cancelable": original.cancelable,
			"detail": original.detail
		});
		evt._originalEvent = original;
		original.target.dispatchEvent(evt);
	}

	test("ej.utils.events - check function trigger", function () {
		var elem1 = document.getElementById("events1"),
			events = ej.utils.events;

		equal(typeof events.trigger(elem1, "vclick"), "boolean", "function trigger returns boolean value");
	});

	test( "asynchronous tests for click event", 1, function() {
		var elem1 = document.getElementById("events1"),
			events = ej.utils.events,
			callback = function(){
				ok(true, "click event");
			};

		ej.engine.run();
		elem1.addEventListener("click", callback, true);

		events.trigger(elem1, "click");
		elem1.removeEventListener('click', callback, false);
	});

	test( "asynchronous tests for vclick event", 1, function() {
		var elem1 = document.getElementById("events1"),
			events = ej.utils.events;

		
		elem1.addEventListener("vclick", function(){
		ok(true, "vclick event");
		}, true);

		events.trigger(elem1, "vclick");
	});

	test( "asynchronous tests for other event", 1, function() {
		var elem1 = document.getElementById("events1"),
			events = ej.utils.events;

		elem1.addEventListener("test-event", function(){
		ok(true, "test-event event");
		}, true);

		events.trigger(elem1, "test-event");
	});	

	test('stop propagation', 1, function() {
		var element = document.getElementById('test1');
		element.addEventListener('click', function (event) {
			ej.utils.events.stopPropagation(event);
			ok('First event');
		}, true);
		document.body.addEventListener('click', function (event) {
			ok('Second event');
		}, false);
		mouseEvent(element, 'click');
	});

	test('stop propagation', 1, function() {
		var element = document.getElementById('test1');
		element.addEventListener('vclick', function (event) {
			ej.utils.events.stopPropagation(event);
			ok('First event');
		}, true);
		document.body.addEventListener('vclick', function (event) {
			ok('Second event');
		}, false);
		mouseEvent(element, 'click');
	});

	test('stop propagation', 1, function() {
		var element = document.getElementById('test2'),
			testEvent,
			events = ej.utils.events;;

		element.addEventListener("testEvent", function (event) {
			ej.utils.events.stopPropagation(event);
			ok('First event');
		}, true);
		document.body.addEventListener("testEvent", function (event) {
			ok('Second event');
		}, false);

		mouseEvent(element, 'testEvent');
	});

	test('stop propagation', 1, function() {
		var element = document.getElementById('test3'),
			testEvent,
			events = ej.utils.events;

		element.addEventListener("testEvent2", function (event) {
			ok('First event');
			ej.utils.events.stopPropagation(event);
		}, false);
		document.addEventListener("testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, true);
		document.addEventListener("testEvent1", function (event) {
			ok('Second event');
		}, false);

		events.trigger(element, 'testEvent1');
	});

	test('stop propagation', 1, function() {
		var element = document.getElementById('test3'),
			testEvent,
			events = ej.utils.events;

		element.addEventListener("testEvent2", function (event) {
			ok('First event');
			ej.utils.events.stopPropagation(event);
		}, false);
		document.addEventListener("testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, false);
		document.addEventListener("testEvent1", function (event) {
			ok('Second event');
		}, false);

		events.trigger(element, 'testEvent1');
	});

	test('stop Immediate propagation', 2, function() {
		var element = document.getElementById('test4'),
			testEvent,
			events = ej.utils.events;;

		element.addEventListener("click", function (event) {
			ok('First callback');
		}, true);
		element.addEventListener("click", function (event) {
			ej.utils.events.stopImmediatePropagation(event);
			ok('Second callback');
		}, true);
		element.addEventListener("click", function (event) {
			ok('Third callback');
		}, true);

		mouseEvent(element, 'click');
	});

	test('stop Immediate propagation', 2, function() {
		var element = document.getElementById('test4'),
			testEvent,
			events = ej.utils.events;;

		element.addEventListener("click", function (event) {
			ok('First first callback');
		}, true);
		element.addEventListener("click", function (event) {
			ej.utils.events.stopImmediatePropagation(event);
			ok('First second callback');
		}, true);
		element.addEventListener("click", function (event) {
			ok('First third callback');
		}, false);

		mouseEvent(element, 'click');
	});
	test('stop Immediate propagation', 1, function() {
		var element = document.getElementById('test3'),
			testEvent,
			events = ej.utils.events;

		element.addEventListener("testEvent2", function (event) {
			ok('First event');
			ej.utils.events.stopImmediatePropagation(event);
		}, false);
		document.addEventListener("testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, true);
		document.addEventListener("testEvent1", function (event) {
			ok('Second event');
		}, false);

		events.trigger(element, 'testEvent1');
	});

	test('stop Immediate propagation', 1, function() {
		var element = document.getElementById('test3'),
			testEvent,
			events = ej.utils.events;

		element.addEventListener("testEvent2", function (event) {
			ok('First event');
			ej.utils.events.stopImmediatePropagation(event);
		}, false);
		document.addEventListener("testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, false);
		document.addEventListener("testEvent1", function (event) {
			ok('Second event');
		}, false);

		events.trigger(element, 'testEvent1');
	});