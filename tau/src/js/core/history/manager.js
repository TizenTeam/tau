/*global window, define, ns */
/*jslint browser: true, nomen: true */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../engine",
			"../event",
			"../history",
			"../event/vmouse",
			"../util",
			"../util/selectors",
			"../util/DOM",
			"../util/DOM/attributes",
			"../util/object",
			"../util/path"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var manager = Object.create(null), // we don't need the Object proto
				WINDOW_EVENT_POPSTATE = "popstate",
				WINDOW_EVENT_HASHCHANGE = "hashchange",
				DOC_EVENT_VCLICK = "vclick",
				LINK_SELECTOR = "a",
				util = ns.util,
				history = ns.history,
				eventUtils = ns.event,
				selectorUtils = util.selectors,
				objectUtils = util.object,
				pathUtils = util.path,
				DOM = util.DOM,
				EVENT_STATECHANGE = "historystatechange",
				EVENT_HASHCHANGE = "historyhashchange",
				EVENT_ENABLED = "historyenabled",
				EVENT_DISABLED = "historydisabled",
				events = {
					STATECHANGE: EVENT_STATECHANGE,
					HASHCHANGE: EVENT_HASHCHANGE,
					ENABLED: EVENT_ENABLED,
					DISABLED: EVENT_DISABLED
				};

			manager.events = events;

			function triggerStateChange(options) {
				return eventUtils.trigger(document, EVENT_STATECHANGE, options, true, true);
			}

			function onLinkAction(event) {
				var link = selectorUtils.getClosestByTag(event.target, LINK_SELECTOR),
					href = null,
					useDefaultUrlHandling = false,
					options = {}, // this should be empty object but some utils that work on it
					rel = null;   // require hasOwnProperty :(

				if (link && event.which === 1) {
					href = link.getAttribute("href");
					rel = link.getAttribute("rel");
					useDefaultUrlHandling = rel === "external" || link.hasAttribute("target");
					if (!useDefaultUrlHandling) {
						options = DOM.getData(link);
						if (rel && !options.rel) {
							options.rel = rel;
						}
						if (href && !options.href) {
							options.href = href;
						}
						if (!triggerStateChange(options)) {
							// mark as handled
							// but not on back
							if (!rel || (rel && rel !== "back")) {
								eventUtils.preventDefault(event);
								return false;
							}
						}
					}
				}
				return true;
			}

			function onPopState(event) {
				var state = event.state,
					lastState = history.activeState,
					options = {},
					reverse = false,
					continuation = true;
				if (manager.locked) {
					history.disableVolatileMode();
					if (lastState) {
						history.replace(lastState, lastState.stateTitle, lastState.stateUrl);
					}
				} else if (state) {
					reverse = history.getDirection(state) === "back";
					options = objectUtils.merge(options, state, {
						reverse: reverse,
						transition: reverse ? ((lastState && lastState.transition) || "none") : state.transition,
						fromHashChange: true
					});

					if (lastState && !eventUtils.trigger(document, EVENT_HASHCHANGE, objectUtils.merge(options,
							{url: pathUtils.getLocation(), stateUrl: lastState.stateUrl}), true, true)) {
						continuation = false;
					}

					history.setActive(state);
					if (continuation) {
						triggerStateChange(options);
					}
				}
			}

			function onHashChange(event) {
				var newURL = event.newURL;
				if (newURL) {
					triggerStateChange({href: newURL, fromHashChange: true});
				}
			}

			manager.enabled = true;
			manager.locked = false;

			manager.lock = function () {
				this.locked = true;
			};

			manager.unlock = function () {
				this.locked = false;
			};

			manager.enable = function () {
				document.addEventListener(DOC_EVENT_VCLICK, onLinkAction, false);
				window.addEventListener(WINDOW_EVENT_POPSTATE, onPopState, false);
				window.addEventListener(WINDOW_EVENT_HASHCHANGE, onHashChange, false);
				history.enableVolatileMode();
				this.enabled = true;
				eventUtils.trigger(document, EVENT_ENABLED, this);
			};

			manager.disable = function () {
				document.removeEventListener(DOC_EVENT_VCLICK, onLinkAction, false);
				window.removeEventListener(WINDOW_EVENT_POPSTATE, onPopState, false);
				window.removeEventListener(WINDOW_EVENT_HASHCHANGE, onHashChange, false);
				history.disableVolatileMode();
				this.enabled = false;
				eventUtils.trigger(document, EVENT_DISABLED, this);
			};

			ns.history.manager = manager;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return manager;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
