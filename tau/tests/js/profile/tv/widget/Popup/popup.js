(function () {
	document.getElementById("test").addEventListener("pageshow", function() {
		"use strict";

		var INSTANCE_WIDGET = "Popup",
		popup = null,
		wrapper = null,
		popupWidget = null,
		PopupClass = window.tau.widget.tv.Popup,
		page,
		engine = window.tau.engine;

		function triggerKeyboardEvent(el, keyCode) {
			var eventObj = document.createEvent("Events");

			if (eventObj.initEvent) {
				eventObj.initEvent("keydown", true, false);
			}

			eventObj.keyCode = keyCode;
			el.dispatchEvent(eventObj);
		}

		module("profile/tv/widget/Popup", {
			setup: function () {
				page = document.getElementById("test");
				engine.instanceWidget(page, "Page");
				engine.createWidgets(page);
				popup = document.getElementById("popupToast");
				popupWidget = engine.instanceWidget(popup, INSTANCE_WIDGET);
				engine.getRouter().getRoute("popup").activePopup = null;

			},
			teardown: function () {
				engine._clearBindings();
			}
		});

		function showPage() {
			page.style.display = "block";
			page.parentNode.style.top = "0";
			page.parentNode.style.left = "0";
		}

		function hidePage() {
			page.style.display = "none";
			page.parentNode.style.top = "-10000px";
			page.parentNode.style.left = "-10000px";
		}

		function testContextPopup(ctxPopupWidget, popupArrowClass) {
			var ctxPopup = ctxPopupWidget.element;

			showPage();
			window.tau.event.one(ctxPopup, PopupClass.events.hide, function() {
				ok(!ctxPopupWidget._isOpened(), "Popup is not open");
				hidePage();
				start();
			});

			window.tau.event.one(ctxPopup, PopupClass.events.show, function() {
				ok(true, "Popup is opened");
				ok(ctxPopup.classList.contains(popupArrowClass), "Popup has " + popupArrowClass + " class");
				ok(ctxPopup.classList.contains("ui-ctxpopup"), "Popup has ui-ctxpopup class");
				ctxPopupWidget.close();
			});
		}

		test("Toast popup ", function () {
			//after build
			equal(popup.getAttribute("data-tau-bound"), "Popup", "Popup widget is created");
			equal(popup.getAttribute("data-tau-built"), "Popup", "Popup widget is built");
			equal(popup.getAttribute("data-tau-name"), "Popup", "Widget name is correct");
			ok(popup.classList.contains("ui-popup-toast"), "Popup has ui-popup-toast class");
			ok(popup.classList.contains("ui-popup"), "Popup has ui-popup class");
			ok(popup.classList.contains("ui-header-empty"), "Popup has ui-header-empty class");
			ok(popup.classList.contains("ui-footer-empty"), "Popup has ui-footer-empty class");

			//check if popup has wrapper
			equal(popup.querySelectorAll(".ui-popup-wrapper").length, 1, "Popup has wrapper element");
			wrapper = popup.querySelectorAll(".ui-popup-wrapper")[0];
			ok(wrapper.classList.contains("ui-popup-toast"), "Popup wrapper has ui-popup class");
		});

		if (!window.navigator.userAgent.match("PhantomJS")) {
			asyncTest("Context popup data-arrow='t'", 4, function () {
				var ctxPopup = document.getElementById("ctxPopup"),
					ctxPopupWidget = engine.instanceWidget(ctxPopup, INSTANCE_WIDGET),
					openButton = document.getElementById("popupLink"),
					linkPosition;

				testContextPopup(ctxPopupWidget, "ui-popup-arrow-t");

				linkPosition = openButton.getBoundingClientRect();
				ctxPopupWidget.open({
					arrow: "t",
					positionTo: "origin",
					x: linkPosition.left + 1,
					y: linkPosition.top + linkPosition.height / 2
				});
			});

			asyncTest("Context popup data-arrow='b'", 4, function () {
				var ctxPopup = document.getElementById("ctxPopup"),
					ctxPopupWidget = engine.instanceWidget(ctxPopup, INSTANCE_WIDGET),
					openButton = document.getElementById("popupLink"),
					linkPosition;

				testContextPopup(ctxPopupWidget, "ui-popup-arrow-b");

				linkPosition = openButton.getBoundingClientRect();
				ctxPopupWidget.open({
					arrow: "b",
					positionTo: "origin",
					x: linkPosition.left + 1,
					y: linkPosition.top + linkPosition.height / 2
				});
			});

			asyncTest("Toast popup close by click", 1, function () {

				window.tau.event.one(popup, PopupClass.events.hide, function() {
					ok(!popupWidget._isOpened(), "Popup is not open");
					start();
				});

				window.tau.event.one(popup, PopupClass.events.show, function() {
					triggerKeyboardEvent(popup, 13);
				});

				popupWidget.open();
			});

			asyncTest("Context popup data-arrow='l'", 4, function () {
				var ctxPopup = document.getElementById("ctxPopup"),
					ctxPopupWidget = engine.instanceWidget(ctxPopup, INSTANCE_WIDGET),
					openButton = document.getElementById("popupLink"),
					linkPosition;

				testContextPopup(ctxPopupWidget, "ui-popup-arrow-l");

				linkPosition = openButton.getBoundingClientRect();
				ctxPopupWidget.open({
					arrow: "l",
					positionTo: "origin",
					x: linkPosition.left + 1,
					y: linkPosition.top + linkPosition.height / 2
				});
			});

			asyncTest("Context popup data-arrow='r'", 4, function () {
				var ctxPopup = document.getElementById("ctxPopup"),
					ctxPopupWidget = engine.instanceWidget(ctxPopup, INSTANCE_WIDGET),
					openButton = document.getElementById("popupLink"),
					linkPosition;

				testContextPopup(ctxPopupWidget, "ui-popup-arrow-r");

				linkPosition = openButton.getBoundingClientRect();
				ctxPopupWidget.open({
					arrow: "r",
					positionTo: "origin",
					x: linkPosition.left + 1,
					y: linkPosition.top + linkPosition.height / 2
				});
			});
		}
	});
}());
