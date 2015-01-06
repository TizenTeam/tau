test ( "ExpandableFooter", function() {
	var footerElement = document.querySelector(".ui-footer");

	ok(footerElement.classList.contains("ui-expandable-footer"));
});