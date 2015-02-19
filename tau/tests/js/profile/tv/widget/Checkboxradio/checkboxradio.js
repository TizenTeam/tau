/*global window, setTimeout, ok, module, asyncTest, tau, document, ej, equal, test, start, CustomEvent */
/*jslint browser: true, nomen: true */
(function (tau) {
	"use strict";
	var page = document.getElementById("test_checkbox_page"),
		t = function () {
			var qunitModuleConfig = {
					teardown: function () {
						tau.engine._clearBindings();
					}
				},
				KEY_ENTER = tau.widget.tv.BaseKeyboardSupport.KEY_CODES.enter,
				widgetName = "Checkboxradio";

			function triggerKeyboardEvent(el, keyCode) {
				var event = new CustomEvent("keyup", {bubbles: true});
				event.keyCode = keyCode;
				return el.dispatchEvent(event);
			}

			function builtTest(checkbox, name) {
				var wrapper = checkbox.parentNode;
				ok(checkbox.getAttribute("data-tau-bound").indexOf(widgetName) > -1, name + " widget is created");
				ok(checkbox.getAttribute("data-tau-built").indexOf(widgetName) > -1, name + " widget is built");
				ok(checkbox.getAttribute("data-tau-name").indexOf(widgetName) > -1, name + " has correct widget name");
				equal(wrapper.nodeName, "DIV", name + " has div wrapper");
				ok(wrapper.classList.contains("ui-" + name), name + " wrapper has correct class");
			}

			/***********************************************/
			/************* CHECKBOX TESTS ******************/
			/***********************************************/
			module("profile/tv/widget/Checkboxradio - checkbox", qunitModuleConfig);

			test("built", function () {
				var checkbox = document.getElementById("checkbox-1");
				tau.engine.instanceWidget(checkbox, widgetName);
				builtTest(checkbox, "checkbox");
				equal(checkbox.getAttribute("aria-disabled"), "false", "checkbox is enabled");
			});

			test("built/disabled", function () {
				var checkbox = document.getElementById("checkbox-2");
				tau.engine.instanceWidget(checkbox, widgetName);
				builtTest(checkbox, "checkbox");
				ok(checkbox.disabled, "checkbox is disabled");
				ok(checkbox.classList.contains("ui-state-disabled"), "checkbox has ui-state-disabled class");
			});

			test("keyboard", function () {
				var checkbox = document.getElementById("checkbox-1");

				tau.engine.instanceWidget(checkbox, widgetName);

				ok(checkbox.checked === false, "Checkbox unselected");
				triggerKeyboardEvent(checkbox, KEY_ENTER);
				ok(checkbox.checked, "Checkbox selected");
			});

			test("destroy", function () {
				var checkbox = document.getElementById("checkbox-1");

				tau.engine.instanceWidget(checkbox, "Checkboxradio").destroy(checkbox);

				ok(checkbox.checked === false, "Checkbox unselected");
				triggerKeyboardEvent(checkbox, KEY_ENTER);
				ok(checkbox.checked === false, "Checkbox unselected because keypu event listener is removed");
			});

			/*****************************************************/
			/******************* RADIO TESTS *********************/
			/*****************************************************/
			module("profile/tv/widget/Checkboxradio - radio", qunitModuleConfig);

			test("built", function () {
				var radio1 = document.getElementById("radio1"),
					radio2 = document.getElementById("radio2");

				tau.engine.instanceWidget(radio1, widgetName);
				tau.engine.instanceWidget(radio2, widgetName);

				builtTest(radio1, "radio");
				builtTest(radio2, "radio");

				radio1.checked = true;
				ok(radio1.checked, "first radio selected");
				ok(radio2.checked === false, "second radio unselected");
				radio2.checked = true;
				ok(radio1.checked === false, "first radio unselected");
				ok(radio2.checked, "second radio selected");
			});

			test("built/disabled", function () {
				var radio = document.getElementById("radio3");
				tau.engine.instanceWidget(radio, widgetName);
				builtTest(radio, "radio");
				ok(radio.classList.contains("ui-state-disabled"), "radio has ui-state-disabled class");
				ok(radio.disabled, "radio is disabled");

			});

			test("keyboard", function () {
				var radio1 = document.getElementById("radio1"),
					radio2 = document.getElementById("radio2");

				tau.engine.instanceWidget(radio1, widgetName);
				tau.engine.instanceWidget(radio2, widgetName);

				//Click on radio 2 label should change input state.
				triggerKeyboardEvent(radio2, KEY_ENTER);
				ok(radio1.checked === false, "radio unselected");
				ok(radio2.checked, "radio selected");
			});

			test("focus/blur", 2, function () {
				var radio2 = document.getElementById("radio2");

				tau.engine.instanceWidget(radio2, "Checkboxradio");

				radio2.focus();
				ok(radio2.classList.contains("ui-focus"), "radio has ui-focus class");
				radio2.blur();
				ok(radio2.classList.contains("ui-focus") === false, "radio has no ui-focus class");
			});


			test("destroy", function () {
				var radio1 = document.getElementById("radio1"),
					radio2 = document.getElementById("radio2");

				tau.engine.instanceWidget(radio1, widgetName).destroy();
				tau.engine.instanceWidget(radio2, widgetName);

				triggerKeyboardEvent(radio1, KEY_ENTER);
				triggerKeyboardEvent(radio2, KEY_ENTER);
				ok(radio1.checked === false, "radio unselected because keyup listener is removed");
				ok(radio2.checked === true, "radio selected");
			});
			page.removeEventListener("pageshow", t);
		};
	page.addEventListener("pageshow", t);
	tau.engine.run();
}(window.tau));
