(function (tau) {
	var page = document.getElementById("test_listview_page");
	page.addEventListener("pageshow", function() {
		"use strict";

		var engine = ej.engine;

		module("profile/tv/widget/Listview", {
			setup: function () {
				engine.createWidgets(document);
			},
			teardown: function () {
				engine._clearBindings();
			}
		});


		test("Listview", function () {
			var list = document.getElementById("list");

			//after build
			equal(list.getAttribute("data-tau-bound"), "Listview", "List widget is created");
			ok(list.classList.contains("ui-listview"), "List has ui-listview class");
			equal(list.getAttribute("data-tau-built"), "Listview", "Listview widget is built");
			equal(list.getAttribute("data-tau-name"), "Listview", "Listview has correct widget name");
		});

		test("Listview has link item", function () {
			var list = document.getElementById("list"),
				li = document.getElementById("li-1"),
				itemLink,
				innerButtonSpan,
				innerButtonTextSpan;

			//after build
			equal(list.getAttribute("data-tau-bound"), "Listview", "List widget is created");
			ok(list.classList.contains("ui-listview"), "List has ui-listview class");

			//check if link is changed to button
			equal(li.childNodes.length, 1, "List item contains one link");
			itemLink = li.childNodes[0];
			equal(itemLink.getAttribute("data-tau-bound"), "Button", "Button widget is created for linka <a>");
			ok(itemLink.classList.contains("ui-btn"), "List has ui-listview class");

			//check if button is inner button with text
			innerButtonSpan = itemLink.getElementsByTagName("SPAN")[0];
			ok(innerButtonSpan.classList.contains("ui-btn-inner"), "Link span has ui-btn-inner class");
			ok(innerButtonSpan.classList.contains("ui-btn-hastxt"), "Link span has ui-btn-hastxt class");
			equal(innerButtonSpan.childNodes.length, 1, "Second span for link is created");
			innerButtonTextSpan = innerButtonSpan.childNodes[0];
			ok(innerButtonTextSpan.classList.contains("ui-btn-text"), "Link span has ui-btn-text class");
		});

	});

}(window.tau));
