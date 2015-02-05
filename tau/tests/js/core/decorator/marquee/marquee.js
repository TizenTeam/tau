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
			btn1.removeEventListener("focus", focusButton, false);
			tau.event.trigger(btn1, "blur");
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
				btn1.addEventListener("focus", focusButton, false);
				tau.event.trigger(btn1, "focus");
			}
		});

		function blurList_long(event) {
			var btn2 = document.getElementById("btn2"),
				element = event.target;

			ok(!element.querySelector("." + marquee.classes.marqueeStart), "Button inside list with long text does not have marquee effect on blur.");
			btn2.removeEventListener("blur", blurList_long, false);
			start();
		}

		function focusList_long(event) {
			var element = event.target,
				btn2 = document.getElementById("btn2");

			ok(element.querySelector("." + marquee.classes.marqueeStart), "Button inside list with long text has marquee effect on focus.");
			btn2.removeEventListener("focus", focusList_long, false);
			btn2.addEventListener("blur", blurList_long, false);
			tau.event.trigger(btn2, "blur");
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
				btn2.addEventListener("focus", focusList_long, false);
				tau.event.trigger(btn2, "focus");
			}
		});

		function focusList_short(event) {
			var element = event.target,
				btn3= document.getElementById("btn3");

			ok(!element.querySelector("." + marquee.classes.marqueeStart), "Button inside list with short text does not have marquee effect on focus.");
			btn3.removeEventListener("focus", focusList_long, false);
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
				btn3.addEventListener("focus", focusList_short, false);
				tau.event.trigger(btn3, "focus");
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

		test("Enable/disable marquee effect on button", function() {
			var btn = document.getElementById("btn6");

			tau.widget.Button(btn);
			showPage(document.getElementById("page1"));

			// add marquee effect on list
			marquee.enable(btn);
			equal(btn.querySelectorAll("." + marquee.classes.marqueeStart).length, 1, "Button has marquee effect.");
			equal(document.querySelectorAll("[id^='marquee0']").length, 1, "Marquee stylesheet was added.");

			// try to add marquee one more time
			marquee.enable(btn);
			equal(document.querySelectorAll("[id^='marquee0']").length, 1, "Only one stylesheet was added.");
			// remove marquee effect on list
			marquee.disable(btn);
			equal(btn.querySelectorAll("." + marquee.classes.marqueeStart).length, 0, "Button does not have marquee effect.");

			hidePage(document.getElementById("page1"));
		});
	});
}(window, window.document));

