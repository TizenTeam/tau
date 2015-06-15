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
(function (ns, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./engine",
			"./event",
			"./util/path",
			"./util/pathToRegexp",
			"./history",
			"./history/manager"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				eventUtils = ns.event,
				pathUtils = ns.util.path,
				pathToRegexp = ns.util.pathToRegexp,
				history = ns.history,
				historyManager = ns.history.manager,
				historyManagerEvents = historyManager.events,
				EVENT_PATH_RESOLVED = "controller-path-resolved",
				EVENT_PATH_REJECTED = "controller-path-rejected",
				EVENT_CONTENT_AVAILABLE = "controller-content-available",
				Controller = function () {
					var self = this;

					self.routes = [];
					self.onStateChange = null;
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
					if (matches && matches.length > 0) {
						deferredTemplate.resolve = function (content) {
							if (content) {
								eventUtils.trigger(document, EVENT_CONTENT_AVAILABLE, content);
							}
							deferred.resolve(options, content);
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
					deferred = {};

				if (options.rel === "back") {
					history.back();
					eventUtils.preventDefault(event);
					eventUtils.stopImmediatePropagation(event);
					return;
				}

				deferred.resolve = function (options) {
					eventUtils.trigger(document, EVENT_PATH_RESOLVED, options);
					eventUtils.preventDefault(event);
					eventUtils.stopImmediatePropagation(event);
				};

				deferred.reject = function (options) {
					eventUtils.trigger(document, EVENT_PATH_REJECTED, options);
				};

				loadRouteFromList(controller, controller.routes, url.replace(/^[^#]*#/i, ""), deferred, options)
			}

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
				self.onStateChange = onHistoryStateChange.bind(null, self);

				window.addEventListener(historyManagerEvents.STATECHANGE, self.onStateChange, true);
			};

			proto.destroy = function () {
				var self = this;
				window.removeEventListener(historyManagerEvents.STATECHANGE, self.onStateChange, true);
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
}(ns, window.document));
