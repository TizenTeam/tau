/*global jQuery, module, asyncTest, test, equal, deepEqual, ok, CustomEvent, start, stop */
(function (tau, $) {
	"use strict";

	module('profile/mobile/widget/mobile/TabBar', {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test('Default tabbar', function () {
		var tabbar = document.getElementById('tabbar1'),
			isLandscape = window.innerWidth > window.innerHeight,
			eventsCalled = {};
		$(document).on("tabbarbeforecreate tabbarcreate", function (e) {
			eventsCalled[e.type] = true;
		});

		$(tabbar).tabbar();
		equal(tabbar.getAttribute('data-tau-bound'), "TabBar", "Tabbar widget is created");
		if (isLandscape) {
			ok(tabbar.classList.contains('ui-landscape-tabbar'), 'Proper class in landscape mode');
		} else {
			ok(tabbar.classList.contains('ui-portrait-tabbar'), 'Proper class in portrait mode');
		}
		ok(eventsCalled.tabbarbeforecreate, 'tabbarbeforecreate called');
		ok(eventsCalled.tabbarcreate, 'tabbarcreate called');
		$(document).off("tabbarbeforecreate tabbarcreate");
	});

	test('Tabbar icons', function () {
		var tabbar1 = document.getElementById('tabbar1'),
			tabbar2 = document.getElementById('tabbar2');

		$(tabbar1).tabbar();
		$(tabbar2).tabbar();
		ok(tabbar1.classList.contains('ui-tabbar-noicons'), 'Links without icons');
		ok(!tabbar2.classList.contains('ui-tabbar-noicons'), 'Links with icons');
	});

	test('Tabbar navbar', function () {
		var tabbar1 = document.getElementById('tabbar1'),
			tabbar2 = document.getElementById('tabbar2'),
			grid = $("#grid1");

		$(tabbar1).tabbar();
		$(tabbar2).tabbar();
		ok(tabbar1.classList.contains('ui-navbar'), "Tabbar1 doesn't have header and scrollview in headers and have list");
		ok(!$(tabbar1).find("li.tabbar-scroll-li").length, "Tabbar1 li elements are not enhanced");
		ok(!$(tabbar1).find("ul.tabbar-scroll-ul").length, "Tabbar1 ul elements are not enhanced");
		ok(grid.hasClass("ui-grid-a"), "Grid created");
		equal(grid.children(".ui-block-a").length, 1, "Grid created");
		equal(grid.children(".ui-block-b").length, 1, "Grid created");
		ok(!tabbar2.classList.contains('ui-navbar'), "Tabbar2 has header and scrollview in headers and have list");
		ok($(tabbar2).find("li.tabbar-scroll-li").length, "Tabbar2 li elements are enhanced");
		ok($(tabbar2).find("ul.tabbar-scroll-ul").length, "Tabbar2 ul elements are enhanced");
	});

	test('Title Tabbar', function () {
		var tabbar2 = document.getElementById('tabbar2'),
			tabbar3 = document.getElementById('tabbar3');

		$(tabbar2).tabbar();
		$(tabbar3).tabbar();
		ok(!document.getElementById('header2').classList.contains("ui-title-tabbar"), 'No class when tabbar is not title tabbar');
		ok(document.getElementById('header3').classList.contains("ui-title-tabbar"), 'Class when tabbar is not title tabbar');
	});

	test('Tabbar persist', function () {
		var tabbar1 = document.getElementById('tabbar1'),
			tabbar2 = document.getElementById('tabbar2');

		$(tabbar1).tabbar();
		$(tabbar2).tabbar();
		ok(!tabbar1.classList.contains('ui-tabbar-persist'), "Persist element doesn't exist");
		ok(tabbar2.classList.contains('ui-tabbar-persist'), "Persist element exists");
	});

	test('Tabbar in footer', function () {
		var $tabbar1 = $(document.getElementById('tabbar1')),
			$tabbar2 = $(document.getElementById('tabbar2'));

		$tabbar1.tabbar();
		$tabbar2.tabbar();
		ok($tabbar1.find("li.ui-tab-btn-style").length, "Proper class when tabbar is in footer");
		ok(!$tabbar2.find("li.ui-tab-btn-style").length, "Proper class when tabbar is NOT in footer");
	});

	asyncTest('Tabbar click', 1, function () {
		var $tabbar1 = $(document.getElementById('tabbar1'));
		setTimeout(function () {
			start();
		}, 20);
		$tabbar1.find('a').click(function () {
			ok(true, "Click was trigger");
		});

		$tabbar1.tabbar();
		$tabbar1.find('a').eq(0).click();
	});
}(window.tau, jQuery));