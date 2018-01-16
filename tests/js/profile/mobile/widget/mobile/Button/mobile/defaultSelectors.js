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

	function isButton(element, selector, valid) {
		if (valid) {
			ok(!!(tau.engine.getBinding(element, 'Button')), "Button was created by selector: " + selector);
			equal(element.getAttribute('data-tau-bound'), "Button", "Button widget bound: " + selector);
		} else {
			equal(!!(tau.engine.getBinding(element, 'Button')), false, "Button was created by selector: " + selector);
			notEqual(element.getAttribute('data-tau-bound'), "Button", "Button widget bound: " + selector);
		}
	}

	test( "Button default selectors" , function () {
		isButton(document.getElementById('button-data-role'), '[data-role="button"]', true);
		isButton(document.getElementById('button-button'), 'button', true);
		isButton(document.getElementById('button-type-button'), '[type="button"]', true);
		isButton(document.getElementById('button-type-submit'), '[type="submit"]', false);
		isButton(document.getElementById('button-type-reset'), '[type="reset"]', false);
		isButton(document.getElementById('button-class-selector'), '.ui-btn', true);
		isButton(document.getElementById('link-button'), '.ui-btn', true);
	});

}(window.document));