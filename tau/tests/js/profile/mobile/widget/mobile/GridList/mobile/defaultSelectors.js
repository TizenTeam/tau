/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("GridList", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isGridList(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'GridList')), "GridList was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "GridList", "GridList widget bound: " + selector);
	}
	function isNotGridList(element, selector) {
		ok(!(tau.engine.getBinding(element, 'GridList')), "GridList wasn't created by selector: " + selector);
		notEqual(element.getAttribute('data-tau-bound'), "GridList", "GridList widget wasn't bound: " + selector);
	}
	test("GridList default selectors" , function () {
		isGridList(document.getElementById('gridlist'), "ul.ui-gridlist");
		isGridList(document.getElementById('gridlist2'), "ul[data-role='gridlist']");
		isNotGridList(document.getElementById('olgridlist'), "ol.ui-gridlist");
		isNotGridList(document.getElementById('olgridlist2'), "ol[data-role='gridlist']");
	});
}(window.document));