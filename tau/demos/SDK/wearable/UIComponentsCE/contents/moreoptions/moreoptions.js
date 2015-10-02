/*global tau */
/*jslint unparam: true */
(function(){
	var page = document.querySelector("#moreoptionsPage"),
		popup = page.querySelector("#moreoptionsPopup"),
		popupCircle = page.querySelector("#moreoptionsPopupCircle"),
		handler = page.querySelector(".ui-more"),
		drawer = page.querySelector("#moreoptionsDrawer"),
		selector = page.querySelector("#selector"),
		selectorComponent,
		clickHandlerBound;

	function clickHandler(event) {
		if (tau.support.shape.circle) {
			tau.openPopup(popupCircle);
			selectorComponent = tau.engine.instanceWidget(selector, "Selector");
			selectorComponent.enable();
		} else {
			tau.openPopup(popup);
		}
	}
	page.addEventListener( "pagebeforeshow", function() {
		clickHandlerBound = clickHandler.bind(null);
		handler.addEventListener("click", clickHandlerBound);
	});
	page.addEventListener( "pagebeforehide", function() {
		handler.removeEventListener("click", clickHandlerBound);
	});
	/*
	 * When user click the indicator of Selector, drawer will close.
	 */
	selector.addEventListener("click", function(event) {
		var target = event.target,
			drawerComponent = tau.widget.Drawer(drawer);

		if (tau.support.shape.circle) {
			// 'ui-selector-indicator' is default indicator class name of Selector component
			if (target.classList.contains("ui-selector-indicator")) {
				drawerComponent.close();
			}
		}
	});
}());
