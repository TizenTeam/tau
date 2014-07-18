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
			//TODO: Update listitem here
			var data =  JSON_DATA[newIndex];
			elListItem.innerHTML = 	'<div class="grid-thumbnail-folder"> <div class="grid-thumbnail-folder-pic"><img class="grid-thumbnail-folder-pic-img" src="'+data.FOLDER+'"  /></div><div class="grid-thumbnail-folder-contents"><span class="grid-thumbnail-folder-1-line">'+data.TITLE+'</span><span class="grid-thumbnail-folder-2-line">'+data.FILE_NB+'</span></div></div>'
		});
		// Draw child elements
		vlist.draw();
	});
	page.addEventListener("pagehide", function() {
		// Remove all children in the vlist
		vlist.destroy();
	});
}());
