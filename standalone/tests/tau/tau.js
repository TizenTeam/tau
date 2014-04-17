/*global module, equal, test */
(function() {
	'use strict';
	document.addEventListener('DOMContentLoaded', function() {
		module("tau");

		test ( "tau.noConflict" , function () {
			var tau = window.tau,
				tauNoConflict = null;
			equal(window.tau.v, undefined, 'object tau was changed');
			tauNoConflict = window.tau.noConflict();
			equal(window.tau.v, 'old', 'object tau was restored');
			equal(tau, tauNoConflict, 'object noConflict return new tau object');
		});
	});
}());