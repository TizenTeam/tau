(function() {

var page = document.getElementById( "tabsectionchangerPage" ),
	changer = document.getElementById( "tabsectionchanger" ),
	sectionChanger;

page.addEventListener( "pageshow", function() {
	// make SectionChanger object
	sectionChanger = new gear.ui.SectionChanger(changer, {
		circular: true,
		orientation: "horizontal",
		scrollbar: "tab"
	});
});

page.addEventListener( "pagehide", function() {
	// release object
	sectionChanger.destroy();
});
})();