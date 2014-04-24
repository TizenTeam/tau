/*global $, document, CustomEvent, asyncTest, ok, start */
$().ready(function () {
	"use strict";
	module('ej.events.touch');
	QUnit.config.testTimeout = 5000;

	function fireEvent(type, props) {
		var el = document.body,
			evt = new CustomEvent(type, {
				"bubbles": true,
				"cancelable": true
			}),
			prop;
		for (prop in props) {
			if (props.hasOwnProperty(prop)) {
				evt[prop] = props[prop];
			}
		}
		try {
			return el.dispatchEvent(evt);
		} catch (err) {
			console.log(err);
		}
		return false;
	}

	function tapTest(event) {
		document.body.removeEventListener('tap', tapTest, false);
		equal(event.type, 'tap', 'tap');
		start();
	}

	asyncTest('tap', 1, function () {
		document.body.addEventListener('tap', tapTest, false);
		fireEvent('vmousedown', {
			"pageX": 50,
			"pageY": 50
		});
		setTimeout(function () {
			fireEvent('vclick', {
				"pageX": 50,
				"pageY": 50
			});
		}, 1);
	});

	function tapHoldTest(event) {
		document.body.removeEventListener('taphold', tapHoldTest, false);
		equal(event.type, 'taphold', 'taphold');
		start();
	}

	asyncTest('taphold', 1, function () {
		document.body.addEventListener('taphold', tapHoldTest, false);
		fireEvent('vmousedown', {
			"pageX": 50,
			"pageY": 50
		});
		setTimeout(function () {
			fireEvent('vclick', {
				"pageX": 50,
				"pageY": 50
			});
		}, 100);
	});

	function swipeTest(event) {
		document.body.removeEventListener('swipe', swipeTest, false);
		equal(event.type, 'swipe', 'swipe');
		start();
	}

	asyncTest('swipe', 1, function () {
		document.body.addEventListener('swipe', swipeTest, false);
		fireEvent('vmousedown', {
			"pageX": 50,
			"pageY": 50
		});
		setTimeout(function () {
			fireEvent('vmousemove', {
				"pageX": 150,
				"pageY": 50
			});
			setTimeout(function () {
				fireEvent('vmouseup', {
					"pageX": 250,
					"pageY": 50
				});
			}, 1);
		}, 1);
	});

	function swipeLeftTest(event) {
		document.body.removeEventListener('swipeleft', swipeLeftTest, false);
		equal(event.type, 'swipeleft', 'swipeleft');
		start();
	}

	asyncTest('swipeleft', 1, function () {
		document.body.addEventListener('swipeleft', swipeLeftTest, false);
		fireEvent('vmousedown', {
			"pageX": 250,
			"pageY": 50
		});
		setTimeout(function () {
			fireEvent('vmousemove', {
				"pageX": 150,
				"pageY": 50
			});
			setTimeout(function () {
				fireEvent('vmouseup', {
					"pageX": 50,
					"pageY": 50
				});
			}, 1);
		}, 1);
	});

	function swipeRightTest(event) {
		document.body.removeEventListener('swiperight', swipeRightTest, false);
		equal(event.type, 'swiperight', 'swiperight');
		start();
	}

	asyncTest('swiperight', 1, function () {
		document.body.addEventListener('swiperight', swipeRightTest, false);
		fireEvent('vmousedown', {
			"pageX": 50,
			"pageY": 50
		});
		setTimeout(function () {
			fireEvent('vmousemove', {
				"pageX": 150,
				"pageY": 50
			});
			setTimeout(function () {
				fireEvent('vmouseup', {
					"pageX": 250,
					"pageY": 50
				});
			}, 1);
		}, 1);
	});
});