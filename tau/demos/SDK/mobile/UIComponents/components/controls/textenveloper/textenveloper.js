(function (tau) {
	/**
	 * Find HTML elements connected with page enveloper
	 */
	var page = document.querySelector(".textenveloper-page"),
		textEnveloperElement = page.querySelector('.ui-text-enveloper'),
		textEnveloper = null,
		newValueBound = null;

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
	page.addEventListener("pagebeforeshow", function () {
		textEnveloper = tau.widget.TextEnveloper(textEnveloperElement);
		newValueBound = onNewValue.bind(this);
		textEnveloperElement.addEventListener("newvalue", newValueBound, false);
		// init values in text enveloper
		textEnveloper.add("Sunder Mohan");
		textEnveloper.add("Marry");
		textEnveloper.add("Sunde");
		textEnveloper.add("Joe Peters");
		textEnveloper.add("Ann");
		textEnveloper.add("Park");
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function () {
		textEnveloperElement.removeEventListener("newvalue", newValueBound, false);
	});
}(window.tau));
