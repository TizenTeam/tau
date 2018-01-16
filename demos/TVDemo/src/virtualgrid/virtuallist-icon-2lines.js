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
				elListItem.innerHTML =
					'<a class="ui-button grid-icon grid-2-line" data-icon="' + data.ICON +
							'" data-iconpos="top" ' + (data.DISABLED ? ' disabled="disabled"' : '') + '>' +
						'<div class="grid-icon-contents">' +
							'<h3 class="grid-icon-content">' + data.TITLE + '</h3>' +
							'<span class="grid-icon-subtext">' + data.SUBTITLE + '</span>' +
						'</div>' +
					'</a>';
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
