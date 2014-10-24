/*global window, console, test, equal, module, ej, asyncTest, start, HTMLElement, HTMLDivElement */
/*jslint nomen: true */
(function (window, document) {
		"use strict";

		var engine = ej.engine;

		module("Listview tests", {
			setup: function () {
				engine.createWidgets(document);
			},
			teardown: function () {
				engine._clearBindings();
			}
		});

		test("Listview with data-role='listview'", function () {
			var list = document.getElementById("list-with-data-role");

			//after build
			equal(list.getAttribute("data-tau-bound"), "Listview", "List widget is created");
			ok(list.classList.contains("ui-listview"), "List has ui-listview class");
			equal(list.getAttribute("data-tau-built"), "Listview", "Listview widget is built");
			equal(list.getAttribute("data-tau-name"), "Listview", "Listview has correct widget name");
		});

		test('Refresh listview', function () {
			var li3 = document.createElement("li"),
				li4 = document.createElement("li"),
				link3 = document.createElement("a"),
				link4 = document.createElement("a"),
				list = document.getElementById("list-with-data-role"),
				itemLink,
				innerButtonSpan,
				innerButtonTextSpan,
				listWidget;

			// append new li element and refresh list;
			li3.appendChild(link3);
			li4.appendChild(link4);
			li3.setAttribute("id", "li-dr-3");
			li4.setAttribute("id", "li-dr-4");
			list.appendChild(li3);
			list.appendChild(li4);

			listWidget = window.tau.engine.instanceWidget(list, "Listview");
			listWidget.refresh();

			//after refresh
			list = document.getElementById("list-with-data-role"),
			equal(list.getAttribute("data-tau-bound"), "Listview", "List widget is created");
			ok(list.classList.contains("ui-listview"), "List has ui-listview class");
			equal(list.getAttribute("data-tau-built"), "Listview", "Listview widget is built");
			equal(list.getAttribute("data-tau-name"), "Listview", "Listview has correct widget name");

			//check if link is changed to button
			li3 = document.getElementById("li-dr-3");
			equal(li3.childNodes.length, 1, "List item contains one link");
			itemLink = li3.childNodes[0];
			equal(itemLink.getAttribute("data-tau-bound"), "Button", "Button widget is created for linka <a>");
			ok(itemLink.classList.contains("ui-btn"), "List has ui-listview class");

			//check if button is inner button with text
			innerButtonSpan = itemLink.getElementsByTagName("SPAN")[0];
			ok(innerButtonSpan.classList.contains("ui-btn-inner"), "Link span has ui-btn-inner class");
			equal(innerButtonSpan.childNodes.length, 1, "Second span for link is created");
			innerButtonTextSpan = innerButtonSpan.childNodes[0];
			ok(innerButtonTextSpan.classList.contains("ui-btn-text"), "Link span has ui-btn-text class");
		});

}(window, window.document));
