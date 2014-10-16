/*global window, console, test, equal, module, ej, asyncTest, start, HTMLElement, HTMLDivElement */
/*jslint nomen: true */
(function (window, document) {
		"use strict";

		var engine = ej.engine;

		module("Listview tests", {
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
}(window, window.document));