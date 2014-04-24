var selectors = ej.utils.selectors;

test("ej.utils.selectors - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.utils, "object", "ej.utils exists");
	equal(typeof ej.utils.selectors, "object", "ej.utils.selectors exists");
	equal(typeof selectors.matchesSelector, "function", "function set");
	equal(typeof selectors.getChildrenBySelector, "function", "function set");
	equal(typeof selectors.getChildrenByClass, "function", "function get");
	equal(typeof selectors.getChildrenByTag, "function", "function remove");
	equal(typeof selectors.getParents, "function", "function set");
	equal(typeof selectors.getParentsBySelector, "function", "function get");
	equal(typeof selectors.getParentsByClass, "function", "function remove");
	equal(typeof selectors.getParentsByTag, "function", "function set");
	equal(typeof selectors.getClosestBySelector, "function", "function get");
	equal(typeof selectors.getClosestByClass, "function", "function remove");
	equal(typeof selectors.getClosestByTag, "function", "function remove");
	equal(typeof selectors.getChildrenByDataNS, "function", "function get");
	equal(typeof selectors.getParentsBySelectorNS, "function", "function get");
	equal(typeof selectors.getClosestBySelectorNS, "function", "function get");
	equal(typeof selectors.getAllByDataNS, "function", "function get");
	
	
	
	
});

test("ej.utils.selectors - check function matchesSelector", function () {
	var elem1 = document.getElementById("selectors1-parent"),
		elem2 = document.getElementById("selectors1-child");

	equal(typeof selectors.matchesSelector(elem1, "[data-type='selector']"), "boolean", "function matchesSelector returns boolean value");
	equal(selectors.matchesSelector(elem1, "[data-type='selector']"), true, "function matchesSelector returns true value");
	equal(selectors.matchesSelector(elem2, "[data-type='selector']"), false, "function matchesSelector returns false value");
});

test("ej.utils.selectors - check functions with 'children'", function () {
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

test("ej.utils.selectors - check functions with 'parent'", function () {
	var elem1 = document.getElementById("selectors1-parent"),
		child1 = document.getElementById("selectors1-child"),
		child2 = document.getElementById("selectors1-child-second");

	equal(typeof selectors.getParents(elem1), "object", "function getParents returns object");
	ok(selectors.getParents(elem1) instanceof Array, "function getParents returns Array");
	equal(selectors.getParents(child1).length, 6, "function getParents returns right value");
	equal(selectors.getParents(elem1).length, 5, "function getParents returns right value");
	equal(selectors.getParents(child1)[0].id, elem1.id, "function getParents returns right value");

	ok(selectors.getParentsBySelector(elem1, "[data-type='selector']") instanceof Array, "function getParentsBySelector returns Array");
	equal(selectors.getParentsBySelector(child1, "[data-type='selector']")[0].id, elem1.id, "function getParentsBySelector returns right value");

	equal(typeof selectors.getParentsByClass(child1, "parent"), "object", "function getParentsByClass returns object");
	ok(selectors.getParentsByClass(child2, "className") instanceof Array, "function getParentsByClass returns Array");
	equal(selectors.getParentsByClass(child2, "parent").length, 1, "function getParentsByClass");

	equal(typeof selectors.getParentsByTag(elem1, "div"), "object", "function getParentsByTag returns object");
	ok(selectors.getParentsByTag(child1, "form") instanceof Array, "function getParentsByTag returns Array");
	equal(selectors.getParentsByTag(child1, "div").length, 3, "function getParentsByTag returns right value");
	equal(selectors.getParentsByTag(child2, "a").length, 1, "function getParentsByTag returns right value");
	equal(selectors.getParentsByTag(child2, "form").length, 0, "function getParentsByTag returns right value");
});

test("ej.utils.selectors - check functions with 'closest'", function () {
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
