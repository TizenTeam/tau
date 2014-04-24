$().ready(function() {
	module("ej.theme", {});
	test ( "API ej.theme" , function () {
		var element = $('body');
		$.mobile.tizen.enableSelection(element, "text");
		equal(element[0].style.webkitUserSelect, 'text', 'ej.theme.enableSelection(element, "text")');
		$.mobile.tizen.enableSelection(element, "none");
		equal(element[0].style.webkitUserSelect, 'none', 'ej.theme.enableSelection(element, "none")');
		$.mobile.tizen.enableSelection(element, "auto");
		equal(element[0].style.webkitUserSelect, 'auto', 'ej.theme.enableSelection(element, "auto")');
	});
});