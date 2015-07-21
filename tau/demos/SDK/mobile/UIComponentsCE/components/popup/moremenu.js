(function() {
	var page = document.getElementById("moremenu-page"),
		openBtn = document.getElementById("open"),
		morePopup = document.getElementById("moremenu"),
		pageShowHandler,
		pageHideHandler,
		menukeyHandler,
		openPopup;

	menukeyHandler = function (ev) {
		if( ev.keyName === "menu" ) {
			if (morePopup.classList.contains("ui-popup-active")) {
				tau.closePopup();
			} else {
				tau.openPopup("#moremenu");
			}
		}
	};

	openPopup = function () {
		tau.openPopup("#moremenu");
	};

	pageShowHandler = function () {
		window.addEventListener( 'tizenhwkey', menukeyHandler );
		openBtn.addEventListener( 'vclick', openPopup );
	};

	pageHideHandler = function () {
		window.removeEventListener( 'tizenhwkey', menukeyHandler );
		openBtn.removeEventListener( 'vclick', openPopup );
	};

	page.addEventListener("pageshow", pageShowHandler, false);
	page.addEventListener("pagehide", pageHideHandler, false);
}());
