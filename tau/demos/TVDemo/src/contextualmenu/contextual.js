(function() {
	var page = document.getElementById("contextPage"),
		contextWidget;

	page.addEventListener("pageshow", function(ev) {
		var context = document.getElementById("context");
		contextWidget = tau.widget.ContextualMenu(context);
		contextWidget.open();
	}, false);

	function click(event) {
		var inButton = tau.util.selectors.getClosestByTag(event.target, "a");
		if (inButton) {
			setTimeout(function() {
				if (contextWidget.isOpen()) {
					contextWidget.close();
				} else {
					contextWidget.open();
				}
			}, 200);
		}
	}

	page.removeEventListener("vclick", click);
	page.addEventListener("vclick", click);
}());
