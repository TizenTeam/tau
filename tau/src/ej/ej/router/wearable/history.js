/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #History
 * Object controls history changes.
 * @class ns.widget.wearable.history
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../wearable",
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
					 * Property contains active state in history.
					 * @property {Object} activeState
					 * @static
					 * @memberOf ns.widget.wearable.history
					 */
					activeState : null,

					/**
					 * Replace or push to history.
					 * @method replace
					 * @param {Object} state
					 * @param {string} pageTitle
					 * @param {string} url
					 * @static
					 * @memberOf ns.widget.wearable.history
					 */
					replace: function (state, pageTitle, url) {
						var newState = object.merge({},
								state,
								{
							uid: historyVolatileMode ? historyActiveIndex : ++historyUid
						});
						windowHistory[historyVolatileMode ? "replaceState" : "pushState"](newState, pageTitle, url);
						history.setActive(newState);
					},

					/**
					 * Back in history.
					 * @method back
					 * @static
					 * @memberOf ns.widget.wearable.history
					 */
					back: function () {
						windowHistory.back();
					},

					/**
					 * Set active state.
					 * @method setActive
					 * @param {Object} state
					 * @static
					 * @memberOf ns.widget.wearable.history
					 */
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

					/**
					 * Return "back" if state is in history or "forward" if it is new state.
					 * @method getDirection
					 * @param {Object} state
					 * @return {string}
					 * @static
					 * @memberOf ns.widget.wearable.history
					 */
					getDirection: function (state) {
						if (state) {
							return state.uid < historyActiveIndex ? "back" : "forward";
						}
						return "back";
					},

					/**
					 * Set volatile mode to true.
					 * @method enableVolatileRecord
					 * @static
					 * @memberOf ns.widget.wearable.history
					 */
					enableVolatileRecord: function () {
						historyVolatileMode = true;
					},

					/**
					 * Set volatile mode to true.
					 * @method disableVolatileMode
					 * @static
					 * @memberOf ns.widget.wearable.history
					 */
					disableVolatileMode: function () {
						historyVolatileMode = false;
					}
				};
			ns.router.wearable.history = history;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, ns));
