/*global JSON_DATA*/
(function(tau) {
	"use strict";

	var page = document.getElementById("page-vlist-icon-1line"),
		tauEvent = tau.event,
		vlist;

	tauEvent.one(document, "pageshow", function() {
		var elList = document.getElementById("vlist-icon-1line");
		if (elList) {
			vlist = tau.widget.VirtualGrid(elList);
			vlist.option({
				dataLength: JSON_DATA.length,
				bufferSize: 40
			});

			// Update listitem
			vlist.setListItemUpdater(function (elListItem, newIndex) {
				var data = JSON_DATA[newIndex];
				elListItem.innerHTML =
					'<a class="ui-button grid-icon"' +
							(data.DISABLED ? 'disabled="disabled" ' : '') +
							'data-icon="' + data.ICON + '" data-iconpos="top" data-role="button">' +
						data.TITLE +
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
