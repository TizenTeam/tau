page = document.getElementById('test_drawer_page');
page.addEventListener("pageshow", function() {
	"use strict";

	module("profile/tv/widget/Drawer", {
		setup: function() {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("Drawer", function () {
		tau.engine.createWidgets(document);
		var drawer = document.getElementById("drawer"),
			classList = drawer.classList,
			drawerPosition = drawer.getAttribute("data-position");

		//after build
		equal(drawer.getAttribute("data-tau-bound"), "Drawer", "Drawer widget is created");
		ok(classList.contains("ui-drawer"), "Drawer has ui-drawer class");
		ok(classList.contains("ui-drawer-" + drawerPosition), "Drawer has ui-drawer-" + drawerPosition + " class");
	});

	test("Drawer has got main items", function () {
		tau.engine.createWidgets(document);
		var drawer = document.getElementById("drawer"),
			item;

		equal(drawer.getAttribute("data-tau-bound"), "Drawer", "Drawer widget is created");

		item = document.getElementById("mainItem1");
		ok(item.parentNode.parentNode === drawer, "Drawer has main item 1");

		item = document.getElementById("mainItem2");
		ok(item.parentNode.parentNode === drawer, "Drawer has main item 2");

		item = document.getElementById("subItem1");
		ok(item.parentNode.parentNode === drawer, "Drawer has sub item 1");
	});

	test("_openActiveElement", function () {
		tau.engine.createWidgets(document);
		var drawer = document.getElementById("drawer"),
			link2 =  document.getElementById("link2"),
			link3 =  document.getElementById("link3"),
			widget = tau.engine.getBinding(drawer, "Drawer"),
			optionValue = widget.options.width;

		if (widget === null) {
			widget = tau.engine.instanceWidget(drawer);
		}

		widget._openActiveElement(drawer);
		equal(widget.options.width, optionValue, "Default settings - width correct");

		widget._openActiveElement(link3);
		equal(widget.options.width, 937, "Changes width to wide");

		widget._openActiveElement(link2);
		equal(widget.options.width, 301, "Changed width to narrow");
	});

	asyncTest("open", function () {
		var page = document.getElementById("test_drawer_page");
		tau.event.one(page, "pageshow", function() {
			tau.engine.createWidgets(document);
			var drawer = document.getElementById("drawer"),
				widget = tau.engine.getBinding(drawer, "Drawer"),
				pageWidget = tau.engine.getBinding(page, "Page");

			if (widget === null) {
				widget = tau.engine.instanceWidget(drawer);
			}

			widget.open();

			equal(widget._supportKeyboard, true, "_supportKeyboard correct");
			equal(pageWidget._supportKeyboard, false, "_pageWidget._supportKeyboard correct");
			start();
		});
	});

	asyncTest("close", function () {
		var page = document.getElementById("test_drawer_page");
		tau.event.one(page, "pageshow", function() {
			tau.engine.createWidgets(document);
			var drawer = document.getElementById("drawer"),
				widget = tau.engine.getBinding(drawer, "Drawer"),
				pageWidget = tau.engine.getBinding(page, "Page");

			if (widget === null) {
				widget = tau.engine.instanceWidget(drawer);
			}

			widget.open();

			widget.close();

			equal(widget._supportKeyboard, false, "_supportKeyboard correct");
			equal(pageWidget._supportKeyboard, true, "_pageWidget._supportKeyboard correct");
			start();
		});
	});

	test("_destroy", function () {
		tau.engine.createWidgets(document);
		var drawer = document.getElementById("drawer"),
			widget = tau.engine.getBinding(drawer, "Drawer"),
			destroyEventKeyinvoked = 0;

		if (widget === null) {
			widget = tau.engine.instanceWidget(drawer);
		}

		widget._destroyEventKey = function () {
			destroyEventKeyinvoked = 1;
		};

		widget.destroy();

		ok(destroyEventKeyinvoked, "Parent _destroyEventKey called");
	});
}(window.tau));
