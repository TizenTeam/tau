/*global window, define, ns */
/*jslint browser: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Controller
 * Class used for routing in arbitrary paths
 *
 * @class ns.Controller
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./engine",
			"./event",
			"./util/path",
			"./util/pathToRegexp",
			"./util/object",
			"./history",
			"./history/manager"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var eventUtils = ns.event,
				pathToRegexp = ns.util.pathToRegexp,
				history = ns.history,
				object = ns.util.object,
				historyManager = ns.history.manager,
				historyManagerEvents = historyManager.events,
				EVENT_PATH_RESOLVED = "controller-path-resolved",
				EVENT_PATH_REJECTED = "controller-path-rejected",
				EVENT_CONTENT_AVAILABLE = "controller-content-available",
				Controller = function () {
					var self = this;

					self.routes = [];
					self.onStateChange = null;
					self.currentRoute = null;
				},
				controllerInstance = null,
				proto = Controller.prototype;

			Controller.events = {
				PATH_RESOLVED: EVENT_PATH_RESOLVED,
				PATH_REJECTED: EVENT_PATH_REJECTED,
				CONTENT_AVAILABLE: EVENT_CONTENT_AVAILABLE
			};

			/**
			 * Iterates through routes, tries to find matching and executes it
			 * @param {ns.Controller} controller
			 * @param {Array} routes
			 * @param {string} path
			 * @param {object} deferred
			 * @param {object} options
			 * @return {boolean}
			 * @member ns.Controller
			 * @static
			 * @private
			 */
			function loadRouteFromList(controller, routes, path, deferred, options) {
				return routes.some(function (route) {
					var matches = route.regexp.exec(path),
						deferredTemplate = {},
						params = [];
					if (matches && matches.length > 0 && controller.currentRoute !== route) {
						deferredTemplate.resolve = function (content) {
							if (content) {
								options.fromHashChange = true;
								eventUtils.trigger(document, EVENT_CONTENT_AVAILABLE, {content: content, options: options});
							}
							deferred.resolve(options, content);
							controller.currentRoute = route;
							return true;
						};
						deferredTemplate.reject = function () {
							deferred.reject();
						};

						params = matches.splice(1);
						params.unshift(deferredTemplate);
						route.callback.apply(null, params);

						return true;
					}

					return false;
				});
			}

			function onHistoryStateChange(controller, event) {
				var options = event.detail,
					url = options.url || options.href || "",
					deferred = {},
					state = {};

				if (options.rel === "back") {
					history.back();
					eventUtils.preventDefault(event);
					eventUtils.stopImmediatePropagation(event);
					return;
				}

				deferred.resolve = function (options) {
					// change URL
					if (!options.fromHashChange) {
						// insert to history only if not from hashchange event
						// hash change event has own history item
						state = object.merge(
							{},
							options,
							{
								url: url
							}
						);
						history.replace(state, options.title || "", url);
					}
					eventUtils.trigger(document, EVENT_PATH_RESOLVED, options);
				};

				deferred.reject = function (options) {
					eventUtils.trigger(document, EVENT_PATH_REJECTED, options);
				};

				if (loadRouteFromList(controller, controller.routes, url.replace(/^[^#]*#/i, ""), deferred, options)) {
					eventUtils.preventDefault(event);
					eventUtils.stopImmediatePropagation(event);
				}
			}

			/**
			 * Change page to page given in parameter "to".
			 * @param {string} to new hash
			 * @member ns.Controller
			 * @method open
			 */
			proto.open = function (to) {
				//the following method has a problem with history back, if there is no router then
				//window.history.replaceState is used but history.back doesn't work properly
				location.hash = "#" + to;
			};

			/**
			 * Back to previous controller state
			 * @member ns.Controller
			 * @method back
			 */
			proto.back = function () {
				history.back();
			};

			/**
			 * Ads route to routing table
			 * @param {string} path
			 * @param {Function} callback
			 * @member ns.Controller
			 * @method addRoute
			 */
			proto.addRoute = function (path, callback) {
				var self = this,
					routes = self.routes,
					pathExists = routes.some(function (value) {
						return value.path === path;
					}),
					route = null;
				if (!pathExists) {
					route = {
						path: path,
						callback: callback,
						regexp: null,
						keys: []
					};
					route.regexp = pathToRegexp(path, route.keys);
					routes.push(route);
				}
			};

			/**
			 * Removes route from routing table
			 * @param {string} path
			 * @member ns.Controller
			 * @method removeRoute
			 */
			proto.removeRoute = function (path) {
				this.routes = this.routes.filter(function (value) {
					return value.path !== path;
				});
			};

			proto.init = function () {
				var self = this;

				// check existing of event listener
				if (!self.onStateChange) {
					self.onStateChange = onHistoryStateChange.bind(null, self);
					window.addEventListener(historyManagerEvents.STATECHANGE, self.onStateChange, true);
				}
			};

			proto.destroy = function () {
				var self = this;
				window.removeEventListener(historyManagerEvents.STATECHANGE, self.onStateChange, true);
				// destroy callback to give possibility to another init
				self.onStateChange = null;
			};

			Controller.newInstance = function () {
				if (controllerInstance) {
					controllerInstance.destroy();
				}
				return (controllerInstance = new Controller());
			};

			Controller.getInstance = function () {
				return controllerInstance || this.newInstance();
			};

			if (!ns.getConfig("disableController", false)) {
				document.addEventListener(historyManagerEvents.ENABLED, function () {
					Controller.getInstance().init();
				});

				document.addEventListener(historyManagerEvents.DISABLED, function () {
					Controller.getInstance().destroy();
				});
			}

			ns.Controller = Controller;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Controller;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document));
