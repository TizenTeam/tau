(function(tau) {
	var page,
		pageWidget,
		elScroller,
		list,
		listHelper = [],
		snapList = [],
		headerExpandHandler = [],
		headerCollapseHandler = [],
		i, len;

	if (tau.support.shape.circle) {
		document.addEventListener("pagebeforeshow", function (e) {
			page = e.target;

			pageWidget = tau.widget.page(page);
			elScroller = page.querySelector(".ui-scroller");
			if (elScroller) {
				list = elScroller.querySelectorAll(".ui-listview");
				if (list) {
					if (page.id !== "pageMarqueeList" && page.id !== "pageTestVirtualList" && page.id !== "pageAnimation") {
						len = list.length;
						for (i = 0; i < len; i++) {
							listHelper[i] = tau.helper.SnapListStyle.create(list[i]);
						}
						len = listHelper.length;
						if (len) {
							for (i = 0; i < len; i++) {
								snapList[i] = listHelper[i].getSnapList();
								headerCollapseHandler[i] = snapList[i].enable.bind(snapList[i]);
								headerExpandHandler[i] = snapList[i].disable.bind(snapList[i]);
								page.addEventListener("headercollapse", headerCollapseHandler[i], false);
								page.addEventListener("headerbeforeexpand", headerExpandHandler[i], false);
							}
						}
					}
					elScroller.setAttribute("tizen-circular-scrollbar", "");
				}
			}
		});

		document.addEventListener("pagebeforehide", function (e) {
			len = listHelper.length;
			if (len) {
				for (i = 0; i < len; i++) {
					listHelper[i].destroy();
					page.removeEventListener("headercollapse", headerCollapseHandler[i], false);
					page.removeEventListener("headerbeforeexpand", headerExpandHandler[i], false);
				}
				listHelper = [];
			}
			if(elScroller) {
				elScroller.removeAttribute("tizen-circular-scrollbar");
			}
		});
	}
}(tau));
