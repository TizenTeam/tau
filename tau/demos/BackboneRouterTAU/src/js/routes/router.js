/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Two pages Router
	// ----------
	var mainPage = document.getElementById("main"),
		detailsPage = document.getElementById("details"),

		MovieRouter = Backbone.Router.extend({
			routes: {
				"details/:id": "detailsAction",
				"sort/:order": "sortAction",
				"*actions": "mainAction"
			},

			mainAction: function () {
				console.log("router.mainAction");

				// tau change page
				tau.widget.pagecontainer(document.body)
					.change(mainPage);
			},

			detailsAction: function (id) {
				console.log("router.detailsAction", this);

				app.details.render(id);

				// tau change page
				tau.widget.pagecontainer(document.body)
					.change(detailsPage);
			},

			sortAction: function (order) {
				console.log("router.sortAction");

				app.movies.setOrder(order);
				app.movies.sort();

				// drawer close;
				tau.widget.Drawer(document.getElementById('leftdrawer'))
					.close();


				app.router.navigate("#", true);
			}
		});

	app.router = new MovieRouter();
	Backbone.history.start();
})();