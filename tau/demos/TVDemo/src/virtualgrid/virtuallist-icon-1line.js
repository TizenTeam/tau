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
			var data =  JSON_DATA[newIndex];
			elListItem.innerHTML = 	'<a class="grid-icon" data-icon="'+data.ICON+'" data-iconpos="top" data-role="button">'+data.TITLE+'</a>';
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
