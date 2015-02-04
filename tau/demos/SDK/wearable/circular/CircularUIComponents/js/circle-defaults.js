(function(tau) {
	var page,
		pageWidget,
		enablePageScroll,
		list,
		listHelper,
		header,
		headerHelper;

	if (tau.support.circle) {
		document.addEventListener("pageshow", function (e) {
			page = e.target;
			pageWidget = tau.widget.page(page);
			enablePageScroll = pageWidget.option("enablePageScroll");
			list = page.querySelector(".ui-listview");
			header = page.querySelector(".ui-header:not(.ui-fixed)");

			if (list) {
				listHelper = tau.helper.SnapListMarqueeStyle.create(list, {marqueeDelay: 1});
			}

			if (header && enablePageScroll) {
				headerHelper = tau.helper.ExpandableHeaderMarqueeStyle.create(header, {});
			}
		});

		document.addEventListener("pagehide", function (e) {
			if (list) {
				listHelper.destroy();
			}

			if (header && enablePageScroll) {
				headerHelper.destroy();
			}
		});
	}
}(tau));
