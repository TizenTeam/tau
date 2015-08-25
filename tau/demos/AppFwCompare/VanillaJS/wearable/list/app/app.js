/*global requirejs, define, require, window, console, JSON_DATA, tau */
/*jslint browser: true */
requirejs.config({
	baseUrl: "app/",
	paths: {
		bower: "../bower_components"
	}
});

require(
	[
		"bower/handlebars/handlebars",
		"View",
		"CollectionView",
		"RecordsModel",
		"DOM",
		"virtuallist-db-demo" // DATA
	],
	function (Handlebars, View, CollectionView, RecordsModel, DOM) {
		"use strict";
		var pageView = new View({template: "pageview"}),
			listView = new View({template: "listview"});

		pageView.data.setProp("content", listView.render());

		DOM.body.insertAdjacentHTML('afterbegin', pageView.render());
		DOM.body.addEventListener("pageshow", function () {
			console.time("test");
			DOM.querySelector(".ui-page > footer > button").addEventListener("click", function () {
				var listItemsView = new CollectionView({
						template: "listitemview",
						data: new RecordsModel({records: JSON_DATA})
					}),
					titleView = new View({template: "titleview", data: {title: "NBA Players"}});

				DOM.querySelector(".ui-page > header").innerHTML = titleView.render();
				DOM.querySelector(".ui-page > .ui-content > ul").innerHTML = listItemsView.render();

				console.timeEnd("test");
			});
		});
		tau.engine.run();
	}
);
