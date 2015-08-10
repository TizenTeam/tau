(function(){
	var page = document.querySelector("#bottomButtonWithMorePage"),
		drawer = page.querySelector("#moreoptionsDrawer"),
		handler = page.querySelector(".ui-more");

	page.addEventListener( "pagebeforeshow", function() {
		if (tau.support.shape.circle) {
			tau.helper.DrawerMoreStyle.create(drawer, {
				handler: ".drawer-handler",
			});
		}
	});
})();