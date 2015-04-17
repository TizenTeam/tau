(function(tau) {
	var page,
		pageWidget,
		enablePageScroll,
		elScroller,
		list,
		listHelper = [],
		snapList = [],
		i, len;

	if (tau.support.shape.circle) {
		document.addEventListener("pagebeforeshow", function (e) {
			page = e.target;

			pageWidget = tau.widget.page(page);
			enablePageScroll = pageWidget.option("enablePageScroll");
			elScroller = page.querySelector(".ui-scroller");
			list = page.querySelectorAll(".ui-listview");

			if (page.id !== "pageMarqueeList" && page.id !== "pageTestVirtualList") {
				len = list.length;
				for (i = 0; i < len; i++) {
					listHelper[i] = tau.helper.SnapListStyle.create(list[i], {animate: "scale"});
				}
			}
			if (elScroller) {
				elScroller.setAttribute("tizen-circular-scrollbar", "");
			}
		});

		document.addEventListener("pagebeforehide", function (e) {
			len = listHelper.length;
			if (len) {
				for (i = 0; i < len; i++) {
					listHelper[i].destroy();
				}
				listHelper = [];
			}
			if (elScroller) {
				elScroller.removeAttribute("tizen-circular-scrollbar");
			}
		});
	}
}(tau));
