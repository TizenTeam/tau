(function (tau) {
	var page = document.getElementById("page-empty-state-search"),
		search = document.getElementById("search-input"),
		list = document.getElementById("searchList"),
		listItems = list.querySelectorAll("[data-filtertext]"),
		emptyStateStyle = document.querySelector(".ui-empty-state-content").style,
		listItemsArray = [].slice.call(listItems),
		searchHandlerBound,
		searchClearBound;

	function updateEmptyState() {
		var itemsCount = list.querySelectorAll("li").length;

		// show empty state if no results found
		if (itemsCount > 0 &&
			list.querySelectorAll(".li-search-hidden").length === itemsCount) {
			emptyStateStyle.display = null;
		} else {
			emptyStateStyle.display = "none";
		}
	}

	/**
	 * Shows items that match the entered value
	 * keyup event handler
	 */
	function searchHandler() {
		listItemsArray.forEach(function (item) {
			var itemText = item.getAttribute("data-filtertext");

			if (itemText.toString().toLowerCase().indexOf(search.value.toLowerCase()) === -1) {
				item.classList.add("li-search-hidden");
			} else {
				item.classList.remove("li-search-hidden");
			}
		});

		updateEmptyState();
	}

	/**
	 * Initializes search result
	 */
	function searchClear() {
		if (search.value === "") {
			listItemsArray.forEach(function (item) {
				item.classList.remove("li-search-hidden");
			});
		}

		updateEmptyState();
	}

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		searchHandlerBound = searchHandler.bind(this);
		searchClearBound = searchClear.bind(this);
		search.addEventListener("keyup", searchHandlerBound, false);
		search.addEventListener("search", searchClearBound, false);
	});

	page.addEventListener("pageshow", function () {
		tau.event.trigger(search, "keyup");
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function () {
		search.removeEventListener("keyup", searchHandlerBound, false);
		search.removeEventListener("search", searchClearBound, false);
	});

}(window.tau));
