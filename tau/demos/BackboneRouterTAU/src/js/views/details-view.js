/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The details page
	// ---------------

	// Our overall **DetailsView** is the top-level piece of UI.
	app.DetailsView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#details',

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			"vclick #show-profit": "showProfit",
			"vclick #profit-popup-close": "closeProfit",
		},

		// Our template for the line of statistics at the bottom of the app.
		detailsTemplate: _.template($('#details-template').html()),

		initialize: function () {
			console.log("details-view.initialize");
			this.pageContainer = tau.widget.pagecontainer(document.body);
			this.page = tau.widget.page(document.getElementById("details"));
		},

		render: function (id) {
			console.log("details.render", id);
			var details = document.getElementById("details-content"),
				movie;

			this.selectedId = id;
			if (id < app.movies.length) {
				movie = app.movies.at(id).toJSON();
				details.innerHTML =
					this.detailsTemplate(
						tau.util.object.merge(movie)
					);
			}
			this.page.refresh();
		},

		showProfit: function (event) {
			console.log("details-view.showProfit");

			document.getElementById("profit").textContent =
				app.movies.at(this.selectedId).get("profit")
					.toString()
					// format number
					.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

			tau.widget.Popup(document.getElementById("profit-popup")).open();
		},

		closeProfit: function (event) {
			console.log("details-view.closeProfit");
			tau.widget.Popup(document.getElementById("profit-popup")).close();
		}

	});
	app.details = new app.DetailsView();
})(jQuery);
