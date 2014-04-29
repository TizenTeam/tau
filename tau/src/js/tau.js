/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Tizen Advanced UI Framework main namespace
 * @class tau
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var orgTau,
				tau = {
					/**
					 * revert changes in gear namespace make by framework and return framework object
					 * @method noConflict
					 * @return {Object}
					 * @member tau
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
					 * @member tau
					 */
					getOrginalNamespace: function () {
						return orgTau;
					},
					/**
					 * Create new window.gear object;
					 * @method createNewNamespace
					 * @member tau
					 */
					createNewNamespace: function() {
						orgTau = orgTau || window.tau;
						window.tau = tau;
					}
				};
				tau.createNewNamespace();
				document.addEventListener(orgTau.engine.eventType.INIT, tau.createNewNamespace, false);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return tau;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, document));
