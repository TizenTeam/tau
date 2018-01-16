/*global tau, JSON_DATA */
(function () {
	var page = document.getElementById("vlist-snap-scale-page"),
		vlist;

	page.addEventListener("pagebeforeshow", function () {
		var elList = document.getElementById("vlist-snap-scale");

		vlist = tau.widget.VirtualListviewSimple(elList, {
			dataLength: 50,
			snap: {
			    animate: 'scale'
			}
		});

		// Update listitem
		vlist.setListItemUpdater(function (elListItem, newIndex) {
			//TODO: Update listitem here
			var data = JSON_DATA[newIndex];
			elListItem.innerHTML = '<a><span class="ui-li-text-main"> [' + newIndex + '] ' + data.NAME + '</span></a>';
		});
	});
	page.addEventListener("pagehide", function () {
		// Remove all children in the vlist
		vlist.destroy();
	});

}());
