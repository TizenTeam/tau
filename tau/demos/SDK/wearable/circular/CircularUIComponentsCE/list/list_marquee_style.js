(function() {
	var page = document.getElementById("pageMarqueeList"),
		listHelper,
		headerCollapseHandler,
		headerExpandHandler;

	page.addEventListener( "pageshow", function() {
		var list = page.querySelector(".ui-listview"),
			snapList;

		if (list) {
			listHelper = tau.helper.SnapListMarqueeStyle.create(list, {
				marqueeDelay: 1000
			});

			snapList = tau.widget.SnapListview(list);
			page.setAttribute("tizen-circular-scrollbar", "");

			headerCollapseHandler = function() {
				snapList.enable();
			};

			headerExpandHandler = function() {
				snapList.disable();
			};

			document.addEventListener("headercollapse", headerCollapseHandler, false);
			document.addEventListener("headerbeforeexpand", headerExpandHandler, false);
		}
	});

	page.addEventListener( "pagehide", function() {
		if (listHelper) {
			listHelper.destroy();
			listHelper = null;
			page.removeAttribute("tizen-circular-scrollbar");

			document.removeEventListener("headercollapse", headerCollapseHandler, false);
			document.removeEventListener("headerbeforeexpand", headerExpandHandler, false);
		}
	});

})();
