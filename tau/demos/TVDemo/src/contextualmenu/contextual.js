(function() {
	var page = document.getElementById("contextPage"),
		contextWidget;

	page.addEventListener("pageshow", function(ev) {
		var context = document.getElementById("context");
		contextWidget = tau.widget.ContextualMenu(context);
		contextWidget.open();
	}, false);

	function click(event) {
		if (event.target.tagName === "A" || event.target.tagName === "a") {
			setTimeout(function() {
				if (contextWidget.isOpen()) {
					contextWidget.close();
				} else {
					contextWidget.open();
				}
			}, 200);
		}
	}

	page.removeEventListener("click", click);
	page.addEventListener("click", click);
}());
