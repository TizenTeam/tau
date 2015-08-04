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
				'': 'mainAction',
				'details/:id': 'detailsAction'
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
			}
		});

	app.router = new MovieRouter();
	Backbone.history.start();
})();