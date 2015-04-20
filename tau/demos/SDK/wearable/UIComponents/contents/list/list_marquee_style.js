(function() {
	var page = document.getElementById("pageMarqueeList"),
		elScroller,
		listHelper;

	page.addEventListener( "pagebeforeshow", function() {
		var list = page.querySelector(".ui-listview"),
			snapList;

		if (list) {
			listHelper = tau.helper.SnapListMarqueeStyle.create(list, {
				marqueeDelay: 1000
			});

			snapList = tau.widget.SnapListview(list);
			elScroller = page.querySelector(".ui-scroller");
			if(elScroller) {
				elScroller.setAttribute("tizen-circular-scrollbar", "");
			} else {
				page.setAttribute("tizen-circular-scrollbar", "");
			}
		}
	});

	page.addEventListener( "pagebeforehide", function() {
		if (listHelper) {
			listHelper.destroy();
			listHelper = null;
			if(elScroller) {
				elScroller.removeAttribute("tizen-circular-scrollbar");
			} else {
				page.removeAttribute("tizen-circular-scrollbar");
			}
		}
	});

})();
