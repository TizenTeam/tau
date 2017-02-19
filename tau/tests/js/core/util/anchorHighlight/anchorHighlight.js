/*global document, CustomEvent, asyncTest, ok, start, QUnit, equal, tau*/
QUnit.config.testTimeout = 5000;

module("core/util/anchorHighlight");

document.addEventListener("DOMContentLoaded", function () {
	function fireEvent(el, type, props, touches) {
		var evt = new CustomEvent(type, {
				"bubbles": true,
				"cancelable": true
			}),
			prop;

		for (prop in props) {
			if (props.hasOwnProperty(prop)) {
				evt[prop] = props[prop];
			}
		}
		if (touches) {
			evt.touches = touches;
		}
		try {
			return el.dispatchEvent(evt);
		} catch (err) {
			tau.log(err);
		}
		return false;
	}

	function hasClassName(node, classname) {
		return node.classList.contains(classname);
	}

	function checkClassTimerAnchor() {
		var element = document.getElementById("innerAnchor"),
			testClass = hasClassName(element.parentNode.parentNode, "ui-li-active");

		document.removeEventListener("anchorhighlightactiveli", checkClassTimerAnchor, true);
		ok(testClass, "add class and find anchor element");
		start();
	}
	function checkClassAnchor() {
		document.addEventListener("anchorhighlightactiveli", checkClassTimerAnchor, true);

		document.removeEventListener("touchstart", checkClassAnchor, false);
		ok(true, "event fired");
	}

	asyncTest("class added, element inside anchor", function () {
		var element = document.getElementById("innerAnchor");

		document.addEventListener("touchstart", checkClassAnchor, false);
		fireEvent(element, "touchstart", {
			"clientX": 50,
			"clientY": 50
		}, [{pageX: 0, pageY: 0, clientX: 0, clientY: 0}]);
	});

	function checkClassTimer(target) {
		var testClass = hasClassName(target.parentNode, "ui-li-active");

		ok(testClass, "class added");
		start();
	}
	function checkClass(event) {
		var target = event.target;

		document.removeEventListener("touchstart", checkClass, false);
		ok(true, "event fired");
		setTimeout(checkClassTimer.bind(null, target), 100);
	}

	asyncTest("class added, standard anchor", function () {
		var element = document.getElementById("link1");

		document.addEventListener("touchstart", checkClass, false);
		fireEvent(element, "touchstart", {
			"clientX": 50,
			"clientY": 50
		}, [{pageX: 0, pageY: 0, clientX: 0, clientY: 0}]);
	});


	function checkRemoveClassTimer() {
		start();
	}
	function checkRemoveClass(event) {
		var target = event.target;

		document.removeEventListener("touchstart", checkRemoveClass, false);
		ok(true, "event fired");
		setTimeout(checkRemoveClassTimer.bind(null, target), 100);
	}
	asyncTest("touch move class removed", function () {
		var element = document.getElementById("link1");

		document.addEventListener("touchstart", checkRemoveClass, false);
		fireEvent(element, "touchstart", {
			"clientX": 50,
			"clientY": 50
		}, [{pageX: 0, pageY: 0, clientX: 0, clientY: 0}]);

		setTimeout(function () {
			fireEvent(element, "touchmove", {
				"clientX": 150,
				"clientY": 150
			}, [{pageX: 100, pageY: 100, clientX: 100, clientY: 100}]);
		}, 100);
		equal(hasClassName(element.parentNode, "ui-li-active"), false, "class removed");
	});


	function checkRemoveClassEndTimer() {
		start();
	}
	function checkRemoveClassEnd(event) {
		var target = event.target;

		document.removeEventListener("touchstart", checkRemoveClassEnd, false);
		ok(true, "event fired");
		setTimeout(checkRemoveClassEndTimer.bind(null, target), 100);
	}
	asyncTest("touch end class removed", function () {
		var element = document.getElementById("link1");

		document.addEventListener("touchstart", checkRemoveClassEnd, false);
		fireEvent(element, "touchstart", {
			"clientX": 50,
			"clientY": 50
		}, [{pageX: 0, pageY: 0, clientX: 0, clientY: 0}]);

		setTimeout(function () {
			fireEvent(element, "touchend", {
				"clientX": 150,
				"clientY": 150
			}, [{pageX: 100, pageY: 100, clientX: 100, clientY: 100}]);
		}, 100);
		equal(hasClassName(element.parentNode, "ui-li-active"), false, "class removed");
	});
});

