/*global test, module, asyncTest, ok, equal, strictEqual, start, console*/
(function () {
	"use strict";

	document.getElementById("test").addEventListener("pageshow", function() {
		var INSTANCE_WIDGET = "Popup",
			toastPopup = null,
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
				toastPopup = document.getElementById("popupToast");
				popupWidget = engine.instanceWidget(toastPopup, INSTANCE_WIDGET);
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

		test("Toast popup", 9, function () {
			//after build
			equal(toastPopup.getAttribute("data-tau-bound"), "Popup", "Popup widget is created");
			equal(toastPopup.getAttribute("data-tau-built"), "Popup", "Popup widget is built");
			equal(toastPopup.getAttribute("data-tau-name"), "Popup", "Widget name is correct");
			ok(toastPopup.classList.contains("ui-popup-toast"), "Popup has ui-popup-toast class");
			ok(toastPopup.classList.contains("ui-popup"), "Popup has ui-popup class");
			ok(toastPopup.classList.contains("ui-header-empty"), "Popup has ui-header-empty class");
			ok(toastPopup.classList.contains("ui-footer-empty"), "Popup has ui-footer-empty class");

			//check if popup has wrapper
			equal(toastPopup.querySelectorAll(".ui-popup-wrapper").length, 1, "Popup has wrapper element");
			wrapper = toastPopup.querySelectorAll(".ui-popup-wrapper")[0];
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

				window.tau.event.one(toastPopup, PopupClass.events.hide, function() {
					ok(!popupWidget._isOpened(), "Popup is not open");
					start();
				});

				window.tau.event.one(toastPopup, PopupClass.events.show, function() {
					triggerKeyboardEvent(toastPopup, 13);
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
		} else {
			console.warn("\n[warn] Skipping 5 tests in PhantomJS environment");
		}

		function hexToRgb(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		}

		asyncTest("Custom popup - main color affects border-top if no header", 5, function () {
			var customPopup = document.getElementById("customPopup0"),
				popupInstance = engine.getBinding(customPopup, INSTANCE_WIDGET),
				popupHeader,
				headerIcon,
				attributeColor;

			strictEqual(customPopup.getAttribute("data-tau-built"), "Popup", "Popup widget has been built");
			strictEqual(customPopup.getAttribute("data-tau-bound"), "Popup", "Popup widget has been bound");

			popupHeader = customPopup.querySelector("header");

			ok(!popupHeader, "Header doesn't exists");

			attributeColor = hexToRgb(customPopup.getAttribute("data-main-color"));

			popupInstance.open();

			// Do a series of close/open operations and check the props again
			window.tau.event.one(customPopup, PopupClass.events.show, function() {

				strictEqual(window.getComputedStyle(customPopup).getPropertyValue("border-top-color"), "rgb(" + attributeColor.r + ", "+ attributeColor.g + ", " + attributeColor.b + ")", "Color for top-border is set after first open");
				popupInstance.close();

				window.tau.event.one(customPopup, PopupClass.events.hide, function() {
					popupInstance.open();

					window.tau.event.one(customPopup, PopupClass.events.show, function() {
						strictEqual(window.getComputedStyle(customPopup).getPropertyValue("border-top-color"), "rgb(" + attributeColor.r + ", "+ attributeColor.g + ", " + attributeColor.b + ")", "Color for top-border is set property after series of close / open");

						start();
					});
				});
			});
		});

		asyncTest("Custom popup - custom icon and header color set with data-* tags", 11, function () {
			var customPopup = document.getElementById("customPopup1"),
				popupInstance = engine.getBinding(customPopup, INSTANCE_WIDGET),
				popupHeader,
				headerIcon,
				attributeColor;

			strictEqual(customPopup.getAttribute("data-tau-built"), "Popup", "Popup widget has been built");
			strictEqual(customPopup.getAttribute("data-tau-bound"), "Popup", "Popup widget has been bound");

			popupHeader = customPopup.querySelector("header");
			headerIcon = popupHeader.firstElementChild;

			ok(!!popupHeader, "Header exists");

			attributeColor = hexToRgb(customPopup.getAttribute("data-main-color"));

			strictEqual(headerIcon.tagName, "IMG", "First element is `img`");
			strictEqual(headerIcon.className, "ui-popup-header-icon", "Header icon has `ui-popup-header-icon` class");
			strictEqual(headerIcon.getAttribute("src"), customPopup.getAttribute("data-header-icon"), "Icon src is equal to `data-header-icon` attribute");

			popupInstance.open();

			// Do a series of close/open operations and check the props again
			window.tau.event.one(customPopup, PopupClass.events.show, function() {
				strictEqual(window.getComputedStyle(popupHeader).getPropertyValue("background-color"), "rgb(" + attributeColor.r + ", "+ attributeColor.g + ", " + attributeColor.b + ")", "Header color is equal to data attribute");

				popupInstance.close();

				window.tau.event.one(customPopup, PopupClass.events.hide, function() {
					popupInstance.open();

					window.tau.event.one(customPopup, PopupClass.events.show, function() {
						strictEqual(headerIcon.tagName, "IMG", "First element is `img`");
						strictEqual(headerIcon.className, "ui-popup-header-icon", "Header icon has `ui-popup-header-icon` class (after series of open / close)");
						strictEqual(headerIcon.getAttribute("src"), customPopup.getAttribute("data-header-icon"), "Icon src is equal to `data-header-icon` attribute (after series of open / close)");

						strictEqual(window.getComputedStyle(popupHeader).getPropertyValue("background-color"), "rgb(" + attributeColor.r + ", "+ attributeColor.g + ", " + attributeColor.b + ")", "Header color is equal to data attribute (after series of open / close)");

						start();
					});
				});
			});
		});

		asyncTest("Custom popup - refresh method refreshes settings", 4, function () {
			var customPopup = document.getElementById("customPopup2"),
				popupInstance = engine.getBinding(customPopup, INSTANCE_WIDGET),
				popupHeader = customPopup.querySelector("header"),
				headerIcon = popupHeader.firstElementChild,
				attributeColor = hexToRgb(customPopup.getAttribute("data-main-color"));

			popupInstance.open();

			// Do a series of close/open operations and check the props again
			window.tau.event.one(customPopup, PopupClass.events.show, function() {
				strictEqual(headerIcon.getAttribute("src"), customPopup.getAttribute("data-header-icon"), "Icon src before change is equal to `data-header-icon` attribute");
				strictEqual(window.getComputedStyle(popupHeader).getPropertyValue("background-color"), "rgb(" + attributeColor.r + ", " + attributeColor.g + ", " + attributeColor.b + ")", "Colors before change are equal");

				popupInstance.options.headerIcon = "./images/different_image.png";
				popupInstance.options.mainColor = "#ff0001"; // === {r: 255, g: 0, b: 1}

				popupInstance.refresh();

				attributeColor = {r: 255, g: 0, b: 1};

				strictEqual(headerIcon.getAttribute("src"), "./images/different_image.png", "Icon src after change is equal to `data-header-icon` attribute");
				strictEqual(window.getComputedStyle(popupHeader).getPropertyValue("background-color"), "rgb(" + attributeColor.r + ", " + attributeColor.g + ", " + attributeColor.b + ")", "Colors after change are equal");

				start();
			});
		});
	});
}());
