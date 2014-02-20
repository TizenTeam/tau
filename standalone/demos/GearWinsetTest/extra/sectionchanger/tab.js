(function() {

var page = document.getElementById( "tabsectionchangerPage" ),
	changer = document.getElementById( "tabsectionchanger" ),
	sectionChanger, idx=1;

page.addEventListener( "pageshow", function() {
	// make SectionChanger object
	sectionChanger = new SectionChanger(changer, {
		circular: true,
		orientation: "horizontal",
		scrollbar: "bar"
	});
});

page.addEventListener( "pagehide", function() {
	// release object
	sectionChanger.destroy();
});
})();