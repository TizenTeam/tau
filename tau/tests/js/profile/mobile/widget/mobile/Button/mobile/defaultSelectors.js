/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("button", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isButton(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Button')), "Button was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Button", "Button widget bound: " + selector);
	}

	test( "Button default selectors" , function () {
		isButton(document.getElementById('button-data-role'), '[data-role="button"]');
		isButton(document.getElementById('button-button'), 'button');
		isButton(document.getElementById('button-type-button'), '[type="button"]');
		isButton(document.getElementById('button-type-submit'), '[type="submit"]');
		isButton(document.getElementById('button-type-reset'), '[type="reset"]');
		isButton(document.getElementById('button-class-selector'), '.ui-button');
		isButton(document.getElementById('link-button'), '.ui-button');
	});

}(window.document));