/* global tau, movieList, tizen */
(function () {
	"use strict";
	var mainPage = document.getElementById("main"),
		detailsPage = document.getElementById("details");

	window.addEventListener("tizenhwkey", function (event) {
		if (event.keyName === "back") {
			var page = document.getElementsByClassName("show")[0],
				pageId = page ? page.id : "";

			if (pageId === "main") {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});

	document.addEventListener("DOMContentLoaded", function () {
		var controller = tau.Controller.getInstance();

		controller.addRoute("main", function (deferred, id) {
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

			mainPage.classList.remove("hidden");
		});

		controller.addRoute("details/:id", function (deferred, id) {
			var movieData = movieList[id];

			detailsPage.querySelector(".ui-content").textContent = "Movie \"" + movieData.name + "\" was produced in " + movieData.year + ".";
			mainPage.classList.add("hidden");
			detailsPage.classList.remove("hidden");
			deferred.resolve(detailsPage);
		});

		controller.open("main");
	});
}());