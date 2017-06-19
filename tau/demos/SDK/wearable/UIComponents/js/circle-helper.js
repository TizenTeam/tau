/*global tau */
/*jslint unparam: true */
(function (tau) {
	/**
	 * page - Active page element
	 * list - NodeList object for lists in the page
	 * listHelper - Array for TAU snap list helper instances
	 */
	var page,
		list,
		listHelper = [],
		i,
		len,
		selectedItem,
		listWidget,
		itemStack = [],
		pop = false;

	// This logic works only on circular device.
	if (tau.support.shape.circle) {
		/**
		 * pagebeforeshow event handler
		 * Do preparatory works and adds event listeners
		 */
		document.addEventListener("pagebeforeshow", function (e) {
			page = e.target;
			if (page.id !== "page-snaplistview" && page.id !== "page-swipelist" && page.id !== "page-marquee-list") {
				list = page.querySelector(".ui-listview");
				if (list) {
					listWidget = tau.widget.ArcListview(list);
					if (itemStack && pop) {
						selectedItem = itemStack.pop();
						listWidget._scrollToItem(selectedItem);
						pop = false;
					}
					listHelper.push(listWidget);
				}
			}
		});

		/**
		 * pagebeforehide event handler
		 * Destroys and removes event listeners
		 */
		document.addEventListener("pagebeforehide", function (e) {
			page = e.target;
			if (page.id !== "page-snaplistview" && page.id !== "page-swipelist" && page.id !== "page-marquee-list") {
				list = page.querySelector(".ui-listview");
				if (list && !pop) {
					listWidget = tau.widget.ArcListview(list);
					selectedItem = listWidget._state.currentIndex;
					itemStack.push(selectedItem);
				}
			}
			len = listHelper.length;
			/**
			 * Since the snap list helper attaches rotary event listener,
			 * you must destroy the helper before the page is closed.
			 */
			if (len) {
				for (i = 0; i < len; i++) {
					listHelper[i].destroy();
				}
				listHelper = [];
			}
		});

		window.addEventListener("tizenhwkey", function (e) {
			if (e.keyName === "back") {
				pop = true;
			}
		});
	}
}(tau));
