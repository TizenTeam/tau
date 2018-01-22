/*global tau, JSON_DATA */
(function() {
	var page = document.getElementById("infinity"),
		vlist;

	page.addEventListener("pageshow", function() {
		/* Get HTML element reference */
		var elList = document.getElementById("virtuallist-infinity");

		vlist = tau.widget.VirtualListviewSimple(elList, {
			dataLength: 50,
			infinite: true
		});
		/* Update list items */
		vlist.setListItemUpdater( function (listElement, newIndex) {
			var data = JSON_DATA[newIndex];

			listElement.classList.add('ui-li-anchor');
			listElement.innerHTML = '<a><span class="ui-li-text-main"> [' + newIndex + '] ' + data.NAME + '</span></a>';
		});

	});

	page.addEventListener("pagehide", function () {
		// Remove all children in the vlist
		vlist.destroy();
	});
}());
