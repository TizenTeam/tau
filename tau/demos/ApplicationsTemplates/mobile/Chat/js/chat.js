document.addEventListener("DOMContentLoaded", function() {
	"use strict";

	var page = document.getElementById("one"),
		classes = ["ui-li-static", "li-has-multiline"],
		vlist;

	function initVirtuallist(data, listId, templateId, itemClass) {
		// Get HTML element reference
		var elList = document.getElementById(listId);

		// create virtuallist widget
		vlist = tau.widget.VirtualListview(elList, {
			dataLength: data.length,
			bufferSize: 40 // fixed buffer size
		});

		// Update list items
		// The attached callback is responsible for parsing and inserting HTML elements
		vlist.setListItemUpdater( function (listElement, newIndex) {
			var template = document.getElementById(templateId).innerHTML,
				// fetch the data
				dataItem = data[newIndex];

			// replace fields with values from data
			template = template.replace(/\$\{([\w]+)\}/ig, function (pattern, field) {
				return dataItem[field];
			});

			// set proper css class for list item
			listElement.setAttribute("class", (dataItem["FROM"] === "<Me>") ?
				"li-direction-from" : "li-direction-to");

			listElement.innerHTML = template;
			if (itemClass.length) {
				itemClass.forEach(function(value) {
					listElement.classList.add(value);
				});
			} else {
				listElement.classList.add(itemClass);
			}
		});

		// Draw child elements
		vlist.draw();
	}

	page.addEventListener("pageshow", function () {
		// initialize list
		initVirtuallist(JSON_DATA, "virtuallist-chat", "chat-template", classes);
	});

	// cleanup widget in order to avoid memory leak
	tau.event.one(page, "pagehide", function () {
		// Remove all children in the vlist
		vlist.destroy();
	});
});
