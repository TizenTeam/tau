(function() {
	var page = document.getElementById("page-vlist-1line-btn"),
		vlist;

	document.addEventListener("pageshow", function() {
		var elList = document.getElementById("vlist-1line-btn");
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
				elListItem.innerHTML = '<a class="ui-button grid-thumbnail" data-role="button"><div class="grid-thumbnail-info">' + data.TIME +
					'</div><div class="grid-thumbnail-pic-full"><img class="grid-thumbnail-pic-img" src="' + data.TEAM_LOGO +
					'" /></div><div class="grid-thumbnail-contents"><span class="grid-thumbnail-content">' + data.NAME + '</span></div></a>'
			});
			// Draw child elements
			vlist.draw();
			tau.engine.createWidgets(elList);
		}
	});
	document.addEventListener("pagehide", function() {
		// Remove all children in the vlist
		if (vlist) {
			vlist.destroy();
		}
	});
}());
