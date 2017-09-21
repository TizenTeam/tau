/* global tau */
(function () {
	var page = document.getElementById("rotary-selector-edit-mode-page"),
		selector = document.getElementById("rotary-selector-edit-mode"),
		selectorComponent;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		selectorComponent = tau.widget.Selector(selector);
		//TODO: Add code for enabling Edit Mode
	});

	/**
	 * pagebeforehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagebeforehide", function () {
		selectorComponent.destroy();
	});
}());