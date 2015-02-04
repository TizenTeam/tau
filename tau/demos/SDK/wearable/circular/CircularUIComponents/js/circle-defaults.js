(function(tau) {
	var page,
		pageWidget,
		enablePageScroll,
		list,
		listHelper,
		header,
		headerHelper;

	if (tau.support.circle) {
		document.addEventListener("pagebeforeshow", function (e) {
			page = e.target;
			pageWidget = tau.widget.page(page);
			enablePageScroll = pageWidget.option("enablePageScroll");
			list = page.querySelector(".ui-listview");
			header = page.querySelector(".ui-header:not(.ui-fixed)");

			if (list) {
				listHelper = tau.helper.ListMarqueeStyle.create(list, {marqueeDelay: 1});
			}

			if (header && enablePageScroll) {
				headerHelper = tau.helper.HeaderMarqueeStyle.create(header, {});
			}
		});

		document.addEventListener("pagebeforehide", function (e) {
			if (list) {
				listHelper.destroy();
			}

			if (header && enablePageScroll) {
				headerHelper.destroy();
			}
		});
	}
}(tau));
