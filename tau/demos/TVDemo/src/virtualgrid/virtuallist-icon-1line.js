(function() {
	var page = document.getElementById("page-vlist-icon-1line"),
		vlist;

	document.addEventListener("pageshow", function() {
		var elList = document.getElementById("vlist-icon-1line");
		if (elList) {
			vlist = tau.widget.VirtualGrid(elList);
			vlist.option({
				dataLength: JSON_DATA.length,
				bufferSize: 40
			});

			// Update listitem
			vlist.setListItemUpdater(function (elListItem, newIndex) {
				var data = JSON_DATA[newIndex];
				elListItem.innerHTML = '<a class="grid-icon" data-icon="' + data.ICON + '" data-iconpos="top" data-role="button">' + data.TITLE + '</a>';
				tau.widget.Button(elListItem.firstElementChild);
			});
			// Draw child elements
			vlist.draw();
		}
	});
	document.addEventListener("pagehide", function() {
		// Remove all children in the vlist
		if (vlist) {
			vlist.destroy();
		}
	});
}());
