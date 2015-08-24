(function(){
	var page = document.querySelector("#moreoptionsPage"),
		popup = page.querySelector("#moreoptionsPopup"),
		drawer = page.querySelector("#moreoptionsDrawer"),
		handler = page.querySelector(".ui-more");

	page.addEventListener( "pagebeforeshow", function() {
		var popupWidget;

		if (tau.support.shape.circle) {
			tau.widget.DrawerMoreStyle(drawer, {
				handler: ".ui-more"
			});
		} else {
			// Shape is square
			popupWidget = tau.widget.Popup(popup);
			tau.event.on(handler, "click", function(e){
				popupWidget.open();
			}, false);
		}
	});
})();


