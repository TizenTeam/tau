/*global tau */
(function () {
	'use strict';

	var page1 = document.getElementById("one"),
		page2 = document.getElementById("two"),
		getChildren = tau.util.selectors.getChildrenByTag;

	// suport for application exit with hardware back key
	window.addEventListener( "tizenhwkey", function( ev ) {
		if( ev.keyName === "back" ) {
			var activePopup = document.querySelector( ".ui-popup-active" ),
				page = document.getElementsByClassName( "ui-page-active" )[0],
				pageid = page ? page.id : "";

			if( pageid === "one" && !activePopup ) {
				/* eslint-disable no-empty */
				try {
					// exit the application if the user is on the first pageId
					// and there is no active popup
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {}
				/* eslint-enable */
			} else {
				window.history.back();
			}
		}
	} );

	// initialize application
	function init() {
		// get handler for main big image
		var view = page2.querySelector("img");

		// thumbnail click handler
		function onClick(ev) {
			var img = getChildren(ev.target, "img")[0];

			// if thunbnail is found use it src attribute as big image src
			if (img) {
				view.src = img.getAttribute("src");
			}
		}

		// to prevent double firing of events bind on pageshow
		// and unbind on pagehide
		page1.addEventListener("pagebeforeshow", function () {
			page1.addEventListener("vclick", onClick, true);
		});

		page1.addEventListener("pagebeforehide", function () {
			page1.removeEventListener("vclick", onClick, true);
		});
	}

	init();
} () );
