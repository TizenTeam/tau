(function (tau) {
	var page = document.getElementById('test_listdivider_page');
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

		test("Listview with divider", function () {
			var list = document.getElementById('list');

			//after build
			equal(list.getAttribute('data-tau-bound'), "Listview", "List widget is created");
			ok(list.classList.contains('ui-listview'), 'List has ui-listview class');
		});

		test("Listview has divider", function () {
			var list = document.getElementById('list'),
				divider = document.getElementById('li-1'),
				dividerTextSpan,
				dividerLineSpan;

			//after build
			equal(list.getAttribute('data-tau-bound'), "Listview", "List widget is created");
			ok(list.classList.contains('ui-listview'), 'List has ui-listview class');

			equal(divider.getAttribute('data-tau-bound'), "ListDivider", "divider is created for list element");
			ok(divider.classList.contains('ui-li-divider'), 'List has ui-li-divider class');

			//check if divider has spans
			equal(divider.childNodes.length, 2, "Divider has two spans");
			dividerTextSpan = divider.childNodes[0];
			ok(dividerTextSpan.classList.contains('ui-divider-text'), 'Divider text span has ui-divider-text class');
			dividerLineSpan = divider.childNodes[1];
			ok(dividerLineSpan.classList.contains('ui-divider-normal-line'), 'Line span has ui-divider-normal-line class');
		});

		test("Contains methods inherited from parent", function () {
			var list = document.getElementById('list'),
				widget = window.tau.engine.instanceWidget(list, "ListDivider");

			equal(typeof widget._configure, "function", "Contains _configure");
			equal(typeof widget._build, "function", "Contains _build");
		});
	});
}(window.tau));
