module("ej.jqm.events", {});

test ( "eventBlocker" , function () {
	var elem1 = document.getElementById("elem1"),
		elem2 = document.getElementById("elem2"),
		page = ej.engine.getBinding("test1");

	elem1.addEventListener("vclick", function () {elem1.classList.add("clicked");});
	elem2.addEventListener("vclick", function () {elem2.classList.add("clicked");});

	ej.utils.events.trigger(elem1, "vclick");
	ok(elem1.classList.contains("clicked"), "vclick event was triggered");

	$.mobile.addEventBlocker();

	ej.utils.events.trigger(elem2, "vclick");
	ok(!elem2.classList.contains("clicked"), "vclick event wasn't triggered after adding blocker");

	$.mobile.removeEventBlocker();

	ej.utils.events.trigger(elem2, "vclick");
	ok(elem2.classList.contains("clicked"), "vclick event was triggered after removing blocker");
});
