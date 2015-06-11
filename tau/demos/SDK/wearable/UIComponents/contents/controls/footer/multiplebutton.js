/*global tau */
(function(){
	var page = document.querySelector("#bottomButtonWithMorePage"),
		drawer = page.querySelector("#moreoptionsDrawer"),
		helper;

	page.addEventListener( "pagebeforeshow", function() {
		if (tau.support.shape.circle) {
			helper = tau.helper.DrawerMoreStyle.create(drawer, {
				handler: ".drawer-handler"
			});
		}
	});

	page.addEventListener( "pagebehide", function() {
		if (tau.support.shape.circle) {
			helper.destroy();
		}
	});
}());
