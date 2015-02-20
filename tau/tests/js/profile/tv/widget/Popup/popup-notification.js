/*global test, module, asyncTest, ok, equal, strictEqual, start, console, CustomEvent */
/*jslint browser: true, nomen: true */
(function (tau) {
	"use strict";

	document.getElementById("test").addEventListener("pageshow", function () {
		var PopupClass = window.tau.widget.tv.Popup,
			page,
			engine = tau.engine;

		function triggerKeyboardEvent(el, keyCode) {
			var event = new CustomEvent("keydown");
			event.keyCode = keyCode;
			el.dispatchEvent(event);
		}

		module("profile/tv/widget/Popup - notifications", {
			setup: function () {
				page = document.getElementById("test");
				engine.instanceWidget(page, "Page");
				engine.createWidgets(page);
				engine.getRouter().getRoute("popup").activePopup = null;
			},
			teardown: function () {
				engine._clearBindings();
			}
		});

		test("Notification popup is built", 4, function () {
			var popup = document.getElementById("notificationPopup"),
				referencePopup = document.getElementById("referencePopup");

			strictEqual(referencePopup.getAttribute("data-tau-built"), "Popup", "Reference popup has been created");
			strictEqual(popup.getAttribute("data-tau-built"), "Popup", "Popup has been created");

			ok(popup.classList.contains("ui-popup-notification"), "Popup has `ui-popup-notification` class");
			ok(!referencePopup.classList.contains("ui-popup-notification"), "Reference popup has no `ui-popup-notification` class");
		});

		test("Action popup are recognized", 6, function () {
			var inputPopup = document.getElementById("inputActionNotificationPopup"),
				buttonPopup = document.getElementById("buttonActionNotificationPopup"),
				referencePopup = document.getElementById("referencePopup");

			strictEqual(referencePopup.getAttribute("data-tau-built"), "Popup", "Reference popup has been created");
			strictEqual(inputPopup.getAttribute("data-tau-built"), "Popup", "Popup with `input` has been created");
			strictEqual(buttonPopup.getAttribute("data-tau-built"), "Popup", "Popup with footer buttons has been created");

			ok(!referencePopup.classList.contains("ui-popup-action"), "Reference popup has no ui-popup-action");
			ok(tau.engine.getBinding(buttonPopup).options.timeout !== null, "Popup with input has `ui-popup-action` class");
			ok(tau.engine.getBinding(inputPopup).options.timeout !== null, "Popup with footer buttons has `ui-popup-action` class");
		});

		function timeoutCheck(elementId, timeoutLimit) {
			var popup = document.getElementById(elementId),
				instance = engine.getBinding(popup, "Popup"),
				timerStart;

			tau.event.one(popup, PopupClass.events.show, function () {
				ok(true, "Popup has been opened");
				timerStart = Date.now();
			});

			tau.event.one(popup, PopupClass.events.hide, function () {
				var delta = Date.now() - timerStart;
				ok(delta >= timeoutLimit, "Popup closed after >= " + timeoutLimit + "ms (" + delta + "ms precisely)");
				// This test should prevent cases when popup closes after much more time than expected
				ok(delta - timeoutLimit <= 100, "Popup closed no more than 100ms after timeout");

				start();
			});

			instance.open();
		}

		asyncTest("Normal popup closes after default time", 3, function (){
			timeoutCheck("notificationPopupCustomDelay", 500);
		});

		asyncTest("Toast popup closes after default time", 3, function (){
			timeoutCheck("notificationPopupToastCustomDelay", 300);
		});

		asyncTest("Action popup closes after default time", 3, function (){
			timeoutCheck("actionNotificationPopupCustomDelay", 700);
		});
	});
}(window.tau));
