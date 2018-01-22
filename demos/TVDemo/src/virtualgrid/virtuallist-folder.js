(function() {
	var page = document.getElementById("page-vlist-folder"),
		vlist;

	tau.event.one(page, "pageshow", function() {
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
				elListItem.innerHTML = '<a class="ui-button grid-thumbnail"> <div class="grid-thumbnail-pic"><img class="grid-thumbnail-pic-img" src="' + data.FOLDER + '"  /></div><div class="grid-thumbnail-contents"><span class="grid-thumbnail-content">' + data.TITLE + '</span><span class="grid-thumbnail-subtext">' + data.FILE_NB + '</span></div></a>'
			});
			// Draw child elements
			vlist.draw();
			tau.engine.createWidgets(elList);
		}
	});
	tau.event.one(page, "pagehide", function() {
		// Remove all children in the vlist
		if (vlist) {
			vlist.destroy();
		}
	});
}());
