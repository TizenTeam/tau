/*global tau */
(function(){
	var page = document.querySelector("#bottomButtonWithMorePage"),
		handler = page.querySelector(".popup-handler"),
		popup = page.querySelector("#moreButtonPopup"),
		elSelector = page.querySelector("#selector"),
		selector,
		clickHandlerBound;

	function clickHandler() {
		tau.openPopup(popup);
	}

	page.addEventListener( "pagebeforeshow", function() {
		var radius = window.innerHeight / 2 * 0.8;

		clickHandlerBound = clickHandler.bind(null);
		if (tau.support.shape.circle) {
			handler.addEventListener("click", clickHandlerBound);
			selector = tau.widget.Selector(elSelector, {itemRadius: radius});
		}
	});

	page.addEventListener( "pagebehide", function() {
		if (tau.support.shape.circle) {
			handler.removeEventListener("click", clickHandlerBound);
			selector.destroy();
		}
	});

	/*
	 * When user click the indicator of Selector, the selector will be closed.
	 */
	elSelector.addEventListener("click", function(event) {
		var target = event.target;

		if (tau.support.shape.circle) {
			// 'ui-selector-indicator' is default indicator class name of Selector component
			if (target.classList.contains("ui-selector-indicator")) {
				tau.closePopup(popup);
			}
		}
	});
}());
