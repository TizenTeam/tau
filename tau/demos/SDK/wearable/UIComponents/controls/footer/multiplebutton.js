(function(){
	var page = document.querySelector("#bottomButtonWithMorePage"),
		drawer = page.querySelector("#moreoptionsDrawer"),
		viewSwitcherElement = page.querySelector("#viewSwitcher");

	page.addEventListener( "pagebeforeshow", function() {
		if (tau.support.shape.circle) {
			tau.helper.DrawerMoreStyle.create(drawer, {
				handler: ".drawer-handler",
			});
			viewSwitcher = tau.widget.ViewSwitcher(viewSwitcherElement);
		}
	});
})();