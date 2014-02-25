(function() {
	var page = document.getElementById("pageTestVirtualList");
	page.addEventListener("pageshow", function() {
		var elList = document.getElementById("vlist1"),
			config = {
				//Declare total number of items
				dataLength: JSON_DATA.length,
				//Set buffer size
				bufferSize: 100
			},
			vList = gear.ui.VirtualListview(elList, config);
	
		// Update listitem
		vList.setListItemUpdater(function(elListItem, newIndex) {
			//TODO: Update listitem here
			var data =  JSON_DATA[newIndex];
			elListItem.classList.add('ui-li-1line-bigicon5');
			elListItem.innerHTML = '<img src="' + data.TEAM_LOGO+'" alt="icon" class="ui-li-bigicon">' +
				'<span class="ui-li-text-main">' + data.NAME+'</span>' +
				'<div data-role="button" data-inline="true" data-icon="plus" data-style="box"></div>';
		});
		// Draw child elements
		vList.draw();
	});
	page.addEventListener("pagehide", function() {
		// Remove all children in the vGrid
		vGrid.destroy();
	});
}());
