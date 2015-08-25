/*global requirejs, define, require, window, console */
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
		"DOM",
		"HelloModel"
	],
	function (Handlebars, DOM, HelloModel) {
		"use strict";
		var model = new HelloModel(),
			templateSource = DOM.getElementById("hello"),
			helloTemplate = Handlebars.compile(templateSource.innerHTML),
			container = DOM.body;

		model.setFrameworkName("VanillaJS");

		container.innerHTML = helloTemplate(model.getData());
	}
);
