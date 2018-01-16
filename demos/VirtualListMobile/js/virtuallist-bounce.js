/*global tau, JSON_DATA */
(function () {
	"use strict";

	var page = document.getElementById("vlist-bounce-page"),
		vlist;

	page.addEventListener("pagebeforeshow", function () {
		var elList = document.getElementById("vlist-bounce");

		vlist = tau.widget.VirtualListviewSimple(elList, {
			dataLength: 50,
			edgeEffect: function (positionDiff, orientation, edge, rawPosition, widgetInstance) {
				// ...
				// any kind of operations to show edge elements etc goes here
				// ...

				//return 0; // To block bounceBack effect
				return positionDiff; // to bounceBack
				// return any other const values for further effects
			}
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
