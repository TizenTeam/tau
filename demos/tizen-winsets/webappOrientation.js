function onSuccessCallback ( ori ) {
	console.log( ori.status );
	if ( ori.status === "PORTRAIT_PRIMARY" ) {
		window.screen.lockOrientation( "portrait-primary" );
	}
	else if ( ori.status === "PORTRAIT_SECONDARY" ) {
		window.screen.lockOrientation( "portrait-secondary" );
	}
	else if ( ori.status === "LANDSCAPE_PRIMARY" ) {
		window.screen.lockOrientation( "landscape-primary" );
	}
	else if ( ori.status === "LANDSCAPE_SECONDARY" ) {
		window.screen.lockOrientation( "landscape-secondary" );
	}
}
function onErrorCallback ( error ) {
	console.log( "An error occurred " + error.message );
}

try {
	if ( $.tizen.__tizen__.util.isMobileBrowser() ) {
		tizen.systeminfo.addPropertyValueChangeListener( "DEVICE_ORIENTATION", onSuccessCallback, onErrorCallback );
	}
} catch ( exc ) {
	alert( exc.message );
}

