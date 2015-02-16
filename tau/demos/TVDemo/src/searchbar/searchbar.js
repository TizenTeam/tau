var page = document.getElementById(pageId),
	searchBar = document.getElementById(searchBarId);

function hideElementsCallback(event) {
	var lis = page.querySelectorAll("li"),
		regEx = new RegExp(".*" + searchBar.value.toLowerCase());
	[].forEach.call(lis, function(li) {
		if (li.textContent.toLowerCase().match(regEx)) {
			li.style.display = "block";
		} else {
			li.style.display = "none";
		}
	});
}

searchBar.addEventListener("keyup", hideElementsCallback);
