$().ready(function() {
	module("ej.theme");

	test ( "API ej.theme" , function () {
		var element = document.body;
		ej.theme.enableSelection(element, "text");
		equal(element.style.webkitUserSelect, 'text', 'ej.theme.enableSelection(element, "text")');
		ej.theme.enableSelection(element, "none");
		equal(element.style.webkitUserSelect, 'none', 'ej.theme.enableSelection(element, "none")');
		ej.theme.enableSelection(element, "auto");
		equal(element.style.webkitUserSelect, 'auto', 'ej.theme.enableSelection(element, "auto")');
		ej.theme.enableSelection(element, "wrong");
		equal(element.style.webkitUserSelect, 'auto', 'ej.theme.enableSelection(element, "auto")');
	});
});