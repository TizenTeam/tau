module("ej.jqm.engine", {});

test ( "contextMenu" , function () {
	var elem1 = document.getElementById("elem1"),
		none = document.getElementById("none"),
		email = document.getElementById("email"),
		url = document.getElementById("url"),
		text = document.getElementById("text"),
		search = document.getElementById("search"),
		tel = document.getElementById("tel"),
		file = document.getElementById("file"),
		textarea = document.getElementById("textarea"),
		result,
		page = document.getElementById("test1");

	result = ej.event.trigger(elem1, "contextmenu");
	equal(result, true, "div element");
	result = ej.event.trigger(none, "contextmenu");
	equal(result, true, "input without defined type has text type");
	result = ej.event.trigger(email, "contextmenu");
	equal(result, true, "input with email type");
	result = ej.event.trigger(url, "contextmenu");
	equal(result, true, "input with url type");
	result = ej.event.trigger(text, "contextmenu");
	equal(result, true, "input with text type");
	result = ej.event.trigger(search, "contextmenu");
	equal(result, true, "input with search type");
	result = ej.event.trigger(tel, "contextmenu");
	equal(result, true, "input with tel type");
	result = ej.event.trigger(file, "contextmenu");
	equal(result, true, "input with file type");
	result = ej.event.trigger(textarea, "contextmenu");
	equal(result, true, "textarea");

	$.mobile.tizen.disableContextMenu(page);

	result = ej.event.trigger(elem1, "contextmenu");
	equal(result, false, "div element");
	result = ej.event.trigger(none, "contextmenu");
	equal(result, true, "input without defined type has text type");
	result = ej.event.trigger(email, "contextmenu");
	equal(result, true, "input with email type");
	result = ej.event.trigger(url, "contextmenu");
	equal(result, true, "input with url type");
	result = ej.event.trigger(text, "contextmenu");
	equal(result, true, "input with text type");
	result = ej.event.trigger(search, "contextmenu");
	equal(result, true, "input with search type");
	result = ej.event.trigger(tel, "contextmenu");
	equal(result, true, "input with tel type");
	result = ej.event.trigger(file, "contextmenu");
	equal(result, false, "input with file type");
	result = ej.event.trigger(textarea, "contextmenu");
	equal(result, true, "textarea");

	$.mobile.tizen.enableContextMenu(page);

	result = ej.event.trigger(elem1, "contextmenu");
	equal(result, true, "div element");
	result = ej.event.trigger(none, "contextmenu");
	equal(result, true, "input without defined type has text type");
	result = ej.event.trigger(email, "contextmenu");
	equal(result, true, "input with email type");
	result = ej.event.trigger(url, "contextmenu");
	equal(result, true, "input with url type");
	result = ej.event.trigger(text, "contextmenu");
	equal(result, true, "input with text type");
	result = ej.event.trigger(search, "contextmenu");
	equal(result, true, "input with search type");
	result = ej.event.trigger(tel, "contextmenu");
	equal(result, true, "input with tel type");
	result = ej.event.trigger(file, "contextmenu");
	equal(result, true, "input with file type");
	result = ej.event.trigger(textarea, "contextmenu");
	equal(result, true, "textarea");

	$.mobile.tizen.disableContextMenu(elem1);
	result = ej.event.trigger(elem1, "contextmenu");
	equal(result, false, "div element");
	result = ej.event.trigger(file, "contextmenu");
	equal(result, true, "input with file type");

	$.mobile.tizen.enableContextMenu(elem1);
	result = ej.event.trigger(elem1, "contextmenu");
	equal(result, true, "div element");
	result = ej.event.trigger(file, "contextmenu");
	equal(result, true, "input with file type");

	$.mobile.tizen.disableContextMenu(tel);
	result = ej.event.trigger(tel, "contextmenu");
	equal(result, true, "input with tel type");

	$.mobile.tizen.disableContextMenu("input");
	result = ej.event.trigger(elem1, "contextmenu");
	equal(result, true, "div element");
	result = ej.event.trigger(file, "contextmenu");
	equal(result, false, "input with file type");
});
