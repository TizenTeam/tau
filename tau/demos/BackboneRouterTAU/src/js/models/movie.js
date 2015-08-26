/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Movie Model
	// ----------

	// Our basic **movie** model has `title` and `year` attributes.
	app.Movie = Backbone.Model.extend({
		// Default attributes for the movie
		defaults: {
			id: -1,
			name: '',
			year: 0
		}
	});
})();
