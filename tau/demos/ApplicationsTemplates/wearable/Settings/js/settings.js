/*jslint unparam: true */
(function(tau){
	'use strict';

	var page = document.getElementById("settingsPage"),
		listHelper = null,
		elScroller = null;

	page.addEventListener("pagebeforeshow", function () {
		var list = null;

		elScroller = page.querySelector(".ui-scroller");
		if (elScroller) {
			list = elScroller.querySelector(".ui-listview");
		}

		if (elScroller && list) {
			listHelper = tau.helper.SnapListStyle.create(list, {animate: "scale"});

			elScroller.setAttribute("tizen-circular-scrollbar", "");
		}
	});

	page.addEventListener("pagebeforehide", function () {
		if (listHelper) {
			listHelper.destroy();

			listHelper = null;

			if (elScroller) {
				elScroller.removeAttribute("tizen-circular-scrollbar");
			}
		}
	});
}(window.tau));
