(function() {
	var page = document.getElementById("pageMarqueeList"),
		listHelper,
		list;

	page.addEventListener( "pageshow", function() {
		list = page.querySelector(".ui-listview");

		if (list) {
			listHelper = tau.helper.SnapListMarqueeStyle.create(list);
			page.setAttribute("tizen-circular-scrollbar", "");
		}
	});

	page.addEventListener( "pagehide", function() {
		if (listHelper) {
			listHelper.destroy();
			listHelper = null;
			page.removeAttribute("tizen-circular-scrollbar");
		}
	});

})();
