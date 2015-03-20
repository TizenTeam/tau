(function(pageId, listId, templateId, itemClass) {
	var page = document.getElementById(pageId),
		vlist;

	page.addEventListener("pageshow", function() {
		/* Get HTML element reference */
		var elList = document.getElementById(listId);

		vlist = tau.widget.VirtualListview(elList, {
			dataLength: JSON_DATA.length,
			bufferSize: 40
		});
		/* Update list items */
		vlist.setListItemUpdater( function (listElement, newIndex) {
			var data = JSON_DATA[newIndex],
				template = document.getElementById(templateId).innerHTML;

			template = template.replace(/\$\{([\w]+)\}/ig, function (pattern, field) {
				return data[field];
			});

			listElement.innerHTML = template;
			listElement.classList.add(itemClass);
		});

		// Draw child elements
		vlist.draw();
	});

	tau.event.one(page, "pagehide", function () {
		// Remove all children in the vlist
		vlist.destroy();
	});
}(pageId, listId, templateId, itemClass));