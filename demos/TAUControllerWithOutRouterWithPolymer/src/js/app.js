/* global tau, movieList, tizen */

(function () {
    "use strict";
    window.movieList = [];
    var mainPage = document.getElementById("main"),
        detailsPage = document.getElementById("details"),
        goBack = function (event) {
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
        };

    window.addEventListener("tizenhwkey", goBack);
    document.getElementById("my-button").addEventListener("click", function () {
        window.history.back()
    });
    document.addEventListener("DOMContentLoaded", function () {
        var controller = tau.Controller.getInstance();

        controller.addRoute("main", function (deferred) {
            // show page
            mainPage.classList.remove("hidden");

            // hide details page
            detailsPage.classList.add("hidden");

            // inform controller that everything is ok
            deferred.resolve(mainPage);


        });
        controller.addRoute("details/:id", function (deferred, id) {
            var movieData = window.movieList[id];

            // fill content
            detailsPage.querySelector("div").textContent = "Movie \"" + movieData.name + "\" was produced in " + movieData.year + ".";

            // hide main page
            mainPage.classList.add("hidden");

            // show detaild page
            detailsPage.classList.remove("hidden");

            // inform controller that everything is ok
            deferred.resolve(detailsPage);
        });
        controller.open("main");
    });
}());
