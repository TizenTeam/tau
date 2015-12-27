(function(tau) {
	var page = document.getElementById("grid-page"),
		element = document.getElementById("grid"),
		grid;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function() {
		grid = tau.widget.Grid(element);
	});

	/**
	 * pagebeforehide event handler
	 * Destroys widget
	 */
	page.addEventListener("pagebeforehide", function() {
		grid.destroy();
	});
}(window.tau));