var array = ej.util.array;

test("ej.util.array - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.util, "object", "ej.util exists");
	equal(typeof ej.util.array, "object", "ej.util.easing exists");
	equal(typeof array.range, "function", "function range");
});
