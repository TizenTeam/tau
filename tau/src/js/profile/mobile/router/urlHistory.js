/*global define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #URL History Support For Router
 * Class manages history of changing pages in application.
 * @class ns.router.urlHistory
 * @singleton
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/router" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var urlHistory = {
				/**
				 * History stack
				 * @property {Array.<object>} stack
				 * @readonly
				 * @member ns.router.urlHistory
				 * @member ns.router.urlHistorydirect
				 */
				stack: [],
				/**
				 * Current active index in the history stack
				 * @property {number} [activeIndex=0]
				 * @readonly
				 * @member ns.router.urlHistory
				 */
				activeIndex: 0,
				/**
				 * Returns current active history element
				 * @return {object}
				 * @method getActive
				 * @member ns.router.urlHistory
				 */
				getActive: function () {
					return urlHistory.stack[urlHistory.activeIndex];
				},
				/**
				 * Returns previous history element
				 * @return {object}
				 * @method getPrev
				 * @member ns.router.urlHistory
				 */
				getPrev: function () {
					return urlHistory.stack[urlHistory.activeIndex - 1];
				},
				/**
				 * Returns next history element
				 * @return {object}
				 * @method getNext
				 * @member ns.router.urlHistory
				 */
				getNext: function () {
					return urlHistory.stack[urlHistory.activeIndex + 1];
				},
				/**
				 * Add new history element to stack
				 * @param {string} url
				 * @param {string} transition
				 * @param {string} title
				 * @param {string} pageUrl
				 * @param {string} role
				 * @method addNew
				 * @member ns.router.urlHistory
				 */
				addNew: function (url, transition, title, pageUrl, role) {
					//if there's forward history, wipe it
					if (urlHistory.getNext()) {
						urlHistory.clearForward();
					}

					urlHistory.stack.push({
						url : url,
						transition: transition,
						title: title,
						pageUrl: pageUrl,
						role: role
					});

					urlHistory.activeIndex = urlHistory.stack.length - 1;
				},
				/**
				 * Wipe all history elements ahead of active element
				 * @method clearForward
				 * @member ns.router.urlHistory
				 */
				clearForward: function () {
					urlHistory.stack = urlHistory.stack.slice(0, urlHistory.activeIndex + 1);
				},
				/**
				 * Changes hash in history.
				 * @param {Object} options
				 * @method directHashChange
				 * @member ns.router.urlHistory
				 */
				directHashChange: function (options) {
					var back,
						forward,
						newActiveIndex;

					// check if url is in history and if it's ahead or behind current page
					urlHistory.stack.forEach(function (historyEntry, index) {
						//if the url is in the stack, it's a forward or a back
						if (decodeURIComponent(options.currentUrl) === decodeURIComponent(historyEntry.url)) {
							//define back and forward by whether url is older or newer than current page
							back = index < urlHistory.activeIndex;
							forward = !back;
							newActiveIndex = index;
						}
					});

					// save new page index, null check to prevent false or 0 result
					this.activeIndex = newActiveIndex || this.activeIndex;

					if (back) {
						(options.either || options.isBack)(true);
					} else if (forward) {
						(options.either || options.isForward)(false);
					}
				},
				//disable hashchange event listener internally to ignore one change
				//toggled internally when location.hash is updated to match the url of a successful page load
				ignoreNextHashChange: false
			};

			ns.router.urlHistory = urlHistory;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.router.urlHistory;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
