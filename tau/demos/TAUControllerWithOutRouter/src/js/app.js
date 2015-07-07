/* global tau, movieList, tizen */
(function () {
	"use strict";
	var mainPage = document.getElementById("main"),
		detailsPage = document.getElementById("details");

	window.addEventListener("tizenhwkey", function (event) {
		if (event.keyName === "back") {
			if (!mainPage.classList.contains("hidden")) {
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

		controller.addRoute("main", function (deferred) {
			var listTag = document.getElementById("list"),
				length = movieList.length,
				liTag,
				linkTag,
				i;

			// clear list
			listTag.innerHTML = "";

			// fill list
			for (i = 0; i < length; i++) {
				liTag = document.createElement("LI");
				linkTag = document.createElement("A");
				linkTag.href = "#details/" + i;
				linkTag.textContent = movieList[i].name;
				liTag.appendChild(linkTag);
				listTag.appendChild(liTag);
			}

			// show page
			mainPage.classList.remove("hidden");

			// hide details page
			detailsPage.classList.add("hidden");

			// inform controller that everything is ok
			deferred.resolve(mainPage);
		});

		controller.addRoute("details/:id", function (deferred, id) {
			var movieData = movieList[id];

			// fill content
			detailsPage.querySelector("div").textContent = "Movie \"" + movieData.name + "\" was produced in " + movieData.year + ".";

			// hide main page
			mainPage.classList.add("hidden");

			// show detaild page
			detailsPage.classList.remove("hidden");


			// inform controller that everything is ok
			deferred.resolve(detailsPage);
		});

		//controller.open("main");
	});
}());
