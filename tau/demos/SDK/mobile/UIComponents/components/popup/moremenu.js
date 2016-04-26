(function(tau) {
	/**
	 * page - More menu page element
	 * openBtn - Button element for opening a popup
	 * morePopup - More menu popup element
	 * pageShowHandler - pageshow event handler
	 * pageHideHandler - pagehide event handler
	 * menukeyHandler - menu key event handler
	 * openPopup - Function for opening a popup
	 */
	var page = document.getElementById("moremenu-page"),
		openBtn = document.getElementById("open"),
		morePopup = document.getElementById("moremenu"),
		pageShowHandler,
		pageHideHandler,
		menukeyHandler,
		openPopup;

	/**
	 * tizenhwkey event handler
	 */
	menukeyHandler = function (ev) {
		if( ev.keyName === "menu" ) {
			if (morePopup.classList.contains("ui-popup-active")) {
				tau.closePopup();
			} else {
				tau.openPopup("#moremenu");
			}
		}
	};

	/**
	 * Opens more menu popup
	 */
	openPopup = function () {
		tau.openPopup("#moremenu");
	};

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	pageShowHandler = function () {
		window.addEventListener( 'tizenhwkey', menukeyHandler );
		openBtn.addEventListener( 'vclick', openPopup );
	};

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	pageHideHandler = function () {
		window.removeEventListener( 'tizenhwkey', menukeyHandler );
		openBtn.removeEventListener( 'vclick', openPopup );
	};

	page.addEventListener("pageshow", pageShowHandler, false);
	page.addEventListener("pagehide", pageHideHandler, false);
}(window.tau));
