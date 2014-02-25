/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class ns.router.micro.history
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../micro",
			"../../utils/object"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var historyVolatileMode,
				object = ns.utils.object,
				historyUid = 0,
				historyActiveIndex = 0,
				windowHistory = window.history,
				history = {
					/**
					 * Active state in history
					 * @property {Object} activeState
					 * @public
					 * @static
					 * @memberOf ns.router.micro.history
					 */
					activeState : null,

					/**
					 * Replace or push to history
					 * @param {Object} state
					 * @public
					 * @static
					 * @memberOf ns.router.micro.history
					 */
					replace: function (state, pageTitle, url) {
						var newState = object.multiMerge({},
								state,
								{
							uid: historyVolatileMode ? historyActiveIndex : ++historyUid
						});
						windowHistory[historyVolatileMode ? "replaceState" : "pushState"](newState, pageTitle, url);
						history.setActive(newState);
					},

					back: function () {
						windowHistory.back();
					},

					setActive: function (state) {
						if (state) {
							history.activeState = state;
							historyActiveIndex = state.uid;

							if (state.volatileRecord) {
								history.enableVolatileRecord();
								return;
							}
						}

						history.disableVolatileMode();
					},

					getDirection: function (state) {
						if (state) {
							return state.uid < historyActiveIndex ? "back" : "forward";
						}
						return "back";
					},

					enableVolatileRecord: function () {
						historyVolatileMode = true;
					},

					disableVolatileMode: function () {
						historyVolatileMode = false;
					}
				};
			ns.router.micro.history = history;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.ej));
