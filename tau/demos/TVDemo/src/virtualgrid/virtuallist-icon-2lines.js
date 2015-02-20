/*global JSON_DATA*/
(function(tau) {
	"use strict";

	var page = document.getElementById("page-vlist-icon-2lines"),
		tauEvent = tau.event,
		vlist;

	tauEvent.one(document, "pageshow", function() {
		var elList = document.getElementById("vlist-icon-2lines");
		if (elList) {
			vlist = tau.widget.VirtualGrid(elList);
			// Options Must be set in separate call
			vlist.option({
				dataLength: JSON_DATA.length,
				bufferSize: 40
			});

			// Update listitem
			vlist.setListItemUpdater(function (elListItem, newIndex) {
				var data = JSON_DATA[newIndex];
				elListItem.innerHTML = '<div class="ui-button grid-thumbnail-icon-2lines"> ' +
					'<div class="grid-thumbnail-icon-2lines-pic">' +
						'<img class="grid-thumbnail-icon-2lines-pic-img" src="' + data.ICON + '"  />' +
					'</div>' +
					'<div class="grid-thumbnail-icon-2lines-contents">' +
						'<span class="grid-thumbnail-icon-2lines-1-line">' + data.TITLE + '</span>' +
						'<span class="grid-thumbnail-icon-2lines-2-line">' + data.SUBTITLE + '</span>' +
					'</div>' +
				'</div>';
			});
			// Draw child elements
			vlist.draw();
			tau.engine.createWidgets(elList);
		}
	});

	tauEvent.one(document, "pagehide", function() {
		// Remove all children in the vlist
		if (vlist) {
			vlist.destroy();
		}
	});
}(window.tau));
