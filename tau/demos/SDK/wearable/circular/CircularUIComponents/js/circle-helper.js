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

			if (page.id === "pageMarqueeList") {
				return;
			}

			pageWidget = tau.widget.page(page);
			enablePageScroll = pageWidget.option("enablePageScroll");
			list = page.querySelector(".ui-listview");
			header = page.querySelector(".ui-header:not(.ui-fixed)");

			if (list) {
				listHelper = tau.helper.SnapListStyle.create(list);
			}

			if (header && enablePageScroll) {
				headerHelper = tau.helper.ExpandableHeaderMarqueeStyle.create(header, {});
			}
		});

		document.addEventListener("pagehide", function (e) {
			if (listHelper) {
				listHelper.destroy();
				listHelper = null;
			}

			if (headerHelper) {
				headerHelper.destroy();
				headerHelper = null;
			}
		});
	}
}(tau));
