/*global tau */
/*jslint unparam: true */
(function(tau) {
	var page,
		list,
		listHelper = [],
		i, len;

	if (tau.support.shape.circle) {
		document.addEventListener("pagebeforeshow", function (e) {
			page = e.target;
			list = page.querySelectorAll(".ui-listview:not(.select-mode-btn-list)");
			if (list) {
				if (page.id !== "pageMarqueeList" && page.id !== "pageTestVirtualList" && page.id !== "pageAnimation") {
					len = list.length;
					for (i = 0; i < len; i++) {
						listHelper[i] = tau.helper.SnapListStyle.create(list[i]);
					}
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
		});
	}
}(tau));
