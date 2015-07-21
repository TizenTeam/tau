(function() {
	var page = document.getElementById("textenveloperPage"),
		textEnveloperElement = document.getElementById("textEnveloper"),
		textEnveloper,
		newValueBound;

	function onNewValue(event) {
		textEnveloper.add(event.detail.value);
	}
	page.addEventListener("pagebeforeshow", function() {
		textEnveloper = tau.widget.TextEnveloper(textEnveloperElement);
		newValueBound = onNewValue.bind(this);
		textEnveloperElement.addEventListener("newvalue", newValueBound);
	});

	page.addEventListener("pagehide", function() {
		textEnveloperElement.removeEventListener("newvalue", newValueBound);
	});
})();