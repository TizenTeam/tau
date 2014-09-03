(function() {
	var page = document.getElementById("page-vlist-icon-2lines"),
		vlist;

	document.addEventListener("pageshow", function() {
		var elList = document.getElementById("vlist-icon-2lines");
		if (elList) {
			vlist = tau.widget.VirtualGrid(elList, {
				dataLength: JSON_DATA.length,
				bufferSize: 40
			});

			// Update listitem
			vlist.setListItemUpdater(function (elListItem, newIndex) {
				var data = JSON_DATA[newIndex];
				elListItem.innerHTML = '<div class="grid-thumbnail-icon-2lines"> <div class="grid-thumbnail-icon-2lines-pic"><img class="grid-thumbnail-icon-2lines-pic-img" src="' + data.ICON + '"  /></div><div class="grid-thumbnail-icon-2lines-contents"><span class="grid-thumbnail-icon-2lines-1-line">' + data.TITLE + '</span><span class="grid-thumbnail-icon-2lines-2-line">' + data.SUBTITLE + '</span></div></div>'
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
