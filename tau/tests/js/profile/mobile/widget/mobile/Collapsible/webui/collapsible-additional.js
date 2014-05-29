/*
 * collapse unit tests
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
(function ($) {
	"use strict";

	module("collapse test");

	var unit_collapse = function (widget) {
		var created_collapse = widget.collapsible(),
			obj_collapse = created_collapse.data("collapsible");

		ok(created_collapse, "Create");

		/*Markup check*/
		equal(widget.hasClass('ui-collapsible'), true, "Markup check");

		/* Check Option */
		equal(obj_collapse.options.expandCueText, " Expandable list, tap to open list", "Collapsed test -> expandCueText");
		equal(obj_collapse.options.collapseCueText, " Expandable list, tap to close list", "Collapsed test -> collapseCueText");
		equal(obj_collapse.options.collapsed, true, "Collapsed test -> collapsed");
		equal(obj_collapse.options.heading, "h1,h2,h3,h4,h5,h6,legend,li", "Collapsed test -> heading");
		equal(obj_collapse.options.theme, 's', "Collapsed test -> theme");
		equal(obj_collapse.options.contentTheme, null, "Collapsed test -> contentTheme");

		/* Check event */
		created_collapse.trigger("collpase");
		equal(created_collapse.hasClass("ui-collapsible-collapsed"), true, "API test -> collapse");

		created_collapse.trigger("expand");
		equal(created_collapse.hasClass("ui-collapsible-collapsed"), false, "API test -> expand");
	};

	test("collapse test", function () {
		unit_collapse($("#collapsedContent"));
	});
}(jQuery));
