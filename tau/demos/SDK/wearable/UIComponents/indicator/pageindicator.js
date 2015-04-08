(function() {

var self = this,
	page = document.getElementById("pageIndicatorPage"),
	changer = document.getElementById("hsectionchanger"),
	sections = document.querySelectorAll("section"),
	sectionChanger,
	elPageIndicator = document.getElementById("pageIndicator"),
	pageIndicator,
	pageIndicatorHandler;

page.addEventListener( "pagebeforeshow", function() {
	// make PageIndicator
	pageIndicator =  tau.widget.PageIndicator(elPageIndicator, { numberOfPages: sections.length });
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

})();
