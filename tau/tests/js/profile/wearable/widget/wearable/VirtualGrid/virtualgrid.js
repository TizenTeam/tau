(function() {
	var page = document.getElementById("pageTestVirtualGrid");
	page.addEventListener("pageshow", function() {
		var elGrid = document.getElementById("vgrid1"),
			config = {
				//Declare total number of items
				dataLength: JSON_DATA.length,
				//Set buffer size
				bufferSize: 30
			},
			vGrid = tau.widget.VirtualGrid(elGrid, config);
	
		// Update listitem
		vGrid.setListItemUpdater(function(elItem, newIndex) {
			//TODO: Update listitem here
			var data =  JSON_DATA[newIndex];
			elItem.innerHTML = '<div class="ui-demo-rotation-namecard">' +
			'<div class="ui-demo-namecard-pic">' +
			'<img class="ui-demo-namecard-pic-img" /> '+
			'</div>' +
			'<div class="ui-demo-namecard-contents">' +
			'<span class="name ui-li-text-main">' + data.NAME + '</span>' +
			'</div>' +
			'</div>';
		});
		// Draw child elements
		vGrid.draw();
	});
	page.addEventListener("pagehide", function() {
		// Remove all children in the vGrid
		vGrid.destroy();
	});
}());
