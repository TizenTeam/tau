(function() {
	var page = document.getElementById( "first" ),
		vele = document.getElementById( "vscroller" ),
		hele = document.getElementById( "hscroller" ),
		hscroller, vscroller;

	page.addEventListener( "pageshow", function() {
		// make SectionChanger object
		if ( vele ) {
			vscroller = new tau.widget.Scroller(vele, {
				scrollbar: "tab"
			});
		}
	});

	page.addEventListener( "pagehide", function() {
		// release object
		if ( vscroller ) {
			vscroller.destroy();
			vscroller = null;
		}

		if ( hscroller ) {
			hscroller.destroy();
			hscroller = null;
		}
	});
})();
