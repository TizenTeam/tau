/* global tau */
(function () {
	var page = document.getElementById("101-rotary-selector-with-icon-and-text-page-ce"),
		selector = document.getElementById("101-rotary-selector-with-icon-and-text-selector-ce"),
		selectorComponent;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		selectorComponent = tau.widget.Selector(selector);
		selectorComponent._changeLayer(1);
		selectorComponent.changeItem(13);
	});

	/**
	 * pagebeforehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagebeforehide", function () {
		selectorComponent.destroy();
	});
}());