(function(tau) {
	var page = document.getElementById("textenveloperPage"),
		textEnveloperElement = document.getElementById("textEnveloper"),
		textEnveloper,
		newValueBound;

	/**
	 * Adds a new item
	 */
	function onNewValue(event) {
		textEnveloper.add(event.detail.value);
	}

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function() {
		textEnveloper = tau.widget.TextEnveloper(textEnveloperElement);
		newValueBound = onNewValue.bind(this);
		textEnveloperElement.addEventListener("newvalue", newValueBound);
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function() {
		textEnveloperElement.removeEventListener("newvalue", newValueBound);
	});
}(window.tau));