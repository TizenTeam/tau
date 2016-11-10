(function () {
	'use strict';

	window.addEventListener( 'tizenhwkey', function( ev ) {
		if( ev.keyName === "back" ) {
			var page = document.getElementsByClassName( 'ui-page-active' )[0],
				pageid = page ? page.id : "";

			if( pageid === "settingsPage" ) {
				/* eslint-disable no-empty */
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {}
				/* eslint-enable */
			} else {
				window.history.back();
			}
		}
	} );
} () );
