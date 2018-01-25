(function() {
	var page = document.getElementById("page-vlist-1line-btn"),
		vlist;

	tau.event.one(page, "pageshow", function() {
		var elList = document.getElementById("vlist-1line-btn");
		if (elList) {
			vlist = tau.widget.VirtualGrid(elList);
			vlist.option({
				dataLength: JSON_DATA.length,
				bufferSize: 40
			});

			// Update listitem
			vlist.setListItemUpdater(function (elListItem, newIndex, rowCount) {
				//TODO: Update listitem here
				var data = JSON_DATA[newIndex],
					dataFocusRight = "",
					dataFocusLeft = "",
					btnSelector = "a.ui-btn";

				if (newIndex === 0) {
					dataFocusLeft = 'data-focus-left="::virtualgrid(' + (JSON_DATA.length - 1) +') ' + btnSelector + '" ';
				} else if (newIndex % rowCount === 0) {
					dataFocusLeft = 'data-focus-left="::virtualgrid(' + (newIndex - 1) + ') ' + btnSelector + '" ';
				}

				if (newIndex === JSON_DATA.length - 1) {
					dataFocusRight = 'data-focus-right="::virtualgrid(0) ' + btnSelector + '" ';
				} else if (newIndex % rowCount === 4) {
					dataFocusRight = 'data-focus-right="::virtualgrid(' + (newIndex + 1) + ') ' + btnSelector + '" ';
				}

				elListItem.innerHTML =
					'<a '+
						'class="ui-button grid-thumbnail grid-icon" ' +
						'data-icon="play-movie" ' +
						'data-role="button" ' +
						dataFocusLeft +
						dataFocusRight +
						'>' +
						'<div class="grid-thumbnail-info">' +
							data.TIME +
						'</div>' +
						'<div class="grid-thumbnail-pic-full">' +
							'<img class="grid-thumbnail-pic-img" src="' + data.TEAM_LOGO + '" />' +
						'</div>' +
						'<div class="grid-thumbnail-contents">' +
							'<span class="grid-thumbnail-content">' +
							data.NAME +
							'</span>' +
						'</div>' +
					'</a>';
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
