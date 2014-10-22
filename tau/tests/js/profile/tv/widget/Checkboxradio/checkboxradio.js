(function (tau) {
	var page = document.getElementById("test_checkbox_page");
	page.addEventListener("pageshow", function() {
		"use strict";

		var engine = ej.engine;

		module("widget.tv.Checkboxradio TV Checkboxradio widget", {
			setup: function () {
				engine.createWidgets(document);
			},
			teardown: function () {
				engine._clearBindings();
			}
		});

		function triggerKeyboardEvent(el, keyCode) {
			var eventObj = document.createEvent("Events");

			if (eventObj.initEvent) {
				eventObj.initEvent("keyup", false, true);
			}

			eventObj.keyCode = keyCode;
			el.dispatchEvent(eventObj);
		}

		test("Checkbox", function () {
			var checkbox = document.getElementById("checkbox-1"),
				wrapper = checkbox.parentNode;

			//after build
			equal(checkbox.getAttribute("data-tau-bound"), "Checkboxradio", "Checkbox widget is created");
			equal(checkbox.getAttribute("data-tau-built"), "Checkboxradio", "Checkbox widget is built");
			equal(checkbox.getAttribute("aria-disabled"), "false", "Checkbox is enabled");
			equal(checkbox.getAttribute("data-tau-name"), "Checkboxradio", "Checkbox has correct widget name");
			equal(wrapper.nodeName, "SPAN", "Checkbox has span wrapper");
		});

		test("Disabled Checkbox", function () {
			var checkbox = document.getElementById("checkbox-2");

			equal(checkbox.getAttribute("data-tau-bound"), "Checkboxradio", "Checkbox widget is created");
			ok(checkbox.classList.contains("tv-checkboxradio-disabled"), "Checkbox has tv-checkboxradio-disabled class");
			ok(checkbox.classList.contains("ui-state-disabled"), "Checkbox has ui-state-disabled class");
		});

		asyncTest("Checkbox keyup events", 2, function () {
			var checkbox = document.getElementById("checkbox-1");

			window.tau.engine.instanceWidget(checkbox, "Checkboxradio");
			ok(checkbox.checked === false, "Checkbox unselected");
			triggerKeyboardEvent(checkbox, 13);
			setTimeout(function() {
				ok(checkbox.checked, "Checkbox selected");
				start();
			}, 100);
		});

		asyncTest("Checkbox destroy", 2, function () {
			var checkbox = document.getElementById("checkbox-1"),
			instance = window.tau.engine.instanceWidget(radio1, "Checkboxradio");

			instance._destroy(checkbox);

			ok(checkbox.checked === false, "Checkbox unselected");
			triggerKeyboardEvent(checkbox, 13);
			setTimeout(function() {
				ok(checkbox.checked === false, "Checkbox unselected because keypu event listener is removed");
				start();
			}, 100);
		});

		test("Radio" , function () {
			var radio1 = document.getElementById("radio1"),
				radio2 = document.getElementById("radio2"),
				wrapper1 = radio1.parentNode,
				wrapper2 = radio2.parentNode;

			//after build
			equal(radio1.getAttribute("data-tau-bound"), "Checkboxradio", "Radio button widget is created");
			equal(radio1.getAttribute("data-tau-built"), "Checkboxradio", "Checkbox widget is built");
			equal(radio1.getAttribute("aria-disabled"), "false", "Checkbox is enabled");
			equal(radio1.getAttribute("data-tau-name"), "Checkboxradio", "Checkbox has correct widget name");
			equal(wrapper1.nodeName, "SPAN", "Checkbox has span wrapper");
			equal(radio2.getAttribute("data-tau-bound"), "Checkboxradio", "Radio button widget is created");
			equal(radio2.getAttribute("data-tau-built"), "Checkboxradio", "Checkbox widget is built");
			equal(radio2.getAttribute("aria-disabled"), "false", "Checkbox is enabled");
			equal(radio2.getAttribute("data-tau-name"), "Checkboxradio", "Checkbox has correct widget name");
			equal(wrapper2.nodeName, "SPAN", "Checkbox has span wrapper");

			radio1.checked = true;
			ok(radio1.checked, "First radio selected");
			ok(radio2.checked === false, "Second radio unselected");
			radio2.checked = true;
			ok(radio1.checked === false, "First radio unselected");
			ok(radio2.checked, "Second radio selected");
		});

		test("Disabled Radio" , function () {
			var radio = document.getElementById("radio3");

			//after build
			equal(radio1.getAttribute("data-tau-bound"), "Checkboxradio", "Radio button widget is created");
			ok(radio.classList.contains("tv-checkboxradio-disabled"), "Checkbox has tv-checkboxradio-disabled class");
			ok(radio.classList.contains("ui-state-disabled"), "Checkbox has ui-state-disabled class");

		});

		asyncTest("Radio keyup events", 2, function () {
			var radio1 = document.getElementById("radio1"),
				radio2 = document.getElementById("radio2"),
				wrapper2 = radio2.parentNode;

			//Click on radio 2 label should change input state.
			triggerKeyboardEvent(wrapper2, 13);

			setTimeout(function() {
				ok(radio1.checked === false, "Checkbox unselected");
				ok(radio2.checked, "Checkbox selected");
				start();
			}, 100);
		});


		test("Radio focus blur events", 2, function () {
			var radio2 = document.getElementById("radio2"),
				wrapper2 = radio2.parentNode;

			wrapper2.focus();
			ok(radio2.classList.contains("focus"), "Checkbox has focus class");
			wrapper2.blur();
			ok(radio2.classList.contains("focus") === false, "Checkbox has no focus class");
		});


		asyncTest("Radio destroy", 2, function () {
			var radio1 = document.getElementById("radio1"),
				radio2 = document.getElementById("radio2"),
				wrapper1 = radio1.parentNode,
				wrapper2 = radio2.parentNode,
				instance = window.tau.engine.instanceWidget(radio1, "Checkboxradio");

			instance._destroy(radio1);
			triggerKeyboardEvent(wrapper1, 13);
			triggerKeyboardEvent(wrapper2, 13);

			setTimeout(function() {
				ok(radio1.checked === false, "Checkbox unselected because keyup listener is removed");
				ok(radio2.checked === true, "Checkbox selected");
				start();
			}, 100);
		});
	});
}(window.tau));
