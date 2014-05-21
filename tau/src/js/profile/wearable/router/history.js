/*global window, define */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
*
* Licensed under the Flora License, Version 1.1 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://floralicense.org/license/
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
 * #History
 * Object controls history changes.
 * @class ns.router.history
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/router",
			"../../../core/util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var historyVolatileMode,
				object = ns.util.object,
				historyUid = 0,
				historyActiveIndex = 0,
				windowHistory = window.history,
				history = {
					/**
					 * Property contains active state in history.
					 * @property {Object} activeState
					 * @static
					 * @member ns.router.history
					 */
					activeState : null,

					/**
					 * Replace or push to history.
					 * @method replace
					 * @param {Object} state
					 * @param {string} pageTitle
					 * @param {string} url
					 * @static
					 * @member ns.router.history
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
					 * @member ns.router.history
					 */
					back: function () {
						windowHistory.back();
					},

					/**
					 * Set active state.
					 * @method setActive
					 * @param {Object} state
					 * @static
					 * @member ns.router.history
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
					 * @member ns.router.history
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
					 * @member ns.router.history
					 */
					enableVolatileRecord: function () {
						historyVolatileMode = true;
					},

					/**
					 * Set volatile mode to true.
					 * @method disableVolatileMode
					 * @static
					 * @member ns.router.history
					 */
					disableVolatileMode: function () {
						historyVolatileMode = false;
					}
				};
			ns.router.history = history;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
