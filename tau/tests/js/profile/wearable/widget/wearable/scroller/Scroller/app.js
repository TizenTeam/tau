(function() {
	var page = document.getElementById( "first" ),
		vele = document.getElementById( "vscroller" ),
		hele = document.getElementById( "hscroller" ),
		hscroller, vscroller;


	// make SectionChanger object
	if ( vele ) {
		vscroller = new tau.widget.Scroller(vele, {
			scrollbar: "tab"
		});
	}
})();
