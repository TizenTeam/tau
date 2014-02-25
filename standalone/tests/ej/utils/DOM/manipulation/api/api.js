var dom = ej.utils.DOM;

test("utils.DOM.manipulation - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.utils, "object", "ej.utils exists");
	equal(typeof dom.appendNodes, "function", "function appendNodes");
	equal(typeof dom.replaceWithNodes, "function", "function replaceWithNodes");
	equal(typeof dom.removeAllChildren, "function", "function removeAllChildren");
	equal(typeof dom.insertNodesBefore, "function", "function insertNodesBefore");
	equal(typeof dom.insertNodeAfter, "function", "function insertNodeAfter");
	equal(typeof dom.wrapInHTML, "function", "function wrapInHTML");
});