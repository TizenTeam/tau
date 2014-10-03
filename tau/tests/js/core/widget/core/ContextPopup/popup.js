/*global window, console, test, equal, module, ej, asyncTest, start, HTMLElement, HTMLDivElement */
/*jslint nomen: true */
(function (window, document) {
	"use strict";

	var INSTANCE_WIDGET = "Popup",
		page = null,
		page2 = null,
		popup1Link = null,
		popup1 = null,
		popup1Widget = null,
		popup2Link = null,
		popup2 = null,
		popup2Widget = null,
		PopupClass = ej.widget.core.Popup,
		engine = ej.engine;

	module("Popup tests", {
		setup: function () {
			popup1Link = document.getElementById("popup1Link");
			popup1 = document.getElementById("popup1");
			page = document.getElementById("test");
			popup2Link = document.getElementById("popup2Link");
			popup2 = document.getElementById("popup2");
			page2 = document.getElementById("test2");

			// @TODO! there is problem with closing popup between tests!
			engine.getRouter().getRoute("popup").activePopup = null;
			engine.run();

		},
		teardown: function () {
			engine._clearBindings();
		}
	});

	function testPopupMarkup(popup, element) {
		var opts = popup.options,
			ui = popup._ui,
			header = ui.header,
			footer = ui.footer,
			content = ui.content;

		equal(popup instanceof PopupClass, true, "Popup is instance of ns.widget.wearable.Popup");
		equal(popup.element, element, "Popup element is the same as starting markup element");

		if (opts.header !== false) {
			equal(header instanceof HTMLDivElement, true, "header is a HTMLDivElement");
			equal(header.classList.contains(PopupClass.classes.header), true, "header contains proper class");
			if (typeof opts.header !== "boolean") {
				equal(opts.header, header.innerHTML, "header has content properly set");
			}
		}

		if (opts.footer !== false) {
			equal(footer instanceof HTMLDivElement, true, "footer is a HTMLDivElement");
			equal(footer.classList.contains(PopupClass.classes.footer), true, "footer contains proper class");
			if (typeof opts.footer !== "boolean") {
				equal(opts.footer, footer.innerHTML, "footer has content properly set");
			}
		}

		equal(content instanceof HTMLDivElement, true, "content is a HTMLDivElement");
		equal(content.classList.contains(PopupClass.classes.content), true, "content contains proper class");
	}

	function popupshow () {
		popup1.removeEventListener("popupshow", popupshow);
		popup1Widget = engine.getBinding(popup1);
		testPopupMarkup(popup1Widget, popup1);

		popup1Widget.close();
		start();
	}

	function showPage(page) {
		page.style.display = "block";
		page.parentNode.style.top = "0";
		page.parentNode.style.left = "0";
	}

	function hidePage(page) {
		page.style.display = "none";
		page.parentNode.style.top = "-10000px";
		page.parentNode.style.left = "-10000px";
	}

	asyncTest("basic widget creation", 5, function () {
		tau.event.one(page, "pageshow", function() {
			popup1.addEventListener("popupshow", popupshow);
			popup1Widget = engine.getBinding(popup1);
			equal(popup1Widget, null, "widget not created before user click");
			popup1Link.click();
		});
		engine.run();
	});

	test("destroy", function () {
		expect(4);
		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
		equal(popup1.children.length, 2, "Popuphas 2 children");
		equal(popup1.firstChild.className, "ui-popup-wrapper", "Popup has wrapper before destroy");
		popup1Widget.destroy();
		equal(popup1.children.length, 1, "Popup has one children");
		ok(popup1.firstChild.className !== "ui-popup-wrapper", "Popup does not have wrapper");
	});

	asyncTest("position of arrow", 3, function () {
		var arrow,
			linkPosition,
			popupClasses;

		showPage(page2);

		tau.event.one(popup2, "popupshow", function() {
			popupClasses = popup2.classList;
			ok(true, "Popup is opened");
			ok(popupClasses.contains("ui-popup-arrow-t"), "Popup has proper arrow class.");
			arrow = popup2Widget._ui.arrow;
			ok(parseInt(arrow.style.left, 10) >= 30, "Left property of arrow has value bigger than popup's padding.");
			hidePage(page2);
			start();
		});
		popup2Widget = engine.instanceWidget(popup2, INSTANCE_WIDGET);

		linkPosition = popup2Link.getBoundingClientRect();
		popup2Widget.open({
			arrow: "t",
			positionTo: "origin",
			x: linkPosition.left + 1,
			y: linkPosition.top + linkPosition.height / 2
		});
	});

	asyncTest("method reposition", 5, function() {
		var beforeposition = 0,
			callback = function() {
				beforeposition++;
				ok(true, beforeposition + ". beforeposition");
				if (beforeposition === 1) {
					ok(true, "Event beforeposition was called during opening");
				} else {
					ok(true, "Event beforeposition was called on reposition");
					popup1Widget.close();
					popup1.removeEventListener("beforeposition", callback);
					start();
				}
			};
		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
		popup1.addEventListener("beforeposition", callback);
		tau.event.one(popup1, "popupshow", function() {
			ok(true, "Popup is opened");
			popup1Widget.reposition();
		});
		popup1Widget.open();
	});

	asyncTest("positionTo as a object", 1, function() {
		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
		showPage(page);
		tau.event.one(popup1, "popupshow", function() {
			ok(true, "Popup is opened");
			popup1Widget.close();
			start();
		});
		popup1Widget.open({
			positionTo: document.getElementById("popup1Link")
		});
		hidePage(page);
	});

	asyncTest("open popup with options for position (ID)", 2, function () {
		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
		showPage(page);

		tau.event.one(popup1, "popupshow", function() {
			hidePage(page);
			ok(true, "Popup was shown");
			ok(popup1.classList.contains("ui-popup-arrow-b"), "Popup was opened in context style");
			popup1Widget.close();
			start();
		});
		popup1Widget.open({
			arrow: "b",
			positionTo: "#popup1Link",
		});
	});

	asyncTest("open popup with options for position (X, Y)", 3, function () {
		var linkPosition;

		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
		showPage(page);
		linkPosition = popup1Link.getBoundingClientRect();

		tau.event.one(popup1, "popupshow", function() {
			ok(true, "Popup was shown");
			ok(popup1.classList.contains("ui-popup-arrow-t"), "Popup was opened in context style");
			ok(popup1Widget._ui.arrow.style.left !== "", "Position of arrow is set");
			popup1Widget.close();
			start();
		});
		popup1Widget.open({
			arrow: "t",
			positionTo: "origin",
			x: linkPosition.left + linkPosition.width / 2,
			y: linkPosition.top + linkPosition.height / 2
		});
		hidePage(page);
	});

	asyncTest("classes after closing popup", 4, function () {
		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
		showPage(page);

		tau.event.one(popup1, "popuphide", function() {
			hidePage(page);
			ok(true, "Popup was closed");
			ok(!popup1.classList.contains("ui-popup-arrow-r"), "Popup does not have class ui-popup-arrow-");
			start();
		});

		tau.event.one(popup1, "popupshow", function() {
			hidePage(page);
			ok(true, "Popup was shown");
			ok(popup1.classList.contains("ui-popup-arrow-r"), "Popup was opened in context style");
			popup1Widget.close();
		});

		popup1Widget.open({
			arrow: "r",
			positionTo: "#popup1Link",
		});
	});
}(window, window.document));
