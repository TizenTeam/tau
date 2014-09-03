(function() {
	var page = document.getElementById("page-vlist-folder"),
		vlist;

	document.addEventListener("pageshow", function() {
		var elList = document.getElementById("vlist-folder");
		if (elList) {
			vlist = tau.widget.VirtualGrid(elList);
			vlist.option({
				dataLength: JSON_DATA.length,
				bufferSize: 40
			});

			// Update listitem
			vlist.setListItemUpdater(function (elListItem, newIndex) {
				//TODO: Update listitem here
				var data = JSON_DATA[newIndex];
				elListItem.innerHTML = '<a class="grid-thumbnail"> <div class="grid-thumbnail-pic"><img class="grid-thumbnail-pic-img" src="' + data.FOLDER + '"  /></div><div class="grid-thumbnail-contents"><span class="grid-thumbnail-content">' + data.TITLE + '</span><span class="grid-thumbnail-subtext">' + data.FILE_NB + '</span></div></a>'
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
