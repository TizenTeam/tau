/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class gear.ui
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var orgTau,
				tau = {
					/**
					 * revert changes in gear namespace make by framework and return framework object
					 * @method noConflict
					 * @return {Object}
					 * @memberOf gear.ui
					 */
					noConflict: function () {
						var newTau = window.tau;
						window.tau = orgTau;
						orgTau = null;
						return newTau;
					},
					/**
					 * Return original window.gear object;
					 * @method getOrginalNamespace
					 * @return {Object}
					 * @memberOf gear.ui
					 */
					getOrginalNamespace: function () {
						return orgTau;
					},
					/**
					 * Create new window.gear object;
					 * @method createNewNamespace
					 * @memberOf gear.ui
					 */
					createNewNamespace: function() {
						orgTau = orgTau || window.tau;
						window.tau = tau;
					}
				};
				tau.createNewNamespace();
				document.addEventListener('mobileinit', tau.createNewNamespace, false);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return tau;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, document));
