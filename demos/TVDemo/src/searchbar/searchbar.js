var page = document.getElementById(pageId),
	searchBar = document.getElementById(searchBarId);

function hideElementsCallback(event) {
	var lis = page.querySelectorAll("li:not(.ui-list-divider)"),
		regEx = new RegExp(".*" + searchBar.value.toLowerCase());
	[].forEach.call(lis, function(li) {
		if (li.textContent.toLowerCase().match(regEx)) {
			li.style.display = "block";
		} else {
			li.style.display = "none";
		}
	});
	[].forEach.call(page.querySelectorAll("ul"), function(ul) {
		var count = 0,
			countSpan = ul.querySelector(".ui-divider-text span");
		[].forEach.call(ul.querySelectorAll("li:not(.ui-list-divider)"), function (li) {
			if (li.style.display !== "none") {
				count++;
			}
		});
		if (countSpan) {
			countSpan.textContent = "(" + count + ")";
		}
	});
}

searchBar.addEventListener("keyup", hideElementsCallback);
