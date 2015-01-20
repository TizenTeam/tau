(function() {
	var page = document.getElementById("snaplistTest"),
		list = document.getElementById("snapList"),
		listHelper;

	page.addEventListener( "pageshow", function() {
		listHelper = tau.helper.ListMarqueeStyle.create(list, {marqueeDelay: 1});
	});

	page.addEventListener( "pagehide", function() {
		listHelper.destroy();
	});
}());