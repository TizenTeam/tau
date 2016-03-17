/*global tau */
(function() {

var page = document.getElementById( "circularSectionchangerPage" ),
	changer = document.getElementById( "circularSectionchanger" ),
	sectionLength = document.querySelectorAll("section").length,
	elPageIndicator = document.getElementById("pageIndicator"),
	sectionChanger,
	pageIndicator,
	pageIndicatorHandler;

page.addEventListener( "pagebeforeshow", function() {
	// make PageIndicator
	pageIndicator =  tau.widget.PageIndicator(elPageIndicator, { numberOfPages: sectionLength });
	pageIndicator.setActive(2);
	// make SectionChanger object
	sectionChanger = tau.widget.SectionChanger(changer, {
		circular: true,
		orientation: "horizontal"
	});
});

page.addEventListener( "pagehide", function() {
	// release object
	sectionChanger.destroy();
});

pageIndicatorHandler = function (e) {
	pageIndicator.setActive(e.detail.active);
};

changer.addEventListener("sectionchange", pageIndicatorHandler, false);
}());
