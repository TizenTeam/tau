/*global tau, JSON_DATA */
(function () {
	var page = document.getElementById("vlist-page-events"),
		vlist;

	function scrollHandler(event) {
		var data = event.detail;
		console.log(event.type + " (left:" + data.scrollLeft + ", top: " + data.scrollTop + ", fromAPI: " + data.fromAPI + ")");
	}
	page.addEventListener("pageshow", function () {
		var elList = document.getElementById("vlist-events");

		vlist = tau.widget.VirtualListviewSimple(elList, {
			dataLength: JSON_DATA.length
		});

		// Update listitem
		vlist.setListItemUpdater(function (elListItem, newIndex) {
			//TODO: Update listitem here
			var data = JSON_DATA[newIndex];
			elListItem.classList.add('ui-li-anchor');
			elListItem.innerHTML = '<a><span class="ui-li-text-main"> [' + newIndex + '] ' + data.NAME + '</span></a>';
		});

		// Add custom events
		page.addEventListener("beforeScrollStart", scrollHandler, false);
		page.addEventListener("scrollStart", scrollHandler, false);
		page.addEventListener("scroll", scrollHandler, false);
		page.addEventListener("scrollEnd", scrollHandler, false);
		page.addEventListener("flick", scrollHandler, false);
	});
	page.addEventListener("pagehide", function () {
		// Remove custom events
		page.removeEventListener("beforeScrollStart", scrollHandler, false);
		page.removeEventListener("scrollStart", scrollHandler, false);
		page.removeEventListener("scroll", scrollHandler, false);
		page.removeEventListener("scrollEnd", scrollHandler, false);
		page.removeEventListener("flick", scrollHandler, false);
		// Remove all children in the vlist
		vlist.destroy();
	});

}());
