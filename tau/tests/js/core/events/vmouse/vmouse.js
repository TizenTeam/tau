QUnit.config.testTimeout = 5000;
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
	}
	try {
		return el.dispatchEvent(evt);
	} catch (err) {
		console.log(err);
	}
	return false;
};
var el = document.getElementById("mock1"),
	body = document.body;

document.addEventListener('bound', function () {
	// something is wrong when using many asyncTests and UI events
	// @TODO add tests for mous events
	var tests = [

		function () {
			var listener = function (evt) {
					body.removeEventListener("vclick", listener, false);
					ok(evt, "vclick event exists when touchstart and touchend");
					equal(evt.type, "vclick", "event has proper type");
					tests[i++]();
				};
			window.ontouchstart = true;
			body.addEventListener("vclick", listener, false);
			ok(fireEvent(el, "touchstart", {
				"clientX": 50,
				"clientY": 50
			}, [{pageX: 0, pageY:0}]), "touchstart fired");
			ok(fireEvent(el, "touchend", {
				"clientX": 50,
				"clientY": 50
			}, [{pageX: 0, pageY:0}]), "touchstart fired");
		},
		function () {
			var listener = function (evt) {
					body.removeEventListener("vclick", listener, false);
					ok(evt, "vclick event exists when enter press");
					equal(evt.type, "vclick", "event has proper type");
					tests[i++]();
				};
			window.ontouchstart = true;
			body.addEventListener("vclick", listener, false);
			ok(fireEvent(el, "keyup", {
				"keyCode": 13
			}, [{pageX: 0, pageY:0}]), "keyup fired");
		},
		function () {
			var listener = function (evt) {
					body.removeEventListener("vmousedown", listener, false);
					ok(evt, "vmousedown event exists when enter press");
					equal(evt.type, "vmousedown", "event has proper type");
					tests[i++]();
				};
			window.ontouchstart = true;
			body.addEventListener("vmousedown", listener, false);
			ok(fireEvent(el, "keydown", {
				"keyCode": 13
			}, [{pageX: 0, pageY:0}]), "keydown fired");
		},
		function () {
			var listener = function (evt) {
				body.removeEventListener("vmousemove", listener, false);
				ok(evt, "vmousemove event exists");
				equal(evt.type, "vmousemove", "event has proper type");
				tests[i++]();
			};
			body.addEventListener("vmousemove", listener, false);
			ok(fireEvent(el, "touchmove", {
				"clientX": 50,
				"clientY": 50
			}, [{pageX: 0, pageY:0}]), "touchmove fired");
		},
		function () {
			var listener = function (evt) {
				body.removeEventListener("vmouseout", listener, false);
				ok(evt, "vmouseout event exists");
				equal(evt.type, "vmouseout", "event has proper type");
				tests[i++]();
			};
			body.addEventListener("vmouseout", listener, false);
			ok(fireEvent(el, "touchleave", {
				"clientX": 50,
				"clientY": 50
			}, [{pageX: 0, pageY:0}]), "touchleave fired");
		},
		function () {
			var listener = function (evt) {
				body.removeEventListener("vmousedown", listener, false);
				ok(evt, "vmousedown event exists");
				equal(evt.type, "vmousedown", "event has proper type");
				tests[i++]();
			};
			body.addEventListener("vmousedown", listener, false);
			ok(fireEvent(el, "mousedown", {
				"clientX": 50,
				"clientY": 50
			}, [{pageX: 0, pageY:0}]), "mousedown fired");
		},
		function () {
			var listener = function (evt) {
				body.removeEventListener("vmouseup", listener, false);
				ok(evt, "vmouseup event exists");
				equal(evt.type, "vmouseup", "event has proper type");
				tests[i++]();
			};
			body.addEventListener("vmouseup", listener, false);
			ok(fireEvent(el, "mouseup", {
				"clientX": 50,
				"clientY": 50
			}, [{pageX: 0, pageY:0}]), "mouseup fired");
		},
		function () {
			var listener = function (evt) {
				body.removeEventListener("vmousecancel", listener, false);
				ok(evt, "vmousecancel event exists");
				equal(evt.type, "vmousecancel", "event has proper type");
				tests[i++]();
			};
			body.addEventListener("vmousecancel", listener, false);
			ok(fireEvent(el, "touchcancel", {
				"clientX": 500,
				"clientY": 500
			}, [{pageX: 0, pageY:0}]), "touchcancel fired");
		},

		/** For some reason, jquery trigger does not work well
		* in phantomjs
		*/
		function () {
			$(body).one("vclick", function (evt) {
				ok(evt, "event exists through jquery");
				equal(evt.type, "vclick", "proper type through jquery");
			});
			$(el).trigger("vclick");
		}	],
	i = 0;

	test("vmouse", function () {
		tests[i++]();
	});
});
window.ontouchstart = true;