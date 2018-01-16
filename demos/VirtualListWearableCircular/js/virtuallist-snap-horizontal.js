/*global tau, JSON_DATA */
(function () {
	var page = document.getElementById("vlist-short-page"),
		vlist;

	page.addEventListener("pagebeforeshow", function () {
		var elList = document.getElementById("vlist-short");

		vlist = tau.widget.VirtualListviewSimple(elList, {
			dataLength: 50,
			orientation: 'horizontal',
			scrollElement: elList.parentNode,
			snap: true
		});

		// Update listitem
		vlist.setListItemUpdater(function (elListItem, newIndex) {
			//TODO: Update listitem here
			var data = JSON_DATA[newIndex];
			elListItem.classList.add('horizontal');
			elListItem.innerHTML = '[' + newIndex + ']<br />' + data.NAME ;
		});
	});
	page.addEventListener("pagehide", function () {
		// Remove all children in the vlist
		vlist.destroy();
	});

}());
