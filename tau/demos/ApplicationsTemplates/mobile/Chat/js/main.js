( function () {
	// bind to tizenhwkey event
	window.addEventListener( "tizenhwkey", function( ev ) {
		// check for back key press
		if( ev.keyName === "back" ) {
			var activePopup = document.querySelector( ".ui-popup-active" ),
				page = document.getElementsByClassName( "ui-page-active" )[0],
				pageid = page ? page.id : "";

			// if we are on the first page and ther is no active popup in focus
			if( pageid === "one" && !activePopup ) {
				try {
					// exit the application
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	} );
} () );
