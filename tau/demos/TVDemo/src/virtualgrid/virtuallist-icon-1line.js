(function() {
	var page = document.getElementById("pageTestVirtualList"),
		vlist;

	page.addEventListener("pageshow", function() {
		var elList = document.getElementById("vlist1");

		vlist = tau.widget.VirtualGrid(elList, {
				dataLength: JSON_DATA.length,
				bufferSize: 40
		});

		// Update listitem
		vlist.setListItemUpdater(function(elListItem, newIndex) {
			var data =  JSON_DATA[newIndex];
			elListItem.innerHTML = 	'<div class="grid-thumbnail-icon-1line"> <div class="grid-thumbnail-icon-1line-pic"><img class="grid-thumbnail-icon-1line-pic-img" src="'+data.ICON+'"  /></div><div class="grid-thumbnail-icon-1line-contents"><span class="grid-thumbnail-icon-1line-content">'+data.TITLE+'</span></div></div>'
		});
		// Draw child elements
		vlist.draw();
	});
	page.addEventListener("pagehide", function() {
		// Remove all children in the vlist
		vlist.destroy();
	});
}());
