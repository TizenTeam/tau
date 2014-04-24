module("ej.theme", {});

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

	result = ej.utils.events.trigger(elem1, "contextmenu");
	equal(result, true, "div element");
	result = ej.utils.events.trigger(none, "contextmenu");
	equal(result, true, "input without defined type has text type");
	result = ej.utils.events.trigger(email, "contextmenu");
	equal(result, true, "input with email type");
	result = ej.utils.events.trigger(url, "contextmenu");
	equal(result, true, "input with url type");
	result = ej.utils.events.trigger(text, "contextmenu");
	equal(result, true, "input with text type");
	result = ej.utils.events.trigger(search, "contextmenu");
	equal(result, true, "input with search type");
	result = ej.utils.events.trigger(tel, "contextmenu");
	equal(result, true, "input with tel type");
	result = ej.utils.events.trigger(file, "contextmenu");
	equal(result, true, "input with file type");
	result = ej.utils.events.trigger(textarea, "contextmenu");
	equal(result, true, "textarea");

	ej.theme.disableContextMenu(page);

	result = ej.utils.events.trigger(elem1, "contextmenu");
	equal(result, false, "div element");
	result = ej.utils.events.trigger(none, "contextmenu");
	equal(result, true, "input without defined type has text type");
	result = ej.utils.events.trigger(email, "contextmenu");
	equal(result, true, "input with email type");
	result = ej.utils.events.trigger(url, "contextmenu");
	equal(result, true, "input with url type");
	result = ej.utils.events.trigger(text, "contextmenu");
	equal(result, true, "input with text type");
	result = ej.utils.events.trigger(search, "contextmenu");
	equal(result, true, "input with search type");
	result = ej.utils.events.trigger(tel, "contextmenu");
	equal(result, true, "input with tel type");
	result = ej.utils.events.trigger(file, "contextmenu");
	equal(result, false, "input with file type");
	result = ej.utils.events.trigger(textarea, "contextmenu");
	equal(result, true, "textarea");

	ej.theme.enableContextMenu(page);
	equal(result, true, "div element");
	result = ej.utils.events.trigger(none, "contextmenu");
	equal(result, true, "input without defined type has text type");
	result = ej.utils.events.trigger(email, "contextmenu");
	equal(result, true, "input with email type");
	result = ej.utils.events.trigger(url, "contextmenu");
	equal(result, true, "input with url type");
	result = ej.utils.events.trigger(text, "contextmenu");
	equal(result, true, "input with text type");
	result = ej.utils.events.trigger(search, "contextmenu");
	equal(result, true, "input with search type");
	result = ej.utils.events.trigger(tel, "contextmenu");
	equal(result, true, "input with tel type");
	result = ej.utils.events.trigger(file, "contextmenu");
	equal(result, true, "input with file type");
	result = ej.utils.events.trigger(textarea, "contextmenu");
	equal(result, true, "textarea");

	ej.theme.disableContextMenu(elem1);
	result = ej.utils.events.trigger(elem1, "contextmenu");
	equal(result, false, "div element");
	result = ej.utils.events.trigger(file, "contextmenu");
	equal(result, true, "input with file type");

	ej.theme.enableContextMenu(elem1);
	result = ej.utils.events.trigger(elem1, "contextmenu");
	equal(result, true, "div element");
	result = ej.utils.events.trigger(file, "contextmenu");
	equal(result, true, "input with file type");

	ej.theme.disableContextMenu(tel);
	result = ej.utils.events.trigger(tel, "contextmenu");
	equal(result, true, "input with tel type");

});
