/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Movies Collection
	// ---------------

	var Movies = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.Movie,

		url: 'js/data.json',

		filter: function (year) {
			console.log("movies.remaining");
			return this.where({"year": year});
		},

		setOrder: function(order) {
			switch (order) {
				case 'year' : this.comparator = 'year';
					break;
				case 'name' : this.comparator = 'name';
					break;
				default: this.comparator = 'id';
			}
		},

		comparator: 'order'
	});

	// Create our global collection of **Movies**.
	app.movies = new Movies();
})();
