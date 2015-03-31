(function(tau) {
	var page,
		pageWidget,
		enablePageScroll,
		header,
		headerHelper;

	if (tau.support.shape.circle) {
		document.addEventListener("pageshow", function (e) {
			page = e.target;
			pageWidget = tau.widget.page(page);
			enablePageScroll = pageWidget.option("enablePageScroll");
			header = page.querySelector(".ui-header:not(.ui-fixed)");

			if (header && enablePageScroll) {
				headerHelper = tau.helper.ExpandableHeaderMarqueeStyle.create(header, {});
			}
		});

		document.addEventListener("pagehide", function (e) {
			if (header && enablePageScroll) {
				headerHelper.destroy();
			}
		});
	}
}(tau));
