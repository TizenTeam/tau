/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("Searchbar", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isSearchbar(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'SearchBar')), "Searchbar was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "SearchBar", "Searchbar widget bound: " + selector);
	}
	test( "Searchbar default selectors" , function () {
		isSearchbar(document.getElementById('input-by-type'), 'input[type="search"]');
		isSearchbar(document.getElementById('by-data-type-search'), '[data-type="search"]');
		isSearchbar(document.getElementById('by-data-type-tizen-search'), '[data-type="tizen-search"]');
		isSearchbar(document.getElementById('by-class-selector'), '.ui-searchbar');
	});

}(window.document));