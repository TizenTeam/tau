/*global tau, JSON_DATA */
(function () {
	var page = document.getElementById("vlist-input-page"),
		vlist;

	page.addEventListener("pagebeforeshow", function () {
		var elList = document.getElementById("vlist-input");

		vlist = tau.widget.VirtualListviewSimple(elList, {
			dataLength: JSON_DATA.length
		});

		// Update listitem
		vlist.setListItemUpdater(function (elListItem, newIndex) {
			//TODO: Update listitem here
			var data = JSON_DATA[newIndex];
			elListItem.classList.add('ui-li-anchor');
			elListItem.innerHTML = '<input type="text" value="[' + newIndex + '] ' + data.NAME + '" />';
		});
	});
	page.addEventListener("pagehide", function () {
		// Remove all children in the vlist
		vlist.destroy();
	});

}());
