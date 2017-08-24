/* global tau */
(function () {
	var page = document.getElementById("grid-2lines-rectangle-horizontal-page"),
		element = document.getElementById("grid-2lines-rectangle-horizontal"),
		grid;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		grid = tau.widget.Grid(element);
	});

	/**
	 * pagebeforehide event handler
	 * Destroys widget
	 */
	page.addEventListener("pagebeforehide", function () {
		grid.destroy();
	});
}());