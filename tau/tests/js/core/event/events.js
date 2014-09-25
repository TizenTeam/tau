/*global module, ok, equal, test, ej*/
(function(document){
	'use strict';
	var handles = [],
		on = tau.event.on,
		off = tau.event.off,
		one = tau.event.one;
	//module('ej.event');

	function clearListeners() {
		var i,
			handle,
			length = handles.length;

		for (i=0; i<length; i++) {
			handle = handles[i];
			handle.element.removeEventListener(handle.event, handle.callback, handle.useCapture);
		}
	}

	module("ej.event", {
		teardown: function () {
			clearListeners()
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

	test('preventDefault on the same event', 2, function() {
		var element = document.getElementById('prevented');

		on(element, 'click', function (event) {
			ej.event.preventDefault(event);
			ok('First event');
			ok(!location.hash);
		}, true);
		element.click();
	});

	test('preventDefault on the same event', 2, function() {
		var element = document.getElementById('prevented');

		on(element, 'vclick', function (event) {
			ej.event.preventDefault(event);
			ok('First event');
			ok(!location.hash);
		}, true);
		element.click();
	});

	test("ej.event - check function trigger", function () {
		var element = document.getElementById("events1"),
			events = ej.event;

		equal(typeof events.trigger(element, "vclick"), "boolean", "function trigger returns boolean value");
	});

	test( "asynchronous tests for click event", 1, function() {
		var element = document.getElementById("events1"),
			events = ej.event,
			callback = function(){
				ok(true, "click event");
			};

		ej.engine.run();
		on(element, 'click', callback, true);

		events.trigger(element, "click");
		on(element, 'click', callback, false);
	});

	test( "asynchronous tests for vclick event", 1, function() {
		var element = document.getElementById("events1"),
			events = ej.event;

		on(element, 'vclick', function(){
			ok(true, "vclick event");
		}, true);

		events.trigger(element, "vclick");
	});

	test( "asynchronous tests for other event", 1, function() {
		var element = document.getElementById("events1"),
			events = ej.event;

		on(element, "test-event", function(){
			ok(true, "test-event event");
		}, true);

		events.trigger(element, "test-event");
	});

	test('stop propagation on the same event', 1, function() {
		var element = document.getElementById('test1');

		on(element, 'click', function (event) {
			ej.event.stopPropagation(event);
			ok('First event');
		}, true);
		on(document.body, 'click', function (event) {
			ok('Second event');
		}, false);

		mouseEvent(element, 'click');
	});

	test('stop propagation on custom event', 1, function() {
		var element = document.getElementById('test2'),
			testEvent;

		on(element, "testEvent", function (event) {
			ej.event.stopPropagation(event);
			ok('First event');
		}, true);
		on(document.body, "testEvent", function (event) {
			ok('Second event');
		}, false);

		mouseEvent(element, 'testEvent');
	});

	test('stop propagation on cloned event', 1, function() {
		var element = document.getElementById('test3'),
			events = ej.event;

		on(element, "testEvent2", function (event) {
			ok('First event');
			events.stopPropagation(event);
		}, false);
		on(document, "testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, true);
		on(document, "testEvent1", function (event) {
			ok('Second event');
		}, false);

		events.trigger(element, 'testEvent1');
	});

	test('stop Immediate propagation', 2, function() {
		var element = document.getElementById('test4');

		on(element, "click", function () {
			ok('First callback');
		}, true);
		on(element, "click", function (event) {
			ej.event.stopImmediatePropagation(event);
			ok('Second callback');
		}, true);
		on(element, "click", function () {
			ok('Third callback');
		}, true);

		mouseEvent(element, 'click');
	});

	test('stop Immediate propagation', 2, function() {
		var element = document.getElementById('test4');

		on(element, "click", function () {
			ok('First first callback');
		}, true);
		on(element, "click", function (event) {
			ej.event.stopImmediatePropagation(event);
			ok('First second callback');
		}, true);
		on(element, "click", function () {
			ok('First third callback');
		}, false);

		mouseEvent(element, 'click');
	});
	test('stop Immediate propagation', 1, function() {
		var element = document.getElementById('test3'),
			events = ej.event;

		on(element, "testEvent2", function (event) {
			ok('First event');
			ej.event.stopImmediatePropagation(event);
		}, false);
		on(document, "testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, true);
		on(document, "testEvent1", function (event) {
			ok('Second event');
		}, false);

		events.trigger(element, 'testEvent1');
	});

	test('stop Immediate propagation', 1, function() {
		var element = document.getElementById('test3'),
			events = ej.event;

		on(element, "testEvent2", function (event) {
			ok('First event');
			events.stopImmediatePropagation(event);
		}, false);
		on(document, "testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, false);
		on(document, "testEvent1", function (event) {
			ok('Second event');
		}, false);

		events.trigger(element, 'testEvent1');
	});

	test('on event catch on elements collection', 2, function() {
		var elements = document.querySelectorAll('.testone input'),
			events = ej.event;

		on(elements, "testEventOn", function (event) {
			ok('event catch');
		}, false);

		events.trigger(elements[0], "testEventOn");
		events.trigger(elements[1], "testEventOn");
	});

	test('off event catch on elements collection', 1, function() {
		var elements = document.querySelectorAll('.testone input'),
			events = ej.event;

		off(elements, "testEventOn", function (event) {
			ok('event catch');
		}, false);

		events.trigger(elements[0], "testEventOn");
		events.trigger(elements[1], "testEventOn");
		ok('event not catch');
	});

	test('one event catch', 1, function() {
		var element = document.getElementById('test3'),
			events = ej.event;

		one(element, "testEventOne", function (event) {
			ok('event catch');
		}, false);

		events.trigger(element, 'testEventOne');
		events.trigger(element, 'testEventOne');
	});

	test('one event catch on elements collection', 1, function() {
		var elements = document.querySelectorAll('.testone input'),
			events = ej.event;

		one(elements, "testEventOne", function (event) {
			ok('event catch');
		}, false);

		events.trigger(elements[0], "testEventOne");
		events.trigger(elements[0], "testEventOne");
	});

	test('one events (array) catch', 2, function() {
		var element = document.getElementById('test3'),
			events = ej.event;

		one(element, ["testEventOne", "testEventTwo"], function (event) {
			ok('event catch');
		}, false);

		events.trigger(element, "testEventOne");
		events.trigger(element, "testEventTwo");
	});

	test('one events (object) catch', 2, function() {
		var element = document.getElementById('test3'),
			events = ej.event;

		one(element, {"testEventOne":  function (event) {
			ok('event catch');
		}, "testEventTwo":  function (event) {
			ok('event catch');
		}}, false);

		events.trigger(element, "testEventOne");
		events.trigger(element, "testEventTwo");
	});


	function fireEvent(el, type, props, touches) {
		var evt = new CustomEvent(type, {
				"bubbles": true,
				"cancelable": true
			}),
			prop;

		for (prop in props) {
			evt[prop] = props[prop];
		}
		if (touches) {
			evt.touches = touches;
			evt.targetTouches = touches;
		}
		try {
			return el.dispatchEvent(evt);
		} catch (err) {
			console.log(err);
		}
		return false;
	};

	test('targetRelativeCoordsFromEvent', 3, function() {
		var element = document.getElementById('test3'),
			events = tau.event;

		one(element, "mouseup", function (event) {
			var coords = events.targetRelativeCoordsFromEvent(event);
			ok(coords.x);
			ok(coords.y);
		}, false);

		ok(fireEvent(element, "mouseup", {
			"offsetX": 50,
			"offsetY": 50
		}, []), "mouseup fired");
	});

	test('targetRelativeCoordsFromEvent', 3, function() {
		var element = document.getElementById('test3'),
			events = tau.event;

		one(element, "mouseup", function (event) {
			var coords = events.targetRelativeCoordsFromEvent(event);
			ok(coords.x);
			ok(coords.y);
		}, false);

		ok(fireEvent(element, "mouseup", {
			"pageX": 50,
			"pageY": 50,
			"clientX": 10,
			"clientY": 10
		}, []), "mouseup fired");
	});

	test('targetRelativeCoordsFromEvent', 3, function() {
		var element = document.getElementById('test3'),
			events = tau.event;

		one(element, "touchstart", function (event) {
			var coords = events.targetRelativeCoordsFromEvent(event);
			ok(coords.x);
			ok(coords.y);
		}, false);

		ok(fireEvent(element, "touchstart", {
			"pageX": 0,
			"pageY": 0,
			"clientX": 10,
			"clientY": 10
		}, [{"pageX": 0,
			"pageY": 0,
			"clientX": 10,
			"clientY": 10, target: element}]), "mouseup fired");
	});
}(document));
