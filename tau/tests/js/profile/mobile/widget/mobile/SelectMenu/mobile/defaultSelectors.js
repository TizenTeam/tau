/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("selectmenu", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isSelectMenu(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'SelectMenu')), "SelectMenu was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "SelectMenu", "SelectMenu widget bound: " + selector);
	}
	function isNotSelectMenu(element, selector) {
		ok(!(tau.engine.getBinding(element, 'SelectMenu')), "SelectMenu wasn't created by selector: " + selector);
		notEqual(element.getAttribute('data-tau-bound'), "SelectMenu", "SelectMenu widget wasn't bound: " + selector);
	}
	test("SelectMenu default selectors" , function () {
		isSelectMenu(document.getElementById('select'), "select:not([data-role='slider']):not([data-role='range'])");
		isNotSelectMenu(document.getElementById('select-slider'), "select:not([data-role='slider']):not([data-role='range'])");
		isNotSelectMenu(document.getElementById('select-range'), "select:not([data-role='slider']):not([data-role='range'])");
		isSelectMenu(document.getElementById('by-css-selector'), "select.ui-select-menu");
		isNotSelectMenu(document.getElementById('element-by-css-selector'), "*.ui-select-menu:not([data-role='slider']):not([data-role='range'])");
	});
}(window.document));