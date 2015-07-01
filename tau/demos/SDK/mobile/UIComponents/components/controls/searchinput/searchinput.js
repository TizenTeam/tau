(function() {
	var page = document.getElementById("searchInputPage"),
		search =  document.getElementById("demo-page-search-input"),
		list = document.getElementById("searchList"),
		listItems = list.querySelectorAll("[data-filtertext]"),
		listItemsArray = [].slice.call(listItems),
		searchHandlerBound,
		searchClearBound;

	function searchHandler() {
		listItemsArray.forEach(function(item){
			var itemText = item.getAttribute("data-filtertext");
			if ( itemText.toString().toLowerCase().indexOf(search.value) === -1 ) {
				item.classList.add("li-search-hidden");
			} else {
				item.classList.remove("li-search-hidden");
			}
		});
	}

	function searchClear() {
		if(search.value === "") {
			listItemsArray.forEach(function(item) {
				item.classList.remove("li-search-hidden");
			});
		}
	}

	page.addEventListener("pagebeforeshow", function() {
		searchHandlerBound = searchHandler.bind(this);
		searchClearBound = searchClear.bind(this);
		search.addEventListener("keyup", searchHandlerBound, false);
		search.addEventListener("search", searchClearBound, false);
	});

	page.addEventListener("pagehide", function() {
		search.removeEventListener("keyup", searchHandlerBound, false);
		search.removeEventListener("search", searchClearBound, false);
	});

})();

