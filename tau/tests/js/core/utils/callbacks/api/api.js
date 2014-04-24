module("callbacks", {});

var callbacks = ej.utils.callbacks();

test("ej.utils.callbacks - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.utils, "object", "ej.utils exists");
	equal(typeof ej.utils.callbacks(), "object", "ej.utils.callbacks exists");
	equal(typeof callbacks.add, "function", "function add");
	equal(typeof callbacks.remove, "function", "function remove");
	equal(typeof callbacks.has, "function", "function has");
	equal(typeof callbacks.empty, "function", "function empty");
	equal(typeof callbacks.disable, "function", "function disable");
	equal(typeof callbacks.disabled, "function", "function disabled");
	equal(typeof callbacks.lock, "function", "function lock");
	equal(typeof callbacks.locked, "function", "function locked");
	equal(typeof callbacks.fireWith, "function", "function fireWith");
	equal(typeof callbacks.fire, "function", "function fire");
	equal(typeof callbacks.fired, "function", "function fired");
});
