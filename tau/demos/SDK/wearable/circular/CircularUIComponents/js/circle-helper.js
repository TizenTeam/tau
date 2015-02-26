(function(tau) {
	var page,
		pageWidget,
		enablePageScroll,
		list,
		listHelper,
		header,
		headerHelper;

	if (tau.support.shape.circle) {
		document.addEventListener("pageshow", function (e) {
			page = e.target;

			pageWidget = tau.widget.page(page);
			enablePageScroll = pageWidget.option("enablePageScroll");
			list = page.querySelector(".ui-listview");
			header = page.querySelector(".ui-header:not(.ui-fixed)");

			if (list && page.id !== "pageMarqueeList") {
				listHelper = tau.helper.SnapListStyle.create(list);
				page.setAttribute("tizen-circular-scrollbar", "");
			}

			if (header && enablePageScroll) {
				headerHelper = tau.helper.ExpandableHeaderMarqueeStyle.create(header, {});
			}
		});

		document.addEventListener("pagehide", function (e) {
			if (listHelper) {
				listHelper.destroy();
				listHelper = null;
				page.removeAttribute("tizen-circular-scrollbar");
			}

			if (headerHelper) {
				headerHelper.destroy();
				headerHelper = null;
			}
		});
	}
}(tau));
