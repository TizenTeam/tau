var array = ej.utils.array;

test("ej.utils.array - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.utils, "object", "ej.utils exists");
	equal(typeof ej.utils.array, "object", "ej.utils.easing exists");
	equal(typeof array.range, "function", "function range");
});
