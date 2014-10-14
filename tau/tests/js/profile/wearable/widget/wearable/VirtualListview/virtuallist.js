(function() {
	var page = document.getElementById("pageTestVirtualList");
	page.addEventListener("pageshow", function() {
		var listElement = document.getElementById("vlist1"),
			config = {
				//Declare total number of items
				dataLength: JSON_DATA.length,
				//Set buffer size
				bufferSize: 100
			},
			virtualList = tau.widget.VirtualListview(listElement, config);
	
		// Update listitem
		virtualList.setListItemUpdater(function(listElementItem, newIndex) {
			//TODO: Update listitem here
			var data =  JSON_DATA[newIndex];
			listElementItem.classList.add('ui-li-1line-bigicon5');
			listElementItem.innerHTML = '<span class="ui-li-text-main" style="overflow:hidden; white-space:nowrap">' + data.NAME+'</span>' +
				'<div data-role="button" data-inline="true" data-icon="plus" data-style="box"></div>';
		});
		// Draw child elements
		virtualList.draw();
	});
	page.addEventListener("pagehide", function() {
		var listElement = document.getElementById("vlist1"),
			// Remove all children in the vList
			virtualList = tau.widget.VirtualListview(listElement);
		if (virtualList) {
			virtualList.destroy();
		}
	});
}());
