(function(tau) {
	var page = document.getElementById( "page-indicator-page" ),
		changer = document.getElementById( "hsectionchanger" ),
		elPageIndicator = document.getElementById("pageIndicator"),
		pageIndicator,
		pageIndicatorHandler;

	page.addEventListener("pageshow", function() {
		pageIndicator =  tau.widget.PageIndicator(elPageIndicator);
		pageIndicator.setActive(0);
	});

	pageIndicatorHandler = function (e) {
		pageIndicator.setActive(e.detail.active);
	};
	changer.addEventListener("sectionchange", pageIndicatorHandler, false);

}(window.tau));
