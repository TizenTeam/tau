/* global window: false */
(function (window, tau) {
	'use strict';

	var page = null,
		elScroller = document.querySelector(".ui-content"),
		SCROLL_STEP = 50,
		scrollTo = window._animScrollTo;

	function onRotary(ev) {
		var direction = (ev.detail && ev.detail.direction === "CW") ? 1 : -1;

		// scroll element content with animation
		scrollTo(elScroller, direction * SCROLL_STEP, 150);
	}

	if (tau.support.shape.circle) {
		document.addEventListener("pagebeforeshow", function (e) {

			page = e.target;
			elScroller = page.querySelector(".ui-scroller");
			elScroller.setAttribute("tizen-circular-scrollbar", "");
			document.addEventListener("rotarydetent", onRotary, true);
		});

		document.addEventListener("pagebeforehide", function () {
			if (elScroller) {
				elScroller.removeAttribute("tizen-circular-scrollbar");
			}
			document.removeEventListener("rotarydetent", onRotary, true);
		});
	}
}(window, window.tau));
