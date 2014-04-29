/*global window, define */
/**
 * @class ns.router.urlHistory
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../router", // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var urlHistory = {
				stack: [],
				activeIndex: 0,
				getActive: function() {
					return urlHistory.stack[urlHistory.activeIndex];
				},
				getPrev: function() {
					return urlHistory.stack[urlHistory.activeIndex - 1];
				},
				getNext: function() {
					return urlHistory.stack[urlHistory.activeIndex + 1];
				},
				// addNew is used whenever a new page is added
				addNew: function( url, transition, title, pageUrl, role ) {
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
				//wipe urls ahead of active index
				clearForward: function() {
					urlHistory.stack = urlHistory.stack.slice(0, urlHistory.activeIndex + 1);
				},
				directHashChange: function( options ) {
					var back,
						forward,
						newActiveIndex;

					// check if url is in history and if it's ahead or behind current page
					urlHistory.stack.forEach(function(historyEntry, index) {
						//if the url is in the stack, it's a forward or a back
						if (decodeURIComponent(options.currentUrl) === decodeURIComponent(historyEntry.url)) {
							//define back and forward by whether url is older or newer than current page
							back = index < urlHistory.activeIndex;
							forward = !back;
							newActiveIndex = index;
						}
					});

					// save new page index, null check to prevent falsey 0 result
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
}(window, window.document, ns));