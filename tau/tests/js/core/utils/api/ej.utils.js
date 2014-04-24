var utils = ej.utils;

test("ej.utils - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.utils, "object", "ej.utils exists");
	equal(typeof utils.requestAnimationFrame, "function", "function hashObject");
});