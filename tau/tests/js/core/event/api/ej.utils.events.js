var events = ej.event;

test("ej.event - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.event, "object", "ej.event exists");
	equal(typeof events.trigger, "function", "function set");
	equal(typeof events.stopPropagation, "function", "function get");
	equal(typeof events.stopImmediatePropagation, "function", "function remove");
});
