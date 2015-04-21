/*global window */
/*jslint browser: true, nomen: true */
(function (window, Ember, DS, dom, data) {
	"use strict";
	var App = Ember.Application.create();
	App.Store = DS.Store.extend({});

	App.IndexView = Ember.View.extend({
		classNames: "ui-page"
	});

	App.ListItemView = Ember.View.extend({
		tagName: "",
		templateName: "listItem"
	});

	App.ListViewView = Ember.CollectionView.extend({
		content: data,
		tagName: "",
		itemViewClass: App.ListItemView,
		didInsertElement: function () {
			this._super();
			Ember.run.scheduleOnce("afterRender", this, function () {
				console.timeEnd("listview");
			});
		}
	});

	App.IndexRoute = Ember.Route.extend({
		setupController: function (controller, model) {
			this._super(controller, model);
			controller.set("title", "NBA Players");
		},
		actions: {
			doIt: function () {
				console.time("listview");
				this.send("renderTitle");
				this.send("renderListview");
			},

			renderListview: function () {
				this.render("list", {into: "index", outlet: "listviewHolder"});
			},

			renderTitle: function () {
				this.render("indexTitle", {into: "index", outlet: "titleHolder"});
			}
		}
	});
}(window, window.Ember, window.DS, window.document, window.JSON_DATA));
