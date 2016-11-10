/*jslint unparam: true */
(function(tau) {
	'use strict';

	var page = null,
		elScroller = null,
		list = null,
		listHelper = [],
		snapList = [],
		i = 0,
		len = 0;

	if (tau.support.shape.circle) {
		document.addEventListener("pagebeforeshow", function (e) {
			page = e.target;
			elScroller = page.querySelector(".ui-scroller");
			if (elScroller) {
				list = elScroller.querySelectorAll(".ui-listview");
				if (list) {
					if (page.id !== "settingsPage") {
						len = list.length;
						for (i = 0; i < len; i++) {
							listHelper[i] = tau.helper.SnapListStyle.create(list[i]);
						}
						len = listHelper.length;
						if (len) {
							for (i = 0; i < len; i++) {
								snapList[i] = listHelper[i].getSnapList();
							}
						}
					}
					elScroller.setAttribute("tizen-circular-scrollbar", "");
				}
			}
		});

		document.addEventListener("pagebeforehide", function () {
			len = listHelper.length;
			if (len) {
				for (i = 0; i < len; i++) {
					listHelper[i].destroy();
				}
				listHelper = [];
			}
			if(elScroller) {
				elScroller.removeAttribute("tizen-circular-scrollbar");
			}
		});
	}
}(window.tau));
