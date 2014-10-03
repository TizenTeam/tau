page = document.getElementById('test_drawer_page');
page.addEventListener("pageshow", function() {
	"use strict";

	module("widget.tv.Drawer TV Drawer widget", {});

	test("Drawer", function () {
		ej.engine.createWidgets(document);
		var drawer = document.getElementById("drawer"),
			classList = drawer.classList,
			drawerPosition = drawer.getAttribute("data-position");

		//after build
		equal(drawer.getAttribute("data-tau-bound"), "Drawer", "Drawer widget is created");
		ok(classList.contains("ui-drawer"), "Drawer has ui-drawer class");
		ok(classList.contains("ui-drawer-" + drawerPosition), "Drawer has ui-drawer-" + drawerPosition + " class");
	});

	test("Drawer has got main items", function () {
		ej.engine.createWidgets(document);
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
		ej.engine.createWidgets(document);
		var drawer = document.getElementById("drawer"),
			widget = ej.engine.getBinding(drawer, "Drawer"),
			parent = drawer.parentElement,
			optionValue = widget.options.width;

		if (widget === null) {
			widget = ej.engine.instanceWidget(drawer);
		}

		widget._openActiveElement(drawer);
		equal(widget.options.width, optionValue, "Default settings - width correct");

		drawer.href = '#';
		parent.classList.add("ui-block");
		widget._openActiveElement(drawer);

		equal(widget.options.width, 301, "Custom settings - width correct");
	});

	test("open", function () {
		ej.engine.createWidgets(document);
		var drawer = document.getElementById("drawer"),
			widget = ej.engine.getBinding(drawer, "Drawer");

		if (widget === null) {
			widget = ej.engine.instanceWidget(drawer);
		}

		widget.open();

		equal(widget._supportKeyboard, true, "_supportKeyboard correct");
		equal(widget._pageWidget._supportKeyboard, false, "_pageWidget._supportKeyboard correct");
	});

	test("close", function () {
		ej.engine.createWidgets(document);
		var drawer = document.getElementById("drawer"),
			widget = ej.engine.getBinding(drawer, "Drawer");

		if (widget === null) {
			widget = ej.engine.instanceWidget(drawer);
		}

		widget.close();

		equal(widget._supportKeyboard, false, "_supportKeyboard correct");
		equal(widget._pageWidget._supportKeyboard, true, "_pageWidget._supportKeyboard correct");
	});

	test("_destroy", function () {
		ej.engine.createWidgets(document);
		var drawer = document.getElementById("drawer"),
			widget = ej.engine.getBinding(drawer, "Drawer"),
			destroyEventKeyinvoked = 0;

		if (widget === null) {
			widget = ej.engine.instanceWidget(drawer);
		}

		widget._destroyEventKey = function () {
			destroyEventKeyinvoked = 1;
		};

		widget.destroy();

		ok(destroyEventKeyinvoked, "Parent _destroyEventKey called");
	});
}(window.tau));
