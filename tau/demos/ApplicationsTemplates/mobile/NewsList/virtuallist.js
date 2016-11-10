(function(tau, news, pageId, listId, templateId, itemClass) {
	'use strict';

	var page = document.getElementById(pageId),
		vlist = null;

	page.addEventListener("pageshow", function() {
		// Get HTML element reference
		var elList = document.getElementById(listId);

		// Initialize VirtualListview widget
		// As a options give the:
		// -length of the entries in data object
		// -number of rows which need to be cached
		// (this is a specially important when data object contains many rows)
		// length of the entries in data file
		vlist = tau.widget.VirtualListview(elList, {
			dataLength: news.length,
			bufferSize: 40
		});
		// Update list items
		// The attached callback is responsible for parsing and inserting HTML elements
		vlist.setListItemUpdater(function (listElement, newIndex) {
			// get data
			var data = news[newIndex],
				// fetch template
				template = document.getElementById(templateId).innerHTML;

			// parse template and apply values from fields
			template = template.replace(/\$\{([\w]+)\}/ig, function (pattern, field) {
				return data[field];
			});

			// update cell html with template
			listElement.innerHTML = template;
			// apply css classes for element
			if (Array.isArray(itemClass)) {
				itemClass.forEach(function(value) {
					listElement.classList.add(value);
				});
			} else {
				listElement.classList.add(itemClass);
			}
		});

		// Draw child elements
		vlist.draw();
	});

	// cleanup widget in order to avoid memory leak
	tau.event.one(page, "pagehide", function () {
		// Remove all children in the vlist
		vlist.destroy();
	});
}(window.tau, window.JSON_DATA, window.pageId, window.listId, window.templateId, window.itemClass));
