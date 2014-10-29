/*global jQuery, module, asyncTest, test, equal, deepEqual, ok, CustomEvent, start, stop */
(function (tau, $) {
	"use strict";

	module("Tabbar", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("Default tabbar", function () {
		var tabbar = document.getElementById("tabbar1"),
			isLandscape = window.innerWidth > window.innerHeight,
			eventsCalled = {};
		$(document).on("tabbarbeforecreate tabbarcreate", function (e) {
			eventsCalled[e.type] = true;
		});

		tau.widget.TabBar(tabbar);
		equal(tabbar.getAttribute("data-tau-bound"), "TabBar", "Tabbar widget is created");
		if (isLandscape) {
			ok(tabbar.classList.contains("ui-landscape-tabbar"), "Proper class in landscape mode");
		} else {
			ok(tabbar.classList.contains("ui-portrait-tabbar"), "Proper class in portrait mode");
		}
		ok(eventsCalled.tabbarbeforecreate, "tabbarbeforecreate called");
		ok(eventsCalled.tabbarcreate, "tabbarcreate called");
		$(document).off("tabbarbeforecreate tabbarcreate");
	});

	test("Tabbar icons", function () {
		var tabbar1 = document.getElementById("tabbar1"),
			tabbar2 = document.getElementById("tabbar2");

		tau.widget.TabBar(tabbar1);
		tau.widget.TabBar(tabbar2);
		ok(tabbar1.classList.contains("ui-tabbar-noicons"), "Links without icons");
		ok(!tabbar2.classList.contains("ui-tabbar-noicons"), "Links with icons");
	});

	test("Tabbar navbar", function () {
		var tabbar1 = document.getElementById("tabbar1"),
			tabbar2 = document.getElementById("tabbar2"),
			grid = $("#grid1");

		tau.widget.TabBar(tabbar1);
		tau.widget.TabBar(tabbar2);

		ok(tabbar1.classList.contains("ui-navbar"), "Tabbar1 does not have header and scrollview in headers and have list");
		ok(!$(tabbar1).find("li.tabbar-scroll-li").length, "Tabbar1 li elements are not enhanced");
		ok(!$(tabbar1).find("ul.tabbar-scroll-ul").length, "Tabbar1 ul elements are not enhanced");
		ok(grid.hasClass("ui-grid-a"), "Grid created");
		equal(grid.children(".ui-block-a").length, 1, "Grid created");
		equal(grid.children(".ui-block-b").length, 1, "Grid created");
		ok(!tabbar2.classList.contains("ui-navbar"), "Tabbar2 has header and scrollview in headers and have list");
		ok($(tabbar2).find("li.tabbar-scroll-li").length, "Tabbar2 li elements are enhanced");
		ok($(tabbar2).find("ul.tabbar-scroll-ul").length, "Tabbar2 ul elements are enhanced");
	});

	test("Title Tabbar", function () {
		var tabbar2 = document.getElementById("tabbar2"),
			tabbar3 = document.getElementById("tabbar3");

		tau.widget.TabBar(tabbar2);
		tau.widget.TabBar(tabbar3);

		ok(!document.getElementById("header2").classList.contains("ui-title-tabbar"), "No class when tabbar is not title tabbar");
		ok(document.getElementById("header3").classList.contains("ui-title-tabbar"), "Class when tabbar is not title tabbar");
	});

	test("Tabbar persist", function () {
		var tabbar1 = document.getElementById("tabbar1"),
			tabbar2 = document.getElementById("tabbar2");

		tau.widget.TabBar(tabbar1);
		tau.widget.TabBar(tabbar2);

		ok(!tabbar1.classList.contains("ui-tabbar-persist"), "Persist element does not exist");
		ok(tabbar2.classList.contains("ui-tabbar-persist"), "Persist element exists");
	});

	test("Tabbar in footer", function () {
		var $tabbar1 = $(document.getElementById("tabbar1")),
			$tabbar2 = $(document.getElementById("tabbar2"));

		tau.widget.TabBar($tabbar1[0]);
		tau.widget.TabBar($tabbar2[0]);

		ok($tabbar1.find("li.ui-tab-btn-style").length, "Proper class when tabbar is in footer");
		ok(!$tabbar2.find("li.ui-tab-btn-style").length, "Proper class when tabbar is NOT in footer");
	});

	asyncTest("Tabbar click", 2, function () {
		var tabbar3 = document.getElementById("tabbar3"),
			tab = document.getElementById("click");

		tau.engine.instanceWidget(tabbar3, "TabBar");
		tabbar3.addEventListener("vclick", function(){
			ok(true, "Event was propagated on element.");
			ok(tab.classList.contains("ui-tab-active"), "Class was added to tab.");
			start();
		});
		tab.click();
	});

	test("Disable/enable/refresh", function () {
		var tabbar = document.getElementById("tabbar4"),
			widget = tau.widget.TabBar(tabbar),
			li0 = document.getElementById("li0"),
			li1 = document.getElementById("li1");

		equal(li0.getAttribute("disabled"), null, "Element is not disabled");
		ok(!li0.classList.contains("ui-disabled"),  "Element does not have class ui-disabled");
		equal(li1.getAttribute("disabled"), null, "Element is not disabled");
		ok(!li1.classList.contains("ui-disabled"),  "Element does not have class ui-disabled");
		widget.disable(0);
		equal(li0.getAttribute("disabled"), "true", "Element is disabled");
		ok(li0.classList.contains("ui-disabled"),  "Element has class ui-disabled");
		equal(li1.getAttribute("disable"), null, "Element is not disabled");
		ok(!li1.classList.contains("ui-disabled"),  "Element does not have class ui-disabled");
		widget.disable(1);
		equal(li0.getAttribute("disabled"), "true", "Element is disabled");
		ok(li0.classList.contains("ui-disabled"),  "Element has class ui-disabled");
		equal(li1.getAttribute("disabled"), "true", "Element is disabled");
		ok(li1.classList.contains("ui-disabled"),  "Element has class ui-disabled");
		widget.enable(1);
		equal(li0.getAttribute("disabled"), "true", "Element is disabled");
		ok(li0.classList.contains("ui-disabled"),  "Element has class ui-disabled");
		ok(li1.getAttribute("disabled"), "false", "Element is not disabled");
		ok(!li1.classList.contains("ui-disabled"),  "Element does not have class ui-disabled");
		widget.refresh();
		equal(widget.options.active, 1, "Option active has proper value");
		widget.enable(2);
		widget.refresh();
		equal(widget.options.active, 2, "Option active has proper value");
	});

	asyncTest("Destroy", 1, function () {
		var tabbar = document.getElementById("tabbar4"),
			widget = tau.widget.TabBar(tabbar);

		tabbar.addEventListener("tabbardestroy", function(){
			ok(true, "Widget was destroyed.");
			start();
		});
		widget.destroy();
	});

	if (!window.navigator.userAgent.match("PhantomJS")) {
		asyncTest("Tabbar scrollstop", 1, function () {
			var tabbar5 = document.getElementById("tabbar5"),
				scrollview = document.getElementById("content2");

			tau.widget.Page(document.getElementById("page2"));
			tau.widget.Scrollview(scrollview);
			tau.widget.TabBar(tabbar5);
			tau.event.one(scrollview, "scrollstop", function(){
				ok(true, "Scrolling.");
				// todo - check if position is proper
				start();
			});
			scrollview.scrollLeft = parseInt(tabbar5.getElementsByTagName("li")[0].style.width) - 10;
		});

		asyncTest("Tabbar scrollstop 2", 2, function () {
			var tabbar5 = document.getElementById("tabbar5"),
				scrollview = document.getElementById("content2"),
				widget;

			tau.widget.Page(document.getElementById("page2"));
			tau.widget.Scrollview(document.getElementById("content2"));
			widget = tau.widget.TabBar(tabbar5);
			tabbar5.addEventListener("tabbardestroy", function(){
				ok(true, "Widget was destroyed.");
				start();
			});

			tau.event.one(scrollview, "scrollstop", function(){
				ok(true, "Scrolling.");
				// todo - check if position is proper
				widget.destroy();
			});
			scrollview.scrollLeft = parseInt(tabbar5.getElementsByTagName("li")[0].style.width) / 3;
		});
	}

}(window.tau, jQuery));
