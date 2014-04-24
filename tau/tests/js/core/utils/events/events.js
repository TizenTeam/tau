/*global module, ok, equal, test, ej*/
(function(document){
	'use strict';
	var handles = [];
	//module('ej.utils.events');

	/**
	 *
	 * @param {HTMLElement} element
	 * @param {string} event
	 * @param {Function} callback
	 * @param {boolean} useCapture
	 */
	function one(element, event, callback, useCapture) {
		var handle = function(event) {
				element.removeEventListener(event, handle, useCapture);
				callback(event);
			};
		element.addEventListener(event, handle, useCapture);
		handles.push({
			element: element,
			event: event,
			callback: handle,
			useCapture: useCapture
		});
	}

	function clearListeners() {
		var i,
			handle,
			length = handles.length;

		for (i=0; i<length; i++) {
			handle = handles[i];
			handle.element.removeEventListener(handle.event, handle.callback, handle.useCapture);
		}
	}

	module("ej.utils.events", {
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

	test("ej.utils.events - check function trigger", function () {
		var element = document.getElementById("events1"),
			events = ej.utils.events;

		equal(typeof events.trigger(element, "vclick"), "boolean", "function trigger returns boolean value");
	});

	test( "asynchronous tests for click event", 1, function() {
		var element = document.getElementById("events1"),
			events = ej.utils.events,
			callback = function(){
				ok(true, "click event");
			};

		ej.engine.run();
		one(element, 'click', callback, true);

		events.trigger(element, "click");
		one(element, 'click', callback, false);
	});

	test( "asynchronous tests for vclick event", 1, function() {
		var element = document.getElementById("events1"),
			events = ej.utils.events;

		one(element, 'vclick', function(){
			ok(true, "vclick event");
		}, true);

		events.trigger(element, "vclick");
	});

	test( "asynchronous tests for other event", 1, function() {
		var element = document.getElementById("events1"),
			events = ej.utils.events;

		one(element, "test-event", function(){
			ok(true, "test-event event");
		}, true);

		events.trigger(element, "test-event");
	});	

	test('stop propagation on the same event', 1, function() {
		var element = document.getElementById('test1');

		one(element, 'click', function (event) {
			ej.utils.events.stopPropagation(event);
			ok('First event');
		}, true);
		one(document.body, 'click', function (event) {
			ok('Second event');
		}, false);

		mouseEvent(element, 'click');
	});

	test('stop propagation on custom event', 1, function() {
		var element = document.getElementById('test2'),
			testEvent;

		one(element, "testEvent", function (event) {
			ej.utils.events.stopPropagation(event);
			ok('First event');
		}, true);
		one(document.body, "testEvent", function (event) {
			ok('Second event');
		}, false);

		mouseEvent(element, 'testEvent');
	});

	test('stop propagation on cloned event', 1, function() {
		var element = document.getElementById('test3'),
			events = ej.utils.events;

		one(element, "testEvent2", function (event) {
			ok('First event');
			events.stopPropagation(event);
		}, false);
		one(document, "testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, true);
		one(document, "testEvent1", function (event) {
			ok('Second event');
		}, false);

		events.trigger(element, 'testEvent1');
	});

	test('stop Immediate propagation', 2, function() {
		var element = document.getElementById('test4');

		one(element, "click", function () {
			ok('First callback');
		}, true);
		one(element, "click", function (event) {
			ej.utils.events.stopImmediatePropagation(event);
			ok('Second callback');
		}, true);
		one(element, "click", function () {
			ok('Third callback');
		}, true);

		mouseEvent(element, 'click');
	});

	test('stop Immediate propagation', 2, function() {
		var element = document.getElementById('test4');

		one(element, "click", function () {
			ok('First first callback');
		}, true);
		one(element, "click", function (event) {
			ej.utils.events.stopImmediatePropagation(event);
			ok('First second callback');
		}, true);
		one(element, "click", function () {
			ok('First third callback');
		}, false);

		mouseEvent(element, 'click');
	});
	test('stop Immediate propagation', 1, function() {
		var element = document.getElementById('test3'),
			events = ej.utils.events;

		one(element, "testEvent2", function (event) {
			ok('First event');
			ej.utils.events.stopImmediatePropagation(event);
		}, false);
		one(document, "testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, true);
		one(document, "testEvent1", function (event) {
			ok('Second event');
		}, false);

		events.trigger(element, 'testEvent1');
	});

	test('stop Immediate propagation', 1, function() {
		var element = document.getElementById('test3'),
			events = ej.utils.events;

		one(element, "testEvent2", function (event) {
			ok('First event');
			events.stopImmediatePropagation(event);
		}, false);
		one(document, "testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, false);
		one(document, "testEvent1", function (event) {
			ok('Second event');
		}, false);

		events.trigger(element, 'testEvent1');
	});
}(document));