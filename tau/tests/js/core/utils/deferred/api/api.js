module("API", {});

var deferred = ej.utils.deferred();

test("deferred - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.utils, "object", "ej.utils exists");
	equal(typeof ej.utils.deferred, "function", "ej.utils.callbacks exists");
});
