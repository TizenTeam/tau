/* global tau, movieList, tizen */
(function () {
	"use strict";
	var mainPage = document.getElementById("main");

	window.addEventListener("tizenhwkey", function (event) {
		if (event.keyName === "back") {
			var activePopup = document.querySelector(".ui-popup-active"),
				page = document.getElementsByClassName("ui-page-active")[0],
				pageId = page ? page.id : "";

			if (pageId === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});

	tau.event.one(mainPage, "pageshow", function () {
		var listTag = document.getElementById("list"),
			length = movieList.length,
			liTag,
			linkTag,
			i;

		for (i = 0; i < length; i++) {
			liTag = document.createElement("LI");
			linkTag = document.createElement("A");
			linkTag.href = "#details/" + i;
			linkTag.textContent = movieList[i].name;
			liTag.appendChild(linkTag);
			listTag.appendChild(liTag);
		}

		tau.widget.Listview(listTag).refresh();

		tau.Controller.getInstance().addRoute("details/:id", function (deferred, id) {
			var pageElement = document.getElementById("details"),
				pageWidget = tau.widget.Page(pageElement),
				movieData = movieList[id];

			pageWidget.option("content", "Movie \"" + movieData.name + "\" was produced in " + movieData.year + ".");
			deferred.resolve(pageElement);
		});
	});
}());