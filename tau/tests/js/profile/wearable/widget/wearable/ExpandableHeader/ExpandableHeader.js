test ( "ExpandableFooter", function() {
	var page = document.querySelector(".ui-page"),
		header = document.querySelector(".ui-header");

	ok(header.classList.contains("ui-expandable-header"), "Header has the ui-expandable-header class");

	tau.widget.ExpandableHeader(header, {
		scrollElement: page
	});

	page.scrollTop = 0;
	ok(header.classList.contains("ui-header-expand"), "Header expanded and has the ui-header-expand class");

});