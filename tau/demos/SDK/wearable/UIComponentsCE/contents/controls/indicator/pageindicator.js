/*global tau */
(function() {

var page = document.getElementById("pageIndicatorPage") || document.getElementById("pageIndicatorCirclePage"),
	changer = document.getElementById("hsectionchanger"),
	sections = document.querySelectorAll("section"),
	sectionChanger,
	elPageIndicator = document.getElementById("pageIndicator"),
	pageIndicator,
	pageIndicatorHandler;

page.addEventListener( "pagebeforeshow", function() {
	// take existing instance or create new PageIndicator
	pageIndicator =  tau.widget.PageIndicator(elPageIndicator);
	// update number of pages
	pageIndicator.option({numberOfPages: sections.length});
	pageIndicator.setActive(0);
	// make SectionChanger object
	sectionChanger = new tau.widget.SectionChanger(changer, {
		circular: true,
		orientation: "horizontal",
		useBouncingEffect: true
	});
});

page.addEventListener( "pagehide", function() {
	// release object
	sectionChanger.destroy();
	pageIndicator.destroy();
});

pageIndicatorHandler = function (e) {
	pageIndicator.setActive(e.detail.active);
};

changer.addEventListener("sectionchange", pageIndicatorHandler, false);

}());
