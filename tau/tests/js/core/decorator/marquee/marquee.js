(function (window, document) {
	"use strict";

	module("core/decorator/marquee", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	var page = document.getElementById("page1");

	page.addEventListener("pageshow", function() {

		var marquee = tau.decorator.marquee,
			btn3 = document.getElementById("btn3");

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

		function focusButton(event) {
			var btn1 = document.getElementById("btn1"),
				element = event.target;

			ok(element.querySelector("." + marquee.classes.marqueeStart), "Button outside list has marquee effect.");
			document.removeEventListener("taufocus", focusButton, false);
			tau.event.trigger(document, "taublur", {element: btn1});
			start();
		}

		asyncTest("Button outside list", function () {
			var btn1 = document.getElementById("btn1"),
				span;

			tau.widget.Button(btn1);
			showPage(page);

			span = document.getElementsByClassName("ui-text")[0];
			if (span.clientWidth < span.scrollWidth) {
				ok(true, "Button has long text inside");
				document.addEventListener("taufocus", focusButton, false);
				tau.event.trigger(document, "taufocus", {element: btn1});
			}
		});

		function blurList_long(event) {
			var btn2 = document.getElementById("btn2"),
				element = event.target;

			ok(!element.querySelector("." + marquee.classes.marqueeStart), "Button inside list with long text does not have marquee effect on blur.");
			document.removeEventListener("taublur", blurList_long, false);
			start();
		}

		function focusList_long(event) {
			var element = event.target,
				btn2 = document.getElementById("btn2");

			ok(element.querySelector("." + marquee.classes.marqueeStart), "Button inside list with long text has marquee effect on focus.");
			document.removeEventListener("taufocus", focusList_long, false);
			document.addEventListener("taublur", blurList_long, false);
			tau.event.trigger(document, "taublur", {element: btn2});
		}

		asyncTest("Button inside list", 3, function () {
			var list = document.getElementById("list"),
				btn2 = document.getElementById("btn2"),
				span;

			tau.widget.Listview(list);
			showPage(document.getElementById("page1"));

			span = btn2.getElementsByClassName("ui-text")[0];
			if (span.clientWidth < span.scrollWidth) {
				ok(true, "Button has long text inside");
				document.addEventListener("taufocus", focusList_long, false);
				tau.event.trigger(document, "taufocus", {element: btn2});
			}
		});

		function focusList_short(event) {
			var element = event.target,
				btn3= document.getElementById("btn3");

			ok(!element.querySelector("." + marquee.classes.marqueeStart), "Button inside list with short text does not have marquee effect on focus.");
			document.removeEventListener("taufocus", focusList_long, false);
			start();
		}

		asyncTest("Button inside list - short text", 2, function () {
			var list = document.getElementById("list"),
				btn3 = document.getElementById("btn3"),
				span;

			tau.widget.Listview(list);
			showPage(document.getElementById("page1"));

			span = btn3.getElementsByClassName("ui-btn-text")[0];
			if (span.clientWidth >= span.scrollWidth) {
				ok(true, "Button has short text inside");
				document.addEventListener("taufocus", focusList_short, false);
				tau.event.trigger(document, "taufocus", {element: btn3});
			}
		});

		test("List with short items", function() {
			var list = document.getElementById("list2");

			tau.widget.Listview(list);
			showPage(document.getElementById("page1"));

			// add marquee effect on list
			marquee.enable(list);
			equal(list.querySelectorAll(marquee.classes.marqueeStart).length, 0, "No element has marquee effect.");

			hidePage(document.getElementById("page1"));
		});
	});
}(window, window.document));

