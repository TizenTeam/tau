/*global tau, JSON_DATA */
(function () {
	var page = document.getElementById("vlist-short-page"),
		vlist;

	page.addEventListener("pagebeforeshow", function () {
		var elList = document.getElementById("vlist-short");

		vlist = tau.widget.VirtualListviewSimple(elList, {
			dataLength: 50
		});

		// Update listitem
		vlist.setListItemUpdater(function (elListItem, newIndex) {
			//TODO: Update listitem here
			var data = JSON_DATA[newIndex];
			elListItem.classList.add('ui-li-anchor');
			elListItem.innerHTML = '<a><span class="ui-li-text-main"> [' + newIndex + '] ' + data.NAME + '</span></a>';
		});
	});
	page.addEventListener("pagehide", function () {
		// Remove all children in the vlist
		vlist.destroy();
	});

}());
