(function() {
	var page = document.getElementById("pageTestVirtualList"),
		vlist;

	page.addEventListener("pageshow", function() {
		var elList = document.getElementById("vlist1");

		vlist = tau.widget.VirtualGrid(elList);
		vlist.option({
				dataLength: JSON_DATA.length,
				bufferSize: 40
		});

		// Update listitem
		vlist.setListItemUpdater(function(elListItem, newIndex) {
			//TODO: Update listitem here
			var data =  JSON_DATA[newIndex];
			elListItem.innerHTML = 	'<a class="grid-thumbnail-1-line" data-role="button"> <div class="grid-thumbnail-pic"><img class="grid-thumbnail-pic-img" src="'+data.TEAM_LOGO+'"  /></div><div class="grid-thumbnail-contents"><span class="grid-thumbnail-content">'+data.NAME+'</span></div></a>'
			tau.widget.Button(elListItem.firstElementChild);
		});
		// Draw child elements
		vlist.draw();
	});
	page.addEventListener("pagehide", function() {
		// Remove all children in the vlist
		vlist.destroy();
	});
}());
