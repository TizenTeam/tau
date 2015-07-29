/*global tau */
/*jslint unparam: true */
(function(){
	var page = document.querySelector("#moreoptionsPage"),
		popup = page.querySelector("#moreoptionsPopup"),
		handler = page.querySelector(".ui-more"),
		drawer = page.querySelector("#moreoptionsDrawer"),
		selector = page.querySelector("#selector"),
		helper,
		clickHandlerBound;

	function clickHandler(event) {
		tau.openPopup(popup);
	}
	page.addEventListener( "pagebeforeshow", function() {

		if (tau.support.shape.circle) {
			helper = tau.helper.DrawerMoreStyle.create(drawer, {
				handler: ".ui-more"
			});
		} else {
			// Shape is square
			clickHandlerBound = clickHandler.bind(null);
			handler.addEventListener("click", clickHandlerBound);
		}

	});
	page.addEventListener( "pagebeforehide", function() {
		if (tau.support.shape.circle) {
			handler.removeEventListener("click", clickHandlerBound);
			helper.destroy();
		}
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
