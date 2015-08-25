/*global window */
/*jslint browser: true */
(function (window, Ember) {
	"use strict";
	var App = Ember.Application.create();
	App.IndexRoute = Ember.Route.extend({
		setupController: function (controller) {
			controller.set("framework", "Ember");
		}
	});
}(window, window.Ember));
