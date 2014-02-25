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
			var orgGear,
				ui = {
					/**
					 * revert changes in gear namespace make by framework and return framework object
					 * @method noConflict
					 * @return {Object}
					 * @memberOf gear.ui
					 */
					noConflict: function () {
						var newGear = window.gear;
						window.gear = orgGear;
						orgGear = null;
						return newGear;
					},
					/**
					 * Return original window.gear object;
					 * @method getOrginalGear
					 * @return {Object}
					 * @memberOf gear.ui
					 */
					getOrginalGear: function () {
						return orgGear;
					},
					/**
					 * Create new window.gear object;
					 * @method createNewNamespace
					 * @return {Object}
					 * @memberOf gear.ui
					 */
					createNewNamespace: function() {
						var orgGear = orgGear || window.gear,
							gear = {
								ui: ui,
								noConflict: ui.noConflict.bind(ui)
							};
						window.gear = gear;
					}
				};
				ui.createNewNamespace();
				//document.addEventListener('initengine', ui.createNewNamespace, false);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ui;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, document));
