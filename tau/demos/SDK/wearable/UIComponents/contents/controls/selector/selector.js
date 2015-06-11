(function() {
	var page = document.getElementById("selectorPage"),
		selector = document.getElementById("selector");

	page.addEventListener("pagebeforeshow", function() {
		tau.widget.Selector(selector);
	});
})();