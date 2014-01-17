/*global window, define */
/** @namespace ej.router */
(function (ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../micro",
			"../../utils/object"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			/** @namespace ej.router */
			var historyVolatileMode,
				object = ej.utils.object,
				historyUid = 0,
				historyActiveIndex = 0,
				history = {
					activeState : null,
					replace: function (state, pageTitle, url) {
						var newState = object.multiMerge({},
								state,
								{
							uid: historyVolatileMode ? historyActiveIndex : ++historyUid
						});
						window.history[historyVolatileMode ? "replaceState" : "pushState"](newState, pageTitle, url);
						history.setActive(newState);
					},

					back: function () {
						window.history.back();
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
			ej.router.micro.history = history;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ej.router.micro.route;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.ej));
