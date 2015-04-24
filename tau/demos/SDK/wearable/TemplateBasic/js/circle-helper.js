(function(tau) {
	var page,
		pageWidget,
		elScroller,
		headerHelper;

	if (tau.support.shape.circle) {
		document.addEventListener("pagebeforeshow", function (e) {
			page = e.target;
			pageWidget = tau.widget.page(page);
			elScroller = page.querySelector(".ui-scroller");

			if (elScroller) {
				elScroller.setAttribute("tizen-circular-scrollbar", "");
			}

			headerHelper = tau.helper.HeaderMarqueeStyle.create(page, {});
		});

		document.addEventListener("pagebeforehide", function (e) {
			headerHelper.destroy();
			headerHelper = null;

			if(elScroller) {
				elScroller.removeAttribute("tizen-circular-scrollbar");
			}
		});
	}
}(tau));
