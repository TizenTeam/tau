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

			if (id < app.movies.length) {
				movie = app.movies.at(id).toJSON();
				details.innerHTML =
					this.detailsTemplate(
						tau.util.object.merge(movie)
					);
			}
		}

	});
	app.details = new app.DetailsView();
})(jQuery);
