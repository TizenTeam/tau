(function() {
	var page = document.getElementById("selectorPage"),
		selector = document.getElementById("selector"),
		selectorComponent,
		clickBound;

	function onClick(event) {
		var activeItem = selector.querySelector(".ui-item-active");
		//console.log(activeItem.getAttribute("data-title"));
	}
	page.addEventListener("pagebeforeshow", function() {
		clickBound = onClick.bind(null);
		selectorComponent = tau.widget.Selector(selector);
		selector.addEventListener("click", clickBound, false);
	});
	page.addEventListener("pagebeforehide", function() {
		selector.removeEventListener("click", clickBound, false);
		selectorComponent.destroy();
	});
})();