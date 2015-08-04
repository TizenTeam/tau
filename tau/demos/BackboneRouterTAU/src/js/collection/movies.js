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

		// Filter down the list to only movie items that are still not finished.
		remaining: function () {
			console.log("movies.remaining");
			return this.where({completed: false});
		}

	});

	// Create our global collection of **Movies**.
	app.movies = new Movies();
})();
