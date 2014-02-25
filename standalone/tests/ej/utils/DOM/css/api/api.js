var dom = ej.utils.DOM;

test("utils.DOM.css - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.utils, "object", "ej.utils exists");
	equal(typeof dom.getCSSProperty, "function", "function getCSSProperty");
	equal(typeof dom.extractCSSProperties, "function", "function extractCSSProperties");
	equal(typeof dom.getElementHeight, "function", "function getElementHeight");
	equal(typeof dom.getElementWidth, "function", "function getElementWidth");
});