/*global pageId, listId, templateId, itemClass, tau, JSON_DATA */
(function (pageId, listId, templateId, itemClass) {
	var pageElement = document.getElementById(pageId),
		virtualListWidget;

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	pageElement.addEventListener("pageshow", function () {
		/* Get HTML element reference */
		var listElement = document.getElementById(listId),
			bufferSize = 10,
			template = document.getElementById(templateId).innerHTML,
			options = {
				dataLength: JSON_DATA.length,
				bufferSize: bufferSize
			};

		if (pageElement.classList.contains("page-snaplistview")) {
			options.snap = {animate: "scale"};
		}

		virtualListWidget = tau.widget.VirtualListviewSimple(listElement, options);
		/* Update list items */
		virtualListWidget.setListItemUpdater(function (listElement, newIndex) {
			var data = JSON_DATA[newIndex];

			/*jslint unparam: true*/
			listElement.innerHTML = template.replace(/\$\{index\}/ig, newIndex)
				.replace(/\$\{([\w]+)\}/ig, function (pattern, field) {
					return data[field];
				});
			/*jslint unparam: false*/

			if (itemClass.length) {
				itemClass.forEach(function (value) {
					listElement.classList.add(value);
				});
			}
		});

		// Draw child elements
		virtualListWidget.draw();
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	pageElement.addEventListener("pagehide", function () {
		// Remove all children in the vlist
		virtualListWidget.destroy();
	});
}(pageId, listId, templateId, itemClass));