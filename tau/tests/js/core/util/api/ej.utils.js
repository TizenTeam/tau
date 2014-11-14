var util = ej.util;

module("core/util");

test("tau.util - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.util, "object", "ej.util exists");
	equal(typeof util.requestAnimationFrame, "function", "function hashObject");
});