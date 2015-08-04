/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#main',

		// Our template for the line of statistics at the bottom of the app.
		moviesTemplate: _.template($('#movies-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'tizenhwkey #main': 'onHWKey'
		},

		// At initialization we bind to the relevant events on the `movies`
		// collection, when items are added or changed.
		initialize: function () {
			console.log("main-view.initialize");

			document.documentElement.classList.add("ui-mobile");
			this.pageContainer = tau.widget.pagecontainer(document.body);

			this.page = tau.widget.page(document.getElementById("main"));
			this.list = tau.widget.Listview(document.getElementById("list"));

			// listen on app.movies collection events
			this.listenTo(app.movies, 'all', this.render);

			// Suppresses 'add' events with {reset: true} and prevents the app view
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app.movies.fetch({reset: true});
		},

		render: function () {
			console.log("app-view.render");

			if (app.movies.length > 0) {
				document.getElementById("list").innerHTML = this.moviesTemplate({
					movies: app.movies.toJSON()
				});
			}

			this.page.refresh();
			this.list.refresh();
		},

		onHWKey: function (event) {
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
		}

	});
})(jQuery);
