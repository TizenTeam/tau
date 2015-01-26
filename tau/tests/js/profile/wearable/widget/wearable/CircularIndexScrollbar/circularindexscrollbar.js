(function (window, document) {
	"use strict";

	test("circularindexscrollbar class check", 2, function() {
		var el = document.getElementById("widget4"),
			widget = tau.widget.CircularIndexScrollbar(el);

		ok(widget._indexBar.classList.contains("ui-circularindexscrollbar-indexbar"), "indexbar has 'ui-circularindexscrollbar-indexbar' class");
		ok(widget._indicator.element.classList.contains("ui-circularindexscrollbar-indicator"), "indicator has 'ui-circularindexscrollbar' class");
		widget.destroy();
	});

	test("basic attributes test", 8, function() {
		var el1 = document.getElementById("widget1"),
			el2 = document.getElementById("widget2"),
			el3 = document.getElementById("widget3"),
			widget1 = tau.widget.CircularIndexScrollbar(el1),
			widget2 = tau.widget.CircularIndexScrollbar(el2),
			widget3 = tau.widget.CircularIndexScrollbar(el3);

		equal(widget1.options.index.length, 4, "Widget has new index from data-index");
		equal(widget1.options.index[0], "A", "First index is 'A'");
		equal(widget1.options.index[1], "B", "Second index is 'B'");
		equal(widget1.options.index[2], "C", "Third index is 'C'");
		equal(widget1.options.index[3], "D", "Forth index is 'D'");
		equal(widget2.options.maxVisibleIndex, 10, "Widget new maxVisibleIndex from data-maxVisibleIndex");
		equal(widget3.options.index.length, 6, "Indices was seperated by data-delimeter");
		equal(widget3.element.getElementsByClassName("ui-circularindexscrollbar-index")[1].firstChild.innerHTML, "*", "more chractor is detemined by data-more-char");
		widget1.destroy();
		widget2.destroy();
		widget3.destroy();
	});

	test("change option test", 2, function() {
		var el = document.getElementById("widget5"),
			widget = tau.widget.CircularIndexScrollbar(el);

		widget.option("index", "A,B,C,D,E,F,G");
		equal(widget.options.index.length, 7, "Widget has new index from options");

		widget.option("maxVisibleIndex", "5");
		equal(widget.options.maxVisibleIndex, 5, "Widget has new maxVisibleIndex from options");
		widget.destroy();
	});

	asyncTest("show/hide method test", 2, function() {
		var el = document.getElementById("widget6"),
			widget = tau.widget.CircularIndexScrollbar(el);

		el.addEventListener("indexshow", function() {
			ok(widget.element.classList.contains("ui-circularindexscrollbar-show"), "widget is shown");
			widget.hide();
		});

		el.addEventListener("indexhide", function() {
			ok(!widget.element.classList.contains("ui-circularindexscrollbar-show"), "widget is hidden");
			start();
			widget.destroy();
		});

		widget.show();
	});

	test("set/get value test", 1, function() {
		var el = document.getElementById("widget7"),
			widget = tau.widget.CircularIndexScrollbar(el);

		widget._setValue("B");
		equal(widget._getValue(), "B", "widget sets index value by setValue method");
		widget.destroy();
	});

})(window, window.document);

