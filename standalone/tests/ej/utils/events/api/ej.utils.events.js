var events = ej.utils.events;

test("ej.utils.events - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.utils, "object", "ej.utils exists");
	equal(typeof ej.utils.events, "object", "ej.utils.events exists");
	equal(typeof events.trigger, "function", "function set");
	equal(typeof events.stopPropagation, "function", "function get");
	equal(typeof events.stopImmediatePropagation, "function", "function remove");
});
