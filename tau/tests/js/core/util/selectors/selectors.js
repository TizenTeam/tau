/**
 * Created by m.urbanski on 29.05.14.
 * @TODO eliminate jQuery
 */
(function (document, ej) {
	var selectors = ej.util.selectors;
	"use strict";
	module("Matches Selector");
	test("matchesSelector", function () {
		var div1 = document.querySelector("#test2");
		ok(selectors.matchesSelector, "Function exists");
		equal(selectors.matchesSelector(div1, "#test2"), true, "Matches proper selector");
	});

	module("Parents");
	test("getParents", function () {
		var div = document.getElementById('test1');
		ok(selectors.getParents, "Function exist");
		equal(selectors.getParents(div).length, $(div).parents().length, "Rreturns the same number of elements like jquery");
	});

	test("getParentsBySelector", function () {
		var div = document.getElementById('test1');
		ok(selectors.getParentsBySelector, "Function exist");
		equal(selectors.getParentsBySelector(div, "div.test1a").length, $(div).parents("div.test1a").length, "Returns the same number of elements like jquery");
		equal(selectors.getParentsBySelector(div, "div.test1b").length, $(div).parents("div.test1b").length, "Returns the same number of elements like jquery");
	});

	test("getParentsByClass", function () {
		var div = document.getElementById('test1');
		ok(selectors.getParentsByClass, "Function exist");
		equal(selectors.getParentsByClass(div, "test1a").length, $(div).parents(".test1a").length, "Returns the same number of elements like jquery");
		equal(selectors.getParentsByClass(div, "test1b").length, $(div).parents(".test1b").length, "Returns the same number of elements like jquery");
	});

	test("getParentsByTag", function () {
		var div = document.getElementById('test1');
		ok(selectors.getParentsByTag, "Function exist");
		equal(selectors.getParentsByTag(div, "div").length, $(div).parents("div").length, "Returns the same number of elements like jquery");
	});

	test("getParentsBySelectorNS", function () {
		var div = document.getElementsByClassName("test1a");
		ok(selectors.getParentsBySelectorNS, "Function exist");
		equal(selectors.getParentsBySelectorNS(div[0], "role=page").length, $("#page1").length, "Returns the same number of elements like jquery");
	});

	module("Children");

	test("getChildrenBySelector", function () {
		var div = document.getElementById('test2');
		ok(selectors.getChildrenBySelector, "Function exist");
		equal(selectors.getChildrenBySelector(div, "p.test2a").length, $(div).children("p.test2a").length, "Returns the same number of elements like jquery");
		equal(selectors.getChildrenBySelector(div, "p.test2b").length, $(div).children("p.test2b").length, "Returns the same number of elements like jquery");
	});
	test("getChildrenByDataNS", function () {
		var div = document.getElementById("qunit-fixture");
		ok(selectors.getChildrenByDataNS, "Function exist");
		equal(selectors.getChildrenByDataNS(div, "role=page").length, $("#page1").length, "Returns the same number of elements like jquery");
	});
	test("getChildrenByClass", function () {
		var div = document.getElementById('test2');
		ok(selectors.getChildrenByClass, "Function exist");
		equal(selectors.getChildrenByClass(div, "test2a").length, $(div).children(".test2a").length, "Returns the same number of elements like jquery");
		equal(selectors.getChildrenByClass(div, "test2b").length, $(div).children(".test2b").length, "Returns the same number of elements like jquery");
	});

	test("getChildrenByTag", function () {
		var div = document.getElementById('test2');
		ok(selectors.getChildrenByTag, "Function exist");
		equal(selectors.getChildrenByTag(div, "p").length, $(div).children("p").length, "Returns the same number of elements like jquery");
		equal(selectors.getChildrenByTag(div, "h1").length, $(div).children("h1").length, "Returns the same number of elements like jquery");
	});

	module("Closest");

	test("getClosestBySelector", function () {
		var div = document.getElementById('test1');
		ok(selectors.getClosestBySelector, "Function exist");
		equal(selectors.getClosestBySelector(div, "div.test1a"), $(div).closest("div.test1a")[0], "Returns the same element like jquery");
		equal(selectors.getClosestBySelector(div, "div.test1b"), $(div).closest("div.test1b")[0], "Returns the same element like jquery");
	});

	test("getClosestByClass", function () {
		var div = document.getElementById('test1');
		ok(selectors.getClosestByClass, "Function exist");
		equal(selectors.getClosestByClass(div, "test1a"), $(div).closest(".test1a")[0], "Returns the same element like jquery");
		equal(selectors.getClosestByClass(div, "test1b"), $(div).closest(".test1b")[0], "Returns the same element like jquery");
	});

	test("getClosestBySelectorNS", function () {
		var div1 = document.getElementsByClassName("test1a"),
			div2 = document.getElementById("test1"),
			pageLength = $("#page1").length;

		ok(selectors.getClosestBySelectorNS, "Function exist");
		equal($(selectors.getClosestBySelectorNS(div1[0], "role=page")).length, pageLength, "Returns the same number of elements like jquery");
		equal($(selectors.getClosestBySelectorNS(div2, "role=page")).length, pageLength, "Returns the same number of elements like jquery");
	});

	test("getClosestByTag", function () {
		var div = document.getElementById('test1');
		ok(selectors.getClosestByTag, "Function exist");
		equal(selectors.getClosestByTag(div, "div"), $(div).closest("div")[0], "Returns the same element like jquery");
	});

	module("Data selector");

	test("getAllByDataNS", function () {
		var div = document.getElementById('test1');
		ok(selectors.getAllByDataNS, "Function exist");
		equal(selectors.getAllByDataNS(div, "role=button")[0], $(div).find("[data-role=button]")[0], "Returns the same element like jquery");
	});
}(document, window.ej));