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
				handler: ".drawer-handler"
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
}());
