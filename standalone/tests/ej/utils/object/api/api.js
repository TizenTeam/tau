var data = ej.utils.object;

test("ej.utils.data - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.utils, "object", "ej.utils exists");
	equal(typeof ej.utils.object, "object", "ej.utils.data exists");
	equal(typeof data.copy, "function", "function set");
	equal(typeof data.merge, "function", "function get");
	equal(typeof data.multiMerge, "function", "function remove");
});
