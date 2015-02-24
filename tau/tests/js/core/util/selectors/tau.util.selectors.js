var selectors = tau.util.selectors;

module("core/util/selectors");

test("tau.util.selectors - check function matchesSelector", function () {
	var elem1 = document.getElementById("selectors1-parent"),
		elem2 = document.getElementById("selectors1-child");

	equal(typeof selectors.matchesSelector(elem1, "[data-type='selector']"), "boolean", "function matchesSelector returns boolean value");
	equal(selectors.matchesSelector(elem1, "[data-type='selector']"), true, "function matchesSelector returns true value");
	equal(selectors.matchesSelector(elem2, "[data-type='selector']"), false, "function matchesSelector returns false value");
});

test("tau.util.selectors - check functions with 'children'", function () {
	var elem1 = document.getElementById("selectors1-parent"),
		child1 = document.getElementById("selectors1-child");

	equal(typeof selectors.getChildrenBySelector(elem1, "[data-type='selector']"), "object", "function getChildrenBySelector returns object");
	ok(selectors.getChildrenBySelector(elem1, "[data-type='selector']") instanceof Array, "function getChildrenBySelector returns Array");
	equal(selectors.getChildrenBySelector(elem1, "[data-type='child']")[0].id, child1.id, "function getChildrenBySelector returns right value");

	equal(typeof selectors.getChildrenByClass(elem1, "className"), "object", "function getChildrenByClass returns object");
	ok(selectors.getChildrenByClass(elem1, "className") instanceof Array, "function getChildrenByClass returns Array");
	equal(selectors.getChildrenByClass(elem1, "className").length, 1, "function getChildrenByClass");

	equal(typeof selectors.getChildrenByTag(elem1, "div"), "object", "function getChildrenByTag returns object");
	ok(selectors.getChildrenByTag(elem1, "a") instanceof Array, "function getChildrenByTag returns Array");
	equal(selectors.getChildrenByTag(elem1, "div").length, 2, "function getChildrenByTag finds element with div tag");
	equal(selectors.getChildrenByTag(elem1, "a").length, 0, "function getChildrenByTag doesn't find element with a tag");
});

test("tau.util.selectors - check functions with 'closest'", function () {
	var elem1 = document.getElementById("selectors1-parent"),
		child1 = document.getElementById("selectors1-child"),
		child2 = document.getElementById("selectors1-child-second");

	equal(typeof selectors.getClosestBySelector(elem1, "[data-type='selector']"), "object", "function getClosestBySelector returns object");
	ok(selectors.getClosestBySelector(elem1, "[data-type='selector']") instanceof Element, "function getClosestBySelector returns element");
	equal(selectors.getClosestBySelector(child1, "[data-type='selector']"), elem1, "function getClosestBySelector returns object");

	equal(selectors.getClosestByClass(child2, "no-class"), null, "function getClosestByClass returns null");
	equal(selectors.getClosestByClass(child2, "className2"), child2, "function getClosestByClass returns itself");
	equal(selectors.getClosestByClass(child1, "parent"), elem1, "function getClosestByClass returns parent");

	equal(typeof selectors.getClosestByTag(elem1, "div"), "object", "function getClosestByTag returns object");
	equal(selectors.getClosestByTag(elem1, "div"), elem1, "function getClosestByTag returns itself");
	equal(selectors.getClosestByTag(elem1, "form"), null, "function getClosestByTag returns null");
	ok(selectors.getClosestByTag(elem1, "a") instanceof Element, "function getClosestByTag returns element");
	equal(selectors.getClosestByTag(child2, "a"), elem1.parentNode, "function getClosestByTag returns right element");
});
