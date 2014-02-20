(function() {

var page = document.getElementById( "barsectionchangerPage" ),
	changer = document.getElementById( "barsectionchanger" ),
	sectionChanger, idx=1;

page.addEventListener( "pageshow", function() {
	// make SectionChanger object
	sectionChanger = new SectionChanger(changer, {
		circular: false,
		orientation: "horizontal",
		scrollbar: "over"
	});
});

page.addEventListener( "pagehide", function() {
	// release object
	sectionChanger.destroy();
});
})();