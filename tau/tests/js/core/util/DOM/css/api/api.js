var dom = ej.util.DOM;

module("core/util/DOM/css");

test("util.DOM.css - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.util, "object", "ej.util exists");
	equal(typeof dom.getCSSProperty, "function", "function getCSSProperty");
	equal(typeof dom.extractCSSProperties, "function", "function extractCSSProperties");
	equal(typeof dom.getElementHeight, "function", "function getElementHeight");
	equal(typeof dom.getElementWidth, "function", "function getElementWidth");
});