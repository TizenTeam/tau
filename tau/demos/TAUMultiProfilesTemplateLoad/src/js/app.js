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
				movieData = movieList[id],
				listview,
				liTag1,
				liTag2;

			tau.template.render("templates/page-template.html", {'movie': movieData}, function (status, data) {
				if (status.success) {
					pageElement.querySelector(".ui-content").innerHTML = "";

					listview = data.querySelector(".ui-listview");

					liTag1 = document.createElement("LI");
					liTag1.innerText = "Movie \"" + movieData.name;
					liTag2 = document.createElement("LI");
					liTag2.innerText = "was produced in " + movieData.year;
					listview.appendChild(liTag1);
					listview.appendChild(liTag2);

					pageElement.querySelector(".ui-content").appendChild(data);
					tau.widget.Listview(data.id).refresh();
					deferred.resolve(pageElement);
				} else {
					deferred.reject();
				}
			});

		});
	});
}());